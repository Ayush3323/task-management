// Test script to verify data exists in Firestore
// Run this in browser console

import { getAllUsers, getCollectionSnapshot } from './src/api/firestoreService.js';

console.log('🔍 Testing Firestore data...');

// Test users
console.log('📋 Testing users...');
const allUsers = await getAllUsers();
console.log('All users:', allUsers);

const managers = allUsers.filter(u => u.role === 'Manager');
const employees = allUsers.filter(u => u.role === 'Employee');
const admins = allUsers.filter(u => u.role === 'Admin');

console.log('👨‍💼 Managers:', managers);
console.log('👷 Employees:', employees);
console.log('👑 Admins:', admins);

// Test machines
console.log('🏭 Testing machines...');
const machinesPromise = new Promise((resolve) => {
  const unsubscribe = getCollectionSnapshot('machines', (data) => {
    console.log('Machines:', data);
    unsubscribe();
    resolve(data);
  });
});

// Test parts
console.log('🔧 Testing parts...');
const partsPromise = new Promise((resolve) => {
  const unsubscribe = getCollectionSnapshot('parts', (data) => {
    console.log('Parts:', data);
    unsubscribe();
    resolve(data);
  });
});

const [machines, parts] = await Promise.all([machinesPromise, partsPromise]);

console.log('📊 Summary:');
console.log(`- Users: ${allUsers.length} total`);
console.log(`- Managers: ${managers.length}`);
console.log(`- Employees: ${employees.length}`);
console.log(`- Machines: ${machines.length}`);
console.log(`- Parts: ${parts.length}`);

if (managers.length === 0) {
  console.log('❌ No managers found! Run setup-demo-users.js');
}

if (employees.length === 0) {
  console.log('❌ No employees found! Run setup-demo-users.js');
}

if (machines.length === 0) {
  console.log('❌ No machines found! Run setup-sample-data.js');
}

if (parts.length === 0) {
  console.log('❌ No parts found! Run setup-sample-data.js');
}

console.log('✅ Data test complete!'); 