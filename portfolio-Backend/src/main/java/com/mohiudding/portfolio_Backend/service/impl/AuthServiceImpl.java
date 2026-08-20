package com.mohiudding.portfolio_Backend.service.impl;

import com.mohiudding.portfolio_Backend.dto.LoginRequest;
import com.mohiudding.portfolio_Backend.dto.LoginResponse;
import com.mohiudding.portfolio_Backend.model.User;
import com.mohiudding.portfolio_Backend.security.JwtService;
import com.mohiudding.portfolio_Backend.service.AuthService;
import com.mohiudding.portfolio_Backend.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserService userService;
    private final JwtService jwtService;

    @Override
    public LoginResponse login(LoginRequest loginRequest) {
        User authenticatedUser = userService.authenticate(loginRequest);

        String role = authenticatedUser.getRole() != null ? authenticatedUser.getRole() : "ADMIN";
        String token = jwtService.generateToken(authenticatedUser.getEmail(), role);

        log.info("Generated JWT token for user: {}", authenticatedUser.getEmail());

        return LoginResponse.builder()
                .token(token)
                .user(LoginResponse.UserDto.builder()
                        .id(authenticatedUser.getId())
                        .name(authenticatedUser.getName())
                        .email(authenticatedUser.getEmail())
                        .role(authenticatedUser.getRole() != null ? authenticatedUser.getRole().toLowerCase() : "admin")
                        .build())
                .build();
    }

    @Override
    public void logout() {
        SecurityContextHolder.clearContext();
        log.info("User logged out successfully.");
    }

    @Override
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User user) {
            return user;
        }
        return userService.getAdminUser();
    }
}
