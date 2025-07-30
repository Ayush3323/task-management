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
      setFormData(part);
    } else {
      setFormData({ name: '', inStock: '', machineId: machines[0]?.id || '' });
    }
  }, [part, machines]);

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
        />
      </div>
      <div className="form-group">
        <label htmlFor="machineId">Assigned Machine</label>
        <select
          id="machineId"
          name="machineId"
          value={formData.machineId}
          onChange={handleChange}
        >
          {machines.map(machine => (
            <option key={machine.id} value={machine.id}>{machine.name}</option>
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
