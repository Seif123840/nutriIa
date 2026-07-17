package com.example.nutri.repository;

import com.example.nutri.entity.Nutrient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NutrientRepository
        extends JpaRepository<Nutrient, Long> {

}