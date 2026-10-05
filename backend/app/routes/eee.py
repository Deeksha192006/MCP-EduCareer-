import uuid
from datetime import datetime
from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, status
from app.schemas.eee import (
    EEERound1SubmitRequest,
    EEERound2SubmitRequest,
    EEEResultResponse,
    EEEAnalyticsResponse
)
from app.data.eee_quiz_bank import EEE_QUIZ_QUESTIONS
from app.database.mongodb import get_database

router = APIRouter(prefix="/engineering/eee", tags=["EEE Exploration Module"])

# Configurable Weights Object (60% Game, 40% Quiz)
EEE_CONFIG_WEIGHTS = {
    "game_weight": 0.60,
    "quiz_weight": 0.40
}

DEFAULT_EEE_LEVELS = [
    {
        "levelId": "eee_lvl_1",
        "levelName": "Level 1 — Complete the Electrical Circuit",
        "skillTested": "Circuit Understanding",
        "difficulty": "easy",
        "score": 0.0,
        "accuracy": 0.0,
        "timeTaken": 0,
        "attempts": 0,
        "completed": False
    },
    {
        "levelId": "eee_lvl_2",
        "levelName": "Level 2 — Power Distribution",
        "skillTested": "Energy Management & Decision Making",
        "difficulty": "medium",
        "score": 0.0,
        "accuracy": 0.0,
        "timeTaken": 0,
        "attempts": 0,
        "completed": False
    },
    {
        "levelId": "eee_lvl_3",
        "levelName": "Level 3 — Find the Electrical Fault",
        "skillTested": "Electrical Troubleshooting",
        "difficulty": "medium",
        "score": 0.0,
        "accuracy": 0.0,
        "timeTaken": 0,
        "attempts": 0,
        "completed": False
    },
    {
        "levelId": "eee_lvl_4",
        "levelName": "Level 4 — Energy Optimization Challenge",
        "skillTested": "Energy Management & Optimization",
        "difficulty": "hard",
        "score": 0.0,
        "accuracy": 0.0,
        "timeTaken": 0,
        "attempts": 0,
        "completed": False
    },
    {
        "levelId": "eee_lvl_5",
        "levelName": "Level 5 — Electrical Flow Puzzle",
        "skillTested": "Logical Thinking & Circuit Reasoning",
        "difficulty": "hard",
        "score": 0.0,
        "accuracy": 0.0,
        "timeTaken": 0,
        "attempts": 0,
        "completed": False
    }
]

def calculate_eee_game_skills(level_results: List[Dict[str, Any]]) -> Dict[str, float]:
    skills = {
        "electricalReasoning": 0.0,
        "circuitUnderstanding": 0.0,
        "logicalThinking": 0.0,
        "problemSolving": 0.0,
        "energyManagement": 0.0,
        "decisionMaking": 0.0,
        "numericalReasoning": 0.0
    }
    lvl_map = {l["levelId"]: l for l in level_results if l.get("completed")}

    # L1: Circuit Completion -> Circuit Understanding (70%), Electrical Reasoning (30%)
    l1 = lvl_map.get("eee_lvl_1")
    if l1:
        skills["circuitUnderstanding"] += l1["score"] * 0.7
        skills["electricalReasoning"] += l1["score"] * 0.3

    # L2: Power Distribution -> Energy Management (50%), Decision Making (30%), Numerical Reasoning (20%)
    l2 = lvl_map.get("eee_lvl_2")
    if l2:
        skills["energyManagement"] += l2["score"] * 0.5
        skills["decisionMaking"] += l2["score"] * 0.3
        skills["numericalReasoning"] += l2["score"] * 0.2

    # L3: Find Fault -> Electrical Reasoning (50%), Problem Solving (50%)
    l3 = lvl_map.get("eee_lvl_3")
    if l3:
        skills["electricalReasoning"] += l3["score"] * 0.5
        skills["problemSolving"] += l3["score"] * 0.5

    # L4: Energy Optimization -> Energy Management (50%), Decision Making (30%), Numerical Reasoning (20%)
    l4 = lvl_map.get("eee_lvl_4")
    if l4:
        skills["energyManagement"] += l4["score"] * 0.5
        skills["decisionMaking"] += l4["score"] * 0.3
        skills["numericalReasoning"] += l4["score"] * 0.2

    # L5: Flow Puzzle -> Logical Thinking (60%), Circuit Understanding (20%), Problem Solving (20%)
    l5 = lvl_map.get("eee_lvl_5")
    if l5:
        skills["logicalThinking"] += l5["score"] * 0.6
        skills["circuitUnderstanding"] += l5["score"] * 0.2
        skills["problemSolving"] += l5["score"] * 0.2

    return {k: round(min(100.0, max(0.0, v)), 1) for k, v in skills.items()}

