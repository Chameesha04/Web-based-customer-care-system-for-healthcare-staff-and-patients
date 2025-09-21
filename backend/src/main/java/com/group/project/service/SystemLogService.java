package com.group.project.service;

import com.group.project.model.*;
import com.group.project.repository.SystemLogRepository;
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
public class SystemLogService {
    
    @Autowired
    private SystemLogRepository systemLogRepository;
    
    public SystemLog createLog(LogLevel level, LogCategory category, String message) {
        SystemLog log = new SystemLog(level, category, message);
        return systemLogRepository.save(log);
    }
    
    public SystemLog createLog(LogLevel level, LogCategory category, String message, User user) {
        SystemLog log = new SystemLog(level, category, message, user);
        return systemLogRepository.save(log);
    }
    
    public SystemLog createLog(LogLevel level, LogCategory category, String message, User user, String ipAddress, String userAgent, String sessionId) {
        SystemLog log = new SystemLog(level, category, message, user);
        log.setIpAddress(ipAddress);
        log.setUserAgent(userAgent);
        log.setSessionId(sessionId);
        return systemLogRepository.save(log);
    }
    
    public SystemLog createLog(LogLevel level, LogCategory category, String message, String details) {
        SystemLog log = new SystemLog(level, category, message);
        log.setDetails(details);
        return systemLogRepository.save(log);
    }
    
    public SystemLog createLog(LogLevel level, LogCategory category, String message, String details, User user) {
        SystemLog log = new SystemLog(level, category, message, user);
        log.setDetails(details);
        return systemLogRepository.save(log);
    }
    
    public SystemLog createLog(LogLevel level, LogCategory category, String message, String details, User user, String ipAddress, String userAgent, String sessionId) {
        SystemLog log = new SystemLog(level, category, message, user);
        log.setDetails(details);
        log.setIpAddress(ipAddress);
        log.setUserAgent(userAgent);
        log.setSessionId(sessionId);
        return systemLogRepository.save(log);
    }
    
    public void archiveLogsOlderThan(LocalDateTime beforeDate) {
        systemLogRepository.archiveLogsOlderThan(beforeDate, LocalDateTime.now());
    }
    
    public void archiveLogsByIds(List<Long> ids) {
        systemLogRepository.archiveLogsByIds(ids, LocalDateTime.now());
    }
    
    public void deleteArchivedLogsOlderThan(LocalDateTime beforeDate) {
        systemLogRepository.deleteArchivedLogsOlderThan(beforeDate);
    }
    
    @Transactional(readOnly = true)
    public Optional<SystemLog> findById(Long id) {
        return systemLogRepository.findById(id);
    }
    
    @Transactional(readOnly = true)
    public List<SystemLog> findByLevel(LogLevel level) {
        return systemLogRepository.findByLevel(level);
    }
    
    @Transactional(readOnly = true)
    public List<SystemLog> findByCategory(LogCategory category) {
        return systemLogRepository.findByCategory(category);
    }
    
    @Transactional(readOnly = true)
    public List<SystemLog> findByUser(User user) {
        return systemLogRepository.findByUser(user);
    }
    
    @Transactional(readOnly = true)
    public List<SystemLog> findByLevelAndCategory(LogLevel level, LogCategory category) {
        return systemLogRepository.findByLevelAndCategory(level, category);
    }
    
    @Transactional(readOnly = true)
    public List<SystemLog> findByLevelAndUser(LogLevel level, User user) {
        return systemLogRepository.findByLevelAndUser(level, user);
    }
    
    @Transactional(readOnly = true)
    public List<SystemLog> findByCategoryAndUser(LogCategory category, User user) {
        return systemLogRepository.findByCategoryAndUser(category, user);
    }
    
    @Transactional(readOnly = true)
    public List<SystemLog> findByLevelAndCategoryAndUser(LogLevel level, LogCategory category, User user) {
        return systemLogRepository.findByLevelAndCategoryAndUser(level, category, user);
    }
    
