package com.FloodRadarX.demo.controller;

import com.FloodRadarX.demo.dto.*;
import com.FloodRadarX.demo.entity.Region;
import com.FloodRadarX.demo.service.HistoricalFloodService;
import com.FloodRadarX.demo.service.RegionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/regions")
@CrossOrigin(origins = "*")
public class RegionController {

    private final RegionService regionService;
    private final HistoricalFloodService historicalFloodService;

    public RegionController(RegionService regionService, HistoricalFloodService historicalFloodService) {
        this.regionService = regionService;
        this.historicalFloodService = historicalFloodService;
    }

    // 1. Preserved exact original endpoint: GET /api/regions/search?name=Ludhiana
    @GetMapping("/search")
    public List<Region> searchRegions(@RequestParam String name) {
        return regionService.searchRegions(name);
    }

    // Enhanced search returning DTO across name, district, or state
    @GetMapping("/search-all")
    public ResponseEntity<ApiResponse<List<RegionResponse>>> searchAcrossFields(@RequestParam String query) {
        List<RegionResponse> results = regionService.searchAcrossFields(query);
        return ResponseEntity.ok(ApiResponse.success("Search results retrieved", results));
    }

    // Search districts by state: GET /api/regions/by-state?state=Punjab
    @GetMapping("/by-state")
    public ResponseEntity<ApiResponse<List<RegionResponse>>> getRegionsByState(@RequestParam String state) {
        List<RegionResponse> results = regionService.getRegionsByState(state);
        return ResponseEntity.ok(ApiResponse.success("Districts in " + state + " retrieved", results));
    }

    // Retrieve complete region details by ID including prediction, historical floods, weather, and shelters
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RegionDetailResponse>> getRegionDetails(@PathVariable Long id) {
        RegionDetailResponse detail = regionService.getRegionDetail(id);
        return ResponseEntity.ok(ApiResponse.success("Region details retrieved successfully", detail));
    }

    // Retrieve geographical coordinates and boundary GeoJSON
    @GetMapping("/{id}/boundary")
    public ResponseEntity<ApiResponse<RegionBoundaryResponse>> getRegionBoundary(@PathVariable Long id) {
        RegionBoundaryResponse boundary = regionService.getRegionBoundary(id);
        return ResponseEntity.ok(ApiResponse.success("Region boundary retrieved successfully", boundary));
    }

    // Retrieve historical flood events associated with the region
    @GetMapping("/{id}/history")
    public ResponseEntity<ApiResponse<List<HistoricalFloodResponse>>> getRegionFloodHistory(@PathVariable Long id) {
        List<HistoricalFloodResponse> history = historicalFloodService.getByRegionId(id);
        return ResponseEntity.ok(ApiResponse.success("Historical flood events for region retrieved", history));
    }

    // List all registered regions
    @GetMapping
    public ResponseEntity<ApiResponse<List<RegionResponse>>> getAllRegions() {
        List<RegionResponse> regions = regionService.getAllRegions();
        return ResponseEntity.ok(ApiResponse.success("All regions retrieved successfully", regions));
    }

    // Create a new region with verified coordinates and optional boundary GeoJSON
    @PostMapping
    public ResponseEntity<ApiResponse<RegionResponse>> createRegion(@Valid @RequestBody RegionRequest request) {
        RegionResponse created = regionService.createRegion(request);
        return new ResponseEntity<>(ApiResponse.success("Region registered successfully", created), HttpStatus.CREATED);
    }
}
