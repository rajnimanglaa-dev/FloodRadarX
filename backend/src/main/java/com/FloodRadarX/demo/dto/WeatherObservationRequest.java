package com.FloodRadarX.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class WeatherObservationRequest {

    @NotNull(message = "Region ID is required")
    private Long regionId;

    @NotNull(message = "Rainfall in mm is required")
    private Double rainfallMm;

    private Double temperatureCelsius;
    private Double humidityPercent;
    private LocalDateTime observationTime;

    @NotBlank(message = "Data source is required (e.g., IMD)")
    private String dataSource;

    private String rawDataRef;

    public WeatherObservationRequest() {
    }

    public WeatherObservationRequest(Long regionId, Double rainfallMm, Double temperatureCelsius, 
                                     Double humidityPercent, LocalDateTime observationTime, 
                                     String dataSource, String rawDataRef) {
        this.regionId = regionId;
        this.rainfallMm = rainfallMm;
        this.temperatureCelsius = temperatureCelsius;
        this.humidityPercent = humidityPercent;
        this.observationTime = observationTime;
        this.dataSource = dataSource;
        this.rawDataRef = rawDataRef;
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
}
