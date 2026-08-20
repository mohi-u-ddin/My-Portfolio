package com.mohiudding.portfolio_Backend.controller;

import com.mohiudding.portfolio_Backend.dto.ExperienceDto;
import com.mohiudding.portfolio_Backend.model.Experience;
import com.mohiudding.portfolio_Backend.service.ExperienceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/experience")
@RequiredArgsConstructor
public class ExperienceController {

    private final ExperienceService experienceService;

    @GetMapping
    public ResponseEntity<List<Experience>> getAllExperiences() {
        List<Experience> experiences = experienceService.getAllExperiences();
        return ResponseEntity.ok(experiences);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Experience> getExperienceById(@PathVariable Long id) {
        Experience experience = experienceService.getExperienceById(id);
        return ResponseEntity.ok(experience);
    }

    @PostMapping
    public ResponseEntity<Experience> createExperience(@Valid @RequestBody ExperienceDto experienceDto) {
        Experience created = experienceService.createExperience(experienceDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Experience> updateExperience(
            @PathVariable Long id,
            @Valid @RequestBody ExperienceDto experienceDto
    ) {
        Experience updated = experienceService.updateExperience(id, experienceDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExperience(@PathVariable Long id) {
        experienceService.deleteExperience(id);
        return ResponseEntity.noContent().build();
    }
}
