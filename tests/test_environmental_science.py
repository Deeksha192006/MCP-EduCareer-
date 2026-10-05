import sys
import os
import uuid
import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.main import app

client = TestClient(app)

def test_environmental_science_assessment_flow():
    student_id = f"test-env-student-{str(uuid.uuid4())[:8]}"

    # 1. Fetch public challenges - verify optimal flags & scores are scrubbed
    challenges_res = client.get("/api/arts-science/environmental-science/challenges")
    assert challenges_res.status_code == 200
    challenges = challenges_res.json()
    assert len(challenges) == 5
    for ch in challenges:
        assert "optimalOptionId" not in ch
        for opt in ch.get("options", []):
            assert "score" not in opt
            assert "isOptimal" not in opt

    # 2. Start Assessment
    start_res = client.post("/api/arts-science/environmental-science/start", json={"studentId": student_id})
    assert start_res.status_code == 200
    start_data = start_res.json()
    assert start_data["studentId"] == student_id
    assert start_data["courseName"] == "B.Sc. Environmental Science"
    assert start_data["completed"] is False
    assert start_data["finalAQI"] == 185.0

    # 3. Submit Eco Guardian decisions
    submissions = [
        {"challengeId": "env_ch_1", "selectedOptionId": "opt_solar_microgrid", "timeTaken": 20},
        {"challengeId": "env_ch_2", "selectedOptionId": "opt_sponge_basin", "timeTaken": 25},
        {"challengeId": "env_ch_3", "selectedOptionId": "opt_zero_waste_circular", "timeTaken": 22},
        {"challengeId": "env_ch_4", "selectedOptionId": "opt_constructed_wetland", "timeTaken": 28},
        {"challengeId": "env_ch_5", "selectedOptionId": "opt_urban_forest_canopy", "timeTaken": 24}
    ]

    submit_res = client.post("/api/arts-science/environmental-science/game/submit", json={
        "studentId": student_id,
        "submissions": submissions,
        "totalTime": 119
    })
    assert submit_res.status_code == 200
    submit_data = submit_res.json()
    assert submit_data["completed"] is True
    assert submit_data["gameScore"] == 100.0
    assert submit_data["accuracy"] == 100.0
    assert submit_data["finalAQI"] < 100.0  # Improved significantly from 185
    assert submit_data["finalCleanEnergy"] > 50.0  # Improved from 15%
    assert submit_data["finalWaterReserves"] > 50.0  # Improved from 35%
    assert submit_data["skillScores"]["scientificReasoning"] > 0
    assert submit_data["skillScores"]["sustainabilityAwareness"] > 0
    assert submit_data["skillScores"]["systemsThinking"] > 0
    assert submit_data["finalResult"]["compatibilityBand"] == "Master Eco Guardian & Systems Ecologist"

    # 4. Fetch Result by Student ID
    result_res = client.get(f"/api/arts-science/environmental-science/result/{student_id}")
    assert result_res.status_code == 200
    result_data = result_res.json()
    assert result_data["studentId"] == student_id
    assert len(result_data["challengeSummaries"]) == 5

    # 5. Check Analytics
    analytics_res = client.get("/api/arts-science/environmental-science/analytics")
    assert analytics_res.status_code == 200
    analytics_data = analytics_res.json()
    assert analytics_data["totalCompletedAssessments"] >= 1
    assert analytics_data["averageScore"] > 0
