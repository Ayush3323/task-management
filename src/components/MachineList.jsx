import React from 'react';
import './MachineList.css';

const MachineList = ({ machines, onEdit, onDelete }) => {
  return (
    <div className="machine-list-container">
      <table className="machine-list-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Last Maintenance</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {machines.map((machine) => (
            <tr key={machine.id}>
              <td>{machine.id}</td>
              <td>{machine.name}</td>
              <td>
                <span className={`status-badge status-${machine.status.toLowerCase().replace(' ', '-')}`}>
                  {machine.status}
                </span>
              </td>
              <td>{machine.lastMaintenance}</td>
              <td>{machine.location}</td>
              <td>
                <button className="action-button" onClick={() => onEdit(machine)}>Edit</button>
                <button className="action-button delete" onClick={() => onDelete(machine.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MachineList;
