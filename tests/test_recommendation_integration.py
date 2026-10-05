import sys
import os
import uuid
import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.main import app

client = TestClient(app)

def test_arts_science_recommendation_integration():
    student_id = f"test-rec-student-{str(uuid.uuid4())[:8]}"

    # 1. Complete Journalism simulation with top marks
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

    # 2. Request recommendation for this student
    rec_res = client.post("/api/recommend/final", json={"student_id": student_id})
    assert rec_res.status_code == 200
    rec_data = rec_res.json()

    # 3. Verify that the recommendation results include why explanations referencing the simulation
    top_courses = rec_data.get("top_courses", [])
    assert len(top_courses) > 0

    journalism_course = next((c for c in top_courses if "Journalism" in c.get("course", "")), None)
    if journalism_course:
        why_list = journalism_course.get("why_explanations", [])
        has_sim_explanation = any("Newsroom Challenge" in w or "Hands-On Simulation" in w for w in why_list)
        assert has_sim_explanation, f"Expected hands-on simulation explanation in why_list: {why_list}"
