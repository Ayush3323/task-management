import React, { useState, useEffect } from 'react';
import Widget from '../Widget';
import { FiTrendingUp, FiTrendingDown, FiUsers, FiPackage, FiClipboard, FiAlertTriangle, FiCheckCircle, FiClock, FiDollarSign, FiBarChart, FiActivity, FiSettings, FiTruck, FiBox, FiThermometer, FiRotateCcw } from 'react-icons/fi';

const AdminDashboard = ({ userData }) => {
  const [stats, setStats] = useState({
    activeTasks: 12,
    completedTasks: 45,
    totalMachines: 8,
    operationalMachines: 6,
    totalParts: 156,
    lowStockParts: 3,
    totalEmployees: 24,
    activeEmployees: 22,
    monthlyRevenue: 125000,
    monthlyExpenses: 89000,
    efficiency: 87,
    uptime: 94.5
  });

  // Plant-specific maintenance counts
  const [plantStats, setPlantStats] = useState({
    batching: 3,
    mixing: 2,
    conveying: 5,
    packing: 4,
    heating: 1,
    milling: 2
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, user: 'Alice Johnson', action: 'completed Task T001', time: '2 minutes ago', type: 'success' },
    { id: 2, user: 'Bob Smith', action: 'updated Machine M003', time: '15 minutes ago', type: 'info' },
    { id: 3, user: 'Carol Davis', action: 'reported issue with Part P045', time: '1 hour ago', type: 'warning' },
    { id: 4, user: 'David Wilson', action: 'started maintenance on Machine M007', time: '2 hours ago', type: 'info' },
    { id: 5, user: 'Eva Brown', action: 'completed Task T023', time: '3 hours ago', type: 'success' }
  ]);

  const [machineStatus, setMachineStatus] = useState([
    { id: 'M001', name: 'Production Line A', status: 'operational', efficiency: 92, lastMaintenance: '2024-01-15' },
    { id: 'M002', name: 'Assembly Unit B', status: 'operational', efficiency: 88, lastMaintenance: '2024-01-10' },
    { id: 'M003', name: 'Quality Control C', status: 'maintenance', efficiency: 0, lastMaintenance: '2024-01-20' },
    { id: 'M004', name: 'Packaging Line D', status: 'operational', efficiency: 95, lastMaintenance: '2024-01-12' },
    { id: 'M005', name: 'Storage System E', status: 'offline', efficiency: 0, lastMaintenance: '2024-01-08' }
  ]);

  // Plant categories with icons
  const plantCategories = [
    { id: 'batching', name: 'Batching', icon: <FiPackage />, color: '#3b82f6' },
    { id: 'mixing', name: 'Mixing', icon: <FiRotateCcw />, color: '#10b981' },
    { id: 'conveying', name: 'Conveying', icon: <FiTruck />, color: '#f59e0b' },
    { id: 'packing', name: 'Packing', icon: <FiBox />, color: '#8b5cf6' },
    { id: 'heating', name: 'Heating', icon: <FiThermometer />, color: '#ef4444' },
    { id: 'milling', name: 'Milling', icon: <FiSettings />, color: '#6b7280' }
  ];

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        activeTasks: Math.max(0, prev.activeTasks + Math.floor(Math.random() * 3) - 1),
        efficiency: Math.max(80, Math.min(95, prev.efficiency + Math.floor(Math.random() * 6) - 3))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational': return 'var(--success-color)';
      case 'maintenance': return 'var(--warning-color)';
      case 'offline': return 'var(--error-color)';
      default: return 'var(--text-muted)';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational': return <FiCheckCircle />;
      case 'maintenance': return <FiClock />;
      case 'offline': return <FiAlertTriangle />;
      default: return <FiActivity />;
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'success': return <FiCheckCircle style={{ color: 'var(--success-color)' }} />;
      case 'warning': return <FiAlertTriangle style={{ color: 'var(--warning-color)' }} />;
      case 'info': return <FiActivity style={{ color: 'var(--info-color)' }} />;
      default: return <FiActivity />;
    }
  };

  return (
    <div className="dashboard-grid">
      {/* Maintenance Overview Cards - Similar to client images */}
      {/* <div className="maintenance-overview">
        {plantCategories.map((plant) => (
          <Widget key={plant.id} className="plant-card" title={plant.name}>
            <div className="plant-card-content">
              <div className="plant-icon" style={{ color: plant.color }}>
                {plant.icon}
              </div>
              <div className="plant-count">
                {plantStats[plant.id] || 0}
              </div>
            </div>
          </Widget>
        ))}
      </div> */}

      {/* Key Metrics Row */}
      <Widget className="widget-primary" title={`System Overview - ${userData?.fullName || 'Administrator'}`}>
        <div className="widget-stats">
          <div className="widget-stat">
            <span className="stat-value">{stats.activeTasks}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="widget-stat">
            <span className="stat-value">{stats.completedTasks}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
        <div className="widget-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(stats.completedTasks / (stats.activeTasks + stats.completedTasks)) * 100}%` }}
            ></div>
          </div>
        </div>
        <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Complete system administration and monitoring
        </div>
      </Widget>

      <Widget className="widget-success" title="Machine Status">
        <div className="widget-stats">
          <div className="widget-stat">
            <span className="stat-value">{stats.operationalMachines}</span>
            <span className="stat-label">Operational</span>
          </div>
          <div className="widget-stat">
            <span className="stat-value">{stats.totalMachines - stats.operationalMachines}</span>
            <span className="stat-label">Offline</span>
          </div>
        </div>
        <div className="widget-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(stats.operationalMachines / stats.totalMachines) * 100}%` }}
            ></div>
          </div>
        </div>
      </Widget>

      <Widget className="widget-warning" title="Inventory Status">
        <div className="widget-stats">
          <div className="widget-stat">
            <span className="stat-value">{stats.totalParts}</span>
            <span className="stat-label">Total Parts</span>
          </div>
          <div className="widget-stat">
            <span className="stat-value">{stats.lowStockParts}</span>
            <span className="stat-label">Low Stock</span>
          </div>
        </div>
        <div className="widget-actions">
          <button className="widget-button">View Inventory</button>
          <button className="widget-button">Order Parts</button>
        </div>
      </Widget>

      <Widget title="Employee Overview">
        <div className="widget-stats">
          <div className="widget-stat">
            <span className="stat-value">{stats.totalEmployees}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="widget-stat">
            <span className="stat-value">{stats.activeEmployees}</span>
            <span className="stat-label">Active</span>
          </div>
        </div>
        <div className="widget-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(stats.activeEmployees / stats.totalEmployees) * 100}%` }}
            ></div>
          </div>
        </div>
      </Widget>

      {/* Financial Overview */}
      <Widget title="Financial Overview">
        <div className="widget-stats">
          <div className="widget-stat">
            <span className="stat-value">${(stats.monthlyRevenue / 1000).toFixed(0)}k</span>
            <span className="stat-label">Revenue</span>
          </div>
          <div className="widget-stat">
            <span className="stat-value">${(stats.monthlyExpenses / 1000).toFixed(0)}k</span>
            <span className="stat-label">Expenses</span>
          </div>
        </div>
        <div className="widget-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(stats.monthlyExpenses / stats.monthlyRevenue) * 100}%` }}
            ></div>
          </div>
        </div>
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--success-color)' }}>
            ${((stats.monthlyRevenue - stats.monthlyExpenses) / 1000).toFixed(0)}k Profit
          </span>
        </div>
      </Widget>

      {/* Performance Metrics */}
      <Widget title="Performance Metrics">
        <div className="widget-stats">
          <div className="widget-stat">
            <span className="stat-value">{stats.efficiency}%</span>
            <span className="stat-label">Efficiency</span>
          </div>
          <div className="widget-stat">
            <span className="stat-value">{stats.uptime}%</span>
            <span className="stat-label">Uptime</span>
          </div>
        </div>
        <div className="widget-chart">
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <FiBarChart size={40} color="var(--primary-color)" />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Performance trending upward
            </span>
          </div>
        </div>
      </Widget>

      {/* Machine Status Details */}
      <Widget title="Machine Status Details" className="list-widget">
        <div className="widget-content">
          <ul className="widget-list">
            {machineStatus.map(machine => (
              <li key={machine.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {getStatusIcon(machine.status)}
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{machine.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {machine.status.charAt(0).toUpperCase() + machine.status.slice(1)}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '600', color: getStatusColor(machine.status) }}>
                    {machine.efficiency}%
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {machine.lastMaintenance}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Widget>

      {/* Recent Activity */}
      <Widget title="Recent Activity" className="list-widget">
        <div className="widget-content">
          <ul className="widget-list">
            {recentActivity.map(activity => (
              <li key={activity.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {getActivityIcon(activity.type)}
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{activity.user}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {activity.action}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {activity.time}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="widget-actions">
          <button className="widget-button">View All Activity</button>
        </div>
      </Widget>

      {/* Quick Actions */}
      <Widget title="Quick Actions">
        <div className="widget-content">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <button className="widget-button" style={{ width: '100%', padding: '1rem' }}>
              <FiClipboard style={{ marginRight: '0.5rem' }} />
              Create Task
            </button>
            <button className="widget-button" style={{ width: '100%', padding: '1rem' }}>
              <FiPackage style={{ marginRight: '0.5rem' }} />
              Add Machine
            </button>
            <button className="widget-button" style={{ width: '100%', padding: '1rem' }}>
              <FiUsers style={{ marginRight: '0.5rem' }} />
              Add Employee
            </button>
            <button className="widget-button" style={{ width: '100%', padding: '1rem' }}>
              <FiBarChart style={{ marginRight: '0.5rem' }} />
              Generate Report
            </button>
          </div>
        </div>
      </Widget>
    </div>
  );
};

export default AdminDashboard;
