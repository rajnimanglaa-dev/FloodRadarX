package com.FloodRadarX.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "historical_flood_events")
public class HistoricalFlood {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "region_id", nullable = false)
    private Region region;

    @Column(name = "event_year", nullable = false)
    private Integer eventYear;

    @Column(name = "event_date")
    private LocalDate eventDate;

    @Column(name = "severity", nullable = false)
    private String severity; // LOW, MODERATE, HIGH, SEVERE, CATASTROPHIC

    @Column(name = "inundated_area_sq_km")
    private Double inundatedAreaSqKm;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "data_source", nullable = false)
    private String dataSource; // e.g. "ISRO-NRSC Bhuvan Flood Portal", "CWC"

    @Column(name = "source_url", length = 500)
    private String sourceUrl;

    @Column(name = "dataset_observation_date")
    private LocalDate datasetObservationDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public HistoricalFlood() {
    }

    public HistoricalFlood(Region region, Integer eventYear, LocalDate eventDate, String severity, 
                           Double inundatedAreaSqKm, String description, String dataSource, 
                           String sourceUrl, LocalDate datasetObservationDate) {
        this.region = region;
        this.eventYear = eventYear;
        this.eventDate = eventDate;
        this.severity = severity;
        this.inundatedAreaSqKm = inundatedAreaSqKm;
        this.description = description;
        this.dataSource = dataSource;
        this.sourceUrl = sourceUrl;
        this.datasetObservationDate = datasetObservationDate;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
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

    public Integer getEventYear() {
        return eventYear;
    }

    public void setEventYear(Integer eventYear) {
        this.eventYear = eventYear;
    }

    public LocalDate getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public Double getInundatedAreaSqKm() {
        return inundatedAreaSqKm;
    }

    public void setInundatedAreaSqKm(Double inundatedAreaSqKm) {
        this.inundatedAreaSqKm = inundatedAreaSqKm;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDataSource() {
        return dataSource;
    }

    public void setDataSource(String dataSource) {
        this.dataSource = dataSource;
    }

    public String getSourceUrl() {
        return sourceUrl;
    }

    public void setSourceUrl(String sourceUrl) {
        this.sourceUrl = sourceUrl;
    }

    public LocalDate getDatasetObservationDate() {
        return datasetObservationDate;
    }

    public void setDatasetObservationDate(LocalDate datasetObservationDate) {
        this.datasetObservationDate = datasetObservationDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
