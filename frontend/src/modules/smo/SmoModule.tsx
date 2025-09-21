import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SMODashboard from './pages/SMODashboard';

const SmoModule: React.FC = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<SMODashboard />} />
      <Route path="*" element={<SMODashboard />} />
    </Routes>
  );
};

export default SmoModule;



