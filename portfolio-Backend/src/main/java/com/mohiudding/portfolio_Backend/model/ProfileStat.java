package com.mohiudding.portfolio_Backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "profile_stats")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileStat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String value;

    @Column(nullable = false, length = 100)
    private String label;
}
