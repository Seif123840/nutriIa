package com.example.nutri.controller;

import com.example.nutri.dto.FoodLogRequest;
import com.example.nutri.entity.FoodLog;
import com.example.nutri.service.FoodLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/foodlogs")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class FoodLogController {

    private final FoodLogService foodLogService;

    @PostMapping
    public ResponseEntity<FoodLog> addFoodLog(
            @RequestBody FoodLogRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ){

        String email = userDetails.getUsername();

        return ResponseEntity.ok(
                foodLogService.addFoodLog(
                        email,
                        request.getFoodId(),
                        request.getDate(),
                        request.getMealType(),
                        request.getQuantity()
                )
        );
    }

    @GetMapping("/{userId}/{date}")
    public ResponseEntity<List<FoodLog>> getLogs(

            @PathVariable String userId,
            @PathVariable String date

    ) {

        return ResponseEntity.ok(

                foodLogService.getLogs(

                        userId,
                        LocalDate.parse(date)

                )

        );

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {

        foodLogService.delete(id);

        return ResponseEntity.noContent().build();

    }

}