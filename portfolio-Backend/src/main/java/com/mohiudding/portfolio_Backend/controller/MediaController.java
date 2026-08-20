package com.mohiudding.portfolio_Backend.controller;

import com.mohiudding.portfolio_Backend.model.MediaFile;
import com.mohiudding.portfolio_Backend.model.Profile;
import com.mohiudding.portfolio_Backend.repository.ProfileRepository;
import com.mohiudding.portfolio_Backend.service.MediaFileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class MediaController {

    private final MediaFileService mediaFileService;
    private final ProfileRepository profileRepository;

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> getMediaById(@PathVariable Long id) {
        MediaFile mediaFile = mediaFileService.getMediaById(id);
        MediaType mediaType;
        try {
            mediaType = MediaType.parseMediaType(mediaFile.getContentType());
        } catch (Exception e) {
            mediaType = MediaType.APPLICATION_OCTET_STREAM;
        }

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + mediaFile.getFileName() + "\"")
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
                .body(mediaFile.getData());
    }

    @GetMapping("/avatar")
    public ResponseEntity<byte[]> getLatestAvatar() {
        try {
            MediaFile mediaFile = mediaFileService.getLatestByFileType("AVATAR");
            MediaType mediaType;
            try {
                mediaType = MediaType.parseMediaType(mediaFile.getContentType());
            } catch (Exception e) {
                mediaType = MediaType.IMAGE_PNG;
            }

            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + mediaFile.getFileName() + "\"")
                    .header(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
                    .body(mediaFile.getData());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadMedia(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "type", defaultValue = "IMAGE") String type
    ) {
        MediaFile saved = mediaFileService.storeMedia(file, type);
        String url = "/api/media/" + saved.getId();
        return new ResponseEntity<>(
                Map.of(
                        "id", saved.getId(),
                        "url", url,
                        "fileName", saved.getFileName(),
                        "contentType", saved.getContentType(),
                        "size", saved.getFileSize() != null ? saved.getFileSize() : 0
                ),
                HttpStatus.CREATED
        );
    }

    @PostMapping("/avatar")
    public ResponseEntity<Map<String, Object>> uploadAvatar(@RequestParam("file") MultipartFile file) {
        MediaFile saved = mediaFileService.storeMedia(file, "AVATAR");
        String url = "/api/media/" + saved.getId();

        profileRepository.findFirstByOrderByIdAsc().ifPresent(profile -> {
            profile.setAvatarUrl(url);
            profileRepository.save(profile);
        });

        return new ResponseEntity<>(
                Map.of("id", saved.getId(), "url", url),
                HttpStatus.CREATED
        );
    }
}
