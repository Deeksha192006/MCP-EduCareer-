import uuid
from datetime import datetime
from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, status
from app.schemas.aids import (
    AIDSRound1SubmitRequest,
    AIDSRound2SubmitRequest,
    AIDSResultResponse,
    AIDSAnalyticsResponse
)
from app.data.aids_quiz_bank import AIDS_QUIZ_QUESTIONS
from app.database.mongodb import get_database

router = APIRouter(prefix="/engineering/aids", tags=["AIDS Exploration Module"])

# Configurable Weights Object (60% Game, 40% Quiz)
AIDS_CONFIG_WEIGHTS = {
    "game_weight": 0.60,
    "quiz_weight": 0.40
}

DEFAULT_AIDS_LEVELS = [
    {
        "levelId": "aids_lvl_1",
        "levelName": "Level 1 — Find the Pattern",
        "skillTested": "Pattern Recognition",
        "difficulty": "easy",
        "score": 0.0,
        "accuracy": 0.0,
        "timeTaken": 0,
        "attempts": 0,
        "completed": False
    },
    {
        "levelId": "aids_lvl_2",
        "levelName": "Level 2 — Data Detective",
        "skillTested": "Data Interpretation",
        "difficulty": "medium",
        "score": 0.0,
        "accuracy": 0.0,
        "timeTaken": 0,
        "attempts": 0,
        "completed": False
    },
    {
        "levelId": "aids_lvl_3",
        "levelName": "Level 3 — Find the Anomaly",
        "skillTested": "Anomaly Detection & Analytical Thinking",
        "difficulty": "medium",
        "score": 0.0,
        "accuracy": 0.0,
        "timeTaken": 0,
        "attempts": 0,
        "completed": False
    },
    {
        "levelId": "aids_lvl_4",
        "levelName": "Level 4 — Prediction Challenge",
        "skillTested": "Prediction Ability",
        "difficulty": "medium",
        "score": 0.0,
        "accuracy": 0.0,
        "timeTaken": 0,
        "attempts": 0,
        "completed": False
    },
    {
        "levelId": "aids_lvl_5",
        "levelName": "Level 5 — Data Decision Challenge",
        "skillTested": "Analytical Thinking & Decision Making",
        "difficulty": "hard",
        "score": 0.0,
        "accuracy": 0.0,
        "timeTaken": 0,
        "attempts": 0,
        "completed": False
    },
    {
        "levelId": "aids_lvl_6",
        "levelName": "Level 6 — Correlation Thinking",
        "skillTested": "Analytical Reasoning",
        "difficulty": "hard",
        "score": 0.0,
        "accuracy": 0.0,
        "timeTaken": 0,
        "attempts": 0,
        "completed": False
    }
]

def calculate_aids_game_skills(level_results: List[Dict[str, Any]]) -> Dict[str, float]:
    skills = {
        "dataInterpretation": 0.0,
        "patternRecognition": 0.0,
        "analyticalThinking": 0.0,
        "logicalReasoning": 0.0,
        "predictionAbility": 0.0,
        "problemSolving": 0.0,
        "decisionMaking": 0.0
    }
    lvl_map = {l["levelId"]: l for l in level_results if l.get("completed")}

    # L1: Find Pattern -> Pattern Recognition (70%), Logical Reasoning (30%)
    l1 = lvl_map.get("aids_lvl_1")
    if l1:
        skills["patternRecognition"] += l1["score"] * 0.7
        skills["logicalReasoning"] += l1["score"] * 0.3

    # L2: Data Detective -> Data Interpretation (60%), Problem Solving (40%)
    l2 = lvl_map.get("aids_lvl_2")
    if l2:
        skills["dataInterpretation"] += l2["score"] * 0.6
        skills["problemSolving"] += l2["score"] * 0.4

    # L3: Find Anomaly -> Pattern Recognition (30%), Analytical Thinking (30%), Problem Solving (40%)
    l3 = lvl_map.get("aids_lvl_3")
    if l3:
        skills["patternRecognition"] += l3["score"] * 0.3
        skills["analyticalThinking"] += l3["score"] * 0.3
        skills["problemSolving"] += l3["score"] * 0.4

    # L4: Prediction Challenge -> Prediction Ability (70%), Logical Reasoning (30%)
    l4 = lvl_map.get("aids_lvl_4")
    if l4:
        skills["predictionAbility"] += l4["score"] * 0.7
        skills["logicalReasoning"] += l4["score"] * 0.3

    # L5: Data Decision Challenge -> Decision Making (70%), Analytical Thinking (30%)
    l5 = lvl_map.get("aids_lvl_5")
    if l5:
        skills["decisionMaking"] += l5["score"] * 0.7
        skills["analyticalThinking"] += l5["score"] * 0.3

    # L6: Correlation Thinking -> Analytical Thinking (40%), Data Interpretation (30%), Logical Reasoning (30%)
    l6 = lvl_map.get("aids_lvl_6")
    if l6:
        skills["analyticalThinking"] += l6["score"] * 0.4
        skills["dataInterpretation"] += l6["score"] * 0.3
        skills["logicalReasoning"] += l6["score"] * 0.3

    return {k: round(min(100.0, max(0.0, v)), 1) for k, v in skills.items()}

