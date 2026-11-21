package com.FloodRadarX.demo.repository;

import com.FloodRadarX.demo.entity.HistoricalFlood;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HistoricalFloodRepository extends JpaRepository<HistoricalFlood, Long> {

    List<HistoricalFlood> findByRegionId(Long regionId);

    List<HistoricalFlood> findByRegionIdOrderByEventYearDesc(Long regionId);

    List<HistoricalFlood> findByEventYear(Integer eventYear);

    List<HistoricalFlood> findByRegionDistrictIgnoreCase(String district);

    List<HistoricalFlood> findByRegionStateIgnoreCase(String state);

    List<HistoricalFlood> findBySeverityIgnoreCase(String severity);
}
