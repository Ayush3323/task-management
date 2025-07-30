import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Machines from './pages/Machines';
import Parts from './pages/Parts';
import Tasks from './pages/Tasks';
import { mockMachines } from './data/machines';
import { mockParts } from './data/parts';
import { mockTasks } from './data/tasks';

function App() {
  const [machines, setMachines] = useState(mockMachines);
  const [parts, setParts] = useState(mockParts);
  const [tasks, setTasks] = useState(mockTasks);
  const [role, setRole] = useState('Admin');

  const handleCompleteTask = (completedTask) => {
    // Update task status
    setTasks(tasks.map(task => 
      task.id === completedTask.id ? { ...task, status: 'Completed' } : task
    ));

    // Update part inventory
    completedTask.parts.forEach(partUsed => {
      setParts(prevParts => 
        prevParts.map(part => 
          part.id === partUsed.id ? { ...part, inStock: part.inStock - partUsed.quantity } : part
        )
      );
    });
  };

  const handleTaskRatingChange = (taskId, newRating) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, rating: newRating } : task
    ));
  };

  return (
    <div className="app-container">
      <Sidebar setRole={setRole} />
      <Routes>
        <Route path="/" element={<Dashboard role={role} />} />
        <Route path="/machines" element={<Machines machines={machines} setMachines={setMachines} />} />
        <Route path="/parts" element={<Parts parts={parts} setParts={setParts} machines={machines} />} />
        <Route path="/tasks" element={<Tasks tasks={tasks} onCompleteTask={handleCompleteTask} onRateTask={handleTaskRatingChange} />} />
      </Routes>
    </div>
  );
}

export default App;
