package com.group.project.repository;

import com.group.project.model.SupportTicket;
import com.group.project.model.TicketCategory;
import com.group.project.model.TicketPriority;
import com.group.project.model.TicketStatus;
import com.group.project.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {
    
    List<SupportTicket> findByCustomer(User customer);
    
    List<SupportTicket> findByAssignedTo(User assignedTo);
    
    List<SupportTicket> findByStatus(TicketStatus status);
    
    List<SupportTicket> findByPriority(TicketPriority priority);
    
    List<SupportTicket> findByCategory(TicketCategory category);
    
    List<SupportTicket> findByCustomerAndStatus(User customer, TicketStatus status);
    
    List<SupportTicket> findByAssignedToAndStatus(User assignedTo, TicketStatus status);
    
    Page<SupportTicket> findByCustomerOrderByCreatedAtDesc(User customer, Pageable pageable);
    
    Page<SupportTicket> findByAssignedToOrderByCreatedAtDesc(User assignedTo, Pageable pageable);
    
    Page<SupportTicket> findByStatusOrderByCreatedAtDesc(TicketStatus status, Pageable pageable);
    
    Page<SupportTicket> findByPriorityOrderByCreatedAtDesc(TicketPriority priority, Pageable pageable);
    
    Page<SupportTicket> findByCategoryOrderByCreatedAtDesc(TicketCategory category, Pageable pageable);
    
    @Query("SELECT t FROM SupportTicket t WHERE t.customer = :customer AND (t.title LIKE %:search% OR t.description LIKE %:search%) ORDER BY t.createdAt DESC")
    Page<SupportTicket> findByCustomerAndSearch(@Param("customer") User customer, @Param("search") String search, Pageable pageable);
    
    @Query("SELECT t FROM SupportTicket t WHERE t.assignedTo = :assignedTo AND (t.title LIKE %:search% OR t.description LIKE %:search%) ORDER BY t.createdAt DESC")
    Page<SupportTicket> findByAssignedToAndSearch(@Param("assignedTo") User assignedTo, @Param("search") String search, Pageable pageable);
    
    @Query("SELECT t FROM SupportTicket t WHERE t.status = :status AND (t.title LIKE %:search% OR t.description LIKE %:search%) ORDER BY t.createdAt DESC")
    Page<SupportTicket> findByStatusAndSearch(@Param("status") TicketStatus status, @Param("search") String search, Pageable pageable);
    
    @Query("SELECT t FROM SupportTicket t WHERE (t.title LIKE %:search% OR t.description LIKE %:search%) ORDER BY t.createdAt DESC")
    Page<SupportTicket> findBySearch(@Param("search") String search, Pageable pageable);
    
    @Query("SELECT COUNT(t) FROM SupportTicket t WHERE t.status = :status")
    Long countByStatus(@Param("status") TicketStatus status);
    
    @Query("SELECT COUNT(t) FROM SupportTicket t WHERE t.priority = :priority")
    Long countByPriority(@Param("priority") TicketPriority priority);
    
    @Query("SELECT COUNT(t) FROM SupportTicket t WHERE t.category = :category")
    Long countByCategory(@Param("category") TicketCategory category);
    
    @Query("SELECT COUNT(t) FROM SupportTicket t WHERE t.assignedTo = :assignedTo AND t.status IN :statuses")
    Long countByAssignedToAndStatusIn(@Param("assignedTo") User assignedTo, @Param("statuses") List<TicketStatus> statuses);
    
    @Query("SELECT COUNT(t) FROM SupportTicket t WHERE t.customer = :customer AND t.status IN :statuses")
    Long countByCustomerAndStatusIn(@Param("customer") User customer, @Param("statuses") List<TicketStatus> statuses);
    
    @Query("SELECT t FROM SupportTicket t WHERE t.createdAt >= :since ORDER BY t.createdAt DESC")
    List<SupportTicket> findTicketsCreatedSince(@Param("since") LocalDateTime since);
    
    @Query("SELECT t FROM SupportTicket t WHERE t.resolvedAt >= :since ORDER BY t.resolvedAt DESC")
    List<SupportTicket> findTicketsResolvedSince(@Param("since") LocalDateTime since);
    
    @Query("SELECT t FROM SupportTicket t WHERE t.dueDate <= :dueDate AND t.status NOT IN ('RESOLVED', 'CLOSED') ORDER BY t.dueDate ASC")
    List<SupportTicket> findOverdueTickets(@Param("dueDate") LocalDateTime dueDate);
    
    @Query("SELECT t FROM SupportTicket t WHERE t.assignedTo IS NULL AND t.status = 'OPEN' ORDER BY t.createdAt ASC")
    List<SupportTicket> findUnassignedOpenTickets();
    
    @Query("SELECT t FROM SupportTicket t WHERE t.status IN :statuses ORDER BY t.createdAt DESC")
    Page<SupportTicket> findByStatusIn(@Param("statuses") List<TicketStatus> statuses, Pageable pageable);
    
    @Query("SELECT t FROM SupportTicket t WHERE t.priority IN :priorities ORDER BY t.createdAt DESC")
    Page<SupportTicket> findByPriorityIn(@Param("priorities") List<TicketPriority> priorities, Pageable pageable);
    
    @Query("SELECT t FROM SupportTicket t WHERE t.category IN :categories ORDER BY t.createdAt DESC")
    Page<SupportTicket> findByCategoryIn(@Param("categories") List<TicketCategory> categories, Pageable pageable);
    
    @Query("SELECT AVG(TIMESTAMPDIFF(HOUR, t.createdAt, t.resolvedAt)) FROM SupportTicket t WHERE t.resolvedAt IS NOT NULL AND t.createdAt >= :since")
    Double getAverageResolutionTimeHours(@Param("since") LocalDateTime since);
    
    @Query("SELECT COUNT(t) FROM SupportTicket t WHERE t.createdAt >= :startDate AND t.createdAt <= :endDate")
    Long countTicketsInDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}

