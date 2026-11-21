package com.FloodRadarX.demo.dto;

public class PredictionFactorsDto {

    private String rainfallTrend; // INCREASING, STABLE, DECREASING
    private String waterLevelTrend; // RISING, STABLE, RECEDING

    public PredictionFactorsDto() {
    }

    public PredictionFactorsDto(String rainfallTrend, String waterLevelTrend) {
        this.rainfallTrend = rainfallTrend;
        this.waterLevelTrend = waterLevelTrend;
    }

    public String getRainfallTrend() {
        return rainfallTrend;
    }

    public void setRainfallTrend(String rainfallTrend) {
        this.rainfallTrend = rainfallTrend;
    }

    public String getWaterLevelTrend() {
        return waterLevelTrend;
    }

    public void setWaterLevelTrend(String waterLevelTrend) {
        this.waterLevelTrend = waterLevelTrend;
    }
}
