// Test script to verify employees collection data
// Run this in browser console

import { getCollectionSnapshot } from './src/api/firestoreService.js';

console.log('🔍 Testing Employees Collection...');

// Test employees collection
console.log('👥 Testing employees...');
const employeesPromise = new Promise((resolve) => {
  const unsubscribe = getCollectionSnapshot('employees', (data) => {
    console.log('Employees collection data:', data);
    unsubscribe();
    resolve(data);
  });
});

// Test users collection (for comparison)
console.log('👤 Testing users collection...');
const usersPromise = new Promise((resolve) => {
  const unsubscribe = getCollectionSnapshot('users', (data) => {
    console.log('Users collection data:', data);
    unsubscribe();
    resolve(data);
  });
});

const [employees, users] = await Promise.all([employeesPromise, usersPromise]);

// Filter by role
const employeeManagers = employees.filter(emp => emp.role === 'Manager');
const employeeEmployees = employees.filter(emp => emp.role === 'Employee');

const userManagers = users.filter(user => user.role === 'Manager');
const userEmployees = users.filter(user => user.role === 'Employee');

console.log('📊 Summary:');
console.log(`- Employees Collection: ${employees.length} total`);
console.log(`  - Managers: ${employeeManagers.length}`);
console.log(`  - Employees: ${employeeEmployees.length}`);

console.log(`- Users Collection: ${users.length} total`);
console.log(`  - Managers: ${userManagers.length}`);
console.log(`  - Employees: ${userEmployees.length}`);

console.log('\n👥 Employees Collection Details:');
employees.forEach((emp, index) => {
  console.log(`${index + 1}. ${emp.fullName} - ${emp.role} - ${emp.department}`);
});

console.log('\n👤 Users Collection Details:');
users.forEach((user, index) => {
  console.log(`${index + 1}. ${user.fullName || user.email} - ${user.role} - ${user.department || 'N/A'}`);
});

// Recommendations
if (employeeManagers.length === 0 && userManagers.length > 0) {
  console.log('\n💡 RECOMMENDATION: TaskForm should use "users" collection');
  console.log('   Found managers in users collection but not in employees collection');
}

if (employeeManagers.length > 0 && userManagers.length === 0) {
  console.log('\n💡 RECOMMENDATION: TaskForm should use "employees" collection');
  console.log('   Found managers in employees collection but not in users collection');
}

if (employeeManagers.length === 0 && userManagers.length === 0) {
  console.log('\n❌ No managers found in either collection!');
  console.log('   Please add some managers first.');
}

if (employeeEmployees.length === 0 && userEmployees.length === 0) {
  console.log('\n❌ No employees found in either collection!');
  console.log('   Please add some employees first.');
}

console.log('\n✅ Employee data test complete!'); 