package com.mohiudding.portfolio_Backend.service.impl;

import com.mohiudding.portfolio_Backend.dto.ExperienceDto;
import com.mohiudding.portfolio_Backend.exception.BadRequestException;
import com.mohiudding.portfolio_Backend.exception.ResourceNotFoundException;
import com.mohiudding.portfolio_Backend.model.Experience;
import com.mohiudding.portfolio_Backend.repository.ExperienceRepository;
import com.mohiudding.portfolio_Backend.service.ExperienceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExperienceServiceImpl implements ExperienceService {

    private final ExperienceRepository experienceRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Experience> getAllExperiences() {
        log.info("Fetching all experiences");
        return experienceRepository.findAllByOrderByStartDateDesc();
    }

    @Override
    @Transactional(readOnly = true)
    public Experience getExperienceById(Long id) {
        log.info("Fetching experience with id: {}", id);
        return experienceRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Experience not found with id: {}", id);
                    return new ResourceNotFoundException("Experience", "id", id);
                });
    }

    @Override
    @Transactional
    public Experience createExperience(ExperienceDto experienceDto) {
        if (experienceDto == null) {
            log.warn("Experience creation failed: experienceDto is null");
            throw new BadRequestException("Experience data must not be null");
        }

        if (experienceDto.getCompany() == null || experienceDto.getCompany().trim().isEmpty()) {
            log.warn("Experience creation failed: company is required");
            throw new BadRequestException("Company name is required");
        }

        if (experienceDto.getPosition() == null || experienceDto.getPosition().trim().isEmpty()) {
            log.warn("Experience creation failed: position is required");
            throw new BadRequestException("Position is required");
        }

        if (experienceDto.getStartDate() == null || experienceDto.getStartDate().trim().isEmpty()) {
            log.warn("Experience creation failed: startDate is required");
            throw new BadRequestException("Start date is required");
        }

        log.info("Creating new experience for company: {}", experienceDto.getCompany().trim());

        List<String> descriptions = experienceDto.getDescription() != null
                ? new ArrayList<>(experienceDto.getDescription())
                : new ArrayList<>();
        List<String> technologies = experienceDto.getTechnologies() != null
                ? new ArrayList<>(experienceDto.getTechnologies())
                : new ArrayList<>();

        Experience newExperience = Experience.builder()
                .company(experienceDto.getCompany().trim())
                .position(experienceDto.getPosition().trim())
                .location(experienceDto.getLocation() != null ? experienceDto.getLocation().trim() : null)
                .startDate(experienceDto.getStartDate().trim())
                .endDate(experienceDto.getEndDate() != null ? experienceDto.getEndDate().trim() : null)
                .description(descriptions)
                .technologies(technologies)
                .build();

        Experience saved = experienceRepository.save(newExperience);
        log.info("Experience created successfully with id: {}", saved.getId());
        return saved;
    }

    @Override
    @Transactional
    public Experience updateExperience(Long id, ExperienceDto experienceDto) {
        if (experienceDto == null) {
            log.warn("Experience update failed for id {}: experienceDto is null", id);
            throw new BadRequestException("Experience data must not be null");
        }

        log.info("Updating experience with id: {}", id);
        Experience existingExperience = experienceRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Experience not found with id: {}", id);
                    return new ResourceNotFoundException("Experience", "id", id);
                });

        if (experienceDto.getCompany() != null && !experienceDto.getCompany().trim().isEmpty()) {
            existingExperience.setCompany(experienceDto.getCompany().trim());
        }
        if (experienceDto.getPosition() != null && !experienceDto.getPosition().trim().isEmpty()) {
            existingExperience.setPosition(experienceDto.getPosition().trim());
        }
        if (experienceDto.getLocation() != null && !experienceDto.getLocation().trim().isEmpty()) {
            existingExperience.setLocation(experienceDto.getLocation().trim());
        }
        if (experienceDto.getStartDate() != null && !experienceDto.getStartDate().trim().isEmpty()) {
            existingExperience.setStartDate(experienceDto.getStartDate().trim());
        }
        if (experienceDto.getEndDate() != null && !experienceDto.getEndDate().trim().isEmpty()) {
            existingExperience.setEndDate(experienceDto.getEndDate().trim());
        }
        if (experienceDto.getDescription() != null) {
            existingExperience.setDescription(new ArrayList<>(experienceDto.getDescription()));
        }
        if (experienceDto.getTechnologies() != null) {
            existingExperience.setTechnologies(new ArrayList<>(experienceDto.getTechnologies()));
        }

        Experience updatedExperience = experienceRepository.save(existingExperience);
        log.info("Experience updated successfully with id: {}", updatedExperience.getId());
        return updatedExperience;
    }

    @Override
    @Transactional
    public void deleteExperience(Long id) {
        log.info("Deleting experience with id: {}", id);
        Experience existingExperience = experienceRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Experience deletion failed: experience not found with id: {}", id);
                    return new ResourceNotFoundException("Experience", "id", id);
                });

        experienceRepository.delete(existingExperience);
        log.info("Experience deleted successfully with id: {}", id);
    }
}
