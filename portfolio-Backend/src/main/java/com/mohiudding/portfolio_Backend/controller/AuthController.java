package com.mohiudding.portfolio_Backend.controller;

import com.mohiudding.portfolio_Backend.dto.LoginRequest;
import com.mohiudding.portfolio_Backend.dto.LoginResponse;
import com.mohiudding.portfolio_Backend.model.User;
import com.mohiudding.portfolio_Backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AuthController {

    private final AuthService authService;

    // POST /api/auth/login - Authenticate admin & generate token
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    // POST /api/auth/logout - Invalidate session
    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        authService.logout();
        return ResponseEntity.noContent().build();
    }

    // GET /api/auth/me - Fetch currently authenticated user
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser() {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(user);
    }
}
