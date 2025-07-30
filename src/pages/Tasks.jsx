import React, { useState, useEffect } from 'react';
import { addDocument, updateDocument, deleteDocument, getCollectionSnapshot } from '../api/firestoreService';
import { FiPlus, FiClipboard, FiCheckCircle, FiClock, FiAlertTriangle, FiTrendingUp, FiSearch, FiFilter, FiList } from 'react-icons/fi';
import './Tasks.css';
import TaskList from '../components/TaskList';
import Modal from '../components/Modal';
import TaskForm from '../components/TaskForm';

const Tasks = ({ tasks, setTasks, machines, parts, onCompleteTask, onRateTask }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

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
      await updateDocument('tasks', taskToComplete.id, { 
        status: 'Completed',
        completedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // Update parts stock
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
    } catch (error) {
      console.error('Error completing task:', error);
      alert('Error completing task. Please try again.');
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

  // Filter tasks based on search and filters
  const filteredTasks = tasks?.filter(task => {
    const matchesSearch = !searchTerm || 
      task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.machine?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || task.status?.toLowerCase() === statusFilter.toLowerCase();
    const matchesPriority = priorityFilter === 'all' || task.priority?.toLowerCase() === priorityFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesPriority;
  }) || [];

  // Calculate statistics
  const totalTasks = tasks?.length || 0;
  const pendingTasks = tasks?.filter(t => t.status === 'Pending').length || 0;
  const completedTasks = tasks?.filter(t => t.status === 'Completed').length || 0;
  const inProgressTasks = tasks?.filter(t => t.status === 'In Progress').length || 0;

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
        <div>
          <h1 className="page-title">Task Management</h1>
          <p className="page-subtitle">Track and manage production tasks and assignments</p>
        </div>
        <button className="add-button" onClick={() => handleOpenModal()}>
          <FiPlus />
          + Add Task
        </button>
      </div>

      {/* Statistics Overview */}
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">
              <FiClipboard />
            </div>
            <div className="stat-trend positive">
              <FiTrendingUp />
              +12%
            </div>
          </div>
          <div className="stat-value">{totalTasks}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">
              <FiClock />
            </div>
            <div className="stat-trend negative">
              <FiTrendingUp />
              -5%
            </div>
          </div>
          <div className="stat-value">{pendingTasks}</div>
          <div className="stat-label">Pending</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">
              <FiAlertTriangle />
            </div>
            <div className="stat-trend positive">
              <FiTrendingUp />
              +8%
            </div>
          </div>
          <div className="stat-value">{inProgressTasks}</div>
          <div className="stat-label">In Progress</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">
              <FiCheckCircle />
            </div>
            <div className="stat-trend positive">
              <FiTrendingUp />
              +15%
            </div>
          </div>
          <div className="stat-value">{completedTasks}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="content-section">
        <div className="content-header">
          <h2 className="content-title">
            <FiList className="content-title-icon" />
            Task List
          </h2>
          <span className="task-count">
            {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} found
          </span>
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
          />
        </div>
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
          />
        </Modal>
      )}
    </div>
  );
};

export default Tasks;
