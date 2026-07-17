package com.example.nutri.controller;

import com.example.nutri.dto.WeightRequest;
import com.example.nutri.entity.WeightLog;
import com.example.nutri.service.WeightService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/weights")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class WeightController {

    private final WeightService weightService;

    @PostMapping
    public ResponseEntity<?> addWeight(
            @RequestBody WeightRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                weightService.addWeight(request, email)
        );
    }
    @GetMapping("/{userId}")
    public ResponseEntity<List<WeightLog>> getWeights(
            @PathVariable String userId){

        return ResponseEntity.ok(
                weightService.getWeights(userId)
        );
    }

}