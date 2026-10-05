from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class DataScienceLevelSubmission(BaseModel):
    levelId: str
    selectedOption: Optional[str] = None
    selectedValues: Optional[List[Any]] = None
    inputAnswer: Optional[str] = None
    timeTaken: int = Field(default=0, ge=0)
    attempts: int = Field(default=1, ge=1)

class DataScienceGameSubmitRequest(BaseModel):
    studentId: str
    levelSubmissions: List[DataScienceLevelSubmission]
    totalTime: int = Field(default=0, ge=0)

class DataScienceSkillScores(BaseModel):
    analyticalThinking: float = 0.0
    dataInterpretation: float = 0.0
    logicalReasoning: float = 0.0
    numericalSkills: float = 0.0
    hypothesisTesting: float = 0.0

class DataScienceLevelResult(BaseModel):
    levelId: str
    levelName: str
    skillTested: str
    difficulty: str
    isCorrect: bool
    scoreEarned: float
    maxScore: float
    timeTaken: int
    attempts: int
    feedback: str

class DataScienceAssessmentResponse(BaseModel):
    id: str
    studentId: str
    department: str = "Data Science"
    stream: str = "Arts & Science"
    courseName: str = "B.Sc. Data Science & Analytics"
    gameScore: float = 0.0
    accuracy: float = 0.0
    totalTime: int = 0
    completed: bool = False
    skillScores: Dict[str, float]
    levelResults: List[Dict[str, Any]]
    finalResult: Optional[Dict[str, Any]] = None
    completedAt: Optional[str] = None
    created_at: Optional[str] = None

class DataScienceAnalyticsResponse(BaseModel):
    totalCompletedAssessments: int
    averageScore: float
    averageAnalyticalThinking: float
    averageDataInterpretation: float
    averageLogicalReasoning: float
    averageNumericalSkills: float
    averageCompletionTime: float
    topStrengthsDistribution: Dict[str, int]
