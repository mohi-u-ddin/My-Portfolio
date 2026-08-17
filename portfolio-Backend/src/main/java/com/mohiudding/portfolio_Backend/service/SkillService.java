package com.mohiudding.portfolio_Backend.service;

import com.mohiudding.portfolio_Backend.dto.SkillDto;
import com.mohiudding.portfolio_Backend.model.Skill;

import java.util.List;

public interface SkillService {

    List<Skill> getAllSkills();

    Skill getSkillById(Long id);

    List<Skill> getSkillsByCategory(String category);

    Skill createSkill(SkillDto skillDto);

    Skill updateSkill(Long id, SkillDto skillDto);

    void deleteSkill(Long id);
}
