"""
Unit and Integration Tests for Hydrological Data Pipeline
"""

import sys
from pathlib import Path
import pytest
import pandas as pd
import numpy as np

# Add src to path
SRC_DIR = Path(__file__).resolve().parent.parent / "src"
sys.path.insert(0, str(SRC_DIR))

from data_pipeline import HydrologicalDataIngestor, FeatureEngineeringPipeline


@pytest.fixture
def temp_data_dir(tmp_path):
    data_dir = tmp_path / "data"
    raw_rain = data_dir / "raw" / "rainfall"
    raw_water = data_dir / "raw" / "water_levels"
    processed = data_dir / "processed"
    raw_rain.mkdir(parents=True)
    raw_water.mkdir(parents=True)
    processed.mkdir(parents=True)
    return data_dir


def test_rainfall_ingestion_valid(temp_data_dir):
    csv_file = temp_data_dir / "raw" / "rainfall" / "test_rain.csv"
    csv_file.write_text(
        "timestamp,station_id,rainfall_mm\n"
        "2026-11-21 10:00:00,STN_01,12.5\n"
        "2026-11-21 11:00:00,STN_01,24.0\n"
    )
    ingestor = HydrologicalDataIngestor(base_dir=temp_data_dir)
    df, report = ingestor.ingest_rainfall(csv_file)

    assert len(df) == 2
    assert report.records_retained == 2
    assert report.invalid_nulls_dropped == 0
    assert "rainfall_mm" in df.columns


def test_rainfall_invalid_timestamps_and_duplicates(temp_data_dir):
    csv_file = temp_data_dir / "raw" / "rainfall" / "test_corrupt.csv"
    csv_file.write_text(
        "timestamp,station_id,rainfall_mm\n"
        "INVALID_DATE,STN_01,10.0\n"
        "2026-11-21 10:00:00,STN_01,15.0\n"
        "2026-11-21 10:00:00,STN_01,20.0\n" # Duplicate timestamp for same station
        "2026-11-21 12:00:00,STN_01,\n" # Null rainfall
    )
    ingestor = HydrologicalDataIngestor(base_dir=temp_data_dir)
    df, report = ingestor.ingest_rainfall(csv_file)

    # Invalid timestamp dropped, null rainfall dropped, duplicate deduped -> 1 retained
    assert len(df) == 1
    assert df.iloc[0]["rainfall_mm"] == 20.0
    assert report.invalid_nulls_dropped == 2
    assert report.duplicates_dropped == 1


def test_water_level_calculations(temp_data_dir):
    csv_file = temp_data_dir / "raw" / "water_levels" / "test_water.csv"
    csv_file.write_text(
        "timestamp,station_id,water_level_m\n"
        "2026-11-21 08:00:00,CWC_01,4.00\n"
        "2026-11-21 10:00:00,CWC_01,4.50\n" # +0.50m in 2 hours -> 0.25 m/hr
        "2026-11-21 11:00:00,CWC_01,4.40\n" # -0.10m in 1 hour -> -0.10 m/hr
    )
    ingestor = HydrologicalDataIngestor(base_dir=temp_data_dir)
    df, report = ingestor.ingest_water_levels(csv_file)

    assert len(df) == 3
    # First row diff is 0.0
    assert df.iloc[0]["water_level_rise_rate"] == 0.0
    # Second row rise rate = (4.50 - 4.00) / 2 hours = 0.25 m/hr
    assert round(df.iloc[1]["water_level_rise_rate"], 2) == 0.25
    assert df.iloc[1]["stage_trend"] == "RISING"
    # Third row = -0.10 m/hr
    assert round(df.iloc[2]["water_level_rise_rate"], 2) == -0.10
    assert df.iloc[2]["stage_trend"] == "FALLING"


def test_rainfall_rolling_accumulations(temp_data_dir):
    pipe = FeatureEngineeringPipeline(base_dir=temp_data_dir)
    rain_df = pd.DataFrame({
        "station_id": ["STN_A"] * 6,
        "timestamp": pd.date_range("2026-11-21 00:00:00", periods=6, freq="1h"),
        "rainfall_mm": [10.0, 10.0, 10.0, 10.0, 10.0, 10.0]
    })
    res = pipe.compute_rainfall_features(rain_df)

    assert "rainfall_lag_1h_mm" in res.columns
    assert "rainfall_acc_3h_mm" in res.columns
    assert "rainfall_acc_6h_mm" in res.columns
    # Lag at t=0 is 0.0
    assert res.iloc[0]["rainfall_lag_1h_mm"] == 0.0
    # Lag at t=1 is 10.0
    assert res.iloc[1]["rainfall_lag_1h_mm"] == 10.0
    # 3h accumulator at t=2 (3 hours of 10mm) is 30.0
    assert res.iloc[2]["rainfall_acc_3h_mm"] == 30.0
