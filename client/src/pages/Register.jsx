import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuthRedirect from '../hooks/useAuthRedirect';

const Register = () => {
  useAuthRedirect({ redirectIfAuth: true });
  const host = "https://starcity.onrender.com"
  const [form, setForm] = useState({
    fname: '',
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { fname, username, email, password } = form;

    if (!fname || !username || !email || !password) {
      return toast.warn('⚠️ All fields are required');
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${host}/api/auth/register`,
        form,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success('✅ Registered successfully');
        setTimeout(() => {
          window.location.href = '/email-verify';
        }, 1500);
      } else {
        toast.error(`❌ ${res.data.message}`);
        setLoading(false);
      }
    } catch (err) {
      toast.error(`❌ ${err.response?.data?.message || 'Something went wrong'}`);
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} />
      <form style={styles.form} onSubmit={handleRegister}>
        <h2>Register</h2>
        <input
          type="text"
          name="fname"
          placeholder="Full Name"
          value={form.fname}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          style={styles.input}
        />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
        <h2>Already a user? <br />Login <a style={styles.a}href='/login'>Here</a></h2>
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
    width: '320px',
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

export default Register;
