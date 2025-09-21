package com.group.project.service;

import com.group.project.model.Role;
import com.group.project.model.User;
import com.group.project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService implements UserDetailsService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        return user;
    }
    
    public User createUser(User user) {
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }
    
    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setEmail(userDetails.getEmail());
        user.setPhone(userDetails.getPhone());
        user.setRole(userDetails.getRole());
        user.setActive(userDetails.getActive());
        user.setUpdatedAt(LocalDateTime.now());
        
        return userRepository.save(user);
    }
    
    public User updatePassword(Long id, String encodedPassword) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        user.setPassword(encodedPassword);
        user.setUpdatedAt(LocalDateTime.now());
        
        return userRepository.save(user);
    }
    
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        user.setActive(false);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }
    
    public void activateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        user.setActive(true);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }
    
    public void updateLastLogin(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
    }
    
    @Transactional(readOnly = true)
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    
    @Transactional(readOnly = true)
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    @Transactional(readOnly = true)
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    @Transactional(readOnly = true)
    public Optional<User> findByUsernameOrEmail(String username, String email) {
        return userRepository.findByUsernameOrEmail(username, email);
    }
    
    @Transactional(readOnly = true)
    public List<User> findByRole(Role role) {
        return userRepository.findByRoleAndActiveTrue(role);
    }
    
    @Transactional(readOnly = true)
    public Page<User> findByRole(Role role, Pageable pageable) {
        return userRepository.findByRoleAndActiveTrue(role, pageable);
    }
    
    @Transactional(readOnly = true)
    public List<User> findAllActive() {
        return userRepository.findByActiveTrue();
    }
    
    @Transactional(readOnly = true)
    public Page<User> findAllActive(Pageable pageable) {
        return userRepository.findByActiveTrue(pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<User> searchActiveUsers(String search, Pageable pageable) {
        return userRepository.findByActiveTrueAndSearch(search, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<User> searchUsersByRole(Role role, String search, Pageable pageable) {
        return userRepository.findByRoleAndActiveTrueAndSearch(role, search, pageable);
    }
    
    @Transactional(readOnly = true)
    public Long countByRole(Role role) {
        return userRepository.countByRoleAndActiveTrue(role);
    }
    
    @Transactional(readOnly = true)
    public Long countActiveUsers() {
        return userRepository.countByActiveTrue();
    }
    
    @Transactional(readOnly = true)
    public List<User> findUsersWithRecentLogin(LocalDateTime since) {
        return userRepository.findActiveUsersWithRecentLogin(since);
    }
    
    @Transactional(readOnly = true)
    public List<User> findUsersNeverLoggedIn() {
        return userRepository.findActiveUsersNeverLoggedIn();
    }
    
    @Transactional(readOnly = true)
    public List<User> findUsersCreatedSince(LocalDateTime since) {
        return userRepository.findActiveUsersCreatedSince(since);
    }
    
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }
    
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    
    public boolean existsByUsernameAndIdNot(String username, Long id) {
        return userRepository.existsByUsernameAndIdNot(username, id);
    }
    
    public boolean existsByEmailAndIdNot(String email, Long id) {
        return userRepository.existsByEmailAndIdNot(email, id);
    }
    
    public User save(User user) {
        return userRepository.save(user);
    }
}
