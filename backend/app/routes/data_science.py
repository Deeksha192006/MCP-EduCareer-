import uuid
import logging
from datetime import datetime
from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, status
from app.schemas.data_science import (
    DataScienceGameSubmitRequest,
    DataScienceAssessmentResponse,
    DataScienceAnalyticsResponse
)
from app.data.data_science_scenarios import (
    DATA_SCIENCE_LEVELS,
    evaluate_data_science_submission
)
from app.database.mongodb import get_database

logger = logging.getLogger("uvicorn.error")

router = APIRouter(prefix="/arts-science/data-science", tags=["Arts & Science — Data Science Module"])

@router.get("/levels")
def get_data_science_levels():
    """
    Returns public level metadata and problem statements for the Data Detective game,
    safely scrubbing correct answer flags so evaluation remains strictly on the server.
    """
    safe_levels = []
    for lvl in DATA_SCIENCE_LEVELS:
        lvl_copy = dict(lvl)
        # Strip ground truth answer keys from public view
        lvl_copy.pop("correctOptionId", None)
        safe_options = []
        for opt in lvl.get("options", []):
            opt_copy = dict(opt)
            opt_copy.pop("isCorrect", None)
            opt_copy.pop("explanation", None)
            safe_options.append(opt_copy)
        lvl_copy["options"] = safe_options
        safe_levels.append(lvl_copy)
    return safe_levels

@router.post("/start", response_model=DataScienceAssessmentResponse)
def start_data_science_assessment(payload: Dict[str, str]):
    student_id = payload.get("studentId")
    if not student_id:
        raise HTTPException(status_code=400, detail="studentId is required")

    db_inst = get_database()
    doc = None
    if db_inst.is_memory_fallback:
        doc = next((a for a in db_inst.memory_store.get("data_science_assessments", []) if a.get("studentId") == student_id), None)
    else:
        doc = db_inst.db.data_science_assessments.find_one({"studentId": student_id})

    if doc:
        doc["id"] = str(doc.get("_id", doc.get("id")))
        return doc

    new_doc = {
        "id": str(uuid.uuid4()),
        "studentId": student_id,
        "department": "Data Science",
        "stream": "Arts & Science",
        "courseName": "B.Sc. Data Science & Analytics",
        "gameScore": 0.0,
        "accuracy": 0.0,
        "totalTime": 0,
        "completed": False,
        "skillScores": {
            "analyticalThinking": 0.0,
            "dataInterpretation": 0.0,
            "logicalReasoning": 0.0,
            "numericalSkills": 0.0,
            "hypothesisTesting": 0.0
        },
        "levelResults": [],
        "finalResult": None,
        "completedAt": None,
        "created_at": datetime.utcnow().isoformat()
    }

    if db_inst.is_memory_fallback:
        if "data_science_assessments" not in db_inst.memory_store:
            db_inst.memory_store["data_science_assessments"] = []
        db_inst.memory_store["data_science_assessments"].append(new_doc)
    else:
        new_doc["_id"] = new_doc["id"]
        db_inst.db.data_science_assessments.insert_one(new_doc)

    return new_doc

@router.get("/assessment/{student_id}", response_model=DataScienceAssessmentResponse)
def get_data_science_assessment(student_id: str):
    db_inst = get_database()
    doc = None
    if db_inst.is_memory_fallback:
        doc = next((a for a in db_inst.memory_store.get("data_science_assessments", []) if a.get("studentId") == student_id), None)
    else:
        doc = db_inst.db.data_science_assessments.find_one({"studentId": student_id})

    if not doc:
        return start_data_science_assessment({"studentId": student_id})

    doc["id"] = str(doc.get("_id", doc.get("id")))
    return doc

