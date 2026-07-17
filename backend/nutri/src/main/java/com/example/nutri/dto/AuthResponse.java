package com.example.nutri.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class AuthResponse {

    private String token;

    private String message;

    private String userId;

    private String email;

}