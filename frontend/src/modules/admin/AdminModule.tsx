import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';

const AdminModule: React.FC = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="*" element={<AdminDashboard />} />
    </Routes>
  );
};

export default AdminModule;



