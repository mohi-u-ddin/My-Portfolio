package com.mohiudding.portfolio_Backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SiteSettingsDto {

    @Size(max = 150, message = "Site title must not exceed 150 characters")
    private String siteTitle;

    private String siteDescription;

    @Email(message = "Please provide a valid contact email address")
    @Size(max = 100, message = "Contact email must not exceed 100 characters")
    private String contactEmail;

    @Valid
    @Builder.Default
    private SocialLinksDto socialLinks = new SocialLinksDto();

    @Builder.Default
    private List<String> availableLanguages = new ArrayList<>();

    @Size(max = 255, message = "Resume URL must not exceed 255 characters")
    private String resumeUrl;

    @Valid
    @Builder.Default
    private SeoMetadataDto seo = new SeoMetadataDto();
}
