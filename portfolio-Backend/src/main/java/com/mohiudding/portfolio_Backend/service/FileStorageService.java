package com.mohiudding.portfolio_Backend.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    String storeResume(MultipartFile file);
    String storeImage(MultipartFile file, String subDirectory);
    boolean deleteFile(String relativePath);
}
