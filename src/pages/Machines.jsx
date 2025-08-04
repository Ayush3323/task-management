import React, { useState, useEffect } from 'react';
import { addDocument, updateDocument, deleteDocument, getCollectionSnapshot } from '../api/firestoreService';
import { FiPlus, FiPackage, FiActivity, FiMapPin, FiSettings } from 'react-icons/fi';
import './Machines.css';
import MachineList from '../components/MachineList';
import Modal from '../components/Modal';
import MachineForm from '../components/MachineForm';

const Machines = ({ machines, setMachines, userData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!machines) {
      const unsubscribe = getCollectionSnapshot('machines', (data) => {
        setMachines(data);
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, [machines, setMachines]);

  const handleOpenModal = (machine = null) => {
    setSelectedMachine(machine);
    setIsModalOpen(true);
    setError(null);
  };

  const handleCloseModal = () => {
    setSelectedMachine(null);
    setIsModalOpen(false);
    setError(null);
  };

  const handleDelete = async (machineId) => {
    if (window.confirm('Are you sure you want to delete this machine? This action cannot be undone.')) {
      try {
        await deleteDocument('machines', machineId);
      } catch (error) {
        console.error('Error deleting machine:', error);
        alert('Error deleting machine. Please try again.');
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      const machineData = {
        ...formData,
        updatedAt: new Date().toISOString(),
        updatedBy: userData?.uid || 'system'
      };

      if (selectedMachine) {
        await updateDocument('machines', selectedMachine.id, machineData);
      } else {
        machineData.createdAt = new Date().toISOString();
        machineData.createdBy = userData?.uid || 'system';
        await addDocument('machines', machineData);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving machine:', error);
      setError('Error saving machine. Please try again.');
    }
  };

  // Calculate statistics
  const totalMachines = machines?.length || 0;
  const operationalMachines = machines?.filter(m => m.status === 'Operational').length || 0;
  const maintenanceMachines = machines?.filter(m => m.status === 'Needs Maintenance').length || 0;
  const offlineMachines = machines?.filter(m => m.status === 'Offline').length || 0;

  if (loading) {
    return (
      <div className="machines-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading machines...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="machines-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Machine Management</h1>
          <p>Monitor and manage your production equipment</p>
        </div>
        <button className="add-button" onClick={() => handleOpenModal()}>
          <FiPlus className="button-icon" />
          <span>Add Machine</span>
        </button>
      </div>

      {/* Statistics Overview */}
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon">
            <FiPackage />
          </div>
          <div className="stat-content">
            <div className="stat-value">{totalMachines}</div>
            <div className="stat-label">Total Machines</div>
          </div>
        </div>
        
        <div className="stat-card operational">
          <div className="stat-icon">
            <FiActivity />
          </div>
          <div className="stat-content">
            <div className="stat-value">{operationalMachines}</div>
            <div className="stat-label">Operational</div>
          </div>
        </div>
        
        <div className="stat-card maintenance">
          <div className="stat-icon">
            <FiSettings />
          </div>
          <div className="stat-content">
            <div className="stat-value">{maintenanceMachines}</div>
            <div className="stat-label">Needs Maintenance</div>
          </div>
        </div>
        
        <div className="stat-card offline">
          <div className="stat-icon">
            <FiMapPin />
          </div>
          <div className="stat-content">
            <div className="stat-value">{offlineMachines}</div>
            <div className="stat-label">Offline</div>
          </div>
        </div>
      </div>

      {/* Machine List */}
      <div className="content-section">
        <div className="section-header">
          <h2>Machine Inventory</h2>
          <div className="section-actions">
            <span className="machine-count">
              {machines?.length || 0} machine{machines?.length !== 1 ? 's' : ''} in inventory
            </span>
          </div>
        </div>
        
        <MachineList 
          machines={machines || []} 
          onEdit={handleOpenModal} 
          onDelete={handleDelete} 
        />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          title={selectedMachine ? 'Edit Machine' : 'Add New Machine'}
        >
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          <MachineForm 
            onSubmit={handleFormSubmit} 
            machine={selectedMachine}
            userData={userData}
          />
        </Modal>
      )}
    </div>
  );
};

export default Machines;
