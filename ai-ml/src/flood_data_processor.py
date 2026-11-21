
import pandas as pd
from pathlib import Path


def process_flood_data(file_path):

    # Read the CSV dataset
    df = pd.read_csv(file_path)

    print("Original Flood Data:")
    print(df.head())

    # Check required columns
    required_columns = [
        "timestamp",
        "rainfall_mm",
        "water_level_m"
    ]

    for column in required_columns:
        if column not in df.columns:
            print(f"Missing column: {column}")
            return None

    # Convert data into correct formats
    df["timestamp"] = pd.to_datetime(
        df["timestamp"], errors="coerce"
    )

    df["rainfall_mm"] = pd.to_numeric(
        df["rainfall_mm"], errors="coerce"
    )

    df["water_level_m"] = pd.to_numeric(
        df["water_level_m"], errors="coerce"
    )

    # Remove invalid readings
    df = df.dropna(
        subset=[
            "timestamp",
            "rainfall_mm",
            "water_level_m"
        ]
    )

    # Arrange data by timestamp
    df = df.sort_values("timestamp")

    # Calculate water-level change
    df["water_level_change_m"] = (
        df["water_level_m"].diff()
    )

    # Calculate time difference in hours
    hours = (
        df["timestamp"].diff().dt.total_seconds() / 3600
    )

    # Calculate water-level rise rate
    df["water_level_rise_rate"] = (
        df["water_level_change_m"] / hours
    )

    print("\nProcessed Flood Data:")
    print(df)

    # Save processed dataset
    output_path = (
        Path(__file__).resolve().parent.parent
        / "data"
        / "processed_flood_data.csv"
    )

    df.to_csv(output_path, index=False)

    print("\nData processing completed!")
    print("Saved at:", output_path)

    return df


if __name__ == "__main__":

    dataset_path = (
        Path(__file__).resolve().parent.parent
        / "data"
        / "flood_readings.csv"
    )

    process_flood_data(dataset_path)