@router.post("/start", response_model=Dict[str, Any])
def start_aids_assessment(req: Dict[str, str]):
    student_id = req.get("studentId")
    if not student_id:
        raise HTTPException(status_code=400, detail="studentId is required")

    db_inst = get_database()
    doc = None
    if db_inst.is_memory_fallback:
        doc = next((a for a in db_inst.memory_store.get("aids_assessments", []) if a.get("studentId") == student_id), None)
    else:
        doc = db_inst.db.aids_assessments.find_one({"studentId": student_id})

    if doc:
        doc["id"] = str(doc.get("_id", doc.get("id")))
        return doc

    new_doc = {
        "id": str(uuid.uuid4()),
        "studentId": student_id,
        "department": "AIDS",
        "round1": {
            "gameScore": 0.0,
            "accuracy": 0.0,
            "totalTime": 0,
            "attempts": 0,
            "completed": False,
            "skillScores": {
                "dataInterpretation": 0.0,
                "patternRecognition": 0.0,
                "analyticalThinking": 0.0,
                "logicalReasoning": 0.0,
                "predictionAbility": 0.0,
                "problemSolving": 0.0,
                "decisionMaking": 0.0
            },
            "levelResults": [dict(l) for l in DEFAULT_AIDS_LEVELS]
        },
        "round2": {
            "quizScore": 0.0,
            "correctAnswers": 0,
            "wrongAnswers": 0,
            "totalQuestions": 10,
            "completed": False,
            "topicScores": {
                "Artificial Intelligence Basics": 0.0,
                "Machine Learning Basics": 0.0,
                "Data Science": 0.0,
                "Statistics & Probability": 0.0,
                "Data Visualization": 0.0,
                "Business Analytics": 0.0
            },
            "answers": [],
            "totalTime": 0
        },
        "finalResult": {
            "explorationScore": 0.0,
            "compatibilityBand": "Needs Further Exploration",
            "skillProfile": {
                "dataInterpretation": 0.0,
                "patternRecognition": 0.0,
                "analyticalThinking": 0.0,
                "logicalReasoning": 0.0,
                "predictionAbility": 0.0,
                "problemSolving": 0.0,
                "decisionMaking": 0.0,
                "technicalKnowledge": 0.0
            },
            "strengths": [],
            "improvementAreas": [],
            "learningSuggestions": []
        },
        "completedAt": None,
        "created_at": datetime.utcnow().isoformat()
    }

    if db_inst.is_memory_fallback:
        if "aids_assessments" not in db_inst.memory_store:
            db_inst.memory_store["aids_assessments"] = []
        db_inst.memory_store["aids_assessments"].append(new_doc)
    else:
        new_doc["_id"] = new_doc["id"]
        db_inst.db.aids_assessments.insert_one(new_doc)

    return new_doc

