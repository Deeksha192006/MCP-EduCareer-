from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class BBARoundSubmission(BaseModel):
    roundId: str
    selectedOptionId: Optional[str] = None
    timeTaken: int = Field(default=0, ge=0)

class BBAGameSubmitRequest(BaseModel):
    studentId: str
    submissions: List[BBARoundSubmission]
    totalTime: int = Field(default=0, ge=0)

class BBAAssessmentResponse(BaseModel):
    id: str
    studentId: str
    department: str = "BBA"
    stream: str = "Arts & Science"
    courseName: str = "BBA (Bachelor of Business Administration)"
    gameScore: float = 0.0
    accuracy: float = 0.0
    totalTime: int = 0
    finalCash: float = 0.0
    finalMRR: float = 0.0
    finalNPS: float = 0.0
    completed: bool = False
    skillScores: Dict[str, float]
    roundSummaries: List[Dict[str, Any]]
    finalResult: Optional[Dict[str, Any]] = None
    completedAt: Optional[str] = None
    created_at: Optional[str] = None

class BBAAnalyticsResponse(BaseModel):
    totalCompletedAssessments: int
    averageScore: float
    averageBusinessReasoning: float
    averageResourceManagement: float
    averageStrategicThinking: float
    averageFinancialAcumen: float
    averageFinalCash: float
    topStrengthsDistribution: Dict[str, int]
