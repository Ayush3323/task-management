import React, { useState } from 'react';
import StarRating from './StarRating';
import { FiEye, FiEdit, FiTrash2, FiCheckCircle, FiUser, FiSettings, FiCalendar, FiFlag, FiPlus, FiChevronDown, FiClock, FiCheckSquare, FiAlertCircle, FiPackage, FiRotateCcw, FiTruck, FiBox, FiThermometer } from 'react-icons/fi';
import './TaskList.css';

const TaskList = ({ tasks, onComplete, onRate, onEdit, onDelete, userData }) => {
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [editingStatus, setEditingStatus] = useState(null);
  const [hoveredStatus, setHoveredStatus] = useState(null);

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
      const statusOrder = { 'Pending': 1, 'In Progress': 2, 'Ready for Review': 3, 'Completed': 4, 'Cancelled': 5 };
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
      case 'ready for review': return 'ready-for-review';
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

  // Plant category icons
  const getPlantIcon = (plantCategory) => {
    switch (plantCategory?.toLowerCase()) {
      case 'batching': return <FiPackage />;
      case 'mixing': return <FiRotateCcw />;
      case 'conveying': return <FiTruck />;
      case 'packing': return <FiBox />;
      case 'heating': return <FiThermometer />;
      case 'milling': return <FiSettings />;
      default: return <FiSettings />;
    }
  };

  const getPlantColor = (plantCategory) => {
    switch (plantCategory?.toLowerCase()) {
      case 'batching': return '#3b82f6';
      case 'mixing': return '#10b981';
      case 'conveying': return '#f59e0b';
      case 'packing': return '#8b5cf6';
      case 'heating': return '#ef4444';
      case 'milling': return '#6b7280';
      default: return '#6b7280';
    }
  };

  // Check user roles and permissions
  const isAdmin = userData?.role === 'Admin';
  const isManager = userData?.role === 'Manager';
  const isEmployee = userData?.role === 'Employee';
  const currentUserName = userData?.fullName;

  // Check if user can perform actions on this task
  const canEditTask = (task) => {
    return isAdmin || 
           (isManager && task.assignedBy === currentUserName) ||
           (isEmployee && task.assignedTo === currentUserName);
  };

  const canCompleteTask = (task) => {
    return isAdmin || 
           (isManager && task.assignedBy === currentUserName) ||
           (isEmployee && task.assignedTo === currentUserName);
  };

  const canApproveTask = (task) => {
    return isAdmin || 
           (isManager && task.assignedBy === currentUserName && task.status === 'Ready for Review');
  };

  // Handle status change
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        const updatedTask = { ...task, status: newStatus };
        await onComplete(updatedTask);
      }
      setEditingStatus(null);
      setHoveredStatus(null);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  // Handle task completion by employee
  const handleEmployeeComplete = async (task) => {
    try {
      const updatedTask = { 
        ...task, 
        status: 'Ready for Review',
        completedBy: currentUserName,
        completedAt: new Date().toISOString()
      };
      await onComplete(updatedTask);
      
      // Show notification
      if (window.showNotification) {
        window.showNotification('Task marked as Ready for Review', 'success');
      }
    } catch (error) {
      console.error('Error marking task as ready for review:', error);
      if (window.showNotification) {
        window.showNotification('Error updating task status', 'error');
      }
    }
  };

  // Handle task approval by manager
  const handleManagerApprove = async (task) => {
    try {
      const updatedTask = { 
        ...task, 
        status: 'Completed',
        approvedBy: currentUserName,
        approvedAt: new Date().toISOString()
      };
      await onComplete(updatedTask);
      
      // Show notification
      if (window.showNotification) {
        window.showNotification('Task approved and marked as completed', 'success');
      }
    } catch (error) {
      console.error('Error approving task:', error);
      if (window.showNotification) {
        window.showNotification('Error approving task', 'error');
      }
    }
  };

  // Status options based on user role and current status
  const getStatusOptions = (task) => {
    if (isAdmin) {
      return ['Pending', 'In Progress', 'Ready for Review', 'Completed', 'Cancelled'];
    }
    
    if (isManager && task.assignedBy === currentUserName) {
      if (task.status === 'Ready for Review') {
        return ['Ready for Review', 'Completed', 'In Progress'];
      }
      return ['Pending', 'In Progress', 'Ready for Review', 'Completed', 'Cancelled'];
    }
    
    if (isEmployee && task.assignedTo === currentUserName) {
      if (task.status === 'Pending') {
        return ['Pending', 'In Progress'];
      }
      if (task.status === 'In Progress') {
        return ['In Progress', 'Ready for Review'];
      }
      return [task.status];
    }
    
    return [task.status];
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
            onClick={() => handleSort('plantCategory')}
          >
            PLANT
          </th>
          <th 
            className="sortable"
            onClick={() => handleSort('description')}
          >
            DESCRIPTION
          </th>
          <th 
            className="sortable"
            onClick={() => handleSort('assignedBy')}
          >
            ASSIGNED BY
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
            onClick={() => handleSort('dueDate')}
          >
            DUE DATE
          </th>
          <th>COMMENT</th>
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
              <div className="plant-info">
                <div 
                  className="plant-icon" 
                  style={{ color: getPlantColor(task.plantCategory) }}
                >
                  {getPlantIcon(task.plantCategory)}
                </div>
                <span className="plant-name">{task.plantCategory || 'N/A'}</span>
              </div>
            </td>
            <td>
              <div className="task-description">
                <h4 className="task-title">{task.taskName || task.description}</h4>
                <p className="task-details">
                  {task.description && `${task.description.substring(0, 50)}${task.description.length > 50 ? '...' : ''}`}
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
                <div className="assigned-avatar manager">
                  {getInitials(task.assignedBy)}
                </div>
                <span className="assigned-name">{task.assignedBy}</span>
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
              {canEditTask(task) && hoveredStatus === task.id ? (
                <div className="status-editor">
                  <select 
                    value={task.status} 
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    onBlur={() => setHoveredStatus(null)}
                    autoFocus
                    className="status-select"
                  >
                    {getStatusOptions(task).map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div 
                  className={`status-badge ${getStatusColor(task.status)} ${canEditTask(task) ? 'editable' : ''}`}
                  onMouseEnter={() => canEditTask(task) && setHoveredStatus(task.id)}
                  onMouseLeave={() => canEditTask(task) && setHoveredStatus(null)}
                  title={canEditTask(task) ? 'Hover to edit status' : ''}
                >
                  {task.status}
                  {canEditTask(task) && <FiChevronDown className="status-dropdown-icon" />}
                </div>
              )}
            </td>
            <td>
              <span className={`task-priority ${getPriorityColor(task.priority)}`}>
                <FiFlag />
                {task.priority || 'Medium'}
              </span>
            </td>
            <td>
              <div className={`task-deadline ${getDeadlineStatus(task.dueDate)}`}>
                <FiCalendar />
                {formatDate(task.dueDate)}
              </div>
            </td>
            <td>
              <div className="task-comment">
                {task.comment ? (
                  <span className="comment-text" title={task.comment}>
                    {task.comment.length > 30 ? `${task.comment.substring(0, 30)}...` : task.comment}
                  </span>
                ) : (
                  <span className="no-comment">No comment</span>
                )}
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
                
                {canEditTask(task) && (
                  <button 
                    className="action-btn edit" 
                    title="Edit Task"
                    onClick={() => onEdit(task)}
                  >
                    <FiEdit />
                  </button>
                )}
                
                {/* Employee: Mark as Ready for Review */}
                {isEmployee && task.assignedTo === currentUserName && task.status === 'In Progress' && (
                  <button 
                    className="action-btn complete" 
                    title="Mark as Ready for Review"
                    onClick={() => handleEmployeeComplete(task)}
                  >
                    <FiCheckSquare />
                  </button>
                )}
                
                {/* Manager: Approve Completed Work */}
                {isManager && task.assignedBy === currentUserName && task.status === 'Ready for Review' && (
                  <button 
                    className="action-btn approve" 
                    title="Approve Completed Work"
                    onClick={() => handleManagerApprove(task)}
                  >
                    <FiCheckCircle />
                  </button>
                )}
                
                {/* Admin: Complete any task */}
                {isAdmin && task.status !== 'Completed' && (
                  <button 
                    className="action-btn complete" 
                    title="Mark Complete"
                    onClick={() => onComplete(task)}
                  >
                    <FiCheckCircle />
                  </button>
                )}
                
                {canEditTask(task) && (
                  <button 
                    className="action-btn delete" 
                    title="Delete Task"
                    onClick={() => onDelete(task.id)}
                  >
                    <FiTrash2 />
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TaskList;
