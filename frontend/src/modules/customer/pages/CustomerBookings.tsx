import React, { useState, useEffect } from 'react';
import { CalendarIcon, ClockIcon, UserIcon, PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { bookingService } from '../services/bookingService';

interface Booking {
  id: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: number;
  status: string;
  notes?: string;
  doctorName?: string;
  department?: string;
}

const CustomerBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '1',
      appointmentDate: '2024-01-25',
      appointmentTime: '10:00',
      duration: 30,
      status: 'CONFIRMED',
      notes: 'Regular checkup',
      doctorName: 'Dr. Sarah Johnson',
      department: 'General Medicine'
    },
    {
      id: '2',
      appointmentDate: '2024-01-28',
      appointmentTime: '14:30',
      duration: 45,
      status: 'PENDING',
      notes: 'Follow-up consultation',
      doctorName: 'Dr. Michael Chen',
      department: 'Cardiology'
    },
    {
      id: '3',
      appointmentDate: '2024-01-20',
      appointmentTime: '09:15',
      duration: 30,
      status: 'COMPLETED',
      notes: 'Blood test results review',
      doctorName: 'Dr. Emily Davis',
      department: 'Laboratory'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('ALL');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // const data = await bookingService.getCustomerBookings();
      // setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await bookingService.cancelBooking(bookingId);
      fetchBookings(); // Refresh the list
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'status-confirmed';
      case 'PENDING':
        return 'status-pending';
      case 'COMPLETED':
        return 'status-completed';
      case 'CANCELLED':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'ALL') return true;
    return booking.status === filter;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-lg text-gray-600">Manage your healthcare appointments</p>
        </div>
        <button className="btn-primary mt-4 sm:mt-0 flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          New Booking
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="metric-value text-healthcare-600">{bookings.length}</p>
              <p className="metric-label">Total Bookings</p>
            </div>
            <CalendarIcon className="h-12 w-12 text-healthcare-200" />
          </div>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="metric-value text-green-600">{bookings.filter(b => b.status === 'CONFIRMED').length}</p>
              <p className="metric-label">Confirmed</p>
            </div>
            <ClockIcon className="h-12 w-12 text-green-200" />
          </div>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="metric-value text-yellow-600">{bookings.filter(b => b.status === 'PENDING').length}</p>
              <p className="metric-label">Pending</p>
            </div>
            <ClockIcon className="h-12 w-12 text-yellow-200" />
          </div>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="metric-value text-blue-600">{bookings.filter(b => b.status === 'COMPLETED').length}</p>
              <p className="metric-label">Completed</p>
            </div>
            <UserIcon className="h-12 w-12 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <FunnelIcon className="h-5 w-5 text-gray-400" />
        <div className="flex space-x-2">
          {['ALL', 'CONFIRMED', 'PENDING', 'COMPLETED', 'CANCELLED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-healthcare-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <div key={booking.id} className="card hover:shadow-xl transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-healthcare-500 to-healthcare-600 rounded-xl flex items-center justify-center">
                  <CalendarIcon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {new Date(booking.appointmentDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h3>
                    <span className={`status-badge ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="h-4 w-4" />
                      <span>{booking.appointmentTime} ({booking.duration} min)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <UserIcon className="h-4 w-4" />
                      <span>{booking.doctorName}</span>
                    </div>
                    <div>
                      <span className="font-medium">{booking.department}</span>
                    </div>
                  </div>
                  
                  {booking.notes && (
                    <p className="text-gray-600 mt-3 bg-gray-50 p-3 rounded-lg">
                      <span className="font-medium">Notes:</span> {booking.notes}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                {booking.status === 'CONFIRMED' && (
                  <button
                    onClick={() => handleCancelBooking(booking.id)}
                    className="btn-danger text-sm"
                  >
                    Cancel
                  </button>
                )}
                {booking.status === 'PENDING' && (
                  <button className="btn-secondary text-sm">
                    Reschedule
                  </button>
                )}
                {booking.status === 'COMPLETED' && (
                  <button className="btn-success text-sm">
                    View Results
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center py-12">
          <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-600 mb-6">
            {filter === 'ALL' 
              ? "You don't have any appointments yet. Book your first appointment!"
              : `No ${filter.toLowerCase()} appointments found.`
            }
          </p>
          {filter === 'ALL' && (
            <button className="btn-primary">Book Appointment</button>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerBookings;


