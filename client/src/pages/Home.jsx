import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const [fname, setFname] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const host = "https://starcity.onrender.com"


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${host}/api/user/data`, {
          withCredentials: true,
        });

        if (res.data.success) {
          const user = res.data.userData;
          if (!user.isAccountVerified) {
            navigate('/email-verify');
            return;
          }

          setFname(user.fname);
        } else {
          toast.error('Unauthorized');
          navigate('/login');
        }
      } catch (err) {
        toast.error('Failed to fetch user');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);
  


    const handleLogout = async () => {
    try {
        const res = await axios.post(
        `${host}/api/auth/logout`,
        {}, // no body
        { withCredentials: true }
        );

        if (res.data.success) {
        toast.success('🚪 Logged out successfully!');
        setTimeout(() => {
            window.location.href = '/login';
        }, 1000); // short delay for toast
        } else {
        toast.error(`❌ ${res.data.message}`);
        }
    } catch (err) {
        toast.error(`❌ Logout failed: ${err.response?.data?.message || 'Server error'}`);
    }
    };


  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div style={styles.card}>
        <h1 style={styles.heading}>🌟 Welcome to Star City</h1>
        <p style={styles.subtext}>Hello, <strong>{fname}</strong>! You're officially in.</p>
        <br />
        <button onClick={handleLogout}type="submit" style={styles.button}>
            Log out
        </button>
      </div>
    </div>
  );
};

const styles = {
  loading: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1.5rem',
  },
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #1a73e8, #673ab7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    background: '#fff',
    padding: '2rem 3rem',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    textAlign: 'center',
  },
  heading: {
    fontSize: '2rem',
    color: '#333',
    marginBottom: '1rem',
  },
  subtext: {
    fontSize: '1.2rem',
    color: '#555',
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
};

export default Home;
