import React, { useState, useEffect } from 'react';
import { getCollectionSnapshot } from '../api/firestoreService';
import { FiPackage, FiRotateCcw, FiTruck, FiBox, FiThermometer, FiSettings } from 'react-icons/fi';
import './TaskForm.css';

const TaskForm = ({ machines = [], parts = [], onSubmit, userData }) => {
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [assignedBy, setAssignedBy] = useState('');
  const [machineId, setMachineId] = useState('');
  const [selectedParts, setSelectedParts] = useState([{ partId: '', quantity: 1 }]);
  const [managers, setManagers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New fields for plant management
  const [plantCategory, setPlantCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [comment, setComment] = useState('');
  
  // Existing fields
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [actualHours, setActualHours] = useState('');
  const [budget, setBudget] = useState('');
  const [actualCost, setActualCost] = useState('');
  const [taskType, setTaskType] = useState('');
  const [urgency, setUrgency] = useState('Normal');
  const [complexity, setComplexity] = useState('Medium');
  const [dependencies, setDependencies] = useState('');
  const [attachments, setAttachments] = useState('');
  const [notes, setNotes] = useState('');
  const [checklist, setChecklist] = useState([{ item: '', completed: false }]);

  // Plant categories matching client images
  const plantCategories = [
    { id: 'batching', name: 'Batching', icon: <FiPackage />, color: '#3b82f6' },
    { id: 'mixing', name: 'Mixing', icon: <FiRotateCcw />, color: '#10b981' },
    { id: 'conveying', name: 'Conveying', icon: <FiTruck />, color: '#f59e0b' },
    { id: 'packing', name: 'Packing', icon: <FiBox />, color: '#8b5cf6' },
    { id: 'heating', name: 'Heating', icon: <FiThermometer />, color: '#ef4444' },
    { id: 'milling', name: 'Milling', icon: <FiSettings />, color: '#6b7280' }
  ];

  // Fetch managers and employees from employees collection
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        console.log('Fetching employees...');
        
        // Use getCollectionSnapshot to get all employees
        const unsubscribe = getCollectionSnapshot('employees', (data) => {
          console.log('All employees data:', data);
          
          const managersData = data.filter(emp => emp.role === 'Manager');
          const employeesData = data.filter(emp => emp.role === 'Employee');
          
          console.log('Managers found:', managersData);
          console.log('Employees found:', employeesData);
          
          setManagers(managersData);
          setEmployees(employeesData);
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error('Error fetching employees:', error);
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Set assignedBy to current user if they're a manager
  useEffect(() => {
    if (userData?.role === 'Manager' && userData?.fullName) {
      setAssignedBy(userData.fullName);
    }
  }, [userData]);

  const handlePartChange = (index, field, value) => {
    const newParts = [...selectedParts];
    newParts[index][field] = value;
    setSelectedParts(newParts);
  };

  const addPartField = () => {
    setSelectedParts([...selectedParts, { partId: '', quantity: 1 }]);
  };

  const removePartField = (index) => {
    const newParts = selectedParts.filter((_, i) => i !== index);
    setSelectedParts(newParts);
  };

  const handleChecklistChange = (index, field, value) => {
    const newChecklist = [...checklist];
    if (field === 'completed') {
      newChecklist[index].completed = value;
    } else {
      newChecklist[index].item = value;
    }
    setChecklist(newChecklist);
  };

  const addChecklistItem = () => {
    setChecklist([...checklist, { item: '', completed: false }]);
  };

  const removeChecklistItem = (index) => {
    const newChecklist = checklist.filter((_, i) => i !== index);
    setChecklist(newChecklist);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate that we have machines and parts
    if (!machines || machines.length === 0) {
      alert('No machines available. Please add some machines first.');
      return;
    }

    if (!taskName.trim()) {
      alert('Please enter a task name.');
      return;
    }

    if (!assignedTo) {
      alert('Please select an employee to assign the task to.');
      return;
    }

    if (!assignedBy && userData?.role !== 'Manager') {
      alert('Please select a manager to assign the task.');
      return;
    }

    if (!plantCategory) {
      alert('Please select a plant category.');
      return;
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      alert('End date cannot be before start date.');
      return;
    }
    
    const taskData = {
      taskName,
      description,
      assignedTo,
      assignedBy,
      machineId,
      plantCategory,
      dueDate,
      comment,
      startDate,
      endDate,
      priority,
      category,
      taskType,
      urgency,
      complexity,
      estimatedHours: estimatedHours ? parseFloat(estimatedHours) : null,
      actualHours: actualHours ? parseFloat(actualHours) : null,
      budget: budget ? parseFloat(budget) : null,
      actualCost: actualCost ? parseFloat(actualCost) : null,
      dependencies,
      attachments,
      notes,
      checklist: checklist.filter(item => item.item.trim() !== ''),
      status: 'Pending',
      rating: 0,
      createdBy: userData?.uid || 'system',
      createdAt: new Date().toISOString(),
      parts: selectedParts
        .filter(p => p.partId && p.quantity > 0)
        .map(p => ({ id: p.partId, quantity: Number(p.quantity) }))
    };
    
    console.log('Submitting task data:', taskData);
    onSubmit(taskData);
  };

  // Debug info
  console.log('TaskForm props:', {
    machinesCount: machines?.length || 0,
    partsCount: parts?.length || 0,
    managersCount: managers.length,
    employeesCount: employees.length,
    loading
  });

  // Show loading state if data is not ready
  if (loading) {
    return (
      <div className="task-form">
        <h2>Add New Task</h2>
        <div className="loading-message">
          <p>Loading data...</p>
          <p>Machines: {machines ? machines.length : 'undefined'}</p>
          <p>Parts: {parts ? parts.length : 'undefined'}</p>
          <p>Managers: {managers.length}</p>
          <p>Employees: {employees.length}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h2>Add New Task</h2>
      
      {/* Plant Category Section - New */}
      <div className="form-section">
        <h3>Plant Category *</h3>
        
        <div className="plant-categories">
          {plantCategories.map((plant) => (
            <div 
              key={plant.id} 
              className={`plant-category ${plantCategory === plant.id ? 'selected' : ''}`}
              onClick={() => setPlantCategory(plant.id)}
            >
              <div className="plant-icon" style={{ color: plant.color }}>
                {plant.icon}
              </div>
              <span>{plant.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Basic Information Section */}
      <div className="form-section">
        <h3>Basic Information *</h3>
        
        <div className="form-group">
          <label>Task Name *</label>
          <input 
            type="text" 
            value={taskName} 
            onChange={(e) => setTaskName(e.target.value)} 
            placeholder="Enter task name"
            required 
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Describe the task details"
            rows="3"
            required 
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Select category</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Repair">Repair</option>
              <option value="Installation">Installation</option>
              <option value="Inspection">Inspection</option>
              <option value="Calibration">Calibration</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Training">Training</option>
              <option value="Documentation">Documentation</option>
              <option value="Testing">Testing</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Task Type</label>
            <select value={taskType} onChange={(e) => setTaskType(e.target.value)}>
              <option value="">Select task type</option>
              <option value="Preventive">Preventive Maintenance</option>
              <option value="Corrective">Corrective Maintenance</option>
              <option value="Emergency">Emergency Repair</option>
              <option value="Routine">Routine Task</option>
              <option value="Project">Project Work</option>
              <option value="Inspection">Inspection</option>
              <option value="Training">Training</option>
            </select>
          </div>
        </div>
      </div>

      {/* Assignment Section */}
      <div className="form-section">
        <h3>Assignment Information *</h3>
        
        <div className="form-row">
          {userData?.role !== 'Manager' && (
            <div className="form-group">
              <label>Assigned By (Manager) *</label>
              <select value={assignedBy} onChange={(e) => setAssignedBy(e.target.value)} required>
                <option value="">Select a manager ({managers.length} available)</option>
                {managers.map(manager => (
                  <option key={manager.id} value={manager.fullName}>
                    {manager.fullName} - {manager.department}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Assign To (Employee) *</label>
            <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} required>
              <option value="">Select an employee ({employees.length} available)</option>
              {employees.map(employee => (
                <option key={employee.id} value={employee.fullName}>
                  {employee.fullName} - {employee.department}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Machine *</label>
          <select value={machineId} onChange={(e) => setMachineId(e.target.value)} required>
            <option value="" disabled>Select a machine ({machines.length} available)</option>
            {machines.map(machine => (
              <option key={machine.id} value={machine.id}>
                {machine.name} - {machine.type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="form-section">
        <h3>Timeline & Scheduling</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label>Start Date</label>
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Due Date *</label>
            <input 
              type="date" 
              value={dueDate} 
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Estimated Hours</label>
            <input 
              type="number" 
              min="0" 
              step="0.5"
              value={estimatedHours} 
              onChange={(e) => setEstimatedHours(e.target.value)}
              placeholder="e.g., 8.5"
            />
          </div>

          <div className="form-group">
            <label>Actual Hours</label>
            <input 
              type="number" 
              min="0" 
              step="0.5"
              value={actualHours} 
              onChange={(e) => setActualHours(e.target.value)}
              placeholder="e.g., 7.5"
            />
          </div>
        </div>
      </div>

      {/* Priority & Classification Section */}
      <div className="form-section">
        <h3>Priority & Classification</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label>Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div className="form-group">
            <label>Urgency</label>
            <select value={urgency} onChange={(e) => setUrgency(e.target.value)}>
              <option value="Low">Low</option>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Complexity</label>
          <select value={complexity} onChange={(e) => setComplexity(e.target.value)}>
            <option value="Simple">Simple</option>
            <option value="Medium">Medium</option>
            <option value="Complex">Complex</option>
            <option value="Very Complex">Very Complex</option>
          </select>
        </div>
      </div>

      {/* Budget & Cost Section */}
      <div className="form-section">
        <h3>Budget & Cost Tracking</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label>Budget (USD)</label>
            <input 
              type="number" 
              min="0" 
              step="0.01"
              value={budget} 
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g., 500.00"
            />
          </div>

          <div className="form-group">
            <label>Actual Cost (USD)</label>
            <input 
              type="number" 
              min="0" 
              step="0.01"
              value={actualCost} 
              onChange={(e) => setActualCost(e.target.value)}
              placeholder="e.g., 450.00"
            />
          </div>
        </div>
      </div>

      {/* Parts Required Section */}
      <div className="form-section">
        <h3>Parts Required</h3>
        
        {selectedParts.map((part, index) => (
          <div key={index} className="part-selection">
            <select 
              value={part.partId} 
              onChange={(e) => handlePartChange(index, 'partId', e.target.value)}
            >
              <option value="" disabled>Select a part ({parts.length} available)</option>
              {parts.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} (Stock: {p.stock || p.inStock || 0})
                </option>
              ))}
            </select>
            <input 
              type="number" 
              min="1" 
              value={part.quantity} 
              onChange={(e) => handlePartChange(index, 'quantity', e.target.value)} 
              placeholder="Qty"
            />
            <button type="button" className="remove-part-btn" onClick={() => removePartField(index)}>&times;</button>
          </div>
        ))}
        <button type="button" className="add-part-btn" onClick={addPartField}>+ Add Part</button>
      </div>

      {/* Dependencies & Attachments Section */}
      <div className="form-section">
        <h3>Dependencies & Attachments</h3>
        
        <div className="form-group">
          <label>Dependencies</label>
          <textarea 
            value={dependencies} 
            onChange={(e) => setDependencies(e.target.value)} 
            placeholder="List any tasks or conditions that must be completed before this task"
            rows="2"
          />
        </div>

        <div className="form-group">
          <label>Attachments/References</label>
          <textarea 
            value={attachments} 
            onChange={(e) => setAttachments(e.target.value)} 
            placeholder="List any attachments, manuals, or reference documents"
            rows="2"
          />
        </div>
      </div>

      {/* Checklist Section */}
      <div className="form-section">
        <h3>Task Checklist</h3>
        
        {checklist.map((item, index) => (
          <div key={index} className="checklist-item">
            <input 
              type="checkbox" 
              checked={item.completed}
              onChange={(e) => handleChecklistChange(index, 'completed', e.target.checked)}
            />
            <input 
              type="text" 
              value={item.item} 
              onChange={(e) => handleChecklistChange(index, 'item', e.target.value)}
              placeholder="Enter checklist item"
            />
            <button type="button" className="remove-checklist-btn" onClick={() => removeChecklistItem(index)}>&times;</button>
          </div>
        ))}
        <button type="button" className="add-checklist-btn" onClick={addChecklistItem}>+ Add Checklist Item</button>
      </div>

      {/* Comment Section - New */}
      <div className="form-section">
        <h3>Comments</h3>
        
        <div className="form-group">
          <label>Comment</label>
          <textarea 
            value={comment} 
            onChange={(e) => setComment(e.target.value)} 
            placeholder="Enter a comment"
            rows="3"
          />
        </div>
      </div>

      {/* Additional Notes Section */}
      <div className="form-section">
        <h3>Additional Information</h3>
        
        <div className="form-group">
          <label>Notes</label>
          <textarea 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
            placeholder="Any additional notes, special instructions, or comments"
            rows="3"
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-btn">Create Task</button>
      </div>
    </form>
  );
};

export default TaskForm;
