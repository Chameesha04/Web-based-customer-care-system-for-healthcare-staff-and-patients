import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface BookingRequest {
  appointmentDate: string;
  appointmentTime: string;
  duration: number;
  notes?: string;
}

export interface Booking {
  id: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: number;
  status: string;
  notes?: string;
}

export const bookingService = {
  async getCustomerBookings(): Promise<Booking[]> {
    const response = await api.get('/customer/bookings');
    return response.data;
  },

  async createBooking(booking: BookingRequest): Promise<Booking> {
    const response = await api.post('/customer/bookings', booking);
    return response.data;
  },

  async updateBooking(bookingId: string, booking: BookingRequest): Promise<Booking> {
    const response = await api.put(`/customer/bookings/${bookingId}`, booking);
    return response.data;
  },

  async cancelBooking(bookingId: string): Promise<void> {
    await api.delete(`/customer/bookings/${bookingId}`);
  },
};




