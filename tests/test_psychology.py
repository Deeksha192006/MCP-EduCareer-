import sys
import os
import uuid
import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.main import app

client = TestClient(app)

def test_psychology_assessment_flow():
    student_id = f"test-psych-student-{str(uuid.uuid4())[:8]}"

    # 1. Fetch public scenarios - verify consequences & optimal flags are stripped
    scenarios_res = client.get("/api/arts-science/psychology/scenarios")
    assert scenarios_res.status_code == 200
    scenarios = scenarios_res.json()
    assert len(scenarios) == 5
    for sc in scenarios:
        assert "optimalOptionId" not in sc
        for opt in sc.get("options", []):
            assert "score" not in opt
            assert "isOptimal" not in opt

    # 2. Start Assessment
    start_res = client.post("/api/arts-science/psychology/start", json={"studentId": student_id})
    assert start_res.status_code == 200
    start_data = start_res.json()
    assert start_data["studentId"] == student_id
    assert start_data["courseName"] == "B.Sc. Psychology"
    assert start_data["completed"] is False

    # 3. Submit Mind Explorer decisions
    submissions = [
        {"scenarioId": "psych_sc_1", "selectedOptionId": "opt_empathy_private", "timeTaken": 22},
        {"scenarioId": "psych_sc_2", "selectedOptionId": "opt_courage_challenge", "timeTaken": 18},
        {"scenarioId": "psych_sc_3", "selectedOptionId": "opt_grounding_reframe", "timeTaken": 25},
        {"scenarioId": "psych_sc_4", "selectedOptionId": "opt_attribution_correction", "timeTaken": 19},
        {"scenarioId": "psych_sc_5", "selectedOptionId": "opt_restorative_synthesis", "timeTaken": 30}
    ]

    submit_res = client.post("/api/arts-science/psychology/game/submit", json={
        "studentId": student_id,
        "submissions": submissions,
        "totalTime": 114
    })
    assert submit_res.status_code == 200
    submit_data = submit_res.json()
    assert submit_data["completed"] is True
    assert submit_data["gameScore"] == 100.0
    assert submit_data["accuracy"] == 100.0
    assert submit_data["skillScores"]["empathyOrientedReasoning"] > 0
    assert submit_data["skillScores"]["socialPerception"] > 0
    assert submit_data["skillScores"]["criticalThinking"] > 0
    assert submit_data["skillScores"]["observationSkills"] > 0
    assert submit_data["skillScores"]["conflictResolution"] > 0
    assert submit_data["finalResult"]["compatibilityBand"] == "Exceptional Interpersonal & Empathic Acumen"
    assert "disclaimer" in submit_data["finalResult"]
    assert "not diagnose" in submit_data["finalResult"]["disclaimer"].lower()

    # 4. Fetch Result by Student ID
    result_res = client.get(f"/api/arts-science/psychology/result/{student_id}")
    assert result_res.status_code == 200
    result_data = result_res.json()
    assert result_data["studentId"] == student_id
    assert len(result_data["scenarioResults"]) == 5

    # 5. Check Analytics
    analytics_res = client.get("/api/arts-science/psychology/analytics")
    assert analytics_res.status_code == 200
    analytics_data = analytics_res.json()
    assert analytics_data["totalCompletedAssessments"] >= 1
    assert analytics_data["averageScore"] > 0
