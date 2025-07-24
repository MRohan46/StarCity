import React, { useEffect } from 'react';
import '../styles/home.css';
import { useNavigate } from 'react-router-dom';
import CoinCard from '../components/CoinCard';
import axios from 'axios';


const Home = () => {
  const navigate = useNavigate();
  const coinPacks = [
    {
      name: 'product_1',
      img: '/images/bronze.jpg',
      bonusTag: '10% WEB-STORE BONUS',
      coins: '22,000',
      oldCoins: '20,000',
      bonus: 'BONUS +100',
      price: '$4.99',
    },
    {
      name: 'product_2',
      img: '/images/silver.jpg',
      bonusTag: '10% WEB-STORE BONUS',
      coins: '12,650',
      oldCoins: '11,500',
      bonus: 'BONUS +12%',
      price: '$9.99',
    },
    {
      name: 'product_3',
      img: '/images/platinum.jpg',
      bonusTag: '10% WEB-STORE BONUS',
      coins: '8,250',
      oldCoins: '7,500',
      bonus: 'BONUS +20%',
      price: '$19.99',
    },
    {
      name: 'product_4',
      img: '/images/diamond.jpg',
      bonusTag: '10% WEB-STORE BONUS',
      coins: '8,250',
      oldCoins: '7,500',
      bonus: 'BONUS +5000',
      price: '$79.99',
    },
    {
      name: 'product_5',
      img: '/images/emperor.jpg',
      bonusTag: '10% WEB-STORE BONUS',
      coins: '8,250',
      oldCoins: '7,500',
      bonus: 'BONUS +12,000',
      price: '$149.99',
    },
    {
      name: 'product_6',
      img: '/images/legend.jpg',
      bonusTag: '10% WEB-STORE BONUS',
      coins: '8,250',
      oldCoins: '7,500',
      bonus: 'BONUS +25,000',
      price: '$249.99',
    },
    {
      name: 'product_7',
      img: '/images/royal.jpg',
      bonusTag: '10% WEB-STORE BONUS',
      coins: '8,250',
      oldCoins: '7,500',
      bonus: 'BONUS +40%',
      price: '$349.99',
    },
    {
      name: 'product_8',
      img: '/images/emperor.jpg',
      bonusTag: '10% WEB-STORE BONUS',
      coins: '8,250',
      oldCoins: '7,500',
      bonus: 'BONUS +150,000',
      price: '$499.99',
    },
  ];
  
  useEffect(() => {
    const popupBtnElements = document.querySelectorAll('#popup-form');

    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('https://api.starcityrp.com/api/auth/is-auth', {
          withCredentials: true,
        });

        const res = response.data;

        if (res.success) {
          popupBtnElements.forEach(el => {
            el.innerHTML = '<b>My Dashboard</b>';
            el.onclick = () => {
              window.location.href = 'my-dashboard.html';
            };
          });
        } else {
          popupBtnElements.forEach(el => {
            el.addEventListener('click', () => {
              document.getElementById('formmodal').classList.add('active');
              document.body.style.overflow = 'hidden';
            });
          });
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        popupBtnElements.forEach(el => {
          el.addEventListener('click', () => {
            document.getElementById('formmodal').classList.add('active');
            document.body.style.overflow = 'hidden';
          });
        });
      }
    };

    checkLoginStatus();
  }, []);
  const handlePurchase = (pack) => {
    console.log(pack)
    navigate('/purchase', { state: pack });
  };

  return (
    <>
      <div style={{ backgroundColor: 'black' }}>
      <header>
        <nav>
          <img src="/images/rplogo.png" alt="icon" id="icon" />
          <div style={{ fontSize: '15px' }} className="login" id="popup-form">
            <b>AUTHORIZATION</b>
          </div>
        </nav>
      </header>

      <div className="form" id="formmodal">
        <div className="div1">
          <b>AUTHORIZATION</b>
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 48 48" className="close" id="close">
            <path fill="#f44336" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path>
            <path fill="#fff" d="M29.656,15.516l2.828,2.828l-14.14,14.14l-2.828-2.828L29.656,15.516z"></path>
            <path fill="#fff" d="M32.484,29.656l-2.828,2.828l-14.14-14.14l2.828-2.828L32.484,29.656z"></path>
          </svg>
        </div>

        <div className="social-login">
          <button className="social-button" style={{ backgroundColor: 'black', color: 'white' }}>
            <img src="https://img.icons8.com/color/48/google-logo.png" alt="google-logo" className="social-icon" />
            Login With Google
          </button>
          <button className="social-button" style={{ backgroundColor: 'rgb(18, 61, 192)', color: 'white' }}>
            <img src="https://img.icons8.com/color/48/facebook-new.png" alt="facebook-new" className="social-icon" />
            Login With Facebook
          </button>
          <button className="social-button">
            <img src="https://img.icons8.com/color/48/mac-os--v1.png" alt="mac-os--v1" className="social-icon" />
            Login With Apple
          </button>
          <p className="separator"><span>OR</span></p>
        </div>

        <form className="login-form" id="loginForm">
          <div className="input">
            <input type="email" name="email" placeholder="Email address" className="input-field" required />
            <img src="https://img.icons8.com/material-outlined/24/mail.png" alt="mail" className="form-icon" />
          </div>

          <div className="input">
            <input type="password" name="password" placeholder="Password" className="input-field" required />
            <img src="https://img.icons8.com/material-outlined/24/lock--v1.png" alt="lock" className="form-icon" />
          </div>

          <button className="login-button" type="submit">Log In</button>
        </form>
      </div>

      <div className="first">
        <div className="store">
          <a href="#" className="store-button">
            <img src="https://img.icons8.com/fluency/48/google-play-store-new.png" alt="Google Play Logo" width="40" height="40" />
            <div className="text-container">
              <small>Download on the</small>
              <strong>Google Play</strong>
            </div>
          </a>

          <a href="#" className="store-button">
            <img src="https://img.icons8.com/fluency/48/apple-app-store.png" alt="App Store" width="40" height="40" />
            <div className="text-container">
              <small>Download on the</small>
              <strong>App Store</strong>
            </div>
          </a>
        </div>
      </div>

      <div className="login2">
        <div style={{ fontSize: '15px' }} className="log" id="popup-form">
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 30 30">
            <path d="M18,19v-2c0.45-0.223,1.737-1.755,1.872-2.952c0.354-0.027,0.91-0.352,1.074-1.635c0.088-0.689-0.262-1.076-0.474-1.198c0,0,0.528-1.003,0.528-2.214c0-2.428-0.953-4.5-3-4.5c0,0-0.711-1.5-3-1.5c-4.242,0-6,2.721-6,6c0,1.104,0.528,2.214,0.528,2.214c-0.212,0.122-0.562,0.51-0.474,1.198c0.164,1.283,0.72,1.608,1.074,1.635C10.263,15.245,11.55,16.777,12,17v2c-1,3-9,1-9,8h24C27,20,19,22,18,19z" />
          </svg>
          <h3>AUTHORIZATION</h3>
        </div>
      </div>

      <img src="/images/show.jpg" alt="purchase gift" className="purchase" ></img>

      <div className="clickable">
        <div className="noglow"><b>DAILY REWARDS</b></div>
        <div className="noglow"><b>STARCITY COIN</b></div>
        <div className="glow">
          <img src="/svg/promo.svg" alt="promo" width="20" height="20" />
          <b>PROMO CODE</b>
        </div>
      </div>

      <div className="coin-purchase" id="starcity-coin">
        <div className="shop-container">
          {coinPacks.slice(0, 4).map((pack, index) => (
            <CoinCard key={index} {...pack} onClick={() => handlePurchase(pack)} />
          ))}
        </div>

        <div className="shop-container">
          {coinPacks.slice(4).map((pack, index) => (
            <CoinCard key={index + 4} {...pack} onClick={() => handlePurchase(pack)} />
          ))}
        </div>
      </div>


      <div className="daily-rewards" id="daily-rewards"></div>
      <div className="promo-code" id="promo-code"></div>
      </div>
    </>
  );
};

export default Home;