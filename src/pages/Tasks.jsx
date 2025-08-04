import React, { useState, useEffect } from 'react';
import { addDocument, updateDocument, deleteDocument, getCollectionSnapshot } from '../api/firestoreService';
import { FiPlus, FiClipboard, FiCheckCircle, FiClock, FiAlertTriangle, FiTrendingUp, FiSearch, FiFilter, FiList, FiArchive } from 'react-icons/fi';
import './Tasks.css';
import TaskList from '../components/TaskList';
import TaskHistory from '../components/TaskHistory';
import Modal from '../components/Modal';
import TaskForm from '../components/TaskForm';

const Tasks = ({ tasks, setTasks, machines, parts, onCompleteTask, onRateTask, userData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'history'

  // Debug logging
  console.log('Tasks component props:', {
    tasksCount: tasks?.length || 0,
    machinesCount: machines?.length || 0,
    partsCount: parts?.length || 0,
    userData: userData?.role
  });

  useEffect(() => {
    if (!tasks) {
      const unsubscribe = getCollectionSnapshot('tasks', (data) => {
        setTasks(data);
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, [tasks, setTasks]);

  const handleOpenModal = (task = null) => {
    setSelectedTask(task);
    setIsModalOpen(true);
    setError(null);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
    setIsModalOpen(false);
    setError(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedTask) {
        await updateDocument('tasks', selectedTask.id, {
          ...formData,
          updatedAt: new Date().toISOString()
        });
      } else {
        await addDocument('tasks', {
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving task:', error);
      setError('Error saving task. Please try again.');
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      try {
        await deleteDocument('tasks', taskId);
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Error deleting task. Please try again.');
      }
    }
  };

  const handleCompleteTask = async (taskToComplete) => {
    try {
      // Check if this is a status change or task completion
      const isStatusChange = taskToComplete.status && taskToComplete.status !== 'Completed';
      
      const updateData = {
        status: taskToComplete.status,
        updatedAt: new Date().toISOString()
      };

      // Only add completedAt if status is being set to Completed
      if (taskToComplete.status === 'Completed') {
        updateData.completedAt = new Date().toISOString();
      }

      await updateDocument('tasks', taskToComplete.id, updateData);

      // Update parts stock only when completing a task (not just changing status)
      if (taskToComplete.status === 'Completed' && !isStatusChange) {
        for (const partUsed of taskToComplete.parts || []) {
          const partToUpdate = parts?.find(p => p.id === partUsed.id);
          if (partToUpdate) {
            const currentStock = partToUpdate.inStock || partToUpdate.stock || 0;
            const newStock = Math.max(0, currentStock - partUsed.quantity);
            await updateDocument('parts', partUsed.id, { 
              inStock: newStock,
              stock: newStock,
              updatedAt: new Date().toISOString()
            });
          }
        }
      }
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Error updating task. Please try again.');
    }
  };

  const handleTaskRatingChange = async (taskId, newRating) => {
    try {
      await updateDocument('tasks', taskId, { 
        rating: newRating,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating task rating:', error);
      alert('Error updating task rating. Please try again.');
    }
  };

  // Filter tasks based on search, filters, and user role
  const filteredTasks = tasks?.filter(task => {
    // Role-based filtering
    let roleFilter = true;
    if (userData?.role === 'Employee') {
      // Employees see tasks assigned to them
      roleFilter = task.assignedTo === userData?.fullName;
    } else if (userData?.role === 'Manager') {
      // Managers see tasks they assigned or are assigned to them
      roleFilter = task.assignedBy === userData?.fullName || task.assignedTo === userData?.fullName;
    }
    // Admins see all tasks
    
    const matchesSearch = !searchTerm || 
      task.taskName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignedBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.machine?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.plantCategory?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || task.status?.toLowerCase() === statusFilter.toLowerCase();
    const matchesPriority = priorityFilter === 'all' || task.priority?.toLowerCase() === priorityFilter.toLowerCase();
    
    return roleFilter && matchesSearch && matchesStatus && matchesPriority;
  }) || [];

  // Calculate statistics based on user role
  const getRoleSpecificTasks = () => {
    if (!tasks) return [];
    
    if (userData?.role === 'Employee') {
      return tasks.filter(t => t.assignedTo === userData?.fullName);
    } else if (userData?.role === 'Manager') {
      return tasks.filter(t => t.assignedBy === userData?.fullName || t.assignedTo === userData?.fullName);
    }
    return tasks; // Admin sees all tasks
  };

  const roleSpecificTasks = getRoleSpecificTasks();
  const totalTasks = roleSpecificTasks.length;
  const pendingTasks = roleSpecificTasks.filter(t => t.status === 'Pending').length;
  const completedTasks = roleSpecificTasks.filter(t => t.status === 'Completed').length;
  const inProgressTasks = roleSpecificTasks.filter(t => t.status === 'In Progress').length;
  const readyForReviewTasks = roleSpecificTasks.filter(t => t.status === 'Ready for Review').length;

  // Debug logging
  console.log('Tasks Page Debug:', {
    partsCount: parts?.length || 0,
    machinesCount: machines?.length || 0,
    sampleParts: parts?.slice(0, 3), // First 3 parts for debugging
    sampleMachines: machines?.slice(0, 3), // First 3 machines for debugging
    partsWithMachineIds: parts?.filter(p => p.machineId)?.length || 0
  });

  if (loading) {
    return (
      <div className="tasks-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tasks-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Task Management</h1>
          <p>
            {userData?.role === 'Admin' && 'Track and manage all production tasks and assignments'}
            {userData?.role === 'Manager' && 'Manage tasks you\'ve assigned and track their progress'}
            {userData?.role === 'Employee' && 'View and complete tasks assigned to you'}
          </p>
        </div>
        {(userData?.role === 'Admin' || userData?.role === 'Manager') && (
          <button className="add-button" onClick={() => handleOpenModal()}>
            <FiPlus className="button-icon" />
            <span>Add Task</span>
          </button>
        )}
      </div>

      {/* Statistics Overview */}
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon">
            <FiClipboard />
          </div>
          <div className="stat-content">
            <div className="stat-value">{totalTasks}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
        </div>
        
        <div className="stat-card in-stock">
          <div className="stat-icon">
            <FiClock />
          </div>
          <div className="stat-content">
            <div className="stat-value">{pendingTasks}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>
        
        <div className="stat-card low-stock">
          <div className="stat-icon">
            <FiAlertTriangle />
          </div>
          <div className="stat-content">
            <div className="stat-value">{inProgressTasks}</div>
            <div className="stat-label">In Progress</div>
          </div>
        </div>
        
        {(userData?.role === 'Admin' || userData?.role === 'Manager') && (
          <div className="stat-card">
            <div className="stat-icon">
              <FiCheckCircle />
            </div>
            <div className="stat-content">
              <div className="stat-value">{readyForReviewTasks}</div>
              <div className="stat-label">Ready for Review</div>
            </div>
          </div>
        )}
        
        <div className="stat-card out-of-stock">
          <div className="stat-icon">
            <FiCheckCircle />
          </div>
          <div className="stat-content">
            <div className="stat-value">{completedTasks}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          <FiList />
          Task List
        </button>
        <button 
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <FiArchive />
          Task History
        </button>
      </div>

      {/* Content Section */}
      <div className="content-section">
        {activeTab === 'list' ? (
          <>
            <div className="section-header">
              <h2>Task List</h2>
              <div className="section-actions">
                <span className="task-count">
                  {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} found
                </span>
              </div>
            </div>
            
            <div className="controls-section">
              <div className="controls-row">
                <div className="search-section">
                  <FiSearch className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search tasks, assignees, or machines..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="filter-section">
                  <select
                    className="filter-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">Status: All</option>
                    <option value="pending">Status: Pending</option>
                    <option value="in progress">Status: In Progress</option>
                    <option value="ready for review">Status: Ready for Review</option>
                    <option value="completed">Status: Completed</option>
                    <option value="cancelled">Status: Cancelled</option>
                  </select>
                  
                  <select
                    className="filter-select"
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                  >
                    <option value="all">Priority: All</option>
                    <option value="high">Priority: High</option>
                    <option value="medium">Priority: Medium</option>
                    <option value="low">Priority: Low</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="task-list-container">
              <TaskList 
                tasks={filteredTasks} 
                onComplete={handleCompleteTask} 
                onRate={handleTaskRatingChange}
                onEdit={handleOpenModal}
                onDelete={handleDelete}
                userData={userData}
              />
            </div>
          </>
        ) : (
          <>
            <div className="section-header">
              <h2>Task History</h2>
              <div className="section-actions">
                <span className="task-count">
                  {tasks?.length || 0} total tasks
                </span>
              </div>
            </div>
            
            <div className="task-history-container">
              <TaskHistory 
                tasks={tasks || []} 
                userData={userData}
              />
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          title={selectedTask ? 'Edit Task' : 'Add New Task'}
        >
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          <TaskForm 
            machines={machines || []} 
            parts={parts || []} 
            onSubmit={handleFormSubmit}
            task={selectedTask}
            userData={userData}
          />
        </Modal>
      )}
    </div>
  );
};

export default Tasks;
