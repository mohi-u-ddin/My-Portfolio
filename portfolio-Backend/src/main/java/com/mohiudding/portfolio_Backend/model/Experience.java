package com.mohiudding.portfolio_Backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "experiences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Experience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String company;

    @Column(nullable = false, length = 120)
    private String position;

    @Column(length = 100)
    private String location;

    @Column(name = "start_date", nullable = false, length = 20)
    private String startDate;

    @Column(name = "end_date", length = 20)
    private String endDate;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "experience_descriptions", joinColumns = @JoinColumn(name = "experience_id"))
    @Column(name = "description", columnDefinition = "TEXT")
    @Builder.Default
    private List<String> description = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "experience_technologies", joinColumns = @JoinColumn(name = "experience_id"))
    @Column(name = "technology")
    @Builder.Default
    private List<String> technologies = new ArrayList<>();
}
