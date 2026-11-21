package com.FloodRadarX.demo.repository;

import com.FloodRadarX.demo.entity.Shelter;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ShelterRepository extends JpaRepository<Shelter, Long> {

    List<Shelter> findByDistrictIgnoreCase(String district);

    List<Shelter> findByDistrictContainingIgnoreCase(String district);

    List<Shelter> findByStateIgnoreCase(String state);

    List<Shelter> findByVerificationStatusIgnoreCase(String verificationStatus);

    List<Shelter> findByDistrictIgnoreCaseAndVerificationStatusIgnoreCase(String district, String verificationStatus);
}
