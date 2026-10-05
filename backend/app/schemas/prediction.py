from pydantic import BaseModel
from typing import List, Dict, Optional, Any

class PredictionRequest(BaseModel):
    student_id: str
    academic: Dict[str, float]
    skills: Dict[str, int]
    interests: Dict[str, int]
    activities: Dict[str, bool]

class PerformancePrediction(BaseModel):
    predicted_grade: float
    confidence_score: float
    grade_letter: str
    improvement_areas: List[str]
    strengths: List[str]

class CategorizationResult(BaseModel):
    key: str
    title: str
    description: str
    badge_color: str

class RecommendationResult(BaseModel):
    student_id: str
    category: CategorizationResult
    streams: List[Dict[str, Any]]
    careers: List[Dict[str, Any]]
    predicted_performance: PerformancePrediction
