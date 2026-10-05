import sys
import os
import uuid
import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.main import app

client = TestClient(app)

def test_journalism_assessment_flow():
    student_id = f"test-jrnl-student-{str(uuid.uuid4())[:8]}"

    # 1. Fetch public challenges - verify optimal flags & scores are scrubbed
    challenges_res = client.get("/api/arts-science/journalism/challenges")
    assert challenges_res.status_code == 200
    challenges = challenges_res.json()
    assert len(challenges) == 5
    for ch in challenges:
        assert "optimalOptionId" not in ch
        for opt in ch.get("options", []):
            assert "score" not in opt
            assert "isOptimal" not in opt
            assert "editorialFeedback" not in opt

    # 2. Start Assessment
    start_res = client.post("/api/arts-science/journalism/start", json={"studentId": student_id})
    assert start_res.status_code == 200
    start_data = start_res.json()
    assert start_data["studentId"] == student_id
    assert start_data["courseName"] == "BA Journalism & Mass Communication"
    assert start_data["completed"] is False

    # 3. Evaluate single choice
    eval_res = client.post("/api/arts-science/journalism/evaluate-choice", json={
        "challengeId": "jrnl_ch_1",
        "selectedOptionId": "opt_verify_multi_source"
    })
    assert eval_res.status_code == 200
    eval_data = eval_res.json()
    assert eval_data["isOptimal"] is True
    assert eval_data["scoreEarned"] == 20.0

    # 4. Submit all 5 choices
    submissions = [
        {"challengeId": "jrnl_ch_1", "selectedOptionId": "opt_verify_multi_source", "timeTaken": 20},
        {"challengeId": "jrnl_ch_2", "selectedOptionId": "opt_evidence_based_inquiry", "timeTaken": 25},
        {"challengeId": "jrnl_ch_3", "selectedOptionId": "opt_accurate_ethical_headline", "timeTaken": 22},
        {"challengeId": "jrnl_ch_4", "selectedOptionId": "opt_forensic_pipeline", "timeTaken": 28},
        {"challengeId": "jrnl_ch_5", "selectedOptionId": "opt_perfect_inverted_pyramid", "timeTaken": 24}
    ]

    submit_res = client.post("/api/arts-science/journalism/submit", json={
        "studentId": student_id,
        "submissions": submissions,
        "totalTime": 119
    })
    assert submit_res.status_code == 200
    submit_data = submit_res.json()
    assert submit_data["completed"] is True
    assert submit_data["gameScore"] == 100.0
    assert submit_data["accuracy"] == 100.0
    assert submit_data["verificationScore"] > 80.0
    assert submit_data["ethicsScore"] > 80.0
    assert submit_data["interviewingScore"] > 80.0
    assert submit_data["communicationScore"] > 80.0
    assert submit_data["mediaLiteracyScore"] > 80.0
    assert len(submit_data["challengeSummaries"]) == 5
    assert "Master Investigative Reporter" in submit_data["finalResult"]["compatibilityBand"]

    # 5. Fetch Results
    result_res = client.get(f"/api/arts-science/journalism/results/{student_id}")
    assert result_res.status_code == 200
    result_data = result_res.json()
    assert result_data["gameScore"] == 100.0

    # 6. Fetch Analytics
    analytics_res = client.get("/api/arts-science/journalism/analytics")
    assert analytics_res.status_code == 200
    analytics_data = analytics_res.json()
    assert analytics_data["totalCompletedAssessments"] >= 1
