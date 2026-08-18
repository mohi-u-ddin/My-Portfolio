package com.mohiudding.portfolio_Backend.service.impl;

import com.mohiudding.portfolio_Backend.dto.LoginRequest;
import com.mohiudding.portfolio_Backend.exception.BadRequestException;
import com.mohiudding.portfolio_Backend.exception.ResourceNotFoundException;
import com.mohiudding.portfolio_Backend.model.User;
import com.mohiudding.portfolio_Backend.repository.UserRepository;
import com.mohiudding.portfolio_Backend.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public User authenticate(LoginRequest loginRequest) {
        log.info("Authenticating user with email: {}", loginRequest.getEmail());

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            log.warn("Password mismatch for email: {}", loginRequest.getEmail());
            throw new BadRequestException("Invalid email or password");
        }

        log.info("User authenticated successfully: {}", user.getEmail());
        return user;
    }

    @Override
    @Transactional(readOnly = true)
    public User getAdminUser() {
        return userRepository.findAll().stream()
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    @Transactional
    public User updateAdmin(String name, String email) {
        User admin = getAdminUser();

        // If email is changed, ensure the new email is not already taken
        if (!admin.getEmail().equalsIgnoreCase(email) && userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email '" + email + "' is already in use");
        }

        admin.setName(name);
        admin.setEmail(email);

        log.info("Updating admin profile: name='{}', email='{}'", name, email);
        return userRepository.save(admin);
    }

    @Override
    @Transactional
    public User changePassword(String oldPassword, String newPassword) {
        User admin = getAdminUser();

        if (!passwordEncoder.matches(oldPassword, admin.getPassword())) {
            log.warn("Failed password change attempt: current password incorrect for user ID {}", admin.getId());
            throw new BadRequestException("Current password does not match");
        }

        if (passwordEncoder.matches(newPassword, admin.getPassword())) {
            throw new BadRequestException("New password cannot be the same as the old password");
        }

        admin.setPassword(passwordEncoder.encode(newPassword));
        log.info("Password successfully changed for user ID {}", admin.getId());
        return userRepository.save(admin);
    }
}
