from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class EnvironmentalChallengeSubmission(BaseModel):
    challengeId: str
    selectedOptionId: Optional[str] = None
    timeTaken: int = Field(default=0, ge=0)

class EnvironmentalGameSubmitRequest(BaseModel):
    studentId: str
    submissions: List[EnvironmentalChallengeSubmission]
    totalTime: int = Field(default=0, ge=0)

class EnvironmentalAssessmentResponse(BaseModel):
    id: str
    studentId: str
    department: str = "Environmental Science"
    stream: str = "Arts & Science"
    courseName: str = "B.Sc. Environmental Science"
    gameScore: float = 0.0
    accuracy: float = 0.0
    totalTime: int = 0
    finalAQI: float = 185.0
    finalCleanEnergy: float = 15.0
    finalWaterReserves: float = 35.0
    finalWasteDiverted: float = 20.0
    finalBudget: float = 150000.0
    completed: bool = False
    skillScores: Dict[str, float]
    challengeSummaries: List[Dict[str, Any]]
    finalResult: Optional[Dict[str, Any]] = None
    completedAt: Optional[str] = None
    created_at: Optional[str] = None

class EnvironmentalAnalyticsResponse(BaseModel):
    totalCompletedAssessments: int
    averageScore: float
    averageScientificReasoning: float
    averageSustainabilityAwareness: float
    averageSystemsThinking: float
    averageProblemSolving: float
    averageFinalAQI: float
    averageCleanEnergy: float
    topStrengthsDistribution: Dict[str, int]
