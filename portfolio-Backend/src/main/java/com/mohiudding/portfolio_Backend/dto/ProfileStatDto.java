package com.mohiudding.portfolio_Backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileStatDto {

    private Long id;

    @NotBlank(message = "Stat value is required (e.g. 10+, 5+, 2+)")
    @Size(max = 50, message = "Stat value must not exceed 50 characters")
    private String value;

    @NotBlank(message = "Stat label is required (e.g. Technologies, Projects)")
    @Size(max = 100, message = "Stat label must not exceed 100 characters")
    private String label;
}
