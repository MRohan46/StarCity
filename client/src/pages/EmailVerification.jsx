import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import useAuthRedirect from "../hooks/useAuthRedirect.js";
import "../styles/style.css"; // For glassy & site-wide styles

const EmailVerification = () => {
  useAuthRedirect({ redirectIfVerified: true });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [timer, setTimer] = useState(60);
  const [resendCount, setResendCount] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const host = "https://api.starcityrp.com";
  //const host = "http://localhost:5000";


  useEffect(() => {
    let interval;
    if (!canResend) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setCanResend(true);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [canResend]);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      return toast.warn("⚠️ Enter the OTP");
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${host}/api/auth/verify-email`,
        { code: otp },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("✅ Email verified!");
        setTimeout(() => navigate("/"), 1500);
      } else {
        toast.error(`❌ ${res.data.message}`);
      }
    } catch (err) {
      console.log(err)
      toast.error(`❌ Verification failed ${err.response.data.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    if (resendCount >= 5) {
      return toast.error("⛔ Resend limit reached (5 max)");
    }

    setCanResend(false);
    setResendCount((prev) => prev + 1);

    try {
      const res = await axios.post(
        `${host}/api/auth/resend-otp`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("📨 OTP resent successfully");
      } else {
        toast.error(`❌ ${res.data.message}`);
      }
    } catch {
      toast.error("❌ Failed to resend OTP");
    }
  };

  return (
    <div className="auth-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="auth-card glass-card">
        <h1 className="auth-title">EMAIL VERIFICATION</h1>
        <p className="auth-subtitle">
          We’ve sent an OTP to your email. Enter it below to verify your account.
        </p>

        <form onSubmit={handleVerify} className="auth-form">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="auth-input"
          />
          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        <p className="auth-resend">
          Didn’t get it?{" "}
          <span
            onClick={handleResend}
            style={{
              color: canResend ? "tomato" : "#999",
              cursor: canResend ? "pointer" : "not-allowed",
            }}
          >
            {canResend
              ? resendCount >= 5
                ? "Resend Disabled"
                : "Resend OTP"
              : `Wait ${timer}s`}
          </span>
        </p>
      </div>
    </div>
  );
};

export default EmailVerification;