@router.post("/start", response_model=Dict[str, Any])
def start_eee_assessment(req: Dict[str, str]):
    student_id = req.get("studentId")
    if not student_id:
        raise HTTPException(status_code=400, detail="studentId is required")

    db_inst = get_database()
    doc = None
    if db_inst.is_memory_fallback:
        doc = next((a for a in db_inst.memory_store.get("eee_assessments", []) if a.get("studentId") == student_id), None)
    else:
        doc = db_inst.db.eee_assessments.find_one({"studentId": student_id})

    if doc:
        doc["id"] = str(doc.get("_id", doc.get("id")))
        return doc

    new_doc = {
        "id": str(uuid.uuid4()),
        "studentId": student_id,
        "department": "EEE",
        "round1": {
            "gameScore": 0.0,
            "accuracy": 0.0,
            "totalTime": 0,
            "attempts": 0,
            "completed": False,
            "skillScores": {
                "electricalReasoning": 0.0,
                "circuitUnderstanding": 0.0,
                "logicalThinking": 0.0,
                "problemSolving": 0.0,
                "energyManagement": 0.0,
                "decisionMaking": 0.0,
                "numericalReasoning": 0.0
            },
            "levelResults": [dict(l) for l in DEFAULT_EEE_LEVELS]
        },
        "round2": {
            "quizScore": 0.0,
            "correctAnswers": 0,
            "wrongAnswers": 0,
            "totalQuestions": 10,
            "completed": False,
            "topicScores": {
                "Basic Electrical Concepts": 0.0,
                "Electrical Circuits": 0.0,
                "Electronics Fundamentals": 0.0,
                "Digital Electronics": 0.0,
                "Electrical Machines and Energy": 0.0
            },
            "answers": [],
            "totalTime": 0
        },
        "finalResult": {
            "explorationScore": 0.0,
            "compatibilityBand": "Needs Further Exploration",
            "skillProfile": {
                "electricalReasoning": 0.0,
                "circuitUnderstanding": 0.0,
                "logicalThinking": 0.0,
                "problemSolving": 0.0,
                "energyManagement": 0.0,
                "decisionMaking": 0.0,
                "numericalReasoning": 0.0,
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
        if "eee_assessments" not in db_inst.memory_store:
            db_inst.memory_store["eee_assessments"] = []
        db_inst.memory_store["eee_assessments"].append(new_doc)
    else:
        new_doc["_id"] = new_doc["id"]
        db_inst.db.eee_assessments.insert_one(new_doc)

    return new_doc

@router.post("/game/submit", response_model=Dict[str, Any])
def submit_eee_game(req: EEERound1SubmitRequest):
    db_inst = get_database()
    student_id = req.studentId

    doc = None
    if db_inst.is_memory_fallback:
        doc = next((a for a in db_inst.memory_store.get("eee_assessments", []) if a.get("studentId") == student_id), None)
    else:
        doc = db_inst.db.eee_assessments.find_one({"studentId": student_id})

    if not doc:
        start_eee_assessment({"studentId": student_id})
        if db_inst.is_memory_fallback:
            doc = next((a for a in db_inst.memory_store.get("eee_assessments", []) if a.get("studentId") == student_id), None)
        else:
            doc = db_inst.db.eee_assessments.find_one({"studentId": student_id})

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

    game_skills = calculate_eee_game_skills(level_list)

    doc["round1"]["gameScore"] = avg_score
    doc["round1"]["accuracy"] = avg_acc
    doc["round1"]["totalTime"] = req.totalTime
    doc["round1"]["attempts"] = total_att
    doc["round1"]["skillScores"] = game_skills
    doc["round1"]["levelResults"] = level_list
    doc["round1"]["completed"] = True

    if db_inst.is_memory_fallback:
        idx = next((i for i, a in enumerate(db_inst.memory_store["eee_assessments"]) if a.get("studentId") == student_id), None)
        if idx is not None:
            db_inst.memory_store["eee_assessments"][idx] = doc
    else:
        db_inst.db.eee_assessments.replace_one({"studentId": student_id}, doc, upsert=True)

    return doc

@router.get("/quiz/questions")
def get_eee_quiz_questions():
    safe_questions = []
    for q in EEE_QUIZ_QUESTIONS:
        safe_questions.append({
            "id": q["id"],
            "topic": q["topic"],
            "question": q["question"],
            "options": q["options"],
            "difficulty": q["difficulty"]
        })
    return safe_questions

@router.post("/quiz/submit", response_model=Dict[str, Any])
def submit_eee_quiz(req: EEERound2SubmitRequest):
    db_inst = get_database()
    student_id = req.studentId

    doc = None
    if db_inst.is_memory_fallback:
        doc = next((a for a in db_inst.memory_store.get("eee_assessments", []) if a.get("studentId") == student_id), None)
    else:
        doc = db_inst.db.eee_assessments.find_one({"studentId": student_id})

    if not doc:
        start_eee_assessment({"studentId": student_id})
        if db_inst.is_memory_fallback:
            doc = next((a for a in db_inst.memory_store.get("eee_assessments", []) if a.get("studentId") == student_id), None)
        else:
            doc = db_inst.db.eee_assessments.find_one({"studentId": student_id})

    q_map = {q["id"]: q for q in EEE_QUIZ_QUESTIONS}
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

    quiz_score = round((correct_count / len(EEE_QUIZ_QUESTIONS)) * 100, 1)

    topic_scores = {}
    for top, tot in topic_total.items():
        corr = topic_correct.get(top, 0)
        topic_scores[top] = round((corr / tot) * 100, 1)

    doc["round2"]["quizScore"] = quiz_score
    doc["round2"]["correctAnswers"] = correct_count
    doc["round2"]["wrongAnswers"] = wrong_count
    doc["round2"]["totalQuestions"] = len(EEE_QUIZ_QUESTIONS)
    doc["round2"]["topicScores"] = topic_scores
    doc["round2"]["answers"] = processed_answers
    doc["round2"]["totalTime"] = req.totalTime
    doc["round2"]["completed"] = True

    if db_inst.is_memory_fallback:
        idx = next((i for i, a in enumerate(db_inst.memory_store["eee_assessments"]) if a.get("studentId") == student_id), None)
        if idx is not None:
            db_inst.memory_store["eee_assessments"][idx] = doc
    else:
        db_inst.db.eee_assessments.replace_one({"studentId": student_id}, doc, upsert=True)

    return doc

@router.post("/complete", response_model=Dict[str, Any])
def complete_eee_assessment(req: Dict[str, str]):
    student_id = req.get("studentId")
    if not student_id:
        raise HTTPException(status_code=400, detail="studentId is required")

    db_inst = get_database()
    doc = None
    if db_inst.is_memory_fallback:
        doc = next((a for a in db_inst.memory_store.get("eee_assessments", []) if a.get("studentId") == student_id), None)
    else:
        doc = db_inst.db.eee_assessments.find_one({"studentId": student_id})

    if not doc:
        raise HTTPException(status_code=404, detail="EEE Assessment not found for student")

    game_score = doc.get("round1", {}).get("gameScore", 0.0)
    quiz_score = doc.get("round2", {}).get("quizScore", 0.0)

    # Configurable formula: (Game Score x 0.60) + (Quiz Score x 0.40)
    final_score = round(
        (game_score * EEE_CONFIG_WEIGHTS["game_weight"]) + 
        (quiz_score * EEE_CONFIG_WEIGHTS["quiz_weight"]),
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
        "electricalReasoning": r1_skills.get("electricalReasoning", 0.0),
        "circuitUnderstanding": r1_skills.get("circuitUnderstanding", 0.0),
        "logicalThinking": r1_skills.get("logicalThinking", 0.0),
        "problemSolving": r1_skills.get("problemSolving", 0.0),
        "energyManagement": r1_skills.get("energyManagement", 0.0),
        "decisionMaking": r1_skills.get("decisionMaking", 0.0),
        "numericalReasoning": r1_skills.get("numericalReasoning", 0.0),
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
        "electricalReasoning": "Practice basic electrical physics relationships (Ohm's Law V=IR, Power P=VI).",
        "circuitUnderstanding": "Explore series and parallel circuit rules and resistor/capacitor network behavior.",
        "logicalThinking": "Practice binary logic gate exercises (AND, OR, NOT gates and truth tables).",
        "problemSolving": "Work through schematic fault diagnosis and circuit troubleshooting scenarios.",
        "energyManagement": "Learn power budget allocation, appliance wattage calculation, and energy storage principles.",
        "decisionMaking": "Analyze trade-offs in electrical component selection and load priority management.",
        "numericalReasoning": "Solve numerical problems involving current, voltage, resistance, and kilowatt-hours.",
        "technicalKnowledge": "Review 12th standard physics units on current electricity, magnetism, and electrical machines."
    }

    learning_suggestions = [suggestion_map[sk] for sk in improvement_areas if sk in suggestion_map]
    if not learning_suggestions:
        learning_suggestions = [
            "Practice basic circuit problems",
            "Learn voltage, current and resistance relationships",
            "Explore basic digital logic",
            "Try simple electrical projects",
            "Learn the basics of motors and transformers"
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
    eee_data = {
        "eee_game_score": game_score,
        "eee_quiz_score": quiz_score,
        "eee_electrical_reasoning_score": skill_profile["electricalReasoning"],
        "eee_circuit_score": skill_profile["circuitUnderstanding"],
        "eee_logical_score": skill_profile["logicalThinking"],
        "eee_problem_solving_score": skill_profile["problemSolving"],
        "eee_energy_management_score": skill_profile["energyManagement"],
        "eee_decision_score": skill_profile["decisionMaking"],
        "eee_numerical_score": skill_profile["numericalReasoning"],
        "eee_technical_score": skill_profile["technicalKnowledge"],
        "eee_exploration_score": final_score,
        "completed_at": doc["completedAt"]
    }

    if db_inst.is_memory_fallback:
        idx = next((i for i, a in enumerate(db_inst.memory_store.get("eee_assessments", [])) if a.get("studentId") == student_id), None)
        if idx is not None:
            db_inst.memory_store["eee_assessments"][idx] = doc

        st = next((s for s in db_inst.memory_store.get("students", []) if str(s.get("id")) == student_id or str(s.get("_id")) == student_id), None)
        if st:
            st["eee_exploration_data"] = eee_data
    else:
        db_inst.db.eee_assessments.replace_one({"studentId": student_id}, doc, upsert=True)
        db_inst.db.students.update_one(
            {"_id": student_id},
            {"$set": {"eee_exploration_data": eee_data}},
            upsert=False
        )

    return doc

@router.get("/result/{student_id}", response_model=Dict[str, Any])
def get_eee_result(student_id: str):
    db_inst = get_database()
    doc = None
    if db_inst.is_memory_fallback:
        doc = next((a for a in db_inst.memory_store.get("eee_assessments", []) if a.get("studentId") == student_id), None)
    else:
        doc = db_inst.db.eee_assessments.find_one({"studentId": student_id})

    if not doc:
        start_eee_assessment({"studentId": student_id})
        if db_inst.is_memory_fallback:
            doc = next((a for a in db_inst.memory_store.get("eee_assessments", []) if a.get("studentId") == student_id), None)
        else:
            doc = db_inst.db.eee_assessments.find_one({"studentId": student_id})

    doc["id"] = str(doc.get("_id", doc.get("id")))
    return doc

@router.get("/analytics", response_model=EEEAnalyticsResponse)
def get_eee_analytics():
    db_inst = get_database()
    assessments = []

    if db_inst.is_memory_fallback:
        assessments = db_inst.memory_store.get("eee_assessments", [])
    else:
        assessments = list(db_inst.db.eee_assessments.find())

    completed = [a for a in assessments if a.get("completedAt") or a.get("round1", {}).get("completed")]
    total_count = len(completed)

    if total_count == 0:
        return {
            "totalCompletedAssessments": 0,
            "averageEEEScore": 0.0,
            "averageGameScore": 0.0,
            "averageQuizScore": 0.0,
            "averageElectricalReasoning": 0.0,
            "averageCircuitUnderstanding": 0.0,
            "averageProblemSolving": 0.0,
            "averageEnergyManagement": 0.0,
            "averageTechnicalKnowledge": 0.0,
            "averageCompletionTime": 0.0,
            "levelDifficultySummary": [],
            "quizTopicPerformanceSummary": []
        }

    avg_eee = round(sum(a.get("finalResult", {}).get("explorationScore", 0) for a in completed) / total_count, 1)
    avg_game = round(sum(a.get("round1", {}).get("gameScore", 0) for a in completed) / total_count, 1)
    avg_quiz = round(sum(a.get("round2", {}).get("quizScore", 0) for a in completed) / total_count, 1)

    avg_elec = round(sum(a.get("finalResult", {}).get("skillProfile", {}).get("electricalReasoning", 0) for a in completed) / total_count, 1)
    avg_circuit = round(sum(a.get("finalResult", {}).get("skillProfile", {}).get("circuitUnderstanding", 0) for a in completed) / total_count, 1)
    avg_problem = round(sum(a.get("finalResult", {}).get("skillProfile", {}).get("problemSolving", 0) for a in completed) / total_count, 1)
    avg_energy = round(sum(a.get("finalResult", {}).get("skillProfile", {}).get("energyManagement", 0) for a in completed) / total_count, 1)
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
        "averageEEEScore": avg_eee,
        "averageGameScore": avg_game,
        "averageQuizScore": avg_quiz,
        "averageElectricalReasoning": avg_elec,
        "averageCircuitUnderstanding": avg_circuit,
        "averageProblemSolving": avg_problem,
        "averageEnergyManagement": avg_energy,
        "averageTechnicalKnowledge": avg_tech,
        "averageCompletionTime": avg_time,
        "levelDifficultySummary": lvl_summary,
        "quizTopicPerformanceSummary": topic_summary
    }

@router.get("/history/{student_id}")
def get_eee_history(student_id: str):
    db_inst = get_database()
    if db_inst.is_memory_fallback:
        hist = [a for a in db_inst.memory_store.get("eee_assessments", []) if a.get("studentId") == student_id]
    else:
        hist = list(db_inst.db.eee_assessments.find({"studentId": student_id}))

    for h in hist:
        if "_id" in h:
            h["id"] = str(h["_id"])
    return hist
