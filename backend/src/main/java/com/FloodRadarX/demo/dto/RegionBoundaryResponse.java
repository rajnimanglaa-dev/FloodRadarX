package com.FloodRadarX.demo.dto;

public class RegionBoundaryResponse {

    private Long regionId;
    private String name;
    private String district;
    private String state;
    private Double latitude;
    private Double longitude;
    private String boundaryGeoJson;
    private String source;

    public RegionBoundaryResponse() {
    }

    public RegionBoundaryResponse(Long regionId, String name, String district, String state, 
                                  Double latitude, Double longitude, String boundaryGeoJson, String source) {
        this.regionId = regionId;
        this.name = name;
        this.district = district;
        this.state = state;
        this.latitude = latitude;
        this.longitude = longitude;
        this.boundaryGeoJson = boundaryGeoJson;
        this.source = source;
    }

    public Long getRegionId() {
        return regionId;
    }

    public void setRegionId(Long regionId) {
        this.regionId = regionId;
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

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }
}
