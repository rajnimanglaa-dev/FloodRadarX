"""
Unit and Integration Tests for FastAPI Application Endpoints
"""

import sys
from pathlib import Path
import pytest
from starlette.testclient import TestClient

SRC_DIR = Path(__file__).resolve().parent.parent / "src"
sys.path.insert(0, str(SRC_DIR))

from api_service import app
from java_backend_client import JavaBackendClient


@pytest.fixture
def client():
    return TestClient(app)


def test_health_endpoint(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ONLINE"
    assert "modelVersion" in data


def test_predict_endpoint_contract(client):
    # Simulates request payload sent by Java Spring Boot PythonPredictionService.java
    payload = {
        "regionId": 3,
        "district": "Patna",
        "state": "Bihar",
        "rainfallMm": 65.0,
        "riverWaterLevelMeters": 49.90,
        "waterLevelRiseRate": 0.08,
        "soilMoisturePercent": 50.0,
        "weatherForecastTrend": "WORSENING"
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 200
    data = response.json()

    # Exact Java Spring Boot assertions
    assert "riskScore" in data
    assert "riskLevel" in data
    assert "predictionWindowHours" in data
    assert "factors" in data
    assert data["factors"]["rainfallTrend"] in ["INCREASING", "STABLE", "DECREASING", "STEADY"]
    assert data["factors"]["waterLevelTrend"] in ["RISING", "RECEDING", "STEADY"]
    assert "modelVersion" in data
    assert "explanation" in data


def test_predict_insufficient_data(client):
    payload = {
        "regionId": 1,
        "rainfallMm": None,
        "riverWaterLevelMeters": None
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["dataStatus"] == "INSUFFICIENT_DATA"
    assert data["riskScore"] == 0


def test_region_input_endpoint(client):
    response = client.get("/api/ml/input/regions/3")
    assert response.status_code == 200
    data = response.json()
    assert data["regionId"] == 3
    assert data["dangerThresholdMeters"] == 50.20


def test_iot_telemetry_endpoint(client):
    telemetry_payload = {
        "device_id": "ESP32-TEST-NODE",
        "station_id": "CWC_PAT_G01",
        "distance_cm": 240.0,
        "sensor_mount_offset_m": 52.0,
        "is_simulated": True
    }
    response = client.post("/api/iot/telemetry", json=telemetry_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "SUCCESS"
    assert data["telemetry"]["calculated_water_level_m"] == 49.60


def test_sms_alert_endpoint(client):
    sms_payload = {
        "region_id": 3,
        "region_name": "Patna",
        "risk_level": "CRITICAL",
        "risk_score": 95,
        "arrival_window": "2.1 to 3.5 hours",
        "phone_numbers": ["+919876543210"]
    }
    response = client.post("/api/alerts/sms", json=sms_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "DISPATCH_PROCESSED"
    assert data["dispatches_count"] == 1


def test_satellite_endpoints(client):
    resp_flood = client.get("/api/satellite/flood-extent")
    assert resp_flood.status_code == 200
    data_flood = resp_flood.json()
    assert data_flood["type"] == "FeatureCollection"

    resp_road = client.get("/api/satellite/road-accessibility")
    assert resp_road.status_code == 200
    data_road = resp_road.json()
    assert data_road["type"] == "FeatureCollection"


def test_java_backend_client_offline_handling():
    # Verify that calling an offline Java backend port does not crash or raise uncaught error
    client = JavaBackendClient(base_url="http://localhost:59999", timeout_seconds=1.0)
    health = client.check_health()
    assert health["online"] is False
    weather = client.get_weather_observations(region_id=1)
    assert weather is None
