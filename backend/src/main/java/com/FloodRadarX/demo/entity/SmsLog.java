package com.FloodRadarX.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sms_logs")
public class SmsLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "alert_id")
    private Alert alert;

    @Column(name = "recipient_phone", nullable = false)
    private String recipientPhone;

    @Column(name = "recipient_name")
    private String recipientName;

    @Column(name = "message", nullable = false, length = 500)
    private String message;

    @Column(name = "status", nullable = false)
    private String status; // SENT, FAILED, SIMULATED

    @Column(name = "sent_at", nullable = false)
    private LocalDateTime sentAt;

    @Column(name = "gateway_response", length = 500)
    private String gatewayResponse;

    @Column(name = "is_duplicate", nullable = false)
    private boolean isDuplicate = false;

    public SmsLog() {
    }

    public SmsLog(Alert alert, String recipientPhone, String recipientName, 
                  String message, String status, LocalDateTime sentAt, 
                  String gatewayResponse, boolean isDuplicate) {
        this.alert = alert;
        this.recipientPhone = recipientPhone;
        this.recipientName = recipientName;
        this.message = message;
        this.status = status;
        this.sentAt = sentAt;
        this.gatewayResponse = gatewayResponse;
        this.isDuplicate = isDuplicate;
    }

    @PrePersist
    protected void onCreate() {
        if (this.sentAt == null) {
            this.sentAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Alert getAlert() {
        return alert;
    }

    public void setAlert(Alert alert) {
        this.alert = alert;
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
