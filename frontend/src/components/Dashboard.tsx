import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  CalendarIcon, 
  UserGroupIcon, 
  ClipboardDocumentCheckIcon, 
  ClockIcon, 
  ChatBubbleLeftRightIcon, 
  CogIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const getDashboardContent = () => {
    switch (user?.role) {
      case 'CUSTOMER':
        return (
          <>
            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="metric-value text-healthcare-600">3</p>
                    <p className="metric-label">Upcoming Appointments</p>
                  </div>
                  <CalendarIcon className="h-12 w-12 text-healthcare-200" />
                </div>
              </div>
              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="metric-value text-green-600">12</p>
                    <p className="metric-label">Completed Visits</p>
                  </div>
                  <ChartBarIcon className="h-12 w-12 text-green-200" />
                </div>
              </div>
              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="metric-value text-blue-600">2</p>
                    <p className="metric-label">Pending Results</p>
                  </div>
                  <ClipboardDocumentCheckIcon className="h-12 w-12 text-blue-200" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <CalendarIcon className="h-6 w-6 mr-3 text-healthcare-600" />
                    My Bookings
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">View and manage your appointments</p>
                <button className="btn-primary">View Bookings</button>
              </div>
              <div className="card">
                <div className="card-header">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <ChatBubbleLeftRightIcon className="h-6 w-6 mr-3 text-healthcare-600" />
                    Support
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">Get help with your healthcare needs</p>
                <button className="btn-secondary">Contact Support</button>
              </div>
            </div>
          </>
        );
      case 'RECEPTIONIST':
        return (
          <>
            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="metric-value text-healthcare-600">24</p>
                    <p className="metric-label">Today's Appointments</p>
                  </div>
                  <CalendarIcon className="h-12 w-12 text-healthcare-200" />
                </div>
              </div>
              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="metric-value text-green-600">18</p>
                    <p className="metric-label">Completed</p>
                  </div>
                  <ArrowTrendingUpIcon className="h-12 w-12 text-green-200" />
                </div>
              </div>
              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="metric-value text-yellow-600">4</p>
                    <p className="metric-label">Pending</p>
                  </div>
                  <ClockIcon className="h-12 w-12 text-yellow-200" />
                </div>
              </div>
              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="metric-value text-red-600">2</p>
                    <p className="metric-label">Cancelled</p>
                  </div>
                  <ExclamationTriangleIcon className="h-12 w-12 text-red-200" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <CalendarIcon className="h-6 w-6 mr-3 text-healthcare-600" />
                    Appointments
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">Manage patient appointments</p>
                <button className="btn-primary">Manage Appointments</button>
              </div>
              <div className="card">
                <div className="card-header">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <ClockIcon className="h-6 w-6 mr-3 text-healthcare-600" />
                    Schedule
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">View and update schedules</p>
                <button className="btn-secondary">View Schedule</button>
              </div>
            </div>
          </>
        );
      case 'SMO':
        return (
          <>
            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="metric-value text-yellow-600">8</p>
                    <p className="metric-label">Pending Cases</p>
                  </div>
                  <ClipboardDocumentCheckIcon className="h-12 w-12 text-yellow-200" />
                </div>
              </div>
              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="metric-value text-green-600">45</p>
                    <p className="metric-label">Approved Today</p>
                  </div>
                  <ArrowTrendingUpIcon className="h-12 w-12 text-green-200" />
                </div>
              </div>
              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="metric-value text-blue-600">92%</p>
                    <p className="metric-label">Approval Rate</p>
                  </div>
                  <ChartBarIcon className="h-12 w-12 text-blue-200" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <ClipboardDocumentCheckIcon className="h-6 w-6 mr-3 text-healthcare-600" />
                    Case Approvals
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">Review and approve medical cases</p>
                <button className="btn-primary">Review Cases</button>
              </div>
              <div className="card">
                <div className="card-header">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <ChartBarIcon className="h-6 w-6 mr-3 text-healthcare-600" />
                    Statistics
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">View case statistics and reports</p>
                <button className="btn-secondary">View Reports</button>
              </div>
            </div>
          </>
        );
      case 'STAFF':
        return (
          <>
            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="metric-value text-healthcare-600">6</p>
                    <p className="metric-label">Today's Shifts</p>
                  </div>
                  <ClockIcon className="h-12 w-12 text-healthcare-200" />
                </div>
              </div>
              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="metric-value text-green-600">4</p>
                    <p className="metric-label">Completed</p>
                  </div>
                  <ArrowTrendingUpIcon className="h-12 w-12 text-green-200" />
                </div>
              </div>
              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="metric-value text-blue-600">8.5h</p>
                    <p className="metric-label">Hours Worked</p>
                  </div>
                  <ChartBarIcon className="h-12 w-12 text-blue-200" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <ClockIcon className="h-6 w-6 mr-3 text-healthcare-600" />
                    My Schedule
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">View your work schedule</p>
                <button className="btn-primary">View Schedule</button>
              </div>
              <div className="card">
                <div className="card-header">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <CalendarIcon className="h-6 w-6 mr-3 text-healthcare-600" />
                    Availability
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">Manage your availability</p>
                <button className="btn-secondary">Set Availability</button>
              </div>
            </div>
          </>
        );
      case 'SUPPORT':
        return (
          <>
            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="metric-value text-red-600">12</p>
                    <p className="metric-label">Open Tickets</p>
                  </div>
                  <ChatBubbleLeftRightIcon className="h-12 w-12 text-red-200" />
                </div>
              </div>
              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="metric-value text-green-600">28</p>
                    <p className="metric-label">Resolved Today</p>
                  </div>
                  <ArrowTrendingUpIcon className="h-12 w-12 text-green-200" />
                </div>
              </div>
              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="metric-value text-blue-600">4.2h</p>
                    <p className="metric-label">Avg Response Time</p>
                  </div>
                  <ClockIcon className="h-12 w-12 text-blue-200" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <ChatBubbleLeftRightIcon className="h-6 w-6 mr-3 text-healthcare-600" />
                    Support Tickets
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">Manage customer support tickets</p>
                <button className="btn-primary">Manage Tickets</button>
              </div>
            </div>
          </>
        );
      case 'ADMIN':
        return (
          <>
            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="metric-value text-healthcare-600">156</p>
                    <p className="metric-label">Total Users</p>
                  </div>
                  <UserGroupIcon className="h-12 w-12 text-healthcare-200" />
                </div>
              </div>
              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="metric-value text-green-600">99.8%</p>
                    <p className="metric-label">System Uptime</p>
                  </div>
                  <ArrowTrendingUpIcon className="h-12 w-12 text-green-200" />
                </div>
              </div>
              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="metric-value text-blue-600">2.1s</p>
                    <p className="metric-label">Avg Response Time</p>
                  </div>
                  <ClockIcon className="h-12 w-12 text-blue-200" />
                </div>
              </div>
              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="metric-value text-yellow-600">3</p>
                    <p className="metric-label">Active Alerts</p>
                  </div>
                  <ExclamationTriangleIcon className="h-12 w-12 text-yellow-200" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <UserGroupIcon className="h-6 w-6 mr-3 text-healthcare-600" />
                    Users
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">Manage system users</p>
                <button className="btn-primary">Manage Users</button>
              </div>
              <div className="card">
                <div className="card-header">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <CogIcon className="h-6 w-6 mr-3 text-healthcare-600" />
                    System Health
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">Monitor system performance</p>
                <button className="btn-secondary">View System Status</button>
              </div>
            </div>
          </>
        );
      default:
        return <div>Welcome to Healthcare Customer Care System</div>;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-lg text-gray-600">
          Welcome to your personalized healthcare management dashboard
        </p>
      </div>
      
      {getDashboardContent()}
    </div>
  );
};

export default Dashboard;


