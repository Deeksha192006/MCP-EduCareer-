import sys
import os
import uuid
import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.main import app
from app.core.weight_config import weight_config, ScoreRangeError, WeightConfigurationError
from ml.recommendation.arts_science_recommendation import ArtsScienceRecommendationService

client = TestClient(app)

def test_scenario_1_game_80_written_60_produces_75():
    """
    Scenario 1: Game score 80 and written test score 60 should produce a final score of 75.
    (80 * 0.75) + (60 * 0.25) = 60 + 15 = 75.0
    """
    weight_config.reset_to_default()
    score = weight_config.calculate_course_match(80.0, 60.0)
    assert score == 75.0

def test_scenario_2_game_90_written_80_produces_87_5():
    """
    Scenario 2: Game score 90 and written test score 80 should produce a final score of 87.5.
    (90 * 0.75) + (80 * 0.25) = 67.5 + 20 = 87.5
    """
    weight_config.reset_to_default()
    score = weight_config.calculate_course_match(90.0, 80.0)
    assert score == 87.5

def test_scenario_3_missing_game_score_no_final_recommendation():
    """
    Scenario 3: A missing game score must not produce a final recommendation.
    Must indicate GAME_PENDING and finalCourseMatchScore must be None.
    """
    student_id = f"test-nogame-{str(uuid.uuid4())[:8]}"

    # Submit only written test for B.Sc. Data Science
    q_res = client.get("/api/arts-science/written-test/data-science/questions")
    assert q_res.status_code == 200
    questions = q_res.json()["questions"]
    answers = [{"questionId": q["id"], "selectedAnswer": q["options"][0], "timeTaken": 5} for q in questions]

    sub_res = client.post("/api/arts-science/written-test/data-science/submit", json={
        "studentId": student_id,
        "answers": answers,
        "totalTime": 50
    })
    assert sub_res.status_code == 200

    # Request course recommendations
    rec_res = client.get(f"/api/recommend/arts-science/{student_id}")
    assert rec_res.status_code == 200
    data = rec_res.json()

    ds_rec = next((c for c in data["allCourses"] if c["courseKey"] == "data-science"), None)
    assert ds_rec is not None
    assert ds_rec["isComplete"] is False
    assert ds_rec["statusCode"] == "GAME_PENDING"
    assert ds_rec["finalCourseMatchScore"] is None
    assert "Interactive Simulation Game" in ds_rec["missingAssessments"]

def test_scenario_4_missing_written_score_no_final_recommendation():
    """
    Scenario 4: A missing written test score must not produce a final recommendation.
    Must indicate WRITTEN_TEST_PENDING and finalCourseMatchScore must be None.
    """
    student_id = f"test-nowritten-{str(uuid.uuid4())[:8]}"

    # Submit only game simulation for B.Sc. Psychology
    game_sub = [
        {"scenarioId": "psy_sc_1", "choiceId": "opt_active_listen", "timeTaken": 15},
        {"scenarioId": "psy_sc_2", "choiceId": "opt_private_mediation", "timeTaken": 15},
        {"scenarioId": "psy_sc_3", "choiceId": "opt_presence_and_listen", "timeTaken": 15},
        {"scenarioId": "psy_sc_4", "choiceId": "opt_gentle_redirect", "timeTaken": 15},
        {"scenarioId": "psy_sc_5", "choiceId": "opt_assertive_boundary", "timeTaken": 15}
    ]
    sub_res = client.post("/api/arts-science/psychology/game/submit", json={
        "studentId": student_id,
        "submissions": game_sub,
        "totalTime": 75
    })
    assert sub_res.status_code == 200

    # Request recommendations
    rec_res = client.get(f"/api/recommend/arts-science/{student_id}")
    assert rec_res.status_code == 200
    data = rec_res.json()

    psy_rec = next((c for c in data["allCourses"] if c["courseKey"] == "psychology"), None)
    assert psy_rec is not None
    assert psy_rec["isComplete"] is False
    assert psy_rec["statusCode"] == "WRITTEN_TEST_PENDING"
    assert psy_rec["finalCourseMatchScore"] is None
    assert "Written Conceptual Assessment" in psy_rec["missingAssessments"]

def test_scenario_5_scores_outside_0_100_rejected():
    """
    Scenario 5: Scores outside the valid 0–100 range must be rejected or handled safely.
    """
    with pytest.raises(ScoreRangeError):
        weight_config.calculate_course_match(-5.0, 50.0)

    with pytest.raises(ScoreRangeError):
        weight_config.calculate_course_match(105.0, 50.0)

    with pytest.raises(ScoreRangeError):
        weight_config.calculate_course_match(50.0, 150.0)

