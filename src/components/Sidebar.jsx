import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { themes } from '../themes';
import './Sidebar.css';
import { FiGrid, FiSettings, FiUsers, FiClipboard, FiPackage, FiLogOut, FiUser, FiBarChart, FiTarget, FiActivity } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ userData }) => {
  const { logout, canManageMachines, canManageParts, canManageTasks, canManageEmployees } = useAuth();
  const [currentTheme, setCurrentTheme] = useState('default');

  const handleThemeChange = (e) => {
    const newTheme = e.target.value;
    setCurrentTheme(newTheme);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const theme = themes[currentTheme];
    for (const [key, value] of Object.entries(theme)) {
      document.documentElement.style.setProperty(key, value);
    }
  }, [currentTheme]);

  // Role-specific navigation items
  const getNavigationItems = () => {
    const baseItems = [
      { to: "/", icon: <FiGrid />, label: "Dashboard" }
    ];

    switch (userData?.role) {
      case 'Admin':
        return [
          ...baseItems,
          { to: "/machines", icon: <FiPackage />, label: "Machines", show: canManageMachines() },
          { to: "/parts", icon: <FiSettings />, label: "Parts", show: canManageParts() },
          { to: "/tasks", icon: <FiClipboard />, label: "Tasks", show: canManageTasks() },
          { to: "/employees", icon: <FiUsers />, label: "Employees", show: canManageEmployees() }
        ];
      
      case 'Manager':
        return [
          ...baseItems,
          { to: "/tasks", icon: <FiClipboard />, label: "Tasks", show: canManageTasks() },
          { to: "/employees", icon: <FiUsers />, label: "Team", show: canManageEmployees() },
          { to: "/machines", icon: <FiPackage />, label: "Machines", show: canManageMachines() }
        ];
      
      case 'Employee':
        return [
          ...baseItems,
          { to: "/tasks", icon: <FiClipboard />, label: "My Tasks", show: canManageTasks() }
        ];
      
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <FiSettings />
          <span>Task Management</span>
        </div>
      </div>

      {/* User Info */}
      {userData && (
        <div className="user-info">
          <div className="user-avatar">
            <FiUser />
          </div>
          <div className="user-details">
            <h4>{userData.fullName}</h4>
            <span className="user-role">{userData.role}</span>
            <span className="user-department">{userData.department}</span>
          </div>
        </div>
      )}

      <ul className="sidebar-nav">
        {navigationItems.map((item, index) => (
          item.show !== false && (
            <li key={index}>
              <NavLink to={item.to}>
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          )
        ))}
      </ul>

      <div className="sidebar-footer">
        <div className="theme-switcher">
          <select value={currentTheme} onChange={handleThemeChange}>
            <option value="default">Default</option>
            <option value="dark">Dark</option>
            <option value="corporate">Corporate</option>
          </select>
        </div>

        <button onClick={handleLogout} className="logout-btn">
          <FiLogOut />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
