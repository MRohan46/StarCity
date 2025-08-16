import React, { useState, useEffect } from "react";
import "../styles/style.css";
import useUserData from "../hooks/useAuthRedirect.js"

const Home = () => {
   const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false)
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

  return (
    <>
      {/* Loading Screen */}
      <div className="loading-screen" id="loadingScreen">
        <div className="loader"></div>
      </div>

      {/* Animated Particles */}
      <div className="particles" id="particles"></div>

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

      {/* Hero Section */}
      <section className="hero" id="home">
        <h1>OPEN WORLD IN A<br />MOBILE MULTIPLAYER GAME</h1>

        <div className="download-section">
          <div className="download-text">AVAILABLE ON</div>
          <div className="store-buttons">
            <a href="#" className="store-button">
              <img className="lazy" loading="lazy" src="https://img.icons8.com/fluency/48/google-play-store-new.png" alt="Google Play" />
              <strong>Google Play</strong>
            </a>
            <a href="#" className="store-button">
              <img className="lazy" loading="lazy" src="https://img.icons8.com/fluency/48/apple-app-store.png" alt="App Store" />
              <strong>App Store</strong>
            </a>
          </div>
        </div>
      </section>

      {/* Role Selection Section */}
      <section className="choose-role">
        <div className="choose-text">
          <h2>IT'S UP TO YOU<br />WHAT <span>YOU WANT</span> TO BE</h2>
          <div className="create-btn">CREATE YOURSELF</div>
        </div>

        <div className="roles">
          {[
            { img: "/images/business person.jpg", title: "BUSINESS PERSON", desc: "Build your empire from the ground up. Hire employees, develop strategies, and dominate the market with your entrepreneurial vision." },
            { img: "/images/army.jpg", title: "ARMY OPERATIVE", desc: "Serve with honor and protect the innocent. Master tactical combat and defend your base from hostile forces threatening the city." },
            { img: "/images/mafia.jpg", title: "CRIME BOSS", desc: "Rule the shadows and command respect. Build your criminal network and become the most feared name in the underworld." }
          ].map((role, i) => (
            <div className="role-card" key={i}>
              <img src={role.img} alt={role.title} />
              <h3>{role.title}</h3>
              <p>{role.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Carousel */}
      <section className="carousel-container">
        <div className="carousel-wrapper">
          {[
            { img: "/images/business.png", title: "Business Mogul", desc: "Money speaks, power listens. The future belongs to those who buy the present and shape tomorrow." },
            { img: "/images/armyy.png", title: "Elite Soldier", desc: "We swore not for peace, but for justice. We stand united, even when the world crumbles around us." },
            { img: "/images/mafia.png", title: "Crime Lord", desc: "Our law is written in blood and sealed with loyalty. We don't forgive betrayal—we eliminate it." },
            { img: "/images/gang.png", title: "Street Warrior", desc: "The streets raised us, the walls remember our names. We don't follow laws—we make our own rules." },
            { img: "/images/doctor.png", title: "Life Saver", desc: "In the heart of chaos, I plant hope. My hands were crafted to fight death and preserve life.", color: "#f0f0f0" },
            { img: "/images/news.png", title: "Truth Seeker", desc: "I shatter silence with unfiltered truth. The world becomes what we choose to expose to light." },
            { img: "/images/lawyer.png", title: "Legal Eagle", desc: "My words aren't weapons—but they win wars in courtrooms and change destinies with justice." },
            { img: "/images/fbi.png", title: "Federal Agent", desc: "We operate where shadows meet light. We don't just reveal secrets—we reshape reality itself." },
            { img: "/images/isos.png", title: "Elite Operative", desc: "We are shadows with purpose, silence with deadly precision. We see through walls and strike without warning." },
            { img: "/images/government.png", title: "Power Broker", desc: "History isn't written by truth—it's crafted by those who control the narrative and shape nations." },
            { img: "/images/police.png", title: "Law Enforcer", desc: "Justice isn't built on fear—it's forged through truth, courage, and unwavering dedication to peace." },
            { img: "/images/judge.png", title: "Justice Keeper", desc: "Between the sword and scales I stand firm. My verdicts serve the law, not emotions or personal gain." }
          ].map((slide, i) => (
            <div className="carousel-slide" key={i}>
              <img src={slide.img} alt={slide.title} />
              <div className="text-overlay" style={slide.color ? { color: slide.color } : {}}>
                <h2>{slide.title}</h2>
                <p>{slide.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" id="footer">
        <h2>JOIN OUR GAMING COMMUNITY</h2>

        <div className="social-icons">
          {[
            { link: "https://t.me/starcityrpg", img: "/svg/icons8-telegram.svg", title: "TELEGRAM", desc: "UPDATES, MEMES, GIVEAWAYS, NEWS" },
            { link: "https://discord.gg/star-city-official", img: "/svg/icons8-discord.svg", title: "DISCORD", desc: "PLAYER & SERVER CHANNELS" },
            { link: "https://youtube.com/@starcityrporg?si=DI_LMEVXLly0bYYx", img: "/svg/icons8-youtube.svg", title: "YOUTUBE", desc: "GUIDES, TRICKS & GAMEPLAY" },
            { link: "https://www.instagram.com/starcityrpg?utm_source=qr&igsh=b2VlZHkxZmZ0cXlv", img: "/svg/icons8-instagram.svg", title: "INSTAGRAM", desc: "EXCLUSIVE CONTENT & RAFFLES" },
            { link: "https://x.com/starcityrpg?t=o3q2yLOQYkv4HvRM1mHlAA&s=09", img: "/svg/icons8-twitter.svg", title: "TWITTER", desc: "BREAKING NEWS & COMPETITIONS" }
          ].map((social, i) => (
            <a style={{"textDecoration": "none",}}href={social.link} className="social-card" key={i}>
              <img src={social.img} alt={social.title} />
              <h3>{social.title}</h3>
              <p>{social.desc}</p>
            </a>
          ))}
        </div>

        <div className="footer-bottom">
          <div className="footer-logo">
            <img className="lazy" loading="lazy" src="/images/rplogo.png" alt="Starcity RP Logo" />
          </div>
          <div className="footer-links">
            <a href="#">SCREENSHOTS</a>
            <a href="#">COMMUNITY</a>
            <a href="#">SHOP</a>
            <a href="#">DOWNLOAD</a>
          </div>
          <div className="legal-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
          <div className="footer-contact">support@starcityrp.com</div>
        </div>
      </footer>
    </>
  );
};

export default Home;
