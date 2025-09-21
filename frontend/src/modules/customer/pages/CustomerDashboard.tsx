import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  PlusIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { CustomerDashboard as CustomerDashboardType, Appointment, SupportTicket } from '../../../types';
import apiService from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotifications } from '../../../contexts/NotificationContext';

const CustomerDashboard: React.FC = () => {
  const [dashboard, setDashboard] = useState<CustomerDashboardType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { unreadCount } = useNotifications();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await apiService.getCustomerDashboard();
      setDashboard(data);
    } catch (err) {
      setError('Failed to load dashboard');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-100 text-red-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'NORMAL': return 'bg-blue-100 text-blue-800';
      case 'LOW': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-healthcare-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error</h3>
        <p className="mt-1 text-sm text-gray-500">{error}</p>
        <button
          onClick={loadDashboard}
          className="mt-4 btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-healthcare-600 to-healthcare-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="mt-2 text-healthcare-100">
              Here's what's happening with your healthcare appointments
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{unreadCount}</div>
            <div className="text-sm text-healthcare-100">New Notifications</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarIcon className="h-8 w-8 text-healthcare-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Upcoming Appointments</p>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboard?.upcomingAppointments?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Support Tickets</p>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboard?.recentTickets?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BellIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Unread Notifications</p>
              <p className="text-2xl font-semibold text-gray-900">{unreadCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Appointments</h2>
          <Link to="/customer/bookings/new" className="btn-primary">
            <PlusIcon className="h-5 w-5 mr-2" />
            Book Appointment
          </Link>
        </div>

        {dashboard?.upcomingAppointments && dashboard.upcomingAppointments.length > 0 ? (
          <div className="space-y-4">
            {dashboard.upcomingAppointments.slice(0, 3).map((appointment) => (
              <div key={appointment.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 bg-healthcare-100 rounded-full flex items-center justify-center">
                        <CalendarIcon className="h-6 w-6 text-healthcare-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(appointment.appointmentDate)} at {formatTime(appointment.appointmentTime)}
                      </p>
                      {appointment.reason && (
                        <p className="text-sm text-gray-600 mt-1">{appointment.reason}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(appointment.priority)}`}>
                      {appointment.priority}
                    </span>
                    {appointment.queueNumber && (
                      <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                        Queue #{appointment.queueNumber}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {dashboard.upcomingAppointments.length > 3 && (
              <div className="text-center">
                <Link to="/customer/bookings" className="text-healthcare-600 hover:text-healthcare-700 font-medium">
                  View all appointments ({dashboard.upcomingAppointments.length})
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming appointments</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by booking your first appointment.</p>
            <div className="mt-6">
              <Link to="/customer/bookings/new" className="btn-primary">
                <PlusIcon className="h-5 w-5 mr-2" />
                Book Appointment
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Recent Support Tickets */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Support Tickets</h2>
          <Link to="/customer/support/new" className="btn-primary">
            <PlusIcon className="h-5 w-5 mr-2" />
            New Ticket
          </Link>
        </div>

        {dashboard?.recentTickets && dashboard.recentTickets.length > 0 ? (
          <div className="space-y-4">
            {dashboard.recentTickets.slice(0, 3).map((ticket) => (
              <div key={ticket.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{ticket.title}</h3>
                      <p className="text-sm text-gray-500">
                        #{ticket.ticketNumber} • {formatDate(ticket.createdAt)}
                      </p>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{ticket.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                    <Link 
                      to={`/customer/support/${ticket.id}`}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            {dashboard.recentTickets.length > 3 && (
              <div className="text-center">
                <Link to="/customer/support" className="text-healthcare-600 hover:text-healthcare-700 font-medium">
                  View all tickets ({dashboard.recentTickets.length})
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No support tickets</h3>
            <p className="mt-1 text-sm text-gray-500">Need help? Create a support ticket.</p>
            <div className="mt-6">
              <Link to="/customer/support/new" className="btn-primary">
                <PlusIcon className="h-5 w-5 mr-2" />
                Create Ticket
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/customer/bookings/new" className="btn-secondary">
            <CalendarIcon className="h-6 w-6 mr-2" />
            Book Appointment
          </Link>
          <Link to="/customer/support/new" className="btn-secondary">
            <ChatBubbleLeftRightIcon className="h-6 w-6 mr-2" />
            Get Support
          </Link>
          <Link to="/customer/feedback" className="btn-secondary">
            <BellIcon className="h-6 w-6 mr-2" />
            Give Feedback
          </Link>
          <Link to="/customer/notifications" className="btn-secondary">
            <BellIcon className="h-6 w-6 mr-2" />
            View Notifications
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;

