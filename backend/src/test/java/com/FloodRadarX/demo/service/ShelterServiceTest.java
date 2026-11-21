package com.FloodRadarX.demo.service;

import com.FloodRadarX.demo.dto.ShelterResponse;
import com.FloodRadarX.demo.entity.Shelter;
import com.FloodRadarX.demo.repository.ShelterRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ShelterServiceTest {

    @Mock
    private ShelterRepository shelterRepository;

    private ShelterService shelterService;

    @BeforeEach
    void setUp() {
        shelterService = new ShelterService(shelterRepository);
    }

    @Test
    void testFindNearbyCalculatesDistanceCorrectly() {
        // Ludhiana coordinates: ~ 30.9010, 75.8573
        Shelter nearShelter = new Shelter(
                "PAU Shelter", "PAU Campus", "Ludhiana", "Punjab",
                30.8990, 75.8150, 1000, "0161-123456", "VERIFIED", "DDMA"
        );
        nearShelter.setId(1L);

        // Amritsar coordinates: ~ 31.6340, 74.8723 (~130 km away from Ludhiana)
        Shelter farShelter = new Shelter(
                "Amritsar Shelter", "Civil Lines", "Amritsar", "Punjab",
                31.6340, 74.8723, 1000, "0183-123456", "VERIFIED", "DDMA"
        );
        farShelter.setId(2L);

        when(shelterRepository.findAll()).thenReturn(List.of(nearShelter, farShelter));

        // Query within 20 km radius of Ludhiana center
        List<ShelterResponse> nearby = shelterService.findNearby(30.9010, 75.8573, 20.0);

        assertEquals(1, nearby.size());
        assertEquals("PAU Shelter", nearby.get(0).getName());
        assertTrue(nearby.get(0).getDistanceKm() < 10.0);
    }
}
