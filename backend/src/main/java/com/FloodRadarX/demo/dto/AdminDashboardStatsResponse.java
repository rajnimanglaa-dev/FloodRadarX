package com.FloodRadarX.demo.dto;

public class AdminDashboardStatsResponse {

    private long totalUsers;
    private long totalRegions;
    private long totalHistoricalEvents;
    private long totalPredictions;
    private long totalActiveAlerts;
    private long totalShelters;
    private long totalEmergencyContacts;
    private long totalSmsLogs;

    public AdminDashboardStatsResponse() {
    }

    public AdminDashboardStatsResponse(long totalUsers, long totalRegions, long totalHistoricalEvents, 
                                       long totalPredictions, long totalActiveAlerts, long totalShelters, 
                                       long totalEmergencyContacts, long totalSmsLogs) {
        this.totalUsers = totalUsers;
        this.totalRegions = totalRegions;
        this.totalHistoricalEvents = totalHistoricalEvents;
        this.totalPredictions = totalPredictions;
        this.totalActiveAlerts = totalActiveAlerts;
        this.totalShelters = totalShelters;
        this.totalEmergencyContacts = totalEmergencyContacts;
        this.totalSmsLogs = totalSmsLogs;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalRegions() {
        return totalRegions;
    }

    public void setTotalRegions(long totalRegions) {
        this.totalRegions = totalRegions;
    }

    public long getTotalHistoricalEvents() {
        return totalHistoricalEvents;
    }

    public void setTotalHistoricalEvents(long totalHistoricalEvents) {
        this.totalHistoricalEvents = totalHistoricalEvents;
    }

    public long getTotalPredictions() {
        return totalPredictions;
    }

    public void setTotalPredictions(long totalPredictions) {
        this.totalPredictions = totalPredictions;
    }

    public long getTotalActiveAlerts() {
        return totalActiveAlerts;
    }

    public void setTotalActiveAlerts(long totalActiveAlerts) {
        this.totalActiveAlerts = totalActiveAlerts;
    }

    public long getTotalShelters() {
        return totalShelters;
    }

    public void setTotalShelters(long totalShelters) {
        this.totalShelters = totalShelters;
    }

    public long getTotalEmergencyContacts() {
        return totalEmergencyContacts;
    }

    public void setTotalEmergencyContacts(long totalEmergencyContacts) {
        this.totalEmergencyContacts = totalEmergencyContacts;
    }

    public long getTotalSmsLogs() {
        return totalSmsLogs;
    }

    public void setTotalSmsLogs(long totalSmsLogs) {
        this.totalSmsLogs = totalSmsLogs;
    }
}
