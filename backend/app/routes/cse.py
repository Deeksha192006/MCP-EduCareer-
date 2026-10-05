import uuid
from datetime import datetime
from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, status
from app.schemas.cse import (
    CSEAssessmentStartRequest,
    CSEGameSubmitRequest,
    CSEAssessmentResponse,
    CSEAnalyticsResponse
)
from app.database.mongodb import get_database

router = APIRouter(prefix="/cse", tags=["CSE Exploration Module"])

DEFAULT_CSE_GAMES = [
    {
        "gameId": "cse_logic_01",
        "gameName": "Shortest Path Challenge",
        "skillTested": "Logical Thinking & Problem Solving",
        "score": 0.0,
        "maxScore": 100.0,
        "accuracy": 0.0,
        "timeTaken": 0,
        "attempts": 0,
        "difficulty": "medium",
        "completed": False
    },
    {
        "gameId": "cse_pattern_02",
        "gameName": "Odd One Out",
        "skillTested": "Pattern Recognition",
        "score": 0.0,
        "maxScore": 100.0,
        "accuracy": 0.0,
        "timeTaken": 0,
        "attempts": 0,
        "difficulty": "easy",
        "completed": False
    },
    {
        "gameId": "cse_code_03",
        "gameName": "Debug the Code",
        "skillTested": "Programming Logic",
        "score": 0.0,
        "maxScore": 100.0,
        "accuracy": 0.0,
        "timeTaken": 0,
        "attempts": 0,
        "difficulty": "hard",
        "completed": False
    },
    {
        "gameId": "cse_algo_04",
        "gameName": "Logic Sequence",
        "skillTested": "Algorithmic Thinking",
        "score": 0.0,
        "maxScore": 100.0,
        "accuracy": 0.0,
        "timeTaken": 0,
        "attempts": 0,
        "difficulty": "medium",
        "completed": False
    },
    {
        "gameId": "cse_puzzle_05",
        "gameName": "Algorithm Puzzle",
        "skillTested": "Problem Solving & Decision Making",
        "score": 0.0,
        "maxScore": 100.0,
        "accuracy": 0.0,
        "timeTaken": 0,
        "attempts": 0,
        "difficulty": "medium",
        "completed": False
    }
]

def recalculate_skills(game_perf_list: List[Dict[str, Any]]) -> Dict[str, float]:
    scores = {
        "logicalThinking": 0.0,
        "problemSolving": 0.0,
        "patternRecognition": 0.0,
        "algorithmicThinking": 0.0,
        "programmingLogic": 0.0,
        "decisionMaking": 0.0
    }
    game_dict = {g["gameId"]: g for g in game_perf_list if g.get("completed")}
    
    # cse_logic_01
    g1 = game_dict.get("cse_logic_01")
    if g1:
        scores["logicalThinking"] += g1["score"] * 0.6
        scores["problemSolving"] += g1["score"] * 0.4
    
    # cse_pattern_02
    g2 = game_dict.get("cse_pattern_02")
    if g2:
        scores["patternRecognition"] += g2["score"] * 0.8
        scores["decisionMaking"] += g2["score"] * 0.2

    # cse_code_03
    g3 = game_dict.get("cse_code_03")
    if g3:
        scores["programmingLogic"] += g3["score"] * 0.8
        scores["logicalThinking"] += g3["score"] * 0.2

    # cse_algo_04
    g4 = game_dict.get("cse_algo_04")
    if g4:
        scores["algorithmicThinking"] += g4["score"] * 0.8
        scores["patternRecognition"] += g4["score"] * 0.2

    # cse_puzzle_05
    g5 = game_dict.get("cse_puzzle_05")
    if g5:
        scores["problemSolving"] += g5["score"] * 0.6
        scores["decisionMaking"] += g5["score"] * 0.4

    # Clamp scores to 0 - 100 range and round
    return {k: round(min(100.0, max(0.0, v)), 1) for k, v in scores.items()}

def calculate_cse_compatibility(skills: Dict[str, float]) -> float:
    # Weighted calculation across 6 skill dimensions
    weights = {
        "logicalThinking": 0.20,
        "problemSolving": 0.20,
        "algorithmicThinking": 0.20,
        "programmingLogic": 0.20,
        "patternRecognition": 0.10,
        "decisionMaking": 0.10
    }
    total = sum(skills.get(k, 0.0) * w for k, w in weights.items())
    return round(min(100.0, max(0.0, total)), 1)

