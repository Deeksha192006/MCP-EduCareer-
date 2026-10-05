import uuid
import logging
from datetime import datetime
from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, status
from app.schemas.psychology import (
    PsychologyGameSubmitRequest,
    PsychologyAssessmentResponse,
    PsychologyAnalyticsResponse
)
from app.data.psychology_scenarios import (
    PSYCHOLOGY_SCENARIOS,
    evaluate_psychology_submission
)
from app.database.mongodb import get_database

logger = logging.getLogger("uvicorn.error")

router = APIRouter(prefix="/arts-science/psychology", tags=["Arts & Science — Psychology Module"])

@router.get("/scenarios")
def get_psychology_scenarios():
    """
    Returns public scenario narratives and options.
    Strips internal scoring weights and consequence spoils so evaluation remains on the server.
    """
    safe_scenarios = []
    for sc in PSYCHOLOGY_SCENARIOS:
        sc_copy = dict(sc)
        sc_copy.pop("optimalOptionId", None)
        safe_options = []
        for opt in sc.get("options", []):
            opt_copy = dict(opt)
            opt_copy.pop("isOptimal", None)
            opt_copy.pop("score", None)
            opt_copy.pop("consequence", None)
            opt_copy.pop("reasoning", None)
            safe_options.append(opt_copy)
        sc_copy["options"] = safe_options
        safe_scenarios.append(sc_copy)
    return safe_scenarios

@router.post("/start", response_model=PsychologyAssessmentResponse)
def start_psychology_assessment(payload: Dict[str, str]):
    student_id = payload.get("studentId")
    if not student_id:
        raise HTTPException(status_code=400, detail="studentId is required")

    db_inst = get_database()
    doc = None
    if db_inst.is_memory_fallback:
        doc = next((a for a in db_inst.memory_store.get("psychology_assessments", []) if a.get("studentId") == student_id), None)
    else:
        doc = db_inst.db.psychology_assessments.find_one({"studentId": student_id})

    if doc:
        doc["id"] = str(doc.get("_id", doc.get("id")))
        return doc

    new_doc = {
        "id": str(uuid.uuid4()),
        "studentId": student_id,
        "department": "Psychology",
        "stream": "Arts & Science",
        "courseName": "B.Sc. Psychology",
        "gameScore": 0.0,
        "accuracy": 0.0,
        "totalTime": 0,
        "completed": False,
        "skillScores": {
            "empathyOrientedReasoning": 0.0,
            "socialPerception": 0.0,
            "criticalThinking": 0.0,
            "observationSkills": 0.0,
            "conflictResolution": 0.0
        },
        "scenarioResults": [],
        "finalResult": None,
        "completedAt": None,
        "created_at": datetime.utcnow().isoformat()
    }

    if db_inst.is_memory_fallback:
        if "psychology_assessments" not in db_inst.memory_store:
            db_inst.memory_store["psychology_assessments"] = []
        db_inst.memory_store["psychology_assessments"].append(new_doc)
    else:
        new_doc["_id"] = new_doc["id"]
        db_inst.db.psychology_assessments.insert_one(new_doc)

    return new_doc

@router.get("/assessment/{student_id}", response_model=PsychologyAssessmentResponse)
def get_psychology_assessment(student_id: str):
    db_inst = get_database()
    doc = None
    if db_inst.is_memory_fallback:
        doc = next((a for a in db_inst.memory_store.get("psychology_assessments", []) if a.get("studentId") == student_id), None)
    else:
        doc = db_inst.db.psychology_assessments.find_one({"studentId": student_id})

    if not doc:
        return start_psychology_assessment({"studentId": student_id})

    doc["id"] = str(doc.get("_id", doc.get("id")))
    return doc

