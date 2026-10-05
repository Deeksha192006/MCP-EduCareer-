import uuid
import numpy as np
from datetime import datetime
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from app.core.weight_config import weight_config, WeightConfigurationError
from app.database.mongodb import get_database

router = APIRouter(prefix="/pilot-validation", tags=["Pilot Testing & Recommendation Quality Evaluation"])

class WeightUpdateRequest(BaseModel):
    gameWeight: float = Field(..., ge=0.0, le=1.0)
    writtenWeight: float = Field(..., ge=0.0, le=1.0)

class EvaluatorFeedbackRequest(BaseModel):
    evaluatorId: str
    evaluatorName: Optional[str] = "Evaluator"
    role: str = Field(..., description="student, educator, counsellor, or admin")
    courseKey: str
    relevanceRating: int = Field(..., ge=1, le=5)
    skillRepresentativenessRating: int = Field(..., ge=1, le=5)
    qualitativeFeedback: str
    recommendedWeightAdjustment: Optional[str] = None

COURSES_KEY_MAP = {
    "data-science": {
        "courseName": "B.Sc Data Science & Analytics",
        "gameCollection": "data_science_assessments"
    },
    "psychology": {
        "courseName": "B.Sc Psychology",
        "gameCollection": "psychology_assessments"
    },
    "bba": {
        "courseName": "BBA (Bachelor of Business Administration)",
        "gameCollection": "bba_assessments"
    },
    "environmental-science": {
        "courseName": "B.Sc Environmental Science",
        "gameCollection": "environmental_assessments"
    },
    "journalism": {
        "courseName": "BA Journalism & Mass Communication",
        "gameCollection": "journalism_assessments"
    }
}

@router.get("/weights")
def get_current_recommendation_weights():
    return {
        "currentWeights": weight_config.get_weights(),
        "defaultWeights": {
            "game_weight": weight_config.DEFAULT_GAME_WEIGHT,
            "written_test_weight": weight_config.DEFAULT_WRITTEN_WEIGHT
        },
        "description": "Initial proposed weighting of 75% game performance and 25% written test performance. Configurable for academic pilot calibration."
    }

@router.post("/weights")
def update_recommendation_weights(req: WeightUpdateRequest):
    try:
        updated = weight_config.update_weights(req.gameWeight, req.writtenWeight)
        return {
            "message": "Weights updated successfully.",
            "updatedWeights": updated
        }
    except WeightConfigurationError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/weights/reset")
def reset_recommendation_weights():
    res = weight_config.reset_to_default()
    return {
        "message": "Weights reset to default 75:25 scheme.",
        "weights": res
    }

