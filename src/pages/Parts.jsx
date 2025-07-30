import React, { useState } from 'react';
import { addDocument, updateDocument, deleteDocument } from '../api/firestoreService';
import './Parts.css';
import PartList from '../components/PartList';
import Modal from '../components/Modal';
import PartForm from '../components/PartForm';

const Parts = ({ parts, machines }) => {
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

  const handleFormSubmit = async (formData) => {
    if (selectedPart) {
      await updateDocument('parts', selectedPart.id, formData);
    } else {
      await addDocument('parts', formData);
    }
    handleCloseModal();
  };

  const handleDelete = async (partId) => {
    if (window.confirm('Are you sure you want to delete this part?')) {
      await deleteDocument('parts', partId);
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
