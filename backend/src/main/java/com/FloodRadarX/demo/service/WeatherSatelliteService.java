package com.FloodRadarX.demo.service;

import com.FloodRadarX.demo.dto.*;
import com.FloodRadarX.demo.entity.*;
import com.FloodRadarX.demo.repository.SatelliteDataRepository;
import com.FloodRadarX.demo.repository.WaterLevelObservationRepository;
import com.FloodRadarX.demo.repository.WeatherDataRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WeatherSatelliteService {

    private final WeatherDataRepository weatherDataRepository;
    private final SatelliteDataRepository satelliteDataRepository;
    private final WaterLevelObservationRepository waterLevelObservationRepository;
    private final RegionService regionService;

    public WeatherSatelliteService(WeatherDataRepository weatherDataRepository,
                                   SatelliteDataRepository satelliteDataRepository,
                                   WaterLevelObservationRepository waterLevelObservationRepository,
                                   RegionService regionService) {
        this.weatherDataRepository = weatherDataRepository;
        this.satelliteDataRepository = satelliteDataRepository;
        this.waterLevelObservationRepository = waterLevelObservationRepository;
        this.regionService = regionService;
    }

    @Transactional
    public WeatherDataResponse recordWeatherObservation(WeatherObservationRequest request) {
        Region region = regionService.findRegionById(request.getRegionId());

        WeatherData weather = new WeatherData(
                region,
                request.getRainfallMm(),
                request.getTemperatureCelsius(),
                request.getHumidityPercent(),
                request.getObservationTime() != null ? request.getObservationTime() : LocalDateTime.now(),
                request.getDataSource().trim(),
                request.getRawDataRef()
        );

        WeatherData saved = weatherDataRepository.save(weather);
        return mapToWeatherResponse(saved);
    }

    @Transactional
    public SatelliteDataResponse recordSatelliteObservation(SatelliteObservationRequest request) {
        Region region = regionService.findRegionById(request.getRegionId());

        SatelliteData satellite = new SatelliteData(
                region,
                request.getSatelliteName().trim(),
                request.getObservationDate(),
                request.getCloudCoverPercentage(),
                request.getFloodInundationDetected(),
                request.getDataSource().trim(),
                request.getProductId(),
                request.getSensorType(),
                request.getNotes()
        );

        SatelliteData saved = satelliteDataRepository.save(satellite);
        return mapToSatelliteResponse(saved);
    }

    @Transactional
    public WaterLevelResponse recordWaterLevel(WaterLevelRequest request) {
        Region region = regionService.findRegionById(request.getRegionId());

        WaterLevelObservation waterLevel = new WaterLevelObservation(
                region,
                request.getRiverName().trim(),
                request.getStationName().trim(),
                request.getWaterLevelMeters(),
                request.getWarningLevelMeters(),
                request.getDangerLevelMeters(),
                request.getTrend() != null ? request.getTrend().trim().toUpperCase() : "STEADY",
                request.getObservationTime() != null ? request.getObservationTime() : LocalDateTime.now(),
                request.getDataSource().trim()
        );

        WaterLevelObservation saved = waterLevelObservationRepository.save(waterLevel);
        return mapToWaterResponse(saved);
    }

    public List<WeatherDataResponse> getWeatherByRegion(Long regionId) {
        return weatherDataRepository.findByRegionIdOrderByObservationTimeDesc(regionId)
                .stream()
                .map(this::mapToWeatherResponse)
                .collect(Collectors.toList());
    }

    public List<SatelliteDataResponse> getSatelliteByRegion(Long regionId) {
        return satelliteDataRepository.findByRegionIdOrderByObservationDateDesc(regionId)
                .stream()
                .map(this::mapToSatelliteResponse)
                .collect(Collectors.toList());
    }

    public List<WaterLevelResponse> getWaterLevelByRegion(Long regionId) {
        return waterLevelObservationRepository.findByRegionIdOrderByObservationTimeDesc(regionId)
                .stream()
                .map(this::mapToWaterResponse)
                .collect(Collectors.toList());
    }

    private WeatherDataResponse mapToWeatherResponse(WeatherData w) {
        return new WeatherDataResponse(
                w.getId(),
                w.getRegion().getId(),
                w.getRegion().getName(),
                w.getRegion().getDistrict(),
                w.getRegion().getState(),
                w.getRainfallMm(),
                w.getTemperatureCelsius(),
                w.getHumidityPercent(),
                w.getObservationTime(),
                w.getDataSource(),
                w.getRawDataRef()
        );
    }

    private SatelliteDataResponse mapToSatelliteResponse(SatelliteData s) {
        return new SatelliteDataResponse(
                s.getId(),
                s.getRegion().getId(),
                s.getRegion().getName(),
                s.getRegion().getDistrict(),
                s.getRegion().getState(),
                s.getSatelliteName(),
                s.getObservationDate(),
                s.getCloudCoverPercentage(),
                s.getFloodInundationDetected(),
                s.getDataSource(),
                s.getProductId(),
                s.getSensorType(),
                s.getNotes()
        );
    }

    private WaterLevelResponse mapToWaterResponse(WaterLevelObservation w) {
        return new WaterLevelResponse(
                w.getId(),
                w.getRegion().getId(),
                w.getRegion().getName(),
                w.getRegion().getDistrict(),
                w.getRegion().getState(),
                w.getRiverName(),
                w.getStationName(),
                w.getWaterLevelMeters(),
                w.getWarningLevelMeters(),
                w.getDangerLevelMeters(),
                w.getTrend(),
                w.getObservationTime(),
                w.getDataSource()
        );
    }
}
