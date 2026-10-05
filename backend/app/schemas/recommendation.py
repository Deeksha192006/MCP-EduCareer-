from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class FinalRecommendationRequest(BaseModel):
    student_id: str
    assessment_id: Optional[str] = None

class CourseCompareRequest(BaseModel):
    student_id: str
    course_names: List[str]

class WhatIfSimulationRequest(BaseModel):
    student_id: str
    simulated_marks: Optional[Dict[str, float]] = None
    simulated_skills: Optional[Dict[str, float]] = None

class ConfusedModeRequest(BaseModel):
    student_id: str

class CounsellorReviewRequest(BaseModel):
    student_id: str
    status: str # "Approved", "Needs Review", "Suggested Alternative"
    comments: Optional[str] = ""
    suggested_courses: Optional[List[str]] = []