@router.post("/game/submit", response_model=DataScienceAssessmentResponse)
def submit_data_science_game(req: DataScienceGameSubmitRequest):
    """
    Validates submitted level answers on the server against ground-truth benchmarks.
    Computes scores, accuracy, and skill attribution.
    """
    db_inst = get_database()
    student_id = req.studentId

    eval_result = evaluate_data_science_submission(req.levelSubmissions)

    doc = None
    if db_inst.is_memory_fallback:
        if "data_science_assessments" not in db_inst.memory_store:
            db_inst.memory_store["data_science_assessments"] = []
        doc = next((a for a in db_inst.memory_store["data_science_assessments"] if a.get("studentId") == student_id), None)
    else:
        doc = db_inst.db.data_science_assessments.find_one({"studentId": student_id})

    if not doc:
        start_doc = start_data_science_assessment({"studentId": student_id})
        doc = start_doc

    doc["gameScore"] = eval_result["gameScore"]
    doc["accuracy"] = eval_result["accuracy"]
    doc["totalTime"] = req.totalTime
    doc["skillScores"] = eval_result["skillScores"]
    doc["levelResults"] = eval_result["levelResults"]
    doc["completed"] = True
    doc["completedAt"] = datetime.utcnow().isoformat()
    doc["finalResult"] = {
        "compatibilityScore": eval_result["gameScore"],
        "compatibilityBand": eval_result["compatibilityBand"],
        "recommendationNote": eval_result["recommendationNote"],
        "strengths": eval_result["strengths"],
        "growthAreas": eval_result["growthAreas"],
        "recommendedRoles": eval_result["recommendedRoles"],
        "disclaimer": "This score is an exploratory interest and aptitude indicator to help students discover course alignment, not a clinical psychological test."
    }

    if db_inst.is_memory_fallback:
        # Document updated in-place in list
        pass
    else:
        db_inst.db.data_science_assessments.replace_one({"studentId": student_id}, doc, upsert=True)

    doc["id"] = str(doc.get("_id", doc.get("id")))
    return doc

@router.get("/result/{student_id}", response_model=DataScienceAssessmentResponse)
def get_data_science_result(student_id: str):
    db_inst = get_database()
    doc = None
    if db_inst.is_memory_fallback:
        doc = next((a for a in db_inst.memory_store.get("data_science_assessments", []) if a.get("studentId") == student_id), None)
    else:
        doc = db_inst.db.data_science_assessments.find_one({"studentId": student_id})

    if not doc or not doc.get("completed"):
        raise HTTPException(status_code=404, detail="Data Science assessment not yet completed for this student.")

    doc["id"] = str(doc.get("_id", doc.get("id")))
    return doc

@router.get("/analytics", response_model=DataScienceAnalyticsResponse)
def get_data_science_analytics():
    db_inst = get_database()
    assessments = []
    if db_inst.is_memory_fallback:
        assessments = [a for a in db_inst.memory_store.get("data_science_assessments", []) if a.get("completed")]
    else:
        assessments = list(db_inst.db.data_science_assessments.find({"completed": True}))

    total = len(assessments)
    if total == 0:
        return {
            "totalCompletedAssessments": 0,
            "averageScore": 0.0,
            "averageAnalyticalThinking": 0.0,
            "averageDataInterpretation": 0.0,
            "averageLogicalReasoning": 0.0,
            "averageNumericalSkills": 0.0,
            "averageCompletionTime": 0.0,
            "topStrengthsDistribution": {}
        }

    avg_score = sum(a.get("gameScore", 0) for a in assessments) / total
    avg_analytic = sum(a.get("skillScores", {}).get("analyticalThinking", 0) for a in assessments) / total
    avg_interp = sum(a.get("skillScores", {}).get("dataInterpretation", 0) for a in assessments) / total
    avg_logic = sum(a.get("skillScores", {}).get("logicalReasoning", 0) for a in assessments) / total
    avg_num = sum(a.get("skillScores", {}).get("numericalSkills", 0) for a in assessments) / total
    avg_time = sum(a.get("totalTime", 0) for a in assessments) / total

    strengths_dist = {}
    for a in assessments:
        for st in a.get("finalResult", {}).get("strengths", []):
            strengths_dist[st] = strengths_dist.get(st, 0) + 1

    return {
        "totalCompletedAssessments": total,
        "averageScore": round(avg_score, 1),
        "averageAnalyticalThinking": round(avg_analytic, 1),
        "averageDataInterpretation": round(avg_interp, 1),
        "averageLogicalReasoning": round(avg_logic, 1),
        "averageNumericalSkills": round(avg_num, 1),
        "averageCompletionTime": round(avg_time, 1),
        "topStrengthsDistribution": strengths_dist
    }
