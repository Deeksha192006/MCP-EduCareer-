from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class ITQuizStartRequest(BaseModel):
    studentId: str

class ITLevelPerformance(BaseModel):
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

class ITSkillScores(BaseModel):
    logicalThinking: float = 0.0
    problemSolving: float = 0.0
    computationalThinking: float = 0.0
    algorithmicThinking: float = 0.0
    programmingLogic: float = 0.0
    debugging: float = 0.0
    dataInterpretation: float = 0.0
    patternRecognition: float = 0.0
    analyticalThinking: float = 0.0
    technologyAwareness: float = 0.0
    digitalReasoning: float = 0.0
    decisionMaking: float = 0.0
    optimizationThinking: float = 0.0

class ITRound1SubmitRequest(BaseModel):
    assessmentId: str = ""
    studentId: str
    levelResults: List[ITLevelPerformance] = []
    gameScore: Optional[float] = None
    totalTimeTaken: int = 0
    totalTime: int = 0

class ITQuizGenerateRequest(BaseModel):
    assessmentId: str = ""
    studentId: str
    numQuestions: int = 10
    difficultyDistribution: Optional[Dict[str, int]] = None  # e.g. {"Easy": 3, "Medium": 5, "Hard": 2}

class ITQuizAnswerSubmit(BaseModel):
    questionId: str
    selectedAnswer: str
    timeTakenSeconds: int = 0
    timeTaken: int = 0

class ITRound2SubmitRequest(BaseModel):
    assessmentId: str = ""
    studentId: str
    answers: List[ITQuizAnswerSubmit] = []
    timeTakenSeconds: int = 0
    totalTime: int = 0

class ITResultResponse(BaseModel):
    id: Optional[str] = None
    assessmentId: str
    studentId: str
    department: str = "IT"
    itExplorationScore: float
    gameScore: float
    mcqScore: float
    skillProfile: Dict[str, float]
    strongTopics: List[str]
    topicsToImprove: List[str]
    completedAt: Optional[str] = None

class ITAnalyticsResponse(BaseModel):
    totalITAssessments: int
    avgMCQScore: float
    avgITExplorationScore: float
    avgGameScore: float
    skillAverages: Dict[str, float]
    topicPerformance: Dict[str, float]
    difficultyPerformance: Dict[str, float]
    mostDifficultTopic: str
    mostFrequentlyIncorrectQuestions: List[str]
    questionSuccessRate: float
    avgCompletionTimeMinutes: float

class ITAdminQuestionUpdate(BaseModel):
    status: Optional[str] = None  # "approved", "rejected", "active", "pending"
    question: Optional[str] = None
    options: Optional[Dict[str, str]] = None
    correctAnswer: Optional[str] = None
    explanation: Optional[str] = None
    topic: Optional[str] = None
    difficulty: Optional[str] = None

class ITAdminQuestionGenerateRequest(BaseModel):
    topic: Optional[str] = "Computer Fundamentals"
    difficulty: Optional[str] = "Medium"
    count: int = 5
