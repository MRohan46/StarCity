import React, { useEffect, useState } from 'react';
import "../styles/Purchase.css"
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/style.css"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { use } from 'react';
import useUserData from "../hooks/useAuthRedirect.js"
import currencies from './currencies.json';
import { packageData } from '../assets/packageData.js'
import { membershipData } from '../assets/membershipData.js'
// Simulated toast notifications
const useToast = () => {
  const [toasts, setToasts] = useState([]);
  
  
  const showToast = (message, type = 'info') => {
    const id = Date.now();
    const toast = { id, message, type };
    setToasts(prev => [...prev, toast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  return {
    toasts,
    success: (message) => showToast(message, 'success'),
    error: (message) => showToast(message, 'error'),
    info: (message) => showToast(message, 'info')
  };
};

// Toast Component with your styling approach
const ToastContainer = ({ toasts }) => (
  <div className="toast-container">
    {toasts.map(toast => (
      <div
      key={toast.id}
      className={`toast toast-${toast.type}`}
      >
        {toast.message}
      </div>
    ))}
  </div>
);

const Purchase = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('');
  const [currency, setCurrency] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState('')
  const [walletOptions, setWalletOptions] = useState('')
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false)
  const [showPopup, setShowPopup] = useState(false);
  
  const navigate = useNavigate();  
  const toast = useToast();
  const host = "https://api.starcityrp.com";
  //const host = "http://localhost:5000";
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useUserData({
    onSuccess: () => {
      setShowDashboard(true);
    }
  });


    // Scroll effect
    useEffect(() => {
      const handleScroll = () => {
        setScrolled(window.scrollY > 100);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);
  
    // Close menu on outside click
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          !event.target.closest(".mobile-menu") &&
          !event.target.closest(".hamburger")
        ) {
          setMenuOpen(false);
        }
      };
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }, []);
  
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

  const buyPackage = (packageName, price) => {
    const product = packageData.find(pkg => pkg.name === packageName) || membershipData.find(pkg => pkg.name === packageName);
    if (product) {
      setSelectedProduct(product);
      setShowPaymentModal(true);
    }
  };

  const handleConfirm = async () => {
    if (!selectedProduct) {
      toast.error('No product selected.');
      return;
    }

    if (!selectedMethod) {
      toast.error('Please select a payment method.');
      return;
    }

    if (selectedMethod === 'crypto' && !selectedWallet) {
      toast.error('Please select a cryptocurrency wallet.');
      return;
    }

    if (selectedMethod === 'card') {
      toast.error('Credit/Debit card payments are coming soon!');
      return;
    }

    setIsProcessing(true);
    
    try {
      const res = await axios.post(
        `${host}/api/payment/create`,
        {
          product_id: selectedProduct.id,
          currency: currency,
        },
        {
          withCredentials: true,
        }
      );
      navigate(res?.data?.redirectUrl)
      if (!res.data.success) {
        toast.error(res.data.message || 'Payment failed.');
      } else {
        closeModal();
        
        toast.success('Payment created successfully!');
        navigate('/payment');
      }
    } catch (err) {
      toast.error(err.response?.data?.message|| "an error occured");
    }finally {
      setIsProcessing(false);
    }
  };

  const closeModal = () => {
    setShowPaymentModal(false);
    setSelectedProduct(null);
    setSelectedMethod('');
    setSelectedWallet('');
  };

  return (
    <div className="purchase-container">
      {/* Navigation */}
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`} id="navbar">
        <div className="nav-container">
          <div className="logo">
            <img src="/images/rplogo.png" alt="Starcity RP Logo" />
          </div>

          <div className="nav-links">
            <a href="/">HOME</a>
            <a href="#footer">SOCIALS</a>
            <a href="purchase" className="shop-link">SHOP</a>
          </div>
          {
            showDashboard ? (
              <a href="dashboard" className="login-btn">Dashboard</a>
            ) : (
              <>
                <a href="login" className="login-btn">LOGIN</a>
                <a href="signup" className="login-btn">Signup</a>
              </>
            )
          }

          <div className="mobile-nav">
            <div
              className="hamburger"
              onClick={() => setMenuOpen((prev) => !prev)}
              >
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`} id="mobileMenu">
        <a href="/">HOME</a>
        {
          showDashboard ? (
            <a href="dashboard" >Dashboard</a>
          ) : (
            <>
              <a href="login" >LOGIN</a>
              <a href="signup" >Signup</a>
            </>
          )
        }
        <a href="purchase" className="shop-link">
          SHOP <span style={{ color: "red" }}>-30%</span>
        </a>
        <a href="#footer">SOCIALS</a>
      </div>


      <style>{`
          
        .payment-modal {
          position: fixed;
          top: 0%;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000000;
          padding: 20px;
        }

        .modal-content {
          background: #1a1a2e;
          border-radius: 15px;
          padding: 30px;
          width: 100%;
          margin-top: 100px;
          max-width: 500px;
          max-height: 80vh;
          overflow-y: auto;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: bold;
        }

        .close-btn {
          background: none;
          border: none;
          color: #ccc;
          font-size: 1.5rem;
          cursor: pointer;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-btn:hover {
          color: white;
        }

        .product-info {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 25px;
        }

        .product-info h4 {
          font-weight: bold;
          margin-bottom: 15px;
        }

        .product-info p {
          margin: 5px 0;
          font-size: 0.9rem;
        }

        .payment-methods {
          margin-bottom: 25px;
        }

        .payment-methods h4 {
          font-weight: bold;
          margin-bottom: 15px;
        }

        .payment-method-option {
          display: flex;
          align-items: center;
          padding: 15px;
          border: 1px solid #555;
          border-radius: 8px;
          margin-bottom: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .payment-method-option:hover {
          border-color: #667eea;
          background: rgba(102, 126, 234, 0.1);
        }

        .payment-method-option input {
          margin-right: 10px;
        }

        .crypto-section {
          margin-bottom: 25px;
        }

        .crypto-section label {
          display: block;
          font-size: 0.9rem;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .crypto-section select {
          width: 100%;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid #555;
          border-radius: 8px;
          padding: 12px;
          color: white;
          font-size: 0.9rem;
        }

        .crypto-section select:focus {
          outline: none;
          border-color: #667eea;
        }

        .coming-soon {
          background: rgba(255, 193, 7, 0.2);
          border: 1px solid #ffc107;
          border-radius: 8px;
          padding: 15px;
          text-align: center;
          color: #ffc107;
          font-weight: bold;
          margin-bottom: 25px;
        }

        .confirm-btn {
          width: 100%;
          background: linear-gradient(45deg, #28a745, #20c997);
          border: none;
          color: white;
          font-weight: bold;
          padding: 15px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
        }

        .confirm-btn:hover:not(:disabled) {
          background: linear-gradient(45deg, #20c997, #28a745);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(40, 167, 69, 0.4);
        }

        .confirm-btn:disabled {
          background: #6c757d;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .toast-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 2000;
        }

        .toast {
          background: #333;
          color: white;
          padding: 15px 20px;
          border-radius: 8px;
          margin-bottom: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          animation: slideIn 0.3s ease;
        }
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .popup-content {
          background: #fff;
          padding: 30px;
          max-width: 600px;
          width: 90%;
          border-radius: 15px;
          text-align: center;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        }

        .popup-content h2 {
          margin-bottom: 15px;
          color: #333;
        }

        .popup-content p {
          color: #555;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .close-btn {
          background: #ff4757;
          color: #fff;
          padding: 10px 20px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
        }
        .close-btn:hover {
          background: #e84118;
        }
        .benefits-text p {
          margin: 12px 0;
          font-size: 1.05rem;
          line-height: 1.6;
          background: #f8f9fa;
          padding: 10px 15px;
          border-radius: 8px;
        }
        .toast-success {
          border-left: 4px solid #28a745;
        }

        .toast-error {
          border-left: 4px solid #dc3545;
        }

        .toast-info {
          border-left: 4px solid #17a2b8;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .error-text {
          text-align: center;
          color: #dc3545;
          font-size: 1.2rem;
          margin-top: 50px;
        }

        @media (max-width: 768px) {
          .store-header h1 {
            font-size: 2.5rem;
          }
          
          .packages-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .modal-content {
            margin: 20px;
            max-width: calc(100% - 40px);
          }

      `}</style>

      <ToastContainer toasts={toast.toasts} />
      
      {/* Floating particles background */}
      <div className="particles">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>

      <div className="main-content">
        {/* Store Header */}
        <div className="store-header">
          <h1>PREMIUM STORE</h1>
          <p>Enhance your gameplay with exclusive in-game currency and premium packages</p>
        </div>

        {/* Premium Packages */}
        <div className="packages-section">
          <div className="packages-header">
            <h2>PREMIUM PACKAGES</h2>
            <p>Choose from our exclusive premium packages with incredible bonuses</p>
          </div>

          <div className="packages-grid">
            {packageData.map((pkg) => (
              <div key={pkg.id} className="package-card" onClick={() => buyPackage(pkg.name, pkg.price)}>
                <div className="bonus-tag">{pkg.bonusTag}</div>
                <img
                  src={pkg.image}
                  className="card-img"
                  alt={`${pkg.name} Package`}
                  onError={(e) => {
                    e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23374151"/><text x="100" y="100" text-anchor="middle" dy=".35em" fill="%23ffffff" font-size="14">${pkg.name}</text></svg>`;
                  }}
                />
                <div className="package-details">
                  <div className={`package-tier ${pkg.tierClass}`}>
                    {pkg.tier}
                  </div>
                  <div className="coins-amount">{pkg?.coins.toLocaleString()}</div>
                  <div className="original-amount">{pkg?.originalAmount.toLocaleString()}</div>
                  <div className="bonus-info">BONUS {pkg?.bonus.toLocaleString()}</div>
                  <div className="package-price">${pkg?.price}</div>
                  <button className="buy-package-btn" onClick={(e) => {
                    e.stopPropagation();
                    buyPackage(pkg.name, pkg.price);
                  }}>
                    BUY NOW
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Membership Packages */}
        <div className="packages-section">
          <div className="packages-header">
            <h2>VIP Member Ships</h2>
            <p>Choose from our exclusive Vip Memberships with incredible Benefits.</p>
            <button className='buy-package-btn'onClick={() => setShowPopup(true)} >View Benefits.</button>
          </div>

          <div className="packages-grid">
            {membershipData.map((pkg) => (
              <div key={pkg.id} className="package-card" onClick={() => buyPackage(pkg.name, pkg.price)}>
                <img
                  src={pkg.image}
                  className="card-img"
                  alt={`${pkg.name} Package`}
                  onError={(e) => {
                    e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23374151"/><text x="100" y="100" text-anchor="middle" dy=".35em" fill="%23ffffff" font-size="14">${pkg.name}</text></svg>`;
                  }}
                />
                <div className="package-details">
                  <div className={`package-tier ${pkg.tierClass}`}>
                    {pkg.tier}
                  </div>
                  <div className="coins-amount">{pkg.coins.toLocaleString()}</div>
                  <div className="package-price">${pkg.price}</div>
                  <button className="buy-package-btn" onClick={(e) => {
                    e.stopPropagation();
                    buyPackage(pkg.name, pkg.price);
                  }}>
                    BUY NOW
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* Popup Modal */}
{showPopup && (
        <div 
          className="popup-overlay" 
          style={{
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
            background: "rgba(0,0,0,0.7)", display: "flex",
            alignItems: "center", justifyContent: "center", zIndex: 1000
          }}
          onClick={() => setShowPopup(false)}
        >
          <div 
            className="popup-content" 
            style={{
              background: "#fff",
              padding: "30px",
              maxWidth: "700px",
              width: "95%",
              maxHeight: "80vh",
              overflowY: "auto",
              borderRadius: "20px",
              textAlign: "left", // force left alignment
              boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#2c3e50" }}>
              ✨ VIP Membership Benefits ✨
            </h2>

            <div>
              <p style={{ margin: "12px 0", fontSize: "1.05rem", lineHeight: "1.6" }}>🎯 Faster progression in the game (More XP and in-game money)</p>
              <p style={{ margin: "12px 0", fontSize: "1.05rem", lineHeight: "1.6" }}>🎁 Exclusive vehicles, outfits, and helicopters only purchasable by VIP players</p>
              <p style={{ margin: "12px 0", fontSize: "1.05rem", lineHeight: "1.6" }}>💰 Weekly or monthly rewards (Free in-game money or rare items)</p>
              <p style={{ margin: "12px 0", fontSize: "1.05rem", lineHeight: "1.6" }}>⏱ Priority customer support with faster response times</p>
              <p style={{ margin: "12px 0", fontSize: "1.05rem", lineHeight: "1.6" }}>📦 Exclusive VIP missions or events (Higher rewards and unique gameplay)</p>
              <p style={{ margin: "12px 0", fontSize: "1.05rem", lineHeight: "1.6" }}>📞 Access to special in-game services (Call a helicopter or car anytime)</p>
              <p style={{ margin: "12px 0", fontSize: "1.05rem", lineHeight: "1.6" }}>👑 VIP badge next to your username (Stand out from other players)</p>
              <p style={{ margin: "12px 0", fontSize: "1.05rem", lineHeight: "1.6" }}>💬 VIP role in the game server and Discord community</p>
              <p style={{ margin: "12px 0", fontSize: "1.05rem", lineHeight: "1.6" }}>🎮 Priority access to servers or queues</p>
              <p style={{ margin: "12px 0", fontSize: "1.05rem", lineHeight: "1.6" }}>🔒 Early access to updates or new game features</p>
            </div>

            <button 
              onClick={() => setShowPopup(false)}
              style={{
                display: "block",
                margin: "20px auto 0",
                background: "#ff4757",
                color: "#fff",
                padding: "10px 25px",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer"
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
      </div>
        
        {/* Payment Modal */}
        {showPaymentModal && selectedProduct && (
          <div className="payment-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title">Payment Details</h3>
                <button onClick={closeModal} className="close-btn">×</button>
              </div>

              {/* Selected Product Info */}
              <div className="product-info">
                <h4>Selected Package</h4>
                <p><strong>{String(selectedProduct?.coins).includes("Months") ? "Membership: " : "Name: "}</strong> {selectedProduct.name}</p>
                <p><strong>{String(selectedProduct?.coins).includes("Months") ? "Duration: " : "Coins: "}</strong> {selectedProduct?.coins?.toLocaleString()}</p>
                <p><strong>{String(selectedProduct?.coins).includes("Months") ? "" : "Coins: "}</strong> {selectedProduct?.bonus?.toLocaleString() || ""}</p>
                <p><strong>Price:</strong> ${selectedProduct.price}</p>
              </div>

              {/* Payment Methods */}
              <div className="payment-methods">
                <h4>Payment Method</h4>
                <label className="payment-method-option">
                  <input
                    type="radio"
                    name="method"
                    value="card"
                    checked={selectedMethod === 'card'}
                    onChange={() => setSelectedMethod('card')}
                  />
                  Credit/Debit Card
                </label>
                <label className="payment-method-option">
                  <input
                    type="radio"
                    name="method"
                    value="crypto"
                    checked={selectedMethod === 'crypto'}
                    onChange={() => setSelectedMethod('crypto')}
                  />
                  Cryptocurrency
                </label>
              </div>

              {/* Crypto Wallet Selection */}
              {selectedMethod === 'crypto' && (
                <div className="crypto-section">
                  <label>
                    Select Cryptocurrency:
                    <select
                      value={selectedWallet}
                      onChange={(e) => setSelectedWallet(e.target.value)}
                    >
                      <option style={{color: "black"}} value="">Choose a cryptocurrency</option>
                      {walletOptions
                        .filter((wallet) => {
                          // Exclude TUSDTRC20 for Silver and Bronze products
                          if ((selectedProduct?.id?.toLowerCase() === 'silver' || 
                              selectedProduct?.id?.toLowerCase() === 'bronze'  ||
                              selectedProduct?.id?.toLowerCase() === '1mon'    ||
                              selectedProduct?.id?.toLowerCase() === '3mon') && 
                              wallet.value === 'usdttrc20') {
                            return false;
                          }
                          return true;
                        })
                        .map((wallet) => (
                          <option style={{color: "black"}} key={wallet.value} value={wallet.value}>
                            {wallet.label}
                          </option>
                        ))}
                    </select>
                  </label>
                </div>
              )}
              {/* Card Coming Soon */}
              {selectedMethod === 'card' && (
                <div className="coming-soon">
                  Credit/Debit Card payments coming soon!
                </div>
              )}

              <button
                className="confirm-btn"
                onClick={handleConfirm}
                disabled={!selectedMethod || (selectedMethod === 'crypto' && !selectedWallet) || isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Confirm Payment'}
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Purchase;