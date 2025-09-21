import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Role } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-healthcare-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user role
    const roleRoutes: Record<Role, string> = {
      [Role.CUSTOMER]: '/customer/dashboard',
      [Role.RECEPTIONIST]: '/receptionist/dashboard',
      [Role.SMO]: '/smo/dashboard',
      [Role.STAFF]: '/staff/dashboard',
      [Role.SUPPORT]: '/support/dashboard',
      [Role.ADMIN]: '/admin/dashboard'
    };

    return <Navigate to={roleRoutes[user.role]} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

