import React, { useState } from 'react';
import './Parts.css';
import PartList from '../components/PartList';
import Modal from '../components/Modal';
import PartForm from '../components/PartForm';

const Parts = ({ parts, setParts, machines }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);

  const handleOpenModal = (part = null) => {
    setSelectedPart(part);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedPart(null);
    setIsModalOpen(false);
  };

  const handleFormSubmit = (formData) => {
    if (selectedPart) {
      // Update existing part
      setParts(parts.map(p => p.id === selectedPart.id ? { ...p, ...formData } : p));
    } else {
      // Add new part
      const newPart = { ...formData, id: `P${Date.now()}` };
      setParts([...parts, newPart]);
    }
    handleCloseModal();
  };

  const handleDelete = (partId) => {
    if (window.confirm('Are you sure you want to delete this part?')) {
      setParts(parts.filter(p => p.id !== partId));
    }
  };

  return (
    <div className="parts-page">
      <div className="page-header">
        <h2>Part Management</h2>
        <button className="add-new-button" onClick={() => handleOpenModal()}>+ Add New Part</button>
      </div>
      <PartList parts={parts} onEdit={handleOpenModal} onDelete={handleDelete} />

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={selectedPart ? 'Edit Part' : 'Add New Part'}>
        <PartForm onSubmit={handleFormSubmit} part={selectedPart} machines={machines} />
      </Modal>
    </div>
  );
};

export default Parts;
