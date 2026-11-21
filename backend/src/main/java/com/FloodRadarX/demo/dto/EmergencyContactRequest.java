package com.FloodRadarX.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class EmergencyContactRequest {

    @NotBlank(message = "Organisation name is required")
    private String organisationName;

    @NotBlank(message = "Organisation type is required (NDRF, SDRF, NGO, DISTRICT_DISASTER_MANAGEMENT, FIRE_AND_RESCUE, POLICE, RED_CROSS)")
    private String organisationType;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10,15}$", message = "Phone number must be between 10 and 15 digits")
    private String phoneNumber;

    private String email;
    private String serviceArea;

    @NotBlank(message = "District is required")
    private String district;

    @NotBlank(message = "State is required")
    private String state;

    private String verificationStatus; // VERIFIED, PENDING

    public EmergencyContactRequest() {
    }

    public EmergencyContactRequest(String organisationName, String organisationType, 
                                   String phoneNumber, String email, String serviceArea, 
                                   String district, String state, String verificationStatus) {
        this.organisationName = organisationName;
        this.organisationType = organisationType;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.serviceArea = serviceArea;
        this.district = district;
        this.state = state;
        this.verificationStatus = verificationStatus;
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
