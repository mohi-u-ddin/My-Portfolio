package com.mohiudding.portfolio_Backend.controller;

import com.mohiudding.portfolio_Backend.dto.ApiResponse;
import com.mohiudding.portfolio_Backend.dto.LoginRequest;
import com.mohiudding.portfolio_Backend.dto.PasswordChangeRequest;
import com.mohiudding.portfolio_Backend.dto.UpdateProfileRequest;
import com.mohiudding.portfolio_Backend.model.User;
import com.mohiudding.portfolio_Backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<User> getAdminProfile() {
        User admin = userService.getAdminUser();
        return ResponseEntity.ok(admin);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        User updated = userService.updateAdmin(request.getName(), request.getEmail());
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(@Valid @RequestBody PasswordChangeRequest request) {
        userService.changePassword(request.getOldPassword(), request.getNewPassword());
        return ResponseEntity.ok(ApiResponse.success("Password updated successfully"));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<User> authenticate(@Valid @RequestBody LoginRequest request) {
        User authenticated = userService.authenticate(request);
        return ResponseEntity.ok(authenticated);
    }
}
