import React, { useState, useEffect } from 'react';
import './PartForm.css';

const PartForm = ({ onSubmit, part, machines }) => {
  const [formData, setFormData] = useState({
    name: '',
    inStock: '',
    machineId: '',
  });

  useEffect(() => {
    if (part) {
      setFormData({
        name: part.name || '',
        inStock: part.inStock || part.stock || '',
        machineId: part.machineId || '',
      });
    } else {
      setFormData({ 
        name: '', 
        inStock: '', 
        machineId: machines && machines.length > 0 ? machines[0].id : '' 
      });
    }
  }, [part, machines]);

  // Debug logging
  console.log('PartForm Debug:', {
    part: part,
    machinesCount: machines?.length || 0,
    machines: machines?.slice(0, 3), // First 3 machines for debugging
    formData: formData
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="part-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Part Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="inStock">In Stock</label>
        <input
          type="number"
          id="inStock"
          name="inStock"
          value={formData.inStock}
          onChange={handleChange}
          required
          min="0"
        />
      </div>
      <div className="form-group">
        <label htmlFor="machineId">Assigned Machine</label>
        <select
          id="machineId"
          name="machineId"
          value={formData.machineId}
          onChange={handleChange}
          required
        >
          <option value="">Select a machine</option>
          {machines && machines.map(machine => (
            <option key={machine.id} value={machine.id}>
              {machine.name || machine.machineName || `Machine ${machine.id}`}
            </option>
          ))}
        </select>
      </div>
      <div className="form-actions">
        <button type="submit" className="submit-button">
          {part ? 'Update Part' : 'Add Part'}
        </button>
      </div>
    </form>
  );
};

export default PartForm;
