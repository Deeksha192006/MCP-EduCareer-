import uuid
import logging
from datetime import datetime
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, status

from app.schemas.written_assessment import (
    WrittenTestSubmitRequest,
    WrittenTestResponse
)
from app.data.data_science_written_bank import DATA_SCIENCE_WRITTEN_QUESTIONS
from app.data.psychology_written_bank import PSYCHOLOGY_WRITTEN_QUESTIONS
from app.data.bba_written_bank import BBA_WRITTEN_QUESTIONS
from app.data.env_science_written_bank import ENV_SCIENCE_WRITTEN_QUESTIONS
from app.data.journalism_written_bank import JOURNALISM_WRITTEN_QUESTIONS
from app.data.commerce_written_banks import COMMERCE_WRITTEN_BANKS
from app.database.mongodb import get_database

logger = logging.getLogger("uvicorn.error")

router = APIRouter(prefix="/arts-science/written-test", tags=["Arts & Science / Commerce — Written Conceptual Assessments"])

COURSE_BANKS = {
    "data-science": {
        "courseName": "B.Sc Data Science & Analytics",
        "collection": "data_science_assessments",
        "questions": DATA_SCIENCE_WRITTEN_QUESTIONS
    },
    "psychology": {
        "courseName": "B.Sc Psychology",
        "collection": "psychology_assessments",
        "questions": PSYCHOLOGY_WRITTEN_QUESTIONS
    },
    "bba": {
        "courseName": "BBA (Bachelor of Business Administration)",
        "collection": "bba_assessments",
        "questions": BBA_WRITTEN_QUESTIONS
    },
    "environmental-science": {
        "courseName": "B.Sc Environmental Science",
        "collection": "environmental_assessments",
        "questions": ENV_SCIENCE_WRITTEN_QUESTIONS
    },
    "journalism": {
        "courseName": "BA Journalism & Mass Communication",
        "collection": "journalism_assessments",
        "questions": JOURNALISM_WRITTEN_QUESTIONS
    },
    # Commerce & Accounting Stream
    **COMMERCE_WRITTEN_BANKS
}

@router.get("/{course_key}/questions")
def get_written_test_questions(course_key: str):
    """
    Returns sanitized written assessment questions for the course.
    Correct answers are scrubbed to prevent client-side inspection.
    """
    bank_info = COURSE_BANKS.get(course_key)
    if not bank_info:
        raise HTTPException(
            status_code=404,
            detail=f"Course key '{course_key}' not recognized. Available: {list(COURSE_BANKS.keys())}"
        )

    safe_questions = []
    for q in bank_info["questions"]:
        safe_q = {
            "id": q["id"],
            "topic": q.get("topic", "General"),
            "question": q["question"],
            "options": q["options"],
            "difficulty": q.get("difficulty", "medium"),
            "conceptTested": q.get("conceptTested", "")
        }
        safe_questions.append(safe_q)

    return {
        "courseKey": course_key,
        "courseName": bank_info["courseName"],
        "totalQuestions": len(safe_questions),
        "questions": safe_questions
    }

