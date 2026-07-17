package com.example.nutri.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Nutrient {

    @Id
    private Long id;

    private String name;

    private String unitName;
}