package com.group.project.repository;

import com.group.project.model.LogCategory;
import com.group.project.model.LogLevel;
import com.group.project.model.SystemLog;
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
public interface SystemLogRepository extends JpaRepository<SystemLog, Long> {
    
    List<SystemLog> findByLevel(LogLevel level);
    
    List<SystemLog> findByCategory(LogCategory category);
    
    List<SystemLog> findByUser(User user);
    
    List<SystemLog> findByLevelAndCategory(LogLevel level, LogCategory category);
    
    List<SystemLog> findByLevelAndUser(LogLevel level, User user);
    
    List<SystemLog> findByCategoryAndUser(LogCategory category, User user);
    
    List<SystemLog> findByLevelAndCategoryAndUser(LogLevel level, LogCategory category, User user);
    
    Page<SystemLog> findByLevelOrderByCreatedAtDesc(LogLevel level, Pageable pageable);
    
    Page<SystemLog> findByCategoryOrderByCreatedAtDesc(LogCategory category, Pageable pageable);
    
    Page<SystemLog> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    
    Page<SystemLog> findByLevelAndCategoryOrderByCreatedAtDesc(LogLevel level, LogCategory category, Pageable pageable);
    
    Page<SystemLog> findByLevelAndUserOrderByCreatedAtDesc(LogLevel level, User user, Pageable pageable);
    
    Page<SystemLog> findByCategoryAndUserOrderByCreatedAtDesc(LogCategory category, User user, Pageable pageable);
    
    Page<SystemLog> findByLevelAndCategoryAndUserOrderByCreatedAtDesc(LogLevel level, LogCategory category, User user, Pageable pageable);
    
    @Query("SELECT l FROM SystemLog l WHERE l.createdAt >= :since ORDER BY l.createdAt DESC")
    List<SystemLog> findByCreatedAtSince(@Param("since") LocalDateTime since);
    
    @Query("SELECT l FROM SystemLog l WHERE l.createdAt BETWEEN :startDate AND :endDate ORDER BY l.createdAt DESC")
    List<SystemLog> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT l FROM SystemLog l WHERE l.level IN :levels ORDER BY l.createdAt DESC")
    Page<SystemLog> findByLevelIn(@Param("levels") List<LogLevel> levels, Pageable pageable);
    
    @Query("SELECT l FROM SystemLog l WHERE l.category IN :categories ORDER BY l.createdAt DESC")
    Page<SystemLog> findByCategoryIn(@Param("categories") List<LogCategory> categories, Pageable pageable);
    
    @Query("SELECT l FROM SystemLog l WHERE l.level IN :levels AND l.category IN :categories ORDER BY l.createdAt DESC")
    Page<SystemLog> findByLevelInAndCategoryIn(@Param("levels") List<LogLevel> levels, @Param("categories") List<LogCategory> categories, Pageable pageable);
    
    @Query("SELECT COUNT(l) FROM SystemLog l WHERE l.level = :level")
    Long countByLevel(@Param("level") LogLevel level);
    
    @Query("SELECT COUNT(l) FROM SystemLog l WHERE l.category = :category")
    Long countByCategory(@Param("category") LogCategory category);
    
    @Query("SELECT COUNT(l) FROM SystemLog l WHERE l.level = :level AND l.category = :category")
    Long countByLevelAndCategory(@Param("level") LogLevel level, @Param("category") LogCategory category);
    
    @Query("SELECT COUNT(l) FROM SystemLog l WHERE l.createdAt >= :since")
    Long countByCreatedAtSince(@Param("since") LocalDateTime since);
    
    @Query("SELECT COUNT(l) FROM SystemLog l WHERE l.createdAt BETWEEN :startDate AND :endDate")
    Long countByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(l) FROM SystemLog l WHERE l.level IN :levels")
    Long countByLevelIn(@Param("levels") List<LogLevel> levels);
    
