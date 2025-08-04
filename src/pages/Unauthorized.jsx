import React from 'react';
import { Link } from 'react-router-dom';
import { FiLock, FiHome, FiArrowLeft } from 'react-icons/fi';
import './Unauthorized.css';

const Unauthorized = () => {
  return (
    <div className="unauthorized-container">
      <div className="unauthorized-card">
        <div className="unauthorized-icon">
          <FiLock />
        </div>
        <h1>Access Denied</h1>
        <p>You don't have permission to access this page.</p>
        <p>Please contact your administrator if you believe this is an error.</p>
        
        <div className="unauthorized-actions">
          <Link to="/" className="btn-primary">
            <FiHome />
            Go to Dashboard
          </Link>
          <button onClick={() => window.history.back()} className="btn-secondary">
            <FiArrowLeft />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized; 