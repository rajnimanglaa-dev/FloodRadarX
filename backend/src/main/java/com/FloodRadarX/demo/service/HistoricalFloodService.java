package com.FloodRadarX.demo.service;

import com.FloodRadarX.demo.dto.HistoricalFloodRequest;
import com.FloodRadarX.demo.dto.HistoricalFloodResponse;
import com.FloodRadarX.demo.entity.HistoricalFlood;
import com.FloodRadarX.demo.entity.Region;
import com.FloodRadarX.demo.repository.HistoricalFloodRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HistoricalFloodService {

    private final HistoricalFloodRepository historicalFloodRepository;
    private final RegionService regionService;

    public HistoricalFloodService(HistoricalFloodRepository historicalFloodRepository, 
                                  RegionService regionService) {
        this.historicalFloodRepository = historicalFloodRepository;
        this.regionService = regionService;
    }

    public List<HistoricalFloodResponse> getByRegionId(Long regionId) {
        return historicalFloodRepository.findByRegionIdOrderByEventYearDesc(regionId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<HistoricalFloodResponse> getByDistrict(String district) {
        return historicalFloodRepository.findByRegionDistrictIgnoreCase(district)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<HistoricalFloodResponse> getByYear(Integer year) {
        return historicalFloodRepository.findByEventYear(year)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<HistoricalFloodResponse> getAll() {
        return historicalFloodRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public HistoricalFloodResponse createRecord(HistoricalFloodRequest request) {
        Region region = regionService.findRegionById(request.getRegionId());

        HistoricalFlood flood = new HistoricalFlood(
                region,
                request.getEventYear(),
                request.getEventDate(),
                request.getSeverity().trim().toUpperCase(),
                request.getInundatedAreaSqKm(),
                request.getDescription(),
                request.getDataSource().trim(),
                request.getSourceUrl(),
                request.getDatasetObservationDate()
        );

        HistoricalFlood saved = historicalFloodRepository.save(flood);
        return mapToResponse(saved);
    }

    public HistoricalFloodResponse mapToResponse(HistoricalFlood h) {
        return new HistoricalFloodResponse(
                h.getId(),
                h.getRegion().getId(),
                h.getRegion().getName(),
                h.getRegion().getDistrict(),
                h.getRegion().getState(),
                h.getEventYear(),
                h.getEventDate(),
                h.getSeverity(),
                h.getInundatedAreaSqKm(),
                h.getDescription(),
                h.getDataSource(),
                h.getSourceUrl(),
                h.getDatasetObservationDate()
        );
    }
}
