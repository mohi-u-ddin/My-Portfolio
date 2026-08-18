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
public class ExperienceDto {

    @NotBlank(message = "Company name is required")
    @Size(max = 120, message = "Company name must not exceed 120 characters")
    private String company;

    @NotBlank(message = "Position is required")
    @Size(max = 120, message = "Position must not exceed 120 characters")
    private String position;

    @Size(max = 100, message = "Location must not exceed 100 characters")
    private String location;

    @NotBlank(message = "Start date is required")
    @Size(max = 20, message = "Start date must not exceed 20 characters")
    private String startDate;

    @Size(max = 20, message = "End date must not exceed 20 characters")
    private String endDate;

    @Builder.Default
    private List<String> description = new ArrayList<>();

    @Builder.Default
    private List<String> technologies = new ArrayList<>();
}
