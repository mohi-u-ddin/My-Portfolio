package com.mohiudding.portfolio_Backend.service;

import com.mohiudding.portfolio_Backend.model.MediaFile;
import org.springframework.web.multipart.MultipartFile;

public interface ResumeService {
    String getResumeUrl();
    MediaFile getLatestResumeFile();
    String uploadResume(MultipartFile file);
    void deleteResume();
}
