# FloodRadarX AI/ML & IoT Data Dictionary

This document defines the schema, physical units, valid ranges, and null semantics for all data files processed by the FloodRadarX AI/ML subsystem.

---

## 1. Data Segregation Architecture

To maintain scientific honesty and prevent contamination:
1. **Raw Ingestion (`ai-ml/data/raw/`):** Original observation records and telemetry from CWC, IMD, NRSC, and edge sensors.
2. **Processed Features (`ai-ml/data/processed/`):** Harmonized, quality-checked, chronologically sequenced time series with engineered hydrologic features.
3. **Sample Testing Data (`ai-ml/data/sample/`):** Synthetic/mock records used strictly for smoke tests and CI pipeline validation. Never mixed into ML model training sets.
4. **Metadata Register (`ai-ml/data/metadata/`):** Lineage tracking, data source URLs, licensing, and schema dictionaries.

---

## 2. Rainfall Observations (`rainfall_processed.csv`)

| Field Name | Type | Physical Unit | Valid Range | Null Policy | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `timestamp` | ISO-8601 String | UTC / IST (`YYYY-MM-DD HH:MM:SS`) | 2000-01-01 to Present | Reject record | Telemetry observation time |
| `station_id` | String | Identifier | alphanumeric | Reject record | Station code registered with IMD or CWC |
| `station_name` | String | Text | non-empty | Reject record | Station geographic location name |
| `latitude` | Float | Decimal degrees | -90.0 to 90.0 | Keep if known | Sensor WGS84 latitude |
| `longitude` | Float | Decimal degrees | -180.0 to 180.0 | Keep if known | Sensor WGS84 longitude |
| `rainfall_mm` | Float | Millimetres (mm) | 0.0 to 800.0 mm/hr | Reject if null (never replace with 0) | Incremental precipitation in interval |
| `interval_hours` | Float | Hours | 0.25 to 24.0 | Default 1.0 | Aggregation window |
| `quality_status` | String | Categorical | `VERIFIED`, `SUSPECT`, `INTERPOLATED` | Flag | Sensor data validation state |
| `source` | String | Categorical | `IMD`, `CWC`, `NWDP` | Required | Agency provenance |

---

## 3. River Water Level & Flow Observations (`water_levels_processed.csv`)

| Field Name | Type | Physical Unit | Valid Range | Null Policy | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `timestamp` | ISO-8601 String | UTC / IST | 2000-01-01 to Present | Reject record | Observation timestamp |
| `river_name` | String | Text | non-empty | Reject record | Hydrological river course |
| `station_id` | String | Identifier | alphanumeric | Reject record | CWC hydrological gauge ID |
| `station_name` | String | Text | non-empty | Reject record | Gauge station location |
| `water_level_m` | Float | Metres (m MSL or local datum) | -5.0 to 300.0 | Reject if null | Current measured gauge stage |
| `warning_level_m` | Float | Metres (m) | > 0.0 | Retain official | Official CWC alert threshold |
| `danger_level_m` | Float | Metres (m) | > warning_level | Retain official | Official CWC extreme danger threshold |
| `discharge_cumec` | Float | m³/s (cumecs) | 0.0 to 100,000.0 | Retain null if unmeasured | Volumetric river discharge rate |
| `trend` | String | Enum | `RISING`, `FALLING`, `STEADY` | Derive from diff | River stage kinematic trend |
| `source` | String | Categorical | `CWC`, `NWDP`, `WRIS` | Required | Agency provenance |

---

## 4. Historical Flood Inundation Ground Truth (`nrsc_bhuvan_flood_events.csv`)

| Field Name | Type | Physical Unit | Valid Range | Null Policy | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `event_id` | String | Identifier | non-empty | Reject record | NRSC disaster event ID |
| `event_date` | Date (`YYYY-MM-DD`)| Calendar date | 2000 to Present | Reject record | Peak flood date |
| `region_id` | Integer | ID | Matching backend Region ID | Required | Cross-reference with Java Region |
| `district` | String | Text | Official Indian District | Required | Administrative district |
| `river_basin` | String | Text | Major Indian Basin | Required | River catchment |
| `severity` | String | Enum | `LOW`, `MODERATE`, `SEVERE`, `CATASTROPHIC` | Required | Disaster impact classification |
| `flooded_area_sqkm`| Float | Square kilometres (km²) | > 0.0 | Optional | Satellite detected inundation footprint |
| `flood_label` | Integer | Binary Ground Truth | 0 (No Flood), 1 (Verified Flood) | Required | Ground truth for supervised learning |
| `verification_status`| String | Enum | `VERIFIED_OFFICIAL`, `UNVERIFIED` | Required | Quality status |
| `source_reference` | String | URL / Citation | non-empty | Required | NRSC Bhuvan / State SDMA report |

---

## 5. Engineered ML Feature Vector (`flood_features.csv`)

| Feature Name | Type | Unit | Description |
| :--- | :--- | :--- | :--- |
| `rainfall_current_mm` | Float | mm | Current 1-hour rainfall |
| `rainfall_lag_1h_mm` | Float | mm | Precipitation from previous hour (t - 1) |
| `rainfall_acc_3h_mm` | Float | mm | 3-hour moving sum of precipitation |
| `rainfall_acc_6h_mm` | Float | mm | 6-hour moving sum of precipitation |
| `rainfall_acc_24h_mm`| Float | mm | 24-hour moving sum of precipitation |
| `water_level_current_m`| Float | m | Current stage at target station |
| `water_level_change_1h_m`| Float | m | Water level diff over 1 hour |
| `water_level_rise_rate_m_hr`| Float | m/hr | Kinematic rate of stage rise |
| `upstream_stage_trend`| Integer | {-1, 0, 1} | Falling (-1), Steady (0), Rising (+1) at upstream gauge |
| `river_discharge_cumec`| Float | m³/s | Measured or rating-curve flow volume |
| `terrain_elevation_m` | Float | m MSL | Copernicus DEM mean basin elevation |
| `terrain_slope_deg` | Float | degrees | Topographic slope |
| `freeboard_to_danger_m` | Float | m | Buffer remaining before danger mark (`danger_level - current_stage`) |
| `flood_target_6h` | Integer | Binary {0, 1} | Target label: Flood observed within next 6 hours |
