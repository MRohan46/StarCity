import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "../styles/style.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const host = "https://api.starcityrp.com";
  //const host = "http://localhost:5000";

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const sendOTP = async () => {
    if (!email) return toast.warn("⚠️ Email is required");
    setLoading(true);
    try {
      const res = await axios.post(`${host}/api/auth/forgot-password`, { email });
      if (res.data.success) {
        toast.success("📧 OTP sent to your email");
        setTimeout(() => {
          navigate("/reset-password");
        }, 1000);
      } else {
        toast.error(`❌ ${res.data.message}`);
      }
    } catch {
      toast.error("❌ Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="auth-card glass-card">
        <h1 className="auth-title">RESET PASSWORD</h1>
        <p className="auth-subtitle">
          Enter your email to receive an OTP
        </p>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input"
        />
        <button
          onClick={sendOTP}
          disabled={loading || cooldown > 0}
          className="auth-btn"
        >
          {cooldown > 0
            ? `Resend in ${cooldown}s`
            : loading
            ? "Sending..."
            : "Send OTP"}
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
