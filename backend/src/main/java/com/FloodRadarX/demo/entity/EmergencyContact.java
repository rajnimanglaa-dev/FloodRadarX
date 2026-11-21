package com.FloodRadarX.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "emergency_contacts")
public class EmergencyContact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "organisation_name", nullable = false)
    private String organisationName;

    @Column(name = "organisation_type", nullable = false)
    private String organisationType; // NDRF, SDRF, NGO, DISTRICT_DISASTER_MANAGEMENT, FIRE_AND_RESCUE, POLICE, RED_CROSS

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @Column(name = "email")
    private String email;

    @Column(name = "service_area")
    private String serviceArea;

    @Column(name = "district", nullable = false)
    private String district;

    @Column(name = "state", nullable = false)
    private String state;

    @Column(name = "verification_status", nullable = false)
    private String verificationStatus = "VERIFIED"; // VERIFIED, PENDING

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public EmergencyContact() {
    }

    public EmergencyContact(String organisationName, String organisationType, String phoneNumber, 
                            String email, String serviceArea, String district, String state, 
                            String verificationStatus) {
        this.organisationName = organisationName;
        this.organisationType = organisationType;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.serviceArea = serviceArea;
        this.district = district;
        this.state = state;
        this.verificationStatus = verificationStatus;
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
