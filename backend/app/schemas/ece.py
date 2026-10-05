from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class ECELevelPerformance(BaseModel):
    levelId: str
    levelName: str
    skillTested: str
    difficulty: str = "easy"
    score: float = 0.0
    accuracy: float = 0.0
    timeTaken: int = 0
    attempts: int = 1
    completed: bool = False

class ECESkillScores(BaseModel):
    circuitReasoning: float = 0.0
    logicalThinking: float = 0.0
    problemSolving: float = 0.0
    decisionMaking: float = 0.0
    signalUnderstanding: float = 0.0
    technicalKnowledge: float = 0.0

class ECERound1SubmitRequest(BaseModel):
    studentId: str
    levelResults: List[ECELevelPerformance]
    totalTime: int = 0

class ECEQuizAnswerSubmit(BaseModel):
    questionId: str
    selectedAnswer: str
    timeTaken: int = 0

class ECERound2SubmitRequest(BaseModel):
    studentId: str
    answers: List[ECEQuizAnswerSubmit]
    totalTime: int = 0

class ECEResultResponse(BaseModel):
    id: str
    studentId: str
    department: str = "ECE"
    round1: Dict[str, Any]
    round2: Dict[str, Any]
    finalResult: Dict[str, Any]
    completedAt: Optional[str] = None
    created_at: Optional[str] = None

class ECEAnalyticsResponse(BaseModel):
    totalCompletedAssessments: int
    averageECEScore: float
    averageGameScore: float
    averageQuizScore: float
    averageCircuitReasoning: float
    averageLogicalThinking: float
    averageProblemSolving: float
    averageSignalUnderstanding: float
    averageTechnicalKnowledge: float
    averageCompletionTime: float
    levelDifficultySummary: List[Dict[str, Any]]
    quizTopicPerformanceSummary: List[Dict[str, Any]]
