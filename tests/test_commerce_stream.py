import sys
import os
import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app
from app.data.commerce_scenarios import COMMERCE_GAMES_CATALOG, evaluate_commerce_game_submission
from app.data.commerce_written_banks import COMMERCE_WRITTEN_BANKS
from ml.recommendation.commerce_recommendation import CommerceRecommendationService, COMMERCE_COURSES_SPEC

client = TestClient(app)

def test_commerce_catalog_and_games_registration():
    """Verify that all 5 commerce courses exist in COMMERCE_GAMES_CATALOG."""
    expected_games = ["finance-master", "banking-quest", "tax-detective", "corporate-decision", "business-tycoon"]
    for g in expected_games:
        assert g in COMMERCE_GAMES_CATALOG
        cfg = COMMERCE_GAMES_CATALOG[g]
        assert len(cfg["levels"]) == 5
        assert len(cfg["evaluatedSkills"]) >= 4

def test_get_commerce_game_levels_sanitized():
    """Verify level fetching scrubs correct answers for all 5 games."""
    expected_games = ["finance-master", "banking-quest", "tax-detective", "corporate-decision", "business-tycoon"]
    for g in expected_games:
        response = client.get(f"/api/commerce/{g}/levels")
        assert response.status_code == 200
        data = response.json()
        assert data["gameKey"] == g
        assert len(data["levels"]) == 5
        for lvl in data["levels"]:
            assert "correctOptionId" not in lvl
            for opt in lvl.get("options", []):
                assert "isCorrect" not in opt
                assert "explanation" not in opt

def test_evaluate_commerce_game_perfect_score():
    """Verify server-side evaluation engine awards 100% on all correct answers."""
    for g, cfg in COMMERCE_GAMES_CATALOG.items():
        submissions = [{"level": lvl["level"], "selectedOptionId": lvl["correctOptionId"]} for lvl in cfg["levels"]]
        result = evaluate_commerce_game_submission(g, submissions, total_time=80)
        assert result["accuracy"] == 100.0
        assert result["correctCount"] == 5
        assert result["gameScore"] == 100.0

def test_commerce_game_flow_api():
    """Test start, submit, and get result APIs for Finance Master."""
    student_id = "test-student-commerce-1"
    
    # 1. Start game
    start_res = client.post("/api/commerce/start", json={"studentId": student_id, "gameKey": "finance-master"})
    assert start_res.status_code == 200
    assert start_res.json()["studentId"] == student_id

    # 2. Submit game
    levels = COMMERCE_GAMES_CATALOG["finance-master"]["levels"]
    submissions = [{"level": lvl["level"], "selectedOptionId": lvl["correctOptionId"]} for lvl in levels]
    sub_res = client.post("/api/commerce/game/submit", json={
        "studentId": student_id,
        "gameKey": "finance-master",
        "submissions": submissions,
        "totalTime": 85
    })
    assert sub_res.status_code == 200
    sub_data = sub_res.json()
    assert sub_data["completed"] is True
    assert sub_data["gameScore"] == 100.0

    # 3. Retrieve result
    res_get = client.get(f"/api/commerce/finance-master/result/{student_id}")
    assert res_get.status_code == 200
    assert res_get.json()["gameScore"] == 100.0

def test_commerce_written_assessment_banks():
    """Verify that all 5 Commerce written question banks contain 10 questions and can be submitted."""
    expected_written_keys = ["bcom-accfinance", "bcom-bankins", "bcom-tax", "bcom-corpsec", "bba-tycoon"]
    for wk in expected_written_keys:
        assert wk in COMMERCE_WRITTEN_BANKS
        assert len(COMMERCE_WRITTEN_BANKS[wk]["questions"]) == 10

        # Fetch questions via written assessment API
        res = client.get(f"/api/arts-science/written-test/{wk}/questions")
        assert res.status_code == 200
        q_data = res.json()
        assert len(q_data["questions"]) == 10
        for q in q_data["questions"]:
            assert "correctAnswer" not in q

def test_commerce_75_25_recommendation_incomplete_guard():
    """Verify that missing assessments withhold the final match score."""
    student_id = "test-student-incomplete-guard"
    rec = CommerceRecommendationService.calculate_recommendations(student_id)
    assert rec["completedCount"] == 0
    for c in rec["allCourses"]:
        assert c["finalMatchScore"] is None
        assert c["status"] == "NOT_STARTED"

def test_commerce_75_25_recommendation_full_calculation():
    """Verify 75:25 recommendation formula calculation: (Game*0.75) + (Written*0.25)."""
    student_id = "test-student-complete-guard"

    # Submit game with 80% score (4/5)
    levels = COMMERCE_GAMES_CATALOG["finance-master"]["levels"]
    game_sub = [
        {"level": levels[0]["level"], "selectedOptionId": levels[0]["correctOptionId"]},
        {"level": levels[1]["level"], "selectedOptionId": levels[1]["correctOptionId"]},
        {"level": levels[2]["level"], "selectedOptionId": levels[2]["correctOptionId"]},
        {"level": levels[3]["level"], "selectedOptionId": levels[3]["correctOptionId"]},
        {"level": levels[4]["level"], "selectedOptionId": "wrong-opt"}
    ]
    client.post("/api/commerce/game/submit", json={
        "studentId": student_id,
        "gameKey": "finance-master",
        "submissions": game_sub,
        "totalTime": 130
    })

    # Submit written assessment with 8/10 (80%)
    bank_q = COMMERCE_WRITTEN_BANKS["bcom-accfinance"]["questions"]
    answers = [{"questionId": q["id"], "selectedAnswer": q["correctAnswer"], "timeTaken": 10} for q in bank_q[:8]]
    answers.append({"questionId": bank_q[8]["id"], "selectedAnswer": "Wrong Answer", "timeTaken": 10})
    answers.append({"questionId": bank_q[9]["id"], "selectedAnswer": "Wrong Answer", "timeTaken": 10})

    w_res = client.post("/api/arts-science/written-test/bcom-accfinance/submit", json={
        "studentId": student_id,
        "answers": answers,
        "totalTime": 120
    })
    assert w_res.status_code == 200

    # Calculate recommendation
    rec_res = client.get(f"/api/recommend/commerce/{student_id}")
    assert rec_res.status_code == 200
    rec_data = rec_res.json()
    assert rec_data["completedCount"] >= 1

    acc_course = next(c for c in rec_data["allCourses"] if c["courseKey"] == "bcom-accfinance")
    assert acc_course["status"] == "COMPLETE"
    assert acc_course["gameScore"] == 80.0
    assert acc_course["writtenScore"] == 80.0
    # (80 * 0.75) + (80 * 0.25) = 80.0
    assert acc_course["finalMatchScore"] == 80.0
