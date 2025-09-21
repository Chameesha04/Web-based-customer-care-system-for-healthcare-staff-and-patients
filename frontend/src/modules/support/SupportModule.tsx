import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SupportDashboard from './pages/SupportDashboard';

const SupportModule: React.FC = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<SupportDashboard />} />
      <Route path="*" element={<SupportDashboard />} />
    </Routes>
  );
};

export default SupportModule;



