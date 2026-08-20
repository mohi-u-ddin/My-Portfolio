package com.mohiudding.portfolio_Backend.service.impl;

import com.mohiudding.portfolio_Backend.dto.ContactRequest;
import com.mohiudding.portfolio_Backend.exception.BadRequestException;
import com.mohiudding.portfolio_Backend.exception.ResourceNotFoundException;
import com.mohiudding.portfolio_Backend.model.ContactMessage;
import com.mohiudding.portfolio_Backend.repository.ContactMessageRepository;
import com.mohiudding.portfolio_Backend.service.ContactService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ContactServiceImpl implements ContactService {

    private final ContactMessageRepository contactMessageRepository;

    @Override
    @Transactional
    public ContactMessage saveContactMessage(ContactRequest contactRequest) {
        if (contactRequest == null) {
            log.warn("Contact message submission failed: contactRequest is null");
            throw new BadRequestException("Contact request data must not be null");
        }

        if (contactRequest.getName() == null || contactRequest.getName().trim().isEmpty()) {
            log.warn("Contact message submission failed: name is required");
            throw new BadRequestException("Name is required");
        }

        if (contactRequest.getEmail() == null || contactRequest.getEmail().trim().isEmpty()) {
            log.warn("Contact message submission failed: email is required");
            throw new BadRequestException("Email is required");
        }

        if (contactRequest.getSubject() == null || contactRequest.getSubject().trim().isEmpty()) {
            log.warn("Contact message submission failed: subject is required");
            throw new BadRequestException("Subject is required");
        }

        if (contactRequest.getMessage() == null || contactRequest.getMessage().trim().isEmpty()) {
            log.warn("Contact message submission failed: message is required");
            throw new BadRequestException("Message is required");
        }

        log.info("Saving new contact message from: {}", contactRequest.getEmail().trim());

        ContactMessage message = ContactMessage.builder()
                .name(contactRequest.getName().trim())
                .email(contactRequest.getEmail().trim())
                .subject(contactRequest.getSubject().trim())
                .message(contactRequest.getMessage().trim())
                .read(false)
                .build();

        ContactMessage saved = contactMessageRepository.save(message);
        log.info("Contact message saved successfully with id: {}", saved.getId());
        return saved;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContactMessage> getAllContactMessages() {
        log.info("Fetching all contact messages");
        return contactMessageRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    @Transactional
    public ContactMessage markAsRead(Long id, boolean read) {
        if (id == null) {
            log.warn("Mark as read failed: id is null");
            throw new BadRequestException("Message ID must not be null");
        }

        log.info("Marking contact message with id {} as read: {}", id, read);
        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Contact message not found with id: {}", id);
                    return new ResourceNotFoundException("ContactMessage", "id", id);
                });

        message.setRead(read);
        ContactMessage updated = contactMessageRepository.save(message);
        log.info("Contact message with id {} marked as read: {}", id, read);
        return updated;
    }

    @Override
    @Transactional
    public void deleteMessage(Long id) {
        if (id == null) {
            log.warn("Delete contact message failed: id is null");
            throw new BadRequestException("Message ID must not be null");
        }

        log.info("Deleting contact message with id: {}", id);
        ContactMessage existing = contactMessageRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Contact message deletion failed: message not found with id: {}", id);
                    return new ResourceNotFoundException("ContactMessage", "id", id);
                });

        contactMessageRepository.delete(existing);
        log.info("Contact message with id {} deleted successfully", id);
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount() {
        log.info("Fetching unread contact message count");
        return contactMessageRepository.countByReadFalse();
    }
}

