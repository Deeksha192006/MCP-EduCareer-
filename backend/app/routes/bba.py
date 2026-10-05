import uuid
import logging
from datetime import datetime
from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, status
from app.schemas.bba import (
    BBAGameSubmitRequest,
    BBAAssessmentResponse,
    BBAAnalyticsResponse
)
from app.data.bba_scenarios import (
    BBA_SIMULATION_ROUNDS,
    evaluate_bba_simulation
)
from app.database.mongodb import get_database

logger = logging.getLogger("uvicorn.error")

router = APIRouter(prefix="/arts-science/bba", tags=["Arts & Science — BBA Startup Simulator"])

@router.get("/rounds")
def get_bba_rounds():
    """
    Returns public simulation rounds and choices.
    Strips internal score weighting and consequence spoilers.
    """
    safe_rounds = []
    for rnd in BBA_SIMULATION_ROUNDS:
        rnd_copy = dict(rnd)
        rnd_copy.pop("optimalOptionId", None)
        safe_options = []
        for opt in rnd.get("options", []):
            opt_copy = dict(opt)
            opt_copy.pop("isOptimal", None)
            opt_copy.pop("score", None)
            opt_copy.pop("consequence", None)
            opt_copy.pop("reasoning", None)
            safe_options.append(opt_copy)
        rnd_copy["options"] = safe_options
        safe_rounds.append(rnd_copy)
    return safe_rounds

@router.post("/start", response_model=BBAAssessmentResponse)
def start_bba_assessment(payload: Dict[str, str]):
    student_id = payload.get("studentId")
    if not student_id:
        raise HTTPException(status_code=400, detail="studentId is required")

    db_inst = get_database()
    doc = None
    if db_inst.is_memory_fallback:
        doc = next((a for a in db_inst.memory_store.get("bba_assessments", []) if a.get("studentId") == student_id), None)
    else:
        doc = db_inst.db.bba_assessments.find_one({"studentId": student_id})

    if doc:
        doc["id"] = str(doc.get("_id", doc.get("id")))
        return doc

    new_doc = {
        "id": str(uuid.uuid4()),
        "studentId": student_id,
        "department": "BBA",
        "stream": "Arts & Science",
        "courseName": "BBA (Bachelor of Business Administration)",
        "gameScore": 0.0,
        "accuracy": 0.0,
        "totalTime": 0,
        "finalCash": 100000.0,
        "finalMRR": 0.0,
        "finalNPS": 50.0,
        "completed": False,
        "skillScores": {
            "businessReasoning": 0.0,
            "resourceManagement": 0.0,
            "strategicThinking": 0.0,
            "decisionMakingUnderRisk": 0.0,
            "financialAcumen": 0.0
        },
        "roundSummaries": [],
        "finalResult": None,
        "completedAt": None,
        "created_at": datetime.utcnow().isoformat()
    }

    if db_inst.is_memory_fallback:
        if "bba_assessments" not in db_inst.memory_store:
            db_inst.memory_store["bba_assessments"] = []
        db_inst.memory_store["bba_assessments"].append(new_doc)
    else:
        new_doc["_id"] = new_doc["id"]
        db_inst.db.bba_assessments.insert_one(new_doc)

    return new_doc

@router.get("/assessment/{student_id}", response_model=BBAAssessmentResponse)
def get_bba_assessment(student_id: str):
    db_inst = get_database()
    doc = None
    if db_inst.is_memory_fallback:
        doc = next((a for a in db_inst.memory_store.get("bba_assessments", []) if a.get("studentId") == student_id), None)
    else:
        doc = db_inst.db.bba_assessments.find_one({"studentId": student_id})

    if not doc:
        return start_bba_assessment({"studentId": student_id})

    doc["id"] = str(doc.get("_id", doc.get("id")))
    return doc

