import uuid
import logging
from datetime import datetime
from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, status
from app.schemas.environmental_science import (
    EnvironmentalGameSubmitRequest,
    EnvironmentalAssessmentResponse,
    EnvironmentalAnalyticsResponse
)
from app.data.environmental_scenarios import (
    ENV_CHALLENGES,
    evaluate_environmental_simulation
)
from app.database.mongodb import get_database

logger = logging.getLogger("uvicorn.error")

router = APIRouter(prefix="/arts-science/environmental-science", tags=["Arts & Science — Environmental Science Module"])

@router.get("/challenges")
def get_environmental_challenges():
    """
    Returns public town environmental challenges and solution alternatives.
    Strips internal score weighting and optimal flags.
    """
    safe_challenges = []
    for ch in ENV_CHALLENGES:
        ch_copy = dict(ch)
        ch_copy.pop("optimalOptionId", None)
        safe_options = []
        for opt in ch.get("options", []):
            opt_copy = dict(opt)
            opt_copy.pop("isOptimal", None)
            opt_copy.pop("score", None)
            opt_copy.pop("consequence", None)
            opt_copy.pop("reasoning", None)
            safe_options.append(opt_copy)
        ch_copy["options"] = safe_options
        safe_challenges.append(ch_copy)
    return safe_challenges

@router.post("/start", response_model=EnvironmentalAssessmentResponse)
def start_environmental_assessment(payload: Dict[str, str]):
    student_id = payload.get("studentId")
    if not student_id:
        raise HTTPException(status_code=400, detail="studentId is required")

    db_inst = get_database()
    doc = None
    if db_inst.is_memory_fallback:
        doc = next((a for a in db_inst.memory_store.get("environmental_assessments", []) if a.get("studentId") == student_id), None)
    else:
        doc = db_inst.db.environmental_assessments.find_one({"studentId": student_id})

    if doc:
        doc["id"] = str(doc.get("_id", doc.get("id")))
        return doc

    new_doc = {
        "id": str(uuid.uuid4()),
        "studentId": student_id,
        "department": "Environmental Science",
        "stream": "Arts & Science",
        "courseName": "B.Sc. Environmental Science",
        "gameScore": 0.0,
        "accuracy": 0.0,
        "totalTime": 0,
        "finalAQI": 185.0,
        "finalCleanEnergy": 15.0,
        "finalWaterReserves": 35.0,
        "finalWasteDiverted": 20.0,
        "finalBudget": 150000.0,
        "completed": False,
        "skillScores": {
            "scientificReasoning": 0.0,
            "sustainabilityAwareness": 0.0,
            "systemsThinking": 0.0,
            "environmentalProblemSolving": 0.0,
            "resourceBudgetBalancing": 0.0
        },
        "challengeSummaries": [],
        "finalResult": None,
        "completedAt": None,
        "created_at": datetime.utcnow().isoformat()
    }

    if db_inst.is_memory_fallback:
        if "environmental_assessments" not in db_inst.memory_store:
            db_inst.memory_store["environmental_assessments"] = []
        db_inst.memory_store["environmental_assessments"].append(new_doc)
    else:
        new_doc["_id"] = new_doc["id"]
        db_inst.db.environmental_assessments.insert_one(new_doc)

    return new_doc

@router.get("/assessment/{student_id}", response_model=EnvironmentalAssessmentResponse)
def get_environmental_assessment(student_id: str):
    db_inst = get_database()
    doc = None
    if db_inst.is_memory_fallback:
        doc = next((a for a in db_inst.memory_store.get("environmental_assessments", []) if a.get("studentId") == student_id), None)
    else:
        doc = db_inst.db.environmental_assessments.find_one({"studentId": student_id})

    if not doc:
        return start_environmental_assessment({"studentId": student_id})

    doc["id"] = str(doc.get("_id", doc.get("id")))
    return doc

