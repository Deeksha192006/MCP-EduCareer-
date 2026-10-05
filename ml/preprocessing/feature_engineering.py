import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.compose import ColumnTransformer

def create_feature_engineering_pipeline():
    """
    Creates feature engineering transformations for raw dataset features.
    """
    pass

def engineer_student_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Engineers derived business intelligence features:
    - academic_score
    - attendance_score
    - learning_behaviour_score
    - strength_score
    """
    df = df.copy()
    
    # 1. Academic Score (0 - 100%)
    if 'math' in df.columns and 'science' in df.columns and 'english' in df.columns:
        df['academic_score'] = (df['math'] * 0.35 + df['science'] * 0.35 + df['english'] * 0.30)
    elif 'G1' in df.columns and 'G2' in df.columns:
        df['academic_score'] = ((df['G1'] + df['G2']) / 40.0) * 100.0
    else:
        df['academic_score'] = df.get('overall_percentage', 75.0)

    # 2. Attendance Score (0 - 100%)
    if 'absences' in df.columns:
        df['attendance_score'] = np.clip(100.0 - (df['absences'] / 93.0) * 100.0, 0, 100)
    else:
        df['attendance_score'] = df.get('attendance', 90.0)

    # 3. Learning Behaviour Score (0 - 100%)
    studytime = df.get('studytime', 2)
    failures = df.get('failures', 0)
    df['learning_behaviour_score'] = np.clip((studytime / 4.0 * 0.5 + (1.0 - failures / 4.0) * 0.5) * 100.0, 0, 100)

    # 4. Strength Score (0 - 100%)
    if 'problem_solving' in df.columns:
        prob = df.get('problem_solving', 7)
        log_think = df.get('logical_thinking', 7)
        comm = df.get('communication', 7)
        creat = df.get('creativity', 7)
        lead = df.get('leadership', 7)
        df['strength_score'] = ((prob + log_think + comm + creat + lead) / 50.0) * 100.0
    else:
        df['strength_score'] = 75.0

    return df
