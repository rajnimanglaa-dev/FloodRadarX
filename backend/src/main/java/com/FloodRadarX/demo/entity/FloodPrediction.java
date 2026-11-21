package com.FloodRadarX.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "flood_predictions")
public class FloodPrediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "region_id", nullable = false)
    private Region region;

    @Column(name = "risk_score", nullable = false)
    private Integer riskScore;

    @Column(name = "risk_level", nullable = false)
    private String riskLevel; // LOW, MODERATE, HIGH, UNKNOWN

    @Column(name = "prediction_window_hours")
    private Integer predictionWindowHours;

    @Column(name = "rainfall_trend")
    private String rainfallTrend; // INCREASING, STABLE, DECREASING

    @Column(name = "water_level_trend")
    private String waterLevelTrend; // RISING, STABLE, RECEDING

    @Lob
    @Column(name = "raw_response", columnDefinition = "TEXT")
    private String rawResponse;

    @Column(name = "prediction_timestamp", nullable = false)
    private LocalDateTime predictionTimestamp;

    @Column(name = "model_version")
    private String modelVersion;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public FloodPrediction() {
    }

    public FloodPrediction(Region region, Integer riskScore, String riskLevel, 
                           Integer predictionWindowHours, String rainfallTrend, 
                           String waterLevelTrend, String rawResponse, 
                           LocalDateTime predictionTimestamp, String modelVersion) {
        this.region = region;
        this.riskScore = riskScore;
        this.riskLevel = riskLevel;
        this.predictionWindowHours = predictionWindowHours;
        this.rainfallTrend = rainfallTrend;
        this.waterLevelTrend = waterLevelTrend;
        this.rawResponse = rawResponse;
        this.predictionTimestamp = predictionTimestamp;
        this.modelVersion = modelVersion;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.predictionTimestamp == null) {
            this.predictionTimestamp = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Region getRegion() {
        return region;
    }

    public void setRegion(Region region) {
        this.region = region;
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

    public String getRainfallTrend() {
        return rainfallTrend;
    }

    public void setRainfallTrend(String rainfallTrend) {
        this.rainfallTrend = rainfallTrend;
    }

    public String getWaterLevelTrend() {
        return waterLevelTrend;
    }

    public void setWaterLevelTrend(String waterLevelTrend) {
        this.waterLevelTrend = waterLevelTrend;
    }

    public String getRawResponse() {
        return rawResponse;
    }

    public void setRawResponse(String rawResponse) {
        this.rawResponse = rawResponse;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
