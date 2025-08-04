import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChange, getUserData, signOutUser } from '../api/firestoreService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          const data = await getUserData(user.uid);
          setUserData(data);
        } catch (error) {
          console.error('Error fetching user data:', error);
          // If user data doesn't exist, create a default admin user data
          if (error.code === 'not-found' || error.message.includes('not found')) {
            console.log('User data not found, creating default admin data...');
            const defaultUserData = {
              id: user.uid,
              uid: user.uid,
              email: user.email,
              fullName: user.displayName || 'System Administrator',
              role: 'Admin',
              department: 'IT',
              status: 'Active',
              phone: '+1-555-0101',
              hireDate: new Date().toISOString().split('T')[0],
              createdAt: new Date().toISOString(),
              createdBy: 'system',
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
            };
            setUserData(defaultUserData);
          } else {
            setUserData(null);
          }
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await signOutUser();
      setCurrentUser(null);
      setUserData(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateUserData = (newData) => {
    setUserData(prev => ({ ...prev, ...newData }));
  };

  // Role-based access control functions
  const hasPermission = (permission) => {
    if (!userData) return false;
    
    // Admin has all permissions
    if (userData.role === 'Admin') return true;
    
    // Check specific permissions
    if (userData.permissions && userData.permissions[permission]) {
      return true;
    }
    
    return false;
  };

  const canManageUsers = () => {
    return hasPermission('manage_users') || userData?.role === 'Admin';
  };

  const canManageEmployees = () => {
    return hasPermission('manage_employees') || userData?.role === 'Admin' || userData?.role === 'Manager';
  };

  const canViewReports = () => {
    return hasPermission('view_reports') || userData?.role === 'Admin' || userData?.role === 'Manager';
  };

  const canManageMachines = () => {
    return hasPermission('manage_machines') || userData?.role === 'Admin';
  };

  const canManageParts = () => {
    return hasPermission('manage_parts') || userData?.role === 'Admin' || userData?.role === 'Manager';
  };

  const canManageTasks = () => {
    return hasPermission('manage_tasks') || userData?.role === 'Admin' || userData?.role === 'Manager';
  };

  const value = {
    currentUser,
    userData,
    loading,
    logout,
    updateUserData,
    hasPermission,
    canManageUsers,
    canManageEmployees,
    canViewReports,
    canManageMachines,
    canManageParts,
    canManageTasks
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 