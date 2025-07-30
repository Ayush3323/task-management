import React, { useState } from 'react';
import StarRating from './StarRating';
import { FiEye, FiEdit, FiTrash2, FiCheckCircle, FiUser, FiSettings, FiCalendar, FiFlag, FiPlus } from 'react-icons/fi';
import './TaskList.css';

const TaskList = ({ tasks, onComplete, onRate, onEdit, onDelete }) => {
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (sortField === 'status') {
      const statusOrder = { 'Pending': 1, 'In Progress': 2, 'Completed': 3, 'Cancelled': 4 };
      aValue = statusOrder[a.status] || 0;
      bValue = statusOrder[b.status] || 0;
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'completed';
      case 'in progress': return 'in-progress';
      case 'pending': return 'pending';
      case 'cancelled': return 'cancelled';
      default: return 'pending';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'high';
      case 'medium': return 'medium';
      case 'low': return 'low';
      default: return 'medium';
    }
  };

  const getDeadlineStatus = (deadline) => {
    if (!deadline) return 'normal';
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'urgent';
    if (diffDays <= 3) return 'warning';
    return 'normal';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <FiSettings className="empty-icon" />
        <h3 className="empty-title">No tasks found</h3>
        <p className="empty-description">
          {tasks.length === 0 ? 'Get started by creating your first task.' : 'Try adjusting your search or filter criteria.'}
        </p>
        <button className="empty-action">
          <FiPlus />
          Create First Task
        </button>
      </div>
    );
  }

  return (
    <table className="task-table">
      <thead>
        <tr>
          <th 
            className="sortable"
            onClick={() => handleSort('id')}
          >
            ID
          </th>
          <th 
            className="sortable"
            onClick={() => handleSort('description')}
          >
            DESCRIPTION
          </th>
          <th 
            className="sortable"
            onClick={() => handleSort('assignedTo')}
          >
            ASSIGNED TO
          </th>
          <th 
            className="sortable"
            onClick={() => handleSort('machine')}
          >
            MACHINE
          </th>
          <th 
            className="sortable"
            onClick={() => handleSort('status')}
          >
            STATUS
          </th>
          <th 
            className="sortable"
            onClick={() => handleSort('priority')}
          >
            PRIORITY
          </th>
          <th 
            className="sortable"
            onClick={() => handleSort('deadline')}
          >
            DEADLINE
          </th>
          <th>RATING</th>
          <th>ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        {sortedTasks.map((task) => (
          <tr key={task.id}>
            <td>
              <div className="task-info">
                <span className="task-id">#{task.id}</span>
              </div>
            </td>
            <td>
              <div className="task-description">
                <h4 className="task-title">{task.description}</h4>
                <p className="task-details">
                  {task.notes && `${task.notes.substring(0, 50)}${task.notes.length > 50 ? '...' : ''}`}
                </p>
                {task.progress !== undefined && (
                  <div className="task-progress">
                    <div 
                      className="task-progress-fill" 
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </td>
            <td>
              <div className="assigned-to">
                <div className="assigned-avatar">
                  {getInitials(task.assignedTo)}
                </div>
                <span className="assigned-name">{task.assignedTo}</span>
              </div>
            </td>
            <td>
              <div className="machine-info">
                <FiSettings className="machine-icon" />
                {task.machine || task.machineId}
              </div>
            </td>
            <td>
              <span className={`status-badge ${getStatusColor(task.status)}`}>
                {task.status}
              </span>
            </td>
            <td>
              <span className={`task-priority ${getPriorityColor(task.priority)}`}>
                <FiFlag />
                {task.priority || 'Medium'}
              </span>
            </td>
            <td>
              <div className={`task-deadline ${getDeadlineStatus(task.deadline)}`}>
                <FiCalendar />
                {formatDate(task.deadline)}
              </div>
            </td>
            <td>
              <div className="task-rating">
                <StarRating 
                  rating={task.rating || 0} 
                  onRatingChange={(newRating) => onRate(task.id, newRating)}
                  isReadOnly={task.status !== 'Completed'}
                />
              </div>
            </td>
            <td>
              <div className="actions">
                <button 
                  className="action-btn view" 
                  title="View Details"
                  onClick={() => onEdit(task)}
                >
                  <FiEye />
                </button>
                <button 
                  className="action-btn edit" 
                  title="Edit Task"
                  onClick={() => onEdit(task)}
                >
                  <FiEdit />
                </button>
                {task.status !== 'Completed' && (
                  <button 
                    className="action-btn edit" 
                    title="Mark Complete"
                    onClick={() => onComplete(task)}
                  >
                    <FiCheckCircle />
                  </button>
                )}
                <button 
                  className="action-btn delete" 
                  title="Delete Task"
                  onClick={() => onDelete(task.id)}
                >
                  <FiTrash2 />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TaskList;
