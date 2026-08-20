package com.mohiudding.portfolio_Backend.service;

import com.mohiudding.portfolio_Backend.model.MediaFile;
import org.springframework.web.multipart.MultipartFile;

public interface MediaFileService {
    MediaFile storeMedia(MultipartFile file, String fileType);
    MediaFile getMediaById(Long id);
    MediaFile getLatestByFileType(String fileType);
    void deleteMedia(Long id);
    void deleteByFileType(String fileType);
}
