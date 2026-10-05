import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException
from app.database.mongodb import get_database
from app.schemas.recommendation import CounsellorReviewRequest

router = APIRouter(prefix="/counsellor", tags=["Counsellor Validation"])

@router.post("/review")
def submit_counsellor_review(req: CounsellorReviewRequest):
    db_inst = get_database()
    doc = req.dict()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.utcnow().isoformat()

    if db_inst.is_memory_fallback:
        db_inst.memory_store["counsellor_reviews"] = [
            r for r in db_inst.memory_store["counsellor_reviews"] if r.get("student_id") != req.student_id
        ]
        db_inst.memory_store["counsellor_reviews"].append(doc)
    else:
        db_inst.db.counsellor_reviews.update_one(
            {"student_id": req.student_id},
            {"$set": doc, "$setOnInsert": {"_id": doc["id"]}},
            upsert=True
        )

    return {"status": "success", "message": "Counsellor review submitted successfully", "review": doc}

@router.get("/reviews/{student_id}")
def get_counsellor_review(student_id: str):
    db_inst = get_database()
    if db_inst.is_memory_fallback:
        rev = next((r for r in db_inst.memory_store["counsellor_reviews"] if r.get("student_id") == student_id), None)
    else:
        rev = db_inst.db.counsellor_reviews.find_one({"student_id": student_id})

    if not rev:
        return {"status": "Pending Review", "comments": "No counsellor validation recorded yet.", "suggested_courses": []}

    rev["id"] = str(rev.get("_id", rev.get("id")))
    return rev
