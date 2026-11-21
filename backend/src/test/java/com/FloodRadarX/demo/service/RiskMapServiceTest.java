package com.FloodRadarX.demo.service;

import com.FloodRadarX.demo.dto.RiskMapSummaryResponse;
import com.FloodRadarX.demo.entity.FloodPrediction;
import com.FloodRadarX.demo.entity.Region;
import com.FloodRadarX.demo.repository.FloodPredictionRepository;
import com.FloodRadarX.demo.repository.RegionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RiskMapServiceTest {

    @Mock
    private RegionRepository regionRepository;

    @Mock
    private FloodPredictionRepository floodPredictionRepository;

    private RiskMapService riskMapService;

    @BeforeEach
    void setUp() {
        riskMapService = new RiskMapService(regionRepository, floodPredictionRepository);
    }

    @Test
    void testGetRiskMapCategorization() {
        Region r1 = new Region("Ludhiana", "Ludhiana", "Punjab", 30.9010, 75.8573);
        r1.setId(1L);

        Region r2 = new Region("Patna", "Patna", "Bihar", 25.5941, 85.1376);
        r2.setId(2L);

        Region r3 = new Region("Wayanad", "Wayanad", "Kerala", 11.6854, 76.1320);
        r3.setId(3L);

        when(regionRepository.findAll()).thenReturn(List.of(r1, r2, r3));

        FloodPrediction lowPred = new FloodPrediction(r1, 20, "LOW", 6, "STABLE", "STABLE", null, LocalDateTime.now(), "v1");
        FloodPrediction highPred = new FloodPrediction(r2, 85, "HIGH", 6, "INCREASING", "RISING", null, LocalDateTime.now(), "v1");

        when(floodPredictionRepository.findTopByRegionIdOrderByPredictionTimestampDesc(1L)).thenReturn(Optional.of(lowPred));
        when(floodPredictionRepository.findTopByRegionIdOrderByPredictionTimestampDesc(2L)).thenReturn(Optional.of(highPred));
        when(floodPredictionRepository.findTopByRegionIdOrderByPredictionTimestampDesc(3L)).thenReturn(Optional.empty());

        RiskMapSummaryResponse summary = riskMapService.getRiskMap(null, null);

        assertEquals(3, summary.getTotalRegions());
        assertEquals(1, summary.getLowRiskCount());
        assertEquals(1, summary.getHighRiskCount());
        assertEquals(1, summary.getUnknownRiskCount());
    }
}
