package com.group.project.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "ticket_comments")
public class TicketComment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    private SupportTicket ticket;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @NotBlank
    @Column(name = "comment", length = 2000)
    private String comment;
    
    @Column(name = "is_internal")
    private Boolean isInternal = false;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Constructors
    public TicketComment() {
        this.createdAt = LocalDateTime.now();
    }
    
    public TicketComment(SupportTicket ticket, User user, String comment) {
        this();
        this.ticket = ticket;
        this.user = user;
        this.comment = comment;
    }
    
    public TicketComment(SupportTicket ticket, User user, String comment, Boolean isInternal) {
        this(ticket, user, comment);
        this.isInternal = isInternal;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public SupportTicket getTicket() { return ticket; }
    public void setTicket(SupportTicket ticket) { this.ticket = ticket; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    
    public Boolean getIsInternal() { return isInternal; }
    public void setIsInternal(Boolean isInternal) { this.isInternal = isInternal; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

