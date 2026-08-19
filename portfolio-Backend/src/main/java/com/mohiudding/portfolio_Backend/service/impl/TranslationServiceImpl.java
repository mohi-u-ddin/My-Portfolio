package com.mohiudding.portfolio_Backend.service.impl;

import com.mohiudding.portfolio_Backend.dto.TranslationEntryDto;
import com.mohiudding.portfolio_Backend.exception.BadRequestException;
import com.mohiudding.portfolio_Backend.exception.ResourceNotFoundException;
import com.mohiudding.portfolio_Backend.model.TranslationEntry;
import com.mohiudding.portfolio_Backend.repository.TranslationEntryRepository;
import com.mohiudding.portfolio_Backend.service.TranslationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TranslationServiceImpl implements TranslationService {

    private final TranslationEntryRepository translationRepository;

    @Override
    @Transactional(readOnly = true)
    public List<TranslationEntry> getAllTranslations() {
        log.info("Fetching all translation entries sorted by key");
        return translationRepository.findAllByOrderByKeyAsc();
    }

    @Override
    @Transactional(readOnly = true)
    public TranslationEntry getTranslationById(Long id) {
        log.info("Fetching translation with id: {}", id);
        return translationRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Translation not found with id: {}", id);
                    return new ResourceNotFoundException("Translation", "id", id);
                });
    }

    @Override
    @Transactional(readOnly = true)
    public TranslationEntry getTranslationByKey(String key) {
        if (key == null || key.trim().isEmpty()) {
            throw new BadRequestException("Translation key must not be empty");
        }
        String cleanKey = key.trim();
        log.info("Fetching translation with key: {}", cleanKey);
        return translationRepository.findByKey(cleanKey)
                .orElseThrow(() -> {
                    log.warn("Translation not found for key: {}", cleanKey);
                    return new ResourceNotFoundException("Translation not found with key: " + cleanKey);
                });
    }

    @Override
    @Transactional
    public TranslationEntry saveTranslation(TranslationEntryDto dto) {
        if (dto == null) {
            log.warn("Translation save failed: dto is null");
            throw new BadRequestException("Translation data must not be null");
        }
        if (dto.getKey() == null || dto.getKey().trim().isEmpty()) {
            log.warn("Translation save failed: key is required");
            throw new BadRequestException("Translation key is required");
        }

        String key = dto.getKey().trim();
        log.info("Saving translation entry with key: {}", key);

        TranslationEntry entry = translationRepository.findByKey(key)
                .orElse(TranslationEntry.builder().key(key).build());

        if (dto.getEn() != null) {
            entry.setEn(dto.getEn());
        }
        if (dto.getUr() != null) {
            entry.setUr(dto.getUr());
        }

        TranslationEntry saved = translationRepository.save(entry);
        log.info("Translation entry saved with id: {}", saved.getId());
        return saved;
    }

    @Override
    @Transactional
    public List<TranslationEntry> updateTranslations(List<TranslationEntryDto> translationDtos) {
        if (translationDtos == null || translationDtos.isEmpty()) {
            log.warn("Bulk translation update failed: list is empty");
            throw new BadRequestException("Translation list must not be empty");
        }

        log.info("Bulk updating {} translation entries", translationDtos.size());
        List<TranslationEntry> toSave = new ArrayList<>();

        for (TranslationEntryDto dto : translationDtos) {
            if (dto == null || dto.getKey() == null || dto.getKey().trim().isEmpty()) {
                continue;
            }
            String key = dto.getKey().trim();
            TranslationEntry entry = translationRepository.findByKey(key)
                    .orElse(TranslationEntry.builder().key(key).build());

            if (dto.getEn() != null) {
                entry.setEn(dto.getEn());
            }
            if (dto.getUr() != null) {
                entry.setUr(dto.getUr());
            }
            toSave.add(entry);
        }

        List<TranslationEntry> savedAll = translationRepository.saveAll(toSave);
        log.info("Bulk updated {} translation entries successfully", savedAll.size());
        return savedAll;
    }

    @Override
    @Transactional
    public void deleteTranslation(Long id) {
        log.info("Deleting translation entry with id: {}", id);
        TranslationEntry entry = translationRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Translation deletion failed: not found with id: {}", id);
                    return new ResourceNotFoundException("Translation", "id", id);
                });

        translationRepository.delete(entry);
        log.info("Translation entry deleted successfully with id: {}", id);
    }
}
