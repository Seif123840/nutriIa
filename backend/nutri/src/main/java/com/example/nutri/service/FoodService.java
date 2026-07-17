package com.example.nutri.service;



import com.example.nutri.entity.Food;
import com.example.nutri.repository.FoodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FoodService {

    private final FoodRepository foodRepository;

    // Retourner tous les aliments
    public List<Food> getAllFoods() {
        return foodRepository.findAll();
    }

    // Rechercher par nom
    public List<Food> searchFoods(String keyword) {

        if (keyword == null || keyword.trim().isEmpty()) {
            return foodRepository.findAll();
        }

        return foodRepository.findByDescriptionContainingIgnoreCase(keyword);
    }

    // Rechercher par ID
    public Optional<Food> getFoodById(Long id) {
        return foodRepository.findById(id);
    }

}