def test_scenario_6_course_specific_isolation():
    """
    Scenario 6: Each course must use its own game and written test results.
    A score in Data Science must not bleed into Psychology or BBA.
    """
    student_id = f"test-isolate-{str(uuid.uuid4())[:8]}"

    # Complete both game & written for BBA only
    bba_game = [
        {"roundId": "bba_rd_1", "choiceId": "opt_lean_bootstrapped", "pricingStrategy": "mid", "timeTaken": 20},
        {"roundId": "bba_rd_2", "choiceId": "opt_content_referral", "pricingStrategy": "mid", "timeTaken": 20},
        {"roundId": "bba_rd_3", "choiceId": "opt_balanced_tiered", "pricingStrategy": "mid", "timeTaken": 20},
        {"roundId": "bba_rd_4", "choiceId": "opt_transparent_security_pivot", "pricingStrategy": "mid", "timeTaken": 20},
        {"roundId": "bba_rd_5", "choiceId": "opt_strategic_angel_syndicate", "pricingStrategy": "mid", "timeTaken": 20}
    ]
    client.post("/api/arts-science/bba/game/submit", json={
        "studentId": student_id,
        "submissions": bba_game,
        "totalTime": 100
    })

    q_res = client.get("/api/arts-science/written-test/bba/questions")
    q_ids = [q["id"] for q in q_res.json()["questions"]]
    written_sub = [{"questionId": q_id, "selectedAnswer": "Revenue is the total gross income generated from sales, while Net Profit is what remains after deducting all operating expenses, taxes, and costs", "timeTaken": 5} for q_id in q_ids]
    client.post("/api/arts-science/written-test/bba/submit", json={
        "studentId": student_id,
        "answers": written_sub,
        "totalTime": 50
    })

    # Fetch recommendations
    rec_res = client.get(f"/api/recommend/arts-science/{student_id}")
    data = rec_res.json()

    bba_rec = next(c for c in data["allCourses"] if c["courseKey"] == "bba")
    ds_rec = next(c for c in data["allCourses"] if c["courseKey"] == "data-science")
    psy_rec = next(c for c in data["allCourses"] if c["courseKey"] == "psychology")

    assert bba_rec["isComplete"] is True
    assert bba_rec["finalCourseMatchScore"] is not None
    assert ds_rec["isComplete"] is False
    assert psy_rec["isComplete"] is False
    assert ds_rec["finalCourseMatchScore"] is None
    assert psy_rec["finalCourseMatchScore"] is None

def test_scenario_7_configurable_weightage_updates_calculation():
    """
    Scenario 7: Changing the configurable weightage must update the calculation correctly.
    E.g. Change to 60% game : 40% written.
    Score for Game 80, Written 60 = (80 * 0.6) + (60 * 0.4) = 48 + 24 = 72.0.
    """
    weight_config.reset_to_default()
    # Update to 60:40
    update_res = client.post("/api/pilot-validation/weights", json={
        "gameWeight": 0.60,
        "writtenWeight": 0.40
    })
    assert update_res.status_code == 200

    score = weight_config.calculate_course_match(80.0, 60.0)
    assert score == 72.0

    # Ensure validation prevents weights that do not sum to 1.0
    bad_res = client.post("/api/pilot-validation/weights", json={
        "gameWeight": 0.70,
        "writtenWeight": 0.20  # sum = 0.90
    })
    assert bad_res.status_code == 400

    # Reset back to default
    reset_res = client.post("/api/pilot-validation/weights/reset")
    assert reset_res.status_code == 200
    assert weight_config.game_weight == 0.75
    assert weight_config.written_weight == 0.25

def test_scenario_8_no_fabricated_pilot_validation_results():
    """
    Scenario 8: The system must not display fabricated pilot validation results.
    If no real data exists or with real data, metrics are strictly derived without synthetic fabrication.
    """
    metrics_res = client.get("/api/pilot-validation/metrics")
    assert metrics_res.status_code == 200
    m_data = metrics_res.json()

    assert "scientificDisclaimer" in m_data
    assert "No claims of predictive validity" in m_data["scientificDisclaimer"] or "Descriptive pilot statistics" in m_data["scientificDisclaimer"]
    assert "activeWeights" in m_data
    assert m_data["validationStatus"] in ["VALIDATION_NOT_YET_PERFORMED", "PRELIMINARY_OBSERVED_DATA"]

