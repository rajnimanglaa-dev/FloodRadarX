package com.FloodRadarX.demo.repository;

import com.FloodRadarX.demo.entity.SatelliteData;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SatelliteDataRepository extends JpaRepository<SatelliteData, Long> {

    Optional<SatelliteData> findTopByRegionIdOrderByObservationDateDesc(Long regionId);

    List<SatelliteData> findByRegionIdOrderByObservationDateDesc(Long regionId);
}