    @Query("SELECT COUNT(l) FROM SystemLog l WHERE l.category IN :categories")
    Long countByCategoryIn(@Param("categories") List<LogCategory> categories);
    
    @Query("SELECT COUNT(l) FROM SystemLog l WHERE l.level IN :levels AND l.category IN :categories")
    Long countByLevelInAndCategoryIn(@Param("levels") List<LogLevel> levels, @Param("categories") List<LogCategory> categories);
    
    @Query("SELECT l FROM SystemLog l WHERE l.archived = false ORDER BY l.createdAt DESC")
    Page<SystemLog> findUnarchivedOrderByCreatedAtDesc(Pageable pageable);
    
    @Query("SELECT l FROM SystemLog l WHERE l.archived = true ORDER BY l.createdAt DESC")
    Page<SystemLog> findArchivedOrderByCreatedAtDesc(Pageable pageable);
    
    @Query("SELECT l FROM SystemLog l WHERE l.archived = false AND l.level IN :levels ORDER BY l.createdAt DESC")
    Page<SystemLog> findUnarchivedByLevelIn(@Param("levels") List<LogLevel> levels, Pageable pageable);
    
    @Query("SELECT l FROM SystemLog l WHERE l.archived = false AND l.category IN :categories ORDER BY l.createdAt DESC")
    Page<SystemLog> findUnarchivedByCategoryIn(@Param("categories") List<LogCategory> categories, Pageable pageable);
    
    @Query("SELECT l FROM SystemLog l WHERE l.archived = false AND l.level IN :levels AND l.category IN :categories ORDER BY l.createdAt DESC")
    Page<SystemLog> findUnarchivedByLevelInAndCategoryIn(@Param("levels") List<LogLevel> levels, @Param("categories") List<LogCategory> categories, Pageable pageable);
    
    @Modifying
    @Query("UPDATE SystemLog l SET l.archived = true, l.archivedAt = :archivedAt WHERE l.createdAt <= :beforeDate AND l.archived = false")
    int archiveLogsOlderThan(@Param("beforeDate") LocalDateTime beforeDate, @Param("archivedAt") LocalDateTime archivedAt);
    
    @Modifying
    @Query("UPDATE SystemLog l SET l.archived = true, l.archivedAt = :archivedAt WHERE l.id IN :ids")
    int archiveLogsByIds(@Param("ids") List<Long> ids, @Param("archivedAt") LocalDateTime archivedAt);
    
    @Modifying
    @Query("DELETE FROM SystemLog l WHERE l.archived = true AND l.archivedAt <= :beforeDate")
    int deleteArchivedLogsOlderThan(@Param("beforeDate") LocalDateTime beforeDate);
    
    @Query("SELECT l FROM SystemLog l WHERE (l.message LIKE %:search% OR l.details LIKE %:search%) ORDER BY l.createdAt DESC")
    Page<SystemLog> findBySearch(@Param("search") String search, Pageable pageable);
    
    @Query("SELECT l FROM SystemLog l WHERE l.archived = false AND (l.message LIKE %:search% OR l.details LIKE %:search%) ORDER BY l.createdAt DESC")
    Page<SystemLog> findUnarchivedBySearch(@Param("search") String search, Pageable pageable);
    
    @Query("SELECT l FROM SystemLog l WHERE l.ipAddress = :ipAddress ORDER BY l.createdAt DESC")
    Page<SystemLog> findByIpAddress(@Param("ipAddress") String ipAddress, Pageable pageable);
    
    @Query("SELECT l FROM SystemLog l WHERE l.sessionId = :sessionId ORDER BY l.createdAt DESC")
    Page<SystemLog> findBySessionId(@Param("sessionId") String sessionId, Pageable pageable);
    
    @Query("SELECT l FROM SystemLog l WHERE l.user = :user AND l.ipAddress = :ipAddress ORDER BY l.createdAt DESC")
    Page<SystemLog> findByUserAndIpAddress(@Param("user") User user, @Param("ipAddress") String ipAddress, Pageable pageable);
}

