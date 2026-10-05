from pydantic import BaseModel, Field
from typing import Optional, Dict

class AcademicInfo(BaseModel):
    math: float = Field(..., ge=0, le=100)
    science: float = Field(..., ge=0, le=100)
    english: float = Field(..., ge=0, le=100)
    physics: Optional[float] = 75.0
    chemistry: Optional[float] = 75.0
    biology: Optional[float] = 75.0
    computer_science: Optional[float] = 75.0
    accountancy: Optional[float] = 75.0
    economics: Optional[float] = 75.0
    business_studies: Optional[float] = 75.0
    overall_percentage: Optional[float] = None
    attendance_percentage: float = Field(..., ge=0, le=100)
    studytime: Optional[int] = 2  # 1: <2h, 2: 2-5h, 3: 5-10h, 4: >10h
    failures: Optional[int] = 0
    absences: Optional[int] = 4

class SkillInfo(BaseModel):
    problem_solving: int = Field(..., ge=1, le=10)
    logical_thinking: int = Field(..., ge=1, le=10)
    communication: int = Field(..., ge=1, le=10)
    creativity: int = Field(..., ge=1, le=10)
    leadership: int = Field(..., ge=1, le=10)

class InterestInfo(BaseModel):
    technology: int = Field(..., ge=1, le=10)
    medicine: int = Field(..., ge=1, le=10)
    business: int = Field(..., ge=1, le=10)
    arts: int = Field(..., ge=1, le=10)

class ActivityInfo(BaseModel):
    technical: bool = False
    sports: bool = False
    arts: bool = False

class StudentCreate(BaseModel):
    name: str
    email: str
    grade: int = 10
    school: str = "Gabriel Pereira High School"
    academic: AcademicInfo
    skills: SkillInfo
    interests: InterestInfo
    activities: ActivityInfo
    career_preference: Optional[str] = "Software Developer"
    preferred_working_style: Optional[str] = "Collaborative / Team-Oriented"

class StudentResponse(StudentCreate):
    id: str
    category: Optional[dict] = None
    top_stream: Optional[str] = None
    top_career: Optional[str] = None
    created_at: Optional[str] = None

