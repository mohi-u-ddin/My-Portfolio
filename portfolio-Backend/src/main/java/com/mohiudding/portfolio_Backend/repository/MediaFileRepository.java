package com.mohiudding.portfolio_Backend.repository;

import com.mohiudding.portfolio_Backend.model.MediaFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MediaFileRepository extends JpaRepository<MediaFile, Long> {

    Optional<MediaFile> findFirstByFileTypeOrderByIdDesc(String fileType);

    void deleteByFileType(String fileType);
}
