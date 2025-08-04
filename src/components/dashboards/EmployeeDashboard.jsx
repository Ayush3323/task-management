import React, { useState, useEffect } from 'react';
import Widget from '../Widget';
import { FiClipboard, FiCheckCircle, FiClock, FiTrendingUp, FiTarget, FiAward, FiCalendar, FiAlertTriangle, FiBarChart, FiActivity, FiUser, FiUsers } from 'react-icons/fi';

const EmployeeDashboard = ({ userData }) => {
  const [stats, setStats] = useState({
    assignedTasks: 5,
    completedTasks: 3,
    pendingTasks: 2,
    personalEfficiency: 88,
    taskCompletionRate: 75,
    workHours: 32,
    weeklyGoal: 40,
    qualityScore: 92,
    onTimeDelivery: 95,
    skillLevel: 85
  });

  const [myTasks, setMyTasks] = useState([
    { id: 1, title: 'Update User Interface', status: 'in-progress', priority: 'high', deadline: '2024-01-25', progress: 75 },
    { id: 2, title: 'Fix Bug in Module A', status: 'pending', priority: 'medium', deadline: '2024-01-26', progress: 0 },
    { id: 3, title: 'Code Review for PR #123', status: 'completed', priority: 'low', deadline: '2024-01-24', progress: 100 },
    { id: 4, title: 'Write Documentation', status: 'in-progress', priority: 'medium', deadline: '2024-01-27', progress: 45 },
    { id: 5, title: 'Unit Testing', status: 'pending', priority: 'high', deadline: '2024-01-28', progress: 0 }
  ]);

  const [recentAchievements, setRecentAchievements] = useState([
    { id: 1, type: 'task', message: 'Completed 3 tasks this week', time: '2 hours ago', points: 150 },
    { id: 2, type: 'quality', message: 'Achieved 95% quality score', time: '1 day ago', points: 100 },
    { id: 3, type: 'efficiency', message: 'Improved efficiency by 15%', time: '2 days ago', points: 200 },
    { id: 4, type: 'collaboration', message: 'Helped 2 team members', time: '3 days ago', points: 75 },
    { id: 5, type: 'innovation', message: 'Proposed new feature idea', time: '1 week ago', points: 300 }
  ]);

  const [upcomingEvents, setUpcomingEvents] = useState([
    { id: 1, type: 'meeting', title: 'Team Standup', time: '09:00 AM', date: 'Today' },
    { id: 2, type: 'deadline', title: 'Task Deadline', time: '05:00 PM', date: 'Tomorrow' },
    { id: 3, type: 'training', title: 'Skill Training', time: '02:00 PM', date: 'Jan 26' },
    { id: 4, type: 'review', title: 'Performance Review', time: '10:00 AM', date: 'Jan 29' }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        personalEfficiency: Math.max(80, Math.min(95, prev.personalEfficiency + Math.floor(Math.random() * 6) - 3)),
        workHours: Math.min(prev.weeklyGoal, prev.workHours + Math.floor(Math.random() * 2))
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'var(--success-color)';
      case 'in-progress': return 'var(--warning-color)';
      case 'pending': return 'var(--error-color)';
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

  const getEventIcon = (type) => {
    switch (type) {
      case 'meeting': return <FiUsers />;
      case 'deadline': return <FiClock />;
      case 'training': return <FiTarget />;
      case 'review': return <FiBarChart />;
      default: return <FiCalendar />;
    }
  };

  const getAchievementIcon = (type) => {
    switch (type) {
      case 'task': return <FiCheckCircle />;
      case 'quality': return <FiAward />;
      case 'efficiency': return <FiTrendingUp />;
      case 'collaboration': return <FiUsers />;
      case 'innovation': return <FiTarget />;
      default: return <FiActivity />;
    }
  };

  return (
    <div className="dashboard-grid">
      {/* Personal Overview */}
      <Widget className="widget-primary" title={`Welcome, ${userData?.fullName || 'Employee'}!`}>
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
        <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Department: {userData?.department || 'General'}
        </div>
      </Widget>

      <Widget className="widget-success" title="Work Hours">
        <div className="widget-stats">
          <div className="widget-stat">
            <span className="stat-value">{stats.workHours}h</span>
            <span className="stat-label">This Week</span>
          </div>
          <div className="widget-stat">
            <span className="stat-value">{stats.weeklyGoal}h</span>
            <span className="stat-label">Goal</span>
          </div>
        </div>
        <div className="widget-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(stats.workHours / stats.weeklyGoal) * 100}%` }}
            ></div>
          </div>
        </div>
      </Widget>

      <Widget className="widget-warning" title="Performance">
        <div className="widget-stats">
          <div className="widget-stat">
            <span className="stat-value">{stats.personalEfficiency}%</span>
            <span className="stat-label">Efficiency</span>
          </div>
          <div className="widget-stat">
            <span className="stat-value">{stats.qualityScore}%</span>
            <span className="stat-label">Quality</span>
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

      <Widget title="Skill Level">
        <div className="widget-stats">
          <div className="widget-stat">
            <span className="stat-value">{stats.skillLevel}%</span>
            <span className="stat-label">Current Level</span>
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
              style={{ width: `${stats.skillLevel}%` }}
            ></div>
          </div>
        </div>
      </Widget>

      {/* Task Progress */}
      <Widget title="Task Progress">
        <div className="widget-stats">
          <div className="widget-stat">
            <span className="stat-value">{stats.taskCompletionRate}%</span>
            <span className="stat-label">Completion Rate</span>
          </div>
          <div className="widget-stat">
            <span className="stat-value">{stats.onTimeDelivery}%</span>
            <span className="stat-label">On-Time Rate</span>
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
              Meeting targets
            </span>
          </div>
        </div>
      </Widget>

      {/* My Tasks List */}
      <Widget title="My Tasks" className="list-widget">
        <div className="widget-content">
          <ul className="widget-list">
            {myTasks.map(task => (
              <li key={task.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    backgroundColor: getStatusColor(task.status) 
                  }}></div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{task.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Due: {task.deadline} • Priority: {task.priority}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '600', color: getStatusColor(task.status) }}>
                    {task.progress}%
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {task.status}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Widget>

      {/* Recent Achievements */}
      <Widget title="Recent Achievements" className="list-widget">
        <div className="widget-content">
          <ul className="widget-list">
            {recentAchievements.map(achievement => (
              <li key={achievement.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ color: 'var(--success-color)' }}>
                    {getAchievementIcon(achievement.type)}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{achievement.message}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      +{achievement.points} points
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {achievement.time}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="widget-actions">
          <button className="widget-button">View All Achievements</button>
        </div>
      </Widget>

      {/* Upcoming Events */}
      <Widget title="Upcoming Events" className="list-widget">
        <div className="widget-content">
          <ul className="widget-list">
            {upcomingEvents.map(event => (
              <li key={event.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ color: 'var(--info-color)' }}>
                    {getEventIcon(event.type)}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{event.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {event.time} • {event.date}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {event.type}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Widget>

      {/* Quick Actions */}
      <Widget title="Quick Actions">
        <div className="widget-content">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <button className="widget-button" style={{ width: '100%', padding: '1rem' }}>
              <FiClipboard style={{ marginRight: '0.5rem' }} />
              Start Task
            </button>
            <button className="widget-button" style={{ width: '100%', padding: '1rem' }}>
              <FiCheckCircle style={{ marginRight: '0.5rem' }} />
              Complete Task
            </button>
            <button className="widget-button" style={{ width: '100%', padding: '1rem' }}>
              <FiClock style={{ marginRight: '0.5rem' }} />
              Log Time
            </button>
            <button className="widget-button" style={{ width: '100%', padding: '1rem' }}>
              <FiUser style={{ marginRight: '0.5rem' }} />
              Update Profile
            </button>
          </div>
        </div>
      </Widget>
    </div>
  );
};

export default EmployeeDashboard;
