import React, { useState } from 'react';
import './Machines.css';
import MachineList from '../components/MachineList';
import Modal from '../components/Modal';
import MachineForm from '../components/MachineForm';

const Machines = ({ machines, setMachines }) => {
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

    const handleDelete = (machineId) => {
    if (window.confirm('Are you sure you want to delete this machine?')) {
      setMachines(machines.filter(m => m.id !== machineId));
    }
  };

  const handleFormSubmit = (formData) => {
    if (selectedMachine) {
      // Update existing machine
      setMachines(machines.map(m => m.id === selectedMachine.id ? { ...m, ...formData } : m));
    } else {
      // Add new machine
      const newMachine = { ...formData, id: `M${Date.now()}` };
      setMachines([...machines, newMachine]);
    }
    handleCloseModal();
  };

  return (
    <div className="machines-page">
      <div className="page-header">
        <h2>Machine Management</h2>
        <button className="add-new-button" onClick={() => handleOpenModal()}>+ Add New Machine</button>
      </div>
      <MachineList machines={machines} onEdit={handleOpenModal} onDelete={handleDelete} />

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={selectedMachine ? 'Edit Machine' : 'Add New Machine'}>
        <MachineForm onSubmit={handleFormSubmit} machine={selectedMachine} />
      </Modal>
    </div>
  );
};

export default Machines;
