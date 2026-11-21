package com.FloodRadarX.demo.service;

import com.FloodRadarX.demo.dto.RegionResponse;
import com.FloodRadarX.demo.entity.Region;
import com.FloodRadarX.demo.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RegionServiceTest {

    @Mock
    private RegionRepository regionRepository;
    @Mock
    private HistoricalFloodRepository historicalFloodRepository;
    @Mock
    private FloodPredictionRepository floodPredictionRepository;
    @Mock
    private WeatherDataRepository weatherDataRepository;
    @Mock
    private SatelliteDataRepository satelliteDataRepository;
    @Mock
    private ShelterRepository shelterRepository;

    private RegionService regionService;

    @BeforeEach
    void setUp() {
        regionService = new RegionService(
                regionRepository, historicalFloodRepository, floodPredictionRepository,
                weatherDataRepository, satelliteDataRepository, shelterRepository
        );
    }

    @Test
    void testSearchRegionsPreservedMethod() {
        Region region = new Region("Ludhiana", "Ludhiana", "Punjab", 30.9010, 75.8573);
        region.setId(1L);

        when(regionRepository.findByNameContainingIgnoreCase("Ludhiana")).thenReturn(List.of(region));

        List<Region> result = regionService.searchRegions("Ludhiana");

        assertEquals(1, result.size());
        assertEquals("Ludhiana", result.get(0).getName());
    }

    @Test
    void testGetRegionByIdReturnsDto() {
        Region region = new Region("Patna", "Patna", "Bihar", 25.5941, 85.1376);
        region.setId(2L);
        region.setSourceName("Survey of India");

        when(regionRepository.findById(2L)).thenReturn(Optional.of(region));

        RegionResponse response = regionService.getRegionById(2L);

        assertNotNull(response);
        assertEquals("Patna", response.getName());
        assertEquals("Bihar", response.getState());
        assertEquals("Survey of India", response.getSourceName());
    }
}