@router.post("/game/submit", response_model=BBAAssessmentResponse)
def submit_bba_game(req: BBAGameSubmitRequest):
    """
    Evaluates business decisions server-side against financial benchmarks.
    Computes treasury, runway, profit margin, and strategic skill scores.
    """
    db_inst = get_database()
    student_id = req.studentId

    eval_result = evaluate_bba_simulation(req.submissions)

    doc = None
    if db_inst.is_memory_fallback:
        if "bba_assessments" not in db_inst.memory_store:
            db_inst.memory_store["bba_assessments"] = []
        doc = next((a for a in db_inst.memory_store["bba_assessments"] if a.get("studentId") == student_id), None)
    else:
        doc = db_inst.db.bba_assessments.find_one({"studentId": student_id})

    if not doc:
        doc = start_bba_assessment({"studentId": student_id})

    doc["gameScore"] = eval_result["gameScore"]
    doc["accuracy"] = eval_result["accuracy"]
    doc["totalTime"] = req.totalTime
    doc["finalCash"] = eval_result["finalCash"]
    doc["finalMRR"] = eval_result["finalMRR"]
    doc["finalNPS"] = eval_result["finalNPS"]
    doc["skillScores"] = eval_result["skillScores"]
    doc["roundSummaries"] = eval_result["roundSummaries"]
    doc["completed"] = True
    doc["completedAt"] = datetime.utcnow().isoformat()
    doc["finalResult"] = {
        "compatibilityScore": eval_result["gameScore"],
        "compatibilityBand": eval_result["compatibilityBand"],
        "recommendationNote": eval_result["recommendationNote"],
        "finalCash": eval_result["finalCash"],
        "finalMRR": eval_result["finalMRR"],
        "finalNPS": eval_result["finalNPS"],
        "strengths": eval_result["strengths"],
        "growthAreas": eval_result["growthAreas"],
        "recommendedRoles": eval_result["recommendedRoles"],
        "disclaimer": eval_result["disclaimer"]
    }

    if db_inst.is_memory_fallback:
        pass
    else:
        db_inst.db.bba_assessments.replace_one({"studentId": student_id}, doc, upsert=True)

    doc["id"] = str(doc.get("_id", doc.get("id")))
    return doc

@router.get("/result/{student_id}", response_model=BBAAssessmentResponse)
def get_bba_result(student_id: str):
    db_inst = get_database()
    doc = None
    if db_inst.is_memory_fallback:
        doc = next((a for a in db_inst.memory_store.get("bba_assessments", []) if a.get("studentId") == student_id), None)
    else:
        doc = db_inst.db.bba_assessments.find_one({"studentId": student_id})

    if not doc or not doc.get("completed"):
        raise HTTPException(status_code=404, detail="BBA Startup Simulator not yet completed.")

    doc["id"] = str(doc.get("_id", doc.get("id")))
    return doc

@router.get("/analytics", response_model=BBAAnalyticsResponse)
def get_bba_analytics():
    db_inst = get_database()
    assessments = []
    if db_inst.is_memory_fallback:
        assessments = [a for a in db_inst.memory_store.get("bba_assessments", []) if a.get("completed")]
    else:
        assessments = list(db_inst.db.bba_assessments.find({"completed": True}))

    total = len(assessments)
    if total == 0:
        return {
            "totalCompletedAssessments": 0,
            "averageScore": 0.0,
            "averageBusinessReasoning": 0.0,
            "averageResourceManagement": 0.0,
            "averageStrategicThinking": 0.0,
            "averageFinancialAcumen": 0.0,
            "averageFinalCash": 0.0,
            "topStrengthsDistribution": {}
        }

    avg_score = sum(a.get("gameScore", 0) for a in assessments) / total
    avg_biz = sum(a.get("skillScores", {}).get("businessReasoning", 0) for a in assessments) / total
    avg_res = sum(a.get("skillScores", {}).get("resourceManagement", 0) for a in assessments) / total
    avg_strat = sum(a.get("skillScores", {}).get("strategicThinking", 0) for a in assessments) / total
    avg_fin = sum(a.get("skillScores", {}).get("financialAcumen", 0) for a in assessments) / total
    avg_cash = sum(a.get("finalCash", 0) for a in assessments) / total

    strengths_dist = {}
    for a in assessments:
        for st in a.get("finalResult", {}).get("strengths", []):
            strengths_dist[st] = strengths_dist.get(st, 0) + 1

    return {
        "totalCompletedAssessments": total,
        "averageScore": round(avg_score, 1),
        "averageBusinessReasoning": round(avg_biz, 1),
        "averageResourceManagement": round(avg_res, 1),
        "averageStrategicThinking": round(avg_strat, 1),
        "averageFinancialAcumen": round(avg_fin, 1),
        "averageFinalCash": round(avg_cash, 1),
        "topStrengthsDistribution": strengths_dist
    }
