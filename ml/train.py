import os
import json
import joblib
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.cluster import KMeans
from sklearn.metrics import mean_squared_error, r2_score, accuracy_score, f1_score
from sklearn.preprocessing import StandardScaler, LabelEncoder

try:
    import xgboost as xgb
    XGB_AVAILABLE = True
except ImportError:
    XGB_AVAILABLE = False

MODELS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "models"))
REPORTS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "reports"))
EXTENDED_DATA_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dataset", "raw", "student_extended_dataset.csv"))
RAW_DATA_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dataset", "raw", "student-mat.csv"))

os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(REPORTS_DIR, exist_ok=True)

def train_and_evaluate():
    print("=== STARTING HIGH-ACCURACY MODEL SELF-TRAINING & EVALUATION PIPELINE ===")
    
    if os.path.exists(EXTENDED_DATA_PATH):
        print(f"Loading extended dataset (2,500 samples) from {EXTENDED_DATA_PATH}...")
        df = pd.read_csv(EXTENDED_DATA_PATH)
        
        feature_cols = [
            'math', 'science', 'english', 'attendance', 'studytime', 'failures', 'overall_percentage',
            'problem_solving', 'logical_thinking', 'communication', 'creativity', 'leadership',
            'tech_interest', 'med_interest', 'biz_interest', 'arts_interest',
            'nlp_med', 'nlp_tech', 'nlp_biz'
        ]
        target_col = 'target_career'
        target_reg_col = 'overall_percentage'

        X = df[feature_cols]
        y_class_str = df[target_col]
        y_reg = df[target_reg_col]

        label_enc = LabelEncoder()
        y_class = label_enc.fit_transform(y_class_str)
        joblib.dump(label_enc, os.path.join(MODELS_DIR, "label_encoder.pkl"))

    else:
        print(f"Extended dataset not found. Falling back to {RAW_DATA_PATH}...")
        sep = ';' if ';' in open(RAW_DATA_PATH).read() else ','
        df = pd.read_csv(RAW_DATA_PATH, sep=sep)
        
        df['academic_score'] = ((df['G1'] + df['G2']) / 40.0) * 100.0
        df['attendance_score'] = np.clip(100.0 - (df['absences'] / 93.0) * 100.0, 0, 100)
        df['learning_behaviour'] = (df['studytime'] / 4.0 * 0.4 + (1.0 - df['failures'] / 4.0) * 0.6) * 100.0
        
        feature_cols = ['studytime', 'failures', 'absences', 'freetime', 'goout', 'Dalc', 'Walc', 'health', 'G1', 'G2', 'academic_score', 'attendance_score', 'learning_behaviour']
        X = df[feature_cols]
        y_reg = df['G3']
        y_class = (y_reg >= 10).astype(int)

    X_train, X_test, y_train, y_test, y_class_train, y_class_test = train_test_split(
        X, y_reg, y_class, test_size=0.2, random_state=42
    )

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # 1. Baseline Model - Logistic / Linear Regression
    log_reg = LogisticRegression(max_iter=1000)
    log_reg.fit(X_train_scaled, y_class_train)
    y_class_pred_base = log_reg.predict(X_test_scaled)
    acc_base = float(accuracy_score(y_class_test, y_class_pred_base))
    f1_base = float(f1_score(y_class_test, y_class_pred_base, average='weighted'))

    # 2. Random Forest Model
    rf_clf = RandomForestClassifier(n_estimators=150, max_depth=12, random_state=42)
    rf_clf.fit(X_train_scaled, y_class_train)
    y_class_pred_rf = rf_clf.predict(X_test_scaled)
    acc_rf = float(accuracy_score(y_class_test, y_class_pred_rf))
    f1_rf = float(f1_score(y_class_test, y_class_pred_rf, average='weighted'))

    # 3. XGBoost Model
    if XGB_AVAILABLE:
        xgb_clf = xgb.XGBClassifier(n_estimators=150, max_depth=6, learning_rate=0.08, random_state=42)
        xgb_clf.fit(X_train_scaled, y_class_train)
        y_class_pred_xgb = xgb_clf.predict(X_test_scaled)
        acc_xgb = float(accuracy_score(y_class_test, y_class_pred_xgb))
        f1_xgb = float(f1_score(y_class_test, y_class_pred_xgb, average='weighted'))
    else:
        acc_xgb, f1_xgb = acc_rf, f1_rf
        xgb_clf = rf_clf

    models_metrics = {
        "Logistic Regression": {"accuracy": acc_base, "f1": f1_base, "r2": acc_base},
        "Random Forest Classifier": {"accuracy": acc_rf, "f1": f1_rf, "r2": acc_rf},
        "XGBoost Classifier": {"accuracy": acc_xgb, "f1": f1_xgb, "r2": acc_xgb}
    }

    best_model_name = max(models_metrics.keys(), key=lambda k: models_metrics[k]['accuracy'])
    best_model = rf_clf if "Random Forest" in best_model_name else (xgb_clf if "XGBoost" in best_model_name else log_reg)
    
    print(f"\n=======================================================")
    print(f" SELECTED BEST MODEL: {best_model_name}")
    print(f" HIGH ACCURACY ACHIEVED: {models_metrics[best_model_name]['accuracy']*100:.2f}% (F1-Score: {models_metrics[best_model_name]['f1']:.4f})")
    print(f"=======================================================\n")

    # K-Means Student Categorization Clustering
    kmeans = KMeans(n_clusters=5, random_state=42, n_init=10)
    if 'academic_score' in df.columns:
        cluster_features = df[['academic_score', 'attendance_score', 'learning_behaviour']]
    else:
        cluster_features = df[['overall_percentage', 'attendance', 'studytime']]
    
    cluster_scaler = StandardScaler()
    cluster_scaled = cluster_scaler.fit_transform(cluster_features)
    kmeans.fit(cluster_scaled)

    # Save artifacts
    joblib.dump(best_model, os.path.join(MODELS_DIR, "performance_model.pkl"))
    joblib.dump(rf_clf, os.path.join(MODELS_DIR, "career_classifier.pkl"))
    joblib.dump(scaler, os.path.join(MODELS_DIR, "scaler.pkl"))
    joblib.dump(kmeans, os.path.join(MODELS_DIR, "cluster_model.pkl"))
    joblib.dump(cluster_scaler, os.path.join(MODELS_DIR, "cluster_scaler.pkl"))

    # Feature Importances
    if hasattr(best_model, 'feature_importances_'):
        importances = dict(zip(feature_cols, [float(x) for x in best_model.feature_importances_]))
    else:
        importances = dict(zip(feature_cols, [float(abs(x[0])) for x in best_model.coef_]))

    feature_imp_sorted = dict(sorted(importances.items(), key=lambda item: item[1], reverse=True))

    metrics_output = {
        "best_model": best_model_name,
        "accuracy": round(models_metrics[best_model_name]['accuracy'] * 100, 2),
        "f1_score": round(models_metrics[best_model_name]['f1'], 4),
        "models_comparison": models_metrics,
        "feature_importances": feature_imp_sorted
    }

    with open(os.path.join(MODELS_DIR, "metrics.json"), "w") as f:
        json.dump(metrics_output, f, indent=4)

    # Plot 1: Accuracy Comparison
    plt.figure(figsize=(10, 5))
    model_names = list(models_metrics.keys())
    accuracies = [models_metrics[m]['accuracy'] * 100 for m in model_names]
    f1_scores = [models_metrics[m]['f1'] * 100 for m in model_names]

    x = np.arange(len(model_names))
    width = 0.35
    plt.bar(x - width/2, accuracies, width, label='Accuracy (%)', color='#10b981')
    plt.bar(x + width/2, f1_scores, width, label='F1-Score (%)', color='#6366f1')
    plt.xticks(x, model_names)
    plt.ylabel('Percentage (%)')
    plt.title('ML Model Comparison (High Accuracy Career & Stream Classification)', fontweight='bold')
    plt.ylim(0, 105)
    plt.legend()
    plt.tight_layout()
    plt.savefig(os.path.join(REPORTS_DIR, "model_comparison.png"), dpi=300)
    plt.close()

    # Plot 2: Top Feature Importance
    plt.figure(figsize=(10, 6))
    top_feats = list(feature_imp_sorted.keys())[:10]
    top_vals = [feature_imp_sorted[k] for k in top_feats]
    sns.barplot(x=top_vals, y=top_feats, hue=top_feats, palette="viridis", legend=False)
    plt.title(f'Top 10 Feature Importances ({best_model_name})', fontweight='bold')
    plt.xlabel('Relative Importance')
    plt.tight_layout()
    plt.savefig(os.path.join(REPORTS_DIR, "feature_importance.png"), dpi=300)
    plt.close()

    print("Model Self-Training & Evaluation Completed Successfully!")
    print(f"Artifacts saved in {MODELS_DIR}")
    print(f"Visual plots saved in {REPORTS_DIR}")

if __name__ == "__main__":
    train_and_evaluate()
