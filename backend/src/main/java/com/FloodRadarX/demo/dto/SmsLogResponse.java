package com.FloodRadarX.demo.dto;

import java.time.LocalDateTime;

public class SmsLogResponse {

    private Long id;
    private Long alertId;
    private String recipientPhone;
    private String recipientName;
    private String message;
    private String status;
    private LocalDateTime sentAt;
    private String gatewayResponse;
    private boolean isDuplicate;

    public SmsLogResponse() {
    }

    public SmsLogResponse(Long id, Long alertId, String recipientPhone, String recipientName, 
                          String message, String status, LocalDateTime sentAt, 
                          String gatewayResponse, boolean isDuplicate) {
        this.id = id;
        this.alertId = alertId;
        this.recipientPhone = recipientPhone;
        this.recipientName = recipientName;
        this.message = message;
        this.status = status;
        this.sentAt = sentAt;
        this.gatewayResponse = gatewayResponse;
        this.isDuplicate = isDuplicate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getAlertId() {
        return alertId;
    }

    public void setAlertId(Long alertId) {
        this.alertId = alertId;
    }

    public String getRecipientPhone() {
        return recipientPhone;
    }

    public void setRecipientPhone(String recipientPhone) {
        this.recipientPhone = recipientPhone;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }

    public String getGatewayResponse() {
        return gatewayResponse;
    }

    public void setGatewayResponse(String gatewayResponse) {
        this.gatewayResponse = gatewayResponse;
    }

    public boolean isDuplicate() {
        return isDuplicate;
    }

    public void setDuplicate(boolean duplicate) {
        isDuplicate = duplicate;
    }
}
