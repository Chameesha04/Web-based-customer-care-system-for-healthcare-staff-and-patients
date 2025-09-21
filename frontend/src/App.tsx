import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Layout from './components/Layout';
import Login from './components/auth/Login';
import ContactAdmin from './components/auth/ContactAdmin';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './components/Dashboard';

// Module imports
import CustomerModule from './modules/customer/CustomerModule';
import ReceptionistModule from './modules/receptionist/ReceptionistModule';
import SmoModule from './modules/smo/SmoModule';
import StaffModule from './modules/staff/StaffModule';
import SupportModule from './modules/support/SupportModule';
import AdminModule from './modules/admin/AdminModule';
import { Role } from './types';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/contact-admin" element={<ContactAdmin />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                
                {/* Customer Routes */}
                <Route path="customer/*" element={
                  <ProtectedRoute allowedRoles={[Role.CUSTOMER]}>
                    <CustomerModule />
                  </ProtectedRoute>
                } />
                
                {/* Receptionist Routes */}
                <Route path="receptionist/*" element={
                  <ProtectedRoute allowedRoles={[Role.RECEPTIONIST]}>
                    <ReceptionistModule />
                  </ProtectedRoute>
                } />
                
                {/* SMO Routes */}
                <Route path="smo/*" element={
                  <ProtectedRoute allowedRoles={[Role.SMO]}>
                    <SmoModule />
                  </ProtectedRoute>
                } />
                
                {/* Staff Routes */}
                <Route path="staff/*" element={
                  <ProtectedRoute allowedRoles={[Role.STAFF]}>
                    <StaffModule />
                  </ProtectedRoute>
                } />
                
                {/* Support Routes */}
                <Route path="support/*" element={
                  <ProtectedRoute allowedRoles={[Role.SUPPORT]}>
                    <SupportModule />
                  </ProtectedRoute>
                } />
                
                {/* Admin Routes */}
                <Route path="admin/*" element={
                  <ProtectedRoute allowedRoles={[Role.ADMIN]}>
                    <AdminModule />
                  </ProtectedRoute>
                } />
              </Route>
            </Routes>
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;