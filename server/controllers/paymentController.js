import axios from 'axios';
import paymentModel from '../models/paymentModel.js';
import { verifyHMAC } from '../utils/verifyWebhook.js';
import {User} from '../models/userModel.js';

/*
const PRODUCTS = [
  { product_id: "bronze", name: "Bronze Pack", price: 5, coins: 3570 },
  { product_id: "product_2", name: "Bronze Pack", price: 15, coins: 12000 },
  { product_id: "product_3", name: "Silver Pack", price: 20, coins: 20000 },
  { product_id: "product_4", name: "Gold Pack", price: 30, coins: 40000 },
  { product_id: "product_5", name: "Platinum Pack", price: 35, coins: 90000 },
  { product_id: "product_5", name: "Platinum Pack", price: 35, coins: 90000 },
  { product_id: "product_5", name: "Platinum Pack", price: 35, coins: 90000 },
  { product_id: "product_5", name: "Platinum Pack", price: 35, coins: 90000 },
  { product_id: "product_5", name: "Platinum Pack", price: 35, coins: 90000 },
  { product_id: "product_5", name: "Platinum Pack", price: 35, coins: 90000 },
];
*/
const PRODUCTS = [
  {
    id: 'bronze',
    name: 'Bronze',
    tier: 'BRONZE TIER',
    coins: 3570,
    originalAmount: 3370,
    bonus: 200,
    price: 4.99,
    image: './images/bronze.jpg',
    bonusTag: 'BRONZE WEB BONUS',
    tierClass: 'bronze'
  },
  {
    id: 'silver',
    name: 'Silver',
    tier: 'SILVER TIER',
    coins: 8415,
    originalAmount: 7515,
    bonus: 900,
    price: 9.99,
    image: './images/silver.jpg',
    bonusTag: 'SILVER WEB BONUS',
    tierClass: 'silver'
  },
  {
    id: 'platinum',
    name: 'Platinum',
    tier: 'PLATINUM TIER',
    coins: 13175,
    originalAmount: 11675,
    bonus: 1500,
    price: 14.99,
    image: './images/platinum.jpg',
    bonusTag: 'PLATINUM WEB BONUS',
    tierClass: 'platinum'
  },
  {
    id: 'diamond',
    name: 'Diamond',
    tier: 'DIAMOND TIER',
    coins: 18275,
    originalAmount: 15775,
    bonus: 2500,
    price: 19.99,
    image: './images/diamond.jpg',
    bonusTag: 'MEGA WEB BONUS',
    tierClass: 'diamond'
  },
  {
    id: 'emperor',
    name: 'Emperor',
    tier: 'EMPEROR TIER',
    coins: 48875,
    originalAmount: 41375,
    bonus: 7500,
    price: 49.99,
    image: './images/emperor.jpg',
    bonusTag: 'EMPEROR WEB BONUS',
    tierClass: 'emperor'
  },
  {
    id: 'legendary',
    name: 'Legendary',
    tier: 'LEGENDARY TIER',
    coins: 102000,
    originalAmount: 82000,
    bonus: 20000,
    price: 99.99,
    image: './images/legendary.jpg',
    bonusTag: 'LEGENDARY WEB BONUS',
    tierClass: 'legendary'
  },
  {
    id: 'royal',
    name: 'Royal',
    tier: 'ROYAL TIER',
    coins: 157250,
    originalAmount: 112250,
    bonus: 35000,
    price: 149.99,
    image: './images/royal.jpg',
    bonusTag: 'ROYAL WEB TREATMENT',
    tierClass: 'royal'
  },
  {
    id: 'ultimate',
    name: 'Ultimate',
    tier: 'ULTIMATE',
    coins: 212500,
    originalAmount: 162500,
    bonus: 50000,
    price: 199.99,
    image: './images/legend.jpg',
    bonusTag: 'ULTIMATE WEB BONUS',
    tierClass: 'ultimate'
  }
];

export const createPayment = async (req, res) => {
  const userId = req.userId;
  const { product_id, currency } = req.body;
  if (!userId) {
    return res.json({ success: false, message: "UserId missing!" });
  }
  
  const user = await User.findById(userId);
  if (!user || !user.isVerified) {
    return res.json({ success: false, message: "User not found or not verified!" });
  }
  const existingPayment = await paymentModel.findOne({
    user_id: userId,
    payment_status: 'waiting'
  });
  if (existingPayment) {
    return res.json({
      success: false,
      message: 'User already has an active payment'
    });
  }
  if(!product_id){
    return res.json({succes: false, message: "Please Select a product first!"})
  }
  if(!currency){
    return res.json({succes: false, message: "Please Select a currency first!"})
  }

  
  const product = PRODUCTS.find(p => p.id === product_id);
  
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
    //const signature = req.headers['x-nowpayments-sig'];

    //if (!verifyHMAC(payload, signature)) {
      //return res.status(401).send('Invalid signature');
    //}
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

    const user = await User.findById(payment.user_id);
    if (!user || !user.isVerified) {
      return res.json({ success: false, message: "User not found or not verified" });
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

export const getPaidPayments = async (req, res) => {
  const userId = req.userId;
  if (!userId) return res.status(400).json({ error: "User not authenticated" });

  try {
    // Fetch all payments EXCEPT "waiting" for this user
    const payments = await paymentModel.find({
      user_id: userId,
      payment_status: { $ne: "waiting" } // Not equal to "waiting"
    }).sort({ createdAt: -1 });

    if (!payments.length) {
      return res.status(404).json({ error: "No Paid payments found" });
    }

    res.json({
      payments: payments.map(p => ({
        id: p.payment_id,
        order_id: p.order_id,
        amount: p.pay_amount,
        currency: p.pay_currency,
        payTo: p.pay_address,
        status: p.payment_status,
        createdAt: p.updatedAt
      }))
    });

  } catch (err) {
    console.error("Error fetching paid payments:", err.message);
    res.status(500).json({ error: "Error fetching payments" });
  }
};
