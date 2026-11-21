package com.FloodRadarX.demo.repository;

import com.FloodRadarX.demo.entity.WeatherData;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface WeatherDataRepository extends JpaRepository<WeatherData, Long> {

    Optional<WeatherData> findTopByRegionIdOrderByObservationTimeDesc(Long regionId);

    List<WeatherData> findByRegionIdOrderByObservationTimeDesc(Long regionId);
}
