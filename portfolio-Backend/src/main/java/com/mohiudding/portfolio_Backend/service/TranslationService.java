package com.mohiudding.portfolio_Backend.service;

import com.mohiudding.portfolio_Backend.dto.TranslationEntryDto;
import com.mohiudding.portfolio_Backend.model.TranslationEntry;

import java.util.List;

public interface TranslationService {

    List<TranslationEntry> getAllTranslations();

    TranslationEntry getTranslationById(Long id);

    TranslationEntry getTranslationByKey(String key);

    TranslationEntry saveTranslation(TranslationEntryDto dto);

    List<TranslationEntry> updateTranslations(List<TranslationEntryDto> translationDtos);

    void deleteTranslation(Long id);
}
