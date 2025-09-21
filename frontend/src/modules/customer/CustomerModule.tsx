import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CustomerDashboard from './pages/CustomerDashboard';
import BookingManagement from './pages/BookingManagement';
import BookingForm from './pages/BookingForm';
import SupportTicketManagement from './pages/SupportTicketManagement';
import SupportTicketForm from './pages/SupportTicketForm';
import NotificationCenter from './pages/NotificationCenter';
import FeedbackForm from './pages/FeedbackForm';

const CustomerModule: React.FC = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<CustomerDashboard />} />
      <Route path="bookings" element={<BookingManagement />} />
      <Route path="bookings/new" element={<BookingForm />} />
      <Route path="bookings/:id/edit" element={<BookingForm />} />
      <Route path="support" element={<SupportTicketManagement />} />
      <Route path="support/new" element={<SupportTicketForm />} />
      <Route path="support/:id" element={<SupportTicketManagement />} />
      <Route path="notifications" element={<NotificationCenter />} />
      <Route path="feedback" element={<FeedbackForm />} />
    </Routes>
  );
};

export default CustomerModule;



