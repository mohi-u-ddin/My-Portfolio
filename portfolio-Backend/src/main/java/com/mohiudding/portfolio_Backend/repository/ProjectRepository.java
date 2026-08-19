package com.mohiudding.portfolio_Backend.repository;

import com.mohiudding.portfolio_Backend.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository  extends JpaRepository<Project, Long> {
    List<Project> findByFeaturedTrue();
    List<Project> findAllByOrderByCreatedAtDesc();
}
