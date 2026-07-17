package com.example.nutri.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Applique la configuration à toutes les routes
                        .allowedOrigins(
                                "http://localhost:4200"    // Angular (par défaut)
                        )
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                        .allowedHeaders("*") // Autorise tous les en-têtes
                        .allowCredentials(true) // Permet d'envoyer les cookies / tokens JWT
                        .maxAge(3600); // Durée de vie de la réponse préflight en secondes (1h)
            }
        };
    }
}