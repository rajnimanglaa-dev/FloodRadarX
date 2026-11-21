package com.FloodRadarX.demo.controller;

import com.FloodRadarX.demo.dto.ApiResponse;
import com.FloodRadarX.demo.dto.PredictionInputRequest;
import com.FloodRadarX.demo.dto.PredictionResponse;
import com.FloodRadarX.demo.exception.ResourceNotFoundException;
import com.FloodRadarX.demo.service.PythonPredictionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/predict")
@CrossOrigin(origins = "*")
public class PredictionController {

    private final PythonPredictionService pythonPredictionService;

    public PredictionController(PythonPredictionService pythonPredictionService) {
        this.pythonPredictionService = pythonPredictionService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PredictionResponse>> predictRisk(@Valid @RequestBody PredictionInputRequest request) {
        PredictionResponse prediction = pythonPredictionService.predictRisk(request);
        return ResponseEntity.ok(ApiResponse.success("Prediction generated successfully", prediction));
    }

    @GetMapping("/latest/{regionId}")
    public ResponseEntity<ApiResponse<PredictionResponse>> getLatestPrediction(@PathVariable Long regionId) {
        PredictionResponse prediction = pythonPredictionService.getLatestPredictionForRegion(regionId)
                .orElseThrow(() -> new ResourceNotFoundException("No prediction records found for region ID: " + regionId));
        return ResponseEntity.ok(ApiResponse.success("Latest prediction retrieved", prediction));
    }
}
