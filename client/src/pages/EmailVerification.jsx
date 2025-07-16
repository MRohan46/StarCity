import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import useAuthRedirect from '../hooks/useAuthRedirect.js';

const EmailVerification = () => {
  useAuthRedirect({ redirectIfVerified: true });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [timer, setTimer] = useState(60);
  const [resendCount, setResendCount] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const host = "https://starcity.onrender.com";

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
      return toast.warn('⚠️ Enter the OTP');
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${host}/api/auth/verify-account`,
        { otp },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success('✅ Email verified!');
        setTimeout(() => navigate('/'), 1500);
      } else {
        toast.error(`❌ ${res.data.message}`);
      }
    } catch (err) {
      toast.error(`❌ Verification failed ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    if (resendCount >= 5) {
      return toast.error('⛔ Resend limit reached (5 max)');
    }
  
    // ✅ Start timer immediately
    setCanResend(false);
    setResendCount((prev) => prev + 1);
  
    try {
      const res = await axios.post(
        `${host}/api/auth/send-verify-otp`,
        {},
        { withCredentials: true }
      );
  
      if (res.data.success) {
        toast.success('📨 OTP resent successfully');
      } else {
        toast.error(`❌ ${res.data.message}`);
      }
    } catch (err) {
      toast.error('❌ Failed to resend OTP');
    }
  };
    
  return (
    <div style={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div style={styles.card}>
        <h2>🔐 Email Verification</h2>
        <p>We've sent an OTP to your email. Enter it below to verify your account.</p>

        <form onSubmit={handleVerify} style={styles.form}>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            style={styles.input}
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>

        <p style={styles.resend}>
            Didn't get it?{' '}
            <span
                onClick={handleResend}
                style={{
                ...styles.resendSpan,
                color: canResend ? '#1a73e8' : '#999',
                cursor: canResend ? 'pointer' : 'not-allowed',
                }}
            >
                {canResend
                ? resendCount >= 5
                    ? 'Resend Disabled'
                    : 'Resend OTP'
                : `Wait ${timer}s`}
            </span>
        </p>

      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f5f5f5',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    background: '#fff',
    padding: '2rem 3rem',
    borderRadius: '10px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    textAlign: 'center',
    width: '100%',
    maxWidth: '400px',
  },
  form: {
    marginTop: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.75rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  button: {
    padding: '0.75rem',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#1a73e8',
    color: '#fff',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  resend: {
    marginTop: '1rem',
    color: '#666',
  },
  resendSpan: {
    color: '#1a73e8',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default EmailVerification;
