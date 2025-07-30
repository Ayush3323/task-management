import React, { useState } from 'react';
import { FiEdit, FiTrash2, FiUser, FiMail, FiPhone, FiMapPin, FiBriefcase, FiCalendar, FiEye } from 'react-icons/fi';
import './EmployeeList.css';

const EmployeeList = ({ employees, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

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
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.fullName || '';
          bValue = b.fullName || '';
          break;
        case 'role':
          aValue = a.role || '';
          bValue = b.role || '';
          break;
        case 'department':
          aValue = a.department || '';
          bValue = b.department || '';
          break;
        case 'status':
          aValue = a.status || '';
          bValue = b.status || '';
          break;
        case 'hireDate':
          aValue = new Date(a.hireDate || 0);
          bValue = new Date(b.hireDate || 0);
          break;
        default:
          aValue = a.fullName || '';
          bValue = b.fullName || '';
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'var(--success-color)';
      case 'Inactive': return 'var(--text-muted)';
      case 'On Leave': return 'var(--warning-color)';
      case 'Terminated': return 'var(--error-color)';
      default: return 'var(--text-muted)';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin': return 'var(--error-color)';
      case 'Manager': return 'var(--warning-color)';
      case 'Supervisor': return 'var(--info-color)';
      case 'Employee': return 'var(--success-color)';
      default: return 'var(--text-muted)';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatSalary = (salary) => {
    if (!salary) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(salary);
  };

  return (
    <div className="employee-list-container">
      {/* Filters and Search */}
      <div className="list-controls">
        <div className="search-section">
          <div className="search-box">
            <FiUser className="search-icon" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        
        <div className="filter-section">
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

      {/* Results Count */}
      <div className="results-info">
        <span>{filteredEmployees.length} employee{filteredEmployees.length !== 1 ? 's' : ''} found</span>
      </div>

      {/* Employee Table */}
      <div className="table-container">
        <table className="employee-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} className="sortable">
                Employee
                {sortBy === 'name' && (
                  <span className="sort-indicator">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th onClick={() => handleSort('role')} className="sortable">
                Role
                {sortBy === 'role' && (
                  <span className="sort-indicator">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th onClick={() => handleSort('department')} className="sortable">
                Department
                {sortBy === 'department' && (
                  <span className="sort-indicator">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th onClick={() => handleSort('status')} className="sortable">
                Status
                {sortBy === 'status' && (
                  <span className="sort-indicator">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th onClick={() => handleSort('hireDate')} className="sortable">
                Hire Date
                {sortBy === 'hireDate' && (
                  <span className="sort-indicator">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th>Contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee.id} className="employee-row">
                <td className="employee-info">
                  <div className="employee-avatar">
                    <FiUser />
                  </div>
                  <div className="employee-details">
                    <div className="employee-name">{employee.fullName || 'N/A'}</div>
                    <div className="employee-email">{employee.email || 'N/A'}</div>
                  </div>
                </td>
                
                <td>
                  <span 
                    className="role-badge"
                    style={{ backgroundColor: getRoleColor(employee.role) }}
                  >
                    {employee.role || 'N/A'}
                  </span>
                </td>
                
                <td>
                  <div className="department-info">
                    <FiBriefcase className="department-icon" />
                    <span>{employee.department || 'N/A'}</span>
                  </div>
                </td>
                
                <td>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(employee.status) }}
                  >
                    {employee.status || 'N/A'}
                  </span>
                </td>
                
                <td>
                  <div className="date-info">
                    <FiCalendar className="date-icon" />
                    <span>{formatDate(employee.hireDate)}</span>
                  </div>
                </td>
                
                <td className="contact-info">
                  <div className="contact-item">
                    <FiPhone className="contact-icon" />
                    <span>{employee.phone || 'N/A'}</span>
                  </div>
                  {employee.address && (
                    <div className="contact-item">
                      <FiMapPin className="contact-icon" />
                      <span className="address-text">{employee.address}</span>
                    </div>
                  )}
                </td>
                
                <td className="actions">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredEmployees.length === 0 && (
          <div className="no-results">
            <FiUser className="no-results-icon" />
            <p>No employees found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeList; 