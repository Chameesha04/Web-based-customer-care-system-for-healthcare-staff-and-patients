package com.group.project.repository;

import com.group.project.model.SupportTicket;
import com.group.project.model.TicketComment;
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
public interface TicketCommentRepository extends JpaRepository<TicketComment, Long> {
    
    List<TicketComment> findByTicket(SupportTicket ticket);
    
    List<TicketComment> findByUser(User user);
    
    List<TicketComment> findByTicketAndIsInternalFalse(SupportTicket ticket);
    
    List<TicketComment> findByTicketAndIsInternalTrue(SupportTicket ticket);
    
    List<TicketComment> findByTicketOrderByCreatedAtAsc(SupportTicket ticket);
    
    List<TicketComment> findByTicketOrderByCreatedAtDesc(SupportTicket ticket);
    
    List<TicketComment> findByUserOrderByCreatedAtDesc(User user);
    
    Page<TicketComment> findByTicketOrderByCreatedAtDesc(SupportTicket ticket, Pageable pageable);
    
    Page<TicketComment> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    
    @Query("SELECT c FROM TicketComment c WHERE c.ticket = :ticket AND c.isInternal = false ORDER BY c.createdAt ASC")
    List<TicketComment> findPublicCommentsByTicket(@Param("ticket") SupportTicket ticket);
    
    @Query("SELECT c FROM TicketComment c WHERE c.ticket = :ticket AND c.isInternal = true ORDER BY c.createdAt ASC")
    List<TicketComment> findInternalCommentsByTicket(@Param("ticket") SupportTicket ticket);
    
    @Query("SELECT COUNT(c) FROM TicketComment c WHERE c.ticket = :ticket")
    Long countByTicket(@Param("ticket") SupportTicket ticket);
    
    @Query("SELECT COUNT(c) FROM TicketComment c WHERE c.ticket = :ticket AND c.isInternal = false")
    Long countPublicByTicket(@Param("ticket") SupportTicket ticket);
    
    @Query("SELECT COUNT(c) FROM TicketComment c WHERE c.ticket = :ticket AND c.isInternal = true")
    Long countInternalByTicket(@Param("ticket") SupportTicket ticket);
    
    @Query("SELECT COUNT(c) FROM TicketComment c WHERE c.user = :user")
    Long countByUser(@Param("user") User user);
    
    @Query("SELECT c FROM TicketComment c WHERE c.ticket = :ticket AND c.createdAt >= :since ORDER BY c.createdAt DESC")
    List<TicketComment> findByTicketAndCreatedAtSince(@Param("ticket") SupportTicket ticket, @Param("since") LocalDateTime since);
    
    @Query("SELECT c FROM TicketComment c WHERE c.user = :user AND c.createdAt >= :since ORDER BY c.createdAt DESC")
    List<TicketComment> findByUserAndCreatedAtSince(@Param("user") User user, @Param("since") LocalDateTime since);
    
    @Query("SELECT c FROM TicketComment c WHERE c.ticket = :ticket AND (c.comment LIKE %:search%) ORDER BY c.createdAt DESC")
    Page<TicketComment> findByTicketAndSearch(@Param("ticket") SupportTicket ticket, @Param("search") String search, Pageable pageable);
    
    @Query("SELECT c FROM TicketComment c WHERE c.user = :user AND (c.comment LIKE %:search%) ORDER BY c.createdAt DESC")
    Page<TicketComment> findByUserAndSearch(@Param("user") User user, @Param("search") String search, Pageable pageable);
    
    @Query("SELECT c FROM TicketComment c WHERE c.ticket = :ticket AND c.user = :user ORDER BY c.createdAt DESC")
    List<TicketComment> findByTicketAndUser(@Param("ticket") SupportTicket ticket, @Param("user") User user);
    
    @Query("SELECT c FROM TicketComment c WHERE c.ticket = :ticket AND c.user = :user AND c.isInternal = :isInternal ORDER BY c.createdAt DESC")
    List<TicketComment> findByTicketAndUserAndIsInternal(@Param("ticket") SupportTicket ticket, @Param("user") User user, @Param("isInternal") Boolean isInternal);
    
    @Query("SELECT c FROM TicketComment c WHERE c.createdAt >= :since ORDER BY c.createdAt DESC")
    List<TicketComment> findByCreatedAtSince(@Param("since") LocalDateTime since);
    
    @Query("SELECT c FROM TicketComment c WHERE c.createdAt BETWEEN :startDate AND :endDate ORDER BY c.createdAt DESC")
    List<TicketComment> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(c) FROM TicketComment c WHERE c.createdAt >= :since")
    Long countByCreatedAtSince(@Param("since") LocalDateTime since);
    
    @Query("SELECT COUNT(c) FROM TicketComment c WHERE c.createdAt BETWEEN :startDate AND :endDate")
    Long countByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT c FROM TicketComment c WHERE c.ticket IN :tickets ORDER BY c.createdAt DESC")
    List<TicketComment> findByTicketIn(@Param("tickets") List<SupportTicket> tickets);
    
    @Query("SELECT c FROM TicketComment c WHERE c.user IN :users ORDER BY c.createdAt DESC")
    List<TicketComment> findByUserIn(@Param("users") List<User> users);
    
    @Query("SELECT c FROM TicketComment c WHERE c.ticket = :ticket AND c.createdAt = (SELECT MAX(c2.createdAt) FROM TicketComment c2 WHERE c2.ticket = :ticket)")
    TicketComment findLatestCommentByTicket(@Param("ticket") SupportTicket ticket);
    
    @Query("SELECT c FROM TicketComment c WHERE c.ticket = :ticket AND c.user = :user AND c.createdAt = (SELECT MAX(c2.createdAt) FROM TicketComment c2 WHERE c2.ticket = :ticket AND c2.user = :user)")
    TicketComment findLatestCommentByTicketAndUser(@Param("ticket") SupportTicket ticket, @Param("user") User user);
}

