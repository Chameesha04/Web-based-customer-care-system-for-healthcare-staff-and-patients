package com.group.project.service;

import com.group.project.model.*;
import com.group.project.repository.SupportTicketRepository;
import com.group.project.repository.TicketCommentRepository;
import com.group.project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class SupportTicketService {
    
    @Autowired
    private SupportTicketRepository supportTicketRepository;
    
    @Autowired
    private TicketCommentRepository ticketCommentRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    public SupportTicket createTicket(SupportTicket ticket) {
        // Validate customer exists
        User customer = userRepository.findById(ticket.getCustomer().getId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());
        
        SupportTicket savedTicket = supportTicketRepository.save(ticket);
        
        // Send notification to support team
        notificationService.sendTicketNotification(savedTicket, NotificationType.TICKET_ASSIGNED);
        
        return savedTicket;
    }
    
    public SupportTicket updateTicket(Long id, SupportTicket ticketDetails) {
        SupportTicket ticket = supportTicketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Support ticket not found with id: " + id));
        
        ticket.setTitle(ticketDetails.getTitle());
        ticket.setDescription(ticketDetails.getDescription());
        ticket.setCategory(ticketDetails.getCategory());
        ticket.setPriority(ticketDetails.getPriority());
        ticket.setUpdatedAt(LocalDateTime.now());
        
        SupportTicket savedTicket = supportTicketRepository.save(ticket);
        
        // Send update notification
        notificationService.sendTicketNotification(savedTicket, NotificationType.TICKET_UPDATED);
        
        return savedTicket;
    }
    
    public SupportTicket assignTicket(Long ticketId, Long userId) {
        SupportTicket ticket = supportTicketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Support ticket not found with id: " + ticketId));
        
        User assignedUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        ticket.setAssignedTo(assignedUser);
        ticket.setStatus(TicketStatus.IN_PROGRESS);
        ticket.setUpdatedAt(LocalDateTime.now());
        
        SupportTicket savedTicket = supportTicketRepository.save(ticket);
        
        // Send assignment notification
        notificationService.sendTicketNotification(savedTicket, NotificationType.TICKET_ASSIGNED);
        
        return savedTicket;
    }
    
    public SupportTicket updateTicketStatus(Long id, TicketStatus status) {
        SupportTicket ticket = supportTicketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Support ticket not found with id: " + id));
        
        ticket.setStatus(status);
        ticket.setUpdatedAt(LocalDateTime.now());
        
        if (status == TicketStatus.RESOLVED || status == TicketStatus.CLOSED) {
            ticket.setResolvedAt(LocalDateTime.now());
        }
        
        SupportTicket savedTicket = supportTicketRepository.save(ticket);
        
        // Send status update notification
        notificationService.sendTicketNotification(savedTicket, NotificationType.TICKET_UPDATED);
        
        return savedTicket;
    }
    
    public SupportTicket resolveTicket(Long id, String resolutionNotes) {
        SupportTicket ticket = supportTicketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Support ticket not found with id: " + id));
        
        ticket.setStatus(TicketStatus.RESOLVED);
        ticket.setResolutionNotes(resolutionNotes);
        ticket.setResolvedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());
        
        SupportTicket savedTicket = supportTicketRepository.save(ticket);
        
        // Send resolution notification
        notificationService.sendTicketNotification(savedTicket, NotificationType.TICKET_RESOLVED);
        
        return savedTicket;
    }
    
    public SupportTicket closeTicket(Long id) {
        SupportTicket ticket = supportTicketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Support ticket not found with id: " + id));
        
        ticket.setStatus(TicketStatus.CLOSED);
        ticket.setUpdatedAt(LocalDateTime.now());
        
        return supportTicketRepository.save(ticket);
    }
    
    public TicketComment addComment(Long ticketId, TicketComment comment) {
        SupportTicket ticket = supportTicketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Support ticket not found with id: " + ticketId));
        
        User user = userRepository.findById(comment.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        comment.setTicket(ticket);
        comment.setUser(user);
        comment.setCreatedAt(LocalDateTime.now());
        
        TicketComment savedComment = ticketCommentRepository.save(comment);
        
        // Update ticket timestamp
        ticket.setUpdatedAt(LocalDateTime.now());
        supportTicketRepository.save(ticket);
        
        // Send notification for new comment
        notificationService.sendTicketNotification(ticket, NotificationType.TICKET_UPDATED);
        
        return savedComment;
    }
    
    @Transactional(readOnly = true)
    public Optional<SupportTicket> findById(Long id) {
        return supportTicketRepository.findById(id);
    }
    
    @Transactional(readOnly = true)
    public List<SupportTicket> findByCustomer(User customer) {
        return supportTicketRepository.findByCustomer(customer);
    }
    
    @Transactional(readOnly = true)
    public List<SupportTicket> findByAssignedTo(User assignedTo) {
        return supportTicketRepository.findByAssignedTo(assignedTo);
    }
    
    @Transactional(readOnly = true)
    public List<SupportTicket> findByStatus(TicketStatus status) {
        return supportTicketRepository.findByStatus(status);
    }
    
    @Transactional(readOnly = true)
    public List<SupportTicket> findByPriority(TicketPriority priority) {
        return supportTicketRepository.findByPriority(priority);
    }
    
    @Transactional(readOnly = true)
    public List<SupportTicket> findByCategory(TicketCategory category) {
        return supportTicketRepository.findByCategory(category);
    }
    
    @Transactional(readOnly = true)
    public Page<SupportTicket> findByCustomer(User customer, Pageable pageable) {
        return supportTicketRepository.findByCustomerOrderByCreatedAtDesc(customer, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<SupportTicket> findByAssignedTo(User assignedTo, Pageable pageable) {
        return supportTicketRepository.findByAssignedToOrderByCreatedAtDesc(assignedTo, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<SupportTicket> findByStatus(TicketStatus status, Pageable pageable) {
        return supportTicketRepository.findByStatusOrderByCreatedAtDesc(status, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<SupportTicket> findByPriority(TicketPriority priority, Pageable pageable) {
        return supportTicketRepository.findByPriorityOrderByCreatedAtDesc(priority, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<SupportTicket> findByCategory(TicketCategory category, Pageable pageable) {
        return supportTicketRepository.findByCategoryOrderByCreatedAtDesc(category, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<SupportTicket> searchByCustomer(User customer, String search, Pageable pageable) {
        return supportTicketRepository.findByCustomerAndSearch(customer, search, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<SupportTicket> searchByAssignedTo(User assignedTo, String search, Pageable pageable) {
        return supportTicketRepository.findByAssignedToAndSearch(assignedTo, search, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<SupportTicket> searchByStatus(TicketStatus status, String search, Pageable pageable) {
        return supportTicketRepository.findByStatusAndSearch(status, search, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<SupportTicket> searchAll(String search, Pageable pageable) {
        return supportTicketRepository.findBySearch(search, pageable);
    }
    
    @Transactional(readOnly = true)
    public List<SupportTicket> findUnassignedTickets() {
        return supportTicketRepository.findUnassignedOpenTickets();
    }
    
    @Transactional(readOnly = true)
    public List<SupportTicket> findOverdueTickets() {
        return supportTicketRepository.findOverdueTickets(LocalDateTime.now());
    }
    
    @Transactional(readOnly = true)
    public List<SupportTicket> findTicketsCreatedSince(LocalDateTime since) {
        return supportTicketRepository.findTicketsCreatedSince(since);
    }
    
    @Transactional(readOnly = true)
    public List<SupportTicket> findTicketsResolvedSince(LocalDateTime since) {
        return supportTicketRepository.findTicketsResolvedSince(since);
    }
    
    @Transactional(readOnly = true)
    public Long countByStatus(TicketStatus status) {
        return supportTicketRepository.countByStatus(status);
    }
    
    @Transactional(readOnly = true)
    public Long countByPriority(TicketPriority priority) {
        return supportTicketRepository.countByPriority(priority);
    }
    
    @Transactional(readOnly = true)
    public Long countByCategory(TicketCategory category) {
        return supportTicketRepository.countByCategory(category);
    }
    
    @Transactional(readOnly = true)
    public Long countByAssignedToAndStatusIn(User assignedTo, List<TicketStatus> statuses) {
        return supportTicketRepository.countByAssignedToAndStatusIn(assignedTo, statuses);
    }
    
    @Transactional(readOnly = true)
    public Long countByCustomerAndStatusIn(User customer, List<TicketStatus> statuses) {
        return supportTicketRepository.countByCustomerAndStatusIn(customer, statuses);
    }
    
    @Transactional(readOnly = true)
    public Double getAverageResolutionTimeHours(LocalDateTime since) {
        return supportTicketRepository.getAverageResolutionTimeHours(since);
    }
    
    @Transactional(readOnly = true)
    public Long countTicketsInDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return supportTicketRepository.countTicketsInDateRange(startDate, endDate);
    }
    
    @Transactional(readOnly = true)
    public List<TicketComment> getTicketComments(Long ticketId) {
        SupportTicket ticket = supportTicketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Support ticket not found with id: " + ticketId));
        return ticketCommentRepository.findByTicketOrderByCreatedAtAsc(ticket);
    }
    
    @Transactional(readOnly = true)
    public List<TicketComment> getPublicTicketComments(Long ticketId) {
        SupportTicket ticket = supportTicketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Support ticket not found with id: " + ticketId));
        return ticketCommentRepository.findPublicCommentsByTicket(ticket);
    }
    
    @Transactional(readOnly = true)
    public List<TicketComment> getInternalTicketComments(Long ticketId) {
        SupportTicket ticket = supportTicketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Support ticket not found with id: " + ticketId));
        return ticketCommentRepository.findInternalCommentsByTicket(ticket);
    }
}

