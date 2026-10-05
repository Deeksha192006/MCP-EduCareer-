import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.mech_ai_generator import (
    validate_mech_question,
    get_personalized_topics,
    calculate_adaptive_distribution,
    MECH_TOPICS
)

client = TestClient(app)

def test_question_validation():
    # Valid question
    valid_q = {
        "question": "A small gear with 10 teeth drives a larger gear with 20 teeth. How does the larger gear rotate?",
        "options": {
            "A": "Faster",
            "B": "Slower",
            "C": "At the same speed",
            "D": "It does not rotate"
        },
        "correctAnswer": "B",
        "explanation": "The larger gear rotates slower because it has more teeth.",
        "topic": "Gears and Gear Systems",
        "difficulty": "Easy"
    }
    assert validate_mech_question(valid_q) is True

    # Invalid question - missing option D
    invalid_q1 = valid_q.copy()
    invalid_q1["options"] = {"A": "Faster", "B": "Slower", "C": "Same"}
    assert validate_mech_question(invalid_q1) is False

    # Invalid question - duplicate options
    invalid_q2 = valid_q.copy()
    invalid_q2["options"] = {"A": "Slower", "B": "Slower", "C": "Same", "D": "Stop"}
    assert validate_mech_question(invalid_q2) is False

    # Invalid question - invalid topic
    invalid_q3 = valid_q.copy()
    invalid_q3["topic"] = "Quantum Mechanics"
    assert validate_mech_question(invalid_q3) is False

def test_personalization_and_adaptive_difficulty():
    # Adaptive distribution test
    dist_high = calculate_adaptive_distribution(85.0)
    assert dist_high["Hard"] == 4

    dist_low = calculate_adaptive_distribution(40.0)
    assert dist_low["Easy"] == 5

    dist_default = calculate_adaptive_distribution(65.0)
    assert dist_default["Medium"] == 5

    # Personalization test
    prev_perf = {"Gears and Gear Systems": 30.0, "Pulleys": 40.0}
    topics = get_personalized_topics(prev_perf)
    assert len(topics) == 10
    assert "Gears and Gear Systems" in topics
    assert "Pulleys" in topics

def test_mech_quiz_endpoints():
    # 1. Start quiz session
    res_start = client.post("/api/engineering/mech/quiz/start", json={"studentId": "test_student_123"})
    assert res_start.status_code == 200
    start_data = res_start.json()
    assert start_data["status"] == "success"
    assessment_id = start_data["assessmentId"]

    # 2. Generate questions (Check Security: correct answer must NOT be sent)
    res_gen = client.post("/api/engineering/mech/quiz/generate", json={
        "assessmentId": assessment_id,
        "studentId": "test_student_123"
    })
    assert res_gen.status_code == 200
    gen_data = res_gen.json()
    assert len(gen_data["questions"]) == 10

    first_q = gen_data["questions"][0]
    assert "correctAnswer" not in first_q
    assert "explanation" not in first_q
    assert "question" in first_q
    assert "options" in first_q

    # 3. Submit Game
    res_game = client.post("/api/engineering/mech/game/submit", json={
        "assessmentId": assessment_id,
        "studentId": "test_student_123",
        "totalTimeTaken": 120,
        "levelResults": [
            {"levelId": "mech_lvl_1", "accuracy": 80.0, "timeTakenSeconds": 20, "completed": True},
            {"levelId": "mech_lvl_2", "accuracy": 80.0, "timeTakenSeconds": 25, "completed": True},
            {"levelId": "mech_lvl_3", "accuracy": 80.0, "timeTakenSeconds": 25, "completed": True},
            {"levelId": "mech_lvl_4", "accuracy": 80.0, "timeTakenSeconds": 25, "completed": True},
            {"levelId": "mech_lvl_5", "accuracy": 80.0, "timeTakenSeconds": 25, "completed": True}
        ]
    })
    assert res_game.status_code == 200
    assert res_game.json()["gameScore"] == 80.0

    # 4. Submit Quiz answers
    answers = [{"questionId": q["id"], "selectedAnswer": "A"} for q in gen_data["questions"]]
    res_quiz = client.post("/api/engineering/mech/quiz/submit", json={
        "assessmentId": assessment_id,
        "studentId": "test_student_123",
        "timeTakenSeconds": 150,
        "answers": answers
    })
    assert res_quiz.status_code == 200
    quiz_data = res_quiz.json()
    assert "mcqScore" in quiz_data

    # 5. Complete Assessment and test 60/40 formula
    res_comp = client.post("/api/engineering/mech/complete", json={
        "assessmentId": assessment_id,
        "studentId": "test_student_123"
    })
    assert res_comp.status_code == 200
    comp_data = res_comp.json()["data"]
    exp_score = comp_data["mechExplorationScore"]
    g_score = comp_data["gameScore"]
    q_score = comp_data["mcqScore"]
    expected_score = round((g_score * 0.60) + (q_score * 0.40), 2)
    assert exp_score == expected_score

def test_admin_mech_endpoints():
    # 1. Get admin questions
    res = client.get("/api/admin/mech/questions")
    assert res.status_code == 200
    assert res.json()["status"] == "success"

    # 2. Get admin analytics
    res_analytics = client.get("/api/admin/mech/analytics")
    assert res_analytics.status_code == 200
    analytics = res_analytics.json()["analytics"]
    assert "totalMECHAssessments" in analytics
    assert "topicPerformance" in analytics
