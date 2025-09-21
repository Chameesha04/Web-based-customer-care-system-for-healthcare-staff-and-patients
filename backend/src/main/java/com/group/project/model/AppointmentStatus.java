package com.group.project.model;

public enum AppointmentStatus {
    PENDING("Pending"),
    CONFIRMED("Confirmed"),
    IN_PROGRESS("In Progress"),
    COMPLETED("Completed"),
    CANCELLED("Cancelled"),
    NO_SHOW("No Show"),
    RESCHEDULED("Rescheduled");
    
    private final String displayName;
    
    AppointmentStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}