@router.post("/{course_key}/submit", response_model=WrittenTestResponse)
def submit_written_test(course_key: str, req: WrittenTestSubmitRequest):
    """
    Validates answers on the server against ground-truth keys.
    Computes normalized score (0–100), topic breakdowns, and stores result securely.
    """
    bank_info = COURSE_BANKS.get(course_key)
    if not bank_info:
        raise HTTPException(status_code=404, detail=f"Course key '{course_key}' not found.")

    questions = bank_info["questions"]
    q_map = {q["id"]: q for q in questions}

    correct_count = 0
    topic_totals: Dict[str, int] = {}
    topic_correct: Dict[str, int] = {}
    difficulty_totals: Dict[str, int] = {}
    difficulty_correct: Dict[str, int] = {}

    processed_answers = []

    for item in req.answers:
        q = q_map.get(item.questionId)
        if not q:
            continue

        is_corr = (item.selectedAnswer.strip() == q["correctAnswer"].strip())
        if is_corr:
            correct_count += 1

        top = q.get("topic", "General")
        diff = q.get("difficulty", "medium")

        topic_totals[top] = topic_totals.get(top, 0) + 1
        if is_corr:
            topic_correct[top] = topic_correct.get(top, 0) + 1

        difficulty_totals[diff] = difficulty_totals.get(diff, 0) + 1
        if is_corr:
            difficulty_correct[diff] = difficulty_correct.get(diff, 0) + 1

        processed_answers.append({
            "questionId": item.questionId,
            "topic": top,
            "difficulty": diff,
            "selectedAnswer": item.selectedAnswer,
            "correctAnswer": q["correctAnswer"],
            "isCorrect": is_corr,
            "conceptTested": q.get("conceptTested", ""),
            "timeTaken": item.timeTaken
        })

    num_q = max(1, len(questions))
    normalized_score = round((correct_count / num_q) * 100.0, 1)

    topic_scores = {
        top: round((topic_correct.get(top, 0) / tot) * 100.0, 1)
        for top, tot in topic_totals.items()
    }
    difficulty_scores = {
        diff: round((difficulty_correct.get(diff, 0) / tot) * 100.0, 1)
        for diff, tot in difficulty_totals.items()
    }

    db_inst = get_database()
    now_iso = datetime.utcnow().isoformat()

    doc = {
        "id": f"wt-{course_key}-{req.studentId}",
        "studentId": req.studentId,
        "courseKey": course_key,
        "courseName": bank_info["courseName"],
        "score": normalized_score,
        "correctCount": correct_count,
        "totalQuestions": num_q,
        "topicScores": topic_scores,
        "difficultyScores": difficulty_scores,
        "completed": True,
        "completedAt": now_iso,
        "created_at": now_iso,
        "answers": processed_answers
    }

    # Store in dedicated written_assessments collection
    if db_inst.is_memory_fallback:
        if "written_assessments" not in db_inst.memory_store:
            db_inst.memory_store["written_assessments"] = []
        db_inst.memory_store["written_assessments"] = [
            w for w in db_inst.memory_store["written_assessments"]
            if not (w.get("studentId") == req.studentId and w.get("courseKey") == course_key)
        ]
        db_inst.memory_store["written_assessments"].append(doc)
    else:
        db_inst.db.written_assessments.replace_one(
            {"studentId": req.studentId, "courseKey": course_key},
            doc,
            upsert=True
        )

    # Also record written test score into course assessment document for unified lookup
    course_col = bank_info["collection"]
    if db_inst.is_memory_fallback:
        if course_col in db_inst.memory_store:
            c_doc = next((a for a in db_inst.memory_store[course_col] if a.get("studentId") == req.studentId), None)
            if c_doc:
                c_doc["writtenTestScore"] = normalized_score
                c_doc["writtenTestCompleted"] = True
                c_doc["writtenTestCompletedAt"] = now_iso
    else:
        db_inst.db[course_col].update_one(
            {"studentId": req.studentId},
            {"$set": {
                "writtenTestScore": normalized_score,
                "writtenTestCompleted": True,
                "writtenTestCompletedAt": now_iso
            }}
        )

    return doc

@router.get("/{course_key}/result/{student_id}", response_model=WrittenTestResponse)
def get_written_test_result(course_key: str, student_id: str):
    bank_info = COURSE_BANKS.get(course_key)
    if not bank_info:
        raise HTTPException(status_code=404, detail="Course not recognized")

    db_inst = get_database()
    doc = None
    if db_inst.is_memory_fallback:
        doc = next(
            (w for w in db_inst.memory_store.get("written_assessments", [])
             if w.get("studentId") == student_id and w.get("courseKey") == course_key),
            None
        )
    else:
        doc = db_inst.db.written_assessments.find_one({"studentId": student_id, "courseKey": course_key})

    if not doc:
        raise HTTPException(status_code=404, detail="Written test not found for this student and course.")

    return doc
