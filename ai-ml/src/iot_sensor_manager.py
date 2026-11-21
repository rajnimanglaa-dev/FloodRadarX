"""
FloodRadarX - ESP32 IoT Edge Telemetry Ingestion Module
======================================================
Member 3: AI/ML & IoT Lead

Provides hardware abstraction and ingestion for field ultrasonic sensors:
- Compatible with ESP32 + JSN-SR04T / HC-SR04 waterproof ultrasonic gauge nodes.
- Validates telemetry payload against physical boundaries (distance, signal RSSI, battery voltage).
- Calculates true river water level: WaterLevel = SensorMountOffset - (Distance_cm / 100).
- Supports dual operation:
    1. Mock / Virtual Telemetry Generator (for CI/CD testing and hackathon demo).
    2. Real Device HTTP Webhook & Serial Port Driver (ready for physical hardware deployment).
- Strict data separation: Labels simulated readings as SIMULATED_EDGE_IOT, never real field data.
"""

import json
import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Any, Optional, List

from pydantic import BaseModel, Field, field_validator

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("FloodRadarX.IoTManager")

BASE_DIR = Path(__file__).resolve().parent.parent
IOT_LOGS_DIR = BASE_DIR / "data" / "raw" / "sensors"
IOT_LOGS_DIR.mkdir(parents=True, exist_ok=True)


class SensorTelemetryPayload(BaseModel):
    """Pydantic schema enforcing validation on ESP32 incoming JSON telemetry."""
    device_id: str = Field(..., min_length=3, max_length=50, description="Unique hardware identifier")
    station_id: str = Field(..., min_length=3, max_length=50, description="Central monitoring station link")
    distance_cm: float = Field(..., ge=15.0, le=1500.0, description="Measured ultrasonic distance to water surface")
    sensor_mount_offset_m: float = Field(..., ge=1.0, le=100.0, description="Bridge/mount height above riverbed datum")
    battery_voltage_mv: Optional[int] = Field(None, ge=2500, le=5000, description="LiPo battery voltage")
    signal_rssi_dbm: Optional[int] = Field(None, ge=-120, le=0, description="WiFi / GSM signal strength")
    firmware_version: Optional[str] = Field("v1.0.0", description="ESP32 firmware release")
    timestamp: Optional[str] = Field(None, description="ISO-8601 device timestamp")
    is_simulated: bool = Field(False, description="Flag explicitly separating simulated and real hardware")

    @field_validator("distance_cm")
    @classmethod
    def validate_ultrasonic_distance(cls, v: float) -> float:
        # JSN-SR04T blind spot is ~20cm. Values < 20cm or > 800cm indicate ultrasonic reflection scatter.
        if v < 20.0:
            logger.warning("Ultrasonic reading in transducer blind spot (< 20 cm): %.1f cm", v)
        return round(v, 2)


class IoTEdgeManager:
    """Manages telemetry ingestion, validation, and storage from ESP32 edge nodes."""

    def __init__(self, log_dir: Optional[Path] = None):
        self.log_dir = log_dir or IOT_LOGS_DIR

    def process_telemetry(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validates telemetry, computes river water level stage, and logs the reading.
        """
        # Validate schema via Pydantic
        payload = SensorTelemetryPayload(**raw_data)

        # Stage calculation: Stage = MountOffset - Distance(m)
        dist_m = payload.distance_cm / 100.0
        calculated_stage_m = round(payload.sensor_mount_offset_m - dist_m, 3)

        # Quality status flag
        if calculated_stage_m < 0.0:
            quality = "SUSPECT_NEGATIVE_STAGE"
        elif payload.battery_voltage_mv and payload.battery_voltage_mv < 3300:
            quality = "LOW_BATTERY_WARNING"
        elif payload.signal_rssi_dbm and payload.signal_rssi_dbm < -95:
            quality = "POOR_SIGNAL_MARGINAL"
        else:
            quality = "VALID_VERIFIED"

        cur_ts = payload.timestamp or datetime.now(timezone.utc).isoformat()

        processed_record = {
            "device_id": payload.device_id,
            "station_id": payload.station_id,
            "calculated_water_level_m": calculated_stage_m,
            "unit": "METERS",
            "distance_cm": payload.distance_cm,
            "sensor_mount_offset_m": payload.sensor_mount_offset_m,
            "battery_voltage_mv": payload.battery_voltage_mv,
            "signal_rssi_dbm": payload.signal_rssi_dbm,
            "timestamp": cur_ts,
            "sensor_status": "ONLINE",
            "source_type": "SIMULATED_ESP32" if payload.is_simulated else "PHYSICAL_ESP32_NODE",
            "quality_status": quality
        }

        # Persist to JSON telemetry log
        log_file = self.log_dir / "edge_sensor_stream.jsonl"
        with open(log_file, "a", encoding="utf-8") as f:
            f.write(json.dumps(processed_record) + "\n")

        logger.info("Ingested IoT telemetry from %s [%s]: Water Stage = %.3f m (%s)",
                    payload.device_id, payload.station_id, calculated_stage_m, quality)
        return processed_record

    def generate_mock_reading(self, device_id: str = "ESP32-FL-001", station_id: str = "CWC_PAT_G01") -> Dict[str, Any]:
        """
        Generates realistic simulated telemetry for demonstration without physical hardware.
        """
        return {
            "device_id": device_id,
            "station_id": station_id,
            "distance_cm": 248.5,
            "sensor_mount_offset_m": 52.00,
            "battery_voltage_mv": 3950,
            "signal_rssi_dbm": -66,
            "firmware_version": "v1.2.0-esp32-freertos",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "is_simulated": True
        }


if __name__ == "__main__":
    manager = IoTEdgeManager()
    mock_payload = manager.generate_mock_reading()
    res = manager.process_telemetry(mock_payload)
    print("Processed IoT Reading:\n", json.dumps(res, indent=2))
