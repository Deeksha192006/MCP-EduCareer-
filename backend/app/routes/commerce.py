import uuid
import logging
from datetime import datetime
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from app.data.commerce_scenarios import (
    COMMERCE_GAMES_CATALOG,
    evaluate_commerce_game_submission
)
from app.database.mongodb import get_database

logger = logging.getLogger("uvicorn.error")

router = APIRouter(prefix="/commerce", tags=["Commerce & Accounting — Simulation Games"])

# Request / Response Schemas
class LevelSubmissionItem(BaseModel):
    level: int
    selectedOptionId: Optional[str] = None

class CommerceGameSubmitRequest(BaseModel):
    studentId: str
    gameKey: str
    submissions: List[LevelSubmissionItem]
    totalTime: int = 0

class StartCommerceGameRequest(BaseModel):
    studentId: str
    gameKey: str


@router.get("/{game_key}/levels")
def get_commerce_game_levels(game_key: str):
    """
    Returns sanitized level metadata and challenges for the requested Commerce game.
    Correct option IDs and internal explanations are scrubbed for client-side security.
    """
    game_config = COMMERCE_GAMES_CATALOG.get(game_key)
    if not game_config:
        raise HTTPException(
            status_code=404,
            detail=f"Game key '{game_key}' not found. Available: {list(COMMERCE_GAMES_CATALOG.keys())}"
        )

    safe_levels = []
    for lvl in game_config["levels"]:
        lvl_copy = dict(lvl)
        lvl_copy.pop("correctOptionId", None)
        safe_options = []
        for opt in lvl.get("options", []):
            opt_copy = dict(opt)
            opt_copy.pop("isCorrect", None)
            opt_copy.pop("explanation", None)
            safe_options.append(opt_copy)
        lvl_copy["options"] = safe_options
        safe_levels.append(lvl_copy)

    return {
        "gameKey": game_key,
        "courseId": game_config["courseId"],
        "courseName": game_config["courseName"],
        "gameName": game_config["gameName"],
        "evaluatedSkills": game_config["evaluatedSkills"],
        "levels": safe_levels
    }


@router.post("/start")
def start_commerce_game(payload: StartCommerceGameRequest):
    """
    Initializes a game session record for a student or returns existing record.
    """
    game_config = COMMERCE_GAMES_CATALOG.get(payload.gameKey)
    if not game_config:
        raise HTTPException(status_code=404, detail=f"Game key '{payload.gameKey}' not found.")

    db_inst = get_database()
    col_name = game_config["collection"]
    student_id = payload.studentId

    doc = None
    if db_inst.is_memory_fallback:
        doc = next((a for a in db_inst.memory_store.get(col_name, []) if a.get("studentId") == student_id), None)
    else:
        doc = db_inst.db[col_name].find_one({"studentId": student_id})

    if doc:
        doc["id"] = str(doc.get("_id", doc.get("id")))
        doc.pop("_id", None)
        return doc

    new_doc = {
        "id": str(uuid.uuid4()),
        "studentId": student_id,
        "gameKey": payload.gameKey,
        "courseId": game_config["courseId"],
        "courseName": game_config["courseName"],
        "gameName": game_config["gameName"],
        "stream": "Commerce & Accounting",
        "gameScore": 0.0,
        "accuracy": 0.0,
        "totalTime": 0,
        "completed": False,
        "evaluatedSkills": game_config["evaluatedSkills"],
        "skillScores": {skill: 0.0 for skill in game_config["evaluatedSkills"]},
        "levelBreakdown": [],
        "createdAt": datetime.utcnow().isoformat(),
        "updatedAt": datetime.utcnow().isoformat()
    }

    if db_inst.is_memory_fallback:
        if col_name not in db_inst.memory_store:
            db_inst.memory_store[col_name] = []
        db_inst.memory_store[col_name].append(new_doc)
    else:
        db_inst.db[col_name].insert_one(dict(new_doc))

    return new_doc


