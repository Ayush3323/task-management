// Run this script in the browser console to set up demo users
// Make sure you're logged in as an admin first

import { createUser } from './src/api/firestoreService.js';

// Set up demo users
const demoUsers = [
  {
    email: 'manager@taskmgmt.com',
    password: 'manager123',
    userData: {
      fullName: 'John Manager',
      role: 'Manager',
      department: 'Operations',
      status: 'Active',
      phone: '+1-555-0102',
      hireDate: '2023-02-01',
      permissions: {
        manage_employees: true,
        manage_parts: true,
        manage_tasks: true,
        view_reports: true,
        assign_tasks: true
      }
    }
  },
  {
    email: 'employee@taskmgmt.com',
    password: 'employee123',
    userData: {
      fullName: 'Jane Employee',
      role: 'Employee',
      department: 'Production',
      status: 'Active',
      phone: '+1-555-0103',
      hireDate: '2023-03-01',
      permissions: {
        view_tasks: true,
        update_task_status: true,
        view_parts: true
      }
    }
  },
  {
    email: 'manager2@taskmgmt.com',
    password: 'manager123',
    userData: {
      fullName: 'Alice Manager',
      role: 'Manager',
      department: 'Quality Control',
      status: 'Active',
      phone: '+1-555-0104',
      hireDate: '2023-04-01',
      permissions: {
        manage_employees: true,
        manage_parts: true,
        manage_tasks: true,
        view_reports: true,
        assign_tasks: true
      }
    }
  },
  {
    email: 'employee2@taskmgmt.com',
    password: 'employee123',
    userData: {
      fullName: 'Bob Employee',
      role: 'Employee',
      department: 'Maintenance',
      status: 'Active',
      phone: '+1-555-0105',
      hireDate: '2023-05-01',
      permissions: {
        view_tasks: true,
        update_task_status: true,
        view_parts: true
      }
    }
  }
];

console.log('Creating demo users...');
for (const user of demoUsers) {
  try {
    await createUser(user.email, user.password, user.userData);
    console.log(`✅ Created: ${user.email} (${user.userData.role})`);
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log(`⚠️ Already exists: ${user.email}`);
    } else {
      console.error(`❌ Error creating ${user.email}:`, error.message);
    }
  }
}

console.log('✅ Demo users setup completed!');
console.log('📧 Login credentials:');
console.log('   Admin: admin@taskmgmt.com / admin123');
console.log('   Manager: manager@taskmgmt.com / manager123');
console.log('   Manager 2: manager2@taskmgmt.com / manager123');
console.log('   Employee: employee@taskmgmt.com / employee123');
console.log('   Employee 2: employee2@taskmgmt.com / employee123'); 