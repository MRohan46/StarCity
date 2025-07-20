// /pages/payment.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/payment.css"; // <- import CSS file

const PaymentPage = () => {
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const res = await axios.get("https://starcity.onrender.com/api/payment/pending", {
          withCredentials: true,
        });
        setPayment(res.data.payment);
      } catch (err) {
        console.error("No pending payment", err);
      }
    };
    fetchPayment();
  }, []);

  if (!payment) return <p>Loading or no pending payment...</p>;

  return (
    <div className="payment-container">
      <h2>Complete Your Payment</h2>

      <p className="payment-info">💰 Amount: {payment.amount} {payment.currency.toUpperCase()}</p>
      <p className="payment-info">📥 Send To Address:</p>
      <code className="payment-code">{payment.payTo}</code>

      <button
        className="copy-btn"
        onClick={() => navigator.clipboard.writeText(payment.payTo)}
      >
        Copy Address
      </button>

      <img
        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${payment.payTo}`}
        alt="QR Code"
        className="qr-code"
      />

      <p className="payment-status">⏳ Status: {payment.status}</p>
    </div>
  );
};

export default PaymentPage;
