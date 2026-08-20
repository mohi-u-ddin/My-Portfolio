package com.mohiudding.portfolio_Backend.controller;

import com.mohiudding.portfolio_Backend.model.MediaFile;
import com.mohiudding.portfolio_Backend.service.MediaFileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class FileUploadController {

    private final MediaFileService mediaFileService;

    @PostMapping
    public ResponseEntity<Map<String, String>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "category", defaultValue = "PROJECT_IMAGE") String category
    ) {
        MediaFile saved = mediaFileService.storeMedia(file, category);
        String url = "/api/media/" + saved.getId();
        return new ResponseEntity<>(Map.of("url", url), HttpStatus.CREATED);
    }
}
