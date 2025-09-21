// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: Role;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export enum Role {
  CUSTOMER = 'CUSTOMER',
  RECEPTIONIST = 'RECEPTIONIST',
  SMO = 'SMO',
  STAFF = 'STAFF',
  SUPPORT = 'SUPPORT',
  ADMIN = 'ADMIN'
}

// Appointment Types
export interface Appointment {
  id: number;
  patient: User;
  doctor: User;
  appointmentDate: string;
  appointmentTime: string;
  durationMinutes: number;
  status: AppointmentStatus;
  priority: AppointmentPriority;
  queueNumber?: number;
  notes?: string;
  reason?: string;
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
  cancellationReason?: string;
}

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
  RESCHEDULED = 'RESCHEDULED'
}

export enum AppointmentPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
  EMERGENCY = 'EMERGENCY'
}

// Support Ticket Types
export interface SupportTicket {
  id: number;
  ticketNumber: string;
  title: string;
  description: string;
  customer: User;
  assignedTo?: User;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  resolutionNotes?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  dueDate?: string;
  estimatedResolutionTimeHours?: number;
  comments?: TicketComment[];
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING_CUSTOMER = 'PENDING_CUSTOMER',
  PENDING_INTERNAL = 'PENDING_INTERNAL',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED'
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
  CRITICAL = 'CRITICAL'
}

export enum TicketCategory {
  APPOINTMENT = 'APPOINTMENT',
  BILLING = 'BILLING',
  MEDICAL_RECORDS = 'MEDICAL_RECORDS',
  TECHNICAL = 'TECHNICAL',
  GENERAL_INQUIRY = 'GENERAL_INQUIRY',
  COMPLAINT = 'COMPLAINT',
  FEEDBACK = 'FEEDBACK',
  EMERGENCY = 'EMERGENCY',
  PRESCRIPTION = 'PRESCRIPTION',
  TEST_RESULTS = 'TEST_RESULTS'
}

export interface TicketComment {
  id: number;
  ticket: SupportTicket;
  user: User;
  comment: string;
  isInternal: boolean;
  createdAt: string;
}

// Staff Schedule Types
export interface StaffSchedule {
  id: number;
  staff: User;
  scheduleDate: string;
  startTime: string;
  endTime: string;
  status: ScheduleStatus;
  shiftType: ShiftType;
  department?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: number;
}

export enum ScheduleStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  ABSENT = 'ABSENT',
  SWAPPED = 'SWAPPED'
}

export enum ShiftType {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  EVENING = 'EVENING',
  NIGHT = 'NIGHT',
  FULL_DAY = 'FULL_DAY',
  PART_TIME = 'PART_TIME',
  ON_CALL = 'ON_CALL'
}

// Notification Types
export interface Notification {
  id: number;
  user: User;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
  expiresAt?: string;
  actionUrl?: string;
  metadata?: string;
}

export enum NotificationType {
  APPOINTMENT_REMINDER = 'APPOINTMENT_REMINDER',
  APPOINTMENT_CONFIRMED = 'APPOINTMENT_CONFIRMED',
  APPOINTMENT_CANCELLED = 'APPOINTMENT_CANCELLED',
  APPOINTMENT_RESCHEDULED = 'APPOINTMENT_RESCHEDULED',
  QUEUE_UPDATE = 'QUEUE_UPDATE',
  TICKET_ASSIGNED = 'TICKET_ASSIGNED',
  TICKET_UPDATED = 'TICKET_UPDATED',
  TICKET_RESOLVED = 'TICKET_RESOLVED',
  SCHEDULE_CHANGE = 'SCHEDULE_CHANGE',
  SYSTEM_ALERT = 'SYSTEM_ALERT',
  GENERAL_NOTIFICATION = 'GENERAL_NOTIFICATION',
  EMERGENCY = 'EMERGENCY',
  MAINTENANCE = 'MAINTENANCE',
  SECURITY_ALERT = 'SECURITY_ALERT'
}

