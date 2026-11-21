package com.FloodRadarX.demo.dto;

public class EmergencyContactResponse {

    private Long id;
    private String organisationName;
    private String organisationType;
    private String phoneNumber;
    private String email;
    private String serviceArea;
    private String district;
    private String state;
    private String verificationStatus;

    public EmergencyContactResponse() {
    }

    public EmergencyContactResponse(Long id, String organisationName, String organisationType, 
                                    String phoneNumber, String email, String serviceArea, 
                                    String district, String state, String verificationStatus) {
        this.id = id;
        this.organisationName = organisationName;
        this.organisationType = organisationType;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.serviceArea = serviceArea;
        this.district = district;
        this.state = state;
        this.verificationStatus = verificationStatus;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOrganisationName() {
        return organisationName;
    }

    public void setOrganisationName(String organisationName) {
        this.organisationName = organisationName;
    }

    public String getOrganisationType() {
        return organisationType;
    }

    public void setOrganisationType(String organisationType) {
        this.organisationType = organisationType;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getServiceArea() {
        return serviceArea;
    }

    public void setServiceArea(String serviceArea) {
        this.serviceArea = serviceArea;
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

    public String getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(String verificationStatus) {
        this.verificationStatus = verificationStatus;
    }
}
