import os
import json
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Set visual style
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
sns.set_theme(style="whitegrid", palette="muted")

REPORTS_DIR = os.path.join(os.path.dirname(__file__), "reports")
RAW_DATA_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dataset", "raw", "student-mat.csv"))
POR_DATA_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dataset", "raw", "student-por.csv"))

os.makedirs(REPORTS_DIR, exist_ok=True)

def run_eda():
    print("=== STARTING EXPLORATORY DATA ANALYSIS (EDA) ===")
    
    if not os.path.exists(RAW_DATA_PATH):
        raise FileNotFoundError(f"Dataset not found at {RAW_DATA_PATH}")

    # Load dataset
    sep = ';' if ';' in open(RAW_DATA_PATH).read() else ','
    df_mat = pd.read_csv(RAW_DATA_PATH, sep=sep)
    print(f"Loaded Mathematics Dataset: {df_mat.shape[0]} rows, {df_mat.shape[1]} columns.")
    
    df = df_mat.copy()
    
    # Basic info
    shape = df.shape
    columns = df.columns.tolist()
    data_types = {col: str(dtype) for col, dtype in df.dtypes.items()}
    missing_values = df.isnull().sum().to_dict()
    duplicate_count = int(df.duplicated().sum())
    stats = df.describe().to_dict()

    print(f"Duplicates: {duplicate_count}")
    print(f"Total Missing Values: {sum(missing_values.values())}")

    # 1. Grade Distribution Chart
    plt.figure(figsize=(10, 5))
    sns.histplot(df['G3'], kde=True, bins=20, color='#6366f1')
    plt.title('UCI Student Performance - Final Grade (G3) Distribution', fontsize=14, fontweight='bold')
    plt.xlabel('Final Grade G3 (0 - 20)', fontsize=12)
    plt.ylabel('Student Count', fontsize=12)
    plt.axvline(df['G3'].mean(), color='#ef4444', linestyle='--', label=f"Mean G3 ({df['G3'].mean():.2f})")
    plt.legend()
    plt.tight_layout()
    plt.savefig(os.path.join(REPORTS_DIR, "grade_distribution.png"), dpi=300)
    plt.close()

    # 2. Correlation Heatmap
    plt.figure(figsize=(12, 8))
    numeric_df = df.select_dtypes(include=[np.number])
    corr = numeric_df.corr()
    sns.heatmap(corr, annot=True, fmt=".2f", cmap="coolwarm", cbar=True, square=True)
    plt.title('Numerical Features Correlation Matrix', fontsize=14, fontweight='bold')
    plt.tight_layout()
    plt.savefig(os.path.join(REPORTS_DIR, "correlation_matrix.png"), dpi=300)
    plt.close()

    # 3. Study Time vs Final Grade
    plt.figure(figsize=(8, 5))
    sns.boxplot(x='studytime', y='G3', data=df, palette='Blues')
    plt.title('Weekly Study Time vs Final Grade (G3)', fontsize=14, fontweight='bold')
    plt.xlabel('Study Time Category (1: <2h, 2: 2-5h, 3: 5-10h, 4: >10h)', fontsize=11)
    plt.ylabel('Final Grade G3', fontsize=11)
    plt.tight_layout()
    plt.savefig(os.path.join(REPORTS_DIR, "studytime_vs_grade.png"), dpi=300)
    plt.close()

    # 4. Absences vs Grade
    plt.figure(figsize=(9, 5))
    sns.scatterplot(x='absences', y='G3', data=df, color='#10b981', alpha=0.7, s=60)
    sns.regplot(x='absences', y='G3', data=df, scatter=False, color='#047857')
    plt.title('School Absences vs Final Grade (G3)', fontsize=14, fontweight='bold')
    plt.xlabel('Number of Absences', fontsize=11)
    plt.ylabel('Final Grade G3', fontsize=11)
    plt.tight_layout()
    plt.savefig(os.path.join(REPORTS_DIR, "absences_vs_grade.png"), dpi=300)
    plt.close()

    # 5. Extracurricular & Higher Ed Intention Analysis
    fig, axes = plt.subplots(1, 2, figsize=(12, 5))
    sns.barplot(x='activities', y='G3', data=df, ax=axes[0], palette='Set2')
    axes[0].set_title('Extracurricular Activities vs G3', fontsize=12, fontweight='bold')
    
    sns.barplot(x='higher', y='G3', data=df, ax=axes[1], palette='Pastel1')
    axes[1].set_title('Higher Education Intention vs G3', fontsize=12, fontweight='bold')
    plt.tight_layout()
    plt.savefig(os.path.join(REPORTS_DIR, "extracurricular_analysis.png"), dpi=300)
    plt.close()

    # Summary Report JSON
    summary = {
        "dataset_shape": shape,
        "total_students": shape[0],
        "total_features": shape[1],
        "columns": columns,
        "data_types": data_types,
        "missing_values_sum": int(sum(missing_values.values())),
        "duplicate_count": duplicate_count,
        "g3_stats": {
            "mean": float(df['G3'].mean()),
            "std": float(df['G3'].std()),
            "min": int(df['G3'].min()),
            "max": int(df['G3'].max()),
            "median": float(df['G3'].median())
        },
        "reports_saved": [
            "grade_distribution.png",
            "correlation_matrix.png",
            "studytime_vs_grade.png",
            "absences_vs_grade.png",
            "extracurricular_analysis.png"
        ]
    }

    summary_file = os.path.join(REPORTS_DIR, "eda_summary.json")
    with open(summary_file, "w") as f:
        json.dump(summary, f, indent=4)

    print(f"EDA Completed Successfully! Report saved to {summary_file}")

if __name__ == "__main__":
    run_eda()
