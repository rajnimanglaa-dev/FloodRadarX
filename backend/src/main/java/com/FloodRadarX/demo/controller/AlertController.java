package com.FloodRadarX.demo.controller;

import com.FloodRadarX.demo.dto.*;
import com.FloodRadarX.demo.service.EmergencyAlertService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "*")
public class AlertController {

    private final EmergencyAlertService emergencyAlertService;

    public AlertController(EmergencyAlertService emergencyAlertService) {
        this.emergencyAlertService = emergencyAlertService;
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<AlertResponse>>> getActiveAlerts() {
        List<AlertResponse> alerts = emergencyAlertService.getActiveAlerts();
        return ResponseEntity.ok(ApiResponse.success("Active alerts retrieved", alerts));
    }

    @GetMapping("/region/{regionId}")
    public ResponseEntity<ApiResponse<List<AlertResponse>>> getAlertsByRegion(@PathVariable Long regionId) {
        List<AlertResponse> alerts = emergencyAlertService.getAlertsByRegion(regionId);
        return ResponseEntity.ok(ApiResponse.success("Alerts for region retrieved", alerts));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AlertResponse>>> getAllAlerts() {
        List<AlertResponse> alerts = emergencyAlertService.getAllAlerts();
        return ResponseEntity.ok(ApiResponse.success("All recent alerts retrieved", alerts));
    }

    @PostMapping("/broadcast")
    public ResponseEntity<ApiResponse<AlertResponse>> broadcastAlert(@Valid @RequestBody AlertBroadcastRequest request) {
        AlertResponse alert = emergencyAlertService.broadcastAlert(request);
        return new ResponseEntity<>(ApiResponse.success("Alert broadcasted and dispatched to verified services and users", alert), HttpStatus.CREATED);
    }

    @GetMapping("/emergency-contacts")
    public ResponseEntity<ApiResponse<List<EmergencyContactResponse>>> getEmergencyContacts(
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String state) {
        List<EmergencyContactResponse> contacts = emergencyAlertService.getEmergencyContacts(district, state);
        return ResponseEntity.ok(ApiResponse.success("Emergency contacts retrieved", contacts));
    }
}
