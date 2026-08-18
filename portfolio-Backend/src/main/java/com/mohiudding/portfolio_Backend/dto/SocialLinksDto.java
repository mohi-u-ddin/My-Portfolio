package com.mohiudding.portfolio_Backend.dto;

import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SocialLinksDto {

    @Size(max = 255, message = "GitHub link must not exceed 255 characters")
    private String github;

    @Size(max = 255, message = "LinkedIn link must not exceed 255 characters")
    private String linkedin;
}
