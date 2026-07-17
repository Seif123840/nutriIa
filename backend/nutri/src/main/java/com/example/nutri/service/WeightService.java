package com.example.nutri.service;

import com.example.nutri.dto.WeightRequest;
import com.example.nutri.entity.User;
import com.example.nutri.entity.WeightLog;
import com.example.nutri.repository.UserRepository;
import com.example.nutri.repository.WeightRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WeightService {

    private final WeightRepository weightRepository;
    private final UserRepository userRepository;

    public WeightLog addWeight(WeightRequest request, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        WeightLog weightLog = WeightLog.builder()
                .userId(user.getId().toString())
                .weight(request.getWeight())
                .date(request.getDate())
                .notes(request.getNotes())
                .build();

        return weightRepository.save(weightLog);
    }
    public List<WeightLog> getWeights(String userId){

        return weightRepository.findByUserIdOrderByDateAsc(userId);

    }

}