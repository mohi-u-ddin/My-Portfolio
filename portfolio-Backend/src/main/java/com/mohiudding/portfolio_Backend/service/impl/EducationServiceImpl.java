package com.mohiudding.portfolio_Backend.service.impl;

import com.mohiudding.portfolio_Backend.dto.EducationDto;
import com.mohiudding.portfolio_Backend.exception.BadRequestException;
import com.mohiudding.portfolio_Backend.exception.ResourceNotFoundException;
import com.mohiudding.portfolio_Backend.model.Education;
import com.mohiudding.portfolio_Backend.repository.EducationRepository;
import com.mohiudding.portfolio_Backend.service.EducationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class EducationServiceImpl implements EducationService {

    private final EducationRepository educationRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Education> getAllEducations() {
        log.info("Fetching all educations sorted chronologically");
        List<Education> educations = educationRepository.findAllByOrderByStartDateDesc();
        if (educations.isEmpty()) {
            log.warn("No education records found");
            throw new ResourceNotFoundException("No education records found");
        }
        return educations;
    }

    @Override
    @Transactional(readOnly = true)
    public Education getEducationById(Long id) {
        log.info("Fetching education with id: {}", id);
        return educationRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Education not found with id: {}", id);
                    return new ResourceNotFoundException("Education", "id", id);
                });
    }

    @Override
    @Transactional
    public Education createEducation(EducationDto educationDto) {
        if (educationDto == null) {
            log.warn("Education creation failed: educationDto is null");
            throw new BadRequestException("Education data must not be null");
        }

        if (educationDto.getDegree() == null || educationDto.getDegree().trim().isEmpty()) {
            log.warn("Education creation failed: degree is required");
            throw new BadRequestException("Degree is required");
        }

        if (educationDto.getInstitution() == null || educationDto.getInstitution().trim().isEmpty()) {
            log.warn("Education creation failed: institution is required");
            throw new BadRequestException("Institution is required");
        }

        log.info("Creating new education entry: {} at {}", educationDto.getDegree().trim(), educationDto.getInstitution().trim());

        List<String> achievements = educationDto.getAchievements() != null
                ? new ArrayList<>(educationDto.getAchievements())
                : new ArrayList<>();

        Education education = Education.builder()
                .degree(educationDto.getDegree().trim())
                .institution(educationDto.getInstitution().trim())
                .startDate(educationDto.getStartDate() != null ? educationDto.getStartDate().trim() : null)
                .endDate(educationDto.getEndDate() != null ? educationDto.getEndDate().trim() : null)
                .description(educationDto.getDescription() != null ? educationDto.getDescription().trim() : null)
                .achievements(achievements)
                .build();

        Education saved = educationRepository.save(education);
        log.info("Education entry created successfully with id: {}", saved.getId());
        return saved;
    }

    @Override
    @Transactional
    public Education updateEducation(Long id, EducationDto educationDto) {
        if (educationDto == null) {
            log.warn("Education update failed for id {}: educationDto is null", id);
            throw new BadRequestException("Education data must not be null");
        }

        log.info("Updating education entry with id: {}", id);
        Education existingEducation = educationRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Education update failed: education not found with id: {}", id);
                    return new ResourceNotFoundException("Education", "id", id);
                });

        if (educationDto.getDegree() != null && !educationDto.getDegree().trim().isEmpty()) {
            existingEducation.setDegree(educationDto.getDegree().trim());
        }
        if (educationDto.getInstitution() != null && !educationDto.getInstitution().trim().isEmpty()) {
            existingEducation.setInstitution(educationDto.getInstitution().trim());
        }
        if (educationDto.getStartDate() != null) {
            existingEducation.setStartDate(educationDto.getStartDate().trim());
        }
        if (educationDto.getEndDate() != null) {
            existingEducation.setEndDate(educationDto.getEndDate().trim());
        }
        if (educationDto.getDescription() != null) {
            existingEducation.setDescription(educationDto.getDescription().trim());
        }
        if (educationDto.getAchievements() != null) {
            existingEducation.setAchievements(new ArrayList<>(educationDto.getAchievements()));
        }

        Education updated = educationRepository.save(existingEducation);
        log.info("Education entry updated successfully with id: {}", updated.getId());
        return updated;
    }

    @Override
    @Transactional
    public void deleteEducation(Long id) {
        log.info("Deleting education entry with id: {}", id);
        Education existingEducation = educationRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Education deletion failed: education not found with id: {}", id);
                    return new ResourceNotFoundException("Education", "id", id);
                });

        educationRepository.delete(existingEducation);
        log.info("Education entry deleted successfully with id: {}", id);
    }
}
