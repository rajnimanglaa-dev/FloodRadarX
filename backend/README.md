# FloodRadarX Backend — Know Risk. Plan Better.

Comprehensive, enterprise-grade Java Spring Boot backend for **FloodRadarX**, a flood monitoring, machine learning risk prediction, satellite observation, and emergency response platform tailored for India.

---

## 1. System Architecture & Tech Stack

- **Java**: Version 26 (with release 25 compatibility)
- **Framework**: Spring Boot 4.2.0 (Spring Framework 7, Spring Security 7, Spring Data JPA)
- **Database**: MySQL 8.0.46
- **Authentication**: JWT (JSON Web Tokens) with BCrypt password hashing
- **API Documentation**: OpenAPI 3 / Swagger UI (`/swagger-ui.html`)
- **Build Tool**: Maven 3.10.1 (via Maven Wrapper `mvnw.cmd`)
- **Python Integration**: REST integration with ML service on port 5000

```
┌────────────────────────────────────────────────────────────────────────┐
│                          FloodRadarX Backend                           │
├───────────────┬───────────────────┬────────────────────────────────────┤
│ Security      │ Spring Security 7 │ BCrypt + Stateless JWT Auth        │
│ Controllers   │ REST Controllers  │ DTOs + Validation + ApiResponse    │
│ Services      │ Business Layer    │ Domain Logic + Resilience Fallbacks│
│ Data Layer    │ Spring Data JPA   │ MySQL 8.0.46 Normalized Tables     │
│ ML Connector  │ Java HttpClient   │ Communicates with Python FastAPI   │
└───────────────┴───────────────────┴────────────────────────────────────┘
```

---

## 2. Database Design & Tables

All tables are created automatically in the `floodradarx` database on startup:

1. `regions`: Indian districts, states, coordinates (lat/long), Survey of India/Census attribution, and separate `boundary_geojson` storage.
2. `users`: Registered users with BCrypt password hashing, contact info, preferred region, and roles (`ROLE_USER`, `ROLE_ADMIN`).
3. `historical_flood_events`: Verified past floods (severity, inundated area sq km, observation date, ISRO-NRSC / CWC source references).
4. `flood_predictions`: Model-generated risk scores (0–100), risk levels (`LOW`, `MODERATE`, `HIGH`, `UNKNOWN`), prediction factors, and timestamps.
5. `weather_data`: IMD rainfall (mm), temperature (°C), humidity, observation time, and station references.
6. `satellite_data`: ISRO-NRSC Bhuvan & Sentinel satellite observations, cloud cover %, flood inundation detection flags.
7. `water_level_observations`: River water level (meters), danger level, warning level, trend, and station information.
8. `shelters`: Relief shelters with coordinates, capacity, contact numbers, and verification status.
9. `emergency_contacts`: Admin-managed verified emergency organizations (NDRF, SDRF, NGOs, Red Cross, DDMA).
10. `alerts`: Active emergency alerts with risk level, severity, and broadcast status.
11. `sms_logs`: Notification dispatch records with delivery status and deduplication cooldown protection.

---

## 3. Seeded Accounts & Verified Data

On first startup, the database is automatically seeded with verified data:

### Default Accounts
| Role | Email | Password | Phone |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@floodradarx.in` | `Admin@123` | `9876543210` |
| **USER** | `user@floodradarx.in` | `User@123` | `9876543211` |

### Verified Indian Districts Seeded (15 Districts across States)
- **Punjab**: Ludhiana, Amritsar
- **Bihar**: Patna
- **Assam**: Cachar (Silchar), Dibrugarh
- **Kerala**: Wayanad, Ernakulam
- **Maharashtra**: Mumbai City, Kolhapur
- **Tamil Nadu**: Chennai, Cuddalore
- **Odisha**: Puri
- **Uttar Pradesh**: Gorakhpur
- **Jammu & Kashmir**: Srinagar
- **Gujarat**: Surat
- **Uttarakhand**: Uttarkashi

### Verified Historical Flood Records Seeded
- **Patna (2019, 2021)**: Ganga river basin flooding (ISRO-NRSC Bhuvan / CWC).
- **Cachar / Silchar (2022)**: Catastrophic Barak embankment breach (ASDMA / Bhuvan).
- **Wayanad (2018)**: Monsoon deluge & flash flooding (KSDMA).
- **Chennai (2015, 2023)**: Adyar river deluge & Cyclone Michaung (TNSDMA / IMD).
- **Ludhiana (2023)**: Sutlej overflow near Machhiwara (Punjab Water Resources / CWC).

---

## 4. API Documentation

### Public Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/hello` | Existing welcome health endpoint |
| `GET` | `/api/regions/search?name={name}` | Preserved region search API (e.g. `name=Ludhiana`) |
| `GET` | `/api/regions/search-all?query={query}` | Enhanced multi-field search across name, district, state |
| `GET` | `/api/regions/by-state?state={state}` | Search districts by state (e.g. `state=Punjab`) |
| `GET` | `/api/regions/{id}` | Detailed region view with latest prediction, history & weather |
| `GET` | `/api/regions/{id}/boundary` | Region boundary GeoJSON polygon and coordinates |
| `GET` | `/api/regions/{id}/history` | Historical flood events for a region |
| `GET` | `/api/regions` | List all registered regions |
| `GET` | `/api/risk-map` | Risk map data (`LOW` green, `MODERATE` yellow, `HIGH` red, `UNKNOWN`) |
| `GET` | `/api/flood-history` | All historical flood records |
| `GET` | `/api/flood-history/district?name={name}` | History by district name |
| `GET` | `/api/flood-history/year/{year}` | History by event year |
| `GET` | `/api/shelters` | All relief shelters |
| `GET` | `/api/shelters/district?name={name}` | Shelters in a district |
| `GET` | `/api/shelters/nearby?lat={lat}&lng={lng}&radiusKm={km}` | Nearby shelters using Haversine distance |
| `GET` | `/api/monitoring/weather/{regionId}` | Weather observations for region |
| `GET` | `/api/monitoring/satellite/{regionId}` | Satellite observations for region |
| `GET` | `/api/monitoring/water-level/{regionId}` | River water-level observations |
| `GET` | `/api/alerts/active` | Current active public emergency alerts |
| `POST` | `/api/auth/register` | Register new user account |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT token |
| `GET` | `/swagger-ui.html` | Interactive Swagger API Explorer |

