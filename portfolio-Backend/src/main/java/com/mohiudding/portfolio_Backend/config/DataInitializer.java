package com.mohiudding.portfolio_Backend.config;

import com.mohiudding.portfolio_Backend.model.*;
import com.mohiudding.portfolio_Backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final SiteSettingsRepository siteSettingsRepository;
    private final TranslationEntryRepository translationRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.default.email:}")
    private String defaultAdminEmail;

    @Value("${admin.default.password:}")
    private String defaultAdminPassword;

    @Value("${admin.default.name:}")
    private String defaultAdminName;

    @Override
    public void run(String... args) {
        seedAdminUserIfAbsent();
        seedProfileIfAbsent();
        seedSettingsIfAbsent();
        seedTranslationsIfAbsent();
    }

    private void seedAdminUserIfAbsent() {
        if (userRepository.count() == 0) {
            if (defaultAdminEmail == null || defaultAdminEmail.isBlank() ||
                defaultAdminPassword == null || defaultAdminPassword.isBlank()) {
                log.info("No existing admin found in database and ADMIN_EMAIL/ADMIN_PASSWORD not set in environment. Skipping admin seed.");
                return;
            }
            log.info("Initializing initial administrator account...");
            User admin = User.builder()
                    .name(defaultAdminName != null && !defaultAdminName.isBlank() ? defaultAdminName : "Admin")
                    .email(defaultAdminEmail)
                    .password(passwordEncoder.encode(defaultAdminPassword))
                    .role("ADMIN")
                    .build();
            userRepository.save(admin);
            log.info("Initial Admin created with email: {}", admin.getEmail());
        }
    }

    private void seedProfileIfAbsent() {
        if (profileRepository.count() == 0) {
            log.info("Initializing default portfolio profile...");
            Profile profile = Profile.builder()
                    .name("Mohi Ud Din")
                    .title("Full Stack Developer")
                    .tagline("Building fast, robust, and scalable web solutions.")
                    .bio("Passionate software engineer specializing in modern React frontends and high-performance Spring Boot / Java backends.")
                    .avatarUrl("/api/media/avatar")
                    .email("admin@mohiuddin.dev")
                    .location("Islamabad, Pakistan")
                    .availability("Available for Full-time & Contract Roles")
                    .githubUrl("https://github.com")
                    .linkedinUrl("https://linkedin.com")
                    .resumeUrl("/api/resume/download")
                    .stats(List.of(
                            ProfileStat.builder().value("3+").label("Years Experience").build(),
                            ProfileStat.builder().value("20+").label("Projects Completed").build(),
                            ProfileStat.builder().value("15+").label("Satisfied Clients").build()
                    ))
                    .build();
            profileRepository.save(profile);
            log.info("Default profile initialized successfully.");
        }
    }

    private void seedSettingsIfAbsent() {
        if (siteSettingsRepository.count() == 0) {
            log.info("Initializing default site settings...");
            SiteSettings settings = SiteSettings.builder()
                    .siteTitle("Mohi Ud Din | Portfolio")
                    .siteDescription("Full Stack Developer Portfolio showcasing modern web and backend engineering.")
                    .contactEmail("admin@mohiuddin.dev")
                    .socialLinks(SocialLinks.builder()
                            .github("https://github.com")
                            .linkedin("https://linkedin.com")
                            .build())
                    .availableLanguages(List.of("en", "ur"))
                    .resumeUrl("/api/resume/download")
                    .seo(SeoMetadata.builder()
                            .metaTitle("Mohi Ud Din — Full Stack Engineer")
                            .metaDescription("Explore projects, skills, experience, and contact Mohi Ud Din.")
                            .build())
                    .build();
            siteSettingsRepository.save(settings);
            log.info("Default site settings initialized successfully.");
        }
    }

    private void seedTranslationsIfAbsent() {
        if (translationRepository.count() == 0) {
            log.info("Initializing default UI translations...");
            List<TranslationEntry> defaultTranslations = List.of(
                    TranslationEntry.builder().key("nav.home").en("Home").ur("ہوم").build(),
                    TranslationEntry.builder().key("nav.about").en("About").ur("تعارف").build(),
                    TranslationEntry.builder().key("nav.skills").en("Skills").ur("مہارتیں").build(),
                    TranslationEntry.builder().key("nav.projects").en("Projects").ur("منصوبے").build(),
                    TranslationEntry.builder().key("nav.experience").en("Experience").ur("تجربہ").build(),
                    TranslationEntry.builder().key("nav.education").en("Education").ur("تعلیم").build(),
                    TranslationEntry.builder().key("nav.contact").en("Contact").ur("رابطہ").build()
            );
            translationRepository.saveAll(defaultTranslations);
            log.info("Default UI translations initialized.");
        }
    }
}
