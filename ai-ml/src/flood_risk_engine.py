"""
FloodRadarX - Comprehensive Flood Risk Prediction Engine
=========================================================
Member 3: AI/ML & IoT Lead

Integrates:
1. Supervised Gradient Boosting / Random Forest Model Inference.
2. Station-Specific Hydrological Threshold Benchmarking (CWC Danger Marks).
3. Hydrodynamic Flood Wave Kinematic Arrival-Time Estimation.
4. Explanatory Factor Decomposition (Precipitation, Stage, Runoff).
5. Full Compatibility with Java Spring Boot `PythonPredictionService`.
"""

import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, Optional

import joblib
import numpy as np
import pandas as pd

from arrival_time_estimator import FloodArrivalTimeEstimator

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("FloodRadarX.RiskEngine")

BASE_DIR = Path(__file__).resolve().parent.parent
MODELS_DIR = BASE_DIR / "models"
MODEL_PATH = MODELS_DIR / "flood_risk_model.joblib"
METADATA_PATH = MODELS_DIR / "model_metadata.json"


class FloodRiskEngine:
    """Predicts composite flood hazard risk and generates explainable warnings."""

    def __init__(self):
        self.model = None
        self.metadata = {}
        self.arrival_estimator = FloodArrivalTimeEstimator()
        self._load_model()

    def _load_model(self):
        try:
            if MODEL_PATH.exists():
                self.model = joblib.load(MODEL_PATH)
                logger.info("Loaded trained ML model from: %s", MODEL_PATH)
            if METADATA_PATH.exists():
                with open(METADATA_PATH, "r", encoding="utf-8") as f:
                    self.metadata = json.load(f)
                logger.info("Loaded model metadata: %s", self.metadata.get("model_version"))
        except Exception as e:
            logger.warning("Could not load ML model artifact: %s. Rule-based engine active.", str(e))

    def evaluate_risk(
        self,
        region_id: int,
        rainfall_mm: Optional[float] = None,
        river_water_level_m: Optional[float] = None,
        water_level_rise_rate: Optional[float] = None,
        soil_moisture_percent: Optional[float] = 45.0,
        weather_forecast_trend: Optional[str] = "STABLE",
        district: Optional[str] = None,
        state: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Evaluates risk matching the exact schema expected by Member 2's Java Backend.
        """
        cur_time = datetime.now().isoformat()
        model_version = self.metadata.get("model_version", "FloodRadarX-v1.0")

        # 1. Check for Insufficient Data condition
        if rainfall_mm is None and river_water_level_m is None:
            return {
                "regionId": region_id,
                "district": district or "Unknown",
                "state": state or "Unknown",
                "riskScore": 0,
                "riskLevel": "LOW",
                "predictionWindowHours": 6,
                "modelVersion": model_version,
                "dataStatus": "INSUFFICIENT_DATA",
                "predictionSource": "PYTHON_ML",
                "factors": {
                    "rainfallTrend": "UNKNOWN",
                    "waterLevelTrend": "UNKNOWN"
                },
                "explanation": {
                    "warning": "Both rainfall and river water level are absent. Prediction cannot proceed safely."
                },
                "arrivalEstimate": {
                    "status": "INSUFFICIENT_DATA",
                    "windowFormatted": None,
                    "confidence": "UNAVAILABLE"
                },
                "timestamp": cur_time
            }

        # Safe defaults for single-station observation queries
        rain_val = float(rainfall_mm) if rainfall_mm is not None else 0.0
        water_val = float(river_water_level_m) if river_water_level_m is not None else 0.0

        # Retrieve official thresholds for the region
        params = self.arrival_estimator.station_db.get(region_id, {})
        danger_level = params.get("danger_level_m", 5.0 if water_val < 10.0 else 50.0)
        warning_level = params.get("warning_level_m", 4.0 if water_val < 10.0 else 49.0)

        # Estimate water level rise rate if not explicitly supplied
        if water_level_rise_rate is None:
            if rain_val > 50.0:
                water_level_rise_rate = 0.08
            elif rain_val > 20.0:
                water_level_rise_rate = 0.03
            else:
                water_level_rise_rate = 0.005

        # Factor Trends
        rain_trend = "INCREASING" if rain_val >= 25.0 or (weather_forecast_trend or "").upper() in ["INCREASING", "WORSENING", "HEAVY_RAIN"] else "STABLE"
        if rain_val == 0.0:
            rain_trend = "STEADY"

        water_trend = "RISING" if water_level_rise_rate > 0.02 else ("RECEDING" if water_level_rise_rate < -0.02 else "STEADY")

        # 2. ML Prediction Inference (if model loaded)
        risk_score = 0
        ml_prob = None

        if self.model is not None and "feature_columns" in self.metadata:
            feat_cols = self.metadata["feature_columns"]
            freeboard_danger = danger_level - water_val
            freeboard_warning = warning_level - water_val

            feature_dict = {
                "rainfall_mm": rain_val,
                "rainfall_lag_1h_mm": rain_val * 0.8,
                "rainfall_acc_3h_mm": rain_val * 2.2,
                "rainfall_acc_6h_mm": rain_val * 3.5,
                "rainfall_acc_24h_mm": rain_val * 4.8,
                "water_level_m": water_val,
                "water_level_change_m": water_level_rise_rate * 1.0,
                "water_level_rise_rate": water_level_rise_rate,
                "stage_trend_numeric": 1 if water_trend == "RISING" else 0,
                "discharge_cumec": 15000.0 if water_val > 40.0 else 2500.0,
                "mean_elevation_m": 50.0,
                "mean_slope_deg": 1.5,
                "freeboard_to_danger_m": freeboard_danger,
                "freeboard_to_warning_m": freeboard_warning
            }

            feat_df = pd.DataFrame([[feature_dict[c] for c in feat_cols]], columns=feat_cols)
            try:
                if hasattr(self.model, "predict_proba"):
                    probs = self.model.predict_proba(feat_df)[0]
                    ml_prob = float(probs[1]) if len(probs) > 1 else float(probs[0])
                    # Map probability to continuous 0-100 risk score
                    risk_score = int(np.clip(ml_prob * 100.0, 5, 98))
                else:
                    pred = int(self.model.predict(feat_df)[0])
                    risk_score = 80 if pred == 1 else 25
            except Exception as ex:
                logger.warning("ML inference exception: %s. Using physical heuristics.", str(ex))

        # 3. Physical Fallback / Calibration Guardrails
        # If water level already breached danger mark, risk score MUST be >= 85 (CRITICAL)
        if water_val >= danger_level and danger_level > 0.0:
            risk_score = max(risk_score, 92)
        elif water_val >= warning_level and warning_level > 0.0:
            risk_score = max(risk_score, 68)
        elif rain_val >= 100.0: # Torrential rainfall
            risk_score = max(risk_score, 75)
        elif rain_val >= 50.0:
            risk_score = max(risk_score, 50)
        elif risk_score == 0:
            risk_score = int(min(45, max(10, (water_val / max(1.0, danger_level)) * 40.0 + (rain_val / 50.0) * 20.0)))

        # Categorize Risk Level
        if risk_score >= 85:
            risk_level = "CRITICAL"
        elif risk_score >= 60:
            risk_level = "HIGH"
        elif risk_score >= 30:
            risk_level = "MODERATE"
        else:
            risk_level = "LOW"

        # 4. Arrival Time Window Calculation
        arrival_res = self.arrival_estimator.estimate_arrival(
            region_id=region_id,
            current_water_level_m=water_val,
            water_level_rise_rate_m_hr=water_level_rise_rate,
            upstream_stage_trend=water_trend,
            recent_rainfall_6h_mm=rain_val * 3.0
        )

        # 5. Explanatory Contributing Factors
        total_weight = max(1.0, rain_val + (water_val / danger_level) * 50.0)
        rain_contrib = round((rain_val / total_weight) * 100.0, 1)
        water_contrib = round(100.0 - rain_contrib, 1)

        primary_threat = "Normal hydrologic baseline."
        if water_val >= danger_level:
            primary_threat = f"River stage ({water_val}m) exceeds official danger mark ({danger_level}m)."
        elif water_level_rise_rate > 0.05:
            primary_threat = f"Rapid water rise rate ({water_level_rise_rate} m/hr) indicates flash flood surge."
        elif rain_val >= 64.5:
            primary_threat = f"Heavy monsoon precipitation ({rain_val} mm/hr) triggering severe catchment runoff."

        explanation = {
            "rainfallContributionPercent": rain_contrib,
            "waterLevelContributionPercent": water_contrib,
            "primaryThreat": primary_threat,
            "mlModelProbability": round(ml_prob, 4) if ml_prob is not None else None,
            "dangerThresholdMeters": danger_level,
            "freeboardMeters": round(danger_level - water_val, 3) if danger_level > 0 else None
        }

        return {
            "regionId": region_id,
            "district": district or params.get("district", "Catchment Basin"),
            "state": state or params.get("state", "India"),
            "riskScore": int(risk_score),
            "riskLevel": risk_level,
            "predictionWindowHours": 6,
            "modelVersion": model_version,
            "dataStatus": "COMPLETE",
            "predictionSource": "PYTHON_ML",
            "factors": {
                "rainfallTrend": rain_trend,
                "waterLevelTrend": water_trend
            },
            "explanation": explanation,
            "arrivalEstimate": {
                "status": arrival_res.status,
                "windowFormatted": arrival_res.window_formatted,
                "minArrivalHours": arrival_res.min_arrival_hours,
                "maxArrivalHours": arrival_res.max_arrival_hours,
                "confidence": arrival_res.confidence,
                "uncertaintyNotes": arrival_res.uncertainty_notes
            },
            "note": f"Prediction computed by {model_version}. Primary threat: {primary_threat}",
            "timestamp": cur_time
        }


if __name__ == "__main__":
    engine = FloodRiskEngine()
    test_pred = engine.evaluate_risk(
        region_id=3,
        rainfall_mm=68.5,
        river_water_level_m=49.95,
        water_level_rise_rate=0.09,
        district="Patna",
        state="Bihar"
    )
    print("Test Flood Risk Response:\n", json.dumps(test_pred, indent=2))
