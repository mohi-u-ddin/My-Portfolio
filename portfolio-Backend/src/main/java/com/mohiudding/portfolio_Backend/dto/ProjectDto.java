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
public class ProjectDto {

    @NotBlank(message = "Project title is required")
    @Size(max = 150, message = "Project title must not exceed 150 characters")
    private String title;

    @NotBlank(message = "Project description is required")
    private String description;

    @Size(max = 255, message = "Image URL must not exceed 255 characters")
    private String image;

    @Builder.Default
    private List<String> technologies = new ArrayList<>();

    @Size(max = 255, message = "GitHub URL must not exceed 255 characters")
    private String githubUrl;

    @Size(max = 255, message = "Live URL must not exceed 255 characters")
    private String liveUrl;

    @Builder.Default
    private Boolean featured = false;

    @Size(max = 20, message = "Date must not exceed 20 characters")
    private String date;
}
