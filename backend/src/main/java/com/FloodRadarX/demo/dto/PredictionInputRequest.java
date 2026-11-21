package com.FloodRadarX.demo.dto;

import jakarta.validation.constraints.NotNull;

public class PredictionInputRequest {

    @NotNull(message = "Region ID is required")
    private Long regionId;

    private Double rainfallMm;
    private Double riverWaterLevelMeters;
    private Double soilMoisturePercent;
    private String weatherForecastTrend;

    public PredictionInputRequest() {
    }

    public PredictionInputRequest(Long regionId, Double rainfallMm, Double riverWaterLevelMeters, 
                                  Double soilMoisturePercent, String weatherForecastTrend) {
        this.regionId = regionId;
        this.rainfallMm = rainfallMm;
        this.riverWaterLevelMeters = riverWaterLevelMeters;
        this.soilMoisturePercent = soilMoisturePercent;
        this.weatherForecastTrend = weatherForecastTrend;
    }

    public Long getRegionId() {
        return regionId;
    }

    public void setRegionId(Long regionId) {
        this.regionId = regionId;
    }

    public Double getRainfallMm() {
        return rainfallMm;
    }

    public void setRainfallMm(Double rainfallMm) {
        this.rainfallMm = rainfallMm;
    }

    public Double getRiverWaterLevelMeters() {
        return riverWaterLevelMeters;
    }

    public void setRiverWaterLevelMeters(Double riverWaterLevelMeters) {
        this.riverWaterLevelMeters = riverWaterLevelMeters;
    }

    public Double getSoilMoisturePercent() {
        return soilMoisturePercent;
    }

    public void setSoilMoisturePercent(Double soilMoisturePercent) {
        this.soilMoisturePercent = soilMoisturePercent;
    }

    public String getWeatherForecastTrend() {
        return weatherForecastTrend;
    }

    public void setWeatherForecastTrend(String weatherForecastTrend) {
        this.weatherForecastTrend = weatherForecastTrend;
    }
}
