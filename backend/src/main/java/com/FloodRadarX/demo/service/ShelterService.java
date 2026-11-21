package com.FloodRadarX.demo.service;

import com.FloodRadarX.demo.dto.ShelterRequest;
import com.FloodRadarX.demo.dto.ShelterResponse;
import com.FloodRadarX.demo.entity.Shelter;
import com.FloodRadarX.demo.exception.ResourceNotFoundException;
import com.FloodRadarX.demo.repository.ShelterRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShelterService {

    private final ShelterRepository shelterRepository;

    public ShelterService(ShelterRepository shelterRepository) {
        this.shelterRepository = shelterRepository;
    }

    public List<ShelterResponse> findByDistrict(String district) {
        return shelterRepository.findByDistrictIgnoreCase(district)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ShelterResponse> findNearby(Double userLat, Double userLng, Double radiusKm) {
        double maxRadius = (radiusKm != null && radiusKm > 0) ? radiusKm : 50.0; // default 50 km

        return shelterRepository.findAll()
                .stream()
                .map(s -> {
                    ShelterResponse resp = mapToResponse(s);
                    double distance = calculateHaversineDistanceKm(userLat, userLng, s.getLatitude(), s.getLongitude());
                    resp.setDistanceKm(Math.round(distance * 100.0) / 100.0);
                    return resp;
                })
                .filter(s -> s.getDistanceKm() <= maxRadius)
                .sorted(Comparator.comparingDouble(ShelterResponse::getDistanceKm))
                .collect(Collectors.toList());
    }

    public ShelterResponse getById(Long id) {
        Shelter shelter = shelterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shelter not found with ID: " + id));
        return mapToResponse(shelter);
    }

    public List<ShelterResponse> getAllShelters() {
        return shelterRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ShelterResponse createShelter(ShelterRequest request) {
        Shelter shelter = new Shelter(
                request.getName().trim(),
                request.getAddress().trim(),
                request.getDistrict().trim(),
                request.getState().trim(),
                request.getLatitude(),
                request.getLongitude(),
                request.getCapacity(),
                request.getContactNumber(),
                request.getVerificationStatus() != null ? request.getVerificationStatus().trim().toUpperCase() : "VERIFIED",
                request.getDataSource() != null ? request.getDataSource().trim() : "Admin Entry"
        );

        Shelter saved = shelterRepository.save(shelter);
        return mapToResponse(saved);
    }

    @Transactional
    public ShelterResponse updateVerificationStatus(Long id, String status) {
        Shelter shelter = shelterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shelter not found with ID: " + id));
        shelter.setVerificationStatus(status.trim().toUpperCase());
        Shelter updated = shelterRepository.save(shelter);
        return mapToResponse(updated);
    }

    // Haversine formula to compute great-circle distance between two points on Earth in Kilometers
    private double calculateHaversineDistanceKm(double lat1, double lon1, double lat2, double lon2) {
        final double R = 6371.0; // Radius of the Earth in km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private ShelterResponse mapToResponse(Shelter s) {
        return new ShelterResponse(
                s.getId(),
                s.getName(),
                s.getAddress(),
                s.getDistrict(),
                s.getState(),
                s.getLatitude(),
                s.getLongitude(),
                s.getCapacity(),
                s.getContactNumber(),
                s.getVerificationStatus(),
                s.getDataSource()
        );
    }
}
