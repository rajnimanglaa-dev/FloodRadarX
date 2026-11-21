"""
Unit and Integration Tests for Satellite SAR Processing & Road Accessibility
"""

import sys
from pathlib import Path
import pytest
import numpy as np

SRC_DIR = Path(__file__).resolve().parent.parent / "src"
sys.path.insert(0, str(SRC_DIR))

from satellite_flood_detector import Sentinel1FloodDetector, SatelliteMetadata
from road_accessibility_analyzer import RoadAccessibilityAnalyzer


@pytest.fixture
def geo_output_dir(tmp_path):
    out = tmp_path / "geospatial"
    out.mkdir()
    return out


def test_lee_filter_and_otsu():
    detector = Sentinel1FloodDetector()
    synthetic_sar = np.random.normal(loc=-15.0, scale=3.0, size=(50, 50))
    filtered = detector.apply_lee_filter(synthetic_sar, size=3)

    assert filtered.shape == synthetic_sar.shape
    assert np.var(filtered) <= np.var(synthetic_sar) # Variance reduced

    thresh = detector.otsu_sar_threshold(filtered)
    assert -22.0 <= thresh <= -10.0


def test_satellite_flood_extent_pipeline(geo_output_dir):
    detector = Sentinel1FloodDetector(output_dir=geo_output_dir)
    res = detector.process_flood_extent(save_geotiff=True)

    assert res["status"] == "SUCCESS"
    assert res["flooded_pixel_count"] > 0
    assert res["estimated_flood_area_sqkm"] > 0.0

    geojson_file = Path(res["geojson_file"])
    geotiff_file = Path(res["geotiff_file"])

    assert geojson_file.exists()
    assert geotiff_file.exists()
    assert geojson_file.stat().st_size > 50


def test_road_accessibility_analysis(geo_output_dir):
    # First generate flood extent
    detector = Sentinel1FloodDetector(output_dir=geo_output_dir)
    detector.process_flood_extent(save_geotiff=True)

    analyzer = RoadAccessibilityAnalyzer(output_dir=geo_output_dir)
    flood_geojson = geo_output_dir / "flood_extent.geojson"
    res = analyzer.analyze_accessibility(flood_geojson_path=flood_geojson)

    assert res["total_roads_evaluated"] > 0
    assert res["inundated_roads_count"] >= 0
    assert len(res["inundated_corridors"]) >= 0

    road_geojson = Path(res["geojson_file"])
    assert road_geojson.exists()
