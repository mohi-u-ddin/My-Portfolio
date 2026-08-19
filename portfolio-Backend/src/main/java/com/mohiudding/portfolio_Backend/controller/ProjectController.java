package com.mohiudding.portfolio_Backend.controller;

import com.mohiudding.portfolio_Backend.dto.ProjectDto;
import com.mohiudding.portfolio_Backend.model.Project;
import com.mohiudding.portfolio_Backend.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        List<Project> projects = projectService.getAllProjects();
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/featured")
    public ResponseEntity<List<Project>> getFeaturedProjects() {
        List<Project> featuredProjects = projectService.getFeaturedProjects();
        return ResponseEntity.ok(featuredProjects);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        Project project = projectService.getProjectById(id);
        return ResponseEntity.ok(project);
    }

    @PostMapping
    public ResponseEntity<Project> createProject(@Valid @RequestBody ProjectDto projectDto) {
        Project created = projectService.createProject(projectDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody ProjectDto projectDto
    ) {
        Project updated = projectService.updateProject(id, projectDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}
