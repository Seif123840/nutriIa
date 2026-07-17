package com.example.nutri.controller;



import com.example.nutri.entity.Food;
import com.example.nutri.service.FoodService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/foods")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class FoodController {

    private final FoodService foodService;

    // Tous les aliments
    @GetMapping
    public ResponseEntity<List<Food>> getAllFoods() {

        return ResponseEntity.ok(foodService.getAllFoods());

    }

    // Recherche
    @GetMapping("/search")
    public ResponseEntity<List<Food>> searchFoods(
            @RequestParam String query) {

        return ResponseEntity.ok(
                foodService.searchFoods(query)
        );

    }

    // Recherche par id
    @GetMapping("/{id}")
    public ResponseEntity<Food> getFoodById(
            @PathVariable Long id) {

        return foodService.getFoodById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());

    }

}