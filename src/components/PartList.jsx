import React from 'react';
import './PartList.css';

const PartList = ({ parts, machines, onEdit, onDelete }) => {
  // Function to get machine name by machineId
  const getMachineName = (machineId) => {
    if (!machineId) return 'N/A';
    if (!machines || machines.length === 0) return 'No machines available';
    
    const machine = machines.find(m => m.id === machineId);
    if (machine) {
      return machine.name || machine.machineName || 'Unknown Machine';
    }
    
    // If machine not found, return the ID for debugging
    return `Machine ID: ${machineId}`;
  };

  // Debug logging
  console.log('PartList Debug:', {
    partsCount: parts?.length || 0,
    machinesCount: machines?.length || 0,
    parts: parts?.slice(0, 3), // First 3 parts for debugging
    machines: machines?.slice(0, 3) // First 3 machines for debugging
  });

  return (
    <div className="part-list-container">
      <table className="part-list-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>In Stock</th>
            <th>Assigned Machine</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {parts.map((part) => (
            <tr key={part.id}>
              <td>{part.id}</td>
              <td>{part.name}</td>
              <td>{part.inStock || part.stock || 0}</td>
              <td>{getMachineName(part.machineId)}</td>
              <td>
                <button className="action-button" onClick={() => onEdit(part)}>Edit</button>
                <button className="action-button delete" onClick={() => onDelete(part.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PartList;
