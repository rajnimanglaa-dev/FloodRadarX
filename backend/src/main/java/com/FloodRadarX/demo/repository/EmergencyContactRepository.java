package com.FloodRadarX.demo.repository;

import com.FloodRadarX.demo.entity.EmergencyContact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EmergencyContactRepository extends JpaRepository<EmergencyContact, Long> {

    List<EmergencyContact> findByDistrictIgnoreCase(String district);

    List<EmergencyContact> findByStateIgnoreCase(String state);

    List<EmergencyContact> findByVerificationStatusIgnoreCase(String verificationStatus);

    @Query("SELECT e FROM EmergencyContact e WHERE (LOWER(e.district) = LOWER(:district) OR LOWER(e.state) = LOWER(:state)) " +
           "AND LOWER(e.verificationStatus) = 'verified'")
    List<EmergencyContact> findVerifiedForDistrictOrState(@Param("district") String district, @Param("state") String state);

    List<EmergencyContact> findByOrganisationTypeIgnoreCase(String organisationType);
}
