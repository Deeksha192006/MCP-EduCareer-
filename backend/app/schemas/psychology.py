from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class PsychologyScenarioSubmission(BaseModel):
    scenarioId: str
    selectedOptionId: Optional[str] = None
    timeTaken: int = Field(default=0, ge=0)

class PsychologyGameSubmitRequest(BaseModel):
    studentId: str
    submissions: List[PsychologyScenarioSubmission]
    totalTime: int = Field(default=0, ge=0)

class PsychologyAssessmentResponse(BaseModel):
    id: str
    studentId: str
    department: str = "Psychology"
    stream: str = "Arts & Science"
    courseName: str = "B.Sc. Psychology"
    gameScore: float = 0.0
    accuracy: float = 0.0
    totalTime: int = 0
    completed: bool = False
    skillScores: Dict[str, float]
    scenarioResults: List[Dict[str, Any]]
    finalResult: Optional[Dict[str, Any]] = None
    completedAt: Optional[str] = None
    created_at: Optional[str] = None

class PsychologyAnalyticsResponse(BaseModel):
    totalCompletedAssessments: int
    averageScore: float
    averageEmpathy: float
    averageSocialPerception: float
    averageCriticalThinking: float
    averageObservation: float
    averageConflictResolution: float
    topStrengthsDistribution: Dict[str, int]
