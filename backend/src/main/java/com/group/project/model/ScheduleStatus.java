package com.group.project.model;

public enum ScheduleStatus {
    SCHEDULED("Scheduled"),
    CONFIRMED("Confirmed"),
    IN_PROGRESS("In Progress"),
    COMPLETED("Completed"),
    CANCELLED("Cancelled"),
    ABSENT("Absent"),
    SWAPPED("Swapped");
    
    private final String displayName;
    
    ScheduleStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}

