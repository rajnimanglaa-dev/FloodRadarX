package com.FloodRadarX.demo.dto;

import java.time.LocalDateTime;
import java.util.List;

public class ErrorResponse {

    private boolean success;
    private String message;
    private String error;
    private int status;
    private LocalDateTime timestamp;
    private List<String> details;

    public ErrorResponse() {
        this.success = false;
        this.timestamp = LocalDateTime.now();
    }

    public ErrorResponse(String message, String error, int status) {
        this.success = false;
        this.message = message;
        this.error = error;
        this.status = status;
        this.timestamp = LocalDateTime.now();
    }

    public ErrorResponse(String message, String error, int status, List<String> details) {
        this.success = false;
        this.message = message;
        this.error = error;
        this.status = status;
        this.timestamp = LocalDateTime.now();
        this.details = details;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public List<String> getDetails() {
        return details;
    }

    public void setDetails(List<String> details) {
        this.details = details;
    }
}
