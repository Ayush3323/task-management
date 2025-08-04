// Run this script in browser console to create sample machines and parts
import { addDocument } from './src/api/firestoreService.js';

const sampleMachines = [
  {
    name: 'Production Line A',
    type: 'Assembly Line',
    status: 'Operational',
    location: 'Factory Floor 1',
    lastMaintenance: '2025-07-15',
    nextMaintenance: '2025-09-15'
  },
  {
    name: 'CNC Machine B',
    type: 'CNC',
    status: 'Operational',
    location: 'Machine Shop',
    lastMaintenance: '2025-07-20',
    nextMaintenance: '2025-09-20'
  },
  {
    name: 'Packaging Machine C',
    type: 'Packaging',
    status: 'Operational',
    location: 'Packaging Area',
    lastMaintenance: '2025-07-10',
    nextMaintenance: '2025-09-10'
  }
];

const sampleParts = [
  {
    name: 'Motor Bearing',
    type: 'Mechanical',
    stock: 50,
    inStock: 50,
    minStock: 10,
    supplier: 'ABC Parts Co.',
    cost: 25.99
  },
  {
    name: 'Control Panel',
    type: 'Electrical',
    stock: 15,
    inStock: 15,
    minStock: 5,
    supplier: 'Tech Electronics',
    cost: 150.00
  },
  {
    name: 'Hydraulic Pump',
    type: 'Hydraulic',
    stock: 8,
    inStock: 8,
    minStock: 3,
    supplier: 'Fluid Systems Inc.',
    cost: 299.99
  },
  {
    name: 'Conveyor Belt',
    type: 'Mechanical',
    stock: 12,
    inStock: 12,
    minStock: 4,
    supplier: 'Conveyor Solutions',
    cost: 89.50
  }
];

console.log('Creating sample machines...');
for (const machine of sampleMachines) {
  try {
    await addDocument('machines', {
      ...machine,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    console.log(`✅ Created machine: ${machine.name}`);
  } catch (error) {
    console.error(`❌ Error creating machine ${machine.name}:`, error.message);
  }
}

console.log('Creating sample parts...');
for (const part of sampleParts) {
  try {
    await addDocument('parts', {
      ...part,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    console.log(`✅ Created part: ${part.name}`);
  } catch (error) {
    console.error(`❌ Error creating part ${part.name}:`, error.message);
  }
}

console.log('✅ Sample data creation complete!'); 