package com.FloodRadarX.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class HistoricalFloodRequest {

    @NotNull(message = "Region ID is required")
    private Long regionId;

    @NotNull(message = "Event year is required")
    private Integer eventYear;

    private LocalDate eventDate;

    @NotBlank(message = "Severity is required (e.g., LOW, MODERATE, HIGH, SEVERE, CATASTROPHIC)")
    private String severity;

    private Double inundatedAreaSqKm;
    private String description;

    @NotBlank(message = "Data source is required (e.g., ISRO-NRSC Bhuvan, CWC)")
    private String dataSource;

    private String sourceUrl;
    private LocalDate datasetObservationDate;

    public HistoricalFloodRequest() {
    }

    public HistoricalFloodRequest(Long regionId, Integer eventYear, LocalDate eventDate, 
                                  String severity, Double inundatedAreaSqKm, String description, 
                                  String dataSource, String sourceUrl, LocalDate datasetObservationDate) {
        this.regionId = regionId;
        this.eventYear = eventYear;
        this.eventDate = eventDate;
        this.severity = severity;
        this.inundatedAreaSqKm = inundatedAreaSqKm;
        this.description = description;
        this.dataSource = dataSource;
        this.sourceUrl = sourceUrl;
        this.datasetObservationDate = datasetObservationDate;
    }

    public Long getRegionId() {
        return regionId;
    }

    public void setRegionId(Long regionId) {
        this.regionId = regionId;
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
}
