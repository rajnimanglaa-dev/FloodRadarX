package com.FloodRadarX.demo.controller;

import com.FloodRadarX.demo.dto.ApiResponse;
import com.FloodRadarX.demo.dto.HistoricalFloodRequest;
import com.FloodRadarX.demo.dto.HistoricalFloodResponse;
import com.FloodRadarX.demo.service.HistoricalFloodService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flood-history")
@CrossOrigin(origins = "*")
public class FloodHistoryController {

    private final HistoricalFloodService historicalFloodService;

    public FloodHistoryController(HistoricalFloodService historicalFloodService) {
        this.historicalFloodService = historicalFloodService;
    }

    @GetMapping("/region/{regionId}")
    public ResponseEntity<ApiResponse<List<HistoricalFloodResponse>>> getByRegion(@PathVariable Long regionId) {
        List<HistoricalFloodResponse> records = historicalFloodService.getByRegionId(regionId);
        return ResponseEntity.ok(ApiResponse.success("Historical flood events for region retrieved", records));
    }

    @GetMapping("/district")
    public ResponseEntity<ApiResponse<List<HistoricalFloodResponse>>> getByDistrict(@RequestParam String name) {
        List<HistoricalFloodResponse> records = historicalFloodService.getByDistrict(name);
        return ResponseEntity.ok(ApiResponse.success("Historical flood events for district '" + name + "' retrieved", records));
    }

    @GetMapping("/year/{year}")
    public ResponseEntity<ApiResponse<List<HistoricalFloodResponse>>> getByYear(@PathVariable Integer year) {
        List<HistoricalFloodResponse> records = historicalFloodService.getByYear(year);
        return ResponseEntity.ok(ApiResponse.success("Historical flood events for year " + year + " retrieved", records));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<HistoricalFloodResponse>>> getAllRecords() {
        List<HistoricalFloodResponse> records = historicalFloodService.getAll();
        return ResponseEntity.ok(ApiResponse.success("All historical flood events retrieved", records));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<HistoricalFloodResponse>> createRecord(@Valid @RequestBody HistoricalFloodRequest request) {
        HistoricalFloodResponse created = historicalFloodService.createRecord(request);
        return new ResponseEntity<>(ApiResponse.success("Historical flood record created", created), HttpStatus.CREATED);
    }
}