export enum NotificationPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
  CRITICAL = 'CRITICAL'
}

// System Log Types
export interface SystemLog {
  id: number;
  level: LogLevel;
  category: LogCategory;
  message: string;
  details?: string;
  user?: User;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  createdAt: string;
  archived: boolean;
  archivedAt?: string;
}

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL'
}

export enum LogCategory {
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  USER_MANAGEMENT = 'USER_MANAGEMENT',
  APPOINTMENT = 'APPOINTMENT',
  TICKET = 'TICKET',
  SCHEDULE = 'SCHEDULE',
  NOTIFICATION = 'NOTIFICATION',
  SYSTEM = 'SYSTEM',
  SECURITY = 'SECURITY',
  PERFORMANCE = 'PERFORMANCE',
  DATABASE = 'DATABASE',
  API = 'API',
  FILE_UPLOAD = 'FILE_UPLOAD',
  EMAIL = 'EMAIL',
  BACKUP = 'BACKUP',
  MAINTENANCE = 'MAINTENANCE'
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  status: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  sessionId: string;
  userId: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  expiresIn: number;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: Role;
}

export interface AppointmentRequest {
  doctor: User;
  appointmentDate: string;
  appointmentTime: string;
  durationMinutes?: number;
  reason?: string;
  priority?: AppointmentPriority;
  notes?: string;
}

export interface SupportTicketRequest {
  title: string;
  description: string;
  category: TicketCategory;
  priority?: TicketPriority;
}

export interface StaffScheduleRequest {
  staff: User;
  scheduleDate: string;
  startTime: string;
  endTime: string;
  shiftType: ShiftType;
  department?: string;
  notes?: string;
}

// Dashboard Types
export interface CustomerDashboard {
  upcomingAppointments: Appointment[];
  recentTickets: SupportTicket[];
  unreadNotifications: number;
  customer: User;
}

export interface ReceptionistDashboard {
  todayAppointments: Appointment[];
  pendingAppointments: Appointment[];
  doctorSchedules: any[];
  queueStatus: any[];
}

export interface SMODashboard {
  pendingApprovals: Appointment[];
  clinicalTickets: SupportTicket[];
  doctorSchedules: any[];
  caseStatistics: any[];
}

export interface StaffDashboard {
  mySchedules: StaffSchedule[];
  teamSchedules: StaffSchedule[];
  availability: any[];
  workloadReport: any[];
}

export interface SupportDashboard {
  openTickets: SupportTicket[];
  assignedTickets: SupportTicket[];
  ticketMetrics: any[];
  activityDashboard: any[];
}

export interface AdminDashboard {
  systemHealth: any;
  userActivity: any[];
  systemLogs: SystemLog[];
  systemSettings: any;
}

// Form Types
export interface BookingForm {
  doctorId: number;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  priority: AppointmentPriority;
}

export interface TicketForm {
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
}

export interface ScheduleForm {
  staffId: number;
  scheduleDate: string;
  startTime: string;
  endTime: string;
  shiftType: ShiftType;
  department: string;
  notes: string;
}

// Filter Types
export interface AppointmentFilter {
  status?: AppointmentStatus;
  priority?: AppointmentPriority;
  doctorId?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface TicketFilter {
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: TicketCategory;
  assignedTo?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface ScheduleFilter {
  status?: ScheduleStatus;
  shiftType?: ShiftType;
  staffId?: number;
  dateFrom?: string;
  dateTo?: string;
}

// Statistics Types
export interface AppointmentStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  todayCount: number;
}

export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  averageResolutionTime: number;
}

export interface ScheduleStats {
  totalSchedules: number;
  confirmedSchedules: number;
  completedSchedules: number;
  absentSchedules: number;
  upcomingSchedules: number;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  usersByRole: Record<Role, number>;
  recentLogins: number;
  newUsers: number;
}

