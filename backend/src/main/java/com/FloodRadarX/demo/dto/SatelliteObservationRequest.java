package com.FloodRadarX.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class SatelliteObservationRequest {

    @NotNull(message = "Region ID is required")
    private Long regionId;

    @NotBlank(message = "Satellite name is required (e.g., INSAT-3DR, Sentinel-1 SAR)")
    private String satelliteName;

    private LocalDate observationDate;
    private Double cloudCoverPercentage;
    private Boolean floodInundationDetected;

    @NotBlank(message = "Data source is required (e.g., ISRO-NRSC Bhuvan Flood Portal)")
    private String dataSource;

    private String productId;
    private String sensorType;
    private String notes;

    public SatelliteObservationRequest() {
    }

    public SatelliteObservationRequest(Long regionId, String satelliteName, LocalDate observationDate, 
                                       Double cloudCoverPercentage, Boolean floodInundationDetected, 
                                       String dataSource, String productId, String sensorType, String notes) {
        this.regionId = regionId;
        this.satelliteName = satelliteName;
        this.observationDate = observationDate;
        this.cloudCoverPercentage = cloudCoverPercentage;
        this.floodInundationDetected = floodInundationDetected;
        this.dataSource = dataSource;
        this.productId = productId;
        this.sensorType = sensorType;
        this.notes = notes;
    }

    public Long getRegionId() {
        return regionId;
    }

    public void setRegionId(Long regionId) {
        this.regionId = regionId;
    }

    public String getSatelliteName() {
        return satelliteName;
    }

    public void setSatelliteName(String satelliteName) {
        this.satelliteName = satelliteName;
    }

    public LocalDate getObservationDate() {
        return observationDate;
    }

    public void setObservationDate(LocalDate observationDate) {
        this.observationDate = observationDate;
    }

    public Double getCloudCoverPercentage() {
        return cloudCoverPercentage;
    }

    public void setCloudCoverPercentage(Double cloudCoverPercentage) {
        this.cloudCoverPercentage = cloudCoverPercentage;
    }

    public Boolean getFloodInundationDetected() {
        return floodInundationDetected;
    }

    public void setFloodInundationDetected(Boolean floodInundationDetected) {
        this.floodInundationDetected = floodInundationDetected;
    }

    public String getDataSource() {
        return dataSource;
    }

    public void setDataSource(String dataSource) {
        this.dataSource = dataSource;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getSensorType() {
        return sensorType;
    }

    public void setSensorType(String sensorType) {
        this.sensorType = sensorType;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
