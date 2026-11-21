# FloodRadarX AI/ML Model Evaluation Report

**Model Version:** `FloodRadarX-RF-v1.0`  
**Champion Architecture:** `GradientBoostingClassifier`  
**Training Date:** 2026-11-21 22:33:46  
**Prediction Horizon:** 6 Hours Forward Hydrological Risk Window  
**Split Protocol:** Chronological Temporal Split (Train: 70%, Val: 15%, Test: 15%)  

---

## 1. Candidate Model Benchmark Summary

| Model Architecture | Test Accuracy | Precision | Recall | F1 Score | ROC-AUC | False Negative Rate (FNR) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Baseline (Logistic Reg)** | 0.9707 | 0.8492 | 1.0000 | 0.9185 | 0.9996 | 0.0000 |
| **Random Forest (Champion)** | 0.9830 | 0.9706 | 0.9252 | 0.9474 | 0.9976 | 0.0748 |
| **Gradient Boosting** | 0.9954 | 1.0000 | 0.9720 | 0.9858 | 0.9870 | 0.0280 |

---

## 2. Confusion Matrix (Test Set - GradientBoostingClassifier)

- **True Negatives (TN):** 541 (Correctly predicted no flood)
- **False Positives (FP):** 0 (False alarm)
- **False Negatives (FN):** 3 (Missed flood event - life safety critical)
- **True Positives (TP):** 104 (Correctly predicted imminent flood)

> **Scientific Note on False Negatives:** In hydrological disaster early warning systems, a False Negative (failing to alert a flooding community) is significantly more hazardous than a False Positive. The champion model prioritizes high recall while maintaining balanced precision.

---

## 3. Top Feature Importances (Gini Impurity Reduction)

| Rank | Feature | Importance | Hydrological Meaning |
| :--- | :--- | :--- | :--- |
| 1 | `freeboard_to_danger_m` | 0.9142 | Critical stage and kinematic indicator |
| 2 | `stage_trend_numeric` | 0.0537 | Critical stage and kinematic indicator |
| 3 | `water_level_rise_rate` | 0.0225 | Critical stage and kinematic indicator |
| 4 | `water_level_change_m` | 0.0096 | Critical stage and kinematic indicator |
| 5 | `rainfall_mm` | -0.0000 | Critical stage and kinematic indicator |
| 6 | `rainfall_lag_1h_mm` | 0.0000 | Critical stage and kinematic indicator |
| 7 | `rainfall_acc_3h_mm` | 0.0000 | Critical stage and kinematic indicator |

---

## 4. Class Imbalance Mitigation Strategy

- Hydrological flood events represent episodic extremes (positive rate in test set ~15-20%).
- Imbalance is handled through cost-sensitive learning (`class_weight='balanced'`) during tree split optimization.
- Threshold tuning ensures probability calibration for continuous risk score (0-100) generation.
