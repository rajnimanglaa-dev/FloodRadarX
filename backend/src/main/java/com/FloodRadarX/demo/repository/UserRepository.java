package com.FloodRadarX.demo.repository;

import com.FloodRadarX.demo.entity.Role;
import com.FloodRadarX.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByPhoneNumber(String phoneNumber);

    Optional<User> findByEmailOrPhoneNumber(String email, String phoneNumber);

    boolean existsByEmail(String email);

    boolean existsByPhoneNumber(String phoneNumber);

    List<User> findByRole(Role role);

    List<User> findByPreferredDistrictIgnoreCase(String preferredDistrict);

    List<User> findByPreferredStateIgnoreCase(String preferredState);
}
