package com.FloodRadarX.demo.dto;

import java.util.List;

public class RegionDetailResponse {

    private RegionResponse region;
    private PredictionResponse latestPrediction;
    private List<HistoricalFloodResponse> historicalFloods;
    private WeatherDataResponse latestWeather;
    private SatelliteDataResponse latestSatellite;
    private int nearbyShelterCount;

    public RegionDetailResponse() {
    }

    public RegionDetailResponse(RegionResponse region, PredictionResponse latestPrediction, 
                                List<HistoricalFloodResponse> historicalFloods, 
                                WeatherDataResponse latestWeather, 
                                SatelliteDataResponse latestSatellite, 
                                int nearbyShelterCount) {
        this.region = region;
        this.latestPrediction = latestPrediction;
        this.historicalFloods = historicalFloods;
        this.latestWeather = latestWeather;
        this.latestSatellite = latestSatellite;
        this.nearbyShelterCount = nearbyShelterCount;
    }

    public RegionResponse getRegion() {
        return region;
    }

    public void setRegion(RegionResponse region) {
        this.region = region;
    }

    public PredictionResponse getLatestPrediction() {
        return latestPrediction;
    }

    public void setLatestPrediction(PredictionResponse latestPrediction) {
        this.latestPrediction = latestPrediction;
    }

    public List<HistoricalFloodResponse> getHistoricalFloods() {
        return historicalFloods;
    }

    public void setHistoricalFloods(List<HistoricalFloodResponse> historicalFloods) {
        this.historicalFloods = historicalFloods;
    }

    public WeatherDataResponse getLatestWeather() {
        return latestWeather;
    }

    public void setLatestWeather(WeatherDataResponse latestWeather) {
        this.latestWeather = latestWeather;
    }

    public SatelliteDataResponse getLatestSatellite() {
        return latestSatellite;
    }

    public void setLatestSatellite(SatelliteDataResponse latestSatellite) {
        this.latestSatellite = latestSatellite;
    }

    public int getNearbyShelterCount() {
        return nearbyShelterCount;
    }

    public void setNearbyShelterCount(int nearbyShelterCount) {
        this.nearbyShelterCount = nearbyShelterCount;
    }
}
