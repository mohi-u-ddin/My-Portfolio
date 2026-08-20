package com.mohiudding.portfolio_Backend.service.impl;

import com.mohiudding.portfolio_Backend.dto.SiteSettingsDto;
import com.mohiudding.portfolio_Backend.model.SeoMetadata;
import com.mohiudding.portfolio_Backend.model.SiteSettings;
import com.mohiudding.portfolio_Backend.model.SocialLinks;
import com.mohiudding.portfolio_Backend.repository.SiteSettingsRepository;
import com.mohiudding.portfolio_Backend.service.SettingsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class SettingsServiceImpl implements SettingsService {

    private final SiteSettingsRepository siteSettingsRepository;

    @Override
    @Transactional(readOnly = true)
    public SiteSettings getSettings() {
        log.info("Fetching site settings");
        return siteSettingsRepository.findFirstByOrderByIdAsc()
                .orElseGet(() -> SiteSettings.builder()
                        .siteTitle("")
                        .siteDescription("")
                        .contactEmail("")
                        .socialLinks(SocialLinks.builder().github("").linkedin("").build())
                        .availableLanguages(List.of("en", "ur"))
                        .resumeUrl("")
                        .seo(SeoMetadata.builder().metaTitle("").metaDescription("").build())
                        .build());
    }

    @Override
    @Transactional
    public SiteSettings updateSettings(SiteSettingsDto dto) {
        log.info("Updating site settings");
        SiteSettings settings = siteSettingsRepository.findFirstByOrderByIdAsc()
                .orElseGet(() -> SiteSettings.builder().build());

        if (dto.getSiteTitle() != null) settings.setSiteTitle(dto.getSiteTitle().trim());
        if (dto.getSiteDescription() != null) settings.setSiteDescription(dto.getSiteDescription().trim());
        if (dto.getContactEmail() != null) settings.setContactEmail(dto.getContactEmail().trim());
        if (dto.getResumeUrl() != null) settings.setResumeUrl(dto.getResumeUrl().trim());

        if (dto.getSocialLinks() != null) {
            settings.setSocialLinks(SocialLinks.builder()
                    .github(dto.getSocialLinks().getGithub() != null ? dto.getSocialLinks().getGithub().trim() : "")
                    .linkedin(dto.getSocialLinks().getLinkedin() != null ? dto.getSocialLinks().getLinkedin().trim() : "")
                    .build());
        }

        if (dto.getAvailableLanguages() != null) {
            settings.setAvailableLanguages(new ArrayList<>(dto.getAvailableLanguages()));
        }

        if (dto.getSeo() != null) {
            settings.setSeo(SeoMetadata.builder()
                    .metaTitle(dto.getSeo().getMetaTitle() != null ? dto.getSeo().getMetaTitle().trim() : "")
                    .metaDescription(dto.getSeo().getMetaDescription() != null ? dto.getSeo().getMetaDescription().trim() : "")
                    .build());
        }

        return siteSettingsRepository.save(settings);
    }
}
