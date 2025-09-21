package com.group.project.service;

import com.group.project.dto.*;
import com.group.project.model.Role;
import com.group.project.model.User;
import com.group.project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Transactional
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtService jwtService;
    
    @Value("${app.jwt.expiration:86400000}")
    private Long jwtExpiration;
    
    public LoginResponse login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        
        if (!user.getActive()) {
            throw new RuntimeException("Account is deactivated");
        }
        
        String token = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        String sessionId = UUID.randomUUID().toString();
        
        return new LoginResponse(
                token,
                refreshToken,
                sessionId,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole(),
                jwtExpiration
        );
    }
    
    public RegisterResponse register(RegisterRequest request) {
        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        user.setRole(request.getRole());
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        
        User savedUser = userRepository.save(user);
        
        return new RegisterResponse(
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getFirstName(),
                savedUser.getLastName(),
                savedUser.getRole(),
                "User registered successfully"
        );
    }
    
    public RefreshTokenResponse refreshToken(String refreshToken) {
        if (!jwtService.validateRefreshToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }
        
        String username = jwtService.getUsernameFromRefreshToken(refreshToken);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!user.getActive()) {
            throw new RuntimeException("Account is deactivated");
        }
        
        String newToken = jwtService.generateToken(user);
        String newRefreshToken = jwtService.generateRefreshToken(user);
        
        return new RefreshTokenResponse(newToken, newRefreshToken, jwtExpiration);
    }
    
    public void logout(Long userId) {
        // In a more sophisticated implementation, you might want to:
        // 1. Add the token to a blacklist
        // 2. Invalidate the refresh token
        // 3. Clear any session data
        
        // For now, we'll just log the logout
        // The JWT token will naturally expire
    }
    
    public void changePassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }
    
    public void initiatePasswordReset(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // In a real implementation, you would:
        // 1. Generate a password reset token
        // 2. Store it in the database with an expiration time
        // 3. Send an email with the reset link
        
        // For now, we'll just throw an exception indicating the feature is not implemented
        throw new RuntimeException("Password reset functionality not implemented yet");
    }
    
    public void resetPassword(String token, String newPassword) {
        // In a real implementation, you would:
        // 1. Validate the reset token
        // 2. Check if it's not expired
        // 3. Update the user's password
        // 4. Invalidate the reset token
        
        // For now, we'll just throw an exception indicating the feature is not implemented
        throw new RuntimeException("Password reset functionality not implemented yet");
    }
}

