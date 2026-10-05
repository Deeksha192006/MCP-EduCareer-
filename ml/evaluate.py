import os
import json
import joblib
import pandas as pd
import numpy as np

MODELS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "models"))
RAW_DATA_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dataset", "raw", "student-mat.csv"))

def evaluate_saved_model():
    metrics_path = os.path.join(MODELS_DIR, "metrics.json")
    if os.path.exists(metrics_path):
        with open(metrics_path, "r") as f:
            data = json.load(f)
        print("=== SAVED MODEL METRICS ===")
        print(f"Best Selected Model: {data.get('best_model')}")
        print("\nModel Comparisons:")
        for m_name, metrics in data.get('models_comparison', {}).items():
            print(f" - {m_name}: R² = {metrics['r2']:.4f}, RMSE = {metrics['rmse']:.4f}, Accuracy = {metrics['accuracy']:.4f}, F1 = {metrics['f1']:.4f}")
        
        print("\nTop 5 Feature Importances:")
        for feat, val in list(data.get('feature_importances', {}).items())[:5]:
            print(f" - {feat}: {val:.4f}")
    else:
        print("No trained metrics found. Run python ml/train.py first.")

if __name__ == "__main__":
    evaluate_saved_model()
