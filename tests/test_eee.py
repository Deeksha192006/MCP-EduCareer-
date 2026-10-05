import sys
import os
import uuid
import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.main import app

client = TestClient(app)

def test_eee_assessment_flow():
    student_id = f"test-eee-student-{str(uuid.uuid4())[:8]}"

    # 1. Start EEE Assessment
    start_res = client.post("/api/engineering/eee/start", json={"studentId": student_id})
    assert start_res.status_code == 200
    start_data = start_res.json()
    assert start_data["studentId"] == student_id
    assert start_data["department"] == "EEE"
    assert len(start_data["round1"]["levelResults"]) == 5

    # 2. Submit Round 1 Game Performance (Smart Power Distribution Challenge)
    l_results = [
        {"levelId": "eee_lvl_1", "levelName": "L1", "skillTested": "Circuit Understanding", "difficulty": "easy", "score": 90.0, "accuracy": 1.0, "timeTaken": 15, "attempts": 1, "completed": True},
        {"levelId": "eee_lvl_2", "levelName": "L2", "skillTested": "Energy Management & Decision Making", "difficulty": "medium", "score": 85.0, "accuracy": 1.0, "timeTaken": 20, "attempts": 1, "completed": True},
        {"levelId": "eee_lvl_3", "levelName": "L3", "skillTested": "Electrical Troubleshooting", "difficulty": "medium", "score": 80.0, "accuracy": 1.0, "timeTaken": 22, "attempts": 1, "completed": True},
        {"levelId": "eee_lvl_4", "levelName": "L4", "skillTested": "Energy Optimization Challenge", "difficulty": "hard", "score": 88.0, "accuracy": 1.0, "timeTaken": 25, "attempts": 1, "completed": True},
        {"levelId": "eee_lvl_5", "levelName": "L5", "skillTested": "Electrical Flow Puzzle", "difficulty": "hard", "score": 92.0, "accuracy": 1.0, "timeTaken": 18, "attempts": 1, "completed": True}
    ]
    r1_res = client.post("/api/engineering/eee/game/submit", json={
        "studentId": student_id,
        "levelResults": l_results,
        "totalTime": 100
    })
    assert r1_res.status_code == 200
    r1_data = r1_res.json()
    assert r1_data["round1"]["completed"] is True
    assert r1_data["round1"]["gameScore"] > 0
    assert "electricalReasoning" in r1_data["round1"]["skillScores"]
    assert "circuitUnderstanding" in r1_data["round1"]["skillScores"]

    # 3. Fetch Quiz Questions
    q_res = client.get("/api/engineering/eee/quiz/questions")
    assert q_res.status_code == 200
    questions = q_res.json()
    assert len(questions) == 10

    # 4. Submit Round 2 Technical Quiz
    from app.data.eee_quiz_bank import EEE_QUIZ_QUESTIONS
    q_answers = []
    for q in EEE_QUIZ_QUESTIONS:
        q_answers.append({
            "questionId": q["id"],
            "selectedAnswer": q["correctAnswer"],
            "timeTaken": 12
        })

    r2_res = client.post("/api/engineering/eee/quiz/submit", json={
        "studentId": student_id,
        "answers": q_answers,
        "totalTime": 120
    })
    assert r2_res.status_code == 200
    r2_data = r2_res.json()
    assert r2_data["round2"]["completed"] is True
    assert r2_data["round2"]["quizScore"] == 100.0

    # 5. Complete Assessment
    comp_res = client.post("/api/engineering/eee/complete", json={"studentId": student_id})
    assert comp_res.status_code == 200
    comp_data = comp_res.json()
    assert comp_data["completedAt"] is not None
    # Game 87.0 * 0.6 + Quiz 100 * 0.4 = 92.2% -> Strong Skill Alignment
    assert comp_data["finalResult"]["explorationScore"] > 80.0
    assert comp_data["finalResult"]["compatibilityBand"] == "Strong Skill Alignment"
    assert len(comp_data["finalResult"]["strengths"]) >= 1

    # 6. Fetch Result
    get_res = client.get(f"/api/engineering/eee/result/{student_id}")
    assert get_res.status_code == 200
    assert get_res.json()["studentId"] == student_id

    # 7. EEE Analytics
    analytics_res = client.get("/api/engineering/eee/analytics")
    assert analytics_res.status_code == 200
    analytics_data = analytics_res.json()
    assert analytics_data["totalCompletedAssessments"] >= 1
