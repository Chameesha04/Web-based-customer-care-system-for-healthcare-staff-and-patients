package com.group.project.model;

public enum AppointmentPriority {
    LOW("Low"),
    NORMAL("Normal"),
    HIGH("High"),
    URGENT("Urgent"),
    EMERGENCY("Emergency");
    
    private final String displayName;
    
    AppointmentPriority(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}

