package com.group.project.service;

import com.group.project.model.*;
import com.group.project.repository.StaffScheduleRepository;
import com.group.project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class StaffScheduleService {
    
    @Autowired
    private StaffScheduleRepository staffScheduleRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    public StaffSchedule createSchedule(StaffSchedule schedule) {
        // Validate staff exists
        User staff = userRepository.findById(schedule.getStaff().getId())
                .orElseThrow(() -> new RuntimeException("Staff member not found"));
        
        // Check for conflicts
        List<StaffSchedule> conflicts = staffScheduleRepository.findActiveByStaffAndDate(
                staff, schedule.getScheduleDate());
        
        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Schedule conflict: Staff already has a schedule for this date");
        }
        
        schedule.setStatus(ScheduleStatus.SCHEDULED);
        schedule.setCreatedAt(LocalDateTime.now());
        schedule.setUpdatedAt(LocalDateTime.now());
        
        StaffSchedule savedSchedule = staffScheduleRepository.save(schedule);
        
        // Send notification
        notificationService.sendScheduleNotification(savedSchedule, NotificationType.SCHEDULE_CHANGE);
        
        return savedSchedule;
    }
    
    public StaffSchedule updateSchedule(Long id, StaffSchedule scheduleDetails) {
        StaffSchedule schedule = staffScheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff schedule not found with id: " + id));
        
        schedule.setScheduleDate(scheduleDetails.getScheduleDate());
        schedule.setStartTime(scheduleDetails.getStartTime());
        schedule.setEndTime(scheduleDetails.getEndTime());
        schedule.setShiftType(scheduleDetails.getShiftType());
        schedule.setDepartment(scheduleDetails.getDepartment());
        schedule.setNotes(scheduleDetails.getNotes());
        schedule.setUpdatedAt(LocalDateTime.now());
        
        StaffSchedule savedSchedule = staffScheduleRepository.save(schedule);
        
        // Send notification
        notificationService.sendScheduleNotification(savedSchedule, NotificationType.SCHEDULE_CHANGE);
        
        return savedSchedule;
    }
    
    public StaffSchedule confirmSchedule(Long id) {
        StaffSchedule schedule = staffScheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff schedule not found with id: " + id));
        
        schedule.setStatus(ScheduleStatus.CONFIRMED);
        schedule.setUpdatedAt(LocalDateTime.now());
        
        return staffScheduleRepository.save(schedule);
    }
    
    public StaffSchedule startShift(Long id) {
        StaffSchedule schedule = staffScheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff schedule not found with id: " + id));
        
        schedule.setStatus(ScheduleStatus.IN_PROGRESS);
        schedule.setUpdatedAt(LocalDateTime.now());
        
        return staffScheduleRepository.save(schedule);
    }
    
    public StaffSchedule completeShift(Long id) {
        StaffSchedule schedule = staffScheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff schedule not found with id: " + id));
        
        schedule.setStatus(ScheduleStatus.COMPLETED);
        schedule.setUpdatedAt(LocalDateTime.now());
        
        return staffScheduleRepository.save(schedule);
    }
    
    public StaffSchedule markAbsent(Long id, String reason) {
        StaffSchedule schedule = staffScheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff schedule not found with id: " + id));
        
        schedule.setStatus(ScheduleStatus.ABSENT);
        schedule.setNotes(reason);
        schedule.setUpdatedAt(LocalDateTime.now());
        
        return staffScheduleRepository.save(schedule);
    }
    
    public StaffSchedule cancelSchedule(Long id, String reason) {
        StaffSchedule schedule = staffScheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff schedule not found with id: " + id));
        
        schedule.setStatus(ScheduleStatus.CANCELLED);
        schedule.setNotes(reason);
        schedule.setUpdatedAt(LocalDateTime.now());
        
        return staffScheduleRepository.save(schedule);
    }
    
    public StaffSchedule swapSchedule(Long fromScheduleId, Long toScheduleId, Long fromStaffId, Long toStaffId) {
        StaffSchedule fromSchedule = staffScheduleRepository.findById(fromScheduleId)
                .orElseThrow(() -> new RuntimeException("From schedule not found"));
        
        StaffSchedule toSchedule = staffScheduleRepository.findById(toScheduleId)
                .orElseThrow(() -> new RuntimeException("To schedule not found"));
        
        User fromStaff = userRepository.findById(fromStaffId)
                .orElseThrow(() -> new RuntimeException("From staff not found"));
        
        User toStaff = userRepository.findById(toStaffId)
                .orElseThrow(() -> new RuntimeException("To staff not found"));
        
        // Swap the schedules
        fromSchedule.setStaff(toStaff);
        fromSchedule.setStatus(ScheduleStatus.SWAPPED);
        fromSchedule.setUpdatedAt(LocalDateTime.now());
        
        toSchedule.setStaff(fromStaff);
        toSchedule.setStatus(ScheduleStatus.SWAPPED);
        toSchedule.setUpdatedAt(LocalDateTime.now());
        
        staffScheduleRepository.save(fromSchedule);
        staffScheduleRepository.save(toSchedule);
        
        // Send notifications
        notificationService.sendScheduleNotification(fromSchedule, NotificationType.SCHEDULE_CHANGE);
        notificationService.sendScheduleNotification(toSchedule, NotificationType.SCHEDULE_CHANGE);
        
        return fromSchedule;
    }
    
    @Transactional(readOnly = true)
    public Optional<StaffSchedule> findById(Long id) {
        return staffScheduleRepository.findById(id);
    }
    
    @Transactional(readOnly = true)
    public List<StaffSchedule> findByStaff(User staff) {
        return staffScheduleRepository.findByStaff(staff);
    }
    
    @Transactional(readOnly = true)
    public List<StaffSchedule> findByStaffAndDate(User staff, LocalDate date) {
        return staffScheduleRepository.findByStaffAndScheduleDate(staff, date);
    }
    
    @Transactional(readOnly = true)
    public List<StaffSchedule> findByStaffAndDateRange(User staff, LocalDate startDate, LocalDate endDate) {
        return staffScheduleRepository.findByStaffAndDateRange(staff, startDate, endDate);
    }
    
    @Transactional(readOnly = true)
    public List<StaffSchedule> findByDate(LocalDate date) {
        return staffScheduleRepository.findByScheduleDate(date);
    }
    
    @Transactional(readOnly = true)
    public List<StaffSchedule> findByDateRange(LocalDate startDate, LocalDate endDate) {
        return staffScheduleRepository.findByDateRange(startDate, endDate);
    }
    
    @Transactional(readOnly = true)
    public List<StaffSchedule> findByStatus(ScheduleStatus status) {
        return staffScheduleRepository.findByStatus(status);
    }
    
    @Transactional(readOnly = true)
    public List<StaffSchedule> findByShiftType(ShiftType shiftType) {
        return staffScheduleRepository.findByShiftType(shiftType);
    }
    
    @Transactional(readOnly = true)
    public List<StaffSchedule> findUpcomingByStaff(User staff) {
        return staffScheduleRepository.findUpcomingByStaff(staff, LocalDate.now());
    }
    
    @Transactional(readOnly = true)
    public List<StaffSchedule> findUpcomingSchedules() {
        return staffScheduleRepository.findUpcomingSchedules(LocalDate.now());
    }
    
    @Transactional(readOnly = true)
    public List<StaffSchedule> findScheduledByStaffAndDateRange(User staff, LocalDate startDate, LocalDate endDate) {
        return staffScheduleRepository.findScheduledByStaffAndDateRange(staff, startDate, endDate);
    }
    
    @Transactional(readOnly = true)
    public List<StaffSchedule> findScheduledByDateRange(LocalDate startDate, LocalDate endDate) {
        return staffScheduleRepository.findScheduledByDateRange(startDate, endDate);
    }
    
    @Transactional(readOnly = true)
    public List<StaffSchedule> findAbsentByStaffAndDate(User staff, LocalDate date) {
        return staffScheduleRepository.findAbsentByStaffAndDate(staff, date);
    }
    
    @Transactional(readOnly = true)
    public List<StaffSchedule> findAbsentByDate(LocalDate date) {
        return staffScheduleRepository.findAbsentByDate(date);
    }
    
    @Transactional(readOnly = true)
    public List<StaffSchedule> findCompletedByStaffAndDateRange(User staff, LocalDate startDate, LocalDate endDate) {
        return staffScheduleRepository.findCompletedByStaffAndDateRange(staff, startDate, endDate);
    }
    
    @Transactional(readOnly = true)
    public List<StaffSchedule> findCompletedByDateRange(LocalDate startDate, LocalDate endDate) {
        return staffScheduleRepository.findCompletedByDateRange(startDate, endDate);
    }
    
    @Transactional(readOnly = true)
    public Page<StaffSchedule> findByStaff(User staff, Pageable pageable) {
        return staffScheduleRepository.findByStaffOrderByScheduleDateDesc(staff, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<StaffSchedule> findByDate(LocalDate date, Pageable pageable) {
        return staffScheduleRepository.findByScheduleDateOrderByStartTime(date, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<StaffSchedule> findByStatus(ScheduleStatus status, Pageable pageable) {
        return staffScheduleRepository.findByStatusOrderByScheduleDateDesc(status, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<StaffSchedule> searchByStaff(User staff, String search, Pageable pageable) {
        return staffScheduleRepository.findByStaffAndSearch(staff, search, pageable);
    }
    
    @Transactional(readOnly = true)
    public Long countByStaffAndDate(User staff, LocalDate date) {
        return staffScheduleRepository.countByStaffAndDateAndStatusIn(
                staff, date, List.of(ScheduleStatus.SCHEDULED, ScheduleStatus.CONFIRMED));
    }
    
    @Transactional(readOnly = true)
    public Long countByDate(LocalDate date) {
        return staffScheduleRepository.countByDateAndStatusIn(
                date, List.of(ScheduleStatus.SCHEDULED, ScheduleStatus.CONFIRMED));
    }
    
    @Transactional(readOnly = true)
    public Long countByStaffAndDateRange(User staff, LocalDate startDate, LocalDate endDate) {
        return staffScheduleRepository.countByStaffAndDateRange(staff, startDate, endDate);
    }
    
    @Transactional(readOnly = true)
    public Long countByDateRange(LocalDate startDate, LocalDate endDate) {
        return staffScheduleRepository.countByDateRange(startDate, endDate);
    }
    
    public boolean hasScheduleConflict(User staff, LocalDate date) {
        List<StaffSchedule> conflicts = staffScheduleRepository.findActiveByStaffAndDate(staff, date);
        return !conflicts.isEmpty();
    }
    
    public List<StaffSchedule> getStaffAvailability(User staff, LocalDate startDate, LocalDate endDate) {
        return staffScheduleRepository.findScheduledByStaffAndDateRange(staff, startDate, endDate);
    }
}

