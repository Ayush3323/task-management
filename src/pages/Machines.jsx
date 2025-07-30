import React, { useState } from 'react';
import { addDocument, updateDocument, deleteDocument } from '../api/firestoreService';
import './Machines.css';
import MachineList from '../components/MachineList';
import Modal from '../components/Modal';
import MachineForm from '../components/MachineForm';

const Machines = ({ machines }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);

  const handleOpenModal = (machine = null) => {
    setSelectedMachine(machine);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedMachine(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (machineId) => {
    if (window.confirm('Are you sure you want to delete this machine?')) {
      await deleteDocument('machines', machineId);
    }
  };

  const handleFormSubmit = async (formData) => {
    if (selectedMachine) {
      await updateDocument('machines', selectedMachine.id, formData);
    } else {
      await addDocument('machines', formData);
    }
    handleCloseModal();
  };

  return (
    <div className="machines-page">
      <div className="page-header">
        <h1>Machine Management</h1>
        <button className="add-button" onClick={() => handleOpenModal()}>
          Add Machine
        </button>
      </div>
      <MachineList 
        machines={machines} 
        onEdit={handleOpenModal} 
        onDelete={handleDelete} 
      />
      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <MachineForm 
            onSubmit={handleFormSubmit} 
            initialData={selectedMachine}
          />
        </Modal>
      )}
    </div>
  );
};

export default Machines;
