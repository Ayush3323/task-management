import React from 'react';
import StarRating from './StarRating';
import './TaskList.css';

const TaskList = ({ tasks, onComplete, onRate }) => {
  return (
    <div className="task-list-container">
      <table className="task-list-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Assigned To</th>
            <th>Machine</th>
            <th>Status</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.id}</td>
              <td>{task.description}</td>
              <td>{task.assignedTo}</td>
              <td>{task.machineId}</td>
              <td>
                <span className={`status-badge status-${task.status.toLowerCase().replace(' ', '-')}`}>
                  {task.status}
                </span>
              </td>
              <td className="rating-cell">
                <StarRating 
                  rating={task.rating} 
                  onRatingChange={(newRating) => onRate(task.id, newRating)}
                  isReadOnly={task.status !== 'Completed'}
                />
              </td>
              <td>
                {task.status !== 'Completed' && (
                  <button className="action-button complete" onClick={() => onComplete(task)}>
                    Mark as Complete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
