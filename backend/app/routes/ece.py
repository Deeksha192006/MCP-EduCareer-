import uuid
from datetime import datetime
from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, status
from app.schemas.ece import (
    ECERound1SubmitRequest,
    ECERound2SubmitRequest,
    ECEResultResponse,
    ECEAnalyticsResponse
)
from app.data.ece_quiz_bank import ECE_QUIZ_QUESTIONS
from app.database.mongodb import get_database

router = APIRouter(prefix="/engineering/ece", tags=["ECE Exploration Module"])

# Configurable Weights Object (as requested - NOT hardcoded throughout code)
ECE_CONFIG_WEIGHTS = {
    "game_weight": 0.60,
    "quiz_weight": 0.40
}

DEFAULT_ECE_LEVELS = [
    {
        "levelId": "ece_lvl_1",
        "levelName": "Level 1 — Basic Connection",
        "skillTested": "Circuit Reasoning",
        "difficulty": "easy",
        "score": 0.0,
        "accuracy": 0.0,
        "timeTaken": 0,
        "attempts": 0,
        "completed": False
    },
    {
        "levelId": "ece_lvl_2",
        "levelName": "Level 2 — Find the Fault",
        "skillTested": "Logical Thinking & Problem Solving",
        "difficulty": "medium",
        "score": 0.0,
        "accuracy": 0.0,
        "timeTaken": 0,
        "attempts": 0,
        "completed": False
    },
    {
        "levelId": "ece_lvl_3",
        "levelName": "Level 3 — Component Selection",
        "skillTested": "Problem Solving & Decision Making",
        "difficulty": "medium",
        "score": 0.0,
        "accuracy": 0.0,
        "timeTaken": 0,
        "attempts": 0,
        "completed": False
    },
    {
        "levelId": "ece_lvl_4",
        "levelName": "Level 4 — Signal Path Puzzle",
        "skillTested": "Signal Understanding & System Thinking",
        "difficulty": "hard",
        "score": 0.0,
        "accuracy": 0.0,
        "timeTaken": 0,
        "attempts": 0,
        "completed": False
    },
    {
        "levelId": "ece_lvl_5",
        "levelName": "Level 5 — Circuit Decision Challenge",
        "skillTested": "Circuit Reasoning & Decision Making",
        "difficulty": "hard",
        "score": 0.0,
        "accuracy": 0.0,
        "timeTaken": 0,
        "attempts": 0,
        "completed": False
    }
]

def calculate_game_skills(level_results: List[Dict[str, Any]]) -> Dict[str, float]:
    skills = {
        "circuitReasoning": 0.0,
        "logicalThinking": 0.0,
        "problemSolving": 0.0,
        "decisionMaking": 0.0,
        "signalUnderstanding": 0.0
    }
    lvl_map = {l["levelId"]: l for l in level_results if l.get("completed")}

    # L1: Basic Connection -> Circuit Reasoning (70%), Problem Solving (30%)
    l1 = lvl_map.get("ece_lvl_1")
    if l1:
        skills["circuitReasoning"] += l1["score"] * 0.7
        skills["problemSolving"] += l1["score"] * 0.3

    # L2: Find the Fault -> Logical Thinking (60%), Problem Solving (40%)
    l2 = lvl_map.get("ece_lvl_2")
    if l2:
        skills["logicalThinking"] += l2["score"] * 0.6
        skills["problemSolving"] += l2["score"] * 0.4

    # L3: Component Selection -> Problem Solving (50%), Decision Making (50%)
    l3 = lvl_map.get("ece_lvl_3")
    if l3:
        skills["problemSolving"] += l3["score"] * 0.5
        skills["decisionMaking"] += l3["score"] * 0.5

    # L4: Signal Path Puzzle -> Signal Understanding (80%), Logical Thinking (20%)
    l4 = lvl_map.get("ece_lvl_4")
    if l4:
        skills["signalUnderstanding"] += l4["score"] * 0.8
        skills["logicalThinking"] += l4["score"] * 0.2

    # L5: Circuit Decision Challenge -> Circuit Reasoning (50%), Decision Making (50%)
    l5 = lvl_map.get("ece_lvl_5")
    if l5:
        skills["circuitReasoning"] += l5["score"] * 0.5
        skills["decisionMaking"] += l5["score"] * 0.5

    return {k: round(min(100.0, max(0.0, v)), 1) for k, v in skills.items()}

