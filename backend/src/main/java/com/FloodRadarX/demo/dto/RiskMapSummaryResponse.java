package com.FloodRadarX.demo.dto;

import java.util.List;

public class RiskMapSummaryResponse {

    private int totalRegions;
    private int lowRiskCount;
    private int moderateRiskCount;
    private int highRiskCount;
    private int unknownRiskCount;
    private List<RiskMapItemResponse> regions;

    public RiskMapSummaryResponse() {
    }

    public RiskMapSummaryResponse(int totalRegions, int lowRiskCount, int moderateRiskCount, 
                                  int highRiskCount, int unknownRiskCount, List<RiskMapItemResponse> regions) {
        this.totalRegions = totalRegions;
        this.lowRiskCount = lowRiskCount;
        this.moderateRiskCount = moderateRiskCount;
        this.highRiskCount = highRiskCount;
        this.unknownRiskCount = unknownRiskCount;
        this.regions = regions;
    }

    public int getTotalRegions() {
        return totalRegions;
    }

    public void setTotalRegions(int totalRegions) {
        this.totalRegions = totalRegions;
    }

    public int getLowRiskCount() {
        return lowRiskCount;
    }

    public void setLowRiskCount(int lowRiskCount) {
        this.lowRiskCount = lowRiskCount;
    }

    public int getModerateRiskCount() {
        return moderateRiskCount;
    }

    public void setModerateRiskCount(int moderateRiskCount) {
        this.moderateRiskCount = moderateRiskCount;
    }

    public int getHighRiskCount() {
        return highRiskCount;
    }

    public void setHighRiskCount(int highRiskCount) {
        this.highRiskCount = highRiskCount;
    }

    public int getUnknownRiskCount() {
        return unknownRiskCount;
    }

    public void setUnknownRiskCount(int unknownRiskCount) {
        this.unknownRiskCount = unknownRiskCount;
    }

    public List<RiskMapItemResponse> getRegions() {
        return regions;
    }

    public void setRegions(List<RiskMapItemResponse> regions) {
        this.regions = regions;
    }
}
