import React, { useState, useEffect } from 'react';
import { addDocument, updateDocument, deleteDocument, getCollectionSnapshot } from '../api/firestoreService';
import './Employees.css';
import EmployeeList from '../components/EmployeeList';
import Modal from '../components/Modal';
import EmployeeForm from '../components/EmployeeForm';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = getCollectionSnapshot('employees', (data) => {
      setEmployees(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleOpenModal = (employee = null) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedEmployee(null);
    setIsModalOpen(false);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedEmployee) {
        await updateDocument('employees', selectedEmployee.id, formData);
      } else {
        await addDocument('employees', formData);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('Error saving employee. Please try again.');
    }
  };

  const handleDelete = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
      try {
        await deleteDocument('employees', employeeId);
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Error deleting employee. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="employees-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="employees-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Employee Management</h1>
          <p>Manage your team members, roles, and performance</p>
        </div>
        <button className="add-button" onClick={() => handleOpenModal()}>
          <span>+ Add Employee</span>
        </button>
      </div>

      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-value">{employees.length}</div>
          <div className="stat-label">Total Employees</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {employees.filter(emp => emp.status === 'Active').length}
          </div>
          <div className="stat-label">Active Employees</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {employees.filter(emp => emp.role === 'Manager').length}
          </div>
          <div className="stat-label">Managers</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {employees.filter(emp => emp.role === 'Employee').length}
          </div>
          <div className="stat-label">Employees</div>
        </div>
      </div>

      <EmployeeList 
        employees={employees} 
        onEdit={handleOpenModal} 
        onDelete={handleDelete} 
      />

      {isModalOpen && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          title={selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
        >
          <EmployeeForm 
            onSubmit={handleFormSubmit} 
            employee={selectedEmployee}
          />
        </Modal>
      )}
    </div>
  );
};

export default Employees; 