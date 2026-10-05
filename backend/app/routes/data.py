import io
import uuid
import pandas as pd
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.database.mongodb import get_database
from app.ml.predictor import predictor_service

router = APIRouter(prefix="/data", tags=["Data Import"])

@router.post("/upload")
async def upload_student_csv(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed.")

    content = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(content))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid CSV file format: {e}")

    req_cols = ["name", "math", "science", "english"]
    missing = [c for c in req_cols if c not in df.columns]
    if missing:
        raise HTTPException(
            status_code=422,
            detail=f"CSV missing required columns: {missing}. Required columns: {req_cols}"
        )

    db_inst = get_database()
    imported_count = 0

    for _, row in df.iterrows():
        st_id = str(uuid.uuid4())
        math_score = float(row.get("math", 75))
        sci_score = float(row.get("science", 75))
        eng_score = float(row.get("english", 75))
        overall = round((math_score * 0.4 + sci_score * 0.4 + eng_score * 0.2), 1)

        st_doc = {
            "_id": st_id,
            "id": st_id,
            "name": str(row.get("name", f"Imported Student {imported_count+1}")),
            "email": str(row.get("email", f"student_{st_id[:6]}@school.edu")),
            "grade": int(row.get("grade", 10)),
            "school": str(row.get("school", "Gabriel Pereira High School")),
            "academic": {
                "math": math_score,
                "science": sci_score,
                "english": eng_score,
                "overall_percentage": overall,
                "attendance_percentage": float(row.get("attendance", 90))
            },
            "skills": {
                "problem_solving": int(row.get("problem_solving", 7)),
                "logical_thinking": int(row.get("logical_thinking", 7)),
                "communication": int(row.get("communication", 7)),
                "creativity": int(row.get("creativity", 7)),
                "leadership": int(row.get("leadership", 7))
            },
            "interests": {
                "technology": int(row.get("technology", 8)),
                "medicine": int(row.get("medicine", 5)),
                "business": int(row.get("business", 6)),
                "arts": int(row.get("arts", 4))
            },
            "activities": {
                "technical": bool(row.get("technical", True)),
                "sports": bool(row.get("sports", False)),
                "arts": bool(row.get("arts", False))
            },
            "created_at": datetime.utcnow().isoformat()
        }

        guidance = predictor_service.generate_full_guidance(st_doc)
        st_doc["category"] = guidance["category"]
        st_doc["top_stream"] = guidance["streams"][0]["title"]
        st_doc["top_career"] = guidance["careers"][0]["title"]

        if db_inst.is_memory_fallback:
            db_inst.memory_store["students"].append(st_doc)
        else:
            db_inst.db.students.insert_one(st_doc)

        imported_count += 1

    return {
        "status": "success",
        "message": f"Successfully imported {imported_count} student profiles from CSV.",
        "imported_count": imported_count
    }
