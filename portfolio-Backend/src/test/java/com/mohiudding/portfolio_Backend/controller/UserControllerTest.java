package com.mohiudding.portfolio_Backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mohiudding.portfolio_Backend.dto.LoginRequest;
import com.mohiudding.portfolio_Backend.dto.PasswordChangeRequest;
import com.mohiudding.portfolio_Backend.dto.UpdateProfileRequest;
import com.mohiudding.portfolio_Backend.model.User;
import com.mohiudding.portfolio_Backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        User admin = userRepository.findByEmail("admin@mohiuddin.dev")
                .orElseGet(() -> User.builder().email("admin@mohiuddin.dev").build());
        admin.setName("Mohi Ud Din");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole("admin");
        userRepository.save(admin);
    }

    @Test
    @org.springframework.security.test.context.support.WithMockUser(roles = "ADMIN")
    @DisplayName("GET /api/users/profile should return the seeded admin profile")
    void testGetAdminProfile() throws Exception {
        mockMvc.perform(get("/api/users/profile")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.name", is("Mohi Ud Din")))
                .andExpect(jsonPath("$.email", is("admin@mohiuddin.dev")))
                .andExpect(jsonPath("$.role", is("admin")))
                .andExpect(jsonPath("$.password").doesNotExist());
    }

    @Test
    @org.springframework.security.test.context.support.WithMockUser(roles = "ADMIN")
    @DisplayName("POST /api/users/authenticate should succeed with correct credentials")
    void testAuthenticateSuccess() throws Exception {
        LoginRequest request = LoginRequest.builder()
                .email("admin@mohiuddin.dev")
                .password("admin123")
                .build();

        mockMvc.perform(post("/api/users/authenticate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email", is("admin@mohiuddin.dev")))
                .andExpect(jsonPath("$.name", is("Mohi Ud Din")));
    }

    @Test
    @org.springframework.security.test.context.support.WithMockUser(roles = "ADMIN")
    @DisplayName("POST /api/users/authenticate should return 400 for incorrect password")
    void testAuthenticateFailure() throws Exception {
        LoginRequest request = LoginRequest.builder()
                .email("admin@mohiuddin.dev")
                .password("wrongpassword")
                .build();

        mockMvc.perform(post("/api/users/authenticate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.message", containsString("Invalid email or password")));
    }

    @Test
    @org.springframework.security.test.context.support.WithMockUser(roles = "ADMIN")
    @DisplayName("PUT /api/users/profile should update admin name and email")
    void testUpdateProfile() throws Exception {
        UpdateProfileRequest request = UpdateProfileRequest.builder()
                .name("Mohi Ud Din Updated")
                .email("admin@mohiuddin.dev")
                .build();

        mockMvc.perform(put("/api/users/profile")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Mohi Ud Din Updated")))
                .andExpect(jsonPath("$.email", is("admin@mohiuddin.dev")));
    }

    @Test
    @org.springframework.security.test.context.support.WithMockUser(roles = "ADMIN")
    @DisplayName("PUT /api/users/password should reject if current password is wrong")
    void testChangePasswordWrongCurrent() throws Exception {
        PasswordChangeRequest request = PasswordChangeRequest.builder()
                .oldPassword("incorrectPassword")
                .newPassword("newAdmin123")
                .build();

        mockMvc.perform(put("/api/users/password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.message", containsString("Current password does not match")));
    }
}
