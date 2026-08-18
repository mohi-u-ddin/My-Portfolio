package com.mohiudding.portfolio_Backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EducationDto {

    @NotBlank(message = "Degree is required")
    @Size(max = 150, message = "Degree must not exceed 150 characters")
    private String degree;

    @NotBlank(message = "Institution is required")
    @Size(max = 150, message = "Institution must not exceed 150 characters")
    private String institution;

    @Size(max = 20, message = "Start date must not exceed 20 characters")
    private String startDate;

    @Size(max = 20, message = "End date must not exceed 20 characters")
    private String endDate;

    private String description;

    @Builder.Default
    private List<String> achievements = new ArrayList<>();
}
