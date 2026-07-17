package com.example.nutri.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class WeightRequest {

    private Double weight;

    private LocalDate date;

    private String notes;
}