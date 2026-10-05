import uuid
import logging
from datetime import datetime
from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, status
from app.schemas.journalism import (
    JournalismGameSubmitRequest,
    JournalismAssessmentResponse,
    JournalismAnalyticsResponse
)
from app.data.journalism_scenarios import (
    NEWSROOM_CHALLENGES,
    evaluate_journalism_simulation
)
from app.database.mongodb import get_database

logger = logging.getLogger("uvicorn.error")

router = APIRouter(prefix="/arts-science/journalism", tags=["Arts & Science — Journalism & Mass Communication Module"])

@router.get("/challenges")
def get_journalism_challenges():
    """
    Returns public newsroom simulation challenges.
    Strips internal score weighting and optimal flags.
    """
    safe_challenges = []
    for ch in NEWSROOM_CHALLENGES:
        ch_copy = dict(ch)
        ch_copy.pop("optimalOptionId", None)
        safe_options = []
        for opt in ch.get("options", []):
            opt_copy = dict(opt)
            opt_copy.pop("isOptimal", None)
            opt_copy.pop("score", None)
            opt_copy.pop("consequence", None)
            opt_copy.pop("editorialFeedback", None)
            opt_copy.pop("verificationScore", None)
            opt_copy.pop("ethicsScore", None)
            opt_copy.pop("interviewingScore", None)
            opt_copy.pop("communicationScore", None)
            opt_copy.pop("mediaLiteracyScore", None)
            safe_options.append(opt_copy)
        ch_copy["options"] = safe_options
        safe_challenges.append(ch_copy)
    return safe_challenges

@router.post("/start", response_model=JournalismAssessmentResponse)
def start_journalism_assessment(payload: Dict[str, str]):
    student_id = payload.get("studentId")
    if not student_id:
        raise HTTPException(status_code=400, detail="studentId is required")

    db_inst = get_database()
    doc = None
    if db_inst.is_memory_fallback:
        doc = next((a for a in db_inst.memory_store.get("journalism_assessments", []) if a.get("studentId") == student_id), None)
    else:
        doc = db_inst.db.journalism_assessments.find_one({"studentId": student_id})

    if doc:
        doc["id"] = str(doc.get("_id", doc.get("id")))
        return doc

    new_doc = {
        "id": str(uuid.uuid4()),
        "studentId": student_id,
        "department": "Journalism & Mass Communication",
        "stream": "Arts & Science",
        "courseName": "BA Journalism & Mass Communication",
        "gameScore": 0.0,
        "accuracy": 0.0,
        "totalTime": 0,
        "verificationScore": 0.0,
        "ethicsScore": 0.0,
        "interviewingScore": 0.0,
        "communicationScore": 0.0,
        "mediaLiteracyScore": 0.0,
        "completed": False,
        "skillScores": {
            "criticalVerification": 0.0,
            "mediaEthics": 0.0,
            "investigativeInquiry": 0.0,
            "clearCommunication": 0.0,
            "digitalMediaLiteracy": 0.0
        },
        "challengeSummaries": [],
        "finalResult": None,
        "completedAt": None,
        "created_at": datetime.utcnow().isoformat()
    }

    if db_inst.is_memory_fallback:
        if "journalism_assessments" not in db_inst.memory_store:
            db_inst.memory_store["journalism_assessments"] = []
        db_inst.memory_store["journalism_assessments"].append(new_doc)
    else:
        db_inst.db.journalism_assessments.insert_one(dict(new_doc))

    return new_doc

@router.post("/evaluate-choice")
def evaluate_journalism_choice(payload: Dict[str, str]):
    challenge_id = payload.get("challengeId")
    selected_option_id = payload.get("selectedOptionId")

    challenge = next((c for c in NEWSROOM_CHALLENGES if c["challengeId"] == challenge_id), None)
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")

    option = next((o for o in challenge.get("options", []) if o["id"] == selected_option_id), None)
    if not option:
        raise HTTPException(status_code=404, detail="Option not found")

    return {
        "challengeId": challenge_id,
        "selectedOptionId": selected_option_id,
        "isOptimal": bool(option.get("isOptimal", False)),
        "consequence": option.get("consequence", ""),
        "editorialFeedback": option.get("editorialFeedback", ""),
        "scoreEarned": float(option.get("score", 0.0))
    }

