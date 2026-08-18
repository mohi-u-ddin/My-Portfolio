package com.mohiudding.portfolio_Backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
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
public class ProfileDto {

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String name;

    @NotBlank(message = "Title is required (e.g. Backend Developer)")
    @Size(max = 100, message = "Title must not exceed 100 characters")
    private String title;

    @Size(max = 200, message = "Tagline must not exceed 200 characters")
    private String tagline;

    private String bio;

    @Size(max = 255, message = "Avatar URL must not exceed 255 characters")
    private String avatarUrl;

    @Email(message = "Please provide a valid email address")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String email;

    @Size(max = 100, message = "Location must not exceed 100 characters")
    private String location;

    @Size(max = 120, message = "Availability must not exceed 120 characters")
    private String availability;

    @Size(max = 255, message = "GitHub URL must not exceed 255 characters")
    private String githubUrl;

    @Size(max = 255, message = "LinkedIn URL must not exceed 255 characters")
    private String linkedinUrl;

    @Size(max = 255, message = "Resume URL must not exceed 255 characters")
    private String resumeUrl;

    @Valid
    @Builder.Default
    private List<ProfileStatDto> stats = new ArrayList<>();
}
