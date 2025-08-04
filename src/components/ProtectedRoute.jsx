import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null, requiredPermission = null }) => {
  const { currentUser, userData, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Check if user data is loaded
  if (!userData) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading user data...</p>
      </div>
    );
  }

  // Check role-based access
  if (requiredRole && userData.role !== requiredRole) {
    // Check if user has higher privileges
    const roleHierarchy = {
      'Employee': 1,
      'Manager': 2,
      'Admin': 3
    };

    const userRoleLevel = roleHierarchy[userData.role] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

    if (userRoleLevel < requiredRoleLevel) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check permission-based access
  if (requiredPermission) {
    const { hasPermission } = useAuth();
    if (!hasPermission(requiredPermission)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute; 