package com.FloodRadarX.demo.dto;

import java.time.LocalDateTime;

public class RiskMapItemResponse {

    private Long regionId;
    private String districtName;
    private String state;
    private Double latitude;
    private Double longitude;
    private Integer riskScore;
    private String riskLevel; // LOW (Green), MODERATE (Yellow), HIGH (Red), UNKNOWN
    private LocalDateTime lastUpdated;
    private String predictionSource;
    private String boundaryGeoJson;

    public RiskMapItemResponse() {
    }

    public RiskMapItemResponse(Long regionId, String districtName, String state, 
                               Double latitude, Double longitude, Integer riskScore, 
                               String riskLevel, LocalDateTime lastUpdated, 
                               String predictionSource, String boundaryGeoJson) {
        this.regionId = regionId;
        this.districtName = districtName;
        this.state = state;
        this.latitude = latitude;
        this.longitude = longitude;
        this.riskScore = riskScore;
        this.riskLevel = riskLevel;
        this.lastUpdated = lastUpdated;
        this.predictionSource = predictionSource;
        this.boundaryGeoJson = boundaryGeoJson;
    }

    public Long getRegionId() {
        return regionId;
    }

    public void setRegionId(Long regionId) {
        this.regionId = regionId;
    }

    public String getDistrictName() {
        return districtName;
    }

    public void setDistrictName(String districtName) {
        this.districtName = districtName;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Integer getRiskScore() {
        return riskScore;
    }

    public void setRiskScore(Integer riskScore) {
        this.riskScore = riskScore;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public String getPredictionSource() {
        return predictionSource;
    }

    public void setPredictionSource(String predictionSource) {
        this.predictionSource = predictionSource;
    }

    public String getBoundaryGeoJson() {
        return boundaryGeoJson;
    }

    public void setBoundaryGeoJson(String boundaryGeoJson) {
        this.boundaryGeoJson = boundaryGeoJson;
    }
}
