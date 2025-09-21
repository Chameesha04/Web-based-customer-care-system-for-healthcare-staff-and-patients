import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StaffDashboard from './pages/StaffDashboard';

const StaffModule: React.FC = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<StaffDashboard />} />
      <Route path="*" element={<StaffDashboard />} />
    </Routes>
  );
};

export default StaffModule;



