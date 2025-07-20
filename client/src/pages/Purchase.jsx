import React, { useState } from 'react';
import axios from 'axios';

const Purchase = () => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('usdterc20');
  const [status, setStatus] = useState(null);
  const host = "https://starcity.onrender.com";

  const currencyOptions = [
    { code: "usdterc20", name: "USDT (ERC20)" },
    { code: "usdcsol", name: "USDC (Solana)" },
    { code: "btc", name: "Bitcoin (BTC)" },
    { code: "eth", name: "Ethereum (ETH)" },
    { code: "usdttrc20", name: "USDT (TRC20)" },
    { code: "busdbsc", name: "BUSD (BSC)" },
    { code: "matic", name: "Polygon (MATIC)" },
    { code: "bnbbsc", name: "BNB (BSC)" },
    { code: "xrp", name: "XRP" },
    { code: "ltc", name: "Litecoin (LTC)" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${host}/api/payment/create`, {
        price: amount,
        currency: currency,
      },
    {
      withCredentials: true,
    });
      setStatus({ success: true, data: res.data });
    } catch (err) {
      setStatus({
        success: false,
        message: err?.response?.data?.message || 'Something went wrong'
      });
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Purchase Coins</h1>
        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={styles.label}>Amount ($)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min={1}
              style={styles.input}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={styles.label}>Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={styles.input}
            >
              {currencyOptions.map((opt) => (
                <option key={opt.code} value={opt.code}>
                  {opt.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" style={styles.button}>
            Purchase
          </button>
        </form>

        {status && (
          <div
            style={{
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: status.success ? '#dcfce7' : '#fee2e2',
              borderRadius: '8px',
              fontSize: '0.9rem',
              marginTop: '1.5rem'
            }}
          >
            {status.success ? (
              <pre>{JSON.stringify(status.data, null, 2)}</pre>
            ) : (
              <span>{status.message}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #1a73e8, #673ab7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
  },
  card: {
    background: '#fff',
    padding: '2rem 3rem',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    maxWidth: '400px',
    width: '100%',
  },
  heading: {
    fontSize: '2rem',
    color: '#333',
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
    color: '#444',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  button: {
    marginTop: '1rem',
    width: '100%',
    padding: '0.8rem',
    fontSize: '1rem',
    backgroundColor: '#1a73e8',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};
