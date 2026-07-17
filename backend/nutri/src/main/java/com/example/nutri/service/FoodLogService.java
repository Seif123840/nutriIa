package com.example.nutri.service;

import com.example.nutri.entity.*;
import com.example.nutri.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FoodLogService {

    private final FoodLogRepository foodLogRepository;
    private final FoodRepository foodRepository;
    private final UserRepository userRepository;
    public FoodLog addFoodLog(
            String email,
            Long foodId,
            LocalDate date,
            String mealType,
            Double quantity
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Food food = foodRepository.findById(foodId)
                .orElseThrow(() -> new RuntimeException("Food not found"));

        double factor = quantity / 100.0;

        FoodLog log = new FoodLog();

        log.setUser(user);
        log.setFood(food);

        log.setDate(date);
        log.setMealType(mealType);
        log.setQuantityG(quantity);

        log.setCalories((food.getCalories() == null ? 0 : food.getCalories()) * factor);
        log.setProteinG((food.getProtein() == null ? 0 : food.getProtein()) * factor);
        log.setCarbsG((food.getCarbohydrates() == null ? 0 : food.getCarbohydrates()) * factor);
        log.setFatG((food.getFat() == null ? 0 : food.getFat()) * factor);

        return foodLogRepository.save(log);
    }

    public List<FoodLog> getLogs(String userId, LocalDate date) {

        return foodLogRepository.findByUserIdAndDate(userId, date);

    }

    public void delete(Long id) {

        foodLogRepository.deleteById(id);

    }

}