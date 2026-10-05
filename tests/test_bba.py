import sys
import os
import uuid
import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.main import app

client = TestClient(app)

def test_bba_assessment_flow():
    student_id = f"test-bba-student-{str(uuid.uuid4())[:8]}"

    # 1. Fetch public rounds - verify answers & scores are scrubbed
    rounds_res = client.get("/api/arts-science/bba/rounds")
    assert rounds_res.status_code == 200
    rounds = rounds_res.json()
    assert len(rounds) == 5
    for rnd in rounds:
        assert "optimalOptionId" not in rnd
        for opt in rnd.get("options", []):
            assert "score" not in opt
            assert "isOptimal" not in opt

    # 2. Start Assessment
    start_res = client.post("/api/arts-science/bba/start", json={"studentId": student_id})
    assert start_res.status_code == 200
    start_data = start_res.json()
    assert start_data["studentId"] == student_id
    assert start_data["courseName"] == "BBA (Bachelor of Business Administration)"
    assert start_data["completed"] is False
    assert start_data["finalCash"] == 100000.0

    # 3. Submit Startup Simulator decisions
    submissions = [
        {"roundId": "bba_rnd_1", "selectedOptionId": "opt_saas_app", "timeTaken": 20},
        {"roundId": "bba_rnd_2", "selectedOptionId": "opt_value_pricing", "timeTaken": 25},
        {"roundId": "bba_rnd_3", "selectedOptionId": "opt_campus_ambassador", "timeTaken": 22},
        {"roundId": "bba_rnd_4", "selectedOptionId": "opt_hire_eng_support", "timeTaken": 30},
        {"roundId": "bba_rnd_5", "selectedOptionId": "opt_differentiation_moat", "timeTaken": 28}
    ]

    submit_res = client.post("/api/arts-science/bba/game/submit", json={
        "studentId": student_id,
        "submissions": submissions,
        "totalTime": 125
    })
    assert submit_res.status_code == 200
    submit_data = submit_res.json()
    assert submit_data["completed"] is True
    assert submit_data["gameScore"] == 100.0
    assert submit_data["accuracy"] == 100.0
    assert submit_data["finalCash"] > 50000.0
    assert submit_data["skillScores"]["businessReasoning"] > 0
    assert submit_data["skillScores"]["resourceManagement"] > 0
    assert submit_data["skillScores"]["strategicThinking"] > 0
    assert submit_data["skillScores"]["financialAcumen"] > 0
    assert submit_data["finalResult"]["compatibilityBand"] == "Visionary Entrepreneurial Leadership"

    # 4. Fetch Result by Student ID
    result_res = client.get(f"/api/arts-science/bba/result/{student_id}")
    assert result_res.status_code == 200
    result_data = result_res.json()
    assert result_data["studentId"] == student_id
    assert len(result_data["roundSummaries"]) == 5

    # 5. Check Analytics
    analytics_res = client.get("/api/arts-science/bba/analytics")
    assert analytics_res.status_code == 200
    analytics_data = analytics_res.json()
    assert analytics_data["totalCompletedAssessments"] >= 1
    assert analytics_data["averageScore"] > 0
