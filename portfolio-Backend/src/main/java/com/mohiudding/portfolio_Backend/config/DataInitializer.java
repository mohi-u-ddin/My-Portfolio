package com.mohiudding.portfolio_Backend.config;

import com.mohiudding.portfolio_Backend.model.User;
import com.mohiudding.portfolio_Backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
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
