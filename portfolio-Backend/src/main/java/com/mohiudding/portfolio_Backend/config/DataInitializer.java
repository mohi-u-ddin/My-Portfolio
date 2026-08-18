package com.mohiudding.portfolio_Backend.config;

import com.mohiudding.portfolio_Backend.model.Skill;
import com.mohiudding.portfolio_Backend.model.User;
import com.mohiudding.portfolio_Backend.repository.SkillRepository;
import com.mohiudding.portfolio_Backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final SkillRepository skillRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // 1. Seed Skills if database is empty
        if (skillRepository.count() == 0) {
            log.info("Seeding initial Skills data into database...");

            List<Skill> initialSkills = List.of(
                    Skill.builder().name("Java").category("Backend").icon("java").level("Advanced").yearsOfExperience(2).build(),
                    Skill.builder().name("Spring Boot").category("Backend").icon("spring").level("Advanced").yearsOfExperience(2).build(),
                    Skill.builder().name("Spring MVC").category("Backend").icon("spring").level("Intermediate").yearsOfExperience(1).build(),
                    Skill.builder().name("Spring Data JPA").category("Backend").icon("spring").level("Intermediate").yearsOfExperience(1).build(),
                    Skill.builder().name("Hibernate").category("Backend").icon("hibernate").level("Intermediate").yearsOfExperience(1).build(),
                    Skill.builder().name("REST APIs").category("Backend").icon("api").level("Advanced").yearsOfExperience(2).build(),
                    Skill.builder().name("MySQL").category("Database").icon("mysql").level("Advanced").yearsOfExperience(2).build(),
                    Skill.builder().name("H2 Database").category("Database").icon("database").level("Intermediate").yearsOfExperience(1).build(),
                    Skill.builder().name("React").category("Frontend").icon("react").level("Intermediate").yearsOfExperience(1).build(),
                    Skill.builder().name("JavaScript").category("Frontend").icon("javascript").level("Intermediate").yearsOfExperience(2).build(),
                    Skill.builder().name("HTML").category("Frontend").icon("html").level("Advanced").yearsOfExperience(2).build(),
                    Skill.builder().name("CSS").category("Frontend").icon("css").level("Advanced").yearsOfExperience(2).build(),
                    Skill.builder().name("Git").category("Tools").icon("git").level("Advanced").yearsOfExperience(2).build(),
                    Skill.builder().name("GitHub").category("Tools").icon("github").level("Advanced").yearsOfExperience(2).build(),
                    Skill.builder().name("Maven").category("Tools").icon("maven").level("Intermediate").yearsOfExperience(1).build(),
                    Skill.builder().name("Docker").category("Tools").icon("docker").level("Beginner").yearsOfExperience(1).build()
            );

            skillRepository.saveAll(initialSkills);
            log.info("Successfully seeded {} skills.", initialSkills.size());
        }

        // 2. Seed initial Admin User if not present
        if (userRepository.count() == 0) {
            log.info("Seeding default Admin user...");

            User admin = User.builder()
                    .name("Mohi Ud Din")
                    .email("admin@mohiuddin.dev")
                    .password(passwordEncoder.encode("admin123"))
                    .role("admin")
                    .build();

            userRepository.save(admin);
            log.info("Default Admin user created with email: {}", admin.getEmail());
        }
    }
}
