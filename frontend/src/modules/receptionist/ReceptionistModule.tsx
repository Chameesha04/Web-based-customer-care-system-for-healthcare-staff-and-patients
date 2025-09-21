import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ReceptionistDashboard from './pages/ReceptionistDashboard';

const ReceptionistModule: React.FC = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<ReceptionistDashboard />} />
      <Route path="*" element={<ReceptionistDashboard />} />
    </Routes>
  );
};

export default ReceptionistModule;



