package com.mohiudding.portfolio_Backend.service.impl;

import com.mohiudding.portfolio_Backend.dto.SkillDto;
import com.mohiudding.portfolio_Backend.exception.BadRequestException;
import com.mohiudding.portfolio_Backend.exception.ResourceNotFoundException;
import com.mohiudding.portfolio_Backend.model.Skill;
import com.mohiudding.portfolio_Backend.repository.SkillRepository;
import com.mohiudding.portfolio_Backend.service.SkillService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class SkillServiceImpl implements SkillService {

    private final SkillRepository skillRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Skill> getAllSkills() {
        log.info("Fetching all skills");
        List<Skill> skills = skillRepository.findAllByOrderByIdAsc();
        if (skills.isEmpty()) {
            return skillRepository.findAll();
        }
        return skills;
    }

    @Override
    @Transactional(readOnly = true)
    public Skill getSkillById(Long id) {
        log.info("Fetching skill with id: {}", id);
        return skillRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Skill not found with id: {}", id);
                    return new ResourceNotFoundException("Skill", "id", id);
                });
    }

    @Override
    @Transactional(readOnly = true)
    public List<Skill> getSkillsByCategory(String category) {
        if (category == null || category.trim().isEmpty()) {
            throw new BadRequestException("Category must not be empty");
        }
        log.info("Fetching skills by category: {}", category.trim());
        return skillRepository.findByCategoryIgnoreCase(category.trim());
    }

    @Override
    @Transactional
    public Skill createSkill(SkillDto skillDto) {
        if (skillDto == null) {
            log.warn("Skill creation failed: skillDto is null");
            throw new BadRequestException("Skill data must not be null");
        }
        if (skillDto.getName() == null || skillDto.getName().trim().isEmpty()) {
            log.warn("Skill creation failed: name is required");
            throw new BadRequestException("Skill name is required");
        }
        if (skillDto.getCategory() == null || skillDto.getCategory().trim().isEmpty()) {
            log.warn("Skill creation failed: category is required");
            throw new BadRequestException("Skill category is required");
        }

        log.info("Creating skill: {}", skillDto.getName().trim());
        Skill skill = Skill.builder()
                .name(skillDto.getName().trim())
                .category(skillDto.getCategory().trim())
                .icon(skillDto.getIcon() != null ? skillDto.getIcon().trim().toLowerCase() : "")
                .level(skillDto.getLevel() != null ? skillDto.getLevel().trim() : "")
                .yearsOfExperience(skillDto.getYearsOfExperience())
                .build();

        Skill saved = skillRepository.save(skill);
        log.info("Skill created successfully with id: {}", saved.getId());
        return saved;
    }

    @Override
    @Transactional
    public Skill updateSkill(Long id, SkillDto skillDto) {
        if (skillDto == null) {
            log.warn("Skill update failed for id {}: skillDto is null", id);
            throw new BadRequestException("Skill data must not be null");
        }

        log.info("Updating skill with id: {}", id);
        Skill existingSkill = getSkillById(id);

        if (skillDto.getName() != null && !skillDto.getName().trim().isEmpty()) {
            existingSkill.setName(skillDto.getName().trim());
        }
        if (skillDto.getCategory() != null && !skillDto.getCategory().trim().isEmpty()) {
            existingSkill.setCategory(skillDto.getCategory().trim());
        }
        if (skillDto.getIcon() != null) {
            existingSkill.setIcon(skillDto.getIcon().trim().toLowerCase());
        }
        if (skillDto.getLevel() != null) {
            existingSkill.setLevel(skillDto.getLevel().trim());
        }
        if (skillDto.getYearsOfExperience() != null) {
            existingSkill.setYearsOfExperience(skillDto.getYearsOfExperience());
        }

        Skill updated = skillRepository.save(existingSkill);
        log.info("Skill updated successfully with id: {}", updated.getId());
        return updated;
    }

    @Override
    @Transactional
    public void deleteSkill(Long id) {
        log.info("Deleting skill with id: {}", id);
        Skill existingSkill = getSkillById(id);
        skillRepository.delete(existingSkill);
        log.info("Skill deleted successfully with id: {}", id);
    }
}
