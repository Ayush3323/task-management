import React, { useState, useEffect } from 'react';
import './MachineForm.css';

const MachineForm = ({ onSubmit, machine }) => {
  const [formData, setFormData] = useState({
    // Required Fields
    name: '',
    type: '',
    status: 'Operational',
    location: '',
    
    // Optional Fields
    manufacturer: '',
    model: '',
    serialNumber: '',
    capacity: '',
    powerConsumption: '',
    voltage: '',
    current: '',
    speed: '',
    dimensions: '',
    weight: '',
    
    // Maintenance Fields
    lastMaintenance: '',
    nextMaintenance: '',
    maintenanceInterval: '',
    maintenanceNotes: '',
    
    // Operational Fields
    installationDate: '',
    warrantyExpiry: '',
    operatingHours: '',
    efficiency: '',
    
    // Contact & Support
    supplier: '',
    supplierContact: '',
    supportPhone: '',
    supportEmail: '',
    
    // Additional Info
    description: '',
    specifications: '',
    notes: '',
    
    // System Fields
    createdAt: '',
    updatedAt: '',
    createdBy: '',
    updatedBy: ''
  });

  useEffect(() => {
    if (machine) {
      setFormData(machine);
    } else {
      setFormData({
        name: '',
        type: '',
        status: 'Operational',
        location: '',
        manufacturer: '',
        model: '',
        serialNumber: '',
        capacity: '',
        powerConsumption: '',
        voltage: '',
        current: '',
        speed: '',
        dimensions: '',
        weight: '',
        lastMaintenance: '',
        nextMaintenance: '',
        maintenanceInterval: '',
        maintenanceNotes: '',
        installationDate: '',
        warrantyExpiry: '',
        operatingHours: '',
        efficiency: '',
        supplier: '',
        supplierContact: '',
        supportPhone: '',
        supportEmail: '',
        description: '',
        specifications: '',
        notes: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  }, [machine]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Update timestamps
    const submitData = {
      ...formData,
      updatedAt: new Date().toISOString()
    };
    
    if (!machine) {
      submitData.createdAt = new Date().toISOString();
    }
    
    onSubmit(submitData);
  };

  return (
    <form className="machine-form" onSubmit={handleSubmit}>
      <h2>{machine ? 'Edit Machine' : 'Add New Machine'}</h2>
      
      {/* Required Fields Section */}
      <div className="form-section">
        <h3>Required Information *</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Machine Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter machine name"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="type">Machine Type *</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="">Select machine type</option>
              <option value="Assembly Line">Assembly Line</option>
              <option value="CNC">CNC Machine</option>
              <option value="Packaging">Packaging Machine</option>
              <option value="Welding">Welding Machine</option>
              <option value="Cutting">Cutting Machine</option>
              <option value="Drilling">Drilling Machine</option>
              <option value="Grinding">Grinding Machine</option>
              <option value="Milling">Milling Machine</option>
              <option value="Lathe">Lathe Machine</option>
              <option value="Press">Press Machine</option>
              <option value="Furnace">Furnace</option>
              <option value="Conveyor">Conveyor System</option>
              <option value="Robot">Industrial Robot</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="Operational">Operational</option>
              <option value="Needs Maintenance">Needs Maintenance</option>
              <option value="Under Maintenance">Under Maintenance</option>
              <option value="Offline">Offline</option>
              <option value="Repair">Under Repair</option>
              <option value="Retired">Retired</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Factory Floor 1, Building A"
              required
            />
          </div>
        </div>
      </div>

      {/* Basic Information Section */}
      <div className="form-section">
        <h3>Basic Information</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="manufacturer">Manufacturer</label>
            <input
              type="text"
              id="manufacturer"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleChange}
              placeholder="e.g., Siemens, ABB, Fanuc"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="model">Model</label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="e.g., SIMATIC S7-1200"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="serialNumber">Serial Number</label>
            <input
              type="text"
              id="serialNumber"
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleChange}
              placeholder="Machine serial number"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="capacity">Capacity</label>
            <input
              type="text"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="e.g., 1000 units/hour, 50 tons"
            />
          </div>
        </div>
      </div>

      {/* Technical Specifications Section */}
      <div className="form-section">
        <h3>Technical Specifications</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="powerConsumption">Power Consumption</label>
            <input
              type="text"
              id="powerConsumption"
              name="powerConsumption"
              value={formData.powerConsumption}
              onChange={handleChange}
              placeholder="e.g., 50 kW, 75 HP"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="voltage">Voltage</label>
            <input
              type="text"
              id="voltage"
              name="voltage"
              value={formData.voltage}
              onChange={handleChange}
              placeholder="e.g., 480V, 220V"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="current">Current</label>
            <input
              type="text"
              id="current"
              name="current"
              value={formData.current}
              onChange={handleChange}
              placeholder="e.g., 100A, 50A"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="speed">Speed</label>
            <input
              type="text"
              id="speed"
              name="speed"
              value={formData.speed}
              onChange={handleChange}
              placeholder="e.g., 1000 RPM, 50 m/min"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="dimensions">Dimensions</label>
            <input
              type="text"
              id="dimensions"
              name="dimensions"
              value={formData.dimensions}
              onChange={handleChange}
              placeholder="e.g., 2m x 3m x 1.5m"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="weight">Weight</label>
            <input
              type="text"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="e.g., 5000 kg, 2.5 tons"
            />
          </div>
        </div>
      </div>

      {/* Maintenance Section */}
      <div className="form-section">
        <h3>Maintenance Information</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="lastMaintenance">Last Maintenance Date</label>
            <input
              type="date"
              id="lastMaintenance"
              name="lastMaintenance"
              value={formData.lastMaintenance}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="nextMaintenance">Next Maintenance Date</label>
            <input
              type="date"
              id="nextMaintenance"
              name="nextMaintenance"
              value={formData.nextMaintenance}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="maintenanceInterval">Maintenance Interval</label>
            <input
              type="text"
              id="maintenanceInterval"
              name="maintenanceInterval"
              value={formData.maintenanceInterval}
              onChange={handleChange}
              placeholder="e.g., Every 3 months, 1000 hours"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="operatingHours">Operating Hours</label>
            <input
              type="number"
              id="operatingHours"
              name="operatingHours"
              value={formData.operatingHours}
              onChange={handleChange}
              placeholder="Total operating hours"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="maintenanceNotes">Maintenance Notes</label>
          <textarea
            id="maintenanceNotes"
            name="maintenanceNotes"
            value={formData.maintenanceNotes}
            onChange={handleChange}
            placeholder="Special maintenance requirements or notes"
            rows="3"
          />
        </div>
      </div>

      {/* Operational Information Section */}
      <div className="form-section">
        <h3>Operational Information</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="installationDate">Installation Date</label>
            <input
              type="date"
              id="installationDate"
              name="installationDate"
              value={formData.installationDate}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="warrantyExpiry">Warranty Expiry Date</label>
            <input
              type="date"
              id="warrantyExpiry"
              name="warrantyExpiry"
              value={formData.warrantyExpiry}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="efficiency">Efficiency Rating</label>
            <input
              type="text"
              id="efficiency"
              name="efficiency"
              value={formData.efficiency}
              onChange={handleChange}
              placeholder="e.g., 95%, A+"
            />
          </div>
        </div>
      </div>

      {/* Contact & Support Section */}
      <div className="form-section">
        <h3>Contact & Support</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="supplier">Supplier</label>
            <input
              type="text"
              id="supplier"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              placeholder="Equipment supplier name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="supplierContact">Supplier Contact</label>
            <input
              type="text"
              id="supplierContact"
              name="supplierContact"
              value={formData.supplierContact}
              onChange={handleChange}
              placeholder="Supplier contact person"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="supportPhone">Support Phone</label>
            <input
              type="tel"
              id="supportPhone"
              name="supportPhone"
              value={formData.supportPhone}
              onChange={handleChange}
              placeholder="Technical support phone"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="supportEmail">Support Email</label>
            <input
              type="email"
              id="supportEmail"
              name="supportEmail"
              value={formData.supportEmail}
              onChange={handleChange}
              placeholder="Technical support email"
            />
          </div>
        </div>
      </div>

      {/* Additional Information Section */}
      <div className="form-section">
        <h3>Additional Information</h3>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Detailed description of the machine and its purpose"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="specifications">Technical Specifications</label>
          <textarea
            id="specifications"
            name="specifications"
            value={formData.specifications}
            onChange={handleChange}
            placeholder="Detailed technical specifications"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">General Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any additional notes or comments"
            rows="3"
          />
        </div>
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
