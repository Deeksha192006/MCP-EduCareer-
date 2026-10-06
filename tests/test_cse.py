import sys
import os
import uuid
import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.main import app

client = TestClient(app)

def test_cse_assessment_flow():
    student_id = f"test-student-{str(uuid.uuid4())[:8]}"
    
    # 1. Start Assessment
    response = client.post("/api/cse/assessment/start", json={"studentId": student_id})
    assert response.status_code == 200
    data = response.json()
    assert data["studentId"] == student_id
    assert data["department"] == "CSE"
    assert len(data["gamePerformance"]) == 5
    assert data["gamesAttempted"] == 0

    expected_game_ids = [
        "cse_xor_gate",
        "cse_river_crossing",
        "cse_water_jug",
        "cse_missionaries_cannibals",
        "cse_tower_of_hanoi"
    ]
    actual_ids = [g["gameId"] for g in data["gamePerformance"]]
    assert actual_ids == expected_game_ids

    # 2. Get Assessment
    get_res = client.get(f"/api/cse/assessment/{student_id}")
    assert get_res.status_code == 200
    assert get_res.json()["studentId"] == student_id

    # 3. Submit Game Performance for XOR Gate
    game_payload = {
        "studentId": student_id,
        "gameId": "cse_xor_gate",
        "score": 90.0,
        "maxScore": 100.0,
        "accuracy": 0.90,
        "timeTaken": 45,
        "attempts": 5,
        "difficulty": "easy"
    }
    submit_res = client.post("/api/cse/assessment/submit-game", json=game_payload)
    assert submit_res.status_code == 200
    sub_data = submit_res.json()
    assert sub_data["gamesAttempted"] == 1
    assert sub_data["skillScores"]["logicalThinking"] == 90.0
    assert sub_data["skillScores"]["booleanReasoning"] == 90.0
    assert sub_data["skillScores"]["patternRecognition"] == 90.0

    # 4. Complete Assessment
    comp_res = client.post("/api/cse/assessment/complete", json={"studentId": student_id})
    assert comp_res.status_code == 200
    comp_data = comp_res.json()
    assert comp_data["completedAt"] is not None
    assert comp_data["cseCompatibilityScore"] > 0

    # 5. Check Analytics
    analytics_res = client.get("/api/cse/analytics")
    assert analytics_res.status_code == 200
    analytics_data = analytics_res.json()
    assert analytics_data["totalCompletedAssessments"] >= 1
