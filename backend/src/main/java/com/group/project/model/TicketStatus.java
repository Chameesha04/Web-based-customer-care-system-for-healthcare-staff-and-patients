package com.group.project.model;

public enum TicketStatus {
    OPEN("Open"),
    IN_PROGRESS("In Progress"),
    PENDING_CUSTOMER("Pending Customer"),
    PENDING_INTERNAL("Pending Internal"),
    RESOLVED("Resolved"),
    CLOSED("Closed"),
    CANCELLED("Cancelled");
    
    private final String displayName;
    
    TicketStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}

