package com.FloodRadarX.demo.dto;

public class ShelterResponse {

    private Long id;
    private String name;
    private String address;
    private String district;
    private String state;
    private Double latitude;
    private Double longitude;
    private Integer capacity;
    private String contactNumber;
    private String verificationStatus;
    private String dataSource;
    private Double distanceKm; // Calculated for nearby queries

    public ShelterResponse() {
    }

    public ShelterResponse(Long id, String name, String address, String district, 
                           String state, Double latitude, Double longitude, 
                           Integer capacity, String contactNumber, 
                           String verificationStatus, String dataSource) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.district = district;
        this.state = state;
        this.latitude = latitude;
        this.longitude = longitude;
        this.capacity = capacity;
        this.contactNumber = contactNumber;
        this.verificationStatus = verificationStatus;
        this.dataSource = dataSource;
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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
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

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(String verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public String getDataSource() {
        return dataSource;
    }

    public void setDataSource(String dataSource) {
        this.dataSource = dataSource;
    }

    public Double getDistanceKm() {
        return distanceKm;
    }

    public void setDistanceKm(Double distanceKm) {
        this.distanceKm = distanceKm;
    }
}
