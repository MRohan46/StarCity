import React from "react";

const Footer = () => {
  return (
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
        src="./images/rplogo.png"
        alt="Starcity Logo"
        style={{
          width: "60px",
          marginBottom: "15px",
          filter: "drop-shadow(0 0 10px var(--gold))",
        }}
      />
      <h2
        style={{
          fontFamily: "'Orbitron', monospace",
          color: "var(--gold)",
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
  );
};

export default Footer;
