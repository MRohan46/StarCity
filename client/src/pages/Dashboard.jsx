import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('account');
  const navigate = useNavigate();

  const handleNavigation = (tab) => {
    if (tab === 'pending') {
      navigate('/payment');
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>Dashboard</h2>
        <ul>
          <li
            className={activeTab === 'account' ? 'active' : ''}
            onClick={() => handleNavigation('account')}
          >
            Account Info
          </li>
          <li className="dropdown-label">Billing</li>
          <li
            className="dropdown-item"
            onClick={() => handleNavigation('pending')}
          >
            Pending Payments
          </li>
        </ul>
      </aside>

      <main className="main-content">
        {activeTab === 'account' && (
          <div className="account-info">
            <h3>Account Information</h3>
            <p><strong>Name:</strong> John Doe</p>
            <p><strong>Email:</strong> john@example.com</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