@router.post("/game/submit")
def submit_commerce_game(payload: CommerceGameSubmitRequest):
    """
    Evaluates game submissions server-side, scores level responses, saves results,
    and returns comprehensive performance telemetry.
    """
    game_config = COMMERCE_GAMES_CATALOG.get(payload.gameKey)
    if not game_config:
        raise HTTPException(status_code=404, detail=f"Game key '{payload.gameKey}' not found.")

    submission_dicts = [s.model_dump() if hasattr(s, "model_dump") else s.dict() for s in payload.submissions]
    eval_result = evaluate_commerce_game_submission(
        game_key=payload.gameKey,
        level_submissions=submission_dicts,
        total_time=payload.totalTime
    )

    db_inst = get_database()
    col_name = game_config["collection"]
    student_id = payload.studentId

    doc_data = {
        "studentId": student_id,
        "gameKey": payload.gameKey,
        "courseId": game_config["courseId"],
        "courseName": game_config["courseName"],
        "gameName": game_config["gameName"],
        "stream": "Commerce & Accounting",
        "gameScore": eval_result["gameScore"],
        "accuracy": eval_result["accuracy"],
        "correctCount": eval_result["correctCount"],
        "totalLevels": eval_result["totalLevels"],
        "totalTime": payload.totalTime,
        "completed": True,
        "skillScores": eval_result["skillScores"],
        "levelBreakdown": eval_result["levelBreakdown"],
        "updatedAt": datetime.utcnow().isoformat()
    }

    if db_inst.is_memory_fallback:
        if col_name not in db_inst.memory_store:
            db_inst.memory_store[col_name] = []
        existing = next((a for a in db_inst.memory_store[col_name] if a.get("studentId") == student_id), None)
        if existing:
            existing.update(doc_data)
            doc_data["id"] = existing.get("id")
        else:
            doc_data["id"] = str(uuid.uuid4())
            doc_data["createdAt"] = datetime.utcnow().isoformat()
            db_inst.memory_store[col_name].append(doc_data)
    else:
        existing = db_inst.db[col_name].find_one({"studentId": student_id})
        if existing:
            db_inst.db[col_name].update_one({"studentId": student_id}, {"$set": doc_data})
            doc_data["id"] = str(existing.get("_id", existing.get("id")))
        else:
            doc_data["id"] = str(uuid.uuid4())
            doc_data["createdAt"] = datetime.utcnow().isoformat()
            db_inst.db[col_name].insert_one(dict(doc_data))

    doc_data.pop("_id", None)
    return doc_data


@router.get("/{game_key}/result/{student_id}")
def get_commerce_game_result(game_key: str, student_id: str):
    """
    Fetches completed game score, accuracy, and skill telemetry for a student.
    """
    game_config = COMMERCE_GAMES_CATALOG.get(game_key)
    if not game_config:
        raise HTTPException(status_code=404, detail=f"Game key '{game_key}' not found.")

    db_inst = get_database()
    col_name = game_config["collection"]

    doc = None
    if db_inst.is_memory_fallback:
        doc = next((a for a in db_inst.memory_store.get(col_name, []) if a.get("studentId") == student_id), None)
    else:
        doc = db_inst.db[col_name].find_one({"studentId": student_id})

    if not doc:
        raise HTTPException(status_code=404, detail="No assessment attempt found for this student.")

    doc["id"] = str(doc.get("_id", doc.get("id")))
    doc.pop("_id", None)
    return doc


@router.get("/analytics")
def get_commerce_cohort_analytics():
    """
    Aggregates completion counts and average scores across all 5 Commerce games
    for the admin dashboard without synthetic fabrication.
    """
    db_inst = get_database()
    analytics = []

    for key, cfg in COMMERCE_GAMES_CATALOG.items():
        col_name = cfg["collection"]
        docs = []
        if db_inst.is_memory_fallback:
            docs = [d for d in db_inst.memory_store.get(col_name, []) if d.get("completed")]
        else:
            docs = list(db_inst.db[col_name].find({"completed": True}))

        total_attempts = len(docs)
        avg_score = round(sum(d.get("gameScore", 0.0) for d in docs) / total_attempts, 1) if total_attempts > 0 else 0.0
        avg_accuracy = round(sum(d.get("accuracy", 0.0) for d in docs) / total_attempts, 1) if total_attempts > 0 else 0.0

        analytics.append({
            "gameKey": key,
            "courseId": cfg["courseId"],
            "courseName": cfg["courseName"],
            "gameName": cfg["gameName"],
            "totalAttempts": total_attempts,
            "averageScore": avg_score,
            "averageAccuracy": avg_accuracy
        })

    return {"commerceCohortAnalytics": analytics}