@router.post("/submit", response_model=JournalismAssessmentResponse)
@router.post("/game/submit", response_model=JournalismAssessmentResponse)
def submit_journalism_game(request: JournalismGameSubmitRequest):

    eval_result = evaluate_journalism_simulation([s.dict() for s in request.submissions])

    db_inst = get_database()
    doc = None
    if db_inst.is_memory_fallback:
        doc = next((a for a in db_inst.memory_store.get("journalism_assessments", []) if a.get("studentId") == request.studentId), None)
    else:
        doc = db_inst.db.journalism_assessments.find_one({"studentId": request.studentId})

    if not doc:
        doc = {
            "id": str(uuid.uuid4()),
            "studentId": request.studentId,
            "department": "Journalism & Mass Communication",
            "stream": "Arts & Science",
            "courseName": "BA Journalism & Mass Communication",
            "created_at": datetime.utcnow().isoformat()
        }
        if db_inst.is_memory_fallback:
            if "journalism_assessments" not in db_inst.memory_store:
                db_inst.memory_store["journalism_assessments"] = []
            db_inst.memory_store["journalism_assessments"].append(doc)
        else:
            db_inst.db.journalism_assessments.insert_one(doc)

    doc["gameScore"] = eval_result["gameScore"]
    doc["accuracy"] = eval_result["accuracy"]
    doc["totalTime"] = request.totalTime
    doc["verificationScore"] = eval_result["verificationScore"]
    doc["ethicsScore"] = eval_result["ethicsScore"]
    doc["interviewingScore"] = eval_result["interviewingScore"]
    doc["communicationScore"] = eval_result["communicationScore"]
    doc["mediaLiteracyScore"] = eval_result["mediaLiteracyScore"]
    doc["skillScores"] = eval_result["skillScores"]
    doc["challengeSummaries"] = eval_result["challengeSummaries"]
    doc["finalResult"] = {
        "compatibilityBand": eval_result["compatibilityBand"],
        "recommendationNote": eval_result["recommendationNote"],
        "strengths": eval_result["strengths"],
        "growthAreas": eval_result["growthAreas"],
        "recommendedRoles": eval_result["recommendedRoles"],
        "disclaimer": eval_result["disclaimer"]
    }
    doc["completed"] = True
    doc["completedAt"] = datetime.utcnow().isoformat()

    if not db_inst.is_memory_fallback:
        db_inst.db.journalism_assessments.update_one(
            {"studentId": request.studentId},
            {"$set": doc}
        )

    doc["id"] = str(doc.get("_id", doc.get("id")))
    return doc

@router.get("/results/{student_id}", response_model=JournalismAssessmentResponse)
@router.get("/result/{student_id}", response_model=JournalismAssessmentResponse)
def get_journalism_results(student_id: str):

    db_inst = get_database()
    doc = None
    if db_inst.is_memory_fallback:
        doc = next((a for a in db_inst.memory_store.get("journalism_assessments", []) if a.get("studentId") == student_id), None)
    else:
        doc = db_inst.db.journalism_assessments.find_one({"studentId": student_id})

    if not doc:
        raise HTTPException(status_code=404, detail="Journalism assessment not found for this student")

    doc["id"] = str(doc.get("_id", doc.get("id")))
    return doc

@router.get("/analytics", response_model=JournalismAnalyticsResponse)
def get_journalism_analytics():
    db_inst = get_database()
    items = []
    if db_inst.is_memory_fallback:
        items = [a for a in db_inst.memory_store.get("journalism_assessments", []) if a.get("completed")]
    else:
        items = list(db_inst.db.journalism_assessments.find({"completed": True}))

    total = len(items)
    if total == 0:
        return JournalismAnalyticsResponse(
            totalCompletedAssessments=0,
            averageScore=0.0,
            averageVerificationScore=0.0,
            averageEthicsScore=0.0,
            averageInterviewingScore=0.0,
            averageCommunicationScore=0.0,
            averageMediaLiteracyScore=0.0,
            topStrengthsDistribution={}
        )

    avg_score = sum(i.get("gameScore", 0.0) for i in items) / total
    avg_v = sum(i.get("verificationScore", 0.0) for i in items) / total
    avg_e = sum(i.get("ethicsScore", 0.0) for i in items) / total
    avg_i = sum(i.get("interviewingScore", 0.0) for i in items) / total
    avg_c = sum(i.get("communicationScore", 0.0) for i in items) / total
    avg_m = sum(i.get("mediaLiteracyScore", 0.0) for i in items) / total

    strengths_dist: Dict[str, int] = {}
    for it in items:
        fr = it.get("finalResult", {})
        for s in fr.get("strengths", []):
            strengths_dist[s] = strengths_dist.get(s, 0) + 1

    return JournalismAnalyticsResponse(
        totalCompletedAssessments=total,
        averageScore=round(avg_score, 1),
        averageVerificationScore=round(avg_v, 1),
        averageEthicsScore=round(avg_e, 1),
        averageInterviewingScore=round(avg_i, 1),
        averageCommunicationScore=round(avg_c, 1),
        averageMediaLiteracyScore=round(avg_m, 1),
        topStrengthsDistribution=strengths_dist
    )
