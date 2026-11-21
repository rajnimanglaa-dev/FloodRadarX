package com.FloodRadarX.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AlertBroadcastRequest {

    @NotNull(message = "Region ID is required")
    private Long regionId;

    @NotBlank(message = "Risk level is required (LOW, MODERATE, HIGH, CRITICAL)")
    private String riskLevel;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Message is required")
    private String message;

    @NotBlank(message = "Severity is required (ADVISORY, WATCH, WARNING, EMERGENCY)")
    private String severity;

    private boolean broadcastToEmergency = true;
    private boolean broadcastToUsers = true;

    public AlertBroadcastRequest() {
    }

    public AlertBroadcastRequest(Long regionId, String riskLevel, String title, 
                                 String message, String severity, 
                                 boolean broadcastToEmergency, boolean broadcastToUsers) {
        this.regionId = regionId;
        this.riskLevel = riskLevel;
        this.title = title;
        this.message = message;
        this.severity = severity;
        this.broadcastToEmergency = broadcastToEmergency;
        this.broadcastToUsers = broadcastToUsers;
    }

    public Long getRegionId() {
        return regionId;
    }

    public void setRegionId(Long regionId) {
        this.regionId = regionId;
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
}
