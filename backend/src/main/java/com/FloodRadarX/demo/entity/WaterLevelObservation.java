package com.FloodRadarX.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "water_level_observations")
public class WaterLevelObservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "region_id", nullable = false)
    private Region region;

    @Column(name = "river_name", nullable = false)
    private String riverName;

    @Column(name = "station_name", nullable = false)
    private String stationName;

    @Column(name = "water_level_meters", nullable = false)
    private Double waterLevelMeters;

    @Column(name = "warning_level_meters")
    private Double warningLevelMeters;

    @Column(name = "danger_level_meters")
    private Double dangerLevelMeters;

    @Column(name = "trend")
    private String trend; // RISING, STEADY, FALLING

    @Column(name = "observation_time", nullable = false)
    private LocalDateTime observationTime;

    @Column(name = "data_source", nullable = false)
    private String dataSource; // e.g. "Central Water Commission (CWC) / India-WRIS"

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public WaterLevelObservation() {
    }

    public WaterLevelObservation(Region region, String riverName, String stationName, 
                                 Double waterLevelMeters, Double warningLevelMeters, 
                                 Double dangerLevelMeters, String trend, 
                                 LocalDateTime observationTime, String dataSource) {
        this.region = region;
        this.riverName = riverName;
        this.stationName = stationName;
        this.waterLevelMeters = waterLevelMeters;
        this.warningLevelMeters = warningLevelMeters;
        this.dangerLevelMeters = dangerLevelMeters;
        this.trend = trend;
        this.observationTime = observationTime;
        this.dataSource = dataSource;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.observationTime == null) {
            this.observationTime = LocalDateTime.now();
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
