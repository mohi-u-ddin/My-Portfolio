package com.mohiudding.portfolio_Backend.service.impl;

import com.mohiudding.portfolio_Backend.dto.SkillDto;
import com.mohiudding.portfolio_Backend.exception.ResourceNotFoundException;
import com.mohiudding.portfolio_Backend.model.Skill;
import com.mohiudding.portfolio_Backend.repository.SkillRepository;
import com.mohiudding.portfolio_Backend.service.SkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SkillServiceImpl implements SkillService {

    private final SkillRepository skillRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Skill getSkillById(Long id) {
        return skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill", "id", id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Skill> getSkillsByCategory(String category) {
        return skillRepository.findByCategoryIgnoreCase(category);
    }

    @Override
    @Transactional
    public Skill createSkill(SkillDto skillDto) {
        Skill skill = Skill.builder()
                .name(skillDto.getName().trim())
                .category(skillDto.getCategory().trim())
                .icon(skillDto.getIcon().trim().toLowerCase())
                .level(skillDto.getLevel().trim())
                .yearsOfExperience(skillDto.getYearsOfExperience())
                .build();

        return skillRepository.save(skill);
    }

    @Override
    @Transactional
    public Skill updateSkill(Long id, SkillDto skillDto) {
        Skill existingSkill = getSkillById(id);

        existingSkill.setName(skillDto.getName().trim());
        existingSkill.setCategory(skillDto.getCategory().trim());
        existingSkill.setIcon(skillDto.getIcon().trim().toLowerCase());
        existingSkill.setLevel(skillDto.getLevel().trim());
        existingSkill.setYearsOfExperience(skillDto.getYearsOfExperience());

        return skillRepository.save(existingSkill);
    }

    @Override
    @Transactional
    public void deleteSkill(Long id) {
        Skill existingSkill = getSkillById(id);
        skillRepository.delete(existingSkill);
    }
}
