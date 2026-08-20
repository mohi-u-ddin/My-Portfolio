package com.mohiudding.portfolio_Backend.service.impl;

import com.mohiudding.portfolio_Backend.exception.BadRequestException;
import com.mohiudding.portfolio_Backend.exception.ResourceNotFoundException;
import com.mohiudding.portfolio_Backend.model.MediaFile;
import com.mohiudding.portfolio_Backend.model.Profile;
import com.mohiudding.portfolio_Backend.model.SiteSettings;
import com.mohiudding.portfolio_Backend.repository.MediaFileRepository;
import com.mohiudding.portfolio_Backend.repository.ProfileRepository;
import com.mohiudding.portfolio_Backend.repository.SiteSettingsRepository;
import com.mohiudding.portfolio_Backend.service.ResumeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ResumeServiceImpl implements ResumeService {

    private final MediaFileRepository mediaFileRepository;
    private final ProfileRepository profileRepository;
    private final SiteSettingsRepository siteSettingsRepository;

    @Override
    @Transactional(readOnly = true)
    public String getResumeUrl() {
        Optional<MediaFile> resume = mediaFileRepository.findFirstByFileTypeOrderByIdDesc("RESUME");
        if (resume.isPresent()) {
            return "/api/resume/download";
        }

        return profileRepository.findFirstByOrderByIdAsc()
                .map(Profile::getResumeUrl)
                .filter(url -> url != null && !url.trim().isEmpty())
                .orElseGet(() -> siteSettingsRepository.findFirstByOrderByIdAsc()
                        .map(SiteSettings::getResumeUrl)
                        .orElse(""));
    }

    @Override
    @Transactional(readOnly = true)
    public MediaFile getLatestResumeFile() {
        return mediaFileRepository.findFirstByFileTypeOrderByIdDesc("RESUME")
                .orElseThrow(() -> new ResourceNotFoundException("No resume PDF file found in database. Please upload a resume first."));
    }

    @Override
    @Transactional
    public String uploadResume(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Uploaded resume file cannot be empty");
        }

        String originalName = StringUtils.cleanPath(Objects.requireNonNullElse(file.getOriginalFilename(), "resume.pdf"));
        if (!originalName.toLowerCase().endsWith(".pdf")) {
            throw new BadRequestException("Only PDF documents (.pdf) are supported for resume uploads");
        }

        try {
            byte[] bytes = file.getBytes();
            log.info("Persisting resume PDF '{}' into database, size: {} bytes", originalName, bytes.length);

            // Clean up previous resume records
            mediaFileRepository.deleteByFileType("RESUME");

            MediaFile mediaFile = MediaFile.builder()
                    .fileName(originalName)
                    .contentType("application/pdf")
                    .fileType("RESUME")
                    .fileSize(file.getSize())
                    .data(bytes)
                    .build();

            mediaFileRepository.save(mediaFile);

            String downloadUrl = "/api/resume/download";

            profileRepository.findFirstByOrderByIdAsc().ifPresent(profile -> {
                profile.setResumeUrl(downloadUrl);
                profileRepository.save(profile);
            });

            siteSettingsRepository.findFirstByOrderByIdAsc().ifPresent(settings -> {
                settings.setResumeUrl(downloadUrl);
                siteSettingsRepository.save(settings);
            });

            return downloadUrl;
        } catch (IOException e) {
            log.error("Failed to read bytes from uploaded resume file", e);
            throw new RuntimeException("Failed to read resume file bytes", e);
        }
    }

    @Override
    @Transactional
    public void deleteResume() {
        log.info("Deleting resume from database...");
        mediaFileRepository.deleteByFileType("RESUME");

        profileRepository.findFirstByOrderByIdAsc().ifPresent(profile -> {
            profile.setResumeUrl("");
            profileRepository.save(profile);
        });

        siteSettingsRepository.findFirstByOrderByIdAsc().ifPresent(settings -> {
            settings.setResumeUrl("");
            siteSettingsRepository.save(settings);
        });
    }
}
