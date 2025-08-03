import React, { useState } from 'react';
import { FiEdit, FiTrash2, FiUser, FiMail, FiPhone, FiMapPin, FiBriefcase, FiCalendar, FiEye, FiSearch } from 'react-icons/fi';
import './EmployeeList.css';

const EmployeeList = ({ employees, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  // Filter and sort employees
  const filteredEmployees = employees
    .filter(employee => {
      const matchesSearch = employee.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           employee.department?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === 'All' || employee.role === filterRole;
      const matchesStatus = filterStatus === 'All' || employee.status === filterStatus;
      
      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => (a.fullName || '').localeCompare(b.fullName || ''));

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return '#10b981';
      case 'Inactive': return '#6b7280';
      case 'On Leave': return '#f59e0b';
      case 'Terminated': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin': return '#ef4444';
      case 'Manager': return '#f59e0b';
      case 'Supervisor': return '#3b82f6';
      case 'Employee': return '#10b981';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="employee-list-container">
      {/* Header Controls */}
      <div className="list-header">
        <div className="header-left">
          <h2 className="page-title">Employees</h2>
          <span className="employee-count">{filteredEmployees.length} employee{filteredEmployees.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="header-right">
          <div className="view-toggle">
            <button 
              className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              Table
            </button>
            <button 
              className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              Grid
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="controls-section">
        <div className="search-container">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        
        <div className="filters-container">
          <div className="filter-group">
            <label>Role:</label>
            <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Employee">Employee</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Status:</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="On Leave">On Leave</option>
              <option value="Terminated">Terminated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Employee Table/Grid */}
      <div className={`employees-container ${viewMode}`}>
        {viewMode === 'table' ? (
          <>
            {/* Table Header */}
            <div className="table-header">
              <div className="header-cell employee-cell">Employee</div>
              <div className="header-cell role-cell">Role</div>
              <div className="header-cell department-cell">Department</div>
              <div className="header-cell status-cell">Status</div>
              <div className="header-cell date-cell">Hire Date</div>
              <div className="header-cell contact-cell">Contact</div>
              <div className="header-cell actions-cell">Actions</div>
            </div>

            {/* Table Rows */}
            {filteredEmployees.map((employee) => (
              <div key={employee.id} className="table-row">
                <div className="table-cell employee-cell">
                  <div className="employee-info">
                    <div className="employee-avatar">
                      <FiUser />
                    </div>
                    <div className="employee-details">
                      <h4 className="employee-name">{employee.fullName || 'N/A'}</h4>
                      <p className="employee-email">{employee.email || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="table-cell role-cell">
                  <span 
                    className="role-badge"
                    style={{ backgroundColor: getRoleColor(employee.role) }}
                  >
                    {employee.role || 'N/A'}
                  </span>
                </div>
                
                <div className="table-cell department-cell">
                  <div className="department-info">
                    <FiBriefcase className="info-icon" />
                    <span>{employee.department || 'N/A'}</span>
                  </div>
                </div>
                
                <div className="table-cell status-cell">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(employee.status) }}
                  >
                    {employee.status || 'N/A'}
                  </span>
                </div>
                
                <div className="table-cell date-cell">
                  <div className="date-info">
                    <FiCalendar className="info-icon" />
                    <span>{formatDate(employee.hireDate)}</span>
                  </div>
                </div>
                
                <div className="table-cell contact-cell">
                  <div className="contact-info">
                    <FiPhone className="info-icon" />
                    <span>{employee.phone || 'N/A'}</span>
                  </div>
                </div>
                
                <div className="table-cell actions-cell">
                  <div className="action-buttons">
                    <button 
                      className="action-btn view-btn" 
                      title="View Details"
                      onClick={() => onEdit(employee)}
                    >
                      <FiEye />
                    </button>
                    <button 
                      className="action-btn edit-btn" 
                      title="Edit Employee"
                      onClick={() => onEdit(employee)}
                    >
                      <FiEdit />
                    </button>
                    <button 
                      className="action-btn delete-btn" 
                      title="Delete Employee"
                      onClick={() => onDelete(employee.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          // Grid View (existing card structure)
          filteredEmployees.map((employee) => (
            <div key={employee.id} className="employee-card">
              <div className="card-header">
                <div className="employee-avatar">
                  <FiUser />
                </div>
                <div className="employee-basic-info">
                  <h3 className="employee-name">{employee.fullName || 'N/A'}</h3>
                  <p className="employee-email">{employee.email || 'N/A'}</p>
                </div>
              </div>
              
              <div className="card-content">
                <div className="info-row">
                  <div className="info-item">
                    <span className="info-label">Role:</span>
                    <span 
                      className="role-badge"
                      style={{ backgroundColor: getRoleColor(employee.role) }}
                    >
                      {employee.role || 'N/A'}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Status:</span>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(employee.status) }}
                    >
                      {employee.status || 'N/A'}
                    </span>
                  </div>
                </div>
                
                <div className="info-row">
                  <div className="info-item">
                    <FiBriefcase className="info-icon" />
                    <span className="info-text">{employee.department || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <FiCalendar className="info-icon" />
                    <span className="info-text">{formatDate(employee.hireDate)}</span>
                  </div>
                </div>
                
                <div className="info-row">
                  <div className="info-item">
                    <FiPhone className="info-icon" />
                    <span className="info-text">{employee.phone || 'N/A'}</span>
                  </div>
                  {employee.address && (
                    <div className="info-item">
                      <FiMapPin className="info-icon" />
                      <span className="info-text address-text">{employee.address}</span>
                    </div>
                  )}
                </div>
                
                <div className="card-actions">
                  <button 
                    className="action-btn view-btn" 
                    title="View Details"
                    onClick={() => onEdit(employee)}
                  >
                    <FiEye />
                  </button>
                  <button 
                    className="action-btn edit-btn" 
                    title="Edit Employee"
                    onClick={() => onEdit(employee)}
                  >
                    <FiEdit />
                  </button>
                  <button 
                    className="action-btn delete-btn" 
                    title="Delete Employee"
                    onClick={() => onDelete(employee.id)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
        
        {filteredEmployees.length === 0 && (
          <div className="no-results">
            <FiUser className="no-results-icon" />
            <h3>No employees found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeList; 