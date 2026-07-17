package com.example.nutri.repository;

import com.example.nutri.entity.WeightLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WeightRepository extends JpaRepository<WeightLog, Long> {

    List<WeightLog> findByUserIdOrderByDateAsc(String userId);

}