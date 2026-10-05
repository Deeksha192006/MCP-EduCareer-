import numpy as np
from sklearn.model_selection import GridSearchCV, StratifiedKFold
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression

try:
    import xgboost as xgb
    XGB_AVAILABLE = True
except ImportError:
    XGB_AVAILABLE = False

def tune_random_forest(X_train, y_train):
    """
    Performs GridSearchCV to find best hyperparameters for Random Forest Classifier.
    """
    param_grid = {
        'n_estimators': [50, 100, 150],
        'max_depth': [6, 10, 15, None],
        'min_samples_split': [2, 5]
    }
    rf = RandomForestClassifier(random_state=42)
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    grid_search = GridSearchCV(estimator=rf, param_grid=param_grid, cv=cv, scoring='f1_weighted', n_jobs=-1)
    grid_search.fit(X_train, y_train)
    print(f"Random Forest Best Params: {grid_search.best_params_} | Best CV Score: {grid_search.best_score_:.4f}")
    return grid_search.best_estimator_, grid_search.best_params_, grid_search.best_score_

def tune_xgboost(X_train, y_train):
    """
    Performs GridSearchCV to find best hyperparameters for XGBoost Classifier.
    """
    if not XGB_AVAILABLE:
        return tune_random_forest(X_train, y_train)

    param_grid = {
        'n_estimators': [50, 100, 150],
        'max_depth': [3, 5, 8],
        'learning_rate': [0.03, 0.08, 0.15]
    }
    xgb_clf = xgb.XGBClassifier(random_state=42, eval_metric='mlogloss')
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    grid_search = GridSearchCV(estimator=xgb_clf, param_grid=param_grid, cv=cv, scoring='f1_weighted', n_jobs=-1)
    grid_search.fit(X_train, y_train)
    print(f"XGBoost Best Params: {grid_search.best_params_} | Best CV Score: {grid_search.best_score_:.4f}")
    return grid_search.best_estimator_, grid_search.best_params_, grid_search.best_score_
