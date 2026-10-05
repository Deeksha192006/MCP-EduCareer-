import sys
import os
import uuid
import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.main import app

client = TestClient(app)

def test_data_science_assessment_flow():
    student_id = f"test-ds-student-{str(uuid.uuid4())[:8]}"

    # 1. Fetch public levels - verify answer keys are stripped from public view
    levels_res = client.get("/api/arts-science/data-science/levels")
    assert levels_res.status_code == 200
    levels = levels_res.json()
    assert len(levels) == 5
    for lvl in levels:
        assert "correctOptionId" not in lvl
        for opt in lvl.get("options", []):
            assert "isCorrect" not in opt

    # 2. Start Assessment
    start_res = client.post("/api/arts-science/data-science/start", json={"studentId": student_id})
    assert start_res.status_code == 200
    start_data = start_res.json()
    assert start_data["studentId"] == student_id
    assert start_data["courseName"] == "B.Sc. Data Science & Analytics"
    assert start_data["completed"] is False

    # 3. Submit Game Results (Server-side validation)
    submissions = [
        {"levelId": "ds_lvl_1", "selectedOption": "opt_370", "timeTaken": 15, "attempts": 1},
        {"levelId": "ds_lvl_2", "selectedOption": "opt_payment", "timeTaken": 20, "attempts": 1},
        {"levelId": "ds_lvl_3", "selectedOption": "opt_confounder", "timeTaken": 18, "attempts": 1},
        {"levelId": "ds_lvl_4", "selectedOption": "opt_60", "timeTaken": 25, "attempts": 1},
        {"levelId": "ds_lvl_5", "selectedOption": "opt_bot_attack", "timeTaken": 30, "attempts": 1}
    ]

    submit_res = client.post("/api/arts-science/data-science/game/submit", json={
        "studentId": student_id,
        "levelSubmissions": submissions,
        "totalTime": 108
    })
    assert submit_res.status_code == 200
    submit_data = submit_res.json()
    assert submit_data["completed"] is True
    assert submit_data["gameScore"] == 100.0
    assert submit_data["accuracy"] == 100.0
    assert submit_data["skillScores"]["analyticalThinking"] > 0
    assert submit_data["skillScores"]["dataInterpretation"] > 0
    assert submit_data["skillScores"]["logicalReasoning"] > 0
    assert submit_data["skillScores"]["numericalSkills"] > 0
    assert submit_data["skillScores"]["hypothesisTesting"] > 0
    assert submit_data["finalResult"]["compatibilityBand"] == "Exceptional Analytical Aptitude"

    # 4. Fetch Result by Student ID
    result_res = client.get(f"/api/arts-science/data-science/result/{student_id}")
    assert result_res.status_code == 200
    result_data = result_res.json()
    assert result_data["studentId"] == student_id
    assert len(result_data["levelResults"]) == 5

    # 5. Check Analytics
    analytics_res = client.get("/api/arts-science/data-science/analytics")
    assert analytics_res.status_code == 200
    analytics_data = analytics_res.json()
    assert analytics_data["totalCompletedAssessments"] >= 1
    assert analytics_data["averageScore"] > 0
