package com.FloodRadarX.demo.service;

import com.FloodRadarX.demo.dto.*;
import com.FloodRadarX.demo.entity.FloodPrediction;
import com.FloodRadarX.demo.entity.Region;
import com.FloodRadarX.demo.entity.WeatherData;
import com.FloodRadarX.demo.entity.WaterLevelObservation;
import com.FloodRadarX.demo.repository.FloodPredictionRepository;
import com.FloodRadarX.demo.repository.WeatherDataRepository;
import com.FloodRadarX.demo.repository.WaterLevelObservationRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class PythonPredictionService {

    private static final Logger logger = LoggerFactory.getLogger(PythonPredictionService.class);

    private final RegionService regionService;
    private final FloodPredictionRepository floodPredictionRepository;
    private final WeatherDataRepository weatherDataRepository;
    private final WaterLevelObservationRepository waterLevelObservationRepository;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    @Value("${python.ml.service.url:http://localhost:5000/api/predict}")
    private String pythonServiceUrl;

    public PythonPredictionService(RegionService regionService,
                                   FloodPredictionRepository floodPredictionRepository,
                                   WeatherDataRepository weatherDataRepository,
                                   WaterLevelObservationRepository waterLevelObservationRepository) {
        this.regionService = regionService;
        this.floodPredictionRepository = floodPredictionRepository;
        this.weatherDataRepository = weatherDataRepository;
        this.waterLevelObservationRepository = waterLevelObservationRepository;
        this.objectMapper = new ObjectMapper();
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(3))
                .build();
    }

    @Transactional
    public PredictionResponse predictRisk(PredictionInputRequest input) {
        Region region = regionService.findRegionById(input.getRegionId());

        // Fill monitoring defaults from latest DB observations if not provided in input
        Double rainfallMm = input.getRainfallMm();
        if (rainfallMm == null) {
            rainfallMm = weatherDataRepository.findTopByRegionIdOrderByObservationTimeDesc(region.getId())
                    .map(WeatherData::getRainfallMm)
                    .orElse(0.0);
        }

        Double riverWaterLevel = input.getRiverWaterLevelMeters();
        if (riverWaterLevel == null) {
            riverWaterLevel = waterLevelObservationRepository.findTopByRegionIdOrderByObservationTimeDesc(region.getId())
                    .map(WaterLevelObservation::getWaterLevelMeters)
                    .orElse(0.0);
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("regionId", region.getId());
        payload.put("district", region.getDistrict());
        payload.put("state", region.getState());
        payload.put("rainfallMm", rainfallMm);
        payload.put("riverWaterLevelMeters", riverWaterLevel);
        payload.put("soilMoisturePercent", input.getSoilMoisturePercent() != null ? input.getSoilMoisturePercent() : 45.0);
        payload.put("weatherForecastTrend", input.getWeatherForecastTrend() != null ? input.getWeatherForecastTrend() : "STABLE");

        PredictionResponse response = callPythonService(payload, region, rainfallMm, riverWaterLevel);

        // Store validated prediction result in MySQL
        FloodPrediction prediction = new FloodPrediction(
                region,
                response.getRiskScore(),
                response.getRiskLevel(),
                response.getPredictionWindowHours(),
                response.getFactors() != null ? response.getFactors().getRainfallTrend() : "STABLE",
                response.getFactors() != null ? response.getFactors().getWaterLevelTrend() : "STABLE",
                response.getNote(),
                LocalDateTime.now(),
                response.getModelVersion()
        );

        floodPredictionRepository.save(prediction);

        return response;
    }

    private PredictionResponse callPythonService(Map<String, Object> payload, Region region, 
                                                 Double rainfallMm, Double riverWaterLevel) {
        try {
            String jsonPayload = objectMapper.writeValueAsString(payload);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(pythonServiceUrl))
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(5))
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            logger.info("Calling Python ML prediction service at: {}", pythonServiceUrl);
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                Map<String, Object> body = objectMapper.readValue(response.body(), new TypeReference<Map<String, Object>>() {});
                Integer riskScore = ((Number) body.getOrDefault("riskScore", 0)).intValue();
                String riskLevel = (String) body.getOrDefault("riskLevel", "UNKNOWN");
                Integer windowHours = ((Number) body.getOrDefault("predictionWindowHours", 6)).intValue();

                @SuppressWarnings("unchecked")
                Map<String, Object> factorsMap = body.get("factors") instanceof Map ? (Map<String, Object>) body.get("factors") : null;
                String rainfallTrend = (factorsMap != null && factorsMap.get("rainfallTrend") != null) 
                        ? factorsMap.get("rainfallTrend").toString() : "STABLE";
                String waterLevelTrend = (factorsMap != null && factorsMap.get("waterLevelTrend") != null) 
                        ? factorsMap.get("waterLevelTrend").toString() : "STABLE";

                PredictionFactorsDto factors = new PredictionFactorsDto(rainfallTrend, waterLevelTrend);
                PredictionResponse predResponse = new PredictionResponse(
                        region.getId(),
                        region.getName(),
                        region.getDistrict(),
                        region.getState(),
                        riskScore,
                        riskLevel,
                        windowHours,
                        factors,
                        LocalDateTime.now(),
                        "Python-ML-Service-Live"
                );
                predResponse.setSimulatedFallback(false);
                predResponse.setNote("Prediction successfully computed by Python ML model.");
                return predResponse;
            }
        } catch (Exception ex) {
            logger.warn("Python prediction service is unreachable at {}: {}. Activating rule-based fallback.", 
                        pythonServiceUrl, ex.getMessage());
        }

        // Transparent Fallback when Python service is offline:
        // Compute realistic hydrologic risk based on standard IMD flood advisory thresholds
        int fallbackScore;
        String fallbackLevel;
        String rainTrend;
        String waterTrend;

        if (rainfallMm >= 150.0 || riverWaterLevel >= 8.0) {
            fallbackScore = 85;
            fallbackLevel = "HIGH";
            rainTrend = "INCREASING";
            waterTrend = "RISING";
        } else if (rainfallMm >= 64.5 || riverWaterLevel >= 5.0) {
            fallbackScore = 55;
            fallbackLevel = "MODERATE";
            rainTrend = "STABLE";
            waterTrend = "RISING";
        } else if (rainfallMm >= 15.6) {
            fallbackScore = 25;
            fallbackLevel = "LOW";
            rainTrend = "DECREASING";
            waterTrend = "STABLE";
        } else {
            fallbackScore = 10;
            fallbackLevel = "LOW";
            rainTrend = "STABLE";
            waterTrend = "RECEDING";
        }

        PredictionResponse fallbackResponse = new PredictionResponse(
                region.getId(),
                region.getName(),
                region.getDistrict(),
                region.getState(),
                fallbackScore,
                fallbackLevel,
                6,
                new PredictionFactorsDto(rainTrend, waterTrend),
                LocalDateTime.now(),
                "Hydrologic-Threshold-Fallback-v1"
        );
        fallbackResponse.setSimulatedFallback(true);
        fallbackResponse.setNote("Python ML service at " + pythonServiceUrl + 
                " is currently offline. Prediction is based on hydrologic threshold estimation. " +
                "Start your teammate's Python ML API on port 5000 to enable real-time model inference.");

        return fallbackResponse;
    }

    public Optional<PredictionResponse> getLatestPredictionForRegion(Long regionId) {
        return floodPredictionRepository.findTopByRegionIdOrderByPredictionTimestampDesc(regionId)
                .map(p -> new PredictionResponse(
                        p.getRegion().getId(),
                        p.getRegion().getName(),
                        p.getRegion().getDistrict(),
                        p.getRegion().getState(),
                        p.getRiskScore(),
                        p.getRiskLevel(),
                        p.getPredictionWindowHours(),
                        new PredictionFactorsDto(p.getRainfallTrend(), p.getWaterLevelTrend()),
                        p.getPredictionTimestamp(),
                        p.getModelVersion()
                ));
    }
}
