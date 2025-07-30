import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiBriefcase, FiCalendar } from 'react-icons/fi';
import './EmployeeForm.css';

const EmployeeForm = ({ onSubmit, employee }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'Employee',
    department: '',
    status: 'Active',
    hireDate: '',
    salary: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    skills: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (employee) {
      setFormData({
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
        email: employee.email || '',
        phone: employee.phone || '',
        role: employee.role || 'Employee',
        department: employee.department || '',
        status: employee.status || 'Active',
        hireDate: employee.hireDate || '',
        salary: employee.salary || '',
        address: employee.address || '',
        emergencyContact: employee.emergencyContact || '',
        emergencyPhone: employee.emergencyPhone || '',
        skills: employee.skills || '',
        notes: employee.notes || ''
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'Employee',
        department: '',
        status: 'Active',
        hireDate: '',
        salary: '',
        address: '',
        emergencyContact: '',
        emergencyPhone: '',
        skills: '',
        notes: ''
      });
    }
    setErrors({});
  }, [employee]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    if (!formData.hireDate) {
      newErrors.hireDate = 'Hire date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const submitData = {
        ...formData,
        fullName: `${formData.firstName} ${formData.lastName}`,
        createdAt: employee ? employee.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      onSubmit(submitData);
    }
  };

  return (
    <form className="employee-form" onSubmit={handleSubmit}>
      <div className="form-sections">
        {/* Personal Information */}
        <div className="form-section">
          <h3 className="section-title">
            <FiUser className="section-icon" />
            Personal Information
          </h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={errors.firstName ? 'error' : ''}
                placeholder="Enter first name"
              />
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={errors.lastName ? 'error' : ''}
                placeholder="Enter last name"
              />
              {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <div className="input-with-icon">
                <FiMail className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="Enter email address"
                />
              </div>
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone *</label>
              <div className="input-with-icon">
                <FiPhone className="input-icon" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? 'error' : ''}
                  placeholder="Enter phone number"
                />
              </div>
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <div className="input-with-icon">
              <FiMapPin className="input-icon" />
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
              />
            </div>
          </div>
        </div>

        {/* Employment Information */}
        <div className="form-section">
          <h3 className="section-title">
            <FiBriefcase className="section-icon" />
            Employment Information
          </h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="Employee">Employee</option>
                <option value="Manager">Manager</option>
                <option value="Admin">Admin</option>
                <option value="Supervisor">Supervisor</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="department">Department *</label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={errors.department ? 'error' : ''}
                placeholder="Enter department"
              />
              {errors.department && <span className="error-message">{errors.department}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Leave">On Leave</option>
                <option value="Terminated">Terminated</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="hireDate">Hire Date *</label>
              <div className="input-with-icon">
                <FiCalendar className="input-icon" />
                <input
                  type="date"
                  id="hireDate"
                  name="hireDate"
                  value={formData.hireDate}
                  onChange={handleChange}
                  className={errors.hireDate ? 'error' : ''}
                />
              </div>
              {errors.hireDate && <span className="error-message">{errors.hireDate}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="salary">Salary</label>
            <input
              type="number"
              id="salary"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="Enter salary"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        {/* Additional Information */}
        <div className="form-section">
          <h3 className="section-title">
            <FiUser className="section-icon" />
            Additional Information
          </h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="emergencyContact">Emergency Contact</label>
              <input
                type="text"
                id="emergencyContact"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                placeholder="Emergency contact name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="emergencyPhone">Emergency Phone</label>
              <input
                type="tel"
                id="emergencyPhone"
                name="emergencyPhone"
                value={formData.emergencyPhone}
                onChange={handleChange}
                placeholder="Emergency contact phone"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="skills">Skills</label>
            <textarea
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Enter skills (comma separated)"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes"
              rows="3"
            />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-button">
          {employee ? 'Update Employee' : 'Add Employee'}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm; 