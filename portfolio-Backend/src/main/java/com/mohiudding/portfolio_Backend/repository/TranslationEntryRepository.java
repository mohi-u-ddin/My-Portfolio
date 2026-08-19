package com.mohiudding.portfolio_Backend.repository;

import com.mohiudding.portfolio_Backend.model.TranslationEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TranslationEntryRepository extends JpaRepository<TranslationEntry, Long> {

    Optional<TranslationEntry> findByKey(String key);

    boolean existsByKey(String key);

    List<TranslationEntry> findAllByOrderByKeyAsc();
}
