# FloodRadarX — Member 3: AI/ML, Geospatial & IoT Lead Documentation

Welcome to the complete implementation documentation for **Member 3 (AI/ML & IoT Lead)** of **FloodRadarX**.

---

## 1. Role Overview & Objectives

As Member 3, your responsibility in FloodRadarX encompasses the core intelligence, hydrological physics, remote sensing, edge telemetry, and alerting subsystems:
1. **Hydrological Data Engineering:** Ingesting, quality-checking, and aggregating multi-sensor observations (CWC river water levels, IMD rainfall, river discharge).
2. **AI/ML Flood Risk Prediction:** Machine learning inference (Gradient Boosting / Random Forest) providing calibrated risk scores (0-100) and discrete risk levels (`LOW`, `MODERATE`, `HIGH`, `CRITICAL`).
3. **Physical Flood Arrival-Time Window Estimation:** Calculating realistic surge arrival windows using channel friction, stage rise rates, and upstream wave travel times (Saint-Venant kinematic wave approximation).
4. **Sentinel-1 SAR Satellite Flood Detection:** Processing radar amplitude imagery with speckle filtering, radiometric thresholding, and change detection to export vector polygons (`GeoJSON`) and masks (`GeoTIFF`).
5. **Road Accessibility Analysis:** Intersecting OpenStreetMap (OSM) highway geometries with detected flood extents to identify inundated roads and safe evacuation corridors.
6. **ESP32 Edge IoT Ingestion:** Validating ultrasonic transducer telemetry and calculating river stage relative to physical datum offsets.
7. **Offline Emergency SMS Alerting:** Dispatches high-priority early warning SMS via GSM modems or mock gateways during internet outages.
8. **Java Spring Boot Integration:** Serving a production-grade FastAPI microservice on port 5000 directly integrated with Member 2's backend.

---

## 2. Directory Structure

```text
ai-ml/
├── data/
│   ├── raw/                           # Unaltered official & sensor observations
│   │   ├── rainfall/                  # IMD / CWC hourly rainfall CSVs
│   │   ├── water_levels/              # CWC river gauge stage telemetry CSVs
│   │   ├── discharge/                 # CWC volumetric flow rate CSVs
│   │   ├── flood_history/             # NRSC Bhuvan historical disaster ground truth
│   │   ├── terrain/                   # Copernicus DEM elevation and slope
│   │   ├── satellite/                 # Sentinel-1 SAR metadata and scenes
│   │   ├── sensors/                   # ESP32 raw edge telemetry streams
│   │   └── sms_logs/                  # GSM/SMS dispatch audit logs
│   ├── processed/                     # Harmonized time series & features
│   │   ├── rainfall_processed.csv     # Cleaned, deduplicated rainfall
│   │   ├── water_levels_processed.csv # Stage rates and kinematic trends
│   │   ├── combined_flood_dataset.csv # Spatio-temporal merged observation grid
│   │   ├── flood_features.csv         # ML training feature matrix with 6h horizon
│   │   └── geospatial/                # Exported GIS layers
│   │       ├── flood_extent.geojson   # Satellite detected flood polygons
│   │       ├── flood_extent_mask.tif  # High-resolution raster mask
│   │       └── road_accessibility.geojson # OSM road network with safety status
│   ├── sample/                        # Isolated synthetic test files
│   │   ├── flood_readings.csv         # Original legacy smoke-test CSV
│   │   └── simulated_readings.csv     # Isolated synthetic sample
│   └── metadata/
│       ├── dataset_sources.csv        # Official government portal register & licenses
│       └── data_dictionary.md         # Field definitions, units, and ranges
├── models/
│   ├── flood_risk_model.joblib        # Serialized champion ML model artifact
│   ├── scaler.joblib                  # Standardized feature scaler
│   ├── model_metadata.json            # Versioning, hyperparameters, feature order
│   └── model_evaluation_report.md     # Benchmarking results (F1, Recall, ROC-AUC)
├── notebooks/                         # Jupyter research notebooks
├── src/                               # Production source code
│   ├── data_pipeline.py               # Ingestion, validation, and feature engineering
│   ├── flood_data_processor.py        # Preserved legacy processor script
│   ├── train_model.py                 # Time-based model training and benchmarking
│   ├── flood_risk_engine.py           # Core inference engine with explainability
│   ├── arrival_time_estimator.py      # Hydrodynamic wave propagation window calculator
│   ├── satellite_flood_detector.py    # Sentinel-1 SAR amplitude processing
│   ├── road_accessibility_analyzer.py # OSM road overlay and route safety classifier
│   ├── iot_sensor_manager.py          # ESP32 ultrasonic telemetry ingestion
│   ├── sms_alert_manager.py           # Emergency SMS dispatcher
│   ├── java_backend_client.py         # HTTP client communicating with Spring Boot
│   └── api_service.py                 # FastAPI microservice running on port 5000
├── tests/                             # Pytest test suite (23 automated tests)
│   ├── test_data_pipeline.py          # Data ingestion and diff/lag tests
│   ├── test_ml_and_risk_engine.py     # ML inference and arrival time tests
│   ├── test_geospatial_satellite.py   # SAR filter, Otsu, and road intersection tests
│   ├── test_iot_and_sms.py            # IoT telemetry validation and SMS tests
│   └── test_api_endpoints.py          # FastAPI endpoint integration tests
└── venv/                              # Virtual environment (NEVER committed to git)
```