@router.post("/game/submit", response_model=Dict[str, Any])
def submit_aids_game(req: AIDSRound1SubmitRequest):
    db_inst = get_database()
    student_id = req.studentId

    doc = None
    if db_inst.is_memory_fallback:
        doc = next((a for a in db_inst.memory_store.get("aids_assessments", []) if a.get("studentId") == student_id), None)
    else:
        doc = db_inst.db.aids_assessments.find_one({"studentId": student_id})

    if not doc:
        start_aids_assessment({"studentId": student_id})
        if db_inst.is_memory_fallback:
            doc = next((a for a in db_inst.memory_store.get("aids_assessments", []) if a.get("studentId") == student_id), None)
        else:
            doc = db_inst.db.aids_assessments.find_one({"studentId": student_id})

    level_list = [l.model_dump() if hasattr(l, 'model_dump') else l.dict() for l in req.levelResults]
    completed_levels = [l for l in level_list if l.get("completed")]
    
    if completed_levels:
        avg_score = round(sum(l.get("score", 0) for l in completed_levels) / len(completed_levels), 1)
        avg_acc = round(sum(l.get("accuracy", 0) for l in completed_levels) / len(completed_levels), 2)
        total_att = sum(l.get("attempts", 1) for l in completed_levels)
    else:
        avg_score = 0.0
        avg_acc = 0.0
        total_att = 0

    game_skills = calculate_aids_game_skills(level_list)

    doc["round1"]["gameScore"] = avg_score
    doc["round1"]["accuracy"] = avg_acc
    doc["round1"]["totalTime"] = req.totalTime
    doc["round1"]["attempts"] = total_att
    doc["round1"]["skillScores"] = game_skills
    doc["round1"]["levelResults"] = level_list
    doc["round1"]["completed"] = True

    if db_inst.is_memory_fallback:
        idx = next((i for i, a in enumerate(db_inst.memory_store["aids_assessments"]) if a.get("studentId") == student_id), None)
        if idx is not None:
            db_inst.memory_store["aids_assessments"][idx] = doc
    else:
        db_inst.db.aids_assessments.replace_one({"studentId": student_id}, doc, upsert=True)

    return doc

@router.get("/quiz/questions")
def get_aids_quiz_questions():
    safe_questions = []
    for q in AIDS_QUIZ_QUESTIONS:
        safe_questions.append({
            "id": q["id"],
            "topic": q["topic"],
            "question": q["question"],
            "options": q["options"],
            "difficulty": q["difficulty"]
        })
    return safe_questions

@router.post("/quiz/submit", response_model=Dict[str, Any])
def submit_aids_quiz(req: AIDSRound2SubmitRequest):
    db_inst = get_database()
    student_id = req.studentId

    doc = None
    if db_inst.is_memory_fallback:
        doc = next((a for a in db_inst.memory_store.get("aids_assessments", []) if a.get("studentId") == student_id), None)
    else:
        doc = db_inst.db.aids_assessments.find_one({"studentId": student_id})

    if not doc:
        start_aids_assessment({"studentId": student_id})
        if db_inst.is_memory_fallback:
            doc = next((a for a in db_inst.memory_store.get("aids_assessments", []) if a.get("studentId") == student_id), None)
        else:
            doc = db_inst.db.aids_assessments.find_one({"studentId": student_id})

    q_map = {q["id"]: q for q in AIDS_QUIZ_QUESTIONS}
    correct_count = 0
    wrong_count = 0
    topic_correct = {}
    topic_total = {}

    processed_answers = []
    for ans in req.answers:
        q_info = q_map.get(ans.questionId)
        if not q_info:
            continue
        
        is_corr = (ans.selectedAnswer == q_info["correctAnswer"])
        if is_corr:
            correct_count += 1
        else:
            wrong_count += 1

        topic = q_info["topic"]
        topic_total[topic] = topic_total.get(topic, 0) + 1
        if is_corr:
            topic_correct[topic] = topic_correct.get(topic, 0) + 1

        processed_answers.append({
            "questionId": ans.questionId,
            "topic": topic,
            "selectedAnswer": ans.selectedAnswer,
            "correctAnswer": q_info["correctAnswer"],
            "isCorrect": is_corr,
            "timeTaken": ans.timeTaken
        })

    quiz_score = round((correct_count / len(AIDS_QUIZ_QUESTIONS)) * 100, 1)

    topic_scores = {}
    for top, tot in topic_total.items():
        corr = topic_correct.get(top, 0)
        topic_scores[top] = round((corr / tot) * 100, 1)

    doc["round2"]["quizScore"] = quiz_score
    doc["round2"]["correctAnswers"] = correct_count
    doc["round2"]["wrongAnswers"] = wrong_count
    doc["round2"]["totalQuestions"] = len(AIDS_QUIZ_QUESTIONS)
    doc["round2"]["topicScores"] = topic_scores
    doc["round2"]["answers"] = processed_answers
    doc["round2"]["totalTime"] = req.totalTime
    doc["round2"]["completed"] = True

    if db_inst.is_memory_fallback:
        idx = next((i for i, a in enumerate(db_inst.memory_store["aids_assessments"]) if a.get("studentId") == student_id), None)
        if idx is not None:
            db_inst.memory_store["aids_assessments"][idx] = doc
    else:
        db_inst.db.aids_assessments.replace_one({"studentId": student_id}, doc, upsert=True)

    return doc

