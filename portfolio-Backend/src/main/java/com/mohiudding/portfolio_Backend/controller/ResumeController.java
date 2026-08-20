package com.mohiudding.portfolio_Backend.controller;

import com.mohiudding.portfolio_Backend.model.MediaFile;
import com.mohiudding.portfolio_Backend.service.ResumeService;
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
@RequestMapping("/api/resume")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @GetMapping
    public ResponseEntity<Map<String, String>> getResumeUrl() {
        String url = resumeService.getResumeUrl();
        return ResponseEntity.ok(Map.of("url", url != null ? url : ""));
    }

    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadResume(@RequestParam(value = "download", defaultValue = "false") boolean download) {
        try {
            MediaFile resumeFile = resumeService.getLatestResumeFile();
            String dispositionType = download ? "attachment" : "inline";
            String filename = resumeFile.getFileName() != null ? resumeFile.getFileName() : "resume.pdf";

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, dispositionType + "; filename=\"" + filename + "\"")
                    .header(HttpHeaders.CACHE_CONTROL, "public, max-age=3600")
                    .body(resumeFile.getData());
        } catch (Exception e) {
            log.warn("Resume download failed: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> uploadResume(@RequestParam("file") MultipartFile file) {
        String url = resumeService.uploadResume(file);
        return new ResponseEntity<>(Map.of("url", url), HttpStatus.CREATED);
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteResume() {
        resumeService.deleteResume();
        return ResponseEntity.noContent().build();
    }
}
