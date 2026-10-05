from pydantic import BaseModel
from typing import List, Optional

class CourseBase(BaseModel):
    course_name: str
    degree_type: str
    domain: str
    duration: str
    relevant_subjects: List[str]
    recommended_skills: List[str]
    interest_areas: List[str]
    career_paths: List[str]
    description: Optional[str] = ""

class CourseCreate(CourseBase):
    id: Optional[str] = None

class CourseResponse(CourseBase):
    id: str

class CareerDetailResponse(BaseModel):
    title: str
    domain: str
    description: str
    req_subjects: List[str]
    req_skills: List[str]
    suggested_skills_to_learn: List[str]
    beginner_project_ideas: List[str]
    typical_responsibilities: List[str]