---

## 3. Module Explanations (Beginner's Guide)

| Script | Purpose & How It Works |
| :--- | :--- |
| `src/data_pipeline.py` | Ingests raw files, removes invalid dates or negative rainfall, calculates the rate at which river water is rising ($m/hr$), and calculates rolling rainfall sums (1h lag, 3h, 6h, 24h). |
| `src/train_model.py` | Splits data into chronological Train (70%), Validation (15%), and Test (15%) sets. Trains Logistic Regression, Random Forest, and Gradient Boosting models, handles class imbalance, evaluates metrics, and saves the best model to disk. |
| `src/flood_risk_engine.py` | Takes input parameters (rainfall, river level, rise rate), runs inference through the trained model, bounds it with official CWC danger thresholds, and produces a 0-100 risk score with human-readable explanations. |
| `src/arrival_time_estimator.py` | Calculates when flood water will reach danger levels. Uses kinematic stage rise: $t = \frac{\text{Danger Level} - \text{Water Level}}{\text{Rise Rate}}$ combined with upstream wave travel speed to output an arrival window (e.g. 2 to 4 hours). |
| `src/satellite_flood_detector.py` | Analyzes synthetic or real Sentinel-1 SAR imagery. Applies a Lee filter to remove speckle noise, finds the water threshold using Otsu's method, detects newly flooded areas, and saves them as GeoJSON polygons and GeoTIFF masks. |
| `src/road_accessibility_analyzer.py` | Takes roads from OpenStreetMap and intersects them with the satellite flood polygons. Marks flooded roads as `INUNDATED` (red), nearby roads as `ALERT_PROXIMITY` (amber), and safe elevated bypasses as `PASSABLE_ELEVATED` (green). |
| `src/iot_sensor_manager.py` | Connects to ESP32 ultrasonic water-level sensors (JSN-SR04T). Converts distance to actual water stage: $\text{Water Level} = \text{Sensor Height} - \text{Distance}$, checks battery voltage, and logs telemetry. |
| `src/sms_alert_manager.py` | Generates critical alert messages under 160 characters and dispatches them via a mock gateway or real GSM hardware modem (SIM800L) to disaster officials (NDRF, DDMA). |
| `src/api_service.py` | A FastAPI web server running on port 5000. It receives prediction requests from Member 2's Java Spring Boot backend, returns AI risk evaluations, and serves map GeoJSON layers. |
| `src/java_backend_client.py` | Helper that lets Python fetch live weather or water levels from Member 2's Java Spring Boot backend (`http://localhost:8080`) without crashing if the backend is temporarily offline. |

---

## 4. Official Data Sources & License Register

All datasets strictly follow Indian open-data governance and scientific attribution:

1. **National Water Data Portal (NWDP / CWC):** Hourly telemetry of river stage, discharge, and rainfall across major river basins (Ganga, Barak, Sutlej). Open Government Data (GODL-India).
2. **India Meteorological Department (IMD):** Gridded rainfall and Automatic Weather Station (AWS) observations.
3. **ISRO National Remote Sensing Centre (NRSC) Bhuvan Flood Portal:** Satellite flood inundation maps and verified historical flood events (2015 Chennai, 2018 Kerala, 2019 Patna, 2022 Assam, 2023 Punjab).
4. **Copernicus Data Space Ecosystem (ESA):** Sentinel-1 C-Band Synthetic Aperture Radar (SAR) Ground Range Detected (GRD) imagery.
5. **Copernicus DEM & NASA SRTM:** 30m digital elevation and topographic slope models.
6. **OpenStreetMap (OSM):** Road network vector geometries under Open Database License (ODbL).

See `ai-ml/data/metadata/dataset_sources.csv` for portal links, update frequencies, and access requirements.

---

## 5. Setup & Execution Guide (Windows PowerShell)

All commands must be executed from `C:\Projects\FloodRadarX\ai-ml` in Windows PowerShell.

### Step 1: Activate Virtual Environment
```powershell
Set-Location "C:\Projects\FloodRadarX\ai-ml"
& ".\venv\Scripts\Activate.ps1"
```

### Step 2: Run Data Pipeline (Ingestion & Feature Engineering)
```powershell
& ".\venv\Scripts\python.exe" "src/data_pipeline.py"
```
*Outputs: `rainfall_processed.csv`, `water_levels_processed.csv`, `combined_flood_dataset.csv`, `flood_features.csv`.*

### Step 3: Train & Benchmark ML Models
```powershell
& ".\venv\Scripts\python.exe" "src/train_model.py"
```
*Outputs: `models/flood_risk_model.joblib`, `models/model_metadata.json`, `models/model_evaluation_report.md`.*

### Step 4: Run Sentinel-1 Satellite Flood Detection
```powershell
& ".\venv\Scripts\python.exe" "src/satellite_flood_detector.py"
```
*Outputs: `data/processed/geospatial/flood_extent.geojson`, `flood_extent_mask.tif`.*

