"""
Unit and Integration Tests for ESP32 IoT Ingestion & GSM/SMS Alerting
"""

import sys
from pathlib import Path
import pytest
from pydantic import ValidationError

SRC_DIR = Path(__file__).resolve().parent.parent / "src"
sys.path.insert(0, str(SRC_DIR))

from iot_sensor_manager import IoTEdgeManager, SensorTelemetryPayload
from sms_alert_manager import SmsAlertManager, EmergencySmsPayload


@pytest.fixture
def temp_iot_dir(tmp_path):
    d = tmp_path / "iot"
    d.mkdir()
    return d


def test_esp32_valid_payload_calculation(temp_iot_dir):
    manager = IoTEdgeManager(log_dir=temp_iot_dir)
    raw = {
        "device_id": "ESP32-TEST-01",
        "station_id": "CWC-PAT-G01",
        "distance_cm": 250.0,
        "sensor_mount_offset_m": 50.0,
        "battery_voltage_mv": 3800,
        "signal_rssi_dbm": -70,
        "is_simulated": True
    }
    processed = manager.process_telemetry(raw)

    # Water stage = 50.0m - 2.5m = 47.5m
    assert processed["calculated_water_level_m"] == 47.5
    assert processed["source_type"] == "SIMULATED_ESP32"
    assert processed["quality_status"] == "VALID_VERIFIED"


def test_esp32_invalid_telemetry_raises():
    # Distance out of physical transducer range (< 15cm)
    with pytest.raises(ValidationError):
        SensorTelemetryPayload(
            device_id="ESP32-FAIL",
            station_id="STN_01",
            distance_cm=5.0, # Violates ge=15.0
            sensor_mount_offset_m=10.0
        )


def test_sms_alert_mock_dispatch(tmp_path):
    sms_mgr = SmsAlertManager(provider="MOCK_PROVIDER")
    payload = {
        "region_id": 3,
        "region_name": "Patna",
        "risk_level": "HIGH",
        "risk_score": 75,
        "arrival_window": "3 to 5 hours",
        "phone_numbers": ["+919999988888"]
    }
    res = sms_mgr.dispatch_alert(payload)

    assert res["status"] == "DISPATCH_PROCESSED"
    assert res["dispatches_count"] == 1
    assert res["records"][0]["delivery_status"] == "DELIVERED_MOCK"
    assert "Patna" in res["records"][0]["message_text"]
    assert "Score 75/100" in res["records"][0]["message_text"]
