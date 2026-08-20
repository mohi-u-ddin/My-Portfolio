package com.mohiudding.portfolio_Backend.service.impl;

import com.mohiudding.portfolio_Backend.exception.BadRequestException;
import com.mohiudding.portfolio_Backend.service.FileStorageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
public class FileStorageServiceImpl implements FileStorageService {

    private final Path rootUploadDir;
    private static final Set<String> ALLOWED_IMAGE_EXTENSIONS = Set.of(".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif");

    public FileStorageServiceImpl(@Value("${file.upload-dir:uploads}") String uploadDir) {
        this.rootUploadDir = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.rootUploadDir);
            Files.createDirectories(this.rootUploadDir.resolve("resume"));
            Files.createDirectories(this.rootUploadDir.resolve("images"));
        } catch (IOException e) {
            log.error("Could not initialize storage directory", e);
            throw new RuntimeException("Could not initialize storage directory", e);
        }
    }

    @Override
    public String storeResume(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Uploaded file must not be empty");
        }

        String originalFilename = StringUtils.cleanPath(Objects.requireNonNullElse(file.getOriginalFilename(), "resume.pdf"));
        if (originalFilename.contains("..")) {
            throw new BadRequestException("Invalid filename path sequence: " + originalFilename);
        }

        if (!originalFilename.toLowerCase().endsWith(".pdf")) {
            throw new BadRequestException("Only PDF resume files are accepted");
        }

        String filename = "resume_" + UUID.randomUUID().toString().substring(0, 8) + "_" + originalFilename;
        Path targetLocation = this.rootUploadDir.resolve("resume").resolve(filename);

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
            log.info("Resume stored successfully at: {}", targetLocation);
            return "/uploads/resume/" + filename;
        } catch (IOException e) {
            log.error("Failed to store resume file", e);
            throw new RuntimeException("Failed to store resume file", e);
        }
    }

    @Override
    public String storeImage(MultipartFile file, String subDirectory) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Uploaded image file must not be empty");
        }

        String originalFilename = StringUtils.cleanPath(Objects.requireNonNullElse(file.getOriginalFilename(), "image.png"));
        if (originalFilename.contains("..")) {
            throw new BadRequestException("Invalid filename path sequence: " + originalFilename);
        }

        String ext = "";
        int dotIdx = originalFilename.lastIndexOf('.');
        if (dotIdx >= 0) {
            ext = originalFilename.substring(dotIdx).toLowerCase();
        }

        if (!ALLOWED_IMAGE_EXTENSIONS.contains(ext)) {
            throw new BadRequestException("Unsupported image format. Allowed: " + ALLOWED_IMAGE_EXTENSIONS);
        }

        String sub = (subDirectory != null && !subDirectory.trim().isEmpty()) ? subDirectory.trim() : "images";
        Path targetDir = this.rootUploadDir.resolve(sub);
        try {
            Files.createDirectories(targetDir);
        } catch (IOException e) {
            throw new RuntimeException("Could not create target upload subdirectory", e);
        }

        String filename = UUID.randomUUID().toString().substring(0, 12) + ext;
        Path targetLocation = targetDir.resolve(filename);

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
            log.info("Image stored successfully at: {}", targetLocation);
            return "/uploads/" + sub + "/" + filename;
        } catch (IOException e) {
            log.error("Failed to store image file", e);
            throw new RuntimeException("Failed to store image file", e);
        }
    }

    @Override
    public boolean deleteFile(String relativePath) {
        if (relativePath == null || relativePath.trim().isEmpty()) {
            return false;
        }

        String clean = relativePath.trim();
        if (clean.startsWith("/uploads/")) {
            clean = clean.substring("/uploads/".length());
        } else if (clean.startsWith("uploads/")) {
            clean = clean.substring("uploads/".length());
        }

        Path target = this.rootUploadDir.resolve(clean).normalize();
        if (!target.startsWith(this.rootUploadDir)) {
            log.warn("Attempted directory traversal delete on: {}", relativePath);
            return false;
        }

        try {
            boolean deleted = Files.deleteIfExists(target);
            if (deleted) {
                log.info("Deleted file: {}", target);
            }
            return deleted;
        } catch (IOException e) {
            log.warn("Could not delete file: {}", target, e);
            return false;
        }
    }
}
