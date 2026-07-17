package com.example.nutri.repository;

import com.example.nutri.entity.FoodLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface FoodLogRepository extends JpaRepository<FoodLog, Long> {
    List<FoodLog> findByUserIdAndDate(String userId, LocalDate date); // ✅ Paramètre String
}