@router.post("/complete", response_model=Dict[str, Any])
def complete_aids_assessment(req: Dict[str, str]):
    student_id = req.get("studentId")
    if not student_id:
        raise HTTPException(status_code=400, detail="studentId is required")

    db_inst = get_database()
    doc = None
    if db_inst.is_memory_fallback:
        doc = next((a for a in db_inst.memory_store.get("aids_assessments", []) if a.get("studentId") == student_id), None)
    else:
        doc = db_inst.db.aids_assessments.find_one({"studentId": student_id})

    if not doc:
        raise HTTPException(status_code=404, detail="AIDS Assessment not found for student")

    game_score = doc.get("round1", {}).get("gameScore", 0.0)
    quiz_score = doc.get("round2", {}).get("quizScore", 0.0)

    # Configurable formula: (Game Score x 0.60) + (Quiz Score x 0.40)
    final_score = round(
        (game_score * AIDS_CONFIG_WEIGHTS["game_weight"]) + 
        (quiz_score * AIDS_CONFIG_WEIGHTS["quiz_weight"]),
        1
    )

    # Interpretation bands
    band = "Needs Further Exploration"
    if final_score >= 80.0:
        band = "Strong Skill Alignment"
    elif final_score >= 60.0:
        band = "Moderate Skill Alignment"
    elif final_score >= 40.0:
        band = "Developing Skill Alignment"

    r1_skills = doc.get("round1", {}).get("skillScores", {})
    skill_profile = {
        "dataInterpretation": r1_skills.get("dataInterpretation", 0.0),
        "patternRecognition": r1_skills.get("patternRecognition", 0.0),
        "analyticalThinking": r1_skills.get("analyticalThinking", 0.0),
        "logicalReasoning": r1_skills.get("logicalReasoning", 0.0),
        "predictionAbility": r1_skills.get("predictionAbility", 0.0),
        "problemSolving": r1_skills.get("problemSolving", 0.0),
        "decisionMaking": r1_skills.get("decisionMaking", 0.0),
        "technicalKnowledge": quiz_score
    }

    # Derive Strengths & Improvement Areas
    sorted_skills = sorted(skill_profile.items(), key=lambda x: x[1], reverse=True)
    strengths = [s[0] for s in sorted_skills if s[1] >= 65.0][:3]
    if not strengths:
        strengths = [sorted_skills[0][0]]

    improvement_areas = [s[0] for s in sorted_skills if s[1] < 70.0]

    # Personalized Learning Suggestions
    suggestion_map = {
        "dataInterpretation": "Practice interpreting data tables, bar charts, and scatter plots.",
        "patternRecognition": "Work through numerical sequence patterns and visual trend exercises.",
        "analyticalThinking": "Practice multi-variable data reasoning and business KPI analysis.",
        "logicalReasoning": "Solve logic puzzles and conditional decision-tree scenarios.",
        "predictionAbility": "Explore basic linear trend extrapolation and predictive modeling principles.",
        "problemSolving": "Work through anomaly detection exercises in noisy tabular datasets.",
        "decisionMaking": "Analyze trade-offs in data-driven product investment and business analytics.",
        "technicalKnowledge": "Explore introductory machine learning (supervised vs unsupervised) and basic statistics."
    }

    learning_suggestions = [suggestion_map[sk] for sk in improvement_areas if sk in suggestion_map]
    if not learning_suggestions:
        learning_suggestions = [
            "Practice data interpretation",
            "Learn basic statistics",
            "Explore simple machine-learning concepts",
            "Practice reading charts and graphs",
            "Try small data-analysis projects"
        ]

    doc["finalResult"] = {
        "explorationScore": final_score,
        "compatibilityBand": band,
        "skillProfile": skill_profile,
        "strengths": strengths,
        "improvementAreas": improvement_areas,
        "learningSuggestions": learning_suggestions
    }
    doc["completedAt"] = datetime.utcnow().isoformat()

    # Store features for recommendation engine integration
    aids_data = {
        "aids_game_score": game_score,
        "aids_quiz_score": quiz_score,
        "aids_data_interpretation_score": skill_profile["dataInterpretation"],
        "aids_pattern_score": skill_profile["patternRecognition"],
        "aids_analytical_score": skill_profile["analyticalThinking"],
        "aids_logical_score": skill_profile["logicalReasoning"],
        "aids_prediction_score": skill_profile["predictionAbility"],
        "aids_problem_solving_score": skill_profile["problemSolving"],
        "aids_decision_score": skill_profile["decisionMaking"],
        "aids_technical_score": skill_profile["technicalKnowledge"],
        "aids_exploration_score": final_score,
        "completed_at": doc["completedAt"]
    }

    if db_inst.is_memory_fallback:
        idx = next((i for i, a in enumerate(db_inst.memory_store.get("aids_assessments", [])) if a.get("studentId") == student_id), None)
        if idx is not None:
            db_inst.memory_store["aids_assessments"][idx] = doc

        st = next((s for s in db_inst.memory_store.get("students", []) if str(s.get("id")) == student_id or str(s.get("_id")) == student_id), None)
        if st:
            st["aids_exploration_data"] = aids_data
    else:
        db_inst.db.aids_assessments.replace_one({"studentId": student_id}, doc, upsert=True)
        db_inst.db.students.update_one(
            {"_id": student_id},
            {"$set": {"aids_exploration_data": aids_data}},
            upsert=False
        )

    return doc

