import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.auth import UserRegister, UserLogin, Token
from app.core.security import get_password_hash, verify_password, create_access_token
from app.database.mongodb import get_database

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register(user_in: UserRegister):
    db_inst = get_database()
    
    # Check duplicate
    if db_inst.is_memory_fallback:
        existing = next((u for u in db_inst.memory_store["users"] if u["email"] == user_in.email), None)
    else:
        existing = db_inst.db.users.find_one({"email": user_in.email})

    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists.")

    hashed = get_password_hash(user_in.password)
    user_doc = {
        "_id": str(uuid.uuid4()),
        "name": user_in.name,
        "email": user_in.email,
        "password": hashed,
        "role": user_in.role,
        "grade": user_in.grade,
        "school": user_in.school,
        "created_at": datetime.utcnow().isoformat()
    }

    if db_inst.is_memory_fallback:
        db_inst.memory_store["users"].append(user_doc)
    else:
        db_inst.db.users.insert_one(user_doc)

    # Initialize default student profile if role is student
    if user_in.role == "student":
        st_doc = {
            "_id": user_doc["_id"],
            "id": user_doc["_id"],
            "name": user_in.name,
            "email": user_in.email,
            "grade": user_in.grade,
            "school": user_in.school,
            "academic": {"math": 80, "science": 85, "english": 80, "attendance_percentage": 92, "overall_percentage": 82.0},
            "skills": {"problem_solving": 8, "logical_thinking": 8, "communication": 7, "creativity": 6, "leadership": 7},
            "interests": {"technology": 8, "medicine": 6, "business": 6, "arts": 4},
            "activities": {"technical": True, "sports": False, "arts": True},
            "career_preference": "Medical Specialist / Doctor",
            "preferred_working_style": "Diagnostic & Problem Solving",
            "created_at": user_doc["created_at"]
        }
        if db_inst.is_memory_fallback:
            db_inst.memory_store["students"].append(st_doc)
        else:
            db_inst.db.students.replace_one({"_id": user_doc["_id"]}, st_doc, upsert=True)

    token = create_access_token(user_doc["_id"])
    user_resp = {k: v for k, v in user_doc.items() if k != "password"}
    user_resp["id"] = user_resp["_id"]
    return {"access_token": token, "token_type": "bearer", "user": user_resp}


@router.post("/login", response_model=Token)
def login(user_in: UserLogin):
    db_inst = get_database()
    
    if db_inst.is_memory_fallback:
        user_doc = next((u for u in db_inst.memory_store["users"] if u["email"] == user_in.email), None)
    else:
        user_doc = db_inst.db.users.find_one({"email": user_in.email})

    if not user_doc or not verify_password(user_in.password, user_doc["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    token = create_access_token(user_doc["_id"])
    user_resp = {k: v for k, v in user_doc.items() if k != "password"}
    user_resp["id"] = str(user_resp["_id"])
    return {"access_token": token, "token_type": "bearer", "user": user_resp}
