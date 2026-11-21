package com.FloodRadarX.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class WaterLevelRequest {

    @NotNull(message = "Region ID is required")
    private Long regionId;

    @NotBlank(message = "River name is required")
    private String riverName;

    @NotBlank(message = "Station name is required")
    private String stationName;

    @NotNull(message = "Water level in meters is required")
    private Double waterLevelMeters;

    private Double warningLevelMeters;
    private Double dangerLevelMeters;
    private String trend; // RISING, STEADY, FALLING
    private LocalDateTime observationTime;

    @NotBlank(message = "Data source is required (e.g., CWC / India-WRIS)")
    private String dataSource;

    public WaterLevelRequest() {
    }

    public WaterLevelRequest(Long regionId, String riverName, String stationName, 
                             Double waterLevelMeters, Double warningLevelMeters, 
                             Double dangerLevelMeters, String trend, 
                             LocalDateTime observationTime, String dataSource) {
        this.regionId = regionId;
        this.riverName = riverName;
        this.stationName = stationName;
        this.waterLevelMeters = waterLevelMeters;
        this.warningLevelMeters = warningLevelMeters;
        this.dangerLevelMeters = dangerLevelMeters;
        this.trend = trend;
        this.observationTime = observationTime;
        this.dataSource = dataSource;
    }

    public Long getRegionId() {
        return regionId;
    }

    public void setRegionId(Long regionId) {
        this.regionId = regionId;
    }

    public String getRiverName() {
        return riverName;
    }

    public void setRiverName(String riverName) {
        this.riverName = riverName;
    }

    public String getStationName() {
        return stationName;
    }

    public void setStationName(String stationName) {
        this.stationName = stationName;
    }

    public Double getWaterLevelMeters() {
        return waterLevelMeters;
    }

    public void setWaterLevelMeters(Double waterLevelMeters) {
        this.waterLevelMeters = waterLevelMeters;
    }

    public Double getWarningLevelMeters() {
        return warningLevelMeters;
    }

    public void setWarningLevelMeters(Double warningLevelMeters) {
        this.warningLevelMeters = warningLevelMeters;
    }

    public Double getDangerLevelMeters() {
        return dangerLevelMeters;
    }

    public void setDangerLevelMeters(Double dangerLevelMeters) {
        this.dangerLevelMeters = dangerLevelMeters;
    }

    public String getTrend() {
        return trend;
    }

    public void setTrend(String trend) {
        this.trend = trend;
    }

    public LocalDateTime getObservationTime() {
        return observationTime;
    }

    public void setObservationTime(LocalDateTime observationTime) {
        this.observationTime = observationTime;
    }

    public String getDataSource() {
        return dataSource;
    }

    public void setDataSource(String dataSource) {
        this.dataSource = dataSource;
    }
}
