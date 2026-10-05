from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class EEELevelPerformance(BaseModel):
    levelId: str
    levelName: str
    skillTested: str
    difficulty: str = "easy"
    score: float = 0.0
    accuracy: float = 0.0
    timeTaken: int = 0
    attempts: int = 1
    completed: bool = False

class EEESkillScores(BaseModel):
    electricalReasoning: float = 0.0
    circuitUnderstanding: float = 0.0
    logicalThinking: float = 0.0
    problemSolving: float = 0.0
    energyManagement: float = 0.0
    decisionMaking: float = 0.0
    numericalReasoning: float = 0.0
    technicalKnowledge: float = 0.0

class EEERound1SubmitRequest(BaseModel):
    studentId: str
    levelResults: List[EEELevelPerformance]
    totalTime: int = 0

class EEEQuizAnswerSubmit(BaseModel):
    questionId: str
    selectedAnswer: str
    timeTaken: int = 0

class EEERound2SubmitRequest(BaseModel):
    studentId: str
    answers: List[EEEQuizAnswerSubmit]
    totalTime: int = 0

class EEEResultResponse(BaseModel):
    id: str
    studentId: str
    department: str = "EEE"
    round1: Dict[str, Any]
    round2: Dict[str, Any]
    finalResult: Dict[str, Any]
    completedAt: Optional[str] = None
    created_at: Optional[str] = None

class EEEAnalyticsResponse(BaseModel):
    totalCompletedAssessments: int
    averageEEEScore: float
    averageGameScore: float
    averageQuizScore: float
    averageElectricalReasoning: float
    averageCircuitUnderstanding: float
    averageProblemSolving: float
    averageEnergyManagement: float
    averageTechnicalKnowledge: float
    averageCompletionTime: float
    levelDifficultySummary: List[Dict[str, Any]]
    quizTopicPerformanceSummary: List[Dict[str, Any]]
