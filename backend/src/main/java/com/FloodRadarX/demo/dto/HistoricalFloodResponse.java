package com.FloodRadarX.demo.dto;

import java.time.LocalDate;

public class HistoricalFloodResponse {

    private Long id;
    private Long regionId;
    private String regionName;
    private String district;
    private String state;
    private Integer eventYear;
    private LocalDate eventDate;
    private String severity;
    private Double inundatedAreaSqKm;
    private String description;
    private String dataSource;
    private String sourceUrl;
    private LocalDate datasetObservationDate;

    public HistoricalFloodResponse() {
    }

    public HistoricalFloodResponse(Long id, Long regionId, String regionName, String district, 
                                   String state, Integer eventYear, LocalDate eventDate, 
                                   String severity, Double inundatedAreaSqKm, String description, 
                                   String dataSource, String sourceUrl, LocalDate datasetObservationDate) {
        this.id = id;
        this.regionId = regionId;
        this.regionName = regionName;
        this.district = district;
        this.state = state;
        this.eventYear = eventYear;
        this.eventDate = eventDate;
        this.severity = severity;
        this.inundatedAreaSqKm = inundatedAreaSqKm;
        this.description = description;
        this.dataSource = dataSource;
        this.sourceUrl = sourceUrl;
        this.datasetObservationDate = datasetObservationDate;
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
