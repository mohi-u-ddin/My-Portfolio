package com.mohiudding.portfolio_Backend.controller;

import com.mohiudding.portfolio_Backend.dto.TranslationEntryDto;
import com.mohiudding.portfolio_Backend.model.TranslationEntry;
import com.mohiudding.portfolio_Backend.service.TranslationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/translations")
@RequiredArgsConstructor
public class TranslationController {

    private final TranslationService translationService;

    @GetMapping
    public ResponseEntity<List<TranslationEntry>> getAllTranslations() {
        List<TranslationEntry> translations = translationService.getAllTranslations();
        return ResponseEntity.ok(translations);
    }

    @GetMapping("/{key}")
    public ResponseEntity<TranslationEntry> getTranslationByKey(@PathVariable String key) {
        TranslationEntry entry = translationService.getTranslationByKey(key);
        return ResponseEntity.ok(entry);
    }

    @PostMapping
    public ResponseEntity<TranslationEntry> saveTranslation(@Valid @RequestBody TranslationEntryDto dto) {
        TranslationEntry saved = translationService.saveTranslation(dto);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping
    public ResponseEntity<List<TranslationEntry>> updateTranslations(
            @RequestBody List<TranslationEntryDto> translationDtos
    ) {
        List<TranslationEntry> updated = translationService.updateTranslations(translationDtos);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTranslation(@PathVariable Long id) {
        translationService.deleteTranslation(id);
        return ResponseEntity.noContent().build();
    }
}
