package com.group.project.config;

import com.group.project.model.Role;
import com.group.project.model.User;
import com.group.project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create default admin user if it doesn't exist
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@healthcare.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setPhone("1234567890");
            admin.setRole(Role.ADMIN);
            admin.setActive(true);
            admin.setCreatedAt(LocalDateTime.now());
            admin.setUpdatedAt(LocalDateTime.now());
            
            userRepository.save(admin);
            System.out.println("Default admin user created: admin/admin123");
        }

        // Create default customer user if it doesn't exist
        if (!userRepository.existsByUsername("customer")) {
            User customer = new User();
            customer.setUsername("customer");
            customer.setEmail("customer@healthcare.com");
            customer.setPassword(passwordEncoder.encode("customer123"));
            customer.setFirstName("John");
            customer.setLastName("Doe");
            customer.setPhone("0987654321");
            customer.setRole(Role.CUSTOMER);
            customer.setActive(true);
            customer.setCreatedAt(LocalDateTime.now());
            customer.setUpdatedAt(LocalDateTime.now());
            
            userRepository.save(customer);
            System.out.println("Default customer user created: customer/customer123");
        }
    }
}