@router.post("/assessment/start", response_model=CSEAssessmentResponse)
def start_cse_assessment(req: CSEAssessmentStartRequest):
    db_inst = get_database()
    student_id = req.studentId

    # Look for existing assessment
    doc = None
    if db_inst.is_memory_fallback:
        doc = next((a for a in db_inst.memory_store.get("cse_assessments", []) if a.get("studentId") == student_id), None)
    else:
        doc = db_inst.db.cse_assessments.find_one({"studentId": student_id})

    if doc:
        doc["id"] = str(doc.get("_id", doc.get("id")))
        return doc

    # Create new document
    new_doc = {
        "id": str(uuid.uuid4()),
        "studentId": student_id,
        "department": "CSE",
        "assessmentId": f"cse_ass_{str(uuid.uuid4())[:8]}",
        "gamesAttempted": 0,
        "totalScore": 0.0,
        "skillScores": {
            "logicalThinking": 0.0,
            "problemSolving": 0.0,
            "patternRecognition": 0.0,
            "algorithmicThinking": 0.0,
            "programmingLogic": 0.0,
            "decisionMaking": 0.0
        },
        "gamePerformance": [dict(g) for g in DEFAULT_CSE_GAMES],
        "totalTime": 0,
        "cseCompatibilityScore": 0.0,
        "summary": "Assessment in progress. Complete games to generate skill breakdown.",
        "completedAt": None,
        "created_at": datetime.utcnow().isoformat()
    }

    if db_inst.is_memory_fallback:
        db_inst.memory_store["cse_assessments"].append(new_doc)
    else:
        new_doc["_id"] = new_doc["id"]
        db_inst.db.cse_assessments.insert_one(new_doc)

    return new_doc

@router.get("/assessment/{student_id}", response_model=CSEAssessmentResponse)
def get_cse_assessment(student_id: str):
    db_inst = get_database()
    doc = None
    if db_inst.is_memory_fallback:
        doc = next((a for a in db_inst.memory_store.get("cse_assessments", []) if a.get("studentId") == student_id), None)
    else:
        doc = db_inst.db.cse_assessments.find_one({"studentId": student_id})

    if not doc:
        # Return default initialized assessment session
        req = CSEAssessmentStartRequest(studentId=student_id)
        return start_cse_assessment(req)

    doc["id"] = str(doc.get("_id", doc.get("id")))
    return doc

@router.post("/assessment/submit-game", response_model=CSEAssessmentResponse)
def submit_game_performance(req: CSEGameSubmitRequest):
    db_inst = get_database()
    student_id = req.studentId

    doc = None
    if db_inst.is_memory_fallback:
        doc = next((a for a in db_inst.memory_store.get("cse_assessments", []) if a.get("studentId") == student_id), None)
    else:
        doc = db_inst.db.cse_assessments.find_one({"studentId": student_id})

    if not doc:
        # Start assessment first
        req_start = CSEAssessmentStartRequest(studentId=student_id)
        doc = start_cse_assessment(req_start)

    game_found = False
    for g in doc.get("gamePerformance", []):
        if g["gameId"] == req.gameId:
            g["score"] = req.score
            g["maxScore"] = req.maxScore
            g["accuracy"] = req.accuracy
            g["timeTaken"] = req.timeTaken
            g["attempts"] = req.attempts
            if req.difficulty:
                g["difficulty"] = req.difficulty
            g["completed"] = True
            game_found = True
            break

    if not game_found:
        doc.get("gamePerformance", []).append({
            "gameId": req.gameId,
            "gameName": f"Custom Game {req.gameId}",
            "skillTested": "Logical Thinking",
            "score": req.score,
            "maxScore": req.maxScore,
            "accuracy": req.accuracy,
            "timeTaken": req.timeTaken,
            "attempts": req.attempts,
            "difficulty": req.difficulty or "medium",
            "completed": True
        })

    # Update summary counts
    completed_games = [g for g in doc["gamePerformance"] if g.get("completed")]
    doc["gamesAttempted"] = len(completed_games)
    doc["totalTime"] = sum(g.get("timeTaken", 0) for g in completed_games)
    
    if completed_games:
        doc["totalScore"] = round(sum(g.get("score", 0) for g in completed_games) / len(completed_games), 1)

    # Recalculate skill scores
    doc["skillScores"] = recalculate_skills(doc["gamePerformance"])
    doc["cseCompatibilityScore"] = calculate_cse_compatibility(doc["skillScores"])

    if db_inst.is_memory_fallback:
        idx = next((i for i, a in enumerate(db_inst.memory_store["cse_assessments"]) if a.get("studentId") == student_id), None)
        if idx is not None:
            db_inst.memory_store["cse_assessments"][idx] = doc
    else:
        db_inst.db.cse_assessments.replace_one({"studentId": student_id}, doc, upsert=True)

    return doc