### Step 5: Run Road Accessibility & Inundation Analysis
```powershell
& ".\venv\Scripts\python.exe" "src/road_accessibility_analyzer.py"
```
*Outputs: `data/processed/geospatial/road_accessibility.geojson`.*

### Step 6: Start the FastAPI Microservice on Port 5000
```powershell
& ".\venv\Scripts\python.exe" "src/api_service.py"
```
*Server starts at `http://localhost:5000`. Swagger documentation available at `http://localhost:5000/docs`.*

### Step 7: Run the Automated Pytest Suite
```powershell
& ".\venv\Scripts\python.exe" -m pytest "tests" -v
```
*Executes all 23 unit and integration tests across data processing, ML risk prediction, satellite extraction, IoT ingestion, and API contracts.*

---

## 6. Java Spring Boot Backend Integration Contract

Member 2's Java backend (`com.FloodRadarX.demo.service.PythonPredictionService`) calls:
- **HTTP Method:** `POST`
- **URL:** `http://localhost:5000/api/predict`

### Request Payload Sent by Java:
```json
{
  "regionId": 3,
  "district": "Patna",
  "state": "Bihar",
  "rainfallMm": 68.5,
  "riverWaterLevelMeters": 49.95,
  "waterLevelRiseRate": 0.09,
  "soilMoisturePercent": 45.0,
  "weatherForecastTrend": "WORSENING"
}
```

### Response Returned by Python AI/ML Service:
```json
{
  "regionId": 3,
  "district": "Patna",
  "state": "Bihar",
  "riskScore": 98,
  "riskLevel": "CRITICAL",
  "predictionWindowHours": 6,
  "modelVersion": "FloodRadarX-RF-v1.0",
  "dataStatus": "COMPLETE",
  "predictionSource": "PYTHON_ML",
  "factors": {
    "rainfallTrend": "INCREASING",
    "waterLevelTrend": "RISING"
  },
  "explanation": {
    "rainfallContributionPercent": 57.9,
    "waterLevelContributionPercent": 42.1,
    "primaryThreat": "Rapid water rise rate (0.09 m/hr) indicates flash flood surge.",
    "mlModelProbability": 0.9997,
    "dangerThresholdMeters": 50.2,
    "freeboardMeters": 0.25
  },
  "arrivalEstimate": {
    "status": "IMMINENT_SURGE",
    "windowFormatted": "1.9 to 3.0 hours",
    "minArrivalHours": 1.9,
    "maxArrivalHours": 3.0,
    "confidence": "HIGH",
    "uncertaintyNotes": "Arrival window accounts for channel friction, lateral catchment runoff, and upstream telemetry."
  },
  "note": "Prediction computed by FloodRadarX-RF-v1.0. Primary threat: Rapid water rise rate (0.09 m/hr) indicates flash flood surge.",
  "timestamp": "2026-11-21T22:36:51.908009"
}
```

If the Java backend sends nulls or data is missing, the service responds with:
```json
{
  "regionId": 1,
  "riskScore": 0,
  "riskLevel": "LOW",
  "predictionWindowHours": 6,
  "modelVersion": "FloodRadarX-v1.0",
  "dataStatus": "INSUFFICIENT_DATA",
  "factors": {
    "rainfallTrend": "UNKNOWN",
    "waterLevelTrend": "UNKNOWN"
  },
  "explanation": {
    "warning": "Both rainfall and river water level are absent. Prediction cannot proceed safely."
  }
}
```

---

## 7. Model Benchmarking Summary

Evaluated on 4,320 hourly observations with chronological temporal splits (Train: 70%, Val: 15%, Test: 15%):

| Model Algorithm | Accuracy | Precision | Recall | F1 Score | ROC-AUC | False Negative Rate (FNR) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Baseline (Logistic Regression)** | 0.9707 | 0.8492 | **1.0000** | 0.9185 | 0.9996 | **0.0000** |
| **Random Forest** | 0.9907 | 0.9706 | 0.9252 | 0.9474 | 0.9976 | 0.0748 |
| **Gradient Boosting (Champion)** | **0.9954** | **1.0000** | **0.9720** | **0.9858** | **0.9870** | **0.0280** |

*See `models/model_evaluation_report.md` for full confusion matrices and feature importance rankings.*

---

## 8. Scientific Disclosures & Limitations

1. **Hardware Ingestion:** Field ESP32 edge nodes are tested with high-fidelity validation schemas and mock drivers. Physical hardware deployment requires serial/WiFi gateway connectivity at the field site.
2. **Sentinel-1 SAR Latency:** Sentinel-1 satellite revisits occur every 6 to 12 days. Radar flood detection reflects the exact satellite overpass epoch, not continuous minute-by-minute surface water movement.
3. **Arrival-Time Kinematics:** Flood wave travel windows are kinematic approximations based on CWC channel cross-sections. Exact arrival times depend on local levee breaches, soil saturation dynamics, and tidal backwater effects.
4. **Data Separation:** Synthetic test records are strictly sequestered in `data/sample/` and are never mixed into production model training sets.
