package com.mohiudding.portfolio_Backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "educations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Education {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false,length = 150)
    private String degree;

    @Column(nullable = false, length = 150)
    private String institution;

    @Column(name="start_date",length = 20)
    private String startDate;

    @Column(name = "end_date",length = 20)
    private String endDate;

    @Column(nullable = true,columnDefinition = "TEXT")
    private String description;

    @ElementCollection
    @CollectionTable(name = "education_achievements",joinColumns = @JoinColumn(name = "education_id"))
    @Column(name = "achievement")
    @Builder.Default
    private List<String> achievements=new ArrayList<>();

}
