package com.FloodRadarX.demo.repository;

import com.FloodRadarX.demo.entity.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RegionRepository extends JpaRepository<Region, Long> {

    // Preserved existing method
    List<Region> findByNameContainingIgnoreCase(String name);

    List<Region> findByDistrictIgnoreCase(String district);

    List<Region> findByDistrictContainingIgnoreCase(String district);

    List<Region> findByStateIgnoreCase(String state);

    Optional<Region> findByNameIgnoreCaseAndDistrictIgnoreCaseAndStateIgnoreCase(String name, String district, String state);

    @Query("SELECT r FROM Region r WHERE LOWER(r.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(r.district) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(r.state) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Region> searchAcrossFields(@Param("query") String query);

    boolean existsByNameIgnoreCaseAndDistrictIgnoreCaseAndStateIgnoreCase(String name, String district, String state);
}
