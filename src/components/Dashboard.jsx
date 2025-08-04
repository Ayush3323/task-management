import React from 'react';
import Lottie from 'lottie-react';
import './Dashboard.css';
import { FiSearch, FiBell, FiUser, FiClipboard, FiUsers, FiPackage, FiSettings, FiGrid } from 'react-icons/fi';
import animationData from '../animations/header-animation.json';
import AdminDashboard from './dashboards/AdminDashboard';
import ManagerDashboard from './dashboards/ManagerDashboard';
import EmployeeDashboard from './dashboards/EmployeeDashboard';

const Dashboard = ({ userData }) => {
  const renderDashboard = () => {
    switch (userData?.role) {
      case 'Admin':
        return <AdminDashboard userData={userData} />;
      case 'Manager':
        return <ManagerDashboard userData={userData} />;
      case 'Employee':
        return <EmployeeDashboard userData={userData} />;
      default:
        return <AdminDashboard userData={userData} />;
    }
  };

  const getRoleSpecificHeader = () => {
    switch (userData?.role) {
      case 'Admin':
        return {
          title: 'Admin Dashboard',
          subtitle: 'Complete system overview and management',
          icon: <FiSettings />,
          color: 'var(--primary-color)'
        };
      case 'Manager':
        return {
          title: 'Manager Dashboard',
          subtitle: 'Team management and task oversight',
          icon: <FiUsers />,
          color: 'var(--warning-color)'
        };
      case 'Employee':
        return {
          title: 'My Dashboard',
          subtitle: 'Personal tasks and performance tracking',
          icon: <FiClipboard />,
          color: 'var(--success-color)'
        };
      default:
        return {
          title: 'Dashboard',
          subtitle: 'Welcome to the task management system',
          icon: <FiGrid />,
          color: 'var(--primary-color)'
        };
    }
  };

  const headerInfo = getRoleSpecificHeader();

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <div className="header-animation">
            <Lottie animationData={animationData} loop={true} />
          </div>
          <div className="header-info">
            <div className="header-title">
              {headerInfo.icon}
              <h1>{headerInfo.title}</h1>
            </div>
            <p className="header-subtitle">{headerInfo.subtitle}</p>
          </div>
        </div>
        
        <div className="header-center">
          <div className="header-search">
            <FiSearch />
            <input 
              type="text" 
              placeholder={
                userData?.role === 'Admin' ? 'Search across all data...' :
                userData?.role === 'Manager' ? 'Search tasks and team...' :
                'Search my tasks...'
              } 
            />
          </div>
        </div>
        
        <div className="header-actions">
          <button className="icon-button notification-btn">
            <FiBell />
            <span className="notification-badge">3</span>
          </button>
          <div className="user-profile">
            <div className="user-avatar">
              <FiUser />
            </div>
            <div className="user-info">
              <span className="user-name">{userData?.fullName || 'User'}</span>
              <span className="user-role">{userData?.role || 'Employee'}</span>
              <span className="user-department">{userData?.department || 'General'}</span>
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
