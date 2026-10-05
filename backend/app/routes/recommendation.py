import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException
from app.schemas.prediction import PredictionRequest
from app.schemas.recommendation import (
    FinalRecommendationRequest, CourseCompareRequest,
    WhatIfSimulationRequest, ConfusedModeRequest
)
from app.ml.predictor import predictor_service
from ml.recommendation.engine import RecommendationEngine
from ml.recommendation.arts_science_recommendation import ArtsScienceRecommendationService
from app.services.nlp_mindset import NLPMindsetAnalyzer
from app.database.mongodb import get_database
from app.database.course_catalog import COURSES_CATALOG


router = APIRouter(prefix="/recommend", tags=["Recommendations"])

def fetch_student_context(student_id: str):
    db_inst = get_database()
    st = None
    ass_doc = None

    if db_inst.is_memory_fallback:
        st = next((s for s in db_inst.memory_store["students"] if str(s.get("id")) == student_id or str(s.get("_id")) == student_id), None)
        ass_doc = next((a for a in db_inst.memory_store["assessments"] if str(a.get("student_id")) == student_id), None)
    else:
        st = db_inst.db.students.find_one({"_id": student_id})
        ass_doc = db_inst.db.assessments.find_one({"student_id": student_id})

    if not st and ass_doc:
        st = {
            "id": student_id,
            "name": ass_doc.get("name", "Student"),
            "academic": ass_doc.get("academic", {}),
            "skills": ass_doc.get("skills", {}),
            "interests": ass_doc.get("interests", {}),
            "activities": ass_doc.get("activities", {}),
            "career_preference": ass_doc.get("career_preference", ""),
            "preferred_working_style": ass_doc.get("preferred_working_style", ""),
            "text_responses": ass_doc.get("text_responses", {}),
            "nlp_mindset_scores": ass_doc.get("nlp_mindset_scores", {}),
            "detected_mindset_tags": ass_doc.get("detected_mindset_tags", [])
        }
    elif st and ass_doc:
        st["academic"] = ass_doc.get("academic", st.get("academic", {}))
        st["skills"] = ass_doc.get("skills", st.get("skills", {}))
        st["interests"] = ass_doc.get("interests", st.get("interests", {}))
        st["activities"] = ass_doc.get("activities", st.get("activities", {}))
        st["career_preference"] = ass_doc.get("career_preference", st.get("career_preference", ""))
        st["preferred_working_style"] = ass_doc.get("preferred_working_style", st.get("preferred_working_style", ""))
        st["text_responses"] = ass_doc.get("text_responses", {})
    elif not st and not ass_doc:
        st = {
            "id": student_id,
            "name": "Arun Kumar",
            "academic": {"math": 92, "science": 89, "english": 82, "physics": 90, "chemistry": 88, "computer_science": 95, "overall_percentage": 89.5, "attendance_percentage": 94},
            "skills": {"problem_solving": 9, "logical_thinking": 9, "communication": 7, "creativity": 8, "leadership": 8},
            "interests": {"technology": 10, "medicine": 4, "business": 7, "arts": 9},
            "activities": {"technical": True, "sports": False, "arts": True},
            "career_preference": "B.Tech Computer Science",
            "preferred_working_style": "Designing and building",
            "text_responses": {
                "dream_project": "Build AI systems and intuitive web software platforms.",
                "workplace_mindset": "I thrive in tech innovation teams building scalable products.",
                "learning_interests": "Programming tutorials, machine learning, Figma design systems."
            }
        }

    # Fetch completed arcade assessments for Arts & Science stream
    arcade_data = {}
    if db_inst.is_memory_fallback:
        ds_doc = next((a for a in db_inst.memory_store.get("data_science_assessments", []) if a.get("studentId") == student_id and a.get("completed")), None)
        psy_doc = next((a for a in db_inst.memory_store.get("psychology_assessments", []) if a.get("studentId") == student_id and a.get("completed")), None)
        bba_doc = next((a for a in db_inst.memory_store.get("bba_assessments", []) if a.get("studentId") == student_id and a.get("completed")), None)
        env_doc = next((a for a in db_inst.memory_store.get("environmental_assessments", []) if a.get("studentId") == student_id and a.get("completed")), None)
        jrnl_doc = next((a for a in db_inst.memory_store.get("journalism_assessments", []) if a.get("studentId") == student_id and a.get("completed")), None)
    else:
        ds_doc = db_inst.db.data_science_assessments.find_one({"studentId": student_id, "completed": True})
        psy_doc = db_inst.db.psychology_assessments.find_one({"studentId": student_id, "completed": True})
        bba_doc = db_inst.db.bba_assessments.find_one({"studentId": student_id, "completed": True})
        env_doc = db_inst.db.environmental_assessments.find_one({"studentId": student_id, "completed": True})
        jrnl_doc = db_inst.db.journalism_assessments.find_one({"studentId": student_id, "completed": True})

    if ds_doc: arcade_data["data_science"] = ds_doc
    if psy_doc: arcade_data["psychology"] = psy_doc
    if bba_doc: arcade_data["bba"] = bba_doc
    if env_doc: arcade_data["environmental"] = env_doc
    if jrnl_doc: arcade_data["journalism"] = jrnl_doc

    st["arcade_assessments"] = arcade_data
    return st


