package com.mohiudding.portfolio_Backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "translations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TranslationEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "translation_key", nullable = false, unique = true, length = 100)
    private String key;

    @Column(name = "en", columnDefinition = "TEXT")
    private String en;

    @Column(name = "ur", columnDefinition = "TEXT")
    private String ur;
}
