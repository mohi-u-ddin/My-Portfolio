package com.mohiudding.portfolio_Backend.service;

import com.mohiudding.portfolio_Backend.dto.ContactRequest;
import com.mohiudding.portfolio_Backend.model.ContactMessage;

import java.util.List;

public interface ContactService {

    ContactMessage saveContactMessage(ContactRequest contactRequest);

    List<ContactMessage> getAllContactMessages();

    ContactMessage markAsRead(Long id, boolean read);

    void deleteMessage(Long id);

    long getUnreadCount();
}

