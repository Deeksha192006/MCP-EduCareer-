from pydantic import BaseModel, Field
from typing import Optional, Dict, List, Any

class AssessmentSubmission(BaseModel):
    student_id: str
    academic: Dict[str, float]
    skills: Dict[str, int]
    interests: Dict[str, int]
    activities: Dict[str, bool]
    career_preference: Optional[str] = "Technology"
    preferred_working_style: Optional[str] = "Independent & Problem Solving"
    text_responses: Optional[Dict[str, str]] = Field(default_factory=dict)

class AssessmentResponse(AssessmentSubmission):
    id: str
    created_at: str
    nlp_mindset_scores: Optional[Dict[str, float]] = Field(default_factory=dict)
    detected_mindset_tags: Optional[List[str]] = Field(default_factory=list)

