import axios from 'axios';
import paymentModel from '../models/paymentModel.js';
import { verifyHMAC } from '../utils/verifyWebhook.js';
import userModel from '../models/userModel.js';

export const createPayment = async (req, res) => {
  const userId = req.userId;
  const { price, currency } = req.body;

  if (!userId) {
    return res.json({ success: false, message: "UserId missing!" });
  }

  const user = await userModel.findById(userId);
  if (!user || !user.isAccountVerified) {
    return res.json({ success: false, message: "User not found or not verified!" });
  }

  if (!price || !currency) {
    return res.json({ success: false, message: "Missing price or currency!" });
  }
  const parsedPrice = parseFloat(price);
  if (isNaN(parsedPrice)) return res.status(400).json({ error: "Invalid price" });  

  let coins = 0;
  if (price === 10) {
    coins = 1000;
  } else if (price === 20) {
    coins = 200000;
  } else {
    return res.json({ success: false, message: "Unsupported price value!" });
  }
  const orderId = `orderid_${Math.floor(Math.random() * 1000000)}`;
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
      payment: {
        id: payment.payment_id,
        amount: payment.pay_amount,
        currency: payment.pay_currency,
        payTo: payment.pay_address,
        status: payment.payment_status,
        coins: coins
      }
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

  const pending = await paymentModel.findOne({ 
    user_id: userId,
    payment_status: "waiting" 
  }).sort({ createdAt: -1 });

  if (!pending) return res.status(404).json({ error: "No pending payment found" });

  res.json({
    payment: {
      id: pending.payment_id,
      amount: pending.pay_amount,
      currency: pending.pay_currency,
      payTo: pending.pay_address,
      status: pending.payment_status
    }
  });
};
