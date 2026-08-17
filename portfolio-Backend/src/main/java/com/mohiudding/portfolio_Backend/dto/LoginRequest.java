package com.mohiudding.portfolio_Backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address (e.g. admin@mohiuddin.dev)")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;
}
