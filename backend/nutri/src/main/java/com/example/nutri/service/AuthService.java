package com.example.nutri.service;


import com.example.nutri.dto.AuthResponse;
import com.example.nutri.dto.LoginRequest;
import com.example.nutri.dto.RegisterRequest;
import com.example.nutri.entity.Role;
import com.example.nutri.entity.User;
import com.example.nutri.repository.UserRepository;
import com.example.nutri.security.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class AuthService {


    private final AuthenticationManager authenticationManager;

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtTokenProvider jwtTokenProvider;



    /**
     * Register new user
     */
    public String register(RegisterRequest request) {


        if(userRepository.existsByEmail(request.getEmail())) {

            throw new RuntimeException(
                    "Email is already used"
            );
        }



        User user = User.builder()

                .fullName(request.getFullName())

                .email(request.getEmail())

                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )

                .role(Role.USER)

                .build();



        userRepository.save(user);



        return "User registered successfully";
    }





    /**
     * Login user and generate JWT
     */
    public AuthResponse login(LoginRequest request) {


        Authentication authentication =
                authenticationManager.authenticate(

                        new UsernamePasswordAuthenticationToken(

                                request.getEmail(),

                                request.getPassword()
                        )
                );



        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));


        String token = jwtTokenProvider.generateToken(user.getEmail());


        return new AuthResponse(
                token,
                "Login successful",
                user.getId(),
                user.getEmail()
        );

}
}