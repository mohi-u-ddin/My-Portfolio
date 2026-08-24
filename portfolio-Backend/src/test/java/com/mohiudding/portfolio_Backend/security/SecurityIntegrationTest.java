package com.mohiudding.portfolio_Backend.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mohiudding.portfolio_Backend.dto.LoginRequest;
import com.mohiudding.portfolio_Backend.dto.SkillDto;
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
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class SecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    private String validAdminToken;

    @BeforeEach
    void setUp() {
        User admin = userRepository.findByEmail("admin@mohiuddin.dev")
                .orElseGet(() -> User.builder().email("admin@mohiuddin.dev").build());
        admin.setName("Mohi Ud Din");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole("ADMIN");
        userRepository.save(admin);

        validAdminToken = jwtService.generateToken("admin@mohiuddin.dev", "ADMIN");
    }

    @Test
    @DisplayName("1. Request public endpoint without JWT -> Should succeed (200 OK)")
    void testPublicEndpointWithoutJwt() throws Exception {
        mockMvc.perform(get("/api/portfolio")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/skills")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/projects")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("2. Request admin endpoint without JWT -> Should fail (401 Unauthorized)")
    void testAdminEndpointWithoutJwt() throws Exception {
        SkillDto newSkill = SkillDto.builder()
                .name("Docker")
                .category("Tools")
                .icon("docker")
                .level("Advanced")
                .yearsOfExperience(2)
                .build();

        mockMvc.perform(post("/api/skills")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newSkill)))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/contact/messages")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("3. Request admin endpoint with invalid JWT -> Should fail (401 Unauthorized)")
    void testAdminEndpointWithInvalidJwt() throws Exception {
        SkillDto newSkill = SkillDto.builder()
                .name("Kubernetes")
                .category("Tools")
                .icon("kubernetes")
                .level("Intermediate")
                .yearsOfExperience(1)
                .build();

        mockMvc.perform(post("/api/skills")
                        .header("Authorization", "Bearer invalid.jwt.token.string")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newSkill)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("4. Request admin endpoint with valid ADMIN JWT -> Should succeed (201 / 200)")
    void testAdminEndpointWithValidJwt() throws Exception {
        SkillDto newSkill = SkillDto.builder()
                .name("Redis")
                .category("Database")
                .icon("redis")
                .level("Advanced")
                .yearsOfExperience(2)
                .build();

        mockMvc.perform(post("/api/skills")
                        .header("Authorization", "Bearer " + validAdminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newSkill)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name", is("Redis")));

        mockMvc.perform(get("/api/contact/messages")
                        .header("Authorization", "Bearer " + validAdminToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("5. End-to-end admin login -> Receive JWT -> Use JWT to perform CRUD")
    void testEndToEndLoginAndAdminCrud() throws Exception {
        LoginRequest loginRequest = LoginRequest.builder()
                .email("admin@mohiuddin.dev")
                .password("admin123")
                .build();

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andReturn();

        String responseBody = loginResult.getResponse().getContentAsString();
        String token = objectMapper.readTree(responseBody).get("token").asText();

        SkillDto skillDto = SkillDto.builder()
                .name("Spring Cloud")
                .category("Backend")
                .icon("spring")
                .level("Advanced")
                .yearsOfExperience(3)
                .build();

        MvcResult createResult = mockMvc.perform(post("/api/skills")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(skillDto)))
                .andExpect(status().isCreated())
                .andReturn();

        long skillId = objectMapper.readTree(createResult.getResponse().getContentAsString()).get("id").asLong();

        skillDto.setName("Spring Cloud Microservices");
        mockMvc.perform(put("/api/skills/" + skillId)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(skillDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Spring Cloud Microservices")));

        mockMvc.perform(delete("/api/skills/" + skillId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());
    }
}
