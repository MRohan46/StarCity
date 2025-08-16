import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useUserData from "../hooks/useAuthRedirect.js"
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const host = "https://api.starcityrp.com";
  const [showDashboard, setShowDashboard] = useState(false)
  useUserData({
    onSuccess: () => {
      setShowDashboard(true);
    }
  });


  //const host = "http://localhost:5000";
  const [form, setForm] = useState({
    fname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { fname, username, email, password, confirmPassword } = form;

    if (!fname || !username || !email || !password || !confirmPassword) {
      return toast.warn("⚠️ All fields are required");
    }
    if (password !== confirmPassword) {
      return toast.error("⚠️ Passwords do not match");
    }

    setLoading(true);

    try {
      const res = await axios.post(`${host}/api/auth/signup`, form, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("✅ Registered successfully");

        try {
          await axios.post(
            `${host}/api/auth/resend-otp`,
            {},
            { withCredentials: true }
          );
        } catch {
          toast.error("⚠️ Failed to send OTP. Try again.");
        }

        setTimeout(() => {
          window.location.href = "/email-verify";
        }, 10);
      } else {
        toast.error(`❌ ${res.data.message}`);
      }
    } catch (err) {
      toast.error(
        `❌ ${err.response?.data?.message || "Something went wrong"}`
      );
    }
    setLoading(false);
  };
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
  
  return (
    <>
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
                <a href="login" >LOGIN</a>
                <a href="signup" >Signup</a>
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

      <ToastContainer position="top-right" autoClose={3000} />

      <section
        className="login-section"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 20px",
          background:
            "linear-gradient(120deg, #0a0a0a 40%, #111 100%), url('/images/login.jpg') no-repeat center center / cover",
          color: "#fff",
          fontFamily: "'Rajdhani', sans-serif",
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(20px)",
            borderRadius: "16px",
            padding: "40px",
            maxWidth: "400px",
            width: "100%",
            boxShadow: "0 0 25px rgba(255, 215, 0, 0.15)",
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
            WELCOME To Starcity!
          </h1>

          {/* Social Signup 
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <button style={socialBtnStyle("#000")}>
              <img
                src="https://img.icons8.com/color/48/google-logo.png"
                width="24"
                alt="Google"
              />{" "}
              Signup with Google
            </button>
            <button style={socialBtnStyle("#1877f2")}>
              <img
                src="https://img.icons8.com/color/48/facebook-new.png"
                width="24"
                alt="Facebook"
              />{" "}
              Signup with Facebook
            </button>
            <button style={socialBtnStyle("#1c1c1e")}>
              <img
                src="https://img.icons8.com/color/48/mac-os--v1.png"
                width="24"
                alt="Apple"
              />{" "}
              Signup with Apple
            </button>
          </div>

          */}
          {/* OR Separator */}
          <div style={{ margin: "25px 0", textAlign: "center", position: "relative" }}>
            <span style={{ background: "#0a0a0a", padding: "0 10px" }}>OR</span>
            <div
              style={{
                height: "1px",
                background: "#444",
                width: "100%",
                position: "absolute",
                top: "50%",
                left: 0,
              }}
            ></div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleRegister}>
            {inputField("text", "fname", "Full Name", form.fname, handleChange)}
            {inputField("text", "username", "Username", form.username, handleChange)}
            {inputField("email", "email", "Email Address", form.email, handleChange)}
            {inputField("password", "password", "Password", form.password, handleChange)}
            {inputField(
              "password",
              "confirmPassword",
              "Confirm Password",
              form.confirmPassword,
              handleChange
            )}

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
              }}
            >
              {loading ? "Signing up..." : "Signup"}
            </button>
          </form>

          <br />
          <a style={{ color: "#ffd700", textDecoration: "none" }} href="/login">
            Already Have an Account? Login
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
};

// Reusable Input Component
const inputField = (type, name, placeholder, value, onChange) => (
  <div style={{ marginBottom: "20px", position: "relative" }}>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
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
      src={
        type === "password"
          ? "https://img.icons8.com/material-outlined/24/lock--v1.png"
          : type === "email"
          ? "https://img.icons8.com/material-outlined/24/mail.png"
          : "https://img.icons8.com/material-outlined/24/user.png"
      }
      alt={name}
      style={{
        position: "absolute",
        right: "12px",
        top: "50%",
        transform: "translateY(-50%)",
      }}
    />
  </div>
);

// Social button styling
const socialBtnStyle = (bg) => ({
  background: bg,
  color: "#fff",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "12px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
});

export default Register;
