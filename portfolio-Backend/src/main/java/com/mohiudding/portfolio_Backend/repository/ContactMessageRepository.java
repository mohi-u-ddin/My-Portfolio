package com.mohiudding.portfolio_Backend.repository;

import com.mohiudding.portfolio_Backend.model.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {

    List<ContactMessage> findAllByOrderByCreatedAtDesc();

    List<ContactMessage> findByReadFalse();

    List<ContactMessage> findByRead(boolean read);

    long countByReadFalse();

    long countByRead(boolean read);
}
