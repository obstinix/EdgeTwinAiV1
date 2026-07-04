import math

# Machine definitions and thresholds
THRESHOLDS = {
    "M1": {"temp": 80.0, "vibration": 4.5, "rpm": 3000.0, "load": 95.0, "name": "CNC Mill"},
    "M2": {"temp": 260.0, "vibration": 3.5, "pressure": 150.0, "load": 95.0, "name": "Injection Molder"},
    "M3": {"temp": 75.0, "vibration": 3.0, "joint_load": 90.0, "load": 90.0, "name": "6-Axis Robot Arm"},
    "M4": {"temp": 85.0, "vibration": 4.0, "pressure": 10.0, "load": 90.0, "name": "Air Compressor"},
    "M5": {"temp": 70.0, "vibration": 2.5, "tension": 150.0, "load": 90.0, "name": "Smart Conveyor"},
    "M6": {"temp": 80.0, "vibration": 4.0, "pressure": 320.0, "load": 90.0, "name": "Hydraulic Press"}
}

def sigmoid(x):
    return 1 / (1 + math.exp(-x))

def predict_machine_health(machine_id, metrics, runtime_hours):
    """
    Simulates Edge AI ML models (like Interpretable Logistic Deviation Models) to predict:
    1. Failure Probability (%)
    2. Remaining Useful Life (RUL) in hours
    3. Energy Inefficiency Index
    4. Explainable AI Feature Importances
    """
    thresholds = THRESHOLDS.get(machine_id)
    if not thresholds:
        return {
            "failure_probability": 0.05,
            "rul_hours": 300,
            "anomalous": False,
            "energy_inefficiency": 0.05,
            "feature_importances": {},
            "explanation": "No threshold configuration found."
        }
    
    # Calculate feature deviations to simulate ML input nodes
    temp = metrics.get("temperature", 25.0)
    vibration = metrics.get("vibration", 0.5)
    load = metrics.get("load", 50.0)
    energy = metrics.get("energy", 10.0)
    
    # Determine base deviation score (Z-score simulator)
    temp_dev = max(0.0, (temp - (thresholds.get("temp") * 0.6)) / (thresholds.get("temp") * 0.4))
    vib_dev = max(0.0, (vibration - (thresholds.get("vibration") * 0.5)) / (thresholds.get("vibration") * 0.5))
    load_dev = max(0.0, (load - (thresholds.get("load") * 0.8)) / (thresholds.get("load") * 0.2))
    
    # Machine-specific features
    specific_dev = 0.0
    specific_name = "load"
    
    if machine_id == "M1": # CNC Mill (RPM)
        rpm = metrics.get("rpm", 2000.0)
        specific_dev = max(0.0, (rpm - (thresholds["rpm"] * 0.8)) / (thresholds["rpm"] * 0.2))
        specific_name = "RPM"
    elif machine_id == "M2": # Injection Molder (Pressure)
        press = metrics.get("pressure", 120.0)
        specific_dev = max(0.0, (press - (thresholds["pressure"] * 0.8)) / (thresholds["pressure"] * 0.2))
        specific_name = "clamping_pressure"
    elif machine_id == "M3": # Robot (Joint load)
        jl = metrics.get("joint_load", 50.0)
        specific_dev = max(0.0, (jl - (thresholds["joint_load"] * 0.8)) / (thresholds["joint_load"] * 0.2))
        specific_name = "joint_load"
    elif machine_id == "M4": # Compressor (Pressure)
        press = metrics.get("pressure", 7.0)
        specific_dev = max(0.0, (press - (thresholds["pressure"] * 0.8)) / (thresholds["pressure"] * 0.2))
        specific_name = "pressure"
    elif machine_id == "M5": # Conveyor (Tension)
        tens = metrics.get("tension", 100.0)
        specific_dev = max(0.0, (tens - (thresholds["tension"] * 0.8)) / (thresholds["tension"] * 0.2))
        specific_name = "belt_tension"
    elif machine_id == "M6": # Hydraulic Press (Pressure)
        press = metrics.get("pressure", 220.0)
        specific_dev = max(0.0, (press - (thresholds["pressure"] * 0.8)) / (thresholds["pressure"] * 0.2))
        specific_name = "pressure"
        
    # Logistic regression scoring function
    # Let coefficients simulate feature weights
    intercept = -4.5 # baseline low risk
    w_temp = 2.8
    w_vib = 3.5
    w_load = 1.2
    w_spec = 2.0
    w_runtime = 0.002 # wear accumulation
    
    score = intercept + (temp_dev * w_temp) + (vib_dev * w_vib) + (load_dev * w_load) + (specific_dev * w_spec) + (runtime_hours * w_runtime)
    prob = sigmoid(score)
    
    # Calculate Remaining Useful Life (RUL)
    # Standard RUL decreases logarithmically with high risk
    max_rul = 240.0 # 10 days
    if prob < 0.1:
        rul = max_rul - (runtime_hours % 120.0) * 0.2 # nominal wear
    else:
        # Rapid drop when prob is high
        rul = max_rul * (1.0 - prob) * (0.1 + 0.9 * math.exp(-3.0 * (prob - 0.1)))
        
    rul = max(0.5, round(rul, 1))
    
    # Energy Inefficiency Index:
    # High load but low actual performance (idle energy waste)
    # E.g., CNC Mill spinning fast but not processing load, or high friction heating up the motor
    base_inefficiency = 0.05
    friction_waste = temp_dev * 0.35 + vib_dev * 0.25
    
    # If load is very low but energy is relatively high, index goes up
    # Normal energy per unit load is around 0.2 kW/load%
    # M1 normal: Load 70%, Energy 15 kW -> 0.21
    load_val = max(5.0, load)
    energy_intensity = energy / load_val
    intensity_waste = max(0.0, (energy_intensity - 0.25) * 2.0) if machine_id in ["M1", "M3", "M5"] else 0.0
    
    energy_ineff = min(0.95, base_inefficiency + friction_waste + intensity_waste)
    
    # Compute XAI Feature Importances
    contrib_temp = max(0.01, temp_dev * w_temp)
    contrib_vib = max(0.01, vib_dev * w_vib)
    contrib_load = max(0.01, load_dev * w_load)
    contrib_spec = max(0.01, specific_dev * w_spec)
    contrib_wear = max(0.01, runtime_hours * w_runtime)
    
    total_contrib = contrib_temp + contrib_vib + contrib_load + contrib_spec + contrib_wear
    importances = {
        "Temperature": round((contrib_temp / total_contrib) * 100),
        "Vibration": round((contrib_vib / total_contrib) * 100),
        "Operating Load": round((contrib_load / total_contrib) * 100),
        specific_name.replace("_", " ").title(): round((contrib_spec / total_contrib) * 100),
        "Running Wear": round((contrib_wear / total_contrib) * 100)
    }
    
    # Ensure sums to 100 due to rounding
    diff = 100 - sum(importances.values())
    if diff != 0:
        max_key = max(importances, key=importances.get)
        importances[max_key] += diff
        
    # Build explaining strings
    anomalous = prob > 0.45
    explanation = ""
    
    if prob > 0.7:
        main_driver = max(importances, key=importances.get)
        explanation = f"Critical risk detected. The primary driver is abnormally high {main_driver} (contributing {importances[main_driver]}% of failure score)."
    elif prob > 0.3:
        explanation = "Warning threshold exceeded. Slight mechanical wear and thermal buildup detected under load."
    else:
        explanation = "Machine is operating within normal technical parameters. Nominal heat dissipation and vibration levels."
        
    return {
        "failure_probability": round(prob * 100, 1),
        "rul_hours": rul,
        "anomalous": anomalous,
        "energy_inefficiency": round(energy_ineff * 100, 1),
        "feature_importances": importances,
        "explanation": explanation
    }
