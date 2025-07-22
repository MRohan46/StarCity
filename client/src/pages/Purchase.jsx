import React, { useState } from "react";
import axios from "axios";

const PRODUCTS = [
  { product_id: "product_1", name: "Starter Pack", price: 10, coins: 5000 },
  { product_id: "product_2", name: "Bronze Pack", price: 15, coins: 12000 },
  { product_id: "product_3", name: "Silver Pack", price: 20, coins: 20000 },
  { product_id: "product_4", name: "Gold Pack", price: 30, coins: 40000 },
  { product_id: "product_5", name: "Platinum Pack", price: 35, coins: 90000 },
];

const CURRENCIES = [
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
  { code: "usdtbsc", name: "USDT (BEP20)" },
];
//const host = "http://localhost:5000"
const host = "https://starcity.onrender.com"
const ProductPurchase = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState("usdtbsc"); // default

  const createPayment = async (product_id) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${host}/api/payment/create`,
        { product_id, currency },
        { withCredentials: true }
      );
      setStatus({ success: true, data: res.data });
      if(res.data.success){
        window.location.href = res.data.redirectUrl || "/payment";
      }
    } catch (err) {
      setStatus({
        success: false,
        message: err?.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Choose a Coin Pack</h2>

      <div style={{ marginBottom: 20, textAlign: "center" }}>
        <label style={{ marginRight: 10, fontWeight: "bold" }}>Currency:</label>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          style={styles.select}
        >
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.grid}>
        {PRODUCTS.map((p) => (
          <div key={p.product_id} style={styles.card}>
            <h3>{p.name}</h3>
            <p><strong>{p.coins.toLocaleString()} Coins</strong></p>
            <p>${p.price.toFixed(2)}</p>
            <button
              style={styles.button}
              onClick={() => createPayment(p.product_id)}
              disabled={loading}
            >
              {loading ? "Processing..." : "Purchase"}
            </button>
          </div>
        ))}
      </div>

      {status && (
        <div style={{ marginTop: 20 }}>
          {status.success ? (
            <div style={{ color: "green" }}>
              ✅ Payment Created:{" "}
              <pre>{JSON.stringify(status.data, null, 2)}</pre>
            </div>
          ) : (
            <div style={{ color: "red" }}>❌ {status.message}</div>
          )}
        </div>
      )}
    </div>
  );
};

// Basic inline styles
const styles = {
  container: { maxWidth: 900, margin: "auto", padding: 20 },
  heading: { textAlign: "center", marginBottom: 20 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "20px",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: 10,
    padding: 20,
    textAlign: "center",
    background: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  button: {
    padding: "8px 16px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    marginTop: 10,
  },
  select: {
    padding: "8px 12px",
    fontSize: "1rem",
    borderRadius: 6,
    border: "1px solid #ccc",
  },
};

export default ProductPurchase;
