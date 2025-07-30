export const mockTasks = [
  {
    id: 'T001',
    description: 'Replace CNC Mill cutting head',
    machineId: 'M001',
    assignedTo: 'Alice',
    status: 'In Progress',
    parts: [{ id: 'P001', quantity: 2 }],
    rating: 0
  },
  {
    id: 'T002',
    description: 'Calibrate Laser Cutter optics',
    machineId: 'M002',
    assignedTo: 'Bob',
    status: 'Pending',
    parts: [{ id: 'P002', quantity: 1 }],
    rating: 0
  },
  {
    id: 'T003',
    description: 'Refill 3D Printer filament',
    machineId: 'M003',
    assignedTo: 'Charlie',
    status: 'Completed',
    parts: [{ id: 'P003', quantity: 1 }],
    rating: 0
  },
];
