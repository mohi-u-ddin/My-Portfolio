package com.mohiudding.portfolio_Backend.repository;

import com.mohiudding.portfolio_Backend.model.ProfileStat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfileStatRepository extends JpaRepository<ProfileStat, Long> {
}
