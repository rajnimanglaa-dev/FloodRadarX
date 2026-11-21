package com.FloodRadarX.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class RegionRequest {

    @NotBlank(message = "Region name is required")
    private String name;

    @NotBlank(message = "District is required")
    private String district;

    @NotBlank(message = "State is required")
    private String state;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    private String boundaryGeoJson;
    private String sourceName;
    private String datasetVersion;

    public RegionRequest() {
    }

    public RegionRequest(String name, String district, String state, Double latitude, 
                         Double longitude, String boundaryGeoJson, String sourceName, String datasetVersion) {
        this.name = name;
        this.district = district;
        this.state = state;
        this.latitude = latitude;
        this.longitude = longitude;
        this.boundaryGeoJson = boundaryGeoJson;
        this.sourceName = sourceName;
        this.datasetVersion = datasetVersion;
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
}
