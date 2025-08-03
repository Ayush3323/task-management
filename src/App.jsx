import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Machines from './pages/Machines';
import Parts from './pages/Parts';
import Tasks from './pages/Tasks';
import Employees from './pages/Employees';
import { getCollectionSnapshot, updateDocument } from './api/firestoreService';

function App() {
  const [machines, setMachines] = useState([]);
  const [parts, setParts] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [role, setRole] = useState('Admin');

  useEffect(() => {
    const unsubscribeMachines = getCollectionSnapshot('machines', setMachines);
    const unsubscribeParts = getCollectionSnapshot('parts', setParts);
    const unsubscribeTasks = getCollectionSnapshot('tasks', setTasks);

    return () => {
      unsubscribeMachines();
      unsubscribeParts();
      unsubscribeTasks();
    };
  }, []);

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

  return (
    <div className="app-container">
      <div className="sidebar-container">
        <Sidebar setRole={setRole} />
      </div>
      <div className="main-content">
      <Routes>
        <Route path="/" element={<Dashboard role={role} />} />
        <Route path="/machines" element={<Machines machines={machines} setMachines={setMachines} />} />
        <Route path="/parts" element={<Parts parts={parts} setParts={setParts} machines={machines} />} />
        <Route path="/tasks" element={<Tasks tasks={tasks} setTasks={setTasks} machines={machines} parts={parts} onCompleteTask={handleCompleteTask} onRateTask={handleTaskRatingChange} />} />
        <Route path="/employees" element={<Employees />} />
      </Routes>
      </div>
    </div>
  );
}

export default App;
