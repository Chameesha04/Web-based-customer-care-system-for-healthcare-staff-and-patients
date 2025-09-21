package com.group.project.model;

public enum NotificationType {
    APPOINTMENT_REMINDER("Appointment Reminder"),
    APPOINTMENT_CONFIRMED("Appointment Confirmed"),
    APPOINTMENT_CANCELLED("Appointment Cancelled"),
    APPOINTMENT_RESCHEDULED("Appointment Rescheduled"),
    QUEUE_UPDATE("Queue Update"),
    TICKET_ASSIGNED("Ticket Assigned"),
    TICKET_UPDATED("Ticket Updated"),
    TICKET_RESOLVED("Ticket Resolved"),
    SCHEDULE_CHANGE("Schedule Change"),
    SYSTEM_ALERT("System Alert"),
    GENERAL_NOTIFICATION("General Notification"),
    EMERGENCY("Emergency"),
    MAINTENANCE("Maintenance"),
    SECURITY_ALERT("Security Alert");
    
    private final String displayName;
    
    NotificationType(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}

