import axios from 'axios';
import { verifyHMAC } from '../utils/verifyWebhook.js';

export const createPayment = async (req, res) => {
  const { orderId } = req.body;

  try {
    const response = await axios.post('https://api.nowpayments.io/v1/payment', {
      price_amount: 10,
      price_currency: 'usdt',
      pay_currency: 'usdttrc20',
      order_id: orderId,
      ipn_callback_url: 'https://starcity.onrender.com/api/payment/webhook' // ✅ your real webhook
    }, {
      headers: {
        'x-api-key': process.env.NOWPAYMENTS_API_KEY
      }
    });

    res.json({ url: response.data.invoice_url });
  } catch (err) {
    console.error('Payment create error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Payment failed' });
  }
};

export const handleWebhook = (req, res) => {
  const payload = JSON.parse(req.body.toString('utf8')); // ✅ convert raw buffer to JSON
  const signature = req.headers['x-nowpayments-sig'];

  if (!verifyHMAC(payload, signature)) {
    return res.status(401).send('Invalid signature');
  }

  const { payment_status, pay_amount, order_id } = payload;

  if (payment_status === 'finished' && parseFloat(pay_amount) === 10) {
    console.log(`✅ Order ${order_id} paid successfully`);
    // ✅ TODO: Add DB logic or unlock feature
  } else {
    console.log(`❌ Order ${order_id} failed or wrong amount`);
  }

  res.sendStatus(200);
};
