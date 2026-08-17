package com.mohiudding.portfolio_Backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mohiudding.portfolio_Backend.dto.SkillDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class SkillControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("GET /api/skills should return all seeded skills")
    void testGetAllSkills() throws Exception {
        mockMvc.perform(get("/api/skills")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", not(empty())))
                .andExpect(jsonPath("$[0].name", notNullValue()));
    }

    @Test
    @DisplayName("POST /api/skills should create a new skill")
    void testCreateSkill() throws Exception {
        SkillDto newSkill = SkillDto.builder()
                .name("GraphQL")
                .category("Backend")
                .icon("graphql")
                .level("Intermediate")
                .yearsOfExperience(1)
                .build();

        mockMvc.perform(post("/api/skills")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newSkill)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.name", is("GraphQL")))
                .andExpect(jsonPath("$.category", is("Backend")));
    }

    @Test
    @DisplayName("GET /api/skills/{id} should return 404 for non-existent skill")
    void testGetSkillNotFound() throws Exception {
        mockMvc.perform(get("/api/skills/99999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status", is(404)))
                .andExpect(jsonPath("$.message", containsString("Skill not found")));
    }
}
