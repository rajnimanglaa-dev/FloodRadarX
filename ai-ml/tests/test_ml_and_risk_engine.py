"""
Unit and Integration Tests for ML Risk Engine and Arrival-Time Estimator
"""

import sys
from pathlib import Path
import pytest

SRC_DIR = Path(__file__).resolve().parent.parent / "src"
sys.path.insert(0, str(SRC_DIR))

from flood_risk_engine import FloodRiskEngine
from arrival_time_estimator import FloodArrivalTimeEstimator


@pytest.fixture
def risk_engine():
    return FloodRiskEngine()


@pytest.fixture
def arrival_estimator():
    return FloodArrivalTimeEstimator()


def test_insufficient_data_handling(risk_engine):
    # Both rainfall and water level absent
    res = risk_engine.evaluate_risk(region_id=3, rainfall_mm=None, river_water_level_m=None)
    assert res["dataStatus"] == "INSUFFICIENT_DATA"
    assert res["riskScore"] == 0
    assert res["riskLevel"] == "LOW"
    assert "warning" in res["explanation"]
    assert res["arrivalEstimate"]["status"] == "INSUFFICIENT_DATA"


def test_prediction_output_schema_compatibility(risk_engine):
    # Valid input matching Java Spring Boot contract
    res = risk_engine.evaluate_risk(
        region_id=3,
        rainfall_mm=75.0,
        river_water_level_m=49.95,
        water_level_rise_rate=0.08,
        district="Patna",
        state="Bihar"
    )

    # Enforce exact fields expected by Java backend PythonPredictionService.java
    assert "riskScore" in res
    assert "riskLevel" in res
    assert "predictionWindowHours" in res
    assert "factors" in res
    assert "rainfallTrend" in res["factors"]
    assert "waterLevelTrend" in res["factors"]
    assert "modelVersion" in res
    assert "explanation" in res
    assert "arrivalEstimate" in res
    assert res["riskLevel"] in ["LOW", "MODERATE", "HIGH", "CRITICAL"]
    assert 0 <= res["riskScore"] <= 100


def test_critical_flood_threshold_behavior(risk_engine):
    # Patna danger level is 50.20m. Stage = 50.50m (Already breached)
    res = risk_engine.evaluate_risk(
        region_id=3,
        rainfall_mm=120.0,
        river_water_level_m=50.50,
        water_level_rise_rate=0.15
    )
    assert res["riskLevel"] == "CRITICAL"
    assert res["riskScore"] >= 85
    assert res["arrivalEstimate"]["status"] == "ALREADY_BREACHED"


def test_arrival_time_imminent_surge_window(arrival_estimator):
    # Patna danger mark is 50.20m. Stage 49.80m (0.40m freeboard), rising at 0.10 m/hr
    res = arrival_estimator.estimate_arrival(
        region_id=3,
        current_water_level_m=49.80,
        water_level_rise_rate_m_hr=0.10,
        upstream_stage_trend="RISING"
    )
    assert res.status == "IMMINENT_SURGE"
    assert res.min_arrival_hours is not None
    assert res.max_arrival_hours is not None
    assert res.min_arrival_hours < res.max_arrival_hours
    assert "hours" in res.window_formatted


def test_arrival_time_steady_water(arrival_estimator):
    # Stage steady (rise rate 0.0) -> No flood projected
    res = arrival_estimator.estimate_arrival(
        region_id=3,
        current_water_level_m=46.50,
        water_level_rise_rate_m_hr=0.0,
        upstream_stage_trend="STEADY"
    )
    assert res.status == "NO_FLOOD_PROJECTED"
    assert res.min_arrival_hours is None
