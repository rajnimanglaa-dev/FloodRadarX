package com.FloodRadarX.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "weather_data")
public class WeatherData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "region_id", nullable = false)
    private Region region;

    @Column(name = "rainfall_mm", nullable = false)
    private Double rainfallMm;

    @Column(name = "temperature_celsius")
    private Double temperatureCelsius;

    @Column(name = "humidity_percent")
    private Double humidityPercent;

    @Column(name = "observation_time", nullable = false)
    private LocalDateTime observationTime;

    @Column(name = "data_source", nullable = false)
    private String dataSource; // e.g. "India Meteorological Department (IMD)"

    @Column(name = "raw_data_ref")
    private String rawDataRef;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public WeatherData() {
    }

    public WeatherData(Region region, Double rainfallMm, Double temperatureCelsius, 
                       Double humidityPercent, LocalDateTime observationTime, 
                       String dataSource, String rawDataRef) {
        this.region = region;
        this.rainfallMm = rainfallMm;
        this.temperatureCelsius = temperatureCelsius;
        this.humidityPercent = humidityPercent;
        this.observationTime = observationTime;
        this.dataSource = dataSource;
        this.rawDataRef = rawDataRef;
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

    public Double getRainfallMm() {
        return rainfallMm;
    }

    public void setRainfallMm(Double rainfallMm) {
        this.rainfallMm = rainfallMm;
    }

    public Double getTemperatureCelsius() {
        return temperatureCelsius;
    }

    public void setTemperatureCelsius(Double temperatureCelsius) {
        this.temperatureCelsius = temperatureCelsius;
    }

    public Double getHumidityPercent() {
        return humidityPercent;
    }

    public void setHumidityPercent(Double humidityPercent) {
        this.humidityPercent = humidityPercent;
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

    public String getRawDataRef() {
        return rawDataRef;
    }

    public void setRawDataRef(String rawDataRef) {
        this.rawDataRef = rawDataRef;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
