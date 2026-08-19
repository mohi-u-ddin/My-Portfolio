package com.mohiudding.portfolio_Backend.repository;

import com.mohiudding.portfolio_Backend.model.Education;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EducationRepository extends JpaRepository<Education, Long> {

    List<Education> findAllByOrderByStartDateDesc();
}
