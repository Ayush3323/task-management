import React, { useState, useEffect } from 'react';
import './MachineForm.css';

const MachineForm = ({ onSubmit, machine }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    status: 'Operational',
    location: '',
  });

  useEffect(() => {
    if (machine) {
      setFormData(machine);
    } else {
      setFormData({ id: '', name: '', status: 'Operational', location: '' });
    }
  }, [machine]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="machine-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Machine Name</label>
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
        <label htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="Operational">Operational</option>
          <option value="Needs Maintenance">Needs Maintenance</option>
          <option value="Offline">Offline</option>
        </select>
      </div>
      <div className="form-actions">
        <button type="submit" className="submit-button">
          {machine ? 'Update Machine' : 'Add Machine'}
        </button>
      </div>
    </form>
  );
};

export default MachineForm;
