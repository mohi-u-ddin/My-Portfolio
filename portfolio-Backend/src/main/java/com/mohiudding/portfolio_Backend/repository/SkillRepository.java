package com.mohiudding.portfolio_Backend.repository;

import com.mohiudding.portfolio_Backend.model.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {

    List<Skill> findByCategoryIgnoreCase(String category);

    List<Skill> findByNameContainingIgnoreCase(String name);

    List<Skill> findAllByOrderByIdAsc();
}
