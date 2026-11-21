package com.FloodRadarX.demo.dto;

import java.time.LocalDateTime;

public class WeatherDataResponse {

    private Long id;
    private Long regionId;
    private String regionName;
    private String district;
    private String state;
    private Double rainfallMm;
    private Double temperatureCelsius;
    private Double humidityPercent;
    private LocalDateTime observationTime;
    private String dataSource;
    private String rawDataRef;

    public WeatherDataResponse() {
    }

    public WeatherDataResponse(Long id, Long regionId, String regionName, String district, 
                               String state, Double rainfallMm, Double temperatureCelsius, 
                               Double humidityPercent, LocalDateTime observationTime, 
                               String dataSource, String rawDataRef) {
        this.id = id;
        this.regionId = regionId;
        this.regionName = regionName;
        this.district = district;
        this.state = state;
        this.rainfallMm = rainfallMm;
        this.temperatureCelsius = temperatureCelsius;
        this.humidityPercent = humidityPercent;
        this.observationTime = observationTime;
        this.dataSource = dataSource;
        this.rawDataRef = rawDataRef;
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
