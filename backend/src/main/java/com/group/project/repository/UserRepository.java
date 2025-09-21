package com.group.project.repository;

import com.group.project.model.Role;
import com.group.project.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByUsernameOrEmail(String username, String email);
    
    List<User> findByRole(Role role);
    
    List<User> findByRoleAndActiveTrue(Role role);
    
    Page<User> findByRoleAndActiveTrue(Role role, Pageable pageable);
    
    List<User> findByActiveTrue();
    
    Page<User> findByActiveTrue(Pageable pageable);
    
    @Query("SELECT u FROM User u WHERE u.active = true AND (u.firstName LIKE %:search% OR u.lastName LIKE %:search% OR u.email LIKE %:search% OR u.username LIKE %:search%)")
    Page<User> findByActiveTrueAndSearch(@Param("search") String search, Pageable pageable);
    
    @Query("SELECT u FROM User u WHERE u.role = :role AND u.active = true AND (u.firstName LIKE %:search% OR u.lastName LIKE %:search% OR u.email LIKE %:search% OR u.username LIKE %:search%)")
    Page<User> findByRoleAndActiveTrueAndSearch(@Param("role") Role role, @Param("search") String search, Pageable pageable);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role AND u.active = true")
    Long countByRoleAndActiveTrue(@Param("role") Role role);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.active = true")
    Long countByActiveTrue();
    
    @Query("SELECT u FROM User u WHERE u.lastLogin >= :since AND u.active = true")
    List<User> findActiveUsersWithRecentLogin(@Param("since") LocalDateTime since);
    
    @Query("SELECT u FROM User u WHERE u.lastLogin IS NULL AND u.active = true")
    List<User> findActiveUsersNeverLoggedIn();
    
    @Query("SELECT u FROM User u WHERE u.createdAt >= :since AND u.active = true")
    List<User> findActiveUsersCreatedSince(@Param("since") LocalDateTime since);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    boolean existsByUsernameAndIdNot(String username, Long id);
    
    boolean existsByEmailAndIdNot(String email, Long id);
}