    @Transactional(readOnly = true)
    public Page<SystemLog> findByLevel(LogLevel level, Pageable pageable) {
        return systemLogRepository.findByLevelOrderByCreatedAtDesc(level, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<SystemLog> findByCategory(LogCategory category, Pageable pageable) {
        return systemLogRepository.findByCategoryOrderByCreatedAtDesc(category, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<SystemLog> findByUser(User user, Pageable pageable) {
        return systemLogRepository.findByUserOrderByCreatedAtDesc(user, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<SystemLog> findByLevelAndCategory(LogLevel level, LogCategory category, Pageable pageable) {
        return systemLogRepository.findByLevelAndCategoryOrderByCreatedAtDesc(level, category, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<SystemLog> findByLevelAndUser(LogLevel level, User user, Pageable pageable) {
        return systemLogRepository.findByLevelAndUserOrderByCreatedAtDesc(level, user, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<SystemLog> findByCategoryAndUser(LogCategory category, User user, Pageable pageable) {
        return systemLogRepository.findByCategoryAndUserOrderByCreatedAtDesc(category, user, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<SystemLog> findByLevelAndCategoryAndUser(LogLevel level, LogCategory category, User user, Pageable pageable) {
        return systemLogRepository.findByLevelAndCategoryAndUserOrderByCreatedAtDesc(level, category, user, pageable);
    }
    
    @Transactional(readOnly = true)
    public List<SystemLog> findByCreatedAtSince(LocalDateTime since) {
        return systemLogRepository.findByCreatedAtSince(since);
    }
    
    @Transactional(readOnly = true)
    public List<SystemLog> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return systemLogRepository.findByCreatedAtBetween(startDate, endDate);
    }
    
    @Transactional(readOnly = true)
    public Page<SystemLog> findByLevelIn(List<LogLevel> levels, Pageable pageable) {
        return systemLogRepository.findByLevelIn(levels, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<SystemLog> findByCategoryIn(List<LogCategory> categories, Pageable pageable) {
        return systemLogRepository.findByCategoryIn(categories, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<SystemLog> findByLevelInAndCategoryIn(List<LogLevel> levels, List<LogCategory> categories, Pageable pageable) {
        return systemLogRepository.findByLevelInAndCategoryIn(levels, categories, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<SystemLog> findUnarchived(Pageable pageable) {
        return systemLogRepository.findUnarchivedOrderByCreatedAtDesc(pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<SystemLog> findArchived(Pageable pageable) {
        return systemLogRepository.findArchivedOrderByCreatedAtDesc(pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<SystemLog> findUnarchivedByLevelIn(List<LogLevel> levels, Pageable pageable) {
        return systemLogRepository.findUnarchivedByLevelIn(levels, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<SystemLog> findUnarchivedByCategoryIn(List<LogCategory> categories, Pageable pageable) {
        return systemLogRepository.findUnarchivedByCategoryIn(categories, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<SystemLog> findUnarchivedByLevelInAndCategoryIn(List<LogLevel> levels, List<LogCategory> categories, Pageable pageable) {
        return systemLogRepository.findUnarchivedByLevelInAndCategoryIn(levels, categories, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<SystemLog> searchAll(String search, Pageable pageable) {
        return systemLogRepository.findBySearch(search, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<SystemLog> searchUnarchived(String search, Pageable pageable) {
        return systemLogRepository.findUnarchivedBySearch(search, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<SystemLog> findByIpAddress(String ipAddress, Pageable pageable) {
        return systemLogRepository.findByIpAddress(ipAddress, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<SystemLog> findBySessionId(String sessionId, Pageable pageable) {
        return systemLogRepository.findBySessionId(sessionId, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<SystemLog> findByUserAndIpAddress(User user, String ipAddress, Pageable pageable) {
        return systemLogRepository.findByUserAndIpAddress(user, ipAddress, pageable);
    }
    
    @Transactional(readOnly = true)
    public Long countByLevel(LogLevel level) {
        return systemLogRepository.countByLevel(level);
    }
    
    @Transactional(readOnly = true)
    public Long countByCategory(LogCategory category) {
        return systemLogRepository.countByCategory(category);
    }
    
    @Transactional(readOnly = true)
    public Long countByLevelAndCategory(LogLevel level, LogCategory category) {
        return systemLogRepository.countByLevelAndCategory(level, category);
    }
    
    @Transactional(readOnly = true)
    public Long countByCreatedAtSince(LocalDateTime since) {
        return systemLogRepository.countByCreatedAtSince(since);
    }
    
    @Transactional(readOnly = true)
    public Long countByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return systemLogRepository.countByCreatedAtBetween(startDate, endDate);
    }
    
    @Transactional(readOnly = true)
    public Long countByLevelIn(List<LogLevel> levels) {
        return systemLogRepository.countByLevelIn(levels);
    }
    
    @Transactional(readOnly = true)
    public Long countByCategoryIn(List<LogCategory> categories) {
        return systemLogRepository.countByCategoryIn(categories);
    }
    
    @Transactional(readOnly = true)
    public Long countByLevelInAndCategoryIn(List<LogLevel> levels, List<LogCategory> categories) {
        return systemLogRepository.countByLevelInAndCategoryIn(levels, categories);
    }
    
    // Convenience methods for common logging scenarios
    
    public void logUserLogin(User user, String ipAddress, String userAgent, String sessionId) {
        createLog(LogLevel.INFO, LogCategory.AUTHENTICATION, 
                "User login: " + user.getUsername(), 
                user, ipAddress, userAgent, sessionId);
    }
    
    public void logUserLogout(User user, String ipAddress, String userAgent, String sessionId) {
        createLog(LogLevel.INFO, LogCategory.AUTHENTICATION, 
                "User logout: " + user.getUsername(), 
                user, ipAddress, userAgent, sessionId);
    }
    
    public void logFailedLogin(String username, String ipAddress, String userAgent) {
        createLog(LogLevel.WARN, LogCategory.AUTHENTICATION, 
                "Failed login attempt: " + username, 
                "IP: " + ipAddress + ", User-Agent: " + userAgent);
    }
    
    public void logUserCreation(User user, User createdBy) {
        createLog(LogLevel.INFO, LogCategory.USER_MANAGEMENT, 
                "User created: " + user.getUsername() + " (" + user.getRole() + ")", 
                "Created by: " + createdBy.getUsername(), user);
    }
    
    public void logUserUpdate(User user, User updatedBy) {
        createLog(LogLevel.INFO, LogCategory.USER_MANAGEMENT, 
                "User updated: " + user.getUsername(), 
                "Updated by: " + updatedBy.getUsername(), user);
    }
    
    public void logUserDeactivation(User user, User deactivatedBy) {
        createLog(LogLevel.INFO, LogCategory.USER_MANAGEMENT, 
                "User deactivated: " + user.getUsername(), 
                "Deactivated by: " + deactivatedBy.getUsername(), user);
    }
    
    public void logAppointmentCreation(Appointment appointment, User createdBy) {
        createLog(LogLevel.INFO, LogCategory.APPOINTMENT, 
                "Appointment created: " + appointment.getId() + " for " + appointment.getPatient().getUsername(), 
                "Created by: " + createdBy.getUsername(), createdBy);
    }
    
    public void logAppointmentUpdate(Appointment appointment, User updatedBy) {
        createLog(LogLevel.INFO, LogCategory.APPOINTMENT, 
                "Appointment updated: " + appointment.getId(), 
                "Updated by: " + updatedBy.getUsername(), updatedBy);
    }
    
    public void logTicketCreation(SupportTicket ticket, User createdBy) {
        createLog(LogLevel.INFO, LogCategory.TICKET, 
                "Support ticket created: " + ticket.getTicketNumber(), 
                "Created by: " + createdBy.getUsername(), createdBy);
    }
    
    public void logTicketAssignment(SupportTicket ticket, User assignedBy) {
        createLog(LogLevel.INFO, LogCategory.TICKET, 
                "Support ticket assigned: " + ticket.getTicketNumber() + " to " + ticket.getAssignedTo().getUsername(), 
                "Assigned by: " + assignedBy.getUsername(), assignedBy);
    }
    
    public void logScheduleCreation(StaffSchedule schedule, User createdBy) {
        createLog(LogLevel.INFO, LogCategory.SCHEDULE, 
                "Staff schedule created: " + schedule.getId() + " for " + schedule.getStaff().getUsername(), 
                "Created by: " + createdBy.getUsername(), createdBy);
    }
    
    public void logSystemError(String message, String details) {
        createLog(LogLevel.ERROR, LogCategory.SYSTEM, message, details);
    }
    
    public void logSecurityAlert(String message, String details) {
        createLog(LogLevel.WARN, LogCategory.SECURITY, message, details);
    }
    
    public void logApiCall(String endpoint, String method, User user, String ipAddress) {
        createLog(LogLevel.INFO, LogCategory.API, 
                "API call: " + method + " " + endpoint, 
                "User: " + (user != null ? user.getUsername() : "Anonymous") + ", IP: " + ipAddress, 
                user, ipAddress, null, null);
    }
}