@router.post("/final")
def generate_final_12th_recommendation(req: FinalRecommendationRequest):
    db_inst = get_database()
    st = fetch_student_context(req.student_id)
    nlp_res = NLPMindsetAnalyzer.analyze_responses(st.get("text_responses", {}))

    courses = COURSES_CATALOG
    if not db_inst.is_memory_fallback:
        c_db = list(db_inst.db.courses.find({}))
        if c_db:
            courses = c_db

    rec_result = RecommendationEngine.generate_final_guidance(st, nlp_res, courses)
    as_recs = ArtsScienceRecommendationService.get_all_course_recommendations(req.student_id)
    rec_result["arts_science_recommendations"] = as_recs

    rec_doc = {
        "id": str(uuid.uuid4()),
        "student_id": req.student_id,
        "assessment_id": req.assessment_id or "latest",
        "primary_recommendation": rec_result["primary_recommendation"],
        "top_courses": rec_result["top_courses"],
        "top_careers": rec_result["top_careers"],
        "arts_science_recommendations": as_recs,
        "skill_gaps": rec_result["skill_gaps"],
        "learning_roadmap": rec_result["learning_roadmap"],
        "profile_completeness": rec_result["profile_completeness"],
        "recommendation_confidence": rec_result["recommendation_confidence"],
        "model_version": rec_result["model_version"],
        "created_at": datetime.utcnow().isoformat()
    }


    if db_inst.is_memory_fallback:
        db_inst.memory_store["recommendations"] = [r for r in db_inst.memory_store["recommendations"] if r.get("student_id") != req.student_id]
        db_inst.memory_store["recommendations"].append(rec_doc)
        db_inst.memory_store["recommendation_history"].append(rec_doc)
    else:
        db_inst.db.recommendations.update_one(
            {"student_id": req.student_id},
            {"$set": rec_doc, "$setOnInsert": {"_id": rec_doc["id"]}},
            upsert=True
        )
        db_inst.db.recommendation_history.insert_one(rec_doc.copy())

    return rec_result

@router.post("/compare")
def compare_courses(req: CourseCompareRequest):
    st = fetch_student_context(req.student_id)
    nlp_res = NLPMindsetAnalyzer.analyze_responses(st.get("text_responses", {}))
    
    compared = []
    for c_name in req.course_names:
        matched_course = next((c for c in COURSES_CATALOG if c_name.lower() in c["course_name"].lower()), COURSES_CATALOG[0])
        res = RecommendationEngine.calculate_course_match(matched_course, st, nlp_res)
        compared.append(res)

    return {"student_id": req.student_id, "compared_courses": compared}

@router.post("/simulate")
def simulate_what_if(req: WhatIfSimulationRequest):
    st = fetch_student_context(req.student_id)
    nlp_res = NLPMindsetAnalyzer.analyze_responses(st.get("text_responses", {}))
    return RecommendationEngine.simulate_what_if(st, nlp_res, COURSES_CATALOG, req.simulated_marks, req.simulated_skills)

@router.post("/confused")
def explore_confused_mode(req: ConfusedModeRequest):
    st = fetch_student_context(req.student_id)
    nlp_res = NLPMindsetAnalyzer.analyze_responses(st.get("text_responses", {}))
    return RecommendationEngine.generate_confused_mode_exploration(st, nlp_res, COURSES_CATALOG)

@router.get("/history/{student_id}")
def get_recommendation_history(student_id: str):
    db_inst = get_database()
    if db_inst.is_memory_fallback:
        hist = [h for h in db_inst.memory_store["recommendation_history"] if h.get("student_id") == student_id]
    else:
        hist = list(db_inst.db.recommendation_history.find({"student_id": student_id}))

    for h in hist:
        if "_id" in h:
            h["id"] = str(h["_id"])
    return hist

@router.get("/{student_id}")
def get_recommendation_by_student_id(student_id: str):
    st = fetch_student_context(student_id)
    return predictor_service.generate_full_guidance(st)

@router.get("/arts-science/{student_id}")
def get_arts_science_recommendations(student_id: str):
    return ArtsScienceRecommendationService.get_all_course_recommendations(student_id)

@router.get("/commerce/{student_id}")
def get_commerce_recommendations(student_id: str):
    from ml.recommendation.commerce_recommendation import CommerceRecommendationService
    return CommerceRecommendationService.calculate_recommendations(student_id)

