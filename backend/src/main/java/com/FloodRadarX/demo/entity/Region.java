package com.FloodRadarX.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "regions")
public class Region {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String district;

    @Column(nullable = false)
    private String state;

    private Double latitude;
    private Double longitude;

    // Storing district boundary geometry (GeoJSON polygon/multipolygon) separately from lat/long
    @Lob
    @Column(name = "boundary_geojson", columnDefinition = "LONGTEXT")
    private String boundaryGeoJson;

    @Column(name = "source_name")
    private String sourceName;

    @Column(name = "dataset_version")
    private String datasetVersion;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Region() {
    }

    public Region(String name, String district, String state, Double latitude, Double longitude) {
        this.name = name;
        this.district = district;
        this.state = state;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public Region(String name, String district, String state, Double latitude, Double longitude, 
                  String boundaryGeoJson, String sourceName, String datasetVersion) {
        this.name = name;
        this.district = district;
        this.state = state;
        this.latitude = latitude;
        this.longitude = longitude;
        this.boundaryGeoJson = boundaryGeoJson;
        this.sourceName = sourceName;
        this.datasetVersion = datasetVersion;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
