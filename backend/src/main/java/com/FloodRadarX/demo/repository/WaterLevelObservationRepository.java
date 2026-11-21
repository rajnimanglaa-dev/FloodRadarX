package com.FloodRadarX.demo.repository;

import com.FloodRadarX.demo.entity.WaterLevelObservation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface WaterLevelObservationRepository extends JpaRepository<WaterLevelObservation, Long> {

    Optional<WaterLevelObservation> findTopByRegionIdOrderByObservationTimeDesc(Long regionId);

    List<WaterLevelObservation> findByRegionIdOrderByObservationTimeDesc(Long regionId);
}
