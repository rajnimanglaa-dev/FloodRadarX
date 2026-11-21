package com.FloodRadarX.demo.repository;

import com.FloodRadarX.demo.entity.FloodPrediction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FloodPredictionRepository extends JpaRepository<FloodPrediction, Long> {

    Optional<FloodPrediction> findTopByRegionIdOrderByPredictionTimestampDesc(Long regionId);

    List<FloodPrediction> findByRegionIdOrderByPredictionTimestampDesc(Long regionId);

    List<FloodPrediction> findByRiskLevelIgnoreCase(String riskLevel);
}
