package com.mohiudding.portfolio_Backend.repository;

import com.mohiudding.portfolio_Backend.model.Experience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExperienceRepository extends JpaRepository<Experience, Long> {

    List<Experience> findAllByOrderByStartDateDesc();
}
