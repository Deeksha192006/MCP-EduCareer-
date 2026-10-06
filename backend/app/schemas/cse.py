from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class CSESkillScores(BaseModel):
    logicalThinking: float = 0.0
    booleanReasoning: float = 0.0
    problemSolving: float = 0.0
    algorithmicThinking: float = 0.0
    planning: float = 0.0
    patternRecognition: float = 0.0
    constraintSolving: float = 0.0
    numericalReasoning: float = 0.0
    sequencing: float = 0.0
    decisionMaking: Optional[float] = 0.0
    programmingLogic: Optional[float] = 0.0

class CSEGamePerformance(BaseModel):
    gameId: str
    gameName: str
    skillTested: str
    score: float = 0.0
    maxScore: float = 100.0
    accuracy: float = 0.0
    timeTaken: int = 0
    attempts: int = 0
    difficulty: str = "medium"
    completed: bool = False

class CSEAssessmentStartRequest(BaseModel):
    studentId: str

class CSEGameSubmitRequest(BaseModel):
    studentId: str
    gameId: str
    score: float
    maxScore: float = 100.0
    accuracy: float = 0.0
    timeTaken: int = 0
    attempts: int = 1
    difficulty: Optional[str] = "medium"
    skillScoresUpdated: Optional[Dict[str, float]] = None

class CSEAssessmentResponse(BaseModel):
    id: str
    studentId: str
    department: str = "CSE"
    assessmentId: str
    gamesAttempted: int = 0
    totalScore: float = 0.0
    skillScores: CSESkillScores
    gamePerformance: List[CSEGamePerformance]
    totalTime: int = 0
    cseCompatibilityScore: float = 0.0
    summary: Optional[str] = ""
    completedAt: Optional[str] = None
    created_at: Optional[str] = None

class CSEAnalyticsResponse(BaseModel):
    totalCompletedAssessments: int
    averageCSEScore: float
    averageLogicalThinking: float
    averageProblemSolving: float
    averagePatternRecognition: float
    averageAlgorithmicThinking: float
    averageProgrammingLogic: float
    averageDecisionMaking: float
    averageCompletionTime: float
    gamePerformanceSummary: List[Dict[str, Any]]
