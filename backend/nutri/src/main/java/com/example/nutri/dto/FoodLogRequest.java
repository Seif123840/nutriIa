package com.example.nutri.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.time.LocalDate;

@Data
public class FoodLogRequest {

    @JsonProperty("food_item_id")   // ← correspond au champ envoyé par Angular
    private Long foodId;

    @JsonProperty("date")
    private LocalDate date;

    @JsonProperty("meal_type")      // ← correspond au champ envoyé par Angular
    private String mealType;

    @JsonProperty("quantity_g")     // ← correspond au champ envoyé par Angular
    private Double quantity;

    // Les getters/setters sont générés par @Data
}