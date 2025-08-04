import React, { useState, useEffect } from 'react';
import { addDocument, updateDocument, deleteDocument, getCollectionSnapshot } from '../api/firestoreService';
import { FiPlus, FiPackage, FiTrendingUp, FiTrendingDown, FiAlertTriangle } from 'react-icons/fi';
import './Parts.css';
import PartList from '../components/PartList';
import Modal from '../components/Modal';
import PartForm from '../components/PartForm';

const Parts = ({ parts, setParts, machines }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!parts) {
      const unsubscribe = getCollectionSnapshot('parts', (data) => {
        setParts(data);
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, [parts, setParts]);

  const handleOpenModal = (part = null) => {
    setSelectedPart(part);
    setIsModalOpen(true);
    setError(null);
  };

  const handleCloseModal = () => {
    setSelectedPart(null);
    setIsModalOpen(false);
    setError(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedPart) {
        await updateDocument('parts', selectedPart.id, {
          ...formData,
          updatedAt: new Date().toISOString()
        });
      } else {
        await addDocument('parts', {
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving part:', error);
      setError('Error saving part. Please try again.');
    }
  };

  const handleDelete = async (partId) => {
    if (window.confirm('Are you sure you want to delete this part? This action cannot be undone.')) {
      try {
        await deleteDocument('parts', partId);
      } catch (error) {
        console.error('Error deleting part:', error);
        alert('Error deleting part. Please try again.');
      }
    }
  };

  // Calculate statistics
  const totalParts = parts?.length || 0;
  const inStockParts = parts?.filter(p => (p.inStock || p.stock || 0) > 0).length || 0;
  const lowStockParts = parts?.filter(p => (p.inStock || p.stock || 0) <= 5).length || 0;
  const outOfStockParts = parts?.filter(p => (p.inStock || p.stock || 0) === 0).length || 0;

  // Debug logging
  console.log('Parts Page Debug:', {
    partsCount: parts?.length || 0,
    machinesCount: machines?.length || 0,
    sampleParts: parts?.slice(0, 3), // First 3 parts for debugging
    sampleMachines: machines?.slice(0, 3), // First 3 machines for debugging
    partsWithMachineIds: parts?.filter(p => p.machineId)?.length || 0
  });

  if (loading) {
    return (
      <div className="parts-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading parts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="parts-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Part Management</h1>
          <p>Track inventory and manage spare parts</p>
        </div>
        <button className="add-button" onClick={() => handleOpenModal()}>
          <FiPlus className="button-icon" />
          <span>Add Part</span>
        </button>
      </div>

      {/* Statistics Overview */}
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon">
            <FiPackage />
          </div>
          <div className="stat-content">
            <div className="stat-value">{totalParts}</div>
            <div className="stat-label">Total Parts</div>
          </div>
        </div>
        
        <div className="stat-card in-stock">
          <div className="stat-icon">
            <FiTrendingUp />
          </div>
          <div className="stat-content">
            <div className="stat-value">{inStockParts}</div>
            <div className="stat-label">In Stock</div>
          </div>
        </div>
        
        <div className="stat-card low-stock">
          <div className="stat-icon">
            <FiAlertTriangle />
          </div>
          <div className="stat-content">
            <div className="stat-value">{lowStockParts}</div>
            <div className="stat-label">Low Stock</div>
          </div>
        </div>
        
        <div className="stat-card out-of-stock">
          <div className="stat-icon">
            <FiTrendingDown />
          </div>
          <div className="stat-content">
            <div className="stat-value">{outOfStockParts}</div>
            <div className="stat-label">Out of Stock</div>
          </div>
        </div>
      </div>

      {/* Parts List */}
      <div className="content-section">
        <div className="section-header">
          <h2>Parts Inventory</h2>
          <div className="section-actions">
            <span className="parts-count">
              {parts?.length || 0} part{parts?.length !== 1 ? 's' : ''} in inventory
            </span>
          </div>
        </div>
        
        <PartList 
          parts={parts || []} 
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
          title={selectedPart ? 'Edit Part' : 'Add New Part'}
        >
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          <PartForm 
            onSubmit={handleFormSubmit} 
            part={selectedPart}
            machines={machines || []}
          />
        </Modal>
      )}
    </div>
  );
};

export default Parts;
