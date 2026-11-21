package com.FloodRadarX.demo.dto;

import java.time.LocalDateTime;

public class RegionResponse {

    private Long id;
    private String name;
    private String district;
    private String state;
    private Double latitude;
    private Double longitude;
    private String boundaryGeoJson;
    private String sourceName;
    private String datasetVersion;
    private LocalDateTime updatedAt;

    public RegionResponse() {
    }

    public RegionResponse(Long id, String name, String district, String state, 
                          Double latitude, Double longitude, String boundaryGeoJson, 
                          String sourceName, String datasetVersion, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.district = district;
        this.state = state;
        this.latitude = latitude;
        this.longitude = longitude;
        this.boundaryGeoJson = boundaryGeoJson;
        this.sourceName = sourceName;
        this.datasetVersion = datasetVersion;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public String getBoundaryGeoJson() {
        return boundaryGeoJson;
    }

    public void setBoundaryGeoJson(String boundaryGeoJson) {
        this.boundaryGeoJson = boundaryGeoJson;
    }

    public String getSourceName() {
        return sourceName;
    }

    public void setSourceName(String sourceName) {
        this.sourceName = sourceName;
    }

    public String getDatasetVersion() {
        return datasetVersion;
    }

    public void setDatasetVersion(String datasetVersion) {
        this.datasetVersion = datasetVersion;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
