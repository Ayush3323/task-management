import React from 'react';
import './Tasks.css';
import TaskList from '../components/TaskList';

const Tasks = ({ tasks, onCompleteTask, onRateTask }) => {
  return (
    <div className="tasks-page">
      <div className="page-header">
        <h2>Task Management</h2>
      </div>
      <TaskList tasks={tasks} onComplete={onCompleteTask} onRate={onRateTask} />
    </div>
  );
};

export default Tasks;
