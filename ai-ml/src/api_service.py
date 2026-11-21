"""
FloodRadarX - FastAPI Microservice for AI/ML, Geospatial & IoT
==============================================================
Member 3: AI/ML & IoT Lead

Runs on port 5000 (as configured in backend/src/main/resources/application.properties):
python.ml.service.url=http://localhost:5000/api/predict

Endpoints:
1. POST /api/predict (Primary contract for Java Spring Boot PythonPredictionService)
2. POST /api/ml/predictions (Proposed ML endpoint alias)
3. GET  /api/ml/input/regions/{region_id} (Inspection of hydrological inputs)
4. POST /api/iot/telemetry (ESP32 ultrasonic telemetry ingestion)
5. POST /api/alerts/sms (Offline GSM/SMS emergency alerting)
6. GET  /api/satellite/flood-extent (Sentinel-1 SAR flood extent GeoJSON)
7. GET  /api/satellite/road-accessibility (OSM road accessibility GeoJSON)
8. GET  /api/health (Service status and model metadata)
"""

import json
import logging
import os
from pathlib import Path
from typing import Dict, Any, Optional, List

from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from flood_risk_engine import FloodRiskEngine
from arrival_time_estimator import FloodArrivalTimeEstimator
from iot_sensor_manager import IoTEdgeManager, SensorTelemetryPayload
from sms_alert_manager import SmsAlertManager, EmergencySmsPayload
from satellite_flood_detector import Sentinel1FloodDetector
from road_accessibility_analyzer import RoadAccessibilityAnalyzer

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("FloodRadarX.API")

BASE_DIR = Path(__file__).resolve().parent.parent
GEO_DIR = BASE_DIR / "data" / "processed" / "geospatial"

app = FastAPI(
    title="FloodRadarX AI/ML & IoT Service",
    description="Intelligent Flood Risk Prediction, SAR Satellite Extent, and Edge Telemetry Ingestion API",
    version="1.0.0"
)

# Enable CORS for React frontend direct inspection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize core engines
risk_engine = FloodRiskEngine()
arrival_estimator = FloodArrivalTimeEstimator()
iot_manager = IoTEdgeManager()
sms_manager = SmsAlertManager()
satellite_detector = Sentinel1FloodDetector()
road_analyzer = RoadAccessibilityAnalyzer()


# Pydantic Schemas
class PredictionInputDTO(BaseModel):
    regionId: int
    district: Optional[str] = None
    state: Optional[str] = None
    rainfallMm: Optional[float] = None
    riverWaterLevelMeters: Optional[float] = None
    waterLevelRiseRate: Optional[float] = None
    soilMoisturePercent: Optional[float] = 45.0
    weatherForecastTrend: Optional[str] = "STABLE"


@app.get("/api/health")
def get_health():
    """Health check and model metadata endpoint."""
    return {
        "status": "ONLINE",
        "service": "FloodRadarX AI/ML Microservice",
        "modelVersion": risk_engine.metadata.get("model_version", "FloodRadarX-v1.0"),
        "championAlgorithm": risk_engine.metadata.get("champion_algorithm", "GradientBoostingClassifier"),
        "port": 5000,
        "geospatialReady": (GEO_DIR / "flood_extent.geojson").exists()
    }


@app.post("/api/predict")
@app.post("/api/ml/predictions")
def predict_flood_risk(input_req: PredictionInputDTO):
    """
    Primary prediction endpoint called by Member 2's Java Spring Boot service.
    Returns: riskScore, riskLevel, predictionWindowHours, factors, modelVersion, explanation.
    """
    logger.info("Received prediction request for Region %d (%s, %s)",
                input_req.regionId, input_req.district, input_req.state)

    try:
        response = risk_engine.evaluate_risk(
            region_id=input_req.regionId,
            rainfall_mm=input_req.rainfallMm,
            river_water_level_m=input_req.riverWaterLevelMeters,
            water_level_rise_rate=input_req.waterLevelRiseRate,
            soil_moisture_percent=input_req.soilMoisturePercent,
            weather_forecast_trend=input_req.weatherForecastTrend,
            district=input_req.district,
            state=input_req.state
        )
        return response
    except Exception as ex:
        logger.error("Error evaluating flood risk: %s", str(ex), exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference error: {str(ex)}"
        )


