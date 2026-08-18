package com.mohiudding.portfolio_Backend.service.impl;

import com.mohiudding.portfolio_Backend.dto.LoginRequest;
import com.mohiudding.portfolio_Backend.dto.LoginResponse;
import com.mohiudding.portfolio_Backend.model.User;
import com.mohiudding.portfolio_Backend.service.AuthService;
import com.mohiudding.portfolio_Backend.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserService userService;

    @Override
    public LoginResponse login(LoginRequest loginRequest) {
        User authenticatedUser = userService.authenticate(loginRequest);

        // Generate session bearer token
        String token = "bearer-token-" + UUID.randomUUID().toString();

        log.info("Generated authentication token for user: {}", authenticatedUser.getEmail());

        return LoginResponse.builder()
                .token(token)
                .user(LoginResponse.UserDto.builder()
                        .id(authenticatedUser.getId())
                        .name(authenticatedUser.getName())
                        .email(authenticatedUser.getEmail())
                        .role(authenticatedUser.getRole())
                        .build())
                .build();
    }

    @Override
    public void logout() {
        log.info("User logged out successfully.");
    }

    @Override
    public User getCurrentUser() {
        return userService.getAdminUser();
    }
}
