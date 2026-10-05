import os
import json
import joblib
from datetime import datetime

MODELS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models"))
REGISTRY_PATH = os.path.join(MODELS_DIR, "model_registry.json")

class ModelManager:
    @classmethod
    def load_registry(cls):
        if os.path.exists(REGISTRY_PATH):
            with open(REGISTRY_PATH, "r") as f:
                return json.load(f)
        return {
            "production_version": "v1",
            "versions": []
        }

    @classmethod
    def save_registry(cls, registry):
        with open(REGISTRY_PATH, "w") as f:
            json.dump(registry, f, indent=4)

    @classmethod
    def register_model_version(cls, model_obj, scaler_obj, metrics_dict, algorithm_name, is_candidate=False):
        registry = cls.load_registry()
        num_versions = len(registry["versions"]) + 1
        version_str = f"v{num_versions}"

        # Save artifact file
        model_filename = f"performance_model_{version_str}.pkl"
        model_filepath = os.path.join(MODELS_DIR, model_filename)
        joblib.dump(model_obj, model_filepath)

        # Check if candidate improves upon production model
        current_prod_ver = registry.get("production_version")
        prod_entry = next((v for v in registry["versions"] if v["version"] == current_prod_ver), None)

        is_promoted = False
        if prod_entry is None:
            is_promoted = True
        else:
            current_f1 = prod_entry.get("f1_score", 0.0)
            new_f1 = metrics_dict.get("f1_score", 0.0)
            if new_f1 >= current_f1:
                is_promoted = True

        status = "PRODUCTION" if is_promoted else ("CANDIDATE" if is_candidate else "RETIRED")

        if is_promoted:
            # Demote previous production version
            for v in registry["versions"]:
                if v["status"] == "PRODUCTION":
                    v["status"] = "RETIRED"
            registry["production_version"] = version_str
            # Also update primary production file performance_model.pkl
            joblib.dump(model_obj, os.path.join(MODELS_DIR, "performance_model.pkl"))

        version_metadata = {
            "version": version_str,
            "algorithm": algorithm_name,
            "accuracy": metrics_dict.get("accuracy", 0.0),
            "precision": metrics_dict.get("precision", 0.0),
            "recall": metrics_dict.get("recall", 0.0),
            "f1_score": metrics_dict.get("f1_score", 0.0),
            "dataset_version": metrics_dict.get("dataset_version", "v1_2500_samples"),
            "trained_at": datetime.now().isoformat(),
            "status": status,
            "artifact_file": model_filename
        }

        registry["versions"].append(version_metadata)
        cls.save_registry(registry)
        print(f"Registered Model Version {version_str} with Status [{status}] (F1: {metrics_dict.get('f1_score', 0.0):.4f})")
        return version_metadata
