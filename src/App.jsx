import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Machines from './pages/Machines';
import Parts from './pages/Parts';
import Tasks from './pages/Tasks';
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
      <Sidebar setRole={setRole} />
      <Routes>
        <Route path="/" element={<Dashboard role={role} />} />
        <Route path="/machines" element={<Machines machines={machines} setMachines={setMachines} />} />
        <Route path="/parts" element={<Parts parts={parts} setParts={setParts} machines={machines} />} />
        <Route path="/tasks" element={<Tasks tasks={tasks} machines={machines} parts={parts} onCompleteTask={handleCompleteTask} onRateTask={handleTaskRatingChange} />} />
      </Routes>
    </div>
  );
}

export default App;
