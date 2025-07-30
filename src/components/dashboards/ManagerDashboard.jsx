import React, { useState, useEffect } from 'react';
import Widget from '../Widget';
import { FiUsers, FiClipboard, FiPackage, FiTrendingUp, FiTrendingDown, FiCheckCircle, FiClock, FiAlertTriangle, FiBarChart, FiDollarSign, FiTarget, FiActivity } from 'react-icons/fi';

const ManagerDashboard = () => {
  const [stats, setStats] = useState({
    teamSize: 8,
    activeTeamMembers: 7,
    assignedTasks: 15,
    completedTasks: 12,
    pendingTasks: 3,
    teamEfficiency: 85,
    projectProgress: 72,
    budgetUtilization: 68,
    qualityScore: 94,
    onTimeDelivery: 88
  });

  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Alice Johnson', role: 'Senior Developer', status: 'active', tasks: 4, efficiency: 92 },
    { id: 2, name: 'Bob Smith', role: 'UI/UX Designer', status: 'active', tasks: 3, efficiency: 88 },
    { id: 3, name: 'Carol Davis', role: 'QA Engineer', status: 'active', tasks: 2, efficiency: 95 },
    { id: 4, name: 'David Wilson', role: 'DevOps Engineer', status: 'break', tasks: 1, efficiency: 90 },
    { id: 5, name: 'Eva Brown', role: 'Frontend Developer', status: 'active', tasks: 3, efficiency: 87 },
    { id: 6, name: 'Frank Miller', role: 'Backend Developer', status: 'active', tasks: 4, efficiency: 91 }
  ]);

  const [recentUpdates, setRecentUpdates] = useState([
    { id: 1, type: 'task', message: 'Task T001 completed by Alice Johnson', time: '5 minutes ago', priority: 'high' },
    { id: 2, type: 'issue', message: 'Bug reported in module M003', time: '1 hour ago', priority: 'medium' },
    { id: 3, type: 'milestone', message: 'Sprint 3 milestone achieved', time: '2 hours ago', priority: 'low' },
    { id: 4, type: 'task', message: 'Code review completed for PR #45', time: '3 hours ago', priority: 'medium' },
    { id: 5, type: 'meeting', message: 'Team standup scheduled for tomorrow', time: '4 hours ago', priority: 'low' }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        teamEfficiency: Math.max(80, Math.min(95, prev.teamEfficiency + Math.floor(Math.random() * 6) - 3)),
        projectProgress: Math.min(100, prev.projectProgress + Math.floor(Math.random() * 3))
      }));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'var(--success-color)';
      case 'break': return 'var(--warning-color)';
      case 'offline': return 'var(--error-color)';
      default: return 'var(--text-muted)';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'var(--error-color)';
      case 'medium': return 'var(--warning-color)';
      case 'low': return 'var(--success-color)';
      default: return 'var(--text-muted)';
    }
  };

  const getUpdateIcon = (type) => {
    switch (type) {
      case 'task': return <FiClipboard />;
      case 'issue': return <FiAlertTriangle />;
      case 'milestone': return <FiCheckCircle />;
      case 'meeting': return <FiUsers />;
      default: return <FiActivity />;
    }
  };

  return (
    <div className="dashboard-grid">
      {/* Team Overview */}
      <Widget className="widget-primary" title="Team Overview">
        <div className="widget-stats">
          <div className="widget-stat">
            <span className="stat-value">{stats.teamSize}</span>
            <span className="stat-label">Team Size</span>
          </div>
          <div className="widget-stat">
            <span className="stat-value">{stats.activeTeamMembers}</span>
            <span className="stat-label">Active</span>
          </div>
        </div>
        <div className="widget-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(stats.activeTeamMembers / stats.teamSize) * 100}%` }}
            ></div>
          </div>
        </div>
      </Widget>

      <Widget className="widget-success" title="Task Management">
        <div className="widget-stats">
          <div className="widget-stat">
            <span className="stat-value">{stats.completedTasks}</span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="widget-stat">
            <span className="stat-value">{stats.pendingTasks}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
        <div className="widget-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(stats.completedTasks / stats.assignedTasks) * 100}%` }}
            ></div>
          </div>
        </div>
      </Widget>

      <Widget className="widget-warning" title="Project Progress">
        <div className="widget-stats">
          <div className="widget-stat">
            <span className="stat-value">{stats.projectProgress}%</span>
            <span className="stat-label">Progress</span>
          </div>
          <div className="widget-stat">
            <span className="stat-value">{stats.teamEfficiency}%</span>
            <span className="stat-label">Efficiency</span>
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
            <FiTarget size={40} color="var(--primary-color)" />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              On track for deadline
            </span>
          </div>
        </div>
      </Widget>

      <Widget title="Quality Metrics">
        <div className="widget-stats">
          <div className="widget-stat">
            <span className="stat-value">{stats.qualityScore}%</span>
            <span className="stat-label">Quality Score</span>
          </div>
          <div className="widget-stat">
            <span className="stat-value">{stats.onTimeDelivery}%</span>
            <span className="stat-label">On-Time Delivery</span>
          </div>
        </div>
        <div className="widget-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${stats.qualityScore}%` }}
            ></div>
          </div>
        </div>
      </Widget>

      {/* Budget Overview */}
      <Widget title="Budget Overview">
        <div className="widget-stats">
          <div className="widget-stat">
            <span className="stat-value">{stats.budgetUtilization}%</span>
            <span className="stat-label">Utilized</span>
          </div>
          <div className="widget-stat">
            <span className="stat-value">{100 - stats.budgetUtilization}%</span>
            <span className="stat-label">Remaining</span>
          </div>
        </div>
        <div className="widget-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${stats.budgetUtilization}%` }}
            ></div>
          </div>
        </div>
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <span style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--success-color)' }}>
            Budget on track
          </span>
        </div>
      </Widget>

      {/* Team Performance */}
      <Widget title="Team Performance">
        <div className="widget-stats">
          <div className="widget-stat">
            <span className="stat-value">{stats.teamEfficiency}%</span>
            <span className="stat-label">Efficiency</span>
          </div>
          <div className="widget-stat">
            <span className="stat-value">{stats.projectProgress}%</span>
            <span className="stat-label">Progress</span>
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
            <FiTrendingUp size={40} color="var(--success-color)" />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Performance improving
            </span>
          </div>
        </div>
      </Widget>

      {/* Team Members */}
      <Widget title="Team Members" className="list-widget">
        <div className="widget-content">
          <ul className="widget-list">
            {teamMembers.map(member => (
              <li key={member.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    backgroundColor: getStatusColor(member.status) 
                  }}></div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{member.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {member.role} • {member.tasks} tasks
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '600', color: 'var(--success-color)' }}>
                    {member.efficiency}%
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {member.status}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Widget>

      {/* Recent Updates */}
      <Widget title="Recent Updates" className="list-widget">
        <div className="widget-content">
          <ul className="widget-list">
            {recentUpdates.map(update => (
              <li key={update.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ color: getPriorityColor(update.priority) }}>
                    {getUpdateIcon(update.type)}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{update.message}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Priority: {update.priority}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {update.time}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="widget-actions">
          <button className="widget-button">View All Updates</button>
        </div>
      </Widget>

      {/* Quick Actions */}
      <Widget title="Quick Actions">
        <div className="widget-content">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <button className="widget-button" style={{ width: '100%', padding: '1rem' }}>
              <FiClipboard style={{ marginRight: '0.5rem' }} />
              Assign Task
            </button>
            <button className="widget-button" style={{ width: '100%', padding: '1rem' }}>
              <FiUsers style={{ marginRight: '0.5rem' }} />
              Team Meeting
            </button>
            <button className="widget-button" style={{ width: '100%', padding: '1rem' }}>
              <FiBarChart style={{ marginRight: '0.5rem' }} />
              Performance Review
            </button>
            <button className="widget-button" style={{ width: '100%', padding: '1rem' }}>
              <FiTarget style={{ marginRight: '0.5rem' }} />
              Set Goals
            </button>
          </div>
        </div>
      </Widget>
    </div>
  );
};

export default ManagerDashboard;
