import { createUser, updateDocument } from '../api/firestoreService';

// Initial demo users setup
export const setupDemoUsers = async () => {
  const demoUsers = [
    {
      email: 'admin@taskmgmt.com',
      password: 'admin123',
      userData: {
        fullName: 'System Administrator',
        role: 'Admin',
        department: 'IT',
        status: 'Active',
        phone: '+1-555-0101',
        hireDate: '2023-01-01',
        permissions: {
          manage_users: true,
          manage_employees: true,
          manage_machines: true,
          manage_parts: true,
          manage_tasks: true,
          view_reports: true,
          create_managers: true,
          assign_permissions: true
        }
      }
    },
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
    }
  ];

  console.log('Setting up demo users...');
  
  for (const user of demoUsers) {
    try {
      const createdUser = await createUser(user.email, user.password, user.userData);
      console.log(`✅ Created user: ${user.email} (${user.userData.role})`);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`⚠️  User already exists: ${user.email}`);
      } else {
        console.error(`❌ Error creating user ${user.email}:`, error.message);
      }
    }
  }
  
  console.log('Demo users setup complete!');
};

// Function to create a new user (for admin use)
export const createNewUser = async (email, password, userData) => {
  try {
    const user = await createUser(email, password, userData);
    console.log(`✅ Created new user: ${email} (${userData.role})`);
    return user;
  } catch (error) {
    console.error(`❌ Error creating user ${email}:`, error.message);
    throw error;
  }
};

// Function to update user permissions (for admin use)
export const updateUserPermissions = async (uid, permissions) => {
  try {
    await updateDocument('users', uid, { permissions });
    console.log(`✅ Updated permissions for user: ${uid}`);
  } catch (error) {
    console.error(`❌ Error updating permissions for ${uid}:`, error.message);
    throw error;
  }
}; 