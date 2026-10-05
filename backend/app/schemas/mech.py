from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class MECHQuizStartRequest(BaseModel):
    studentId: str

class MECHLevelPerformance(BaseModel):
    levelId: str
    levelName: str = ""
    skillTested: str = ""
    difficulty: str = "easy"
    score: float = 0.0
    accuracy: float = 0.0
    timeTakenSeconds: int = 0
    timeTaken: int = 0
    attempts: int = 1
    completed: bool = False

class MECHSkillScores(BaseModel):
    spatialReasoning: float = 0.0
    mechanicalComprehension: float = 0.0
    analyticalThinking: float = 0.0
    practicalProblemSolving: float = 0.0
    systemIntuition: float = 0.0

class MECHRound1SubmitRequest(BaseModel):
    assessmentId: str = ""
    studentId: str
    levelResults: List[MECHLevelPerformance] = []
    gameScore: Optional[float] = None
    totalTimeTaken: int = 0
    totalTime: int = 0

class MECHQuizGenerateRequest(BaseModel):
    assessmentId: str = ""
    studentId: str
    numQuestions: int = 10
    difficultyDistribution: Optional[Dict[str, int]] = None  # e.g. {"Easy": 3, "Medium": 5, "Hard": 2}

class MECHQuizAnswerSubmit(BaseModel):
    questionId: str
    selectedAnswer: str
    timeTakenSeconds: int = 0
    timeTaken: int = 0

class MECHRound2SubmitRequest(BaseModel):
    assessmentId: str = ""
    studentId: str
    answers: List[MECHQuizAnswerSubmit] = []
    timeTakenSeconds: int = 0
    totalTime: int = 0

class MECHResultResponse(BaseModel):
    id: Optional[str] = None
    assessmentId: str
    studentId: str
    department: str = "MECH"
    mechExplorationScore: float
    gameScore: float
    mcqScore: float
    skillProfile: Dict[str, float]
    strongTopics: List[str]
    topicsToImprove: List[str]
    completedAt: Optional[str] = None

class MECHAnalyticsResponse(BaseModel):
    totalMECHAssessments: int
    avgMCQScore: float
    avgMECHExplorationScore: float
    avgGameScore: float
    topicPerformance: Dict[str, float]
    difficultyPerformance: Dict[str, float]
    mostDifficultTopic: str
    mostFrequentlyIncorrectQuestions: List[str]
    questionSuccessRate: float
    avgCompletionTimeMinutes: float

# Admin schemas for AI Generated Questions Control
class MECHAdminQuestionUpdate(BaseModel):
    status: Optional[str] = None  # "approved", "rejected", "active", "pending"
    question: Optional[str] = None
    options: Optional[Dict[str, str]] = None
    correctAnswer: Optional[str] = None
    explanation: Optional[str] = None
    topic: Optional[str] = None
    difficulty: Optional[str] = None

class MECHAdminQuestionGenerateRequest(BaseModel):
    topic: Optional[str] = "Engineering Mechanics"
    difficulty: Optional[str] = "Medium"
    count: int = 5
