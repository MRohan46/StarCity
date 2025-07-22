import axios from 'axios';
import paymentModel from '../models/paymentModel.js';
import { verifyHMAC } from '../utils/verifyWebhook.js';
import userModel from '../models/userModel.js';


const PRODUCTS = [
  { product_id: "product_1", name: "Starter Pack", price: 10, coins: 5000 },
  { product_id: "product_2", name: "Bronze Pack", price: 15, coins: 12000 },
  { product_id: "product_3", name: "Silver Pack", price: 20, coins: 20000 },
  { product_id: "product_4", name: "Gold Pack", price: 30, coins: 40000 },
  { product_id: "product_5", name: "Platinum Pack", price: 35, coins: 90000 },
];

export const createPayment = async (req, res) => {
  const userId = req.userId;
  const { product_id, currency } = req.body;
  
  if (!userId) {
    return res.json({ success: false, message: "UserId missing!" });
  }
  
  const user = await userModel.findById(userId);
  if (!user || !user.isAccountVerified) {
    return res.json({ success: false, message: "User not found or not verified!" });
  }
  const existingPayment = await paymentModel.findOne({
    user_id: userId,
    payment_status: 'waiting'
  });
  if (existingPayment) {
    return res.status(400).json({
      success: false,
      message: 'User already has an active payment'
    });
  }
  if(!product_id || !currency){
    return res.json({succes: false, message: "Please Select a product first!"})
  }
  
  const product = PRODUCTS.find(p => p.product_id === product_id);
  
  if (!product) {
    return res.status(404).json({ error: "Invalid product" });
  }

  const orderId = `orderid_${Math.floor(Math.random() * 1000000)}`;
  const price = product.price;
  const coins = product.coins;

  try {
    const paymentPayload = {
      order_id: orderId || `orderid_${Math.floor(Math.random() * 1000000)}`,
      order_description: "Coins Purchase",
      price_amount: price, // Your amount
      price_currency: "usd", // Like "USDTTRC20", "USDTEOS", etc.
      pay_currency: currency,
      ipn_callback_url: "https://starcity.onrender.com/api/payment/webhook",
    };
      

    const response = await axios.post(
      "https://api.nowpayments.io/v1/payment",
      paymentPayload,
      {
        headers: {
          "x-api-key": process.env.NOWPAYMENTS_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    const payment = response.data;

    const saved = await paymentModel.create({
      user_id: userId,
      payment_id: payment.payment_id,
      pay_address: payment.pay_address,
      price_amount: payment.price_amount,
      price_currency: payment.price_currency,
      payment_status: payment.payment_status,
      pay_amount: payment.pay_amount,
      pay_currency: payment.pay_currency,
      order_id: payment.order_id,
      purchase_id: payment.purchase_id,
      expected_amount: payment.pay_amount,
      coins: coins
    });

    res.status(200).json({
      success: true,
      message: "Payment created successfully",
      redirectUrl: "/payment",
    });

  } catch (err) {
    console.error("Payment creation error:", err?.response?.data || err.message);
    res.status(500).json({ success: false, error: "Failed to create payment" });
  }
};



export const handleWebhook = async (req, res) => {
  try {
    const payload = req.body;
    const signature = req.headers['x-nowpayments-sig'];

    if (!verifyHMAC(payload, signature)) {
      return res.status(401).send('Invalid signature');
    }
    console.log("Received Webhook:", payload);
    const { payment_status, pay_amount, order_id } = payload;

    const payment = await paymentModel.findOne({ order_id });
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment record not found!" });
    }

    // ⛔️ Already processed
    if (payment.payment_status === 'finished') {
      return res.status(200).send('Already processed');
    }

    const user = await userModel.findById(payment.user_id);
    if (!user || !user.isAccountVerified) {
      return res.status(400).json({ success: false, message: "User not found or not verified" });
    }
    

    const receivedAmount = parseFloat(pay_amount);
    const difference = Math.abs(receivedAmount - payment.expected_amount);

    if (payment_status === 'finished') {

      console.log(`✅ Order ${order_id} paid successfully`);
      if (difference > 0.01) {
        console.warn(`⚠️ Amount mismatch! Expected: ${payment.expected_amount}, Received: ${receivedAmount}, Difference: ${difference}`);
      }

      payment.payment_status = payment_status;
      await payment.save();

      user.coins += payment.coins;
      await user.save(); 
    } else {
      console.log(`❌ Order ${order_id} failed or wrong amount`);
    }

    res.sendStatus(200);

  } catch (err) {
    console.error("Webhook Error:", err);
    res.sendStatus(500);
  }
};


export const getPendingPayment = async (req, res) => {
  const userId = req.userId;
  if (!userId) return res.status(400).json({ error: "User not authenticated" });

  // Fetch the latest "waiting" payment from DB
  const pending = await paymentModel.findOne({
    user_id: userId,
    payment_status: "waiting"
  }).sort({ createdAt: -1 });

  if (!pending) return res.status(404).json({ error: "No pending payment found" });
  try {
    // Get real-time status from NOWPayments API
    const response = await axios.get(
      `https://api.nowpayments.io/v1/payment/${pending.payment_id}`,
      {
        headers: {
          'x-api-key': process.env.NOWPAYMENTS_API_KEY
        }
      }
    );

    const { payment_status, pay_amount, pay_currency, pay_address, payment_id } = response.data;

    // Optional: Sync updated status back to DB
    pending.payment_status = payment_status;
    await pending.save();

    res.json({
      payment: {
        id: pending.payment_id,
        amount: pay_amount,
        currency: pay_currency,
        payTo: pay_address,
        status: payment_status,
        payment_id: payment_id,
      }
    });

  } catch (err) {
    console.error('NOWPayments API error:', err?.response?.data || err.message);
    res.status(500).json({ error: 'Error fetching payment status from NOWPayments' });
  }
};

export const deletePendingPayment = async (req, res) => {
  const { payment_id } = req.body;
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ success: false, message: "User not authenticated" });
  }

  if (!payment_id) {
    return res.status(400).json({ success: false, message: "Payment ID is required" });
  }

  try {
    const payment = await paymentModel.findOne({ payment_id });

    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    if (payment.user_id?.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "You are not authorized to delete this payment" });
    }

    if (payment.payment_status !== "waiting") {
      return res.status(400).json({ success: false, message: "Only pending payments can be deleted" });
    }

    await paymentModel.deleteOne({ payment_id });

    return res.status(200).json({ success: true, message: "Payment deleted successfully" });

  } catch (err) {
    console.error("Error deleting payment:", err);
    return res.status(500).json({ success: false, message: "Server error while deleting payment" });
  }
};
