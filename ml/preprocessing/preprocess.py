import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from ml.preprocessing.feature_engineering import engineer_student_features

def preprocess_dataset(df: pd.DataFrame):
    """
    Validates, cleans, removes duplicates, handles missing values, and scales features.
    """
    # 1. Drop exact duplicates
    df = df.drop_duplicates().copy()

    # 2. Check & fill missing values if any
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    for col in numeric_cols:
        if df[col].isnull().sum() > 0:
            df[col] = df[col].fillna(df[col].median())

    # 3. Engineer features
    df = engineer_student_features(df)

    return df
