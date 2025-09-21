import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarIcon, 
  ClockIcon, 
  UserIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { Appointment, AppointmentStatus, AppointmentPriority, User } from '../../../types';
import apiService from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';

const BookingManagement: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<AppointmentPriority | 'ALL'>('ALL');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadAppointments();
    loadDoctors();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCustomerBookings(0, 100);
      setAppointments(response.content);
    } catch (err) {
      setError('Failed to load appointments');
      console.error('Appointments error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadDoctors = async () => {
    try {
      const doctorsData = await apiService.getUsersByRole('SMO');
      setDoctors(doctorsData);
    } catch (err) {
      console.error('Failed to load doctors:', err);
    }
  };

  const handleCancelAppointment = async () => {
    if (!selectedAppointment) return;

    try {
      await apiService.cancelBooking(selectedAppointment.id, cancelReason);
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === selectedAppointment.id 
            ? { ...apt, status: AppointmentStatus.CANCELLED, cancellationReason: cancelReason }
            : apt
        )
      );
      setShowCancelModal(false);
      setSelectedAppointment(null);
      setCancelReason('');
    } catch (err) {
      console.error('Failed to cancel appointment:', err);
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

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.CONFIRMED: return 'bg-green-100 text-green-800';
      case AppointmentStatus.PENDING: return 'bg-yellow-100 text-yellow-800';
      case AppointmentStatus.CANCELLED: return 'bg-red-100 text-red-800';
      case AppointmentStatus.COMPLETED: return 'bg-blue-100 text-blue-800';
      case AppointmentStatus.IN_PROGRESS: return 'bg-purple-100 text-purple-800';
      case AppointmentStatus.NO_SHOW: return 'bg-gray-100 text-gray-800';
      case AppointmentStatus.RESCHEDULED: return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: AppointmentPriority) => {
    switch (priority) {
      case AppointmentPriority.URGENT: return 'bg-red-100 text-red-800';
      case AppointmentPriority.HIGH: return 'bg-orange-100 text-orange-800';
      case AppointmentPriority.NORMAL: return 'bg-blue-100 text-blue-800';
      case AppointmentPriority.LOW: return 'bg-gray-100 text-gray-800';
      case AppointmentPriority.EMERGENCY: return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.doctor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        appointment.doctor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        appointment.reason?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || appointment.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || appointment.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

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
          onClick={loadAppointments}
          className="mt-4 btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
          <p className="mt-2 text-gray-600">Manage your healthcare appointments</p>
        </div>
        <Link to="/customer/bookings/new" className="btn-primary">
          <PlusIcon className="h-5 w-5 mr-2" />
          Book New Appointment
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as AppointmentStatus | 'ALL')}
              className="input-field"
            >
              <option value="ALL">All Status</option>
              <option value={AppointmentStatus.PENDING}>Pending</option>
              <option value={AppointmentStatus.CONFIRMED}>Confirmed</option>
              <option value={AppointmentStatus.IN_PROGRESS}>In Progress</option>
              <option value={AppointmentStatus.COMPLETED}>Completed</option>
              <option value={AppointmentStatus.CANCELLED}>Cancelled</option>
              <option value={AppointmentStatus.RESCHEDULED}>Rescheduled</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as AppointmentPriority | 'ALL')}
              className="input-field"
            >
              <option value="ALL">All Priority</option>
              <option value={AppointmentPriority.LOW}>Low</option>
              <option value={AppointmentPriority.NORMAL}>Normal</option>
              <option value={AppointmentPriority.HIGH}>High</option>
              <option value={AppointmentPriority.URGENT}>Urgent</option>
              <option value={AppointmentPriority.EMERGENCY}>Emergency</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="card">
        {filteredAppointments.length > 0 ? (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 bg-healthcare-100 rounded-full flex items-center justify-center">
                        <UserIcon className="h-6 w-6 text-healthcare-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(appointment.priority)}`}>
                          {appointment.priority}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {formatDate(appointment.appointmentDate)}
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {formatTime(appointment.appointmentTime)}
                        </div>
                        {appointment.queueNumber && (
                          <div className="flex items-center">
                            <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                              Queue #{appointment.queueNumber}
                            </span>
                          </div>
                        )}
                      </div>
                      {appointment.reason && (
                        <p className="text-sm text-gray-600 mt-2">{appointment.reason}</p>
                      )}
                      {appointment.cancellationReason && (
                        <p className="text-sm text-red-600 mt-2">
                          Cancellation reason: {appointment.cancellationReason}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {appointment.status === AppointmentStatus.PENDING && (
                      <>
                        <Link
                          to={`/customer/bookings/${appointment.id}/edit`}
                          className="p-2 text-gray-400 hover:text-gray-600"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setShowCancelModal(true);
                          }}
                          className="p-2 text-gray-400 hover:text-red-600"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </>
                    )}
                    {appointment.status === AppointmentStatus.CONFIRMED && (
                      <button
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setShowCancelModal(true);
                        }}
                        className="p-2 text-gray-400 hover:text-red-600"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'ALL' || priorityFilter !== 'ALL'
                ? 'Try adjusting your filters or search terms.'
                : 'Get started by booking your first appointment.'}
            </p>
            <div className="mt-6">
              <Link to="/customer/bookings/new" className="btn-primary">
                <PlusIcon className="h-5 w-5 mr-2" />
                Book Appointment
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && selectedAppointment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-xl bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
                <XCircleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="mt-2 text-center">
                <h3 className="text-lg font-medium text-gray-900">Cancel Appointment</h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to cancel your appointment with Dr. {selectedAppointment.doctor.firstName} {selectedAppointment.doctor.lastName}?
                  </p>
                  <div className="mt-4">
                    <textarea
                      placeholder="Reason for cancellation (optional)"
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="input-field w-full h-20 resize-none"
                    />
                  </div>
                </div>
                <div className="flex justify-center space-x-4 mt-4">
                  <button
                    onClick={() => {
                      setShowCancelModal(false);
                      setSelectedAppointment(null);
                      setCancelReason('');
                    }}
                    className="btn-secondary"
                  >
                    Keep Appointment
                  </button>
                  <button
                    onClick={handleCancelAppointment}
                    className="btn-danger"
                  >
                    Cancel Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;

