"""
FloodRadarX - Hydrological Data Ingestion & Preprocessing Pipeline
=================================================================
Member 3: AI/ML & IoT Lead

This module is responsible for:
1. Ingesting rainfall, water-level, discharge, terrain, and satellite metadata.
2. Validating schemas, timestamps, and physical plausibility ranges.
3. Detecting duplicates, sorting chronologically, and handling missing observations.
4. Calculating hydrological dynamics (water-level change, rise rate m/hr, discharge rates).
5. Generating rolling rainfall aggregations (1h lag, 3h, 6h, 24h moving sums).
6. Merging multi-sensor observations into unified analysis and feature datasets without future leakage.
"""

import json
import logging
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Tuple

import numpy as np
import pandas as pd

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("FloodRadarX.DataPipeline")


@dataclass
class IngestionReport:
    """Detailed summary of data quality, completeness, and processing results."""
    records_read: int = 0
    records_retained: int = 0
    duplicates_dropped: int = 0
    invalid_nulls_dropped: int = 0
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    data_quality_flags: Dict[str, int] = field(default_factory=dict)


class HydrologicalDataIngestor:
    """Ingests raw hydrological telemetry, validating schema and physical boundaries."""

    def __init__(self, base_dir: Optional[Path] = None):
        self.base_dir = base_dir or Path(__file__).resolve().parent.parent / "data"
        self.raw_dir = self.base_dir / "raw"
        self.processed_dir = self.base_dir / "processed"
        self.processed_dir.mkdir(parents=True, exist_ok=True)

    def ingest_rainfall(self, file_path: Path) -> Tuple[pd.DataFrame, IngestionReport]:
        """
        Ingest and validate hourly rainfall records.
        Physical checks: rainfall_mm >= 0.0 and <= 800.0 mm/hr.
        """
        report = IngestionReport()
        if not file_path.exists():
            raise FileNotFoundError(f"Rainfall file not found: {file_path}")

        df = pd.read_csv(file_path)
        report.records_read = len(df)

        required = ["timestamp", "station_id", "rainfall_mm"]
        for col in required:
            if col not in df.columns:
                raise ValueError(f"Missing required rainfall column: {col}")

        # Timestamp normalization
        df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce")
        null_ts = df["timestamp"].isna().sum()

        # Numeric conversions
        df["rainfall_mm"] = pd.to_numeric(df["rainfall_mm"], errors="coerce")

        # Drop invalid nulls
        clean_df = df.dropna(subset=["timestamp", "rainfall_mm", "station_id"]).copy()
        report.invalid_nulls_dropped = len(df) - len(clean_df)

        # Physical range validation (no negative rain, no astronomical bursts)
        valid_range_mask = (clean_df["rainfall_mm"] >= 0.0) & (clean_df["rainfall_mm"] <= 800.0)
        clean_df = clean_df[valid_range_mask]

        # Duplicate detection (same station at same timestamp)
        before_dedup = len(clean_df)
        clean_df = clean_df.drop_duplicates(subset=["station_id", "timestamp"], keep="last")
        report.duplicates_dropped = before_dedup - len(clean_df)

        clean_df = clean_df.sort_values(["station_id", "timestamp"]).reset_index(drop=True)
        report.records_retained = len(clean_df)

        if not clean_df.empty:
            report.start_time = str(clean_df["timestamp"].min())
            report.end_time = str(clean_df["timestamp"].max())

        logger.info("Ingested rainfall %s: Read=%d, Retained=%d", 
                    file_path.name, report.records_read, report.records_retained)
        return clean_df, report

    def ingest_water_levels(self, file_path: Path) -> Tuple[pd.DataFrame, IngestionReport]:
        """
        Ingest and validate river water-level records.
        Calculates stage change and kinematic rise rate (m/hr).
        """
        report = IngestionReport()
        if not file_path.exists():
            raise FileNotFoundError(f"Water level file not found: {file_path}")

        df = pd.read_csv(file_path)
        report.records_read = len(df)

        required = ["timestamp", "station_id", "water_level_m"]
        for col in required:
            if col not in df.columns:
                raise ValueError(f"Missing required water-level column: {col}")

        df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce")
        df["water_level_m"] = pd.to_numeric(df["water_level_m"], errors="coerce")

        if "warning_level_m" in df.columns:
            df["warning_level_m"] = pd.to_numeric(df["warning_level_m"], errors="coerce")
        if "danger_level_m" in df.columns:
            df["danger_level_m"] = pd.to_numeric(df["danger_level_m"], errors="coerce")
        if "discharge_cumec" in df.columns:
            df["discharge_cumec"] = pd.to_numeric(df["discharge_cumec"], errors="coerce")

        clean_df = df.dropna(subset=["timestamp", "water_level_m", "station_id"]).copy()
        report.invalid_nulls_dropped = len(df) - len(clean_df)

        # Deduplication
        before_dedup = len(clean_df)
        clean_df = clean_df.drop_duplicates(subset=["station_id", "timestamp"], keep="last")
        report.duplicates_dropped = before_dedup - len(clean_df)

        # Sort chronologically per station
        clean_df = clean_df.sort_values(["station_id", "timestamp"]).reset_index(drop=True)

        # Calculate time delta in hours
        time_diff_hours = clean_df.groupby("station_id")["timestamp"].diff().dt.total_seconds() / 3600.0

        # Calculate water-level change and rise rate per station
        clean_df["water_level_change_m"] = clean_df.groupby("station_id")["water_level_m"].diff()
        
        # Guard against zero or negative division
        valid_hours = time_diff_hours.where(time_diff_hours > 0.0, np.nan)
        clean_df["water_level_rise_rate"] = clean_df["water_level_change_m"] / valid_hours

        # First observation of each station has no diff -> fill with 0.0
        clean_df["water_level_change_m"] = clean_df["water_level_change_m"].fillna(0.0)
        clean_df["water_level_rise_rate"] = clean_df["water_level_rise_rate"].fillna(0.0)

        # Calculate kinematic stage trend
        clean_df["stage_trend"] = "STEADY"
        clean_df.loc[clean_df["water_level_rise_rate"] > 0.02, "stage_trend"] = "RISING"
        clean_df.loc[clean_df["water_level_rise_rate"] < -0.02, "stage_trend"] = "FALLING"

        report.records_retained = len(clean_df)
        if not clean_df.empty:
            report.start_time = str(clean_df["timestamp"].min())
            report.end_time = str(clean_df["timestamp"].max())

        logger.info("Ingested water levels %s: Read=%d, Retained=%d",
                    file_path.name, report.records_read, report.records_retained)
        return clean_df, report


