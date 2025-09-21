package com.group.project.model;

public enum NotificationPriority {
    LOW("Low"),
    NORMAL("Normal"),
    HIGH("High"),
    URGENT("Urgent"),
    CRITICAL("Critical");
    
    private final String displayName;
    
    NotificationPriority(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}

