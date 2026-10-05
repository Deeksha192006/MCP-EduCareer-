import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException
from app.schemas.assessment import AssessmentSubmission, AssessmentResponse
from app.database.mongodb import get_database
from app.services.nlp_mindset import NLPMindsetAnalyzer

router = APIRouter(prefix="/assessment", tags=["Assessment"])

@router.post("", response_model=AssessmentResponse)
def submit_assessment(ass_in: AssessmentSubmission):
    db_inst = get_database()
    doc = ass_in.dict()
    
    # Process text responses with NLP Mindset Analyzer
    nlp_res = NLPMindsetAnalyzer.analyze_responses(doc.get("text_responses", {}))
    doc["nlp_mindset_scores"] = nlp_res["scores"]
    doc["detected_mindset_tags"] = nlp_res["detected_tags"]

    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.utcnow().isoformat()

    if db_inst.is_memory_fallback:
        # Replace existing assessment for student if present
        db_inst.memory_store["assessments"] = [a for a in db_inst.memory_store["assessments"] if a.get("student_id") != doc["student_id"]]
        db_inst.memory_store["assessments"].append(doc)
        
        # Update matching student in memory store
        st = next((s for s in db_inst.memory_store["students"] if str(s.get("id")) == doc["student_id"] or str(s.get("_id")) == doc["student_id"]), None)
        if st:
            st["academic"] = doc.get("academic", st.get("academic", {}))
            st["skills"] = doc.get("skills", st.get("skills", {}))
            st["interests"] = doc.get("interests", st.get("interests", {}))
            st["activities"] = doc.get("activities", st.get("activities", {}))
            st["career_preference"] = doc.get("career_preference", st.get("career_preference", ""))
            st["preferred_working_style"] = doc.get("preferred_working_style", st.get("preferred_working_style", ""))
            st["text_responses"] = doc.get("text_responses", {})
            st["nlp_mindset_scores"] = doc.get("nlp_mindset_scores", {})
            st["detected_mindset_tags"] = doc.get("detected_mindset_tags", [])
    else:
        set_doc = {k: v for k, v in doc.items() if k != "_id"}
        db_inst.db.assessments.update_one(
            {"student_id": doc["student_id"]},
            {"$set": set_doc, "$setOnInsert": {"_id": doc["id"]}},
            upsert=True
        )
        # Update matching student document in students collection
        st_update = {
            "academic": doc.get("academic", {}),
            "skills": doc.get("skills", {}),
            "interests": doc.get("interests", {}),
            "activities": doc.get("activities", {}),
            "career_preference": doc.get("career_preference", ""),
            "preferred_working_style": doc.get("preferred_working_style", ""),
            "text_responses": doc.get("text_responses", {}),
            "nlp_mindset_scores": doc.get("nlp_mindset_scores", {}),
            "detected_mindset_tags": doc.get("detected_mindset_tags", [])
        }
        db_inst.db.students.update_one(
            {"_id": doc["student_id"]},
            {"$set": st_update},
            upsert=False
        )

    return doc



@router.get("/{student_id}", response_model=AssessmentResponse)
def get_assessment(student_id: str):
    db_inst = get_database()
    if db_inst.is_memory_fallback:
        doc = next((a for a in db_inst.memory_store["assessments"] if a["student_id"] == student_id), None)
    else:
        doc = db_inst.db.assessments.find_one({"student_id": student_id})

    if not doc:
        # Return default assessment template with sample mindset
        return {
            "id": "default",
            "student_id": student_id,
            "academic": {"math": 85, "science": 88, "english": 78, "attendance_percentage": 92},
            "skills": {"problem_solving": 8, "logical_thinking": 9, "communication": 7, "creativity": 6, "leadership": 8},
            "interests": {"technology": 9, "medicine": 6, "business": 7, "arts": 4},
            "activities": {"technical": True, "sports": False, "arts": True},
            "career_preference": "Technology",
            "preferred_working_style": "Problem Solving",
            "text_responses": {
                "dream_project": "Build a tech startup providing scalable software solutions for small businesses.",
                "workplace_mindset": "I love taking calculated risks and leading teams to build high impact products.",
                "learning_interests": "Reading startup biographies, business technology podcasts, and programming tutorials."
            },
            "nlp_mindset_scores": {"entrepreneurship": 8.5, "technology": 9.0, "medicine": 4.0, "creative": 6.0, "humanities": 4.0},
            "detected_mindset_tags": ["🚀 Entrepreneurial Mindset", "💻 Tech Builder Mindset"],
            "created_at": datetime.utcnow().isoformat()
        }
    doc["id"] = str(doc.get("_id", doc.get("id")))
    return doc

