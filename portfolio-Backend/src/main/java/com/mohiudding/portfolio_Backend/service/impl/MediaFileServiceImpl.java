package com.mohiudding.portfolio_Backend.service.impl;

import com.mohiudding.portfolio_Backend.exception.BadRequestException;
import com.mohiudding.portfolio_Backend.exception.ResourceNotFoundException;
import com.mohiudding.portfolio_Backend.model.MediaFile;
import com.mohiudding.portfolio_Backend.repository.MediaFileRepository;
import com.mohiudding.portfolio_Backend.service.MediaFileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class MediaFileServiceImpl implements MediaFileService {

    private final MediaFileRepository mediaFileRepository;

    @Override
    @Transactional
    public MediaFile storeMedia(MultipartFile file, String fileType) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Uploaded file cannot be empty");
        }

        String originalName = StringUtils.cleanPath(Objects.requireNonNullElse(file.getOriginalFilename(), "file"));
        if (originalName.contains("..")) {
            throw new BadRequestException("Filename contains invalid path sequence: " + originalName);
        }

        String contentType = file.getContentType();
        if (contentType == null || contentType.trim().isEmpty()) {
            contentType = "application/octet-stream";
        }

        try {
            byte[] bytes = file.getBytes();
            log.info("Storing media file '{}' ({}) of type {} into database, size: {} bytes",
                    originalName, contentType, fileType, bytes.length);

            MediaFile mediaFile = MediaFile.builder()
                    .fileName(originalName)
                    .contentType(contentType)
                    .fileType(fileType != null ? fileType.toUpperCase().trim() : "GENERAL")
                    .fileSize(file.getSize())
                    .data(bytes)
                    .build();

            return mediaFileRepository.save(mediaFile);
        } catch (IOException e) {
            log.error("Failed to read bytes from uploaded file", e);
            throw new RuntimeException("Failed to read bytes from uploaded file", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public MediaFile getMediaById(Long id) {
        log.info("Fetching media file with id: {}", id);
        return mediaFileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MediaFile", "id", id));
    }

    @Override
    @Transactional(readOnly = true)
    public MediaFile getLatestByFileType(String fileType) {
        log.info("Fetching latest media file of type: {}", fileType);
        return mediaFileRepository.findFirstByFileTypeOrderByIdDesc(fileType.toUpperCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("No media file found for type: " + fileType));
    }

    @Override
    @Transactional
    public void deleteMedia(Long id) {
        log.info("Deleting media file with id: {}", id);
        MediaFile mediaFile = getMediaById(id);
        mediaFileRepository.delete(mediaFile);
    }

    @Override
    @Transactional
    public void deleteByFileType(String fileType) {
        log.info("Deleting all media files of type: {}", fileType);
        mediaFileRepository.deleteByFileType(fileType.toUpperCase().trim());
    }
}
