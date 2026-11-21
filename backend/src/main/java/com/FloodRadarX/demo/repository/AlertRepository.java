package com.FloodRadarX.demo.repository;

import com.FloodRadarX.demo.entity.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {

    List<Alert> findByIsActiveTrueOrderByAlertTimestampDesc();

    List<Alert> findByRegionIdOrderByAlertTimestampDesc(Long regionId);

    List<Alert> findByRiskLevelIgnoreCase(String riskLevel);

    List<Alert> findTop20ByOrderByAlertTimestampDesc();
}
