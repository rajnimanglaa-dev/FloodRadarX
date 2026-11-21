package com.FloodRadarX.demo.service;

import com.FloodRadarX.demo.dto.RiskMapItemResponse;
import com.FloodRadarX.demo.dto.RiskMapSummaryResponse;
import com.FloodRadarX.demo.entity.FloodPrediction;
import com.FloodRadarX.demo.entity.Region;
import com.FloodRadarX.demo.repository.FloodPredictionRepository;
import com.FloodRadarX.demo.repository.RegionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class RiskMapService {

    private final RegionRepository regionRepository;
    private final FloodPredictionRepository floodPredictionRepository;

    public RiskMapService(RegionRepository regionRepository, 
                          FloodPredictionRepository floodPredictionRepository) {
        this.regionRepository = regionRepository;
        this.floodPredictionRepository = floodPredictionRepository;
    }

    public RiskMapSummaryResponse getRiskMap(String stateFilter, String riskLevelFilter) {
        List<Region> regions;
        if (stateFilter != null && !stateFilter.isBlank()) {
            regions = regionRepository.findByStateIgnoreCase(stateFilter.trim());
        } else {
            regions = regionRepository.findAll();
        }

        List<RiskMapItemResponse> items = new ArrayList<>();
        int lowCount = 0;
        int moderateCount = 0;
        int highCount = 0;
        int unknownCount = 0;

        for (Region region : regions) {
            Optional<FloodPrediction> latestPrediction = 
                    floodPredictionRepository.findTopByRegionIdOrderByPredictionTimestampDesc(region.getId());

            Integer score = null;
            String level = "UNKNOWN";
            LocalDateTime timestamp = region.getUpdatedAt() != null ? region.getUpdatedAt() : region.getCreatedAt();
            String source = region.getSourceName();

            if (latestPrediction.isPresent()) {
                FloodPrediction p = latestPrediction.get();
                score = p.getRiskScore();
                level = p.getRiskLevel().toUpperCase();
                timestamp = p.getPredictionTimestamp();
                source = p.getModelVersion();
            }

            // Tally counts
            switch (level) {
                case "LOW" -> lowCount++;
                case "MODERATE" -> moderateCount++;
                case "HIGH", "CRITICAL" -> highCount++;
                default -> unknownCount++;
            }

            // Apply riskLevelFilter if provided
            if (riskLevelFilter != null && !riskLevelFilter.isBlank()) {
                if (!level.equalsIgnoreCase(riskLevelFilter.trim())) {
                    continue;
                }
            }

            items.add(new RiskMapItemResponse(
                    region.getId(),
                    region.getDistrict(),
                    region.getState(),
                    region.getLatitude(),
                    region.getLongitude(),
                    score,
                    level,
                    timestamp,
                    source,
                    region.getBoundaryGeoJson()
            ));
        }

        return new RiskMapSummaryResponse(
                regions.size(),
                lowCount,
                moderateCount,
                highCount,
                unknownCount,
                items
        );
    }
}
