package com.mohiudding.portfolio_Backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SocialLinks {

    @Column(name = "github_link", length = 255)
    private String github;

    @Column(name = "linkedin_link", length = 255)
    private String linkedin;
}
