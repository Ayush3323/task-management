import React, { useState } from 'react';
import { FiPackage, FiRotateCcw, FiTruck, FiBox, FiThermometer, FiSettings, FiCheckCircle, FiClock, FiUser } from 'react-icons/fi';
import './TaskHistory.css';

const TaskHistory = ({ tasks, userData }) => {
  const [filterPlant, setFilterPlant] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Plant categories with icons
  const plantCategories = [
    { id: 'batching', name: 'Batching', icon: <FiPackage />, color: '#3b82f6' },
    { id: 'mixing', name: 'Mixing', icon: <FiRotateCcw />, color: '#10b981' },
    { id: 'conveying', name: 'Conveying', icon: <FiTruck />, color: '#f59e0b' },
    { id: 'packing', name: 'Packing', icon: <FiBox />, color: '#8b5cf6' },
    { id: 'heating', name: 'Heating', icon: <FiThermometer />, color: '#ef4444' },
    { id: 'milling', name: 'Milling', icon: <FiSettings />, color: '#6b7280' }
  ];

  // Get plant icon and color
  const getPlantIcon = (plantCategory) => {
    const plant = plantCategories.find(p => p.id.toLowerCase() === plantCategory?.toLowerCase());
    return plant ? plant.icon : <FiSettings />;
  };

  const getPlantColor = (plantCategory) => {
    const plant = plantCategories.find(p => p.id.toLowerCase() === plantCategory?.toLowerCase());
    return plant ? plant.color : '#6b7280';
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return { text: 'Completed', class: 'completed' };
      case 'ready for review':
        return { text: 'Ready for Review', class: 'ready-for-review' };
      case 'in progress':
        return { text: 'In Progress', class: 'in-progress' };
      case 'pending':
        return { text: 'Pending', class: 'pending' };
      default:
        return { text: status || 'Unknown', class: 'unknown' };
    }
  };

  // Get machine thumbnail (simulated)
  const getMachineThumbnail = (machineName) => {
    // In a real app, this would be actual machine images
    // For now, we'll use colored divs as placeholders
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#6b7280'];
    const colorIndex = machineName?.length % colors.length || 0;
    
    return (
      <div 
        className="machine-thumbnail"
        style={{ backgroundColor: colors[colorIndex] }}
      >
        <FiSettings />
      </div>
    );
  };

  // Filter tasks
  const filteredTasks = tasks?.filter(task => {
    const matchesPlant = filterPlant === 'all' || task.plantCategory?.toLowerCase() === filterPlant.toLowerCase();
    const matchesStatus = filterStatus === 'all' || task.status?.toLowerCase() === filterStatus.toLowerCase();
    return matchesPlant && matchesStatus;
  }) || [];

  // Sort by completion date (most recent first)
  const sortedTasks = filteredTasks.sort((a, b) => {
    const dateA = new Date(a.completedAt || a.updatedAt || a.createdAt);
    const dateB = new Date(b.completedAt || b.updatedAt || b.createdAt);
    return dateB - dateA;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (sortedTasks.length === 0) {
    return (
      <div className="task-history-empty">
        <FiClock className="empty-icon" />
        <h3>No task history found</h3>
        <p>Completed tasks will appear here</p>
      </div>
    );
  }

  return (
    <div className="task-history">
      {/* Filters */}
      <div className="history-filters">
        <div className="filter-group">
          <label>Plant Category:</label>
          <select value={filterPlant} onChange={(e) => setFilterPlant(e.target.value)}>
            <option value="all">All Plants</option>
            {plantCategories.map(plant => (
              <option key={plant.id} value={plant.id}>{plant.name}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="ready for review">Ready for Review</option>
            <option value="in progress">In Progress</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Task History List */}
      <div className="history-list">
        {sortedTasks.map((task) => {
          const statusBadge = getStatusBadge(task.status);
          return (
            <div key={task.id} className="history-item">
              <div className="history-thumbnail">
                {getMachineThumbnail(task.machine || task.machineId)}
              </div>
              
              <div className="history-content">
                <div className="history-header">
                  <div className="plant-category">
                    <div 
                      className="plant-icon" 
                      style={{ color: getPlantColor(task.plantCategory) }}
                    >
                      {getPlantIcon(task.plantCategory)}
                    </div>
                    <span className="plant-name">{task.plantCategory || 'N/A'}</span>
                  </div>
                  
                  <div className="task-info">
                    <h4 className="task-title">{task.taskName || task.description}</h4>
                    <p className="machine-name">{task.machine || task.machineId || 'Unknown Machine'}</p>
                  </div>
                </div>
                
                <div className="history-footer">
                  <div className="history-meta">
                    <span className="task-date">{formatDate(task.completedAt || task.updatedAt || task.createdAt)}</span>
                    <span className="task-assignee">
                      <FiUser />
                      {task.assignedTo}
                    </span>
                  </div>
                  
                  <div className="history-badges">
                    <span className={`status-badge ${statusBadge.class}`}>
                      {statusBadge.text}
                    </span>
                    {task.rating && task.rating > 0 && (
                      <span className="rating-badge">
                        ⭐ {task.rating}/5
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskHistory; 