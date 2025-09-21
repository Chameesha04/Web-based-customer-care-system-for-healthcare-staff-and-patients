import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  User, 
  Appointment, 
  SupportTicket, 
  StaffSchedule, 
  Notification,
  SystemLog,
  CustomerDashboard,
  ReceptionistDashboard,
  SMODashboard,
  StaffDashboard,
  SupportDashboard,
  AdminDashboard,
  AppointmentRequest,
  SupportTicketRequest,
  StaffScheduleRequest,
  TicketComment,
  ApiResponse
} from '../types';

class ApiService {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearToken();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    // Load token from localStorage
    this.loadToken();
  }

  private loadToken() {
    const token = localStorage.getItem('token');
    if (token) {
      this.setToken(token);
    }
  }

  public setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  public clearToken() {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }

  // Auth API
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response: AxiosResponse<LoginResponse> = await this.api.post('/auth/login', credentials);
    const { token, refreshToken } = response.data;
    this.setToken(token);
    localStorage.setItem('refreshToken', refreshToken);
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<User> {
    const response: AxiosResponse<User> = await this.api.post('/auth/register', userData);
    return response.data;
  }

  async logout(): Promise<void> {
    await this.api.post('/auth/logout');
    this.clearToken();
  }

  async getCurrentUser(): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get('/auth/me');
    return response.data;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await this.api.post('/auth/change-password', {
      currentPassword,
      newPassword
    });
  }

  // Customer API
  async getCustomerDashboard(): Promise<CustomerDashboard> {
    const response: AxiosResponse<CustomerDashboard> = await this.api.get('/customer/dashboard');
    return response.data;
  }

  async getCustomerBookings(page = 0, size = 10): Promise<{ content: Appointment[], totalElements: number }> {
    const response: AxiosResponse<{ content: Appointment[], totalElements: number }> = 
      await this.api.get(`/customer/bookings?page=${page}&size=${size}`);
    return response.data;
  }

  async createBooking(booking: AppointmentRequest): Promise<Appointment> {
    const response: AxiosResponse<Appointment> = await this.api.post('/customer/bookings', booking);
    return response.data;
  }

  async updateBooking(id: number, booking: AppointmentRequest): Promise<Appointment> {
    const response: AxiosResponse<Appointment> = await this.api.put(`/customer/bookings/${id}`, booking);
    return response.data;
  }

  async cancelBooking(id: number, reason?: string): Promise<void> {
    await this.api.delete(`/customer/bookings/${id}`, {
      data: reason ? { reason } : undefined
    });
  }

  async rescheduleBooking(id: number, newDate: string, newTime: string): Promise<Appointment> {
    const response: AxiosResponse<Appointment> = await this.api.post(`/customer/bookings/${id}/reschedule`, {
      newDate,
      newTime
    });
    return response.data;
  }

  async getAppointment(id: number): Promise<Appointment> {
    const response: AxiosResponse<Appointment> = await this.api.get(`/customer/bookings/${id}`);
    return response.data;
  }

  async getSupportTickets(page = 0, size = 10): Promise<{ content: SupportTicket[], totalElements: number }> {
    const response: AxiosResponse<{ content: SupportTicket[], totalElements: number }> = 
      await this.api.get(`/customer/support?page=${page}&size=${size}`);
    return response.data;
  }

  async createSupportTicket(ticket: SupportTicketRequest): Promise<SupportTicket> {
    const response: AxiosResponse<SupportTicket> = await this.api.post('/customer/support', ticket);
    return response.data;
  }

  async getSupportTicket(id: number): Promise<{ ticket: SupportTicket, comments: TicketComment[] }> {
    const response: AxiosResponse<{ ticket: SupportTicket, comments: TicketComment[] }> = 
      await this.api.get(`/customer/support/${id}`);
    return response.data;
  }

  async addTicketComment(ticketId: number, comment: string): Promise<TicketComment> {
    const response: AxiosResponse<TicketComment> = await this.api.post(`/customer/support/${ticketId}/comments`, {
      comment
    });
    return response.data;
  }

  async provideFeedback(feedback: string): Promise<{ message: string, ticketId: string }> {
    const response: AxiosResponse<{ message: string, ticketId: string }> = 
      await this.api.post('/customer/feedback', { feedback });
    return response.data;
  }

  async getNotifications(page = 0, size = 10): Promise<{ content: Notification[], totalElements: number }> {
    const response: AxiosResponse<{ content: Notification[], totalElements: number }> = 
      await this.api.get(`/customer/notifications?page=${page}&size=${size}`);
    return response.data;
  }

  async markNotificationAsRead(id: number): Promise<Notification> {
    const response: AxiosResponse<Notification> = await this.api.put(`/customer/notifications/${id}/read`);
    return response.data;
  }

  async markAllNotificationsAsRead(): Promise<{ message: string, updatedCount: number }> {
    const response: AxiosResponse<{ message: string, updatedCount: number }> = 
      await this.api.put('/customer/notifications/read-all');
    return response.data;
  }

  // Receptionist API
  async getReceptionistDashboard(): Promise<ReceptionistDashboard> {
    const response: AxiosResponse<ReceptionistDashboard> = await this.api.get('/receptionist/dashboard');
    return response.data;
  }

  async getTodayAppointments(): Promise<Appointment[]> {
    const response: AxiosResponse<Appointment[]> = await this.api.get('/receptionist/appointments/today');
    return response.data;
  }

  async getDoctorSchedules(doctorId?: number, date?: string): Promise<any[]> {
    const params = new URLSearchParams();
    if (doctorId) params.append('doctorId', doctorId.toString());
    if (date) params.append('date', date);
    
    const response: AxiosResponse<any[]> = await this.api.get(`/receptionist/schedules?${params}`);
    return response.data;
  }

  async bookAppointmentForPatient(appointment: AppointmentRequest): Promise<Appointment> {
    const response: AxiosResponse<Appointment> = await this.api.post('/receptionist/appointments', appointment);
    return response.data;
  }

  async updatePatientBooking(id: number, appointment: AppointmentRequest): Promise<Appointment> {
    const response: AxiosResponse<Appointment> = await this.api.put(`/receptionist/appointments/${id}`, appointment);
    return response.data;
  }

  async cancelPatientBooking(id: number, reason?: string): Promise<void> {
    await this.api.delete(`/receptionist/appointments/${id}`, {
      data: reason ? { reason } : undefined
    });
  }

  async assignQueueNumber(appointmentId: number, queueNumber: number): Promise<Appointment> {
    const response: AxiosResponse<Appointment> = await this.api.put(`/receptionist/appointments/${appointmentId}/queue`, {
      queueNumber
    });
    return response.data;
  }

  // SMO API
  async getSMODashboard(): Promise<SMODashboard> {
    const response: AxiosResponse<SMODashboard> = await this.api.get('/smo/dashboard');
    return response.data;
  }

  async getPendingApprovals(): Promise<Appointment[]> {
    const response: AxiosResponse<Appointment[]> = await this.api.get('/smo/approvals/pending');
    return response.data;
  }

  async approveAppointment(id: number): Promise<Appointment> {
    const response: AxiosResponse<Appointment> = await this.api.put(`/smo/approvals/${id}/approve`);
    return response.data;
  }

  async rejectAppointment(id: number, reason: string): Promise<Appointment> {
    const response: AxiosResponse<Appointment> = await this.api.put(`/smo/approvals/${id}/reject`, {
      reason
    });
    return response.data;
  }

  async getClinicalTickets(): Promise<SupportTicket[]> {
    const response: AxiosResponse<SupportTicket[]> = await this.api.get('/smo/tickets/clinical');
    return response.data;
  }

  async getCaseStatistics(): Promise<any> {
    const response: AxiosResponse<any> = await this.api.get('/smo/statistics/cases');
    return response.data;
  }

  // Staff API
  async getStaffDashboard(): Promise<StaffDashboard> {
    const response: AxiosResponse<StaffDashboard> = await this.api.get('/staff/dashboard');
    return response.data;
  }

  async getMySchedules(): Promise<StaffSchedule[]> {
    const response: AxiosResponse<StaffSchedule[]> = await this.api.get('/staff/schedules/my');
    return response.data;
  }

  async getTeamSchedules(): Promise<StaffSchedule[]> {
    const response: AxiosResponse<StaffSchedule[]> = await this.api.get('/staff/schedules/team');
    return response.data;
  }

  async createSchedule(schedule: StaffScheduleRequest): Promise<StaffSchedule> {
    const response: AxiosResponse<StaffSchedule> = await this.api.post('/staff/schedules', schedule);
    return response.data;
  }

  async updateSchedule(id: number, schedule: StaffScheduleRequest): Promise<StaffSchedule> {
    const response: AxiosResponse<StaffSchedule> = await this.api.put(`/staff/schedules/${id}`, schedule);
    return response.data;
  }

  async markAbsent(id: number, reason: string): Promise<StaffSchedule> {
    const response: AxiosResponse<StaffSchedule> = await this.api.put(`/staff/schedules/${id}/absent`, {
      reason
    });
    return response.data;
  }

  async requestShiftSwap(fromScheduleId: number, toScheduleId: number, reason: string): Promise<void> {
    await this.api.post('/staff/schedules/swap-request', {
      fromScheduleId,
      toScheduleId,
      reason
    });
  }

  async getWorkloadReport(): Promise<any> {
    const response: AxiosResponse<any> = await this.api.get('/staff/reports/workload');
    return response.data;
  }

  // Support API
  async getSupportDashboard(): Promise<SupportDashboard> {
    const response: AxiosResponse<SupportDashboard> = await this.api.get('/support/dashboard');
    return response.data;
  }

  async getOpenTickets(): Promise<SupportTicket[]> {
    const response: AxiosResponse<SupportTicket[]> = await this.api.get('/support/tickets/open');
    return response.data;
  }

  async getAssignedTickets(): Promise<SupportTicket[]> {
    const response: AxiosResponse<SupportTicket[]> = await this.api.get('/support/tickets/assigned');
    return response.data;
  }

  async assignTicket(ticketId: number, userId: number): Promise<SupportTicket> {
    const response: AxiosResponse<SupportTicket> = await this.api.put(`/support/tickets/${ticketId}/assign`, {
      userId
    });
    return response.data;
  }

  async updateTicketStatus(ticketId: number, status: string): Promise<SupportTicket> {
    const response: AxiosResponse<SupportTicket> = await this.api.put(`/support/tickets/${ticketId}/status`, {
      status
    });
    return response.data;
  }

  async resolveTicket(ticketId: number, resolutionNotes: string): Promise<SupportTicket> {
    const response: AxiosResponse<SupportTicket> = await this.api.put(`/support/tickets/${ticketId}/resolve`, {
      resolutionNotes
    });
    return response.data;
  }

  async getTicketMetrics(): Promise<any> {
    const response: AxiosResponse<any> = await this.api.get('/support/metrics/tickets');
    return response.data;
  }

  async getActivityDashboard(): Promise<any> {
    const response: AxiosResponse<any> = await this.api.get('/support/dashboard/activity');
    return response.data;
  }

  // Admin API
  async getAdminDashboard(): Promise<AdminDashboard> {
    const response: AxiosResponse<AdminDashboard> = await this.api.get('/admin/dashboard');
    return response.data;
  }

  async getSystemHealth(): Promise<any> {
    const response: AxiosResponse<any> = await this.api.get('/admin/system/health');
    return response.data;
  }

  async getSystemLogs(page = 0, size = 10, level?: string, category?: string): Promise<{ content: SystemLog[], totalElements: number }> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    if (level) params.append('level', level);
    if (category) params.append('category', category);
    
    const response: AxiosResponse<{ content: SystemLog[], totalElements: number }> = 
      await this.api.get(`/admin/logs?${params}`);
    return response.data;
  }

  async getUsers(page = 0, size = 10, role?: string): Promise<{ content: User[], totalElements: number }> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    if (role) params.append('role', role);
    
    const response: AxiosResponse<{ content: User[], totalElements: number }> = 
      await this.api.get(`/admin/users?${params}`);
    return response.data;
  }

  async createUser(user: RegisterRequest): Promise<User> {
    const response: AxiosResponse<User> = await this.api.post('/admin/users', user);
    return response.data;
  }

  async updateUser(id: number, user: Partial<User>): Promise<User> {
    const response: AxiosResponse<User> = await this.api.put(`/admin/users/${id}`, user);
    return response.data;
  }

  async deactivateUser(id: number): Promise<void> {
    await this.api.delete(`/admin/users/${id}`);
  }

  async activateUser(id: number): Promise<void> {
    await this.api.put(`/admin/users/${id}/activate`);
  }

  async updateUserPermissions(id: number, permissions: any): Promise<User> {
    const response: AxiosResponse<User> = await this.api.put(`/admin/users/${id}/permissions`, permissions);
    return response.data;
  }

  async getSystemSettings(): Promise<any> {
    const response: AxiosResponse<any> = await this.api.get('/admin/settings');
    return response.data;
  }

  async updateSystemSettings(settings: any): Promise<any> {
    const response: AxiosResponse<any> = await this.api.put('/admin/settings', settings);
    return response.data;
  }

  // Common API
  async getUsersByRole(role: string): Promise<User[]> {
    const response: AxiosResponse<User[]> = await this.api.get(`/common/users/role/${role}`);
    return response.data;
  }

  async searchUsers(query: string): Promise<User[]> {
    const response: AxiosResponse<User[]> = await this.api.get(`/common/users/search?q=${query}`);
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
