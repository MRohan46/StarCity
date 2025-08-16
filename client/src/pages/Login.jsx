import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuthRedirect from "../hooks/useAuthRedirect";
import rplogo from "/images/rplogo.png"; // adjust path
import fav from "/images/fav.jpg"; // adjust path
import loginBg from "/images/login.jpg"; // adjust path
import "../styles/login.css"
import useUserData from "../hooks/useAuthRedirect.js";

const Login = () => {
  useAuthRedirect({ redirectIfAuth: true });
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false)
  const host = "https://api.starcityrp.com";

  useUserData({
    onSuccess: () => {
      setShowDashboard(true);
    }
  });


  
  //const host = "http://localhost:5000";
     const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
  
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
  

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!emailOrUsername || !password) {
      return toast.warn("⚠️ Please fill in all fields");
    }

    setLoading(true);

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
        toast.success("✅ Logged in successfully");
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        toast.error(`❌ ${res.data.message}`);
        setLoading(false);
      }
    } catch (err) {
      toast.error(
        `❌ ${err.response?.data?.message || "Something went wrong"}`
      );
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
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
            <a href="dashboard">Dashboard</a>
          ) : (
            <>
              <a href="login" className="login-btn">LOGIN</a>
              <a href="signup" className="login-btn">Signup</a>
            </>
          )
        }
        <a href="purchase" className="shop-link">
          SHOP <span style={{ color: "red" }}>-30%</span>
        </a>
        <a href="#footer">SOCIALS</a>
      </div>


      <section
        className="login-section"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 20px",
          background: `linear-gradient(120deg, #0a0a0a 40%, #111 100%), url(${loginBg}) no-repeat center center / cover`,
        }}
      >
        <div
          className="form"
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(20px)",
            borderRadius: "16px",
            padding: "40px",
            maxWidth: "400px",
            width: "100%",
            boxShadow: "0 0 25px rgba(255, 215, 0, 0.15)",
            animation: "floatIn 0.8s ease",
          }}
        >
          <h1
            style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: "2rem",
              marginBottom: "20px",
              color: "#ffd700",
              textAlign: "center",
              textShadow: "0 0 10px #ffd700",
            }}
          >
            WELCOME BACK
          </h1>
          <div
            className="social-login"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              }}
              >
              {/* Social Logins 
            <button
              style={{
                background: "#000",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              <img
                src="https://img.icons8.com/color/48/google-logo.png"
                width="24"
                alt="Google"
              />{" "}
              Login with Google
            </button>
            <button
              style={{
                background: "#1877f2",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              <img
                src="https://img.icons8.com/color/48/facebook-new.png"
                width="24"
                alt="Facebook"
              />{" "}
              Login with Facebook
            </button>
            <button
              style={{
                background: "#1c1c1e",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              <img
                src="https://img.icons8.com/color/48/mac-os--v1.png"
                width="24"
                alt="Apple"
              />{" "}
              Login with Apple
            </button>
          </div>

          <div
            style={{
              margin: "25px 0",
              textAlign: "center",
              position: "relative",
            }}
          >
            <span
              style={{
                background: "#0a0a0a",
                padding: "0 10px",
                zIndex: 1,
                position: "relative",
              }}
            >
              OR
            </span>
            <div
              style={{
                height: "1px",
                background: "#444",
                width: "100%",
                position: "absolute",
                top: "50%",
                left: 0,
                zIndex: 0,
              }}
            ></div>
                */}
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "20px", position: "relative" }}>
              <input
                type="text"
                placeholder="Email Address or Username"
                required
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 40px 12px 12px",
                  border: "none",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.05)",
                  color: "white",
                }}
              />
              <img
                src="https://img.icons8.com/material-outlined/24/mail.png"
                alt="Email Icon"
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
            </div>
            <div style={{ marginBottom: "25px", position: "relative" }}>
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 40px 12px 12px",
                  border: "none",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.05)",
                  color: "white",
                }}
              />
              <img
                src="https://img.icons8.com/material-outlined/24/lock--v1.png"
                alt="Password Icon"
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                background: "#ffd700",
                color: "#000",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "0.3s",
              }}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <br />
          <a
            style={{
              color: "#ffd700",
              margin: "0 10px",
              textDecoration: "none",
            }}
            href="/signup"
          >
            New user? Click to Register
          </a>
        </div>
      </section>

      <footer
        id="footer"
        style={{
          padding: "60px 20px",
          background: "#111",
          textAlign: "center",
          color: "#aaa",
        }}
      >
        <img
          src={rplogo}
          alt="Starcity Logo"
          style={{
            width: "60px",
            marginBottom: "15px",
            filter: "drop-shadow(0 0 10px #ffd700)",
          }}
        />
        <h2
          style={{
            fontFamily: "'Orbitron', monospace",
            color: "#ffd700",
            fontSize: "1.2rem",
            marginBottom: "20px",
          }}
        >
          JOIN OUR SOCIALS
        </h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "15px",
          }}
        >
          <a href="https://t.me/starcityrpg">Telegram</a>
          <a href="https://discord.gg/star-city-official">Discord</a>
          <a href="https://youtube.com/@starcityrporg">YouTube</a>
          <a href="https://www.instagram.com/starcityrpg">Instagram</a>
          <a href="https://x.com/starcityrpg">Twitter</a>
        </div>
        <p style={{ marginTop: "25px", fontSize: "12px" }}>
          &copy; 2025 Starcity RP. All rights reserved.
        </p>
      </footer>
    </>
  );
};

export default Login;
