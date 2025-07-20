// /pages/payment.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const PaymentPage = () => {
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const res = await axios.get("https://starcity.onrender.com/api/payment/pending",
          {
            withCredentials: true,
          });
        console.log(res) // must include token
        setPayment(res.data.payment);
      } catch (err) {
        console.error("No pending payment", err);
      }
    };
    fetchPayment();
  }, []);

  if (!payment) return <p>Loading or no pending payment...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Complete Your Payment</h2>
      <p>💰 Amount: {payment.amount} {payment.currency.toUpperCase()}</p>
      <p>📥 Send To Address:</p>
      <code className="block p-2 bg-gray-100 rounded">{payment.payTo}</code>

      <button
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => navigator.clipboard.writeText(payment.payTo)}
      >
        Copy Address
      </button>

      {/* Optional: QR Code */}
      <img 
        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${payment.payTo}`} 
        alt="QR Code" 
        className="mt-4"
      />

      <p className="mt-4 text-yellow-600">⏳ Status: {payment.status}</p>
    </div>
  );
};

export default PaymentPage;
