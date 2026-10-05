import sys
import os
import uuid
import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.main import app

client = TestClient(app)

def test_aids_assessment_flow():
    student_id = f"test-aids-student-{str(uuid.uuid4())[:8]}"

    # 1. Start AIDS Assessment
    start_res = client.post("/api/engineering/aids/start", json={"studentId": student_id})
    assert start_res.status_code == 200
    start_data = start_res.json()
    assert start_data["studentId"] == student_id
    assert start_data["department"] == "AIDS"
    assert len(start_data["round1"]["levelResults"]) == 6

    # 2. Submit Round 1 Game Performance (Data Detective Challenge)
    l_results = [
        {"levelId": "aids_lvl_1", "levelName": "L1", "skillTested": "Pattern Recognition", "difficulty": "easy", "score": 90.0, "accuracy": 1.0, "timeTaken": 12, "attempts": 1, "completed": True},
        {"levelId": "aids_lvl_2", "levelName": "L2", "skillTested": "Data Interpretation", "difficulty": "medium", "score": 85.0, "accuracy": 1.0, "timeTaken": 18, "attempts": 1, "completed": True},
        {"levelId": "aids_lvl_3", "levelName": "L3", "skillTested": "Anomaly Detection", "difficulty": "medium", "score": 88.0, "accuracy": 1.0, "timeTaken": 15, "attempts": 1, "completed": True},
        {"levelId": "aids_lvl_4", "levelName": "L4", "skillTested": "Prediction Ability", "difficulty": "medium", "score": 92.0, "accuracy": 1.0, "timeTaken": 20, "attempts": 1, "completed": True},
        {"levelId": "aids_lvl_5", "levelName": "L5", "skillTested": "Data Decision Challenge", "difficulty": "hard", "score": 85.0, "accuracy": 1.0, "timeTaken": 25, "attempts": 1, "completed": True},
        {"levelId": "aids_lvl_6", "levelName": "L6", "skillTested": "Correlation Thinking", "difficulty": "hard", "score": 90.0, "accuracy": 1.0, "timeTaken": 22, "attempts": 1, "completed": True}
    ]
    r1_res = client.post("/api/engineering/aids/game/submit", json={
        "studentId": student_id,
        "levelResults": l_results,
        "totalTime": 112
    })
    assert r1_res.status_code == 200
    r1_data = r1_res.json()
    assert r1_data["round1"]["completed"] is True
    assert r1_data["round1"]["gameScore"] > 0
    assert "dataInterpretation" in r1_data["round1"]["skillScores"]
    assert "patternRecognition" in r1_data["round1"]["skillScores"]

    # 3. Fetch Quiz Questions
    q_res = client.get("/api/engineering/aids/quiz/questions")
    assert q_res.status_code == 200
    questions = q_res.json()
    assert len(questions) == 10

    # 4. Submit Round 2 Technical Quiz
    from app.data.aids_quiz_bank import AIDS_QUIZ_QUESTIONS
    q_answers = []
    for q in AIDS_QUIZ_QUESTIONS:
        q_answers.append({
            "questionId": q["id"],
            "selectedAnswer": q["correctAnswer"],
            "timeTaken": 10
        })

    r2_res = client.post("/api/engineering/aids/quiz/submit", json={
        "studentId": student_id,
        "answers": q_answers,
        "totalTime": 100
    })
    assert r2_res.status_code == 200
    r2_data = r2_res.json()
    assert r2_data["round2"]["completed"] is True
    assert r2_data["round2"]["quizScore"] == 100.0

    # 5. Complete Assessment
    comp_res = client.post("/api/engineering/aids/complete", json={"studentId": student_id})
    assert comp_res.status_code == 200
    comp_data = comp_res.json()
    assert comp_data["completedAt"] is not None
    # Game ~88.3 * 0.6 + Quiz 100 * 0.4 = ~93.0% -> Strong Skill Alignment
    assert comp_data["finalResult"]["explorationScore"] > 80.0
    assert comp_data["finalResult"]["compatibilityBand"] == "Strong Skill Alignment"
    assert len(comp_data["finalResult"]["strengths"]) >= 1

    # 6. Fetch Result
    get_res = client.get(f"/api/engineering/aids/result/{student_id}")
    assert get_res.status_code == 200
    assert get_res.json()["studentId"] == student_id

    # 7. AIDS Analytics
    analytics_res = client.get("/api/engineering/aids/analytics")
    assert analytics_res.status_code == 200
    analytics_data = analytics_res.json()
    assert analytics_data["totalCompletedAssessments"] >= 1
