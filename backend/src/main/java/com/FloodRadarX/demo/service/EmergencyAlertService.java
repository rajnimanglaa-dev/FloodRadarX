package com.FloodRadarX.demo.service;

import com.FloodRadarX.demo.dto.*;
import com.FloodRadarX.demo.entity.*;
import com.FloodRadarX.demo.exception.ResourceNotFoundException;
import com.FloodRadarX.demo.repository.AlertRepository;
import com.FloodRadarX.demo.repository.EmergencyContactRepository;
import com.FloodRadarX.demo.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmergencyAlertService {

    private static final Logger logger = LoggerFactory.getLogger(EmergencyAlertService.class);

    private final AlertRepository alertRepository;
    private final EmergencyContactRepository emergencyContactRepository;
    private final UserRepository userRepository;
    private final SmsService smsService;
    private final RegionService regionService;

    public EmergencyAlertService(AlertRepository alertRepository,
                                 EmergencyContactRepository emergencyContactRepository,
                                 UserRepository userRepository,
                                 SmsService smsService,
                                 RegionService regionService) {
        this.alertRepository = alertRepository;
        this.emergencyContactRepository = emergencyContactRepository;
        this.userRepository = userRepository;
        this.smsService = smsService;
        this.regionService = regionService;
    }

    @Transactional
    public AlertResponse broadcastAlert(AlertBroadcastRequest request) {
        Region region = regionService.findRegionById(request.getRegionId());

        Alert alert = new Alert(
                region,
                request.getRiskLevel().trim().toUpperCase(),
                request.getTitle().trim(),
                request.getMessage().trim(),
                request.getSeverity().trim().toUpperCase(),
                LocalDateTime.now(),
                request.isBroadcastToEmergency(),
                request.isBroadcastToUsers()
        );

        Alert savedAlert = alertRepository.save(alert);
        int dispatchedCount = 0;

        // 1. Alert Verified NGOs & Emergency Responders (NDRF, SDRF, DDMA)
        if (request.isBroadcastToEmergency()) {
            List<EmergencyContact> verifiedContacts = emergencyContactRepository
                    .findVerifiedForDistrictOrState(region.getDistrict(), region.getState());

            for (EmergencyContact contact : verifiedContacts) {
                String smsContent = String.format("[FloodRadarX EMERGENCY] %s in %s, %s. %s", 
                        request.getTitle(), region.getDistrict(), region.getState(), request.getMessage());
                smsService.sendSmsAlert(savedAlert, contact.getPhoneNumber(), contact.getOrganisationName(), smsContent);
                dispatchedCount++;
            }
            logger.info("Notified {} verified emergency services/NGOs for region {}", 
                        verifiedContacts.size(), region.getName());
        }

        // 2. Alert Registered Users with preferred district matching this region
        if (request.isBroadcastToUsers()) {
            List<User> affectedUsers = userRepository.findByPreferredDistrictIgnoreCase(region.getDistrict());
            for (User user : affectedUsers) {
                String userSms = String.format("[FloodRadarX ALERT] Attention %s: %s in %s. Stay safe and monitor local advisories.", 
                        user.getFullName(), request.getTitle(), region.getDistrict());
                smsService.sendSmsAlert(savedAlert, user.getPhoneNumber(), user.getFullName(), userSms);
                dispatchedCount++;
            }
            logger.info("Notified {} registered users in district {}", affectedUsers.size(), region.getDistrict());
        }

        return mapToResponse(savedAlert, dispatchedCount);
    }

    public List<AlertResponse> getActiveAlerts() {
        return alertRepository.findByIsActiveTrueOrderByAlertTimestampDesc()
                .stream()
                .map(a -> mapToResponse(a, 0))
                .collect(Collectors.toList());
    }

    public List<AlertResponse> getAlertsByRegion(Long regionId) {
        return alertRepository.findByRegionIdOrderByAlertTimestampDesc(regionId)
                .stream()
                .map(a -> mapToResponse(a, 0))
                .collect(Collectors.toList());
    }

    public List<AlertResponse> getAllAlerts() {
        return alertRepository.findTop20ByOrderByAlertTimestampDesc()
                .stream()
                .map(a -> mapToResponse(a, 0))
                .collect(Collectors.toList());
    }

    // Emergency Contacts Management
    public List<EmergencyContactResponse> getEmergencyContacts(String district, String state) {
        if (district != null && !district.isBlank()) {
            return emergencyContactRepository.findByDistrictIgnoreCase(district)
                    .stream()
                    .map(this::mapContactToResponse)
                    .collect(Collectors.toList());
        }
        if (state != null && !state.isBlank()) {
            return emergencyContactRepository.findByStateIgnoreCase(state)
                    .stream()
                    .map(this::mapContactToResponse)
                    .collect(Collectors.toList());
        }
        return emergencyContactRepository.findAll()
                .stream()
                .map(this::mapContactToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public EmergencyContactResponse createEmergencyContact(EmergencyContactRequest request) {
        EmergencyContact contact = new EmergencyContact(
                request.getOrganisationName().trim(),
                request.getOrganisationType().trim().toUpperCase(),
                request.getPhoneNumber().trim(),
                request.getEmail() != null ? request.getEmail().trim() : null,
                request.getServiceArea(),
                request.getDistrict().trim(),
                request.getState().trim(),
                request.getVerificationStatus() != null ? request.getVerificationStatus().trim().toUpperCase() : "VERIFIED"
        );
        EmergencyContact saved = emergencyContactRepository.save(contact);
        return mapContactToResponse(saved);
    }

    @Transactional
    public EmergencyContactResponse updateVerificationStatus(Long id, String status) {
        EmergencyContact contact = emergencyContactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Emergency contact not found with ID: " + id));
        contact.setVerificationStatus(status.trim().toUpperCase());
        EmergencyContact updated = emergencyContactRepository.save(contact);
        return mapContactToResponse(updated);
    }

    private AlertResponse mapToResponse(Alert a, int smsCount) {
        return new AlertResponse(
                a.getId(),
                a.getRegion().getId(),
                a.getRegion().getName(),
                a.getRegion().getDistrict(),
                a.getRegion().getState(),
                a.getRiskLevel(),
                a.getTitle(),
                a.getMessage(),
                a.getSeverity(),
                a.getAlertTimestamp(),
                a.isActive(),
                a.isBroadcastToEmergency(),
                a.isBroadcastToUsers(),
                smsCount
        );
    }

    private EmergencyContactResponse mapContactToResponse(EmergencyContact c) {
        return new EmergencyContactResponse(
                c.getId(),
                c.getOrganisationName(),
                c.getOrganisationType(),
                c.getPhoneNumber(),
                c.getEmail(),
                c.getServiceArea(),
                c.getDistrict(),
                c.getState(),
                c.getVerificationStatus()
        );
    }
}
