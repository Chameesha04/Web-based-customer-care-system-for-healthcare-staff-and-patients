package com.group.project.service;

import com.group.project.model.*;
import com.group.project.repository.AppointmentRepository;
import com.group.project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AppointmentService {
    
    @Autowired
    private AppointmentRepository appointmentRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    public Appointment createAppointment(Appointment appointment) {
        // Validate doctor and patient exist
        User doctor = userRepository.findById(appointment.getDoctor().getId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        User patient = userRepository.findById(appointment.getPatient().getId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        
        // Check for conflicts
        List<Appointment> conflicts = appointmentRepository.findConflictingAppointments(
                doctor, appointment.getAppointmentDate(), appointment.getAppointmentTime());
        
        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Appointment time conflict with existing appointment");
        }
        
        // Generate queue number
        Integer maxQueue = appointmentRepository.findMaxQueueNumberByDoctorAndDate(
                doctor, appointment.getAppointmentDate().toLocalDate());
        appointment.setQueueNumber(maxQueue != null ? maxQueue + 1 : 1);
        
        appointment.setStatus(AppointmentStatus.PENDING);
        appointment.setCreatedAt(LocalDateTime.now());
        appointment.setUpdatedAt(LocalDateTime.now());
        
        Appointment savedAppointment = appointmentRepository.save(appointment);
        
        // Send notifications
        notificationService.sendAppointmentNotification(savedAppointment, NotificationType.APPOINTMENT_REMINDER);
        
        return savedAppointment;
    }
    
    public Appointment updateAppointment(Long id, Appointment appointmentDetails) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
        
        appointment.setAppointmentDate(appointmentDetails.getAppointmentDate());
        appointment.setAppointmentTime(appointmentDetails.getAppointmentTime());
        appointment.setDurationMinutes(appointmentDetails.getDurationMinutes());
        appointment.setNotes(appointmentDetails.getNotes());
        appointment.setReason(appointmentDetails.getReason());
        appointment.setPriority(appointmentDetails.getPriority());
        appointment.setUpdatedAt(LocalDateTime.now());
        
        return appointmentRepository.save(appointment);
    }
    
    public Appointment confirmAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
        
        appointment.setStatus(AppointmentStatus.CONFIRMED);
        appointment.setUpdatedAt(LocalDateTime.now());
        
        Appointment savedAppointment = appointmentRepository.save(appointment);
        
        // Send confirmation notification
        notificationService.sendAppointmentNotification(savedAppointment, NotificationType.APPOINTMENT_CONFIRMED);
        
        return savedAppointment;
    }
    
    public Appointment cancelAppointment(Long id, String reason) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
        
        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointment.setCancelledAt(LocalDateTime.now());
        appointment.setCancellationReason(reason);
        appointment.setUpdatedAt(LocalDateTime.now());
        
        Appointment savedAppointment = appointmentRepository.save(appointment);
        
        // Send cancellation notification
        notificationService.sendAppointmentNotification(savedAppointment, NotificationType.APPOINTMENT_CANCELLED);
        
        return savedAppointment;
    }
    
    public Appointment rescheduleAppointment(Long id, LocalDateTime newDate, LocalTime newTime) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
        
        // Check for conflicts with new time
        List<Appointment> conflicts = appointmentRepository.findConflictingAppointments(
                appointment.getDoctor(), newDate, newTime);
        
        if (!conflicts.isEmpty()) {
            throw new RuntimeException("New appointment time conflicts with existing appointment");
        }
        
        appointment.setAppointmentDate(newDate);
        appointment.setAppointmentTime(newTime);
        appointment.setStatus(AppointmentStatus.RESCHEDULED);
        appointment.setUpdatedAt(LocalDateTime.now());
        
        Appointment savedAppointment = appointmentRepository.save(appointment);
        
        // Send reschedule notification
        notificationService.sendAppointmentNotification(savedAppointment, NotificationType.APPOINTMENT_RESCHEDULED);
        
        return savedAppointment;
    }
    
    public Appointment completeAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
        
        appointment.setStatus(AppointmentStatus.COMPLETED);
        appointment.setUpdatedAt(LocalDateTime.now());
        
        return appointmentRepository.save(appointment);
    }
    
    public Appointment markNoShow(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
        
        appointment.setStatus(AppointmentStatus.NO_SHOW);
        appointment.setUpdatedAt(LocalDateTime.now());
        
        return appointmentRepository.save(appointment);
    }
    
    @Transactional(readOnly = true)
    public Optional<Appointment> findById(Long id) {
        return appointmentRepository.findById(id);
    }
    
    @Transactional(readOnly = true)
    public List<Appointment> findByPatient(User patient) {
        return appointmentRepository.findByPatient(patient);
    }
    
    @Transactional(readOnly = true)
    public List<Appointment> findByDoctor(User doctor) {
        return appointmentRepository.findByDoctor(doctor);
    }
    
    @Transactional(readOnly = true)
    public List<Appointment> findByPatientAndStatus(User patient, AppointmentStatus status) {
        return appointmentRepository.findByPatientAndStatus(patient, status);
    }
    
    @Transactional(readOnly = true)
    public List<Appointment> findByDoctorAndStatus(User doctor, AppointmentStatus status) {
        return appointmentRepository.findByDoctorAndStatus(doctor, status);
    }
    
    @Transactional(readOnly = true)
    public List<Appointment> findUpcomingByPatient(User patient) {
        return appointmentRepository.findUpcomingByPatient(patient, LocalDateTime.now());
    }
    
    @Transactional(readOnly = true)
    public List<Appointment> findUpcomingByDoctor(User doctor) {
        return appointmentRepository.findUpcomingByDoctor(doctor, LocalDateTime.now());
    }
    
    @Transactional(readOnly = true)
    public List<Appointment> findByDoctorAndDate(User doctor, LocalDate date) {
        return appointmentRepository.findByDoctorAndDateOrderByTime(doctor, date);
    }
    
    @Transactional(readOnly = true)
    public List<Appointment> findByDate(LocalDate date) {
        return appointmentRepository.findByAppointmentDateAndStatus(date, AppointmentStatus.CONFIRMED);
    }
    
    @Transactional(readOnly = true)
    public List<Appointment> findByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return appointmentRepository.findAppointmentsInDateRange(startDate, endDate);
    }
    
    @Transactional(readOnly = true)
    public Page<Appointment> findByPatient(User patient, Pageable pageable) {
        return appointmentRepository.findByPatientOrderByAppointmentDateDesc(patient, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<Appointment> findByDoctor(User doctor, Pageable pageable) {
        return appointmentRepository.findByDoctorOrderByAppointmentDateDesc(doctor, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<Appointment> findByStatus(AppointmentStatus status, Pageable pageable) {
        return appointmentRepository.findByStatusOrderByAppointmentDateDesc(status, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<Appointment> findUpcomingByStatus(AppointmentStatus status, Pageable pageable) {
        return appointmentRepository.findByStatusAndUpcomingDate(status, LocalDateTime.now(), pageable);
    }
    
    @Transactional(readOnly = true)
    public Long countByDoctorAndDate(User doctor, LocalDate date) {
        return appointmentRepository.countByDoctorAndDateAndStatusIn(
                doctor, date, List.of(AppointmentStatus.CONFIRMED, AppointmentStatus.PENDING));
    }
    
    @Transactional(readOnly = true)
    public Long countByDate(LocalDate date) {
        return appointmentRepository.countByDate(date);
    }
    
    @Transactional(readOnly = true)
    public Long countByStatusAndDate(AppointmentStatus status, LocalDate date) {
        return appointmentRepository.countByStatusAndDate(status, date);
    }
    
    public boolean hasConflictingAppointment(User doctor, LocalDateTime appointmentDate, LocalTime appointmentTime) {
        List<Appointment> conflicts = appointmentRepository.findConflictingAppointments(
                doctor, appointmentDate, appointmentTime);
        return !conflicts.isEmpty();
    }
    
    public Integer getNextQueueNumber(User doctor, LocalDate date) {
        Integer maxQueue = appointmentRepository.findMaxQueueNumberByDoctorAndDate(doctor, date);
        return maxQueue != null ? maxQueue + 1 : 1;
    }
}

