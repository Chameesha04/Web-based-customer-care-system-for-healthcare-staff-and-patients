package com.group.project.service;

import com.group.project.model.*;
import com.group.project.repository.NotificationRepository;
import com.group.project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public Notification createNotification(Notification notification) {
        notification.setCreatedAt(LocalDateTime.now());
        return notificationRepository.save(notification);
    }
    
    public Notification createNotification(User user, String title, String message, NotificationType type) {
        Notification notification = new Notification(user, title, message, type);
        return createNotification(notification);
    }
    
    public Notification createNotification(User user, String title, String message, NotificationType type, NotificationPriority priority) {
        Notification notification = new Notification(user, title, message, type);
        notification.setPriority(priority);
        return createNotification(notification);
    }
    
    public Notification createNotification(User user, String title, String message, NotificationType type, String actionUrl) {
        Notification notification = new Notification(user, title, message, type);
        notification.setActionUrl(actionUrl);
        return createNotification(notification);
    }
    
    public Notification createNotification(User user, String title, String message, NotificationType type, NotificationPriority priority, String actionUrl) {
        Notification notification = new Notification(user, title, message, type);
        notification.setPriority(priority);
        notification.setActionUrl(actionUrl);
        return createNotification(notification);
    }
    
    public Notification markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + id));
        
        notification.setIsRead(true);
        notification.setReadAt(LocalDateTime.now());
        
        return notificationRepository.save(notification);
    }
    
    public int markAllAsReadByUser(User user) {
        return notificationRepository.markAllAsReadByUser(user, LocalDateTime.now());
    }
    
    public void deleteExpiredNotifications() {
        notificationRepository.deleteExpiredNotifications(LocalDateTime.now());
    }
    
    public int deleteReadNotificationsOlderThan(User user, LocalDateTime beforeDate) {
        return notificationRepository.deleteReadNotificationsOlderThan(user, beforeDate);
    }
    
    // Specific notification methods for different entities
    
    public void sendAppointmentNotification(Appointment appointment, NotificationType type) {
        String title = getAppointmentNotificationTitle(type);
        String message = getAppointmentNotificationMessage(appointment, type);
        String actionUrl = "/appointments/" + appointment.getId();
        
        // Notify patient
        createNotification(appointment.getPatient(), title, message, type, actionUrl);
        
        // Notify doctor
        createNotification(appointment.getDoctor(), title, message, type, actionUrl);
        
        // Notify receptionist if status change
        if (type == NotificationType.APPOINTMENT_CANCELLED || type == NotificationType.APPOINTMENT_RESCHEDULED) {
            List<User> receptionists = userRepository.findByRole(Role.RECEPTIONIST);
            for (User receptionist : receptionists) {
                createNotification(receptionist, title, message, type, actionUrl);
            }
        }
    }
    
    public void sendTicketNotification(SupportTicket ticket, NotificationType type) {
        String title = getTicketNotificationTitle(type);
        String message = getTicketNotificationMessage(ticket, type);
        String actionUrl = "/tickets/" + ticket.getId();
        
        // Notify customer
        createNotification(ticket.getCustomer(), title, message, type, actionUrl);
        
        // Notify assigned support staff
        if (ticket.getAssignedTo() != null) {
            createNotification(ticket.getAssignedTo(), title, message, type, actionUrl);
        }
        
        // Notify support manager for new tickets
        if (type == NotificationType.TICKET_ASSIGNED) {
            List<User> supportManagers = userRepository.findByRole(Role.SUPPORT);
            for (User manager : supportManagers) {
                createNotification(manager, title, message, type, actionUrl);
            }
        }
    }
    
    public void sendScheduleNotification(StaffSchedule schedule, NotificationType type) {
        String title = getScheduleNotificationTitle(type);
        String message = getScheduleNotificationMessage(schedule, type);
        String actionUrl = "/schedules/" + schedule.getId();
        
        // Notify staff member
        createNotification(schedule.getStaff(), title, message, type, actionUrl);
        
        // Notify staff coordinator
        List<User> staffCoordinators = userRepository.findByRole(Role.STAFF);
        for (User coordinator : staffCoordinators) {
            createNotification(coordinator, title, message, type, actionUrl);
        }
    }
    
    public void sendSystemNotification(String title, String message, NotificationType type, NotificationPriority priority) {
        List<User> allUsers = userRepository.findByActiveTrue();
        for (User user : allUsers) {
            createNotification(user, title, message, type, priority);
        }
    }
    
    public void sendRoleBasedNotification(String title, String message, NotificationType type, Role role) {
        List<User> users = userRepository.findByRole(role);
        for (User user : users) {
            createNotification(user, title, message, type);
        }
    }
    
    @Transactional(readOnly = true)
    public Optional<Notification> findById(Long id) {
        return notificationRepository.findById(id);
    }
    
    @Transactional(readOnly = true)
    public List<Notification> findByUser(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }
    
    @Transactional(readOnly = true)
    public List<Notification> findUnreadByUser(User user) {
        return notificationRepository.findByUserAndIsReadFalse(user);
    }
    
    @Transactional(readOnly = true)
    public List<Notification> findReadByUser(User user) {
        return notificationRepository.findByUserAndIsReadTrue(user);
    }
    
    @Transactional(readOnly = true)
    public Page<Notification> findByUser(User user, Pageable pageable) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<Notification> findUnreadByUser(User user, Pageable pageable) {
        return notificationRepository.findByUserAndIsReadFalseOrderByCreatedAtDesc(user, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<Notification> findReadByUser(User user, Pageable pageable) {
        return notificationRepository.findByUserAndIsReadTrueOrderByCreatedAtDesc(user, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<Notification> findByUserAndType(User user, NotificationType type, Pageable pageable) {
        return notificationRepository.findByUserAndTypeOrderByCreatedAtDesc(user, type, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<Notification> findByUserAndPriority(User user, NotificationPriority priority, Pageable pageable) {
        return notificationRepository.findByUserAndPriorityOrderByCreatedAtDesc(user, priority, pageable);
    }
    
    @Transactional(readOnly = true)
    public Long countUnreadByUser(User user) {
        return notificationRepository.countUnreadByUser(user);
    }
    
    @Transactional(readOnly = true)
    public Long countByUser(User user) {
        return notificationRepository.countByUser(user);
    }
    
    @Transactional(readOnly = true)
    public Long countByType(NotificationType type) {
        return notificationRepository.countByType(type);
    }
    
    @Transactional(readOnly = true)
    public Long countByPriority(NotificationPriority priority) {
        return notificationRepository.countByPriority(priority);
    }
    
    @Transactional(readOnly = true)
    public Long countUnreadByUserAndType(User user, NotificationType type) {
        return notificationRepository.countUnreadByUserAndType(user, type);
    }
    
    @Transactional(readOnly = true)
    public Long countUnreadByUserAndPriority(User user, NotificationPriority priority) {
        return notificationRepository.countUnreadByUserAndPriority(user, priority);
    }
    
    @Transactional(readOnly = true)
    public List<Notification> findByUserAndCreatedAtSince(User user, LocalDateTime since) {
        return notificationRepository.findByUserAndCreatedAtSince(user, since);
    }
    
    @Transactional(readOnly = true)
    public List<Notification> findByCreatedAtSince(LocalDateTime since) {
        return notificationRepository.findByCreatedAtSince(since);
    }
    
    @Transactional(readOnly = true)
    public List<Notification> findExpiredNotifications() {
        return notificationRepository.findExpiredNotifications(LocalDateTime.now());
    }
    
    @Transactional(readOnly = true)
    public List<Notification> findActiveByUser(User user) {
        return notificationRepository.findActiveByUser(user, LocalDateTime.now());
    }
    
    @Transactional(readOnly = true)
    public List<Notification> findActiveNotifications() {
        return notificationRepository.findActiveNotifications(LocalDateTime.now());
    }
    
    @Transactional(readOnly = true)
    public Page<Notification> searchByUser(User user, String search, Pageable pageable) {
        return notificationRepository.findByUserAndSearch(user, search, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<Notification> searchAll(String search, Pageable pageable) {
        return notificationRepository.findBySearch(search, pageable);
    }
    
    // Helper methods for notification content
    
    private String getAppointmentNotificationTitle(NotificationType type) {
        switch (type) {
            case APPOINTMENT_REMINDER:
                return "Appointment Reminder";
            case APPOINTMENT_CONFIRMED:
                return "Appointment Confirmed";
            case APPOINTMENT_CANCELLED:
                return "Appointment Cancelled";
            case APPOINTMENT_RESCHEDULED:
                return "Appointment Rescheduled";
            default:
                return "Appointment Update";
        }
    }
    
    private String getAppointmentNotificationMessage(Appointment appointment, NotificationType type) {
        String patientName = appointment.getPatient().getFirstName() + " " + appointment.getPatient().getLastName();
        String doctorName = appointment.getDoctor().getFirstName() + " " + appointment.getDoctor().getLastName();
        String dateTime = appointment.getAppointmentDate().toLocalDate() + " at " + appointment.getAppointmentTime();
        
        switch (type) {
            case APPOINTMENT_REMINDER:
                return "Reminder: You have an appointment with Dr. " + doctorName + " on " + dateTime;
            case APPOINTMENT_CONFIRMED:
                return "Your appointment with Dr. " + doctorName + " on " + dateTime + " has been confirmed";
            case APPOINTMENT_CANCELLED:
                return "Your appointment with Dr. " + doctorName + " on " + dateTime + " has been cancelled";
            case APPOINTMENT_RESCHEDULED:
                return "Your appointment with Dr. " + doctorName + " has been rescheduled to " + dateTime;
            default:
                return "Appointment update for " + patientName + " with Dr. " + doctorName + " on " + dateTime;
        }
    }
    
    private String getTicketNotificationTitle(NotificationType type) {
        switch (type) {
            case TICKET_ASSIGNED:
                return "Support Ticket Assigned";
            case TICKET_UPDATED:
                return "Support Ticket Updated";
            case TICKET_RESOLVED:
                return "Support Ticket Resolved";
            default:
                return "Support Ticket Update";
        }
    }
    
    private String getTicketNotificationMessage(SupportTicket ticket, NotificationType type) {
        String ticketNumber = ticket.getTicketNumber();
        String title = ticket.getTitle();
        
        switch (type) {
            case TICKET_ASSIGNED:
                return "Support ticket #" + ticketNumber + " - " + title + " has been assigned to you";
            case TICKET_UPDATED:
                return "Support ticket #" + ticketNumber + " - " + title + " has been updated";
            case TICKET_RESOLVED:
                return "Support ticket #" + ticketNumber + " - " + title + " has been resolved";
            default:
                return "Support ticket #" + ticketNumber + " - " + title + " has been updated";
        }
    }
    
    private String getScheduleNotificationTitle(NotificationType type) {
        switch (type) {
            case SCHEDULE_CHANGE:
                return "Schedule Change";
            default:
                return "Schedule Update";
        }
    }
    
    private String getScheduleNotificationMessage(StaffSchedule schedule, NotificationType type) {
        String staffName = schedule.getStaff().getFirstName() + " " + schedule.getStaff().getLastName();
        String date = schedule.getScheduleDate().toString();
        String shiftType = schedule.getShiftType().getDisplayName();
        
        switch (type) {
            case SCHEDULE_CHANGE:
                return "Schedule change for " + staffName + " on " + date + " - " + shiftType;
            default:
                return "Schedule update for " + staffName + " on " + date + " - " + shiftType;
        }
    }
}