@router.post("/assessment/complete", response_model=CSEAssessmentResponse)
def complete_cse_assessment(req: CSEAssessmentStartRequest):
    db_inst = get_database()
    student_id = req.studentId

    doc = None
    if db_inst.is_memory_fallback:
        doc = next((a for a in db_inst.memory_store.get("cse_assessments", []) if a.get("studentId") == student_id), None)
    else:
        doc = db_inst.db.cse_assessments.find_one({"studentId": student_id})

    if not doc:
        raise HTTPException(status_code=404, detail="CSE Assessment not found for student")

    # Recalculate skill scores & compatibility
    doc["skillScores"] = recalculate_skills(doc.get("gamePerformance", []))
    score = calculate_cse_compatibility(doc["skillScores"])
    doc["cseCompatibilityScore"] = score
    doc["completedAt"] = datetime.utcnow().isoformat()
    doc["summary"] = f"Your performance shows a strong alignment with the skills assessed for Computer Science Engineering (Compatibility Score: {score}%)."

    # Save assessment doc
    if db_inst.is_memory_fallback:
        idx = next((i for i, a in enumerate(db_inst.memory_store["cse_assessments"]) if a.get("studentId") == student_id), None)
        if idx is not None:
            db_inst.memory_store["cse_assessments"][idx] = doc
        
        # Also attach cse_exploration_data to student doc in memory
        st = next((s for s in db_inst.memory_store["students"] if str(s.get("id")) == student_id or str(s.get("_id")) == student_id), None)
        if st:
            st["cse_exploration_data"] = {
                "compatibility_score": score,
                "skill_scores": doc["skillScores"],
                "completed_at": doc["completedAt"]
            }
    else:
        db_inst.db.cse_assessments.replace_one({"studentId": student_id}, doc, upsert=True)
        # Update matching student in Mongo
        db_inst.db.students.update_one(
            {"_id": student_id},
            {"$set": {
                "cse_exploration_data": {
                    "compatibility_score": score,
                    "skill_scores": doc["skillScores"],
                    "completed_at": doc["completedAt"]
                }
            }},
            upsert=False
        )

    return doc

@router.get("/analytics", response_model=CSEAnalyticsResponse)
def get_cse_analytics():
    db_inst = get_database()
    assessments = []

    if db_inst.is_memory_fallback:
        assessments = db_inst.memory_store.get("cse_assessments", [])
    else:
        assessments = list(db_inst.db.cse_assessments.find())

    completed = [a for a in assessments if a.get("completedAt") or a.get("gamesAttempted", 0) > 0]
    total_count = len(completed)

    if total_count == 0:
        return {
            "totalCompletedAssessments": 0,
            "averageCSEScore": 0.0,
            "averageLogicalThinking": 0.0,
            "averageProblemSolving": 0.0,
            "averagePatternRecognition": 0.0,
            "averageAlgorithmicThinking": 0.0,
            "averageProgrammingLogic": 0.0,
            "averageDecisionMaking": 0.0,
            "averageCompletionTime": 0.0,
            "gamePerformanceSummary": []
        }

    avg_cse_score = round(sum(a.get("cseCompatibilityScore", 0) for a in completed) / total_count, 1)
    avg_logical = round(sum(a.get("skillScores", {}).get("logicalThinking", 0) for a in completed) / total_count, 1)
    avg_problem = round(sum(a.get("skillScores", {}).get("problemSolving", 0) for a in completed) / total_count, 1)
    avg_pattern = round(sum(a.get("skillScores", {}).get("patternRecognition", 0) for a in completed) / total_count, 1)
    avg_algo = round(sum(a.get("skillScores", {}).get("algorithmicThinking", 0) for a in completed) / total_count, 1)
    avg_prog = round(sum(a.get("skillScores", {}).get("programmingLogic", 0) for a in completed) / total_count, 1)
    avg_decision = round(sum(a.get("skillScores", {}).get("decisionMaking", 0) for a in completed) / total_count, 1)
    avg_time = round(sum(a.get("totalTime", 0) for a in completed) / total_count, 1)

    # Summarize per game performance across assessments
    game_map = {}
    for a in completed:
        for g in a.get("gamePerformance", []):
            gid = g["gameId"]
            if gid not in game_map:
                game_map[gid] = {
                    "gameId": gid,
                    "gameName": g.get("gameName", gid),
                    "attemptsCount": 0,
                    "totalScoreSum": 0.0,
                    "totalTimeSum": 0
                }
            if g.get("completed"):
                game_map[gid]["attemptsCount"] += 1
                game_map[gid]["totalScoreSum"] += g.get("score", 0)
                game_map[gid]["totalTimeSum"] += g.get("timeTaken", 0)

    game_summary = []
    for gid, data in game_map.items():
        cnt = data["attemptsCount"] or 1
        game_summary.append({
            "gameId": gid,
            "gameName": data["gameName"],
            "totalAttempts": data["attemptsCount"],
            "averageScore": round(data["totalScoreSum"] / cnt, 1),
            "averageTimeTaken": round(data["totalTimeSum"] / cnt, 1)
        })

    return {
        "totalCompletedAssessments": total_count,
        "averageCSEScore": avg_cse_score,
        "averageLogicalThinking": avg_logical,
        "averageProblemSolving": avg_problem,
        "averagePatternRecognition": avg_pattern,
        "averageAlgorithmicThinking": avg_algo,
        "averageProgrammingLogic": avg_prog,
        "averageDecisionMaking": avg_decision,
        "averageCompletionTime": avg_time,
        "gamePerformanceSummary": game_summary
    }