@router.get("/result/{student_id}", response_model=Dict[str, Any])
def get_aids_result(student_id: str):
    db_inst = get_database()
    doc = None
    if db_inst.is_memory_fallback:
        doc = next((a for a in db_inst.memory_store.get("aids_assessments", []) if a.get("studentId") == student_id), None)
    else:
        doc = db_inst.db.aids_assessments.find_one({"studentId": student_id})

    if not doc:
        start_aids_assessment({"studentId": student_id})
        if db_inst.is_memory_fallback:
            doc = next((a for a in db_inst.memory_store.get("aids_assessments", []) if a.get("studentId") == student_id), None)
        else:
            doc = db_inst.db.aids_assessments.find_one({"studentId": student_id})

    doc["id"] = str(doc.get("_id", doc.get("id")))
    return doc

@router.get("/analytics", response_model=AIDSAnalyticsResponse)
def get_aids_analytics():
    db_inst = get_database()
    assessments = []

    if db_inst.is_memory_fallback:
        assessments = db_inst.memory_store.get("aids_assessments", [])
    else:
        assessments = list(db_inst.db.aids_assessments.find())

    completed = [a for a in assessments if a.get("completedAt") or a.get("round1", {}).get("completed")]
    total_count = len(completed)

    if total_count == 0:
        return {
            "totalCompletedAssessments": 0,
            "averageAIDSScore": 0.0,
            "averageGameScore": 0.0,
            "averageQuizScore": 0.0,
            "averageDataInterpretation": 0.0,
            "averagePatternRecognition": 0.0,
            "averageAnalyticalThinking": 0.0,
            "averagePredictionScore": 0.0,
            "averageTechnicalKnowledge": 0.0,
            "averageCompletionTime": 0.0,
            "levelDifficultySummary": [],
            "quizTopicPerformanceSummary": []
        }

    avg_aids = round(sum(a.get("finalResult", {}).get("explorationScore", 0) for a in completed) / total_count, 1)
    avg_game = round(sum(a.get("round1", {}).get("gameScore", 0) for a in completed) / total_count, 1)
    avg_quiz = round(sum(a.get("round2", {}).get("quizScore", 0) for a in completed) / total_count, 1)

    avg_interp = round(sum(a.get("finalResult", {}).get("skillProfile", {}).get("dataInterpretation", 0) for a in completed) / total_count, 1)
    avg_pattern = round(sum(a.get("finalResult", {}).get("skillProfile", {}).get("patternRecognition", 0) for a in completed) / total_count, 1)
    avg_analytical = round(sum(a.get("finalResult", {}).get("skillProfile", {}).get("analyticalThinking", 0) for a in completed) / total_count, 1)
    avg_prediction = round(sum(a.get("finalResult", {}).get("skillProfile", {}).get("predictionAbility", 0) for a in completed) / total_count, 1)
    avg_tech = round(sum(a.get("finalResult", {}).get("skillProfile", {}).get("technicalKnowledge", 0) for a in completed) / total_count, 1)

    total_time_sum = sum(a.get("round1", {}).get("totalTime", 0) + a.get("round2", {}).get("totalTime", 0) for a in completed)
    avg_time = round(total_time_sum / total_count, 1)

    lvl_map = {}
    for a in completed:
        for l in a.get("round1", {}).get("levelResults", []):
            lid = l["levelId"]
            if lid not in lvl_map:
                lvl_map[lid] = {"levelId": lid, "levelName": l.get("levelName", lid), "scoreSum": 0.0, "count": 0}
            if l.get("completed"):
                lvl_map[lid]["scoreSum"] += l.get("score", 0)
                lvl_map[lid]["count"] += 1

    lvl_summary = []
    for lid, data in lvl_map.items():
        cnt = data["count"] or 1
        lvl_summary.append({
            "levelId": lid,
            "levelName": data["levelName"],
            "averageScore": round(data["scoreSum"] / cnt, 1)
        })

    topic_map = {}
    for a in completed:
        for top, score in a.get("round2", {}).get("topicScores", {}).items():
            if top not in topic_map:
                topic_map[top] = {"topic": top, "scoreSum": 0.0, "count": 0}
            topic_map[top]["scoreSum"] += score
            topic_map[top]["count"] += 1

    topic_summary = []
    for top, data in topic_map.items():
        cnt = data["count"] or 1
        topic_summary.append({
            "topic": top,
            "averageScore": round(data["scoreSum"] / cnt, 1)
        })

    return {
        "totalCompletedAssessments": total_count,
        "averageAIDSScore": avg_aids,
        "averageGameScore": avg_game,
        "averageQuizScore": avg_quiz,
        "averageDataInterpretation": avg_interp,
        "averagePatternRecognition": avg_pattern,
        "averageAnalyticalThinking": avg_analytical,
        "averagePredictionScore": avg_prediction,
        "averageTechnicalKnowledge": avg_tech,
        "averageCompletionTime": avg_time,
        "levelDifficultySummary": lvl_summary,
        "quizTopicPerformanceSummary": topic_summary
    }

@router.get("/history/{student_id}")
def get_aids_history(student_id: str):
    db_inst = get_database()
    if db_inst.is_memory_fallback:
        hist = [a for a in db_inst.memory_store.get("aids_assessments", []) if a.get("studentId") == student_id]
    else:
        hist = list(db_inst.db.aids_assessments.find({"studentId": student_id}))

    for h in hist:
        if "_id" in h:
            h["id"] = str(h["_id"])
    return hist
