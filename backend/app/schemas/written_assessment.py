from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class WrittenAnswerItem(BaseModel):
    questionId: str
    selectedAnswer: str
    timeTaken: Optional[int] = Field(default=0, ge=0)

class WrittenTestSubmitRequest(BaseModel):
    studentId: str
    answers: List[WrittenAnswerItem]
    totalTime: Optional[int] = Field(default=0, ge=0)

class WrittenTestResponse(BaseModel):
    id: str
    studentId: str
    courseKey: str
    courseName: str
    score: float = Field(default=0.0, ge=0.0, le=100.0)
    correctCount: int = 0
    totalQuestions: int = 0
    topicScores: Dict[str, float] = {}
    difficultyScores: Dict[str, float] = {}
    completed: bool = False
    completedAt: Optional[str] = None
    created_at: Optional[str] = None
    answers: Optional[List[Dict[str, Any]]] = None
