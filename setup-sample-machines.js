// Run this script in browser console to create comprehensive sample machines
import { addDocument } from './src/api/firestoreService.js';

const sampleMachines = [
  {
    // Required Fields
    name: 'Production Line A',
    type: 'Assembly Line',
    status: 'Operational',
    location: 'Factory Floor 1',
    
    // Basic Information
    manufacturer: 'Siemens',
    model: 'SIMATIC S7-1500',
    serialNumber: 'SN-PLA-2025-001',
    capacity: '1000 units/hour',
    
    // Technical Specifications
    powerConsumption: '75 kW',
    voltage: '480V',
    current: '150A',
    speed: '50 m/min',
    dimensions: '25m x 3m x 2.5m',
    weight: '15,000 kg',
    
    // Maintenance Information
    lastMaintenance: '2025-07-15',
    nextMaintenance: '2025-10-15',
    maintenanceInterval: 'Every 3 months',
    maintenanceNotes: 'Requires lubrication check every 500 hours',
    operatingHours: '8760',
    
    // Operational Information
    installationDate: '2023-01-15',
    warrantyExpiry: '2026-01-15',
    efficiency: '95%',
    
    // Contact & Support
    supplier: 'Siemens Industrial Automation',
    supplierContact: 'John Smith',
    supportPhone: '+1-800-SIEMENS',
    supportEmail: 'support@siemens.com',
    
    // Additional Information
    description: 'Automated assembly line for automotive parts production with robotic welding stations',
    specifications: 'PLC controlled, 12 robotic stations, vision inspection system, safety interlocks',
    notes: 'Critical equipment for main production line. Backup systems available.'
  },
  {
    // Required Fields
    name: 'CNC Machine B',
    type: 'CNC',
    status: 'Operational',
    location: 'Machine Shop',
    
    // Basic Information
    manufacturer: 'Haas Automation',
    model: 'VF-2SS',
    serialNumber: 'SN-CNC-2025-002',
    capacity: 'High precision machining',
    
    // Technical Specifications
    powerConsumption: '30 kW',
    voltage: '220V',
    current: '80A',
    speed: '8100 RPM',
    dimensions: '2.5m x 2m x 2.8m',
    weight: '3500 kg',
    
    // Maintenance Information
    lastMaintenance: '2025-07-20',
    nextMaintenance: '2025-10-20',
    maintenanceInterval: 'Every 3 months',
    maintenanceNotes: 'Check coolant levels, clean chip conveyor',
    operatingHours: '4320',
    
    // Operational Information
    installationDate: '2023-03-10',
    warrantyExpiry: '2026-03-10',
    efficiency: '92%',
    
    // Contact & Support
    supplier: 'Haas Automation Inc.',
    supplierContact: 'Mike Johnson',
    supportPhone: '+1-800-HAAS-VMC',
    supportEmail: 'service@haascnc.com',
    
    // Additional Information
    description: 'Vertical machining center for precision metal parts manufacturing',
    specifications: '3-axis CNC, 20-tool automatic tool changer, 40\" x 20\" x 25\" work envelope',
    notes: 'Primary machine for prototype and small batch production'
  },
  {
    // Required Fields
    name: 'Packaging Machine C',
    type: 'Packaging',
    status: 'Needs Maintenance',
    location: 'Packaging Area',
    
    // Basic Information
    manufacturer: 'Sealed Air',
    model: 'Cryovac GVS-900',
    serialNumber: 'SN-PKG-2025-003',
    capacity: '500 packages/hour',
    
    // Technical Specifications
    powerConsumption: '25 kW',
    voltage: '480V',
    current: '60A',
    speed: '30 packages/min',
    dimensions: '4m x 2.5m x 3m',
    weight: '2800 kg',
    
    // Maintenance Information
    lastMaintenance: '2025-06-10',
    nextMaintenance: '2025-09-10',
    maintenanceInterval: 'Every 3 months',
    maintenanceNotes: 'Vacuum pump needs replacement, seal inspection required',
    operatingHours: '6240',
    
    // Operational Information
    installationDate: '2023-06-20',
    warrantyExpiry: '2026-06-20',
    efficiency: '88%',
    
    // Contact & Support
    supplier: 'Sealed Air Corporation',
    supplierContact: 'Sarah Wilson',
    supportPhone: '+1-800-SEALED',
    supportEmail: 'service@sealedair.com',
    
    // Additional Information
    description: 'Automated vacuum packaging system for food products',
    specifications: 'Vacuum sealing, gas flushing, automatic film feed, temperature control',
    notes: 'Scheduled for major maintenance. Backup packaging line available.'
  },
  {
    // Required Fields
    name: 'Welding Robot D',
    type: 'Robot',
    status: 'Operational',
    location: 'Welding Station 1',
    
    // Basic Information
    manufacturer: 'ABB Robotics',
    model: 'IRB 2600',
    serialNumber: 'SN-ROB-2025-004',
    capacity: '200 welds/hour',
    
    // Technical Specifications
    powerConsumption: '15 kW',
    voltage: '380V',
    current: '40A',
    speed: '2.5 m/s',
    dimensions: '2.8m x 1.5m x 2.2m',
    weight: '1200 kg',
    
    // Maintenance Information
    lastMaintenance: '2025-07-25',
    nextMaintenance: '2025-10-25',
    maintenanceInterval: 'Every 3 months',
    maintenanceNotes: 'Check welding torch condition, calibrate positioning',
    operatingHours: '7200',
    
    // Operational Information
    installationDate: '2023-08-15',
    warrantyExpiry: '2026-08-15',
    efficiency: '96%',
    
    // Contact & Support
    supplier: 'ABB Robotics',
    supplierContact: 'David Chen',
    supportPhone: '+1-800-ABB-ROBOT',
    supportEmail: 'robotics.service@abb.com',
    
    // Additional Information
    description: 'Industrial welding robot for automotive frame assembly',
    specifications: '6-axis articulated robot, MIG welding capability, vision guidance system',
    notes: 'High precision welding robot with advanced path planning'
  },
  {
    // Required Fields
    name: 'Conveyor System E',
    type: 'Conveyor',
    status: 'Operational',
    location: 'Material Handling Area',
    
    // Basic Information
    manufacturer: 'Hytrol Conveyor',
    model: 'EZLogic Accumulation',
    serialNumber: 'SN-CON-2025-005',
    capacity: '3000 lbs/hour',
    
    // Technical Specifications
    powerConsumption: '8 kW',
    voltage: '220V',
    current: '25A',
    speed: '60 ft/min',
    dimensions: '50m x 1.2m x 1.5m',
    weight: '5000 kg',
    
    // Maintenance Information
    lastMaintenance: '2025-07-30',
    nextMaintenance: '2025-10-30',
    maintenanceInterval: 'Every 3 months',
    maintenanceNotes: 'Lubricate bearings, check belt tension',
    operatingHours: '8760',
    
    // Operational Information
    installationDate: '2023-11-05',
    warrantyExpiry: '2026-11-05',
    efficiency: '98%',
    
    // Contact & Support
    supplier: 'Hytrol Conveyor Co.',
    supplierContact: 'Robert Davis',
    supportPhone: '+1-800-HYTROL',
    supportEmail: 'service@hytrol.com',
    
    // Additional Information
    description: 'Automated conveyor system for material handling and sorting',
    specifications: 'Zero pressure accumulation, photo eye sensors, variable speed control',
    notes: 'Main material handling system connecting all production areas'
  }
];

console.log('Creating comprehensive sample machines...');
for (const machine of sampleMachines) {
  try {
    await addDocument('machines', {
      ...machine,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'system',
      updatedBy: 'system'
    });
    console.log(`✅ Created machine: ${machine.name}`);
  } catch (error) {
    console.error(`❌ Error creating machine ${machine.name}:`, error.message);
  }
}

console.log('✅ Comprehensive sample machines creation complete!');
console.log('📋 Created machines with all fields:');
console.log('   - Production Line A (Assembly Line)');
console.log('   - CNC Machine B (CNC)');
console.log('   - Packaging Machine C (Packaging)');
console.log('   - Welding Robot D (Robot)');
console.log('   - Conveyor System E (Conveyor)'); 