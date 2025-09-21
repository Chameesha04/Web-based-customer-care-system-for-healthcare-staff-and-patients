package com.group.project.model;

public enum ShiftType {
    MORNING("Morning Shift"),
    AFTERNOON("Afternoon Shift"),
    EVENING("Evening Shift"),
    NIGHT("Night Shift"),
    FULL_DAY("Full Day"),
    PART_TIME("Part Time"),
    ON_CALL("On Call");
    
    private final String displayName;
    
    ShiftType(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}

