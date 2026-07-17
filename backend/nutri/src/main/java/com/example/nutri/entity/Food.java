package com.example.nutri.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "food")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Food {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;

    private String category;

    private Double calories;

    private Double protein;

    private Double carbohydrates;

    private Double fat;

    private Double fiber;

    private Double sugar;

    private Double sodium;

    private Double potassium;

    private Double calcium;

    private Double iron;
    private Long fdcId;
    @OneToMany(mappedBy = "food")
    private List<FoodLog> foodLogs;


}