package com.mohiudding.portfolio_Backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TranslationEntryDto {

    private Long id;

    @NotBlank(message = "Translation key is required (e.g. nav.home, hero.title)")
    @Size(max = 100, message = "Translation key must not exceed 100 characters")
    private String key;

    private String en;

    private String ur;
}
