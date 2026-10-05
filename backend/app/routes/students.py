import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status
from app.schemas.student import StudentCreate, StudentResponse
from app.database.mongodb import get_database
from app.ml.predictor import predictor_service

router = APIRouter(prefix="/students", tags=["Students"])

@router.post("", response_model=StudentResponse, status_code=201)
def create_student(student_in: StudentCreate):
    db_inst = get_database()
    st_dict = student_in.dict()
    
    st_id = str(uuid.uuid4())
    st_dict["_id"] = st_id
    st_dict["id"] = st_id
    st_dict["created_at"] = datetime.utcnow().isoformat()

    # Precalculate overall percentage if missing
    acad = st_dict.get("academic", {})
    if not acad.get("overall_percentage"):
        acad["overall_percentage"] = round((acad.get("math", 75)*0.4 + acad.get("science", 75)*0.4 + acad.get("english", 75)*0.2), 1)

    # Compute classification & guidance
    guidance = predictor_service.generate_full_guidance(st_dict)
    st_dict["category"] = guidance["category"]
    st_dict["top_stream"] = guidance["streams"][0]["title"] if guidance["streams"] else "Computer Science"
    st_dict["top_career"] = guidance["careers"][0]["title"] if guidance["careers"] else "Software Developer"

    if db_inst.is_memory_fallback:
        db_inst.memory_store["students"].append(st_dict)
        # Store prediction history
        db_inst.memory_store["predictions"].append({
            "student_id": st_id,
            "guidance": guidance,
            "created_at": st_dict["created_at"]
        })
    else:
        db_inst.db.students.insert_one(st_dict)
        db_inst.db.predictions.insert_one({
            "student_id": st_id,
            "guidance": guidance,
            "created_at": st_dict["created_at"]
        })

    return st_dict

@router.get("", response_model=List[StudentResponse])
def list_students(limit: int = 50):
    db_inst = get_database()
    if db_inst.is_memory_fallback:
        return db_inst.memory_store["students"][:limit]
    else:
        docs = list(db_inst.db.students.find().limit(limit))
        for d in docs:
            d["id"] = str(d["_id"])
        return docs

@router.get("/{student_id}", response_model=StudentResponse)
def get_student(student_id: str):
    db_inst = get_database()
    st = None
    if db_inst.is_memory_fallback:
        st = next((s for s in db_inst.memory_store["students"] if str(s.get("id")) == student_id or str(s.get("_id")) == student_id), None)
    else:
        st = db_inst.db.students.find_one({"_id": student_id})
    
    if not st:
        # Fallback profile for new registered users before initial assessment submit
        user_doc = None
        if db_inst.is_memory_fallback:
            user_doc = next((u for u in db_inst.memory_store["users"] if str(u.get("_id")) == student_id or str(u.get("id")) == student_id), None)
        else:
            user_doc = db_inst.db.users.find_one({"_id": student_id})

        st = {
            "id": student_id,
            "_id": student_id,
            "name": user_doc.get("name", "Student User") if user_doc else "Student User",
            "email": user_doc.get("email", "student@school.edu") if user_doc else "student@school.edu",
            "grade": user_doc.get("grade", 10) if user_doc else 10,
            "school": user_doc.get("school", "Gabriel Pereira High School") if user_doc else "Gabriel Pereira High School",
            "academic": {"math": 80, "science": 85, "english": 80, "attendance_percentage": 92, "overall_percentage": 82.0},
            "skills": {"problem_solving": 8, "logical_thinking": 8, "communication": 7, "creativity": 6, "leadership": 7},
            "interests": {"technology": 8, "medicine": 6, "business": 6, "arts": 4},
            "activities": {"technical": True, "sports": False, "arts": True},
            "career_preference": "Medical Specialist / Doctor",
            "preferred_working_style": "Diagnostic & Problem Solving"
        }
        guidance = predictor_service.generate_full_guidance(st)
        st["category"] = guidance["category"]
        st["top_stream"] = guidance["streams"][0]["title"]
        st["top_career"] = guidance["careers"][0]["title"]

    st["id"] = str(st.get("_id", st.get("id")))
    return st

@router.put("/{student_id}", response_model=StudentResponse)
def update_student(student_id: str, student_in: StudentCreate):
    db_inst = get_database()
    st_dict = student_in.dict()
    st_dict["id"] = student_id
    st_dict["_id"] = student_id
    st_dict["updated_at"] = datetime.utcnow().isoformat()

    guidance = predictor_service.generate_full_guidance(st_dict)
    st_dict["category"] = guidance["category"]
    st_dict["top_stream"] = guidance["streams"][0]["title"]
    st_dict["top_career"] = guidance["careers"][0]["title"]

    st_dict["created_at"] = st_dict.get("created_at") or datetime.utcnow().isoformat()

    if db_inst.is_memory_fallback:
        idx = next((i for i, s in enumerate(db_inst.memory_store["students"]) if str(s.get("id")) == student_id or str(s.get("_id")) == student_id), None)
        if idx is not None:
            st_dict["created_at"] = db_inst.memory_store["students"][idx].get("created_at", st_dict["created_at"])
            db_inst.memory_store["students"][idx] = st_dict
        else:
            db_inst.memory_store["students"].append(st_dict)
    else:
        existing_st = db_inst.db.students.find_one({"_id": student_id})
        if existing_st and existing_st.get("created_at"):
            st_dict["created_at"] = existing_st["created_at"]
        db_inst.db.students.replace_one({"_id": student_id}, st_dict, upsert=True)

    return st_dict


