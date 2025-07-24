import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuthRedirect from '../hooks/useAuthRedirect';


const Login = () => {
  useAuthRedirect({ redirectIfAuth: true });
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const host = "https://api.starcityrp.com"
  //const host = "http://localhost:5000"



  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!emailOrUsername || !password) {
      return toast.warn('⚠️ Please fill in all fields');
    }
  
    setLoading(true); // Disable button
  
    try {
      const res = await axios.post(
        `${host}/api/auth/login`,
        {
          email: emailOrUsername,
          password,
        },
        {
          withCredentials: true,
        }
      );
  
      if (res.data.success) {
        toast.success('✅ Logged in successfully');
        // Wait 1.5s then redirect
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        toast.error(`❌ ${res.data.message}`);
        setLoading(false); // Re-enable button on failure
      }
    } catch (err) {
      toast.error(`❌ ${err.response?.data?.message || 'Something went wrong'}`);
      setLoading(false); // Re-enable button on failure
    }
  };
  
  return (
    <div style={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} />
      <form style={styles.form} onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Email or Username"
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button
            type="submit"
            style={styles.button}
            disabled={loading}
            >
            {loading ? 'Logging in...' : 'Login'}
        </button>
      <h5>Forgot Password?  Reset Password <a style={styles.a}href='/reset-password'>Here</a></h5>
      <h3>New user? Register an account <a style={styles.a}href='/register'>Here</a></h3>
      </form>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f4f4f4',
  },
  form: {
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '300px',
  },
  input: {
    padding: '0.8rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  button: {
    padding: '0.8rem',
    fontSize: '1rem',
    backgroundColor: '#1a73e8',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  a: {
    color: "#999999",
    textDecoration: "none",
  }
};

export default Login;
