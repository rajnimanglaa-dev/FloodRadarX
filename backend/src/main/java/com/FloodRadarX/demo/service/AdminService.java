package com.FloodRadarX.demo.service;

import com.FloodRadarX.demo.dto.*;
import com.FloodRadarX.demo.entity.Role;
import com.FloodRadarX.demo.entity.User;
import com.FloodRadarX.demo.exception.ResourceNotFoundException;
import com.FloodRadarX.demo.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final RegionRepository regionRepository;
    private final HistoricalFloodRepository historicalFloodRepository;
    private final FloodPredictionRepository floodPredictionRepository;
    private final AlertRepository alertRepository;
    private final ShelterRepository shelterRepository;
    private final EmergencyContactRepository emergencyContactRepository;
    private final SmsLogRepository smsLogRepository;

    public AdminService(UserRepository userRepository,
                        RegionRepository regionRepository,
                        HistoricalFloodRepository historicalFloodRepository,
                        FloodPredictionRepository floodPredictionRepository,
                        AlertRepository alertRepository,
                        ShelterRepository shelterRepository,
                        EmergencyContactRepository emergencyContactRepository,
                        SmsLogRepository smsLogRepository) {
        this.userRepository = userRepository;
        this.regionRepository = regionRepository;
        this.historicalFloodRepository = historicalFloodRepository;
        this.floodPredictionRepository = floodPredictionRepository;
        this.alertRepository = alertRepository;
        this.shelterRepository = shelterRepository;
        this.emergencyContactRepository = emergencyContactRepository;
        this.smsLogRepository = smsLogRepository;
    }

    public AdminDashboardStatsResponse getDashboardStats() {
        return new AdminDashboardStatsResponse(
                userRepository.count(),
                regionRepository.count(),
                historicalFloodRepository.count(),
                floodPredictionRepository.count(),
                alertRepository.findByIsActiveTrueOrderByAlertTimestampDesc().size(),
                shelterRepository.count(),
                emergencyContactRepository.count(),
                smsLogRepository.count()
        );
    }

    public List<UserProfileResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(u -> new UserProfileResponse(
                        u.getId(),
                        u.getFullName(),
                        u.getEmail(),
                        u.getPhoneNumber(),
                        u.getRole().name(),
                        u.isEnabled(),
                        u.getPreferredDistrict(),
                        u.getPreferredState()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public UserProfileResponse toggleUserStatus(Long userId, boolean enabled) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        user.setEnabled(enabled);
        User updated = userRepository.save(user);

        return new UserProfileResponse(
                updated.getId(),
                updated.getFullName(),
                updated.getEmail(),
                updated.getPhoneNumber(),
                updated.getRole().name(),
                updated.isEnabled(),
                updated.getPreferredDistrict(),
                updated.getPreferredState()
        );
    }

    @Transactional
    public UserProfileResponse updateUserRole(Long userId, String roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        Role role = Role.valueOf(roleName.toUpperCase().trim());
        user.setRole(role);
        User updated = userRepository.save(user);

        return new UserProfileResponse(
                updated.getId(),
                updated.getFullName(),
                updated.getEmail(),
                updated.getPhoneNumber(),
                updated.getRole().name(),
                updated.isEnabled(),
                updated.getPreferredDistrict(),
                updated.getPreferredState()
        );
    }

    @Transactional
    public void deleteRegion(Long regionId) {
        if (!regionRepository.existsById(regionId)) {
            throw new ResourceNotFoundException("Region not found with ID: " + regionId);
        }
        regionRepository.deleteById(regionId);
    }
}
