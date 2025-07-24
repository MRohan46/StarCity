import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate  } from 'react-router-dom';
import '../styles/Purchase.css';
import axios from 'axios';
import currencies from './currencies.json'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




const Purchase = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('');
  const [currency, setCurrency] = useState('');
  const [walletOptions, setWalletOptions] = useState([]);
  //const host = "http://localhost:5000";
  const host = "https://api.starcityrp.com";

  const product = state;

  useEffect(() => {
    setWalletOptions(currencies);

  }, []);

  useEffect(() => {
    if (selectedMethod === 'crypto') {
      setCurrency(selectedWallet);
    } else {
      setCurrency('');
      setSelectedWallet('');
    }
  }, [selectedMethod, selectedWallet]);

  const handleConfirm = async () => {
    if (!product) {
      toast.error('No product selected.');
      return;
    }

    try {
      const res = await axios.post(
        `${host}/api/payment/create`,
        {
          product_id: product.name,
          currency: currency,
        },
        {
          withCredentials: true,
        }
      );
      console.log(res.data.success)
      if (!res.data.success) {
        toast.error(res.data.message || 'Payment failed.');
      } else {
        toast.success('Payment created!');
        navigate('/payment');
      }
    } catch (err) {
      toast.error(err.response?.data?.message);

    }
  };

  return (
    <div className="purchase-container">
      <ToastContainer />
      {product ? (
        <>
          <h2>Selected Product</h2>
          <div className="product-info">
            <p><strong>Name:</strong> {product.name}</p>
            <p><strong>Coins:</strong> {product.coins}</p>
            <p><strong>Price:</strong> ${product.price}</p>
          </div>

          <h3>Payment Method</h3>
          <div className="payment-methods">
            <label>
              <input
                type="radio"
                name="method"
                value="card"
                onChange={() => setSelectedMethod('card')}
              />
              Credit/Debit Card
            </label>
            <label>
              <input
                type="radio"
                name="method"
                value="crypto"
                onChange={() => setSelectedMethod('crypto')}
              />
              Crypto
            </label>
          </div>

          {selectedMethod === 'crypto' && (
            <div className="crypto-section">
              <label>
                Select Wallet:
                <select
                  value={selectedWallet}
                  onChange={(e) => setSelectedWallet(e.target.value)}
                >
                  <option value="">Choose a wallet</option>
                  {walletOptions.map((wallet) => (
                    <option key={wallet.value} value={wallet.value}>
                      {wallet.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          {selectedMethod === 'card' && (
            <div className="coming-soon">Credit/Debit Card coming soon...</div>
          )}

          <button
            className="confirm-btn"
            onClick={handleConfirm}
            disabled={!selectedMethod || (selectedMethod === 'crypto' && !selectedWallet)}
          >
            Confirm Payment
          </button>
        </>
      ) : (
        <p className="error-text">No product selected.</p>
      )}
    </div>
  );
};

export default Purchase;
