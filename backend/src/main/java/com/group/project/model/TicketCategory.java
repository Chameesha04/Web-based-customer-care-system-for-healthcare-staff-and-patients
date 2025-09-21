package com.group.project.model;

public enum TicketCategory {
    APPOINTMENT("Appointment Issues"),
    BILLING("Billing & Payment"),
    MEDICAL_RECORDS("Medical Records"),
    TECHNICAL("Technical Support"),
    GENERAL_INQUIRY("General Inquiry"),
    COMPLAINT("Complaint"),
    FEEDBACK("Feedback"),
    EMERGENCY("Emergency"),
    PRESCRIPTION("Prescription"),
    TEST_RESULTS("Test Results");
    
    private final String displayName;
    
    TicketCategory(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}

