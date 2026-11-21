package com.FloodRadarX.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "satellite_data")
public class SatelliteData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "region_id", nullable = false)
    private Region region;

    @Column(name = "satellite_name", nullable = false)
    private String satelliteName; // e.g. "INSAT-3DR", "Sentinel-1 SAR", "RISAT-1A"

    @Column(name = "observation_date", nullable = false)
    private LocalDate observationDate;

    @Column(name = "cloud_cover_percentage")
    private Double cloudCoverPercentage;

    @Column(name = "flood_inundation_detected")
    private Boolean floodInundationDetected;

    @Column(name = "data_source", nullable = false)
    private String dataSource; // e.g. "ISRO-NRSC Bhuvan Flood Portal"

    @Column(name = "product_id")
    private String productId;

    @Column(name = "sensor_type")
    private String sensorType; // Optical, SAR / Microwave

    @Column(name = "notes", length = 500)
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public SatelliteData() {
    }

    public SatelliteData(Region region, String satelliteName, LocalDate observationDate, 
                         Double cloudCoverPercentage, Boolean floodInundationDetected, 
                         String dataSource, String productId, String sensorType, String notes) {
        this.region = region;
        this.satelliteName = satelliteName;
        this.observationDate = observationDate;
        this.cloudCoverPercentage = cloudCoverPercentage;
        this.floodInundationDetected = floodInundationDetected;
        this.dataSource = dataSource;
        this.productId = productId;
        this.sensorType = sensorType;
        this.notes = notes;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.observationDate == null) {
            this.observationDate = LocalDate.now();
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
