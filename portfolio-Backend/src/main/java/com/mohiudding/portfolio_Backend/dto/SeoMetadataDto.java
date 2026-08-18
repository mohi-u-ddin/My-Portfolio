package com.mohiudding.portfolio_Backend.dto;

import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeoMetadataDto {

    @Size(max = 150, message = "Meta title must not exceed 150 characters")
    private String metaTitle;

    private String metaDescription;
}
