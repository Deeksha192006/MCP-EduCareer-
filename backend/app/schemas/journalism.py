from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class JournalismChallengeSubmission(BaseModel):
    challengeId: str
    selectedOptionId: Optional[str] = None
    timeTaken: int = Field(default=0, ge=0)

class JournalismGameSubmitRequest(BaseModel):
    studentId: str
    submissions: List[JournalismChallengeSubmission]
    totalTime: int = Field(default=0, ge=0)

class JournalismAssessmentResponse(BaseModel):
    id: str
    studentId: str
    department: str = "Journalism & Mass Communication"
    stream: str = "Arts & Science"
    courseName: str = "BA Journalism & Mass Communication"
    gameScore: float = 0.0
    accuracy: float = 0.0
    totalTime: int = 0
    verificationScore: float = 0.0
    ethicsScore: float = 0.0
    interviewingScore: float = 0.0
    communicationScore: float = 0.0
    mediaLiteracyScore: float = 0.0
    completed: bool = False
    skillScores: Dict[str, float]
    challengeSummaries: List[Dict[str, Any]]
    finalResult: Optional[Dict[str, Any]] = None
    completedAt: Optional[str] = None
    created_at: Optional[str] = None

class JournalismAnalyticsResponse(BaseModel):
    totalCompletedAssessments: int
    averageScore: float
    averageVerificationScore: float
    averageEthicsScore: float
    averageInterviewingScore: float
    averageCommunicationScore: float
    averageMediaLiteracyScore: float
    topStrengthsDistribution: Dict[str, int]
