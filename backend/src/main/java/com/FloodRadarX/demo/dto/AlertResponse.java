package com.FloodRadarX.demo.dto;

import java.time.LocalDateTime;

public class AlertResponse {

    private Long id;
    private Long regionId;
    private String regionName;
    private String district;
    private String state;
    private String riskLevel;
    private String title;
    private String message;
    private String severity;
    private LocalDateTime alertTimestamp;
    private boolean isActive;
    private boolean broadcastToEmergency;
    private boolean broadcastToUsers;
    private int smsSentCount;

    public AlertResponse() {
    }

    public AlertResponse(Long id, Long regionId, String regionName, String district, 
                         String state, String riskLevel, String title, String message, 
                         String severity, LocalDateTime alertTimestamp, boolean isActive, 
                         boolean broadcastToEmergency, boolean broadcastToUsers, int smsSentCount) {
        this.id = id;
        this.regionId = regionId;
        this.regionName = regionName;
        this.district = district;
        this.state = state;
        this.riskLevel = riskLevel;
        this.title = title;
        this.message = message;
        this.severity = severity;
        this.alertTimestamp = alertTimestamp;
        this.isActive = isActive;
        this.broadcastToEmergency = broadcastToEmergency;
        this.broadcastToUsers = broadcastToUsers;
        this.smsSentCount = smsSentCount;
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

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public LocalDateTime getAlertTimestamp() {
        return alertTimestamp;
    }

    public void setAlertTimestamp(LocalDateTime alertTimestamp) {
        this.alertTimestamp = alertTimestamp;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public boolean isBroadcastToEmergency() {
        return broadcastToEmergency;
    }

    public void setBroadcastToEmergency(boolean broadcastToEmergency) {
        this.broadcastToEmergency = broadcastToEmergency;
    }

    public boolean isBroadcastToUsers() {
        return broadcastToUsers;
    }

    public void setBroadcastToUsers(boolean broadcastToUsers) {
        this.broadcastToUsers = broadcastToUsers;
    }

    public int getSmsSentCount() {
        return smsSentCount;
    }

    public void setSmsSentCount(int smsSentCount) {
        this.smsSentCount = smsSentCount;
    }
}
