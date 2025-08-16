// models/paymentModel.js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  payment_id: { type: String, required: true, unique: true },
  payment_status: { type: String, required: true },
  pay_address: { type: String },
  price_amount: { type: Number },
  price_currency: { type: String },
  pay_amount: { type: Number },
  pay_currency: { type: String },
  order_id: { type: String },
  purchase_id: { type: String },
  user_wallet_address: { type: String },
  expected_amount: { type: Number },
  coins: { type: Number },
}, { timestamps: true });

const paymentModel = mongoose.models.payment || mongoose.model("payment", paymentSchema);

export default paymentModel;
