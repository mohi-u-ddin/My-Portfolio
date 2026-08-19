package com.mohiudding.portfolio_Backend.service;


import com.mohiudding.portfolio_Backend.dto.ProjectDto;
import com.mohiudding.portfolio_Backend.model.Project;

import java.util.List;

public interface ProjectService {
    List<Project> getAllProjects();
    List<Project> getFeaturedProjects();
    Project getProjectById(Long id);
    Project createProject(ProjectDto projectDto);
    Project updateProject(Long id, ProjectDto projectDto);
    void deleteProject(Long id);
}
