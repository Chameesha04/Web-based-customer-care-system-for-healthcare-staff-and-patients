package com.group.project.repository;

import com.group.project.model.Appointment;
import com.group.project.model.AppointmentStatus;
import com.group.project.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    
    List<Appointment> findByPatient(User patient);
    
    List<Appointment> findByDoctor(User doctor);
    
    List<Appointment> findByPatientAndStatus(User patient, AppointmentStatus status);
    
    List<Appointment> findByDoctorAndStatus(User doctor, AppointmentStatus status);
    
    List<Appointment> findByPatientAndAppointmentDateBetween(User patient, LocalDateTime startDate, LocalDateTime endDate);
    
    List<Appointment> findByDoctorAndAppointmentDateBetween(User doctor, LocalDateTime startDate, LocalDateTime endDate);
    
    List<Appointment> findByAppointmentDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Appointment> findByAppointmentDateAndStatus(LocalDate date, AppointmentStatus status);
    
    List<Appointment> findByDoctorAndAppointmentDateAndStatus(User doctor, LocalDate date, AppointmentStatus status);
    
    @Query("SELECT a FROM Appointment a WHERE a.doctor = :doctor AND DATE(a.appointmentDate) = :date ORDER BY a.appointmentTime")
    List<Appointment> findByDoctorAndDateOrderByTime(@Param("doctor") User doctor, @Param("date") LocalDate date);
    
    @Query("SELECT a FROM Appointment a WHERE a.patient = :patient AND a.appointmentDate >= :startDate ORDER BY a.appointmentDate, a.appointmentTime")
    List<Appointment> findUpcomingByPatient(@Param("patient") User patient, @Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT a FROM Appointment a WHERE a.doctor = :doctor AND a.appointmentDate >= :startDate ORDER BY a.appointmentDate, a.appointmentTime")
    List<Appointment> findUpcomingByDoctor(@Param("doctor") User doctor, @Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.doctor = :doctor AND DATE(a.appointmentDate) = :date AND a.status IN :statuses")
    Long countByDoctorAndDateAndStatusIn(@Param("doctor") User doctor, @Param("date") LocalDate date, @Param("statuses") List<AppointmentStatus> statuses);
    
    @Query("SELECT a FROM Appointment a WHERE a.doctor = :doctor AND a.appointmentDate = :appointmentDate AND a.appointmentTime = :appointmentTime AND a.status != 'CANCELLED'")
    List<Appointment> findConflictingAppointments(@Param("doctor") User doctor, @Param("appointmentDate") LocalDateTime appointmentDate, @Param("appointmentTime") LocalTime appointmentTime);
    
    @Query("SELECT MAX(a.queueNumber) FROM Appointment a WHERE a.doctor = :doctor AND DATE(a.appointmentDate) = :date")
    Integer findMaxQueueNumberByDoctorAndDate(@Param("doctor") User doctor, @Param("date") LocalDate date);
    
    Page<Appointment> findByPatientOrderByAppointmentDateDesc(User patient, Pageable pageable);
    
    Page<Appointment> findByDoctorOrderByAppointmentDateDesc(User doctor, Pageable pageable);
    
    Page<Appointment> findByStatusOrderByAppointmentDateDesc(AppointmentStatus status, Pageable pageable);
    
    @Query("SELECT a FROM Appointment a WHERE a.status = :status AND a.appointmentDate >= :startDate ORDER BY a.appointmentDate, a.appointmentTime")
    Page<Appointment> findByStatusAndUpcomingDate(@Param("status") AppointmentStatus status, @Param("startDate") LocalDateTime startDate, Pageable pageable);
    
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.status = :status AND DATE(a.appointmentDate) = :date")
    Long countByStatusAndDate(@Param("status") AppointmentStatus status, @Param("date") LocalDate date);
    
    @Query("SELECT COUNT(a) FROM Appointment a WHERE DATE(a.appointmentDate) = :date")
    Long countByDate(@Param("date") LocalDate date);
    
    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate BETWEEN :startDate AND :endDate ORDER BY a.appointmentDate, a.appointmentTime")
    List<Appointment> findAppointmentsInDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}

