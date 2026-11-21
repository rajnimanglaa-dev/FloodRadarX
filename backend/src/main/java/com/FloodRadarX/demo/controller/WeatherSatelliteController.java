package com.FloodRadarX.demo.controller;

import com.FloodRadarX.demo.dto.*;
import com.FloodRadarX.demo.service.WeatherSatelliteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/monitoring")
@CrossOrigin(origins = "*")
public class WeatherSatelliteController {

    private final WeatherSatelliteService weatherSatelliteService;

    public WeatherSatelliteController(WeatherSatelliteService weatherSatelliteService) {
        this.weatherSatelliteService = weatherSatelliteService;
    }

    @PostMapping("/weather")
    public ResponseEntity<ApiResponse<WeatherDataResponse>> recordWeather(@Valid @RequestBody WeatherObservationRequest request) {
        WeatherDataResponse response = weatherSatelliteService.recordWeatherObservation(request);
        return new ResponseEntity<>(ApiResponse.success("Weather observation recorded", response), HttpStatus.CREATED);
    }

    @PostMapping("/satellite")
    public ResponseEntity<ApiResponse<SatelliteDataResponse>> recordSatellite(@Valid @RequestBody SatelliteObservationRequest request) {
        SatelliteDataResponse response = weatherSatelliteService.recordSatelliteObservation(request);
        return new ResponseEntity<>(ApiResponse.success("Satellite observation recorded", response), HttpStatus.CREATED);
    }

    @PostMapping("/water-level")
    public ResponseEntity<ApiResponse<WaterLevelResponse>> recordWaterLevel(@Valid @RequestBody WaterLevelRequest request) {
        WaterLevelResponse response = weatherSatelliteService.recordWaterLevel(request);
        return new ResponseEntity<>(ApiResponse.success("River water-level observation recorded", response), HttpStatus.CREATED);
    }

    @GetMapping("/weather/{regionId}")
    public ResponseEntity<ApiResponse<List<WeatherDataResponse>>> getWeatherByRegion(@PathVariable Long regionId) {
        List<WeatherDataResponse> list = weatherSatelliteService.getWeatherByRegion(regionId);
        return ResponseEntity.ok(ApiResponse.success("Weather observations for region retrieved", list));
    }

    @GetMapping("/satellite/{regionId}")
    public ResponseEntity<ApiResponse<List<SatelliteDataResponse>>> getSatelliteByRegion(@PathVariable Long regionId) {
        List<SatelliteDataResponse> list = weatherSatelliteService.getSatelliteByRegion(regionId);
        return ResponseEntity.ok(ApiResponse.success("Satellite observations for region retrieved", list));
    }

    @GetMapping("/water-level/{regionId}")
    public ResponseEntity<ApiResponse<List<WaterLevelResponse>>> getWaterLevelByRegion(@PathVariable Long regionId) {
        List<WaterLevelResponse> list = weatherSatelliteService.getWaterLevelByRegion(regionId);
        return ResponseEntity.ok(ApiResponse.success("Water-level observations for region retrieved", list));
    }
}
