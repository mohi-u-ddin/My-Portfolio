package com.mohiudding.portfolio_Backend.repository;

import com.mohiudding.portfolio_Backend.model.SiteSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SiteSettingsRepository extends JpaRepository<SiteSettings, Long> {

    Optional<SiteSettings> findFirstByOrderByIdAsc();
}
