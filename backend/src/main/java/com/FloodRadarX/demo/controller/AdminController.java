package com.FloodRadarX.demo.controller;

import com.FloodRadarX.demo.dto.*;
import com.FloodRadarX.demo.service.AdminService;
import com.FloodRadarX.demo.service.EmergencyAlertService;
import com.FloodRadarX.demo.service.ShelterService;
import com.FloodRadarX.demo.service.SmsService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminService adminService;
    private final ShelterService shelterService;
    private final EmergencyAlertService emergencyAlertService;
    private final SmsService smsService;

    public AdminController(AdminService adminService,
                           ShelterService shelterService,
                           EmergencyAlertService emergencyAlertService,
                           SmsService smsService) {
        this.adminService = adminService;
        this.shelterService = shelterService;
        this.emergencyAlertService = emergencyAlertService;
        this.smsService = smsService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardStatsResponse>> getDashboardStats() {
        AdminDashboardStatsResponse stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Admin dashboard statistics retrieved", stats));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserProfileResponse>>> getAllUsers() {
        List<UserProfileResponse> users = adminService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("User list retrieved", users));
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<UserProfileResponse>> toggleUserStatus(
            @PathVariable Long id,
            @RequestParam boolean enabled) {
        UserProfileResponse updated = adminService.toggleUserStatus(id, enabled);
        return ResponseEntity.ok(ApiResponse.success("User status updated", updated));
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateUserRole(
            @PathVariable Long id,
            @RequestParam String role) {
        UserProfileResponse updated = adminService.updateUserRole(id, role);
        return ResponseEntity.ok(ApiResponse.success("User role updated", updated));
    }

    @DeleteMapping("/regions/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRegion(@PathVariable Long id) {
        adminService.deleteRegion(id);
        return ResponseEntity.ok(ApiResponse.success("Region deleted successfully", null));
    }

    @PostMapping("/shelters")
    public ResponseEntity<ApiResponse<ShelterResponse>> createShelter(@Valid @RequestBody ShelterRequest request) {
        ShelterResponse shelter = shelterService.createShelter(request);
        return new ResponseEntity<>(ApiResponse.success("Shelter registered successfully", shelter), HttpStatus.CREATED);
    }

    @PatchMapping("/shelters/{id}/verification")
    public ResponseEntity<ApiResponse<ShelterResponse>> verifyShelter(
            @PathVariable Long id,
            @RequestParam String status) {
        ShelterResponse updated = shelterService.updateVerificationStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Shelter verification updated", updated));
    }

    @GetMapping("/emergency-contacts")
    public ResponseEntity<ApiResponse<List<EmergencyContactResponse>>> getAllContacts(
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String state) {
        List<EmergencyContactResponse> contacts = emergencyAlertService.getEmergencyContacts(district, state);
        return ResponseEntity.ok(ApiResponse.success("Emergency contacts retrieved", contacts));
    }

    @PostMapping("/emergency-contacts")
    public ResponseEntity<ApiResponse<EmergencyContactResponse>> createEmergencyContact(
            @Valid @RequestBody EmergencyContactRequest request) {
        EmergencyContactResponse contact = emergencyAlertService.createEmergencyContact(request);
        return new ResponseEntity<>(ApiResponse.success("Emergency organization registered", contact), HttpStatus.CREATED);
    }

    @PatchMapping("/emergency-contacts/{id}/verification")
    public ResponseEntity<ApiResponse<EmergencyContactResponse>> verifyEmergencyContact(
            @PathVariable Long id,
            @RequestParam String status) {
        EmergencyContactResponse updated = emergencyAlertService.updateVerificationStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Emergency organization verification updated", updated));
    }

    @GetMapping("/sms-logs")
    public ResponseEntity<ApiResponse<List<SmsLogResponse>>> getSmsLogs() {
        List<SmsLogResponse> logs = smsService.getAllLogs();
        return ResponseEntity.ok(ApiResponse.success("SMS dispatch logs retrieved", logs));
    }
}