### Authenticated & Prediction Endpoints

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/auth/me` | Bearer JWT | Current user profile |
| `POST` | `/api/predict` | Bearer JWT | Generate flood prediction via Python ML |
| `GET` | `/api/predict/latest/{regionId}` | Bearer JWT | Retrieve latest prediction for region |
| `POST` | `/api/alerts/broadcast` | Bearer JWT | Broadcast emergency alert & dispatch SMS |

### Admin Management Panel Endpoints (`ROLE_ADMIN`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/admin/dashboard` | Aggregated platform dashboard statistics |
| `GET` | `/api/admin/users` | List all users |
| `PATCH` | `/api/admin/users/{id}/status?enabled={bool}` | Toggle user enabled/disabled |
| `PATCH` | `/api/admin/users/{id}/role?role={role}` | Change user role (`ROLE_USER` / `ROLE_ADMIN`) |
| `DELETE` | `/api/admin/regions/{id}` | Delete a region |
| `POST` | `/api/admin/shelters` | Create new shelter record |
| `PATCH` | `/api/admin/shelters/{id}/verification?status={status}` | Update shelter verification |
| `GET` | `/api/admin/emergency-contacts` | List verified NGOs and emergency services |
| `POST` | `/api/admin/emergency-contacts` | Add emergency organization (NDRF, SDRF, NGO) |
| `PATCH` | `/api/admin/emergency-contacts/{id}/verification` | Verify emergency contact |
| `GET` | `/api/admin/sms-logs` | Inspect notification dispatch logs and status |

---

## 5. Python Prediction Model Integration (Module D)

Your teammate can easily connect their Python prediction model.

### 1. Configuration in `application.properties`:
```properties
python.ml.service.url=http://localhost:5000/api/predict
```

### 2. Request payload sent by Java backend to Python:
```json
{
  "regionId": 1,
  "district": "Ludhiana",
  "state": "Punjab",
  "rainfallMm": 165.5,
  "riverWaterLevelMeters": 7.8,
  "soilMoisturePercent": 62.0,
  "weatherForecastTrend": "INCREASING"
}
```

### 3. Expected response format returned by Python:
```json
{
  "regionId": 1,
  "riskScore": 78,
  "riskLevel": "HIGH",
  "predictionWindowHours": 6,
  "factors": {
    "rainfallTrend": "INCREASING",
    "waterLevelTrend": "RISING"
  }
}
```

### 4. Teammate's Sample Python (FastAPI) Implementation:
Create `app.py` in your teammate's workspace:
```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class FloodInput(BaseModel):
    regionId: int
    district: str
    state: str
    rainfallMm: float
    riverWaterLevelMeters: float
    soilMoisturePercent: float
    weatherForecastTrend: str

@app.post("/api/predict")
def predict_flood(input_data: FloodInput):
    # ML model inference logic (RandomForest / XGBoost / LSTM)
    if input_data.rainfallMm > 100 or input_data.riverWaterLevelMeters > 7:
        score = 82
        level = "HIGH"
    elif input_data.rainfallMm > 50:
        score = 55
        level = "MODERATE"
    else:
        score = 20
        level = "LOW"

    return {
        "regionId": input_data.regionId,
        "riskScore": score,
        "riskLevel": level,
        "predictionWindowHours": 6,
        "factors": {
            "rainfallTrend": "INCREASING" if input_data.rainfallMm > 50 else "STABLE",
            "waterLevelTrend": "RISING" if input_data.riverWaterLevelMeters > 5 else "STEADY"
        }
    }

# Run with: uvicorn app:app --host 0.0.0.0 --port 5000
```

> **Resilience Note**: If the Python service is offline, the Java backend automatically activates a hydrologic-threshold fallback model without crashing, records the score, sets `simulatedFallback: true`, and returns transparent diagnostic guidance.

---

## 6. How to Build & Run

### 1. Prerequisites
- Java 25 or 26 installed
- MySQL 8.0 running locally on port 3306 with database `floodradarx`

### 2. Run Tests
```powershell
.\mvnw.cmd test
```

### 3. Run the Spring Boot Application
```powershell
.\mvnw.cmd spring-boot:run
```
The application will start on:
- API Base URL: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI Specification: `http://localhost:8080/v3/api-docs`
