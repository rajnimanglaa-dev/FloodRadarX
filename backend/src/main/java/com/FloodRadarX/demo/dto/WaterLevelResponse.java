package com.FloodRadarX.demo.dto;

import java.time.LocalDateTime;

public class WaterLevelResponse {

    private Long id;
    private Long regionId;
    private String regionName;
    private String district;
    private String state;
    private String riverName;
    private String stationName;
    private Double waterLevelMeters;
    private Double warningLevelMeters;
    private Double dangerLevelMeters;
    private String trend;
    private LocalDateTime observationTime;
    private String dataSource;

    public WaterLevelResponse() {
    }

    public WaterLevelResponse(Long id, Long regionId, String regionName, String district, 
                              String state, String riverName, String stationName, 
                              Double waterLevelMeters, Double warningLevelMeters, 
                              Double dangerLevelMeters, String trend, 
                              LocalDateTime observationTime, String dataSource) {
        this.id = id;
        this.regionId = regionId;
        this.regionName = regionName;
        this.district = district;
        this.state = state;
        this.riverName = riverName;
        this.stationName = stationName;
        this.waterLevelMeters = waterLevelMeters;
        this.warningLevelMeters = warningLevelMeters;
        this.dangerLevelMeters = dangerLevelMeters;
        this.trend = trend;
        this.observationTime = observationTime;
        this.dataSource = dataSource;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRegionId() {
        return regionId;
    }

    public void setRegionId(Long regionId) {
        this.regionId = regionId;
    }

    public String getRegionName() {
        return regionName;
    }

    public void setRegionName(String regionName) {
        this.regionName = regionName;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
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
