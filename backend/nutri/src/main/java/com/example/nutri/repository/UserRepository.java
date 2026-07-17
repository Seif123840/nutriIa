package com.example.nutri.repository;

import com.example.nutri.entity.Role;
import com.example.nutri.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,String> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
    Boolean existsByRole(Role role);   // nécessaire pour l’admin unique

}