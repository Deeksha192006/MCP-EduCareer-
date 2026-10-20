from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class AIDSLevelPerformance(BaseModel):
    levelId: str
    levelName: str
    skillTested: str
    difficulty: str = "easy"
    score: float = 0.0
    accuracy: float = 0.0
    timeTaken: int = 0
    attempts: int = 1
    hintsUsed: int = 0
    completed: bool = False

class AIDSSkillScores(BaseModel):
    logicalThinking: float = 0.0
    constraintReasoning: float = 0.0
    planning: float = 0.0
    patternRecognition: float = 0.0
    decisionMaking: float = 0.0
    problemSolving: float = 0.0
    algorithmicThinking: float = 0.0
    computationalThinking: float = 0.0
    spatialReasoning: float = 0.0
    dataInterpretation: float = 0.0
    analyticalThinking: float = 0.0
    logicalReasoning: float = 0.0
    predictionAbility: float = 0.0
    technicalKnowledge: float = 0.0

class AIDSRound1SubmitRequest(BaseModel):
    studentId: str
    levelResults: List[AIDSLevelPerformance]
    totalTime: int = 0

class AIDSQuizAnswerSubmit(BaseModel):
    questionId: str
    selectedAnswer: str
    timeTaken: int = 0

class AIDSRound2SubmitRequest(BaseModel):
    studentId: str
    answers: List[AIDSQuizAnswerSubmit]
    totalTime: int = 0

class AIDSResultResponse(BaseModel):
    id: str
    studentId: str
    department: str = "AIDS"
    round1: Dict[str, Any]
    round2: Dict[str, Any]
    finalResult: Dict[str, Any]
    completedAt: Optional[str] = None
    created_at: Optional[str] = None

class AIDSAnalyticsResponse(BaseModel):
    totalCompletedAssessments: int
    averageAIDSScore: float
    averageGameScore: float
    averageQuizScore: float
    averageDataInterpretation: float
    averagePatternRecognition: float
    averageAnalyticalThinking: float
    averagePredictionScore: float
    averageTechnicalKnowledge: float
    averageCompletionTime: float
    levelDifficultySummary: List[Dict[str, Any]]
    quizTopicPerformanceSummary: List[Dict[str, Any]]
    gameAnalytics: Optional[List[Dict[str, Any]]] = None
