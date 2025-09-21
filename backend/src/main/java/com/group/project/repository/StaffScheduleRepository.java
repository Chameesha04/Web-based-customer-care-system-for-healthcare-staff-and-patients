package com.group.project.repository;

import com.group.project.model.ScheduleStatus;
import com.group.project.model.ShiftType;
import com.group.project.model.StaffSchedule;
import com.group.project.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StaffScheduleRepository extends JpaRepository<StaffSchedule, Long> {
    
    List<StaffSchedule> findByStaff(User staff);
    
    List<StaffSchedule> findByStaffAndScheduleDate(User staff, LocalDate scheduleDate);
    
    List<StaffSchedule> findByStaffAndScheduleDateBetween(User staff, LocalDate startDate, LocalDate endDate);
    
    List<StaffSchedule> findByScheduleDate(LocalDate scheduleDate);
    
    List<StaffSchedule> findByScheduleDateBetween(LocalDate startDate, LocalDate endDate);
    
    List<StaffSchedule> findByStatus(ScheduleStatus status);
    
    List<StaffSchedule> findByShiftType(ShiftType shiftType);
    
    List<StaffSchedule> findByStaffAndStatus(User staff, ScheduleStatus status);
    
    List<StaffSchedule> findByStaffAndShiftType(User staff, ShiftType shiftType);
    
    @Query("SELECT s FROM StaffSchedule s WHERE s.staff = :staff AND s.scheduleDate >= :startDate ORDER BY s.scheduleDate, s.startTime")
    List<StaffSchedule> findUpcomingByStaff(@Param("staff") User staff, @Param("startDate") LocalDate startDate);
    
    @Query("SELECT s FROM StaffSchedule s WHERE s.scheduleDate >= :startDate ORDER BY s.scheduleDate, s.startTime")
    List<StaffSchedule> findUpcomingSchedules(@Param("startDate") LocalDate startDate);
    
    @Query("SELECT s FROM StaffSchedule s WHERE s.staff = :staff AND s.scheduleDate BETWEEN :startDate AND :endDate ORDER BY s.scheduleDate, s.startTime")
    List<StaffSchedule> findByStaffAndDateRange(@Param("staff") User staff, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT s FROM StaffSchedule s WHERE s.scheduleDate BETWEEN :startDate AND :endDate ORDER BY s.scheduleDate, s.startTime")
    List<StaffSchedule> findByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT COUNT(s) FROM StaffSchedule s WHERE s.staff = :staff AND s.scheduleDate = :date AND s.status IN :statuses")
    Long countByStaffAndDateAndStatusIn(@Param("staff") User staff, @Param("date") LocalDate date, @Param("statuses") List<ScheduleStatus> statuses);
    
    @Query("SELECT COUNT(s) FROM StaffSchedule s WHERE s.scheduleDate = :date AND s.status IN :statuses")
    Long countByDateAndStatusIn(@Param("date") LocalDate date, @Param("statuses") List<ScheduleStatus> statuses);
    
    @Query("SELECT s FROM StaffSchedule s WHERE s.staff = :staff AND s.scheduleDate = :date AND s.status != 'CANCELLED'")
    List<StaffSchedule> findActiveByStaffAndDate(@Param("staff") User staff, @Param("date") LocalDate date);
    
    @Query("SELECT s FROM StaffSchedule s WHERE s.scheduleDate = :date AND s.status != 'CANCELLED'")
    List<StaffSchedule> findActiveByDate(@Param("date") LocalDate date);
    
    @Query("SELECT s FROM StaffSchedule s WHERE s.staff = :staff AND s.scheduleDate >= :startDate AND s.scheduleDate <= :endDate AND s.status = 'SCHEDULED' ORDER BY s.scheduleDate, s.startTime")
    List<StaffSchedule> findScheduledByStaffAndDateRange(@Param("staff") User staff, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT s FROM StaffSchedule s WHERE s.scheduleDate >= :startDate AND s.scheduleDate <= :endDate AND s.status = 'SCHEDULED' ORDER BY s.scheduleDate, s.startTime")
    List<StaffSchedule> findScheduledByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT s FROM StaffSchedule s WHERE s.staff = :staff AND s.scheduleDate = :date AND s.status = 'ABSENT'")
    List<StaffSchedule> findAbsentByStaffAndDate(@Param("staff") User staff, @Param("date") LocalDate date);
    
    @Query("SELECT s FROM StaffSchedule s WHERE s.scheduleDate = :date AND s.status = 'ABSENT'")
    List<StaffSchedule> findAbsentByDate(@Param("date") LocalDate date);
    
    @Query("SELECT s FROM StaffSchedule s WHERE s.staff = :staff AND s.scheduleDate >= :startDate AND s.scheduleDate <= :endDate AND s.status = 'COMPLETED' ORDER BY s.scheduleDate, s.startTime")
    List<StaffSchedule> findCompletedByStaffAndDateRange(@Param("staff") User staff, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT s FROM StaffSchedule s WHERE s.scheduleDate >= :startDate AND s.scheduleDate <= :endDate AND s.status = 'COMPLETED' ORDER BY s.scheduleDate, s.startTime")
    List<StaffSchedule> findCompletedByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    Page<StaffSchedule> findByStaffOrderByScheduleDateDesc(User staff, Pageable pageable);
    
    Page<StaffSchedule> findByScheduleDateOrderByStartTime(LocalDate scheduleDate, Pageable pageable);
    
    Page<StaffSchedule> findByStatusOrderByScheduleDateDesc(ScheduleStatus status, Pageable pageable);
    
    @Query("SELECT s FROM StaffSchedule s WHERE s.staff = :staff AND (s.department LIKE %:search% OR s.notes LIKE %:search%) ORDER BY s.scheduleDate DESC")
    Page<StaffSchedule> findByStaffAndSearch(@Param("staff") User staff, @Param("search") String search, Pageable pageable);
    
    @Query("SELECT COUNT(s) FROM StaffSchedule s WHERE s.staff = :staff AND s.scheduleDate >= :startDate AND s.scheduleDate <= :endDate")
    Long countByStaffAndDateRange(@Param("staff") User staff, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT COUNT(s) FROM StaffSchedule s WHERE s.scheduleDate >= :startDate AND s.scheduleDate <= :endDate")
    Long countByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}

