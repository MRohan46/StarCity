import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/style.css"; // same main design style

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  //const host = "http://localhost:5000";
  const host = "https://api.starcityrp.com";

  const validatePassword = () => {
    if (!password || !confirmPassword) {
      toast.warn("⚠️ Both fields are required");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("❌ Passwords do not match");
      return false;
    }
    if (password.length < 8) {
      toast.error("❌ Password must be at least 8 characters");
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      toast.error("❌ Password must contain at least one uppercase letter");
      return false;
    }
    if (!/[a-z]/.test(password)) {
      toast.error("❌ Password must contain at least one lowercase letter");
      return false;
    }
    if (!/[0-9]/.test(password)) {
      toast.error("❌ Password must contain at least one number");
      return false;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      toast.error("❌ Password must contain at least one special character");
      return false;
    }
    return true;
  };

  const handleReset = async () => {
    if (!validatePassword()) return;

    setLoading(true);
    try {
      const res = await axios.post(
        `${host}/api/auth/reset-password/${token}`,
        { password }
      );
      if (res.data.success) {
        toast.success("✅ Password reset successfully");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error(`❌ ${res.data.message}`);
      }
    } catch (err) {
        console.log(err)
      toast.error(err.response.data.message || "❌ Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="auth-card glass-card">
        <h1 className="auth-title">RESET PASSWORD</h1>
        <p className="auth-subtitle">Enter your new password below</p>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input"
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="auth-input"
        />

        <button
          onClick={handleReset}
          disabled={loading}
          className="auth-btn"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
