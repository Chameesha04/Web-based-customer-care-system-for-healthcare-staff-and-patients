package com.group.project.repository;

import com.group.project.model.Notification;
import com.group.project.model.NotificationPriority;
import com.group.project.model.NotificationType;
import com.group.project.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    List<Notification> findByUser(User user);
    
    List<Notification> findByUserAndIsReadFalse(User user);
    
    List<Notification> findByUserAndIsReadTrue(User user);
    
    List<Notification> findByUserOrderByCreatedAtDesc(User user);
    
    List<Notification> findByUserAndType(User user, NotificationType type);
    
    List<Notification> findByUserAndPriority(User user, NotificationPriority priority);
    
    List<Notification> findByType(NotificationType type);
    
    List<Notification> findByPriority(NotificationPriority priority);
    
    Page<Notification> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    
    Page<Notification> findByUserAndIsReadFalseOrderByCreatedAtDesc(User user, Pageable pageable);
    
    Page<Notification> findByUserAndIsReadTrueOrderByCreatedAtDesc(User user, Pageable pageable);
    
    Page<Notification> findByUserAndTypeOrderByCreatedAtDesc(User user, NotificationType type, Pageable pageable);
    
    Page<Notification> findByUserAndPriorityOrderByCreatedAtDesc(User user, NotificationPriority priority, Pageable pageable);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user = :user AND n.isRead = false")
    Long countUnreadByUser(@Param("user") User user);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user = :user")
    Long countByUser(@Param("user") User user);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.type = :type")
    Long countByType(@Param("type") NotificationType type);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.priority = :priority")
    Long countByPriority(@Param("priority") NotificationPriority priority);
    
    @Query("SELECT n FROM Notification n WHERE n.user = :user AND n.createdAt >= :since ORDER BY n.createdAt DESC")
    List<Notification> findByUserAndCreatedAtSince(@Param("user") User user, @Param("since") LocalDateTime since);
    
    @Query("SELECT n FROM Notification n WHERE n.createdAt >= :since ORDER BY n.createdAt DESC")
    List<Notification> findByCreatedAtSince(@Param("since") LocalDateTime since);
    
    @Query("SELECT n FROM Notification n WHERE n.expiresAt IS NOT NULL AND n.expiresAt <= :now")
    List<Notification> findExpiredNotifications(@Param("now") LocalDateTime now);
    
    @Query("SELECT n FROM Notification n WHERE n.user = :user AND n.expiresAt IS NOT NULL AND n.expiresAt > :now ORDER BY n.createdAt DESC")
    List<Notification> findActiveByUser(@Param("user") User user, @Param("now") LocalDateTime now);
    
    @Query("SELECT n FROM Notification n WHERE n.expiresAt IS NOT NULL AND n.expiresAt > :now ORDER BY n.createdAt DESC")
    List<Notification> findActiveNotifications(@Param("now") LocalDateTime now);
    
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true, n.readAt = :readAt WHERE n.user = :user AND n.isRead = false")
    int markAllAsReadByUser(@Param("user") User user, @Param("readAt") LocalDateTime readAt);
    
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true, n.readAt = :readAt WHERE n.id = :id")
    int markAsRead(@Param("id") Long id, @Param("readAt") LocalDateTime readAt);
    
    @Modifying
    @Query("DELETE FROM Notification n WHERE n.expiresAt IS NOT NULL AND n.expiresAt <= :now")
    int deleteExpiredNotifications(@Param("now") LocalDateTime now);
    
    @Modifying
    @Query("DELETE FROM Notification n WHERE n.user = :user AND n.isRead = true AND n.readAt <= :beforeDate")
    int deleteReadNotificationsOlderThan(@Param("user") User user, @Param("beforeDate") LocalDateTime beforeDate);
    
    @Query("SELECT n FROM Notification n WHERE n.user = :user AND (n.title LIKE %:search% OR n.message LIKE %:search%) ORDER BY n.createdAt DESC")
    Page<Notification> findByUserAndSearch(@Param("user") User user, @Param("search") String search, Pageable pageable);
    
    @Query("SELECT n FROM Notification n WHERE (n.title LIKE %:search% OR n.message LIKE %:search%) ORDER BY n.createdAt DESC")
    Page<Notification> findBySearch(@Param("search") String search, Pageable pageable);
    
    @Query("SELECT n FROM Notification n WHERE n.user = :user AND n.type IN :types ORDER BY n.createdAt DESC")
    Page<Notification> findByUserAndTypeIn(@Param("user") User user, @Param("types") List<NotificationType> types, Pageable pageable);
    
    @Query("SELECT n FROM Notification n WHERE n.user = :user AND n.priority IN :priorities ORDER BY n.createdAt DESC")
    Page<Notification> findByUserAndPriorityIn(@Param("user") User user, @Param("priorities") List<NotificationPriority> priorities, Pageable pageable);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user = :user AND n.type = :type AND n.isRead = false")
    Long countUnreadByUserAndType(@Param("user") User user, @Param("type") NotificationType type);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user = :user AND n.priority = :priority AND n.isRead = false")
    Long countUnreadByUserAndPriority(@Param("user") User user, @Param("priority") NotificationPriority priority);
}

