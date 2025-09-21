package com.group.project.dto;

import com.group.project.model.AppointmentPriority;
import com.group.project.model.User;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class AppointmentRequest {
    
    @NotNull(message = "Doctor is required")
    private User doctor;
    
    @NotNull(message = "Appointment date is required")
    private LocalDateTime appointmentDate;
    
    @NotNull(message = "Appointment time is required")
    private LocalTime appointmentTime;
    
    private Integer durationMinutes = 30;
    
    private String reason;
    
    private AppointmentPriority priority = AppointmentPriority.NORMAL;
    
    private String notes;
    
    public AppointmentRequest() {}
    
    public AppointmentRequest(User doctor, LocalDateTime appointmentDate, LocalTime appointmentTime) {
        this.doctor = doctor;
        this.appointmentDate = appointmentDate;
        this.appointmentTime = appointmentTime;
    }
    
    public User getDoctor() {
        return doctor;
    }
    
    public void setDoctor(User doctor) {
        this.doctor = doctor;
    }
    
    public LocalDateTime getAppointmentDate() {
        return appointmentDate;
    }
    
    public void setAppointmentDate(LocalDateTime appointmentDate) {
        this.appointmentDate = appointmentDate;
    }
    
    public LocalTime getAppointmentTime() {
        return appointmentTime;
    }
    
    public void setAppointmentTime(LocalTime appointmentTime) {
        this.appointmentTime = appointmentTime;
    }
    
    public Integer getDurationMinutes() {
        return durationMinutes;
    }
    
    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }
    
    public String getReason() {
        return reason;
    }
    
    public void setReason(String reason) {
        this.reason = reason;
    }
    
    public AppointmentPriority getPriority() {
        return priority;
    }
    
    public void setPriority(AppointmentPriority priority) {
        this.priority = priority;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
}

