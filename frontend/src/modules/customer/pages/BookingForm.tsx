import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  CalendarIcon, 
  ClockIcon, 
  UserIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { User, AppointmentRequest, AppointmentPriority } from '../../../types';
import apiService from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';

const BookingForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  
  const [doctors, setDoctors] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
    priority: AppointmentPriority.NORMAL,
    notes: ''
  });
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadDoctors();
    if (isEdit) {
      loadAppointment();
    }
  }, [id]);

  useEffect(() => {
    if (formData.doctorId && formData.appointmentDate) {
      loadAvailableSlots();
    }
  }, [formData.doctorId, formData.appointmentDate]);

  const loadDoctors = async () => {
    try {
      const doctorsData = await apiService.getUsersByRole('SMO');
      setDoctors(doctorsData);
    } catch (err) {
      console.error('Failed to load doctors:', err);
    }
  };

  const loadAppointment = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const appointment = await apiService.getAppointment(parseInt(id));
      setFormData({
        doctorId: appointment.doctor.id.toString(),
        appointmentDate: appointment.appointmentDate.split('T')[0],
        appointmentTime: appointment.appointmentTime,
        reason: appointment.reason || '',
        priority: appointment.priority,
        notes: appointment.notes || ''
      });
    } catch (err) {
      setError('Failed to load appointment');
      console.error('Appointment error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableSlots = async () => {
    if (!formData.doctorId || !formData.appointmentDate) return;
    
    try {
      setLoadingSlots(true);
      // This would be a real API call to get available time slots
      // For now, we'll generate some sample slots
      const slots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
      ];
      setAvailableSlots(slots);
    } catch (err) {
      console.error('Failed to load available slots:', err);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.doctorId || !formData.appointmentDate || !formData.appointmentTime) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const selectedDoctor = doctors.find(d => d.id.toString() === formData.doctorId);
      if (!selectedDoctor) {
        setError('Selected doctor not found');
        return;
      }

      const appointmentRequest: AppointmentRequest = {
        doctor: selectedDoctor,
        appointmentDate: new Date(`${formData.appointmentDate}T${formData.appointmentTime}`).toISOString(),
        appointmentTime: formData.appointmentTime,
        reason: formData.reason,
        priority: formData.priority,
        notes: formData.notes
      };

      if (isEdit) {
        await apiService.updateBooking(parseInt(id!), appointmentRequest);
      } else {
        await apiService.createBooking(appointmentRequest);
      }

      navigate('/customer/bookings');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save appointment');
      console.error('Booking error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Minimum 1 day in advance
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 90); // Maximum 90 days in advance
    return maxDate.toISOString().split('T')[0];
  };

  if (loading && isEdit) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-healthcare-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/customer/bookings')}
          className="p-2 text-gray-400 hover:text-gray-600"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Edit Appointment' : 'Book New Appointment'}
          </h1>
          <p className="mt-2 text-gray-600">
            {isEdit ? 'Update your appointment details' : 'Schedule your healthcare appointment'}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Doctor Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <UserIcon className="h-4 w-4 inline mr-1" />
              Select Doctor *
            </label>
            <select
              name="doctorId"
              value={formData.doctorId}
              onChange={handleInputChange}
              className="input-field"
              required
            >
              <option value="">Choose a doctor...</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  Dr. {doctor.firstName} {doctor.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Appointment Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CalendarIcon className="h-4 w-4 inline mr-1" />
              Appointment Date *
            </label>
            <input
              type="date"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleInputChange}
              min={getMinDate()}
              max={getMaxDate()}
              className="input-field"
              required
            />
          </div>

          {/* Appointment Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <ClockIcon className="h-4 w-4 inline mr-1" />
              Appointment Time *
            </label>
            {loadingSlots ? (
              <div className="input-field flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-healthcare-600"></div>
                <span className="ml-2 text-gray-500">Loading available slots...</span>
              </div>
            ) : (
              <select
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleInputChange}
                className="input-field"
                required
                disabled={!formData.doctorId || !formData.appointmentDate}
              >
                <option value="">Select time...</option>
                {availableSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {new Date(`2000-01-01T${slot}`).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Visit *
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              placeholder="Please describe the reason for your appointment..."
              className="input-field h-24 resize-none"
              required
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority Level
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="input-field"
            >
              <option value={AppointmentPriority.LOW}>Low</option>
              <option value={AppointmentPriority.NORMAL}>Normal</option>
              <option value={AppointmentPriority.HIGH}>High</option>
              <option value={AppointmentPriority.URGENT}>Urgent</option>
              <option value={AppointmentPriority.EMERGENCY}>Emergency</option>
            </select>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Any additional information you'd like to share..."
              className="input-field h-20 resize-none"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/customer/bookings')}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEdit ? 'Updating...' : 'Booking...'}
                </div>
              ) : (
                <div className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  {isEdit ? 'Update Appointment' : 'Book Appointment'}
                </div>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Information Card */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex">
          <div className="flex-shrink-0">
            <CheckCircleIcon className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Important Information</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Please arrive 15 minutes before your scheduled appointment time</li>
                <li>Bring a valid ID and insurance card if applicable</li>
                <li>You can cancel or reschedule up to 24 hours before your appointment</li>
                <li>Emergency appointments are available for urgent medical needs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;

