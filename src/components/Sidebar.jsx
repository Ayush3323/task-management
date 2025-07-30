import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { themes } from '../themes';
import './Sidebar.css';
import { FiGrid, FiSettings, FiUsers, FiClipboard, FiPackage, FiLogOut } from 'react-icons/fi';

const Sidebar = ({ setRole }) => {
  const [currentTheme, setCurrentTheme] = useState('default');
  const [currentRole, setCurrentRole] = useState('Admin');

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setCurrentRole(newRole);
    setRole(newRole);
  };

  const handleThemeChange = (e) => {
    const newTheme = e.target.value;
    setCurrentTheme(newTheme);
  };

  useEffect(() => {
    const theme = themes[currentTheme];
    for (const [key, value] of Object.entries(theme)) {
      document.documentElement.style.setProperty(key, value);
    }
  }, [currentTheme]);
  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <FiSettings />
          <span>CRM</span>
        </div>
      </div>
      <ul className="sidebar-nav">
        <li><NavLink to="/"><FiGrid /><span>Dashboard</span></NavLink></li>
                <li><NavLink to="/machines"><FiPackage /><span>Machines</span></NavLink></li>
        <li><NavLink to="/parts"><FiSettings /><span>Parts</span></NavLink></li>
        <li><NavLink to="/tasks"><FiClipboard /><span>Tasks</span></NavLink></li>
        <li><NavLink to="/employees"><FiUsers /><span>Employees</span></NavLink></li>
      </ul>
            <div className="sidebar-footer">
        <div className="theme-switcher">
          <select value={currentTheme} onChange={handleThemeChange}>
            <option value="default">Default</option>
            <option value="dark">Dark</option>
            <option value="corporate">Corporate</option>
          </select>
        </div>

        <div className="role-switcher">
          <select value={currentRole} onChange={handleRoleChange}>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Employee">Employee</option>
          </select>
        </div>
        <a href="#"><FiLogOut /><span>Logout</span></a>
      </div>
    </nav>
  );
};

export default Sidebar;
