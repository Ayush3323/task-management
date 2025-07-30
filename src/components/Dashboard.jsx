import React from 'react';
import Lottie from 'lottie-react';
import './Dashboard.css';
import { FiSearch, FiBell, FiUser } from 'react-icons/fi';
import animationData from '../animations/header-animation.json';
import AdminDashboard from './dashboards/AdminDashboard';
import ManagerDashboard from './dashboards/ManagerDashboard';
import EmployeeDashboard from './dashboards/EmployeeDashboard';

const Dashboard = ({ role }) => {
  const renderDashboard = () => {
    switch (role) {
      case 'Admin':
        return <AdminDashboard />;
      case 'Manager':
        return <ManagerDashboard />;
      case 'Employee':
        return <EmployeeDashboard />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div className="header-animation">
          <Lottie animationData={animationData} loop={true} />
        </div>
        <div className="header-search">
          <FiSearch />
          <input type="text" placeholder="Search..." />
        </div>
        <div className="header-actions">
          <button className="icon-button">
            <FiBell />
          </button>
          <div className="user-profile">
            <FiUser />
            <div className="user-info">
              <span className="user-name">Emma Hayes</span>
              <span className="user-role">{role}</span>
            </div>
          </div>
        </div>
      </header>
      <div className="dashboard-content">
        {renderDashboard()}
      </div>
    </main>
  );
};

export default Dashboard;
