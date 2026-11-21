package com.FloodRadarX.demo.controller;

import com.FloodRadarX.demo.dto.ApiResponse;
import com.FloodRadarX.demo.dto.ShelterResponse;
import com.FloodRadarX.demo.service.ShelterService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shelters")
@CrossOrigin(origins = "*")
public class ShelterController {

    private final ShelterService shelterService;

    public ShelterController(ShelterService shelterService) {
        this.shelterService = shelterService;
    }

    @GetMapping("/district")
    public ResponseEntity<ApiResponse<List<ShelterResponse>>> getSheltersByDistrict(@RequestParam String name) {
        List<ShelterResponse> shelters = shelterService.findByDistrict(name);
        return ResponseEntity.ok(ApiResponse.success("Shelters in district '" + name + "' retrieved", shelters));
    }

    @GetMapping("/nearby")
    public ResponseEntity<ApiResponse<List<ShelterResponse>>> getNearbyShelters(
            @RequestParam Double lat,
            @RequestParam Double lng,
            @RequestParam(required = false, defaultValue = "50.0") Double radiusKm) {
        List<ShelterResponse> shelters = shelterService.findNearby(lat, lng, radiusKm);
        return ResponseEntity.ok(ApiResponse.success("Nearby shelters within " + radiusKm + " km retrieved", shelters));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ShelterResponse>> getShelterById(@PathVariable Long id) {
        ShelterResponse shelter = shelterService.getById(id);
        return ResponseEntity.ok(ApiResponse.success("Shelter details retrieved", shelter));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ShelterResponse>>> getAllShelters() {
        List<ShelterResponse> shelters = shelterService.getAllShelters();
        return ResponseEntity.ok(ApiResponse.success("All shelters retrieved successfully", shelters));
    }
}
