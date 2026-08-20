package com.mohiudding.portfolio_Backend.controller;

import com.mohiudding.portfolio_Backend.dto.SiteSettingsDto;
import com.mohiudding.portfolio_Backend.model.SiteSettings;
import com.mohiudding.portfolio_Backend.service.SettingsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class SettingsController {

    private final SettingsService settingsService;

    @GetMapping
    public ResponseEntity<SiteSettings> getSettings() {
        SiteSettings settings = settingsService.getSettings();
        return ResponseEntity.ok(settings);
    }

    @PutMapping
    public ResponseEntity<SiteSettings> updateSettings(@Valid @RequestBody SiteSettingsDto settingsDto) {
        SiteSettings updated = settingsService.updateSettings(settingsDto);
        return ResponseEntity.ok(updated);
    }
}
