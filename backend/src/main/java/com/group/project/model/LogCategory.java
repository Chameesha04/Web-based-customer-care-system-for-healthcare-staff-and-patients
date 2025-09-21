package com.group.project.model;

public enum LogCategory {
    AUTHENTICATION("Authentication"),
    AUTHORIZATION("Authorization"),
    USER_MANAGEMENT("User Management"),
    APPOINTMENT("Appointment"),
    TICKET("Support Ticket"),
    SCHEDULE("Schedule"),
    NOTIFICATION("Notification"),
    SYSTEM("System"),
    SECURITY("Security"),
    PERFORMANCE("Performance"),
    DATABASE("Database"),
    API("API"),
    FILE_UPLOAD("File Upload"),
    EMAIL("Email"),
    BACKUP("Backup"),
    MAINTENANCE("Maintenance");
    
    private final String displayName;
    
    LogCategory(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}

