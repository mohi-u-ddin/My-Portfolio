package com.mohiudding.portfolio_Backend.controller;

import com.mohiudding.portfolio_Backend.dto.EducationDto;
import com.mohiudding.portfolio_Backend.model.Education;
import com.mohiudding.portfolio_Backend.service.EducationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/education")
@RequiredArgsConstructor
public class EducationController {

    private final EducationService educationService;

    @GetMapping
    public ResponseEntity<List<Education>> getAllEducations() {
        List<Education> educations = educationService.getAllEducations();
        return ResponseEntity.ok(educations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Education> getEducationById(@PathVariable Long id) {
        Education education = educationService.getEducationById(id);
        return ResponseEntity.ok(education);
    }

    @PostMapping
    public ResponseEntity<Education> createEducation(@Valid @RequestBody EducationDto educationDto) {
        Education created = educationService.createEducation(educationDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Education> updateEducation(
            @PathVariable Long id,
            @Valid @RequestBody EducationDto educationDto
    ) {
        Education updated = educationService.updateEducation(id, educationDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEducation(@PathVariable Long id) {
        educationService.deleteEducation(id);
        return ResponseEntity.noContent().build();
    }
}
