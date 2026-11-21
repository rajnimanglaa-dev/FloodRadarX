package com.FloodRadarX.demo.controller;

import com.FloodRadarX.demo.dto.ApiResponse;
import com.FloodRadarX.demo.dto.RiskMapSummaryResponse;
import com.FloodRadarX.demo.service.RiskMapService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/risk-map")
@CrossOrigin(origins = "*")
public class RiskMapController {

    private final RiskMapService riskMapService;

    public RiskMapController(RiskMapService riskMapService) {
        this.riskMapService = riskMapService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<RiskMapSummaryResponse>> getRiskMap(
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String riskLevel) {
        RiskMapSummaryResponse summary = riskMapService.getRiskMap(state, riskLevel);
        return ResponseEntity.ok(ApiResponse.success("Risk map data retrieved successfully", summary));
    }
}
