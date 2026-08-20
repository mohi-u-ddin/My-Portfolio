package com.mohiudding.portfolio_Backend.service;

import com.mohiudding.portfolio_Backend.dto.SiteSettingsDto;
import com.mohiudding.portfolio_Backend.model.SiteSettings;

public interface SettingsService {
    SiteSettings getSettings();
    SiteSettings updateSettings(SiteSettingsDto settingsDto);
}
