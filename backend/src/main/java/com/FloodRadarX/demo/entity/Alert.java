package com.FloodRadarX.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "alerts")
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "region_id", nullable = false)
    private Region region;

    @Column(name = "risk_level", nullable = false)
    private String riskLevel; // LOW, MODERATE, HIGH, CRITICAL

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "message", nullable = false, length = 1000)
    private String message;

    @Column(name = "severity", nullable = false)
    private String severity; // ADVISORY, WATCH, WARNING, EMERGENCY

    @Column(name = "alert_timestamp", nullable = false)
    private LocalDateTime alertTimestamp;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @Column(name = "broadcast_to_emergency", nullable = false)
    private boolean broadcastToEmergency = false;

    @Column(name = "broadcast_to_users", nullable = false)
    private boolean broadcastToUsers = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Alert() {
    }

    public Alert(Region region, String riskLevel, String title, String message, 
                 String severity, LocalDateTime alertTimestamp, boolean broadcastToEmergency, 
                 boolean broadcastToUsers) {
        this.region = region;
        this.riskLevel = riskLevel;
        this.title = title;
        this.message = message;
        this.severity = severity;
        this.alertTimestamp = alertTimestamp;
        this.broadcastToEmergency = broadcastToEmergency;
        this.broadcastToUsers = broadcastToUsers;
        this.isActive = true;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.alertTimestamp == null) {
            this.alertTimestamp = LocalDateTime.now();
        }
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
