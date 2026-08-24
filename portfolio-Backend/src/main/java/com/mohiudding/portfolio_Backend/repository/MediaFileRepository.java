package com.mohiudding.portfolio_Backend.repository;

import com.mohiudding.portfolio_Backend.model.MediaFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MediaFileRepository extends JpaRepository<MediaFile, Long> {

    Optional<MediaFile> findFirstByFileTypeOrderByIdDesc(String fileType);

    List<MediaFile> findAllByFileType(String fileType);

    @Modifying
    @Query("DELETE FROM MediaFile m WHERE m.fileType = :fileType")
    void deleteByFileType(@Param("fileType") String fileType);
}

