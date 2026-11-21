"""
FloodRadarX - Java Spring Boot Backend API Client
=================================================
Member 3: AI/ML & IoT Lead

Integrates the Python AI/ML microservice with Member 2's Java Spring Boot backend.
Handles bidirectional synchronization:
1. Pulling recent meteorological and hydrological observations:
   - GET /api/monitoring/weather/{regionId}
   - GET /api/monitoring/water-level/{regionId}
   - GET /api/monitoring/satellite/{regionId}
2. Pushing ML predictions to Java backend storage:
   - POST /api/predict

Features:
- Configurable base URL via environment variable FLOODRADARX_BACKEND_URL (default: http://localhost:8080).
- Robust HTTP timeouts (3-5s).
- Graceful connection error logging: Never crashes if Java backend is temporarily offline.
"""

import logging
import os
from typing import Dict, Any, List, Optional
import requests

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("FloodRadarX.JavaBackendClient")


class JavaBackendClient:
    """HTTP client communicating with Java Spring Boot REST API."""

    def __init__(self, base_url: Optional[str] = None, timeout_seconds: float = 4.0):
        self.base_url = (base_url or os.getenv("FLOODRADARX_BACKEND_URL", "http://localhost:8080")).rstrip("/")
        self.timeout = timeout_seconds

    def check_health(self) -> Dict[str, Any]:
        """Checks if the Java Spring Boot backend is reachable."""
        url = f"{self.base_url}/actuator/health"
        try:
            resp = requests.get(url, timeout=2.0)
            return {"online": resp.status_code == 200, "status_code": resp.status_code}
        except Exception as ex:
            logger.debug("Java backend offline or actuator unconfigured: %s", str(ex))
            return {"online": False, "error": str(ex)}

    def get_weather_observations(self, region_id: int) -> Optional[List[Dict[str, Any]]]:
        """Calls Java GET /api/monitoring/weather/{regionId}."""
        url = f"{self.base_url}/api/monitoring/weather/{region_id}"
        try:
            resp = requests.get(url, timeout=self.timeout)
            if resp.status_code == 200:
                data = resp.json()
                return data.get("data", [])
            logger.warning("Java backend returned HTTP %d for weather of region %d", resp.status_code, region_id)
            return None
        except requests.exceptions.RequestException as ex:
            logger.info("Java backend unreachable at %s: %s (Normal when backend is not running)", url, str(ex))
            return None

    def get_water_level_observations(self, region_id: int) -> Optional[List[Dict[str, Any]]]:
        """Calls Java GET /api/monitoring/water-level/{regionId}."""
        url = f"{self.base_url}/api/monitoring/water-level/{region_id}"
        try:
            resp = requests.get(url, timeout=self.timeout)
            if resp.status_code == 200:
                data = resp.json()
                return data.get("data", [])
            logger.warning("Java backend returned HTTP %d for water-level of region %d", resp.status_code, region_id)
            return None
        except requests.exceptions.RequestException as ex:
            logger.info("Java backend unreachable at %s: %s", url, str(ex))
            return None

    def post_prediction(self, prediction_payload: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Calls Java POST /api/predict to persist prediction in MySQL."""
        url = f"{self.base_url}/api/predict"
        try:
            resp = requests.post(url, json=prediction_payload, timeout=self.timeout)
            if resp.status_code in [200, 201]:
                return resp.json()
            logger.warning("Java backend returned HTTP %d on posting prediction", resp.status_code)
            return None
        except requests.exceptions.RequestException as ex:
            logger.info("Java backend unreachable at %s: %s", url, str(ex))
            return None


if __name__ == "__main__":
    client = JavaBackendClient()
    health = client.check_health()
    print("Java Backend Connection Status:", health)
