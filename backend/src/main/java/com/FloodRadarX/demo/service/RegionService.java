package com.FloodRadarX.demo.service;

import com.FloodRadarX.demo.dto.*;
import com.FloodRadarX.demo.entity.*;
import com.FloodRadarX.demo.exception.BadRequestException;
import com.FloodRadarX.demo.exception.ResourceNotFoundException;
import com.FloodRadarX.demo.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RegionService {

    private final RegionRepository regionRepository;
    private final HistoricalFloodRepository historicalFloodRepository;
    private final FloodPredictionRepository floodPredictionRepository;
    private final WeatherDataRepository weatherDataRepository;
    private final SatelliteDataRepository satelliteDataRepository;
    private final ShelterRepository shelterRepository;

    public RegionService(RegionRepository regionRepository,
                         HistoricalFloodRepository historicalFloodRepository,
                         FloodPredictionRepository floodPredictionRepository,
                         WeatherDataRepository weatherDataRepository,
                         SatelliteDataRepository satelliteDataRepository,
                         ShelterRepository shelterRepository) {
        this.regionRepository = regionRepository;
        this.historicalFloodRepository = historicalFloodRepository;
        this.floodPredictionRepository = floodPredictionRepository;
        this.weatherDataRepository = weatherDataRepository;
        this.satelliteDataRepository = satelliteDataRepository;
        this.shelterRepository = shelterRepository;
    }

    // Preserved existing method for full backward compatibility
    public List<Region> searchRegions(String name) {
        return regionRepository.findByNameContainingIgnoreCase(name);
    }

    public List<RegionResponse> searchRegionsDto(String name) {
        return regionRepository.findByNameContainingIgnoreCase(name)
                .stream()
                .map(this::mapToRegionResponse)
                .collect(Collectors.toList());
    }

    public List<RegionResponse> searchAcrossFields(String query) {
        return regionRepository.searchAcrossFields(query)
                .stream()
                .map(this::mapToRegionResponse)
                .collect(Collectors.toList());
    }

    public RegionResponse getRegionById(Long id) {
        Region region = findRegionById(id);
        return mapToRegionResponse(region);
    }

    public Region findRegionById(Long id) {
        return regionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Region not found with ID: " + id));
    }

    public List<RegionResponse> getRegionsByState(String state) {
        return regionRepository.findByStateIgnoreCase(state)
                .stream()
                .map(this::mapToRegionResponse)
                .collect(Collectors.toList());
    }

    public RegionBoundaryResponse getRegionBoundary(Long id) {
        Region region = findRegionById(id);
        return new RegionBoundaryResponse(
                region.getId(),
                region.getName(),
                region.getDistrict(),
                region.getState(),
                region.getLatitude(),
                region.getLongitude(),
                region.getBoundaryGeoJson(),
                region.getSourceName()
        );
    }

    public RegionDetailResponse getRegionDetail(Long id) {
        Region region = findRegionById(id);
        RegionResponse regionDto = mapToRegionResponse(region);

        // Latest prediction
        PredictionResponse predictionDto = floodPredictionRepository
                .findTopByRegionIdOrderByPredictionTimestampDesc(id)
                .map(p -> new PredictionResponse(
                        region.getId(),
                        region.getName(),
                        region.getDistrict(),
                        region.getState(),
                        p.getRiskScore(),
                        p.getRiskLevel(),
                        p.getPredictionWindowHours(),
                        new PredictionFactorsDto(p.getRainfallTrend(), p.getWaterLevelTrend()),
                        p.getPredictionTimestamp(),
                        p.getModelVersion()
                ))
                .orElse(null);

        // Historical floods
        List<HistoricalFloodResponse> historyDtos = historicalFloodRepository
                .findByRegionIdOrderByEventYearDesc(id)
                .stream()
                .map(h -> new HistoricalFloodResponse(
                        h.getId(),
                        region.getId(),
                        region.getName(),
                        region.getDistrict(),
                        region.getState(),
                        h.getEventYear(),
                        h.getEventDate(),
                        h.getSeverity(),
                        h.getInundatedAreaSqKm(),
                        h.getDescription(),
                        h.getDataSource(),
                        h.getSourceUrl(),
                        h.getDatasetObservationDate()
                ))
                .collect(Collectors.toList());

        // Latest weather
        WeatherDataResponse weatherDto = weatherDataRepository
                .findTopByRegionIdOrderByObservationTimeDesc(id)
                .map(w -> new WeatherDataResponse(
                        w.getId(),
                        region.getId(),
                        region.getName(),
                        region.getDistrict(),
                        region.getState(),
                        w.getRainfallMm(),
                        w.getTemperatureCelsius(),
                        w.getHumidityPercent(),
                        w.getObservationTime(),
                        w.getDataSource(),
                        w.getRawDataRef()
                ))
                .orElse(null);

        // Latest satellite observation
        SatelliteDataResponse satelliteDto = satelliteDataRepository
                .findTopByRegionIdOrderByObservationDateDesc(id)
                .map(s -> new SatelliteDataResponse(
                        s.getId(),
                        region.getId(),
                        region.getName(),
                        region.getDistrict(),
                        region.getState(),
                        s.getSatelliteName(),
                        s.getObservationDate(),
                        s.getCloudCoverPercentage(),
                        s.getFloodInundationDetected(),
                        s.getDataSource(),
                        s.getProductId(),
                        s.getSensorType(),
                        s.getNotes()
                ))
                .orElse(null);

        // Count nearby/district shelters
        int shelterCount = shelterRepository.findByDistrictIgnoreCase(region.getDistrict()).size();

        return new RegionDetailResponse(regionDto, predictionDto, historyDtos, weatherDto, satelliteDto, shelterCount);
    }

    @Transactional
    public RegionResponse createRegion(RegionRequest request) {
        if (regionRepository.existsByNameIgnoreCaseAndDistrictIgnoreCaseAndStateIgnoreCase(
                request.getName().trim(), request.getDistrict().trim(), request.getState().trim())) {
            throw new BadRequestException("Region with name '" + request.getName() + "' in district '" 
                    + request.getDistrict() + "', " + request.getState() + " already exists.");
        }

        Region region = new Region();
        region.setName(request.getName().trim());
        region.setDistrict(request.getDistrict().trim());
        region.setState(request.getState().trim());
        region.setLatitude(request.getLatitude());
        region.setLongitude(request.getLongitude());
        region.setBoundaryGeoJson(request.getBoundaryGeoJson());
        region.setSourceName(request.getSourceName());
        region.setDatasetVersion(request.getDatasetVersion());

        Region saved = regionRepository.save(region);
        return mapToRegionResponse(saved);
    }

    public List<RegionResponse> getAllRegions() {
        return regionRepository.findAll()
                .stream()
                .map(this::mapToRegionResponse)
                .collect(Collectors.toList());
    }

    public RegionResponse mapToRegionResponse(Region region) {
        return new RegionResponse(
                region.getId(),
                region.getName(),
                region.getDistrict(),
                region.getState(),
                region.getLatitude(),
                region.getLongitude(),
                region.getBoundaryGeoJson(),
                region.getSourceName(),
                region.getDatasetVersion(),
                region.getUpdatedAt()
        );
    }
}
