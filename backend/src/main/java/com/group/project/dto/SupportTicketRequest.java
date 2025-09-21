package com.group.project.dto;

import com.group.project.model.TicketCategory;
import com.group.project.model.TicketPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SupportTicketRequest {
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    @NotNull(message = "Category is required")
    private TicketCategory category;
    
    private TicketPriority priority = TicketPriority.MEDIUM;
    
    public SupportTicketRequest() {}
    
    public SupportTicketRequest(String title, String description, TicketCategory category) {
        this.title = title;
        this.description = description;
        this.category = category;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public TicketCategory getCategory() {
        return category;
    }
    
    public void setCategory(TicketCategory category) {
        this.category = category;
    }
    
    public TicketPriority getPriority() {
        return priority;
    }
    
    public void setPriority(TicketPriority priority) {
        this.priority = priority;
    }
}

