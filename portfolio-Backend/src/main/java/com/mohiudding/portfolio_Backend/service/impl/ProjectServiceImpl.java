package com.mohiudding.portfolio_Backend.service.impl;

import com.mohiudding.portfolio_Backend.dto.ProjectDto;
import com.mohiudding.portfolio_Backend.exception.BadRequestException;
import com.mohiudding.portfolio_Backend.exception.ResourceNotFoundException;
import com.mohiudding.portfolio_Backend.model.Project;
import com.mohiudding.portfolio_Backend.repository.ProjectRepository;
import com.mohiudding.portfolio_Backend.service.ProjectService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Project> getAllProjects() {
        log.info("Fetching all projects");
        return projectRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Project> getFeaturedProjects() {
        log.info("Fetching featured projects");
        return projectRepository.findByFeaturedTrue();
    }

    @Override
    @Transactional(readOnly = true)
    public Project getProjectById(Long id) {
        log.info("Fetching project with id: {}", id);
        return projectRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Project not found with id: {}", id);
                    return new ResourceNotFoundException("Project not found with id: " + id);
                });
    }

    @Override
    @Transactional
    public Project createProject(ProjectDto projectDto) {
        if (projectDto == null) {
            log.warn("Project creation failed: projectDto is null");
            throw new BadRequestException("Project data must not be null");
        }

        if (projectDto.getTitle() == null || projectDto.getTitle().trim().isEmpty()) {
            log.warn("Project creation failed: title is required");
            throw new BadRequestException("Project title is required");
        }

        if (projectDto.getDescription() == null || projectDto.getDescription().trim().isEmpty()) {
            log.warn("Project creation failed: description is required");
            throw new BadRequestException("Project description is required");
        }

        log.info("Creating project with title: {}", projectDto.getTitle().trim());
        Project project = Project.builder()
                .title(projectDto.getTitle().trim())
                .description(projectDto.getDescription().trim())
                .image(projectDto.getImage() != null ? projectDto.getImage().trim() : null)
                .technologies(projectDto.getTechnologies() != null ? new ArrayList<>(projectDto.getTechnologies()) : new ArrayList<>())
                .githubUrl(projectDto.getGithubUrl() != null ? projectDto.getGithubUrl().trim() : null)
                .liveUrl(projectDto.getLiveUrl() != null ? projectDto.getLiveUrl().trim() : null)
                .featured(Boolean.TRUE.equals(projectDto.getFeatured()))
                .date(projectDto.getDate() != null ? projectDto.getDate().trim() : null)
                .build();

        Project savedProject = projectRepository.save(project);
        log.info("Project created successfully with id: {}", savedProject.getId());
        return savedProject;
    }

    @Override
    @Transactional
    public Project updateProject(Long id, ProjectDto projectDto) {
        if (projectDto == null) {
            log.warn("Project update failed for id {}: projectDto is null", id);
            throw new BadRequestException("Project data must not be null");
        }

        log.info("Updating project with id: {}", id);
        Project existingProject = projectRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Project update failed: project not found with id: {}", id);
                    return new ResourceNotFoundException("Project not found with id: " + id);
                });

        if (projectDto.getTitle() != null && !projectDto.getTitle().trim().isEmpty()) {
            existingProject.setTitle(projectDto.getTitle().trim());
        }
        if (projectDto.getDescription() != null && !projectDto.getDescription().trim().isEmpty()) {
            existingProject.setDescription(projectDto.getDescription().trim());
        }
        if (projectDto.getImage() != null) {
            existingProject.setImage(projectDto.getImage().trim());
        }
        if (projectDto.getTechnologies() != null) {
            existingProject.setTechnologies(new ArrayList<>(projectDto.getTechnologies()));
        }
        if (projectDto.getGithubUrl() != null) {
            existingProject.setGithubUrl(projectDto.getGithubUrl().trim());
        }
        if (projectDto.getLiveUrl() != null) {
            existingProject.setLiveUrl(projectDto.getLiveUrl().trim());
        }
        if (projectDto.getFeatured() != null) {
            existingProject.setFeatured(projectDto.getFeatured());
        }
        if (projectDto.getDate() != null) {
            existingProject.setDate(projectDto.getDate().trim());
        }

        Project updatedProject = projectRepository.save(existingProject);
        log.info("Project updated successfully with id: {}", updatedProject.getId());
        return updatedProject;
    }

    @Override
    @Transactional
    public void deleteProject(Long id) {
        log.info("Deleting project with id: {}", id);
        Project existingProject = projectRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Project deletion failed: project not found with id: {}", id);
                    return new ResourceNotFoundException("Project not found with id: " + id);
                });

        projectRepository.delete(existingProject);
        log.info("Project deleted successfully with id: {}", id);
    }
}
