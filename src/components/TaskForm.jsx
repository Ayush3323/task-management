import React, { useState } from 'react';
import './TaskForm.css';

const TaskForm = ({ machines, parts, onSubmit }) => {
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [machineId, setMachineId] = useState('');
  const [selectedParts, setSelectedParts] = useState([{ partId: '', quantity: 1 }]);

  const handlePartChange = (index, field, value) => {
    const newParts = [...selectedParts];
    newParts[index][field] = value;
    setSelectedParts(newParts);
  };

  const addPartField = () => {
    setSelectedParts([...selectedParts, { partId: '', quantity: 1 }]);
  };

  const removePartField = (index) => {
    const newParts = selectedParts.filter((_, i) => i !== index);
    setSelectedParts(newParts);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const taskData = {
      description,
      assignedTo,
      machineId,
      status: 'Pending',
      rating: 0,
      parts: selectedParts
        .filter(p => p.partId && p.quantity > 0)
        .map(p => ({ id: p.partId, quantity: Number(p.quantity) }))
    };
    onSubmit(taskData);
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h2>Add New Task</h2>
      <div className="form-group">
        <label>Description</label>
        <input 
          type="text" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          required 
        />
      </div>
      <div className="form-group">
        <label>Assign To</label>
        <input 
          type="text" 
          value={assignedTo} 
          onChange={(e) => setAssignedTo(e.target.value)} 
          placeholder="e.g., Alice" 
          required 
        />
      </div>
      <div className="form-group">
        <label>Machine</label>
        <select value={machineId} onChange={(e) => setMachineId(e.target.value)} required>
          <option value="" disabled>Select a machine</option>
          {machines.map(machine => (
            <option key={machine.id} value={machine.id}>{machine.name}</option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label>Parts Required</label>
        {selectedParts.map((part, index) => (
          <div key={index} className="part-selection">
            <select 
              value={part.partId} 
              onChange={(e) => handlePartChange(index, 'partId', e.target.value)}
            >
              <option value="" disabled>Select a part</option>
              {parts.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <input 
              type="number" 
              min="1" 
              value={part.quantity} 
              onChange={(e) => handlePartChange(index, 'quantity', e.target.value)} 
            />
            <button type="button" className="remove-part-btn" onClick={() => removePartField(index)}>&times;</button>
          </div>
        ))}
        <button type="button" className="add-part-btn" onClick={addPartField}>+ Add Part</button>
      </div>

      <button type="submit" className="submit-btn">Create Task</button>
    </form>
  );
};

export default TaskForm;
