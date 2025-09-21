package com.group.project.model;

public enum LogLevel {
    DEBUG("Debug"),
    INFO("Info"),
    WARN("Warning"),
    ERROR("Error"),
    FATAL("Fatal");
    
    private final String displayName;
    
    LogLevel(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}

