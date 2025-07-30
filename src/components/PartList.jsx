import React from 'react';
import './PartList.css';

const PartList = ({ parts, onEdit, onDelete }) => {
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
              <td>{part.inStock}</td>
              <td>{part.machineId}</td>
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
