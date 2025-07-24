import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const host = "https://api.starcityrp.com"


  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const sendOTP = async () => {
    if (!email) return toast.warn('⚠️ Email is required');
    setLoading(true);
    try {
      const res = await axios.post(`${host}/api/auth/send-reset-otp`, { email });
      if (res.data.success) {
        toast.success('📧 OTP sent to your email');
        setStep(2);
        setCooldown(60);
      } else {
        toast.error(`❌ ${res.data.message}`);
      }
    } catch (err) {
      toast.error('❌ Something went wrong');
    }
    setLoading(false);
  };

  const handleReset = async () => {
    if (!otp || !newPassword) return toast.warn('⚠️ OTP and new password are required');
    setLoading(true);
    try {
      const res = await axios.post(`${host}/api/auth/reset-password`, {
        email,
        otp,
        newPassword
      });
      if (res.data.success) {
        toast.success('✅ Password reset successfully');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      } else {
        toast.error(`❌ ${res.data.message}`);
      }
    } catch (err) {
      toast.error('❌ Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div style={styles.card}>
        {step === 1 && (
          <>
            <h2>Reset Password</h2>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={styles.input}
            />
            <button
              onClick={sendOTP}
              disabled={loading || cooldown > 0}
              style={{ ...styles.button, opacity: loading || cooldown > 0 ? 0.6 : 1 }}
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : loading ? 'Sending...' : 'Send OTP'}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2>Enter OTP & New Password</h2>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              style={styles.input}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              style={styles.input}
            />
            <button
              onClick={handleReset}
              disabled={loading}
              style={{ ...styles.button, opacity: loading ? 0.6 : 1 }}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f4f4f4'
  },
  card: {
    background: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    width: '320px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  input: {
    padding: '0.8rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px'
  },
  button: {
    padding: '0.8rem',
    fontSize: '1rem',
    backgroundColor: '#1a73e8',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default ResetPassword;
