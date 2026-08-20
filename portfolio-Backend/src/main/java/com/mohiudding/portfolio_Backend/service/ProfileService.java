package com.mohiudding.portfolio_Backend.service;

import com.mohiudding.portfolio_Backend.dto.ProfileDto;
import com.mohiudding.portfolio_Backend.model.Profile;

public interface ProfileService {
    Profile getProfile();
    Profile updateProfile(ProfileDto profileDto);
}
