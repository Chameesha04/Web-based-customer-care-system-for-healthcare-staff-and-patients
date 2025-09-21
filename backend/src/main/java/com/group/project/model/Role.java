package com.group.project.model;

public enum Role {
    CUSTOMER("Regular Customer"),
    RECEPTIONIST("Receptionist"),
    SMO("Senior Medical Officer"),
    STAFF("Staff Coordinator"),
    SUPPORT("Customer Support Manager"),
    ADMIN("System Administrator");
    
    private final String displayName;
    
    Role(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}

