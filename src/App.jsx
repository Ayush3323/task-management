import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Machines from './pages/Machines';
import Parts from './pages/Parts';
import Tasks from './pages/Tasks';
import Employees from './pages/Employees';
import Login from './components/Login';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';
import { getCollectionSnapshot, updateDocument } from './api/firestoreService';

function AppContent() {
  const { currentUser, userData, loading } = useAuth();
  const [machines, setMachines] = useState([]);
  const [parts, setParts] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Add notification function to window for global access
  useEffect(() => {
    window.showNotification = (message, type = 'info') => {
      const id = Date.now();
      const notification = { id, message, type };
      setNotifications(prev => [...prev, notification]);
      
      // Auto remove after 5 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 5000);
    };

    return () => {
      delete window.showNotification;
    };
  }, []);

  useEffect(() => {
    if (currentUser) {
      console.log('Setting up data listeners for user:', currentUser.email);
      
      const unsubscribeMachines = getCollectionSnapshot('machines', (data) => {
        console.log('Machines data received:', data);
        setMachines(data);
      });
      
      const unsubscribeParts = getCollectionSnapshot('parts', (data) => {
        console.log('Parts data received:', data);
        setParts(data);
      });
      
      const unsubscribeTasks = getCollectionSnapshot('tasks', (data) => {
        console.log('Tasks data received:', data);
        setTasks(data);
      });

      return () => {
        console.log('Cleaning up data listeners');
        unsubscribeMachines();
        unsubscribeParts();
        unsubscribeTasks();
      };
    }
  }, [currentUser]);

  const handleCompleteTask = async (taskToComplete) => {
    await updateDocument('tasks', taskToComplete.id, { status: 'Completed' });

    for (const partUsed of taskToComplete.parts) {
      const partToUpdate = parts.find(p => p.id === partUsed.id);
      if (partToUpdate) {
        const newStock = Math.max(0, partToUpdate.stock - partUsed.quantity);
        await updateDocument('parts', partUsed.id, { stock: newStock });
      }
    }
  };

  const handleTaskRatingChange = async (taskId, newRating) => {
    await updateDocument('tasks', taskId, { rating: newRating });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Login />;
  }

  return (
    <div className="app-container">
      {/* Notifications */}
      <div className="notifications-container">
        {notifications.map(notification => (
          <div key={notification.id} className={`notification notification-${notification.type}`}>
            <span className="notification-message">{notification.message}</span>
            <button 
              className="notification-close"
              onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      
      <div className="sidebar-container">
        <Sidebar userData={userData} />
      </div>
      <div className="main-content">
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard userData={userData} />
            </ProtectedRoute>
          } />
          <Route path="/machines" element={
            <ProtectedRoute requiredPermission="manage_machines">
              <Machines machines={machines} setMachines={setMachines} userData={userData} />
            </ProtectedRoute>
          } />
          <Route path="/parts" element={
            <ProtectedRoute requiredPermission="manage_parts">
              <Parts parts={parts} setParts={setParts} machines={machines} userData={userData} />
            </ProtectedRoute>
          } />
          <Route path="/tasks" element={
            <ProtectedRoute requiredPermission="manage_tasks">
              <Tasks tasks={tasks} setTasks={setTasks} machines={machines} parts={parts} onCompleteTask={handleCompleteTask} onRateTask={handleTaskRatingChange} userData={userData} />
            </ProtectedRoute>
          } />
          <Route path="/employees" element={
            <ProtectedRoute requiredPermission="manage_employees">
              <Employees userData={userData} />
            </ProtectedRoute>
          } />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