@app.get("/api/ml/input/regions/{region_id}")
def get_region_monitoring_input(region_id: int):
    """
    Returns latest ingested station observations and official thresholds for a given region.
    """
    params = arrival_estimator.station_db.get(region_id)
    if not params:
        return {
            "regionId": region_id,
            "status": "GENERIC_DEFAULTS",
            "dangerThresholdMeters": 5.0,
            "warningThresholdMeters": 4.0,
            "river": "Local Catchment",
            "station": "Local Station"
        }

    return {
        "regionId": region_id,
        "status": "OFFICIAL_CWC_STATION",
        "district": params.get("district", "Catchment"),
        "river": params.get("river"),
        "stationName": params.get("station_name"),
        "dangerThresholdMeters": params.get("danger_level_m"),
        "warningThresholdMeters": params.get("warning_level_m"),
        "upstreamStation": params.get("upstream_station"),
        "upstreamDistKm": params.get("upstream_dist_km"),
        "waveCelerityKmH": params.get("wave_celerity_km_h")
    }


@app.post("/api/iot/telemetry")
def ingest_edge_telemetry(payload: SensorTelemetryPayload):
    """
    Ingests live or simulated ESP32 ultrasonic water-level readings.
    """
    logger.info("Ingesting IoT telemetry from device: %s", payload.device_id)
    try:
        res = iot_manager.process_telemetry(payload.model_dump())
        return {"status": "SUCCESS", "telemetry": res}
    except Exception as ex:
        logger.error("Telemetry ingestion failed: %s", str(ex))
        raise HTTPException(status_code=400, detail=str(ex))


@app.post("/api/alerts/sms")
def dispatch_emergency_sms(payload: EmergencySmsPayload):
    """
    Dispatches emergency flood SMS alert via configured SMS provider.
    """
    logger.info("Dispatching emergency SMS for Region %d (%s)", payload.region_id, payload.region_name)
    try:
        res = sms_manager.dispatch_alert(payload.model_dump())
        return res
    except Exception as ex:
        logger.error("SMS dispatch failed: %s", str(ex))
        raise HTTPException(status_code=500, detail=str(ex))


@app.get("/api/satellite/flood-extent")
def get_flood_extent_geojson():
    """
    Returns Copernicus Sentinel-1 SAR flood extent polygons formatted as GeoJSON.
    """
    geojson_path = GEO_DIR / "flood_extent.geojson"
    if not geojson_path.exists():
        # Trigger processing if not pre-generated
        satellite_detector.process_flood_extent()

    if geojson_path.exists():
        with open(geojson_path, "r", encoding="utf-8") as f:
            return json.load(f)
    raise HTTPException(status_code=404, detail="Flood extent GeoJSON not available.")


@app.get("/api/satellite/road-accessibility")
def get_road_accessibility_geojson():
    """
    Returns OSM road accessibility analysis results formatted as GeoJSON for frontend Leaflet maps.
    """
    geojson_path = GEO_DIR / "road_accessibility.geojson"
    if not geojson_path.exists():
        road_analyzer.analyze_accessibility()

    if geojson_path.exists():
        with open(geojson_path, "r", encoding="utf-8") as f:
            return json.load(f)
    raise HTTPException(status_code=404, detail="Road accessibility GeoJSON not available.")


if __name__ == "__main__":
    import uvicorn
    logger.info("Starting FloodRadarX AI/ML microservice on http://0.0.0.0:5000 ...")
    uvicorn.run(app, host="0.0.0.0", port=5000)
