package com.mohiudding.portfolio_Backend.service;

import com.mohiudding.portfolio_Backend.dto.EducationDto;
import com.mohiudding.portfolio_Backend.model.Education;

import java.util.List;

public interface EducationService {

    List<Education> getAllEducations();

    Education getEducationById(Long id);

    Education createEducation(EducationDto educationDto);

    Education updateEducation(Long id, EducationDto educationDto);

    void deleteEducation(Long id);
}