def test_scenario_9_recommendations_ordered_by_final_match_score():
    """
    Scenario 9: Completed recommendations must be correctly ordered descending by final match score.
    """
    student_id = f"test-order-{str(uuid.uuid4())[:8]}"

    # Setup 2 completed courses with different scores
    # Course 1: Journalism (High Score)
    j_game = [
        {"challengeId": "jrnl_ch_1", "selectedOptionId": "opt_verify_multi_source", "timeTaken": 20},
        {"challengeId": "jrnl_ch_2", "selectedOptionId": "opt_evidence_based_inquiry", "timeTaken": 20},
        {"challengeId": "jrnl_ch_3", "selectedOptionId": "opt_accurate_ethical_headline", "timeTaken": 20},
        {"challengeId": "jrnl_ch_4", "selectedOptionId": "opt_forensic_pipeline", "timeTaken": 20},
        {"challengeId": "jrnl_ch_5", "selectedOptionId": "opt_perfect_inverted_pyramid", "timeTaken": 20}
    ]
    client.post("/api/arts-science/journalism/submit", json={"studentId": student_id, "submissions": j_game, "totalTime": 100})
    
    q_res = client.get("/api/arts-science/written-test/journalism/questions")
    q_ids = [q["id"] for q in q_res.json()["questions"]]
    # All correct answers for Journalism
    from app.data.journalism_written_bank import JOURNALISM_WRITTEN_QUESTIONS
    ans_map = {q["id"]: q["correctAnswer"] for q in JOURNALISM_WRITTEN_QUESTIONS}
    j_written = [{"questionId": q_id, "selectedAnswer": ans_map[q_id], "timeTaken": 5} for q_id in q_ids]
    client.post("/api/arts-science/written-test/journalism/submit", json={"studentId": student_id, "answers": j_written, "totalTime": 50})

    # Course 2: Environmental Science (Moderate Score)
    env_game = [
        {"challengeId": "env_ch_1", "selectedOptionId": "opt_smoke_scrubbers", "timeTaken": 20},
        {"challengeId": "env_ch_2", "selectedOptionId": "opt_deep_borewell_drilling", "timeTaken": 20},
        {"challengeId": "env_ch_3", "selectedOptionId": "opt_landfill_expansion", "timeTaken": 20},
        {"challengeId": "env_ch_4", "selectedOptionId": "opt_chlorine_chemical_dosing", "timeTaken": 20},
        {"challengeId": "env_ch_5", "selectedOptionId": "opt_chemical_herbicide_clearing", "timeTaken": 20}
    ]
    client.post("/api/arts-science/environmental-science/submit", json={"studentId": student_id, "submissions": env_game, "totalTime": 100})

    q_res_env = client.get("/api/arts-science/written-test/environmental-science/questions")
    env_q_ids = [q["id"] for q in q_res_env.json()["questions"]]
    # Only 5 out of 10 correct
    from app.data.env_science_written_bank import ENV_SCIENCE_WRITTEN_QUESTIONS
    env_ans_map = {q["id"]: q["correctAnswer"] for q in ENV_SCIENCE_WRITTEN_QUESTIONS}
    env_written = [{"questionId": q_id, "selectedAnswer": env_ans_map[q_id] if i < 5 else "Wrong Option", "timeTaken": 5} for i, q_id in enumerate(env_q_ids)]
    client.post("/api/arts-science/written-test/environmental-science/submit", json={"studentId": student_id, "answers": env_written, "totalTime": 50})

    # Check recommendations ordering
    rec_res = client.get(f"/api/recommend/arts-science/{student_id}")
    data = rec_res.json()

    completed = data["completedRecommendations"]
    assert len(completed) >= 2

    # Check that scores are monotonically non-increasing
    scores = [c["finalCourseMatchScore"] for c in completed]
    for i in range(len(scores) - 1):
        assert scores[i] >= scores[i + 1], f"Recommendations not sorted descending: {scores}"

def test_scenario_10_existing_engineering_recommendations_continue_working():
    """
    Scenario 10: Existing Engineering recommendations must continue working as intended.
    """
    res = client.post("/api/recommend/final", json={"student_id": "student-demo-1"})
    assert res.status_code == 200
    data = res.json()

    assert "primary_recommendation" in data
    assert "top_courses" in data
    assert "top_careers" in data
    assert len(data["top_courses"]) > 0
    # Also verify that arts_science_recommendations is attached without interfering with existing payload
    assert "arts_science_recommendations" in data