@router.get("/metrics")
def get_pilot_testing_metrics():
    """
    Computes real, un-fabricated pilot validation statistics directly from stored student assessments.
    If no pilot data is available, returns a clear status indicating validation has not yet been performed.
    """
    db_inst = get_database()

    def get_collection_items(col_name: str) -> List[Dict[str, Any]]:
        if db_inst.is_memory_fallback:
            return db_inst.memory_store.get(col_name, [])
        return list(db_inst.db[col_name].find({}))

    written_items = get_collection_items("written_assessments")

    total_both_completed_all_courses = 0
    course_stats = {}

    all_game_scores = []
    all_written_scores = []

    for c_key, c_info in COURSES_KEY_MAP.items():
        g_items = get_collection_items(c_info["gameCollection"])
        
        # Build student maps
        game_by_student = {g.get("studentId"): g for g in g_items if g.get("completed")}
        written_by_student = {w.get("studentId"): w for w in written_items if w.get("courseKey") == c_key and w.get("completed")}

        all_student_ids = set(game_by_student.keys()) | set(written_by_student.keys())

        both_completed = []
        game_only = []
        written_only = []

        for s_id in all_student_ids:
            has_g = s_id in game_by_student
            has_w = s_id in written_by_student

            if has_g and has_w:
                g_score = float(game_by_student[s_id].get("gameScore", 0.0))
                w_score = float(written_by_student[s_id].get("score", 0.0))
                both_completed.append((g_score, w_score))
                all_game_scores.append(g_score)
                all_written_scores.append(w_score)
            elif has_g and not has_w:
                game_only.append(s_id)
            elif has_w and not has_g:
                written_only.append(s_id)

        n_both = len(both_completed)
        total_both_completed_all_courses += n_both

        if n_both > 0:
            g_scores = [p[0] for p in both_completed]
            w_scores = [p[1] for p in both_completed]
            weights = weight_config.get_weights()
            f_scores = [(g * weights["game_weight"] + w * weights["written_test_weight"]) for g, w in both_completed]

            corr = None
            if n_both >= 3 and np.std(g_scores) > 1e-4 and np.std(w_scores) > 1e-4:
                corr_mat = np.corrcoef(g_scores, w_scores)
                corr = round(float(corr_mat[0, 1]), 3)

            course_stats[c_key] = {
                "courseName": c_info["courseName"],
                "totalEnrolled": len(all_student_ids),
                "bothCompletedCount": n_both,
                "missingWrittenCount": len(game_only),
                "missingGameCount": len(written_only),
                "meanGameScore": round(float(np.mean(g_scores)), 2),
                "meanWrittenScore": round(float(np.mean(w_scores)), 2),
                "meanFinalScore": round(float(np.mean(f_scores)), 2),
                "minFinalScore": round(float(np.min(f_scores)), 2),
                "maxFinalScore": round(float(np.max(f_scores)), 2),
                "gameWrittenCorrelation": corr
            }
        else:
            course_stats[c_key] = {
                "courseName": c_info["courseName"],
                "totalEnrolled": len(all_student_ids),
                "bothCompletedCount": 0,
                "missingWrittenCount": len(game_only),
                "missingGameCount": len(written_only),
                "meanGameScore": None,
                "meanWrittenScore": None,
                "meanFinalScore": None,
                "minFinalScore": None,
                "maxFinalScore": None,
                "gameWrittenCorrelation": None
            }

    overall_corr = None
    if len(all_game_scores) >= 3 and np.std(all_game_scores) > 1e-4 and np.std(all_written_scores) > 1e-4:
        c_mat = np.corrcoef(all_game_scores, all_written_scores)
        overall_corr = round(float(c_mat[0, 1]), 3)

    has_data = total_both_completed_all_courses > 0

    return {
        "hasPilotData": has_data,
        "validationStatus": "PRELIMINARY_OBSERVED_DATA" if has_data else "VALIDATION_NOT_YET_PERFORMED",
        "validationMessage": (
            f"Observed data from {total_both_completed_all_courses} course-pair session(s). Initial 75:25 weights are undergoing pilot testing."
            if has_data else
            "Validation has not yet been performed. No fabricated or synthetic student validation scores are displayed."
        ),
        "totalPairCompletions": total_both_completed_all_courses,
        "overallGameWrittenCorrelation": overall_corr,
        "activeWeights": weight_config.get_weights(),
        "courseWiseStatistics": course_stats,
        "scientificDisclaimer": (
            "Descriptive pilot statistics reflect current active student session data. "
            "Correlations and satisfaction metrics measure descriptive agreement, not certified longitudinal predictive validity."
        )
    }

@router.post("/feedback", status_code=status.HTTP_201_CREATED)
def submit_evaluator_feedback(req: EvaluatorFeedbackRequest):
    db_inst = get_database()
    now_iso = datetime.utcnow().isoformat()

    feedback_doc = {
        "id": str(uuid.uuid4()),
        "evaluatorId": req.evaluatorId,
        "evaluatorName": req.evaluatorName,
        "role": req.role,
        "courseKey": req.courseKey,
        "relevanceRating": req.relevanceRating,
        "skillRepresentativenessRating": req.skillRepresentativenessRating,
        "qualitativeFeedback": req.qualitativeFeedback,
        "recommendedWeightAdjustment": req.recommendedWeightAdjustment,
        "created_at": now_iso
    }

    if db_inst.is_memory_fallback:
        if "pilot_feedback" not in db_inst.memory_store:
            db_inst.memory_store["pilot_feedback"] = []
        db_inst.memory_store["pilot_feedback"].append(feedback_doc)
    else:
        db_inst.db.pilot_feedback.insert_one(feedback_doc)

    return {
        "message": "Evaluator feedback logged successfully.",
        "feedbackId": feedback_doc["id"]
    }

@router.get("/feedback")
def get_evaluator_feedback_list():
    db_inst = get_database()
    if db_inst.is_memory_fallback:
        items = db_inst.memory_store.get("pilot_feedback", [])
    else:
        items = list(db_inst.db.pilot_feedback.find({}))

    for it in items:
        it["id"] = str(it.get("_id", it.get("id")))
        it.pop("_id", None)

    avg_rel = round(float(np.mean([it["relevanceRating"] for it in items])), 2) if items else None
    avg_skill = round(float(np.mean([it["skillRepresentativenessRating"] for it in items])), 2) if items else None

    return {
        "totalFeedbackEntries": len(items),
        "averageRelevanceRating": avg_rel,
        "averageSkillRepresentativeness": avg_skill,
        "feedbackList": items
    }
