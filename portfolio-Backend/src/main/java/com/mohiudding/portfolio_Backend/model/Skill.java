package com.mohiudding.portfolio_Backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "skills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 50)
    private String category; // Backend, Database, Frontend, Tools

    @Column(nullable = false, length = 50)
    private String icon;     // java, spring, mysql, react, etc.

    @Column(nullable = false, length = 30)
    private String level;    // Beginner, Intermediate, Advanced, Expert

    @Column(name = "years_of_experience")
    private Integer yearsOfExperience;
}
