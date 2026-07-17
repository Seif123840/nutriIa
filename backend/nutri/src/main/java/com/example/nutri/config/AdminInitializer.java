package com.example.nutri.config;

import com.example.nutri.entity.Role;
import com.example.nutri.entity.User;
import com.example.nutri.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor

public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Ne crée l'admin que s'il n'existe pas déjà
        if (userRepository.existsByRole(Role.ADMIN)) {
            return;
        }

        User admin = User.builder()
                .email("admin@votreplateforme.com")   // email fixe
                .password(passwordEncoder.encode("Admin123!")) // mot de passe fixe
                .fullName("Administrateur")
                .role(Role.ADMIN)
                .build();

        userRepository.save(admin);
        System.out.println("Admin créé avec succès.");
    }
}