class FeatureEngineeringPipeline:
    """
    Constructs temporally aligned features for machine learning.
    Avoids future data leakage by strictly using backward rolling windows.
    """

    def __init__(self, base_dir: Optional[Path] = None):
        self.base_dir = base_dir or Path(__file__).resolve().parent.parent / "data"
        self.ingestor = HydrologicalDataIngestor(self.base_dir)

    def compute_rainfall_features(self, df_rain: pd.DataFrame) -> pd.DataFrame:
        """
        Computes 1h lag, 3h, 6h, and 24h rolling accumulated rainfall per station.
        """
        df = df_rain.sort_values(["station_id", "timestamp"]).copy()
        
        # Set timestamp index for rolling calculations
        grouped = df.groupby("station_id")
        
        # 1-hour lag (precipitation from hour t - 1)
        df["rainfall_lag_1h_mm"] = grouped["rainfall_mm"].shift(1).fillna(0.0)

        # Rolling accumulators (using rolling windows on indexed time series)
        # We index on timestamp to perform reliable window sums
        accum_dfs = []
        for station_id, group in df.groupby("station_id"):
            g = group.set_index("timestamp").sort_index()
            g["rainfall_acc_3h_mm"] = g["rainfall_mm"].rolling("3h", closed="both").sum().fillna(0.0)
            g["rainfall_acc_6h_mm"] = g["rainfall_mm"].rolling("6h", closed="both").sum().fillna(0.0)
            g["rainfall_acc_24h_mm"] = g["rainfall_mm"].rolling("24h", closed="both").sum().fillna(0.0)
            accum_dfs.append(g.reset_index())

        result = pd.concat(accum_dfs, ignore_index=True)
        return result

    def build_combined_dataset(self) -> Tuple[pd.DataFrame, pd.DataFrame]:
        """
        Executes end-to-end ingestion, feature derivation, and target labeling.
        Saves:
        - ai-ml/data/processed/rainfall_processed.csv
        - ai-ml/data/processed/water_levels_processed.csv
        - ai-ml/data/processed/combined_flood_dataset.csv
        - ai-ml/data/processed/flood_features.csv
        """
        raw_rain_dir = self.base_dir / "raw" / "rainfall"
        raw_water_dir = self.base_dir / "raw" / "water_levels"
        raw_terrain_path = self.base_dir / "raw" / "terrain" / "basin_terrain_elevation.csv"

        # 1. Ingest all raw rainfall files
        rain_dfs = []
        for f in raw_rain_dir.glob("*.csv"):
            df, _ = self.ingestor.ingest_rainfall(f)
            rain_dfs.append(df)
        if not rain_dfs:
            raise FileNotFoundError("No raw rainfall CSV files found.")
        all_rain = pd.concat(rain_dfs, ignore_index=True)

        # 2. Ingest all raw water level files
        water_dfs = []
        for f in raw_water_dir.glob("*.csv"):
            df, _ = self.ingestor.ingest_water_levels(f)
            water_dfs.append(df)
        if not water_dfs:
            raise FileNotFoundError("No raw water level CSV files found.")
        all_water = pd.concat(water_dfs, ignore_index=True)

        # Save individual processed files
        all_rain.to_csv(self.base_dir / "processed" / "rainfall_processed.csv", index=False)
        all_water.to_csv(self.base_dir / "processed" / "water_levels_processed.csv", index=False)

        # 3. Compute rolling rainfall features
        rain_feats = self.compute_rainfall_features(all_rain)

        # 4. Map stations to geographical regions
        # Station mapping table
        station_region_map = {
            "IMD_PAT_01": {"region_id": 3, "district": "Patna", "state": "Bihar"},
            "CWC_PAT_G01": {"region_id": 3, "district": "Patna", "state": "Bihar"},
            "IMD_SIL_01": {"region_id": 4, "district": "Cachar", "state": "Assam"},
            "CWC_SIL_B01": {"region_id": 4, "district": "Cachar", "state": "Assam"},
            "IMD_LDH_01": {"region_id": 1, "district": "Ludhiana", "state": "Punjab"},
            "CWC_LDH_S01": {"region_id": 1, "district": "Ludhiana", "state": "Punjab"}
        }

        rain_feats["region_id"] = rain_feats["station_id"].map(lambda s: station_region_map.get(s, {}).get("region_id"))
        all_water["region_id"] = all_water["station_id"].map(lambda s: station_region_map.get(s, {}).get("region_id"))

        # Merge rainfall and water levels on region_id and timestamp
        combined = pd.merge(
            all_water,
            rain_feats[["region_id", "timestamp", "rainfall_mm", "rainfall_lag_1h_mm", 
                        "rainfall_acc_3h_mm", "rainfall_acc_6h_mm", "rainfall_acc_24h_mm"]],
            on=["region_id", "timestamp"],
            how="inner",
            suffixes=("_water", "_rain")
        )

        # Merge terrain parameters if available
        if raw_terrain_path.exists():
            df_terrain = pd.read_csv(raw_terrain_path)
            combined = pd.merge(combined, df_terrain[["region_id", "mean_elevation_m", "mean_slope_deg"]], 
                                on="region_id", how="left")
        else:
            combined["mean_elevation_m"] = 50.0
            combined["mean_slope_deg"] = 1.0

        # Compute freeboard buffer (distance in meters to danger mark)
        # If water_level >= danger_level, freeboard <= 0 (flood condition)
        combined["freeboard_to_danger_m"] = combined["danger_level_m"] - combined["water_level_m"]
        combined["freeboard_to_warning_m"] = combined["warning_level_m"] - combined["water_level_m"]

        # Calculate upstream stage trend proxy:
        # 1 = Rising, 0 = Steady, -1 = Falling
        trend_map = {"RISING": 1, "STEADY": 0, "FALLING": -1}
        combined["stage_trend_numeric"] = combined["stage_trend"].map(trend_map).fillna(0).astype(int)

        # Target label definition:
        # A flood condition (1) occurs when water_level reaches or exceeds danger mark
        # OR when significant inundation is imminent within the 6-hour prediction window.
        # We calculate forward-looking 6h max water level strictly for training label creation:
        grouped = combined.groupby("region_id")
        combined["future_max_water_6h"] = grouped["water_level_m"].transform(
            lambda s: s.rolling(6, closed="left").max().shift(-6)
        )
        
        # Label: 1 if future water level exceeds danger mark within 6h, else 0
        is_flood = (combined["future_max_water_6h"] >= combined["danger_level_m"]) | (combined["water_level_m"] >= combined["danger_level_m"])
        combined["flood_target_6h"] = is_flood.astype(int)

        # Drop the look-ahead forward column so it cannot leak into features!
        feature_cols = [
            "region_id", "timestamp", "station_id", "river_name",
            "rainfall_mm", "rainfall_lag_1h_mm", "rainfall_acc_3h_mm",
            "rainfall_acc_6h_mm", "rainfall_acc_24h_mm",
            "water_level_m", "warning_level_m", "danger_level_m",
            "water_level_change_m", "water_level_rise_rate",
            "stage_trend_numeric", "discharge_cumec",
            "mean_elevation_m", "mean_slope_deg",
            "freeboard_to_danger_m", "freeboard_to_warning_m",
            "flood_target_6h"
        ]
        
        clean_features = combined[feature_cols].dropna(subset=["water_level_m", "rainfall_mm"]).copy()
        clean_features = clean_features.sort_values(["region_id", "timestamp"]).reset_index(drop=True)

        # Save to disk
        combined.to_csv(self.base_dir / "processed" / "combined_flood_dataset.csv", index=False)
        clean_features.to_csv(self.base_dir / "processed" / "flood_features.csv", index=False)

        logger.info("Successfully generated processed datasets:")
        logger.info("  Combined dataset: %d rows", len(combined))
        logger.info("  Feature dataset: %d rows (Target positive rate: %.2f%%)", 
                    len(clean_features), 100.0 * clean_features["flood_target_6h"].mean())
        return combined, clean_features


if __name__ == "__main__":
    pipeline = FeatureEngineeringPipeline()
    combined_df, feat_df = pipeline.build_combined_dataset()
    print("Pipeline execution complete. Features shape:", feat_df.shape)
