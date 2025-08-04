// Comprehensive debugging script for TaskForm
// Run this in browser console to identify the issue

import { getCollectionSnapshot } from './src/api/firestoreService.js';

console.log('🔍 Debugging TaskForm Data Fetching...');

// Test all collections that TaskForm needs
const collections = ['employees', 'users', 'machines', 'parts'];

const results = {};

for (const collectionName of collections) {
  console.log(`\n📋 Testing ${collectionName} collection...`);
  
  const promise = new Promise((resolve) => {
    const unsubscribe = getCollectionSnapshot(collectionName, (data) => {
      console.log(`${collectionName} data:`, data);
      unsubscribe();
      resolve(data);
    });
  });
  
  results[collectionName] = await promise;
}

// Analyze the data
console.log('\n📊 ANALYSIS:');

// Employees collection analysis
const employees = results.employees || [];
const employeeManagers = employees.filter(emp => emp.role === 'Manager');
const employeeEmployees = employees.filter(emp => emp.role === 'Employee');

console.log(`\n👥 Employees Collection:`);
console.log(`  Total: ${employees.length}`);
console.log(`  Managers: ${employeeManagers.length}`);
console.log(`  Employees: ${employeeEmployees.length}`);

// Users collection analysis
const users = results.users || [];
const userManagers = users.filter(user => user.role === 'Manager');
const userEmployees = users.filter(user => user.role === 'Employee');

console.log(`\n👤 Users Collection:`);
console.log(`  Total: ${users.length}`);
console.log(`  Managers: ${userManagers.length}`);
console.log(`  Employees: ${userEmployees.length}`);

// Machines and Parts
const machines = results.machines || [];
const parts = results.parts || [];

console.log(`\n🏭 Machines Collection: ${machines.length} machines`);
console.log(`🔧 Parts Collection: ${parts.length} parts`);

// Detailed breakdown
console.log('\n📋 DETAILED BREAKDOWN:');

console.log('\n👥 Employees Collection Details:');
if (employees.length === 0) {
  console.log('  ❌ No employees found!');
} else {
  employees.forEach((emp, index) => {
    console.log(`  ${index + 1}. ${emp.fullName || 'No name'} - ${emp.role || 'No role'} - ${emp.department || 'No dept'}`);
  });
}

console.log('\n👤 Users Collection Details:');
if (users.length === 0) {
  console.log('  ❌ No users found!');
} else {
  users.forEach((user, index) => {
    console.log(`  ${index + 1}. ${user.fullName || user.email || 'No name'} - ${user.role || 'No role'} - ${user.department || 'No dept'}`);
  });
}

console.log('\n🏭 Machines Collection Details:');
if (machines.length === 0) {
  console.log('  ❌ No machines found!');
} else {
  machines.forEach((machine, index) => {
    console.log(`  ${index + 1}. ${machine.name || 'No name'} - ${machine.type || 'No type'} - ${machine.status || 'No status'}`);
  });
}

console.log('\n🔧 Parts Collection Details:');
if (parts.length === 0) {
  console.log('  ❌ No parts found!');
} else {
  parts.forEach((part, index) => {
    console.log(`  ${index + 1}. ${part.name || 'No name'} - Stock: ${part.stock || part.inStock || 0}`);
  });
}

// Recommendations
console.log('\n💡 RECOMMENDATIONS:');

if (employeeManagers.length === 0 && userManagers.length === 0) {
  console.log('❌ No managers found in either collection!');
  console.log('   Solution: Add managers to either employees or users collection');
}

if (employeeEmployees.length === 0 && userEmployees.length === 0) {
  console.log('❌ No employees found in either collection!');
  console.log('   Solution: Add employees to either employees or users collection');
}

if (machines.length === 0) {
  console.log('❌ No machines found!');
  console.log('   Solution: Run setup-sample-machines.js to create sample machines');
}

if (parts.length === 0) {
  console.log('❌ No parts found!');
  console.log('   Solution: Run setup-sample-data.js to create sample parts');
}

// Determine which collection to use
if (employeeManagers.length > 0 || employeeEmployees.length > 0) {
  console.log('\n✅ RECOMMENDATION: Use "employees" collection for TaskForm');
  console.log('   Found data in employees collection');
} else if (userManagers.length > 0 || userEmployees.length > 0) {
  console.log('\n✅ RECOMMENDATION: Use "users" collection for TaskForm');
  console.log('   Found data in users collection');
} else {
  console.log('\n❌ No employee data found in either collection!');
}

console.log('\n🔧 NEXT STEPS:');
console.log('1. Check which collection has your employee data');
console.log('2. Update TaskForm to use the correct collection');
console.log('3. Ensure machines and parts data exists');
console.log('4. Test the TaskForm again');

console.log('\n✅ Debugging complete!'); 