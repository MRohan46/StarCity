import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/payment.css";
import useUserData from "../hooks/useAuthRedirect.js";

const PaymentPage = () => {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  //const host = "http://localhost:5000";
  const host = "https://api.starcityrp.com";
  useUserData();
  useEffect(() => {
    const fetchPayment = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${host}/api/payment/pending`, {
          withCredentials: true,
        });
        setPayment(res.data.payment);
      } catch (err) {
        console.error("No pending payment", err);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchPayment();
  }, []);

  const handleDelete = async () => {
    if (!payment?.payment_id) return alert("No payment to delete");

    try {
      setLoading(true);
      const res = await axios.post(`${host}/api/payment/delete`, {
        payment_id: payment.payment_id,
      }, { withCredentials: true });

      if (res.data.success) {
        alert("Payment deleted");
        setPayment(null); // Remove from UI
      } else {
        alert(res.data.message || "Failed to delete payment");
      }
    } catch (err) {
      console.error("Delete error", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  if(loading)
    return     <div className="payment-container"><p style={{color: "black"}}>Loading...</p></div>;

  if (!payment) 
    return     <div className="payment-container"><p style={{color: "black"}}>No pending payment</p></div>;

  return (
    <div className="payment-container">
      <h2>Complete Your Payment</h2>

      <p className="payment-info">💰 Amount: {payment.amount} {payment.currency.toUpperCase()}</p>
      <p className="payment-info">📥 Send To Address:</p>
      <code className="payment-code" style={{color: "black"}}>{payment.payTo}</code>
      <br />
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

      <button
        className="delete-btn"
        onClick={handleDelete}
        disabled={loading}
        style={{ marginTop: "20px", backgroundColor: "#e74c3c", color: "#fff" }}
      >
        {loading ? "Deleting..." : "❌ Cancel Payment"}
      </button>
    </div>
  );
};

export default PaymentPage;
