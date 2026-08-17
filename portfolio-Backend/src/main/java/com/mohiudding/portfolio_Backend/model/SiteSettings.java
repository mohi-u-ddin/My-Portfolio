package com.mohiudding.portfolio_Backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "site_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SiteSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "site_title", length = 150)
    private String siteTitle;

    @Column(name = "site_description", columnDefinition = "TEXT")
    private String siteDescription;

    @Column(name = "contact_email", length = 100)
    private String contactEmail;

    @Embedded
    @Builder.Default
    private SocialLinks socialLinks = new SocialLinks();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "site_settings_languages", joinColumns = @JoinColumn(name = "settings_id"))
    @Column(name = "language")
    @Builder.Default
    private List<String> availableLanguages = new ArrayList<>();

    @Column(name = "resume_url", length = 255)
    private String resumeUrl;

    @Embedded
    @Builder.Default
    private SeoMetadata seo = new SeoMetadata();
}
