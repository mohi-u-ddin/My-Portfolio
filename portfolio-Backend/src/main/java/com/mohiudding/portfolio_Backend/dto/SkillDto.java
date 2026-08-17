package com.mohiudding.portfolio_Backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillDto {

    @NotBlank(message = "Skill name is required")
    private String name;

    @NotBlank(message = "Skill category is required (e.g. Backend, Frontend, Database, Tools)")
    private String category;

    @NotBlank(message = "Skill icon key is required (e.g. java, spring, react, mysql)")
    private String icon;

    @NotBlank(message = "Skill proficiency level is required (e.g. Beginner, Intermediate, Advanced, Expert)")
    private String level;

    @Min(value = 0, message = "Years of experience cannot be negative")
    private Integer yearsOfExperience;
}
