package com.mohiudding.portfolio_Backend.service.impl;

import com.mohiudding.portfolio_Backend.dto.ProfileDto;
import com.mohiudding.portfolio_Backend.exception.ResourceNotFoundException;
import com.mohiudding.portfolio_Backend.model.Profile;
import com.mohiudding.portfolio_Backend.model.ProfileStat;
import com.mohiudding.portfolio_Backend.repository.ProfileRepository;
import com.mohiudding.portfolio_Backend.service.ProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class ProfileServiceImpl implements ProfileService {

    private final ProfileRepository profileRepository;

    @Override
    @Transactional(readOnly = true)
    public Profile getProfile() {
        log.info("Fetching profile from database");
        return profileRepository.findFirstByOrderByIdAsc()
                .orElseGet(() -> Profile.builder()
                        .name("")
                        .title("")
                        .tagline("")
                        .bio("")
                        .avatarUrl("")
                        .email("")
                        .location("")
                        .availability("")
                        .githubUrl("")
                        .linkedinUrl("")
                        .resumeUrl("")
                        .stats(List.of())
                        .build());
    }

    @Override
    @Transactional
    public Profile updateProfile(ProfileDto profileDto) {
        log.info("Updating profile");
        Profile profile = profileRepository.findFirstByOrderByIdAsc()
                .orElseGet(() -> Profile.builder().build());

        profile.setName(profileDto.getName());
        profile.setTitle(profileDto.getTitle());
        profile.setTagline(profileDto.getTagline());
        profile.setBio(profileDto.getBio());
        profile.setAvatarUrl(profileDto.getAvatarUrl());
        profile.setEmail(profileDto.getEmail());
        profile.setLocation(profileDto.getLocation());
        profile.setAvailability(profileDto.getAvailability());
        profile.setGithubUrl(profileDto.getGithubUrl());
        profile.setLinkedinUrl(profileDto.getLinkedinUrl());
        profile.setResumeUrl(profileDto.getResumeUrl());

        if (profileDto.getStats() != null) {
            List<ProfileStat> statEntities = profileDto.getStats().stream()
                    .map(s -> ProfileStat.builder()
                            .value(s.getValue())
                            .label(s.getLabel())
                            .build())
                    .toList();
            profile.getStats().clear();
            profile.getStats().addAll(statEntities);
        }

        return profileRepository.save(profile);
    }
}
