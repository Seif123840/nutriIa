package com.example.nutri.repository;

import com.example.nutri.entity.Food;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository

public interface FoodRepository extends JpaRepository<Food, Long> {

    List<Food> findByDescriptionContainingIgnoreCase(String description);

}