@router.post("/game/submit", response_model=EnvironmentalAssessmentResponse)
@router.post("/submit", response_model=EnvironmentalAssessmentResponse)
def submit_environmental_game(req: EnvironmentalGameSubmitRequest):

    """
    Evaluates ecological choices server-side against environmental system models.
    Updates town AQI, water reserves, clean energy share, waste diverted, and systems skills.
    """
    db_inst = get_database()
    student_id = req.studentId

    eval_result = evaluate_environmental_simulation(req.submissions)

    doc = None
    if db_inst.is_memory_fallback:
        if "environmental_assessments" not in db_inst.memory_store:
            db_inst.memory_store["environmental_assessments"] = []
        doc = next((a for a in db_inst.memory_store["environmental_assessments"] if a.get("studentId") == student_id), None)
    else:
        doc = db_inst.db.environmental_assessments.find_one({"studentId": student_id})

    if not doc:
        doc = start_environmental_assessment({"studentId": student_id})

    doc["gameScore"] = eval_result["gameScore"]
    doc["accuracy"] = eval_result["accuracy"]
    doc["totalTime"] = req.totalTime
    doc["finalAQI"] = eval_result["finalAQI"]
    doc["finalCleanEnergy"] = eval_result["finalCleanEnergy"]
    doc["finalWaterReserves"] = eval_result["finalWaterReserves"]
    doc["finalWasteDiverted"] = eval_result["finalWasteDiverted"]
    doc["finalBudget"] = eval_result["finalBudget"]
    doc["skillScores"] = eval_result["skillScores"]
    doc["challengeSummaries"] = eval_result["challengeSummaries"]
    doc["completed"] = True
    doc["completedAt"] = datetime.utcnow().isoformat()
    doc["finalResult"] = {
        "compatibilityScore": eval_result["gameScore"],
        "compatibilityBand": eval_result["compatibilityBand"],
        "recommendationNote": eval_result["recommendationNote"],
        "finalAQI": eval_result["finalAQI"],
        "finalCleanEnergy": eval_result["finalCleanEnergy"],
        "finalWaterReserves": eval_result["finalWaterReserves"],
        "finalWasteDiverted": eval_result["finalWasteDiverted"],
        "finalBudget": eval_result["finalBudget"],
        "strengths": eval_result["strengths"],
        "growthAreas": eval_result["growthAreas"],
        "recommendedRoles": eval_result["recommendedRoles"],
        "disclaimer": eval_result["disclaimer"]
    }

    if db_inst.is_memory_fallback:
        pass
    else:
        db_inst.db.environmental_assessments.replace_one({"studentId": student_id}, doc, upsert=True)

    doc["id"] = str(doc.get("_id", doc.get("id")))
    return doc

@router.get("/result/{student_id}", response_model=EnvironmentalAssessmentResponse)
def get_environmental_result(student_id: str):
    db_inst = get_database()
    doc = None
    if db_inst.is_memory_fallback:
        doc = next((a for a in db_inst.memory_store.get("environmental_assessments", []) if a.get("studentId") == student_id), None)
    else:
        doc = db_inst.db.environmental_assessments.find_one({"studentId": student_id})

    if not doc or not doc.get("completed"):
        raise HTTPException(status_code=404, detail="Eco Guardian assessment not yet completed.")

    doc["id"] = str(doc.get("_id", doc.get("id")))
    return doc

@router.get("/analytics", response_model=EnvironmentalAnalyticsResponse)
def get_environmental_analytics():
    db_inst = get_database()
    assessments = []
    if db_inst.is_memory_fallback:
        assessments = [a for a in db_inst.memory_store.get("environmental_assessments", []) if a.get("completed")]
    else:
        assessments = list(db_inst.db.environmental_assessments.find({"completed": True}))

    total = len(assessments)
    if total == 0:
        return {
            "totalCompletedAssessments": 0,
            "averageScore": 0.0,
            "averageScientificReasoning": 0.0,
            "averageSustainabilityAwareness": 0.0,
            "averageSystemsThinking": 0.0,
            "averageProblemSolving": 0.0,
            "averageFinalAQI": 0.0,
            "averageCleanEnergy": 0.0,
            "topStrengthsDistribution": {}
        }

    avg_score = sum(a.get("gameScore", 0) for a in assessments) / total
    avg_sci = sum(a.get("skillScores", {}).get("scientificReasoning", 0) for a in assessments) / total
    avg_sust = sum(a.get("skillScores", {}).get("sustainabilityAwareness", 0) for a in assessments) / total
    avg_sys = sum(a.get("skillScores", {}).get("systemsThinking", 0) for a in assessments) / total
    avg_prob = sum(a.get("skillScores", {}).get("environmentalProblemSolving", 0) for a in assessments) / total
    avg_aqi = sum(a.get("finalAQI", 0) for a in assessments) / total
    avg_nrg = sum(a.get("finalCleanEnergy", 0) for a in assessments) / total

    strengths_dist = {}
    for a in assessments:
        for st in a.get("finalResult", {}).get("strengths", []):
            strengths_dist[st] = strengths_dist.get(st, 0) + 1

    return {
        "totalCompletedAssessments": total,
        "averageScore": round(avg_score, 1),
        "averageScientificReasoning": round(avg_sci, 1),
        "averageSustainabilityAwareness": round(avg_sust, 1),
        "averageSystemsThinking": round(avg_sys, 1),
        "averageProblemSolving": round(avg_prob, 1),
        "averageFinalAQI": round(avg_aqi, 1),
        "averageCleanEnergy": round(avg_nrg, 1),
        "topStrengthsDistribution": strengths_dist
    }
