import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserData from "../hooks/useAuthRedirect";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [user, setUser] = useState();
  const navigate = useNavigate();
  useUserData({
    onSuccess: (data) => {
      setUser(data);
    }
  });


  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavigation = (tab) => {
    if (tab === "pending") {
      navigate("/payment");
    } else if (tab === "paid") {
      navigate("/paid");
    } else {
      setActiveTab(tab);
    }
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div
      style={{
        color: "black",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        height: "100vh",
        fontFamily: "sans-serif",
        background: "#f4f4f4",
      }}
    >
      {/* Sidebar */}
      {sidebarOpen && (
        <aside
          style={{
            width: isMobile ? "100%" : "250px",
            background: "#222",
            color: "#fff",
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>Dashboard</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li
              style={{
                padding: "10px",
                background: activeTab === "account" ? "#444" : "transparent",
                cursor: "pointer",
              }}
              onClick={() => handleNavigation("account")}
            >
              Account Info
            </li>
            <li
              style={{
                padding: "10px",
                opacity: 0.7,
                fontWeight: "bold",
                marginTop: "10px",
              }}
            >
              Billing
            </li>
            <li
              style={{
                padding: "10px",
                background: activeTab === "pending" ? "#444" : "transparent",
                cursor: "pointer",
              }}
              onClick={() => handleNavigation("pending")}
            >
              Pending Payments
            </li>
            <li
              style={{
                padding: "10px",
                background: activeTab === "paid" ? "#444" : "transparent",
                cursor: "pointer",
              }}
              onClick={() => handleNavigation("paid")}
            >
              Paid Payments
            </li>
          </ul>
        </aside>
      )}

      {/* Mobile toggle button */}
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            padding: "10px",
            background: "#222",
            color: "#fff",
            border: "none",
            width: "100%",
            cursor: "pointer",
          }}
        >
          {sidebarOpen ? "Close Menu" : "Open Menu"}
        </button>
      )}

      {/* Main content */}
      <main
        style={{
          flex: 1,
          padding: "20px",
          overflowY: "auto",
        }}
      >
    {activeTab === "account" && user && (
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h3>Account Information</h3>
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Username:</strong> {user?.username}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Last Login:</strong>{user?.lastLogin
                                        ? new Date(user.lastLogin).toLocaleString("en-US", {
                                            dateStyle: "medium",
                                            timeStyle: "short",
                                          })
                                        : "Never"}
        </p>
        <p><strong>Coins Balance:</strong> {user?.coins}</p>
      </div>
    )}
      </main>
    </div>
  );
};

export default Dashboard;
