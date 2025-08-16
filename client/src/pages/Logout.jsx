import React, { useEffect } from "react";
import axios from "axios";

const Logout = () => {
  useEffect(() => {
    axios.post("https://api.starcityrp.com/api/auth/logout", {}, { withCredentials: true })
      .then(() => {
        console.log("Logged out successfully");
        // Optionally redirect
        window.location.href = "/login";
      })
      .catch((err) => {
        console.error("Logout failed:", err);
      });
  }, []);

  return <p>Logging out...</p>; // Optional UI feedback
};

export default Logout;
