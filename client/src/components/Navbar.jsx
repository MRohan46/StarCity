import React, {useEffect, useState} from "react";

const Navbar = (scrolled, menuOpen, setScrolled, setMenuOpen) => {
  return (
    <>
    {/* Navigation */}
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`} id="navbar">
        <div className="nav-container">
          <div className="logo">
            <img src="/images/rplogo.png" alt="Starcity RP Logo" />
          </div>

          <div className="nav-links">
            <a href="#home">HOME</a>
            <a href="#footer">SOCIALS</a>
            <a href="purchase" className="shop-link">SHOP</a>
          </div>

          <a href="login" className="login-btn">LOGIN</a>
          <a href="signup" className="login-btn">Signup</a>

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
        <a href="#home">HOME</a>
        <a href="login">LOGIN</a>
        <a href="signup">Signup</a>
        <a href="purchase" className="shop-link">
          SHOP <span style={{ color: "red" }}>-30%</span>
        </a>
        <a href="#footer">SOCIALS</a>
      </div>
      </>
  );
};

export default Navbar;
