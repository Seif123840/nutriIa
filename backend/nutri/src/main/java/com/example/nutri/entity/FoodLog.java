package com.example.nutri.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "food_log")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class FoodLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"password","foodLogs"})
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "food_id", nullable = false)
    @JsonIgnoreProperties({"foodLogs"})
    private Food food;

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "meal_type", nullable = false)
    private String mealType;

    @Column(name = "quantity_g", nullable = false)
    private Double quantityG;

    @Column(nullable = false)
    private Double calories;

    @Column(name = "protein_g", nullable = false)
    private Double proteinG;

    @Column(name = "carbs_g", nullable = false)
    private Double carbsG;

    @Column(name = "fat_g", nullable = false)
    private Double fatG;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (date == null) {
            date = LocalDate.now();
        }
        createdAt = LocalDateTime.now();
    }
}