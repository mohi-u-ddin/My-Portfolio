package com.mohiudding.portfolio_Backend.controller;

import com.mohiudding.portfolio_Backend.dto.ProfileDto;
import com.mohiudding.portfolio_Backend.model.Profile;
import com.mohiudding.portfolio_Backend.service.ProfileService;
import com.mohiudding.portfolio_Backend.service.impl.ProfileServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/portfolio")
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;

    @GetMapping
    public ResponseEntity<Profile> getProfile(){
        Profile profile = profileService.getProfile();
        return ResponseEntity.ok(profile);
    }

    @PutMapping
    public ResponseEntity<Profile> updateProfile(@RequestBody ProfileDto profileDto){
        Profile updatedProfile = profileService.updateProfile(profileDto);
        return ResponseEntity.ok(updatedProfile);
    }
}
