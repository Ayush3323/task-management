import React, { useState } from 'react';
import { addDocument } from '../api/firestoreService';
import './Tasks.css';
import TaskList from '../components/TaskList';
import Modal from '../components/Modal';
import TaskForm from '../components/TaskForm';

const Tasks = ({ tasks, machines, parts, onCompleteTask, onRateTask }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddTask = async (taskData) => {
    await addDocument('tasks', taskData);
    setIsModalOpen(false);
  };
  return (
    <div className="tasks-page">
      <div className="page-header">
        <h1>Task Management</h1>
        <button className="add-button" onClick={() => setIsModalOpen(true)}>
          Add Task
        </button>
      </div>
      <TaskList tasks={tasks} onComplete={onCompleteTask} onRate={onRateTask} />
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <TaskForm machines={machines} parts={parts} onSubmit={handleAddTask} />
        </Modal>
      )}
    </div>
  );
};

export default Tasks;
