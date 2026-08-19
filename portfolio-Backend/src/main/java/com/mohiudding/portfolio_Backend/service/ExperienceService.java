package com.mohiudding.portfolio_Backend.service;

import com.mohiudding.portfolio_Backend.dto.ExperienceDto;
import com.mohiudding.portfolio_Backend.model.Experience;

import java.util.List;

public interface ExperienceService {
    List<Experience> getAllExperiences();
    Experience getExperienceById(Long id);
    Experience createExperience(ExperienceDto experienceDto);
    Experience updateExperience(Long id, ExperienceDto experienceDto);
    void deleteExperience(Long id);
}