@router.post("/game/submit", response_model=PsychologyAssessmentResponse)
def submit_psychology_game(req: PsychologyGameSubmitRequest):
    """
    Validates submitted interpersonal choices on the server.
    Computes empathy, social perception, conflict resolution scores, and generates constructive feedback.
    """
    db_inst = get_database()
    student_id = req.studentId

    eval_result = evaluate_psychology_submission(req.submissions)

    doc = None
    if db_inst.is_memory_fallback:
        if "psychology_assessments" not in db_inst.memory_store:
            db_inst.memory_store["psychology_assessments"] = []
        doc = next((a for a in db_inst.memory_store["psychology_assessments"] if a.get("studentId") == student_id), None)
    else:
        doc = db_inst.db.psychology_assessments.find_one({"studentId": student_id})

    if not doc:
        doc = start_psychology_assessment({"studentId": student_id})

    doc["gameScore"] = eval_result["gameScore"]
    doc["accuracy"] = eval_result["accuracy"]
    doc["totalTime"] = req.totalTime
    doc["skillScores"] = eval_result["skillScores"]
    doc["scenarioResults"] = eval_result["scenarioResults"]
    doc["completed"] = True
    doc["completedAt"] = datetime.utcnow().isoformat()
    doc["finalResult"] = {
        "compatibilityScore": eval_result["gameScore"],
        "compatibilityBand": eval_result["compatibilityBand"],
        "recommendationNote": eval_result["recommendationNote"],
        "strengths": eval_result["strengths"],
        "growthAreas": eval_result["growthAreas"],
        "recommendedRoles": eval_result["recommendedRoles"],
        "disclaimer": eval_result["disclaimer"]
    }

    if db_inst.is_memory_fallback:
        pass
    else:
        db_inst.db.psychology_assessments.replace_one({"studentId": student_id}, doc, upsert=True)

    doc["id"] = str(doc.get("_id", doc.get("id")))
    return doc

@router.get("/result/{student_id}", response_model=PsychologyAssessmentResponse)
def get_psychology_result(student_id: str):
    db_inst = get_database()
    doc = None
    if db_inst.is_memory_fallback:
        doc = next((a for a in db_inst.memory_store.get("psychology_assessments", []) if a.get("studentId") == student_id), None)
    else:
        doc = db_inst.db.psychology_assessments.find_one({"studentId": student_id})

    if not doc or not doc.get("completed"):
        raise HTTPException(status_code=404, detail="Psychology Mind Explorer assessment not yet completed.")

    doc["id"] = str(doc.get("_id", doc.get("id")))
    return doc

@router.get("/analytics", response_model=PsychologyAnalyticsResponse)
def get_psychology_analytics():
    db_inst = get_database()
    assessments = []
    if db_inst.is_memory_fallback:
        assessments = [a for a in db_inst.memory_store.get("psychology_assessments", []) if a.get("completed")]
    else:
        assessments = list(db_inst.db.psychology_assessments.find({"completed": True}))

    total = len(assessments)
    if total == 0:
        return {
            "totalCompletedAssessments": 0,
            "averageScore": 0.0,
            "averageEmpathy": 0.0,
            "averageSocialPerception": 0.0,
            "averageCriticalThinking": 0.0,
            "averageObservation": 0.0,
            "averageConflictResolution": 0.0,
            "topStrengthsDistribution": {}
        }

    avg_score = sum(a.get("gameScore", 0) for a in assessments) / total
    avg_emp = sum(a.get("skillScores", {}).get("empathyOrientedReasoning", 0) for a in assessments) / total
    avg_soc = sum(a.get("skillScores", {}).get("socialPerception", 0) for a in assessments) / total
    avg_crit = sum(a.get("skillScores", {}).get("criticalThinking", 0) for a in assessments) / total
    avg_obs = sum(a.get("skillScores", {}).get("observationSkills", 0) for a in assessments) / total
    avg_res = sum(a.get("skillScores", {}).get("conflictResolution", 0) for a in assessments) / total

    strengths_dist = {}
    for a in assessments:
        for st in a.get("finalResult", {}).get("strengths", []):
            strengths_dist[st] = strengths_dist.get(st, 0) + 1

    return {
        "totalCompletedAssessments": total,
        "averageScore": round(avg_score, 1),
        "averageEmpathy": round(avg_emp, 1),
        "averageSocialPerception": round(avg_soc, 1),
        "averageCriticalThinking": round(avg_crit, 1),
        "averageObservation": round(avg_obs, 1),
        "averageConflictResolution": round(avg_res, 1),
        "topStrengthsDistribution": strengths_dist
    }
