package com.mohiudding.portfolio_Backend.controller;

import com.mohiudding.portfolio_Backend.dto.ContactRequest;
import com.mohiudding.portfolio_Backend.model.ContactMessage;
import com.mohiudding.portfolio_Backend.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    public ResponseEntity<ContactMessage> submitContactMessage(@Valid @RequestBody ContactRequest contactRequest) {
        ContactMessage savedMessage = contactService.saveContactMessage(contactRequest);
        return new ResponseEntity<>(savedMessage, HttpStatus.CREATED);
    }

    @GetMapping("/messages")
    public ResponseEntity<List<ContactMessage>> getContactMessages() {
        List<ContactMessage> messages = contactService.getAllContactMessages();
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/messages/unread-count")
    public ResponseEntity<Long> getUnreadCount() {
        long count = contactService.getUnreadCount();
        return ResponseEntity.ok(count);
    }

    @PatchMapping("/messages/{id}/read")
    public ResponseEntity<ContactMessage> markMessageAsRead(
            @PathVariable Long id,
            @RequestParam(defaultValue = "true") boolean read
    ) {
        ContactMessage updatedMessage = contactService.markAsRead(id, read);
        return ResponseEntity.ok(updatedMessage);
    }

    @DeleteMapping("/messages/{id}")
    public ResponseEntity<Void> deleteContactMessage(@PathVariable Long id) {
        contactService.deleteMessage(id);
        return ResponseEntity.noContent().build();
    }
}

