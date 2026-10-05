import pandas as pd
import numpy as np
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

class EducationalFeatureEngineer(BaseEstimator, TransformerMixin):
    """
    Feature engineering transformer for student performance data.
    Creates domain-specific derived scores:
    - academic_score
    - attendance_score
    - learning_behaviour_score
    - activity_score
    """
    def __init__(self):
        pass

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        df = X.copy()
        
        # Academic score (scale G1, G2 to 0-100 if present or use existing scores)
        if 'G1' in df.columns and 'G2' in df.columns:
            df['academic_score'] = ((df['G1'] + df['G2']) / 40.0) * 100.0
        elif 'math' in df.columns and 'science' in df.columns:
            df['academic_score'] = (df['math'] * 0.4 + df['science'] * 0.4 + df.get('english', 75) * 0.2)
        else:
            df['academic_score'] = 75.0

        # Attendance score (from absences, max ~93 absences in UCI)
        if 'absences' in df.columns:
            df['attendance_score'] = np.clip(100.0 - (df['absences'] / 93.0) * 100.0, 0, 100)
        elif 'attendance_percentage' in df.columns:
            df['attendance_score'] = df['attendance_percentage']
        else:
            df['attendance_score'] = 90.0

        # Learning behaviour score
        study_norm = df['studytime'] / 4.0 if 'studytime' in df.columns else 0.5
        fail_norm = (1.0 - (df['failures'] / 4.0)) if 'failures' in df.columns else 0.8
        support_flag = (df['schoolsup'].apply(lambda x: 1 if x == 'yes' else 0) if 'schoolsup' in df.columns else 0) * 0.1
        
        df['learning_behaviour_score'] = (study_norm * 0.4 + fail_norm * 0.5 + support_flag) * 100.0
        
        # Activity score
        if 'activities' in df.columns:
            df['activity_score'] = df['activities'].apply(lambda x: 100.0 if x in ['yes', True] else 50.0)
        else:
            df['activity_score'] = 70.0

        return df

def build_preprocessing_pipeline(numeric_features, categorical_features):
    """
    Builds Scikit-Learn ColumnTransformer for numeric scaling and categorical encoding.
    """
    numeric_transformer = Pipeline(steps=[
        ('scaler', StandardScaler())
    ])

    categorical_transformer = Pipeline(steps=[
        ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_features),
            ('cat', categorical_transformer, categorical_features)
        ]
    )

    return preprocessor