@router.post("/start", response_model=Dict[str, Any])
def start_ece_assessment(req: Dict[str, str]):
    student_id = req.get("studentId")
    if not student_id:
        raise HTTPException(status_code=400, detail="studentId is required")

    db_inst = get_database()
    doc = None
    if db_inst.is_memory_fallback:
        doc = next((a for a in db_inst.memory_store.get("ece_assessments", []) if a.get("studentId") == student_id), None)
    else:
        doc = db_inst.db.ece_assessments.find_one({"studentId": student_id})

    if doc:
        doc["id"] = str(doc.get("_id", doc.get("id")))
        return doc

    new_doc = {
        "id": str(uuid.uuid4()),
        "studentId": student_id,
        "department": "ECE",
        "round1": {
            "gameScore": 0.0,
            "accuracy": 0.0,
            "totalTime": 0,
            "attempts": 0,
            "completed": False,
            "skillScores": {
                "circuitReasoning": 0.0,
                "logicalThinking": 0.0,
                "problemSolving": 0.0,
                "decisionMaking": 0.0,
                "signalUnderstanding": 0.0
            },
            "levelResults": [dict(l) for l in DEFAULT_ECE_LEVELS]
        },
        "round2": {
            "quizScore": 0.0,
            "correctAnswers": 0,
            "wrongAnswers": 0,
            "totalQuestions": 10,
            "completed": False,
            "topicScores": {
                "Basic Electronics": 0.0,
                "Digital Electronics": 0.0,
                "Circuits": 0.0,
                "Communication": 0.0,
                "Electronics Applications": 0.0
            },
            "answers": [],
            "totalTime": 0
        },
        "finalResult": {
            "explorationScore": 0.0,
            "compatibilityBand": "Needs Further Exploration",
            "skillProfile": {
                "circuitReasoning": 0.0,
                "logicalThinking": 0.0,
                "problemSolving": 0.0,
                "decisionMaking": 0.0,
                "signalUnderstanding": 0.0,
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
        db_inst.memory_store["ece_assessments"].append(new_doc)
    else:
        new_doc["_id"] = new_doc["id"]
        db_inst.db.ece_assessments.insert_one(new_doc)

    return new_doc

@router.post("/game/submit", response_model=Dict[str, Any])
def submit_ece_game(req: ECERound1SubmitRequest):
    db_inst = get_database()
    student_id = req.studentId

    doc = None
    if db_inst.is_memory_fallback:
        doc = next((a for a in db_inst.memory_store.get("ece_assessments", []) if a.get("studentId") == student_id), None)
    else:
        doc = db_inst.db.ece_assessments.find_one({"studentId": student_id})

    if not doc:
        start_ece_assessment({"studentId": student_id})
        if db_inst.is_memory_fallback:
            doc = next((a for a in db_inst.memory_store.get("ece_assessments", []) if a.get("studentId") == student_id), None)
        else:
            doc = db_inst.db.ece_assessments.find_one({"studentId": student_id})

    # Validate and record level results
    level_list = [l.dict() for l in req.levelResults]
    completed_levels = [l for l in level_list if l.get("completed")]
    
    if completed_levels:
        avg_score = round(sum(l.get("score", 0) for l in completed_levels) / len(completed_levels), 1)
        avg_acc = round(sum(l.get("accuracy", 0) for l in completed_levels) / len(completed_levels), 2)
        total_att = sum(l.get("attempts", 1) for l in completed_levels)
    else:
        avg_score = 0.0
        avg_acc = 0.0
        total_att = 0

    game_skills = calculate_game_skills(level_list)

    doc["round1"]["gameScore"] = avg_score
    doc["round1"]["accuracy"] = avg_acc
    doc["round1"]["totalTime"] = req.totalTime
    doc["round1"]["attempts"] = total_att
    doc["round1"]["skillScores"] = game_skills
    doc["round1"]["levelResults"] = level_list
    doc["round1"]["completed"] = True

    if db_inst.is_memory_fallback:
        idx = next((i for i, a in enumerate(db_inst.memory_store["ece_assessments"]) if a.get("studentId") == student_id), None)
        if idx is not None:
            db_inst.memory_store["ece_assessments"][idx] = doc
    else:
        db_inst.db.ece_assessments.replace_one({"studentId": student_id}, doc, upsert=True)

    return doc

@router.get("/quiz/questions")
def get_ece_quiz_questions():
    # Return questions without exposing correct answer for client security
    safe_questions = []
    for q in ECE_QUIZ_QUESTIONS:
        safe_questions.append({
            "id": q["id"],
            "topic": q["topic"],
            "question": q["question"],
            "options": q["options"],
            "difficulty": q["difficulty"]
        })
    return safe_questions

@router.post("/quiz/submit", response_model=Dict[str, Any])
def submit_ece_quiz(req: ECERound2SubmitRequest):
    db_inst = get_database()
    student_id = req.studentId

    doc = None
    if db_inst.is_memory_fallback:
        doc = next((a for a in db_inst.memory_store.get("ece_assessments", []) if a.get("studentId") == student_id), None)
    else:
        doc = db_inst.db.ece_assessments.find_one({"studentId": student_id})

    if not doc:
        start_ece_assessment({"studentId": student_id})
        if db_inst.is_memory_fallback:
            doc = next((a for a in db_inst.memory_store.get("ece_assessments", []) if a.get("studentId") == student_id), None)
        else:
            doc = db_inst.db.ece_assessments.find_one({"studentId": student_id})

    q_map = {q["id"]: q for q in ECE_QUIZ_QUESTIONS}
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

    quiz_score = round((correct_count / len(ECE_QUIZ_QUESTIONS)) * 100, 1)

    topic_scores = {}
    for top, tot in topic_total.items():
        corr = topic_correct.get(top, 0)
        topic_scores[top] = round((corr / tot) * 100, 1)

    doc["round2"]["quizScore"] = quiz_score
    doc["round2"]["correctAnswers"] = correct_count
    doc["round2"]["wrongAnswers"] = wrong_count
    doc["round2"]["totalQuestions"] = len(ECE_QUIZ_QUESTIONS)
    doc["round2"]["topicScores"] = topic_scores
    doc["round2"]["answers"] = processed_answers
    doc["round2"]["totalTime"] = req.totalTime
    doc["round2"]["completed"] = True

    if db_inst.is_memory_fallback:
        idx = next((i for i, a in enumerate(db_inst.memory_store["ece_assessments"]) if a.get("studentId") == student_id), None)
        if idx is not None:
            db_inst.memory_store["ece_assessments"][idx] = doc
    else:
        db_inst.db.ece_assessments.replace_one({"studentId": student_id}, doc, upsert=True)

    return doc

@router.post("/complete", response_model=Dict[str, Any])
def complete_ece_assessment(req: Dict[str, str]):
    student_id = req.get("studentId")
    if not student_id:
        raise HTTPException(status_code=400, detail="studentId is required")

    db_inst = get_database()
    doc = None
    if db_inst.is_memory_fallback:
        doc = next((a for a in db_inst.memory_store.get("ece_assessments", []) if a.get("studentId") == student_id), None)
    else:
        doc = db_inst.db.ece_assessments.find_one({"studentId": student_id})

    if not doc:
        raise HTTPException(status_code=404, detail="ECE Assessment not found for student")

    game_score = doc.get("round1", {}).get("gameScore", 0.0)
    quiz_score = doc.get("round2", {}).get("quizScore", 0.0)

    # Weighted Exploration Score formula: (Game Score x 0.60) + (Quiz Score x 0.40)
    final_score = round(
        (game_score * ECE_CONFIG_WEIGHTS["game_weight"]) + 
        (quiz_score * ECE_CONFIG_WEIGHTS["quiz_weight"]),
        1
    )

    # Determine Interpretation Band
    band = "Needs Further Exploration"
    if final_score >= 80.0:
        band = "Strong Skill Alignment"
    elif final_score >= 60.0:
        band = "Moderate Skill Alignment"
    elif final_score >= 40.0:
        band = "Developing Skill Alignment"

    r1_skills = doc.get("round1", {}).get("skillScores", {})
    skill_profile = {
        "circuitReasoning": r1_skills.get("circuitReasoning", 0.0),
        "logicalThinking": r1_skills.get("logicalThinking", 0.0),
        "problemSolving": r1_skills.get("problemSolving", 0.0),
        "decisionMaking": r1_skills.get("decisionMaking", 0.0),
        "signalUnderstanding": r1_skills.get("signalUnderstanding", 0.0),
        "technicalKnowledge": quiz_score
    }

    # Sort skills to derive Strengths and Improvement Areas
    sorted_skills = sorted(skill_profile.items(), key=lambda x: x[1], reverse=True)
    strengths = [s[0] for s in sorted_skills if s[1] >= 65.0][:3]
    if not strengths:
        strengths = [sorted_skills[0][0]]

    improvement_areas = [s[0] for s in sorted_skills if s[1] < 70.0]

    # Generate Learning Suggestions
    suggestion_map = {
        "circuitReasoning": "Practice simple breadboard circuit assembly and Ohm's Law problem solving.",
        "logicalThinking": "Solve binary logic gate puzzles and digital truth table exercises.",
        "problemSolving": "Work through schematic fault-diagnosis challenges and component selection tasks.",
        "decisionMaking": "Analyze trade-offs between series/parallel battery life and resistor power dissipation.",
        "signalUnderstanding": "Study basic AC waveforms, frequency modulation (FM/AM), and signal filtering concepts.",
        "technicalKnowledge": "Review 12th Standard Physics optics/electricity units and basic semiconductor diodes."
    }

    learning_suggestions = [suggestion_map[sk] for sk in improvement_areas if sk in suggestion_map]
    if not learning_suggestions:
        learning_suggestions = ["Explore advanced microcontrollers (Arduino/Raspberry Pi) and wireless IoT projects."]

    doc["finalResult"] = {
        "explorationScore": final_score,
        "compatibilityBand": band,
        "skillProfile": skill_profile,
        "strengths": strengths,
        "improvementAreas": improvement_areas,
        "learningSuggestions": learning_suggestions
    }
    doc["completedAt"] = datetime.utcnow().isoformat()

    # Save to ece_assessments & attach ece_exploration_data to student doc
    ece_data = {
        "ece_game_score": game_score,
        "ece_quiz_score": quiz_score,
        "ece_circuit_reasoning_score": skill_profile["circuitReasoning"],
        "ece_signal_score": skill_profile["signalUnderstanding"],
        "ece_technical_score": skill_profile["technicalKnowledge"],
        "ece_exploration_score": final_score,
        "completed_at": doc["completedAt"]
    }

    if db_inst.is_memory_fallback:
        idx = next((i for i, a in enumerate(db_inst.memory_store["ece_assessments"]) if a.get("studentId") == student_id), None)
        if idx is not None:
            db_inst.memory_store["ece_assessments"][idx] = doc

        st = next((s for s in db_inst.memory_store["students"] if str(s.get("id")) == student_id or str(s.get("_id")) == student_id), None)
        if st:
            st["ece_exploration_data"] = ece_data
    else:
        db_inst.db.ece_assessments.replace_one({"studentId": student_id}, doc, upsert=True)
        db_inst.db.students.update_one(
            {"_id": student_id},
            {"$set": {"ece_exploration_data": ece_data}},
            upsert=False
        )

    return doc

@router.get("/result/{student_id}", response_model=Dict[str, Any])
def get_ece_result(student_id: str):
    db_inst = get_database()
    doc = None
    if db_inst.is_memory_fallback:
        doc = next((a for a in db_inst.memory_store.get("ece_assessments", []) if a.get("studentId") == student_id), None)
    else:
        doc = db_inst.db.ece_assessments.find_one({"studentId": student_id})

    if not doc:
        start_ece_assessment({"studentId": student_id})
        if db_inst.is_memory_fallback:
            doc = next((a for a in db_inst.memory_store.get("ece_assessments", []) if a.get("studentId") == student_id), None)
        else:
            doc = db_inst.db.ece_assessments.find_one({"studentId": student_id})

    doc["id"] = str(doc.get("_id", doc.get("id")))
    return doc

@router.get("/analytics", response_model=ECEAnalyticsResponse)
def get_ece_analytics():
    db_inst = get_database()
    assessments = []

    if db_inst.is_memory_fallback:
        assessments = db_inst.memory_store.get("ece_assessments", [])
    else:
        assessments = list(db_inst.db.ece_assessments.find())

    completed = [a for a in assessments if a.get("completedAt") or a.get("round1", {}).get("completed")]
    total_count = len(completed)

    if total_count == 0:
        return {
            "totalCompletedAssessments": 0,
            "averageECEScore": 0.0,
            "averageGameScore": 0.0,
            "averageQuizScore": 0.0,
            "averageCircuitReasoning": 0.0,
            "averageLogicalThinking": 0.0,
            "averageProblemSolving": 0.0,
            "averageSignalUnderstanding": 0.0,
            "averageTechnicalKnowledge": 0.0,
            "averageCompletionTime": 0.0,
            "levelDifficultySummary": [],
            "quizTopicPerformanceSummary": []
        }

    avg_ece = round(sum(a.get("finalResult", {}).get("explorationScore", 0) for a in completed) / total_count, 1)
    avg_game = round(sum(a.get("round1", {}).get("gameScore", 0) for a in completed) / total_count, 1)
    avg_quiz = round(sum(a.get("round2", {}).get("quizScore", 0) for a in completed) / total_count, 1)

    avg_circuit = round(sum(a.get("finalResult", {}).get("skillProfile", {}).get("circuitReasoning", 0) for a in completed) / total_count, 1)
    avg_logical = round(sum(a.get("finalResult", {}).get("skillProfile", {}).get("logicalThinking", 0) for a in completed) / total_count, 1)
    avg_problem = round(sum(a.get("finalResult", {}).get("skillProfile", {}).get("problemSolving", 0) for a in completed) / total_count, 1)
    avg_signal = round(sum(a.get("finalResult", {}).get("skillProfile", {}).get("signalUnderstanding", 0) for a in completed) / total_count, 1)
    avg_tech = round(sum(a.get("finalResult", {}).get("skillProfile", {}).get("technicalKnowledge", 0) for a in completed) / total_count, 1)

    total_time_sum = sum(a.get("round1", {}).get("totalTime", 0) + a.get("round2", {}).get("totalTime", 0) for a in completed)
    avg_time = round(total_time_sum / total_count, 1)

    # Summarize per-level performance
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

    # Summarize quiz topic performance
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
        "averageECEScore": avg_ece,
        "averageGameScore": avg_game,
        "averageQuizScore": avg_quiz,
        "averageCircuitReasoning": avg_circuit,
        "averageLogicalThinking": avg_logical,
        "averageProblemSolving": avg_problem,
        "averageSignalUnderstanding": avg_signal,
        "averageTechnicalKnowledge": avg_tech,
        "averageCompletionTime": avg_time,
        "levelDifficultySummary": lvl_summary,
        "quizTopicPerformanceSummary": topic_summary
    }
