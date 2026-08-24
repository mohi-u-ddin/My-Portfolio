package com.mohiudding.portfolio_Backend.service;

import com.mohiudding.portfolio_Backend.model.MediaFile;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

public interface ResumeService {
    String getResumeUrl();
    Map<String, Object> getResumeDetails();
    MediaFile getLatestResumeFile();
    String uploadResume(MultipartFile file);
    void deleteResume();
}

