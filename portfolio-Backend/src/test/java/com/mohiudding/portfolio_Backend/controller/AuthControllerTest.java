package com.mohiudding.portfolio_Backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mohiudding.portfolio_Backend.dto.LoginRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("POST /api/auth/login should return 200 with JWT token and user info")
    void testLoginSuccess() throws Exception {
        LoginRequest request = LoginRequest.builder()
                .email("admin@mohiuddin.dev")
                .password("admin123")
                .build();

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.user.email", is("admin@mohiuddin.dev")))
                .andExpect(jsonPath("$.user.name", is("Mohi Ud Din")))
                .andExpect(jsonPath("$.user.role", is("admin")));
    }

    @Test
    @DisplayName("POST /api/auth/login should return 400 when invalid credentials")
    void testLoginInvalidCredentials() throws Exception {
        LoginRequest request = LoginRequest.builder()
                .email("admin@mohiuddin.dev")
                .password("wrongpassword")
                .build();

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.message", containsString("Invalid email or password")));
    }

    @Test
    @DisplayName("POST /api/auth/logout should return 204 No Content")
    void testLogout() throws Exception {
        mockMvc.perform(post("/api/auth/logout")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("GET /api/auth/me should return admin user profile")
    void testGetCurrentUser() throws Exception {
        mockMvc.perform(get("/api/auth/me")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email", is("admin@mohiuddin.dev")))
                .andExpect(jsonPath("$.name", is("Mohi Ud Din")));
    }
}
