package com.group.project.model;

public enum TicketPriority {
    LOW("Low"),
    MEDIUM("Medium"),
    HIGH("High"),
    URGENT("Urgent"),
    CRITICAL("Critical");
    
    private final String displayName;
    
    TicketPriority(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}

