package com.FloodRadarX.demo.dto;

import java.time.LocalDateTime;

public class PredictionResponse {

    private Long regionId;
    private String regionName;
    private String district;
    private String state;
    private Integer riskScore;
    private String riskLevel; // LOW, MODERATE, HIGH, UNKNOWN
    private Integer predictionWindowHours;
    private PredictionFactorsDto factors;
    private LocalDateTime predictionTimestamp;
    private String modelVersion;
    private boolean simulatedFallback;
    private String note;

    public PredictionResponse() {
    }

    public PredictionResponse(Long regionId, String regionName, String district, String state, 
                              Integer riskScore, String riskLevel, Integer predictionWindowHours, 
                              PredictionFactorsDto factors, LocalDateTime predictionTimestamp, 
                              String modelVersion) {
        this.regionId = regionId;
        this.regionName = regionName;
        this.district = district;
        this.state = state;
        this.riskScore = riskScore;
        this.riskLevel = riskLevel;
        this.predictionWindowHours = predictionWindowHours;
        this.factors = factors;
        this.predictionTimestamp = predictionTimestamp;
        this.modelVersion = modelVersion;
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

    public Integer getPredictionWindowHours() {
        return predictionWindowHours;
    }

    public void setPredictionWindowHours(Integer predictionWindowHours) {
        this.predictionWindowHours = predictionWindowHours;
    }

    public PredictionFactorsDto getFactors() {
        return factors;
    }

    public void setFactors(PredictionFactorsDto factors) {
        this.factors = factors;
    }

    public LocalDateTime getPredictionTimestamp() {
        return predictionTimestamp;
    }

    public void setPredictionTimestamp(LocalDateTime predictionTimestamp) {
        this.predictionTimestamp = predictionTimestamp;
    }

    public String getModelVersion() {
        return modelVersion;
    }

    public void setModelVersion(String modelVersion) {
        this.modelVersion = modelVersion;
    }

    public boolean isSimulatedFallback() {
        return simulatedFallback;
    }

    public void setSimulatedFallback(boolean simulatedFallback) {
        this.simulatedFallback = simulatedFallback;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
