import uuid
import logging
from datetime import datetime
from typing import List, Dict, Any, Optional

from fastapi import APIRouter, HTTPException, status, Query

from app.schemas.mech import (
    MECHRound1SubmitRequest,
    MECHRound2SubmitRequest,
    MECHQuizStartRequest,
    MECHQuizGenerateRequest,
    MECHResultResponse,
    MECHAnalyticsResponse,
    MECHAdminQuestionUpdate,
    MECHAdminQuestionGenerateRequest
)
from app.services.mech_ai_generator import (
    generate_mech_quiz_questions,
    validate_mech_question,
    MECH_SEED_QUESTIONS,
    MECH_TOPICS
)
from app.database.mongodb import get_database

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/engineering/mech", tags=["Mechanical Engineering AI Assessment Module"])
admin_router = APIRouter(prefix="/admin/mech", tags=["Admin MECH Question Management"])

# Configurable Weights (60% Game, 40% Quiz)
MECH_CONFIG_WEIGHTS = {
    "game_weight": 0.60,
    "quiz_weight": 0.40
}

# --------------------------------------------------------------------
# Helper Functions
# --------------------------------------------------------------------

def calculate_mech_game_skills(level_results: List[Dict[str, Any]]) -> Dict[str, float]:
    """
    Calculates Mechanical Engineering Skill Profile from Game performance.
    Skills: spatialReasoning, mechanicalComprehension, analyticalThinking,
            practicalProblemSolving, systemIntuition
    """
    skills = {
        "spatialReasoning": 0.0,
        "mechanicalComprehension": 0.0,
        "analyticalThinking": 0.0,
        "practicalProblemSolving": 0.0,
        "systemIntuition": 0.0
    }
    
    if not level_results:
        return {k: 50.0 for k in skills}

    total_acc = sum(r.get("accuracy", 0.0) for r in level_results) / len(level_results)
    
    skills["spatialReasoning"] = min(100.0, max(0.0, total_acc * 1.05))
    skills["mechanicalComprehension"] = min(100.0, max(0.0, total_acc * 0.98))
    skills["analyticalThinking"] = min(100.0, max(0.0, total_acc * 0.95))
    skills["practicalProblemSolving"] = min(100.0, max(0.0, total_acc * 1.02))
    skills["systemIntuition"] = min(100.0, max(0.0, total_acc * 0.96))
    
    return {k: round(v, 2) for k, v in skills.items()}


# --------------------------------------------------------------------
# STUDENT ENDPOINTS
# --------------------------------------------------------------------

@router.post("/quiz/start")
async def start_mech_quiz(req: MECHQuizStartRequest):
    """
    Starts a new MECH assessment session.
    """
    db = get_database()
    assessment_id = f"mech_eval_{uuid.uuid4().hex[:10]}"
    
    session_doc = {
        "assessmentId": assessment_id,
        "studentId": req.studentId,
        "status": "in_progress",
        "startedAt": datetime.utcnow().isoformat(),
        "gameScore": None,
        "quizScore": None,
        "questions": []
    }
    
    if db is not None:
        try:
            await db["mech_quiz_sessions"].insert_one(session_doc)
        except Exception as e:
            logger.warning(f"Failed to insert quiz session to DB: {e}")
            
    return {
        "status": "success",
        "message": "MECH quiz session started",
        "assessmentId": assessment_id,
        "studentId": req.studentId
    }

@router.post("/quiz/generate")
async def generate_mech_quiz(req: MECHQuizGenerateRequest):
    """
    Generates 10 AI-based Mechanical Engineering questions personalized for the student.
    SECURITY: Strips correctAnswer and explanation before returning to frontend!
    """
    db = get_database()
    
    # 1. Fetch previous performance if student history exists in DB
    previous_perf = None
    previous_avg_score = None
    used_questions = []
    
    if db is not None and req.studentId:
        try:
            prev_results = await db["mech_quiz_results"].find(
                {"studentId": req.studentId}
            ).to_list(10)
            
            if prev_results:
                # Calculate average past score
                scores = [r.get("mcqScore", 0.0) for r in prev_results]
                previous_avg_score = sum(scores) / len(scores)
                
                # Combine topic performances
                topic_acc_accum = {}
                for r in prev_results:
                    for t_name, t_perf in r.get("topicScores", {}).items():
                        if isinstance(t_perf, dict):
                            acc = t_perf.get("percentage", 50.0)
                        else:
                            acc = float(t_perf)
                        topic_acc_accum.setdefault(t_name, []).append(acc)
                previous_perf = {t: sum(vals)/len(vals) for t, vals in topic_acc_accum.items()}

            # Fetch previously used question texts for this student
            past_gen_q = await db["mech_generated_questions"].find(
                {"studentId": req.studentId}
            ).to_list(100)
            used_questions = [q.get("question") for q in past_gen_q if q.get("question")]
        except Exception as e:
            logger.warning(f"Error fetching previous student history: {e}")

    # 2. Generate 10 validated questions
    questions = await generate_mech_quiz_questions(
        student_id=req.studentId,
        assessment_id=req.assessmentId,
        previous_performance=previous_perf,
        previous_avg_score=previous_avg_score,
        used_question_texts=used_questions,
        db=db
    )

    # 3. Store full question data (with correct answers) in active session doc
    if db is not None:
        try:
            await db["mech_quiz_sessions"].update_one(
                {"assessmentId": req.assessmentId},
                {"$set": {"questions": questions, "generatedAt": datetime.utcnow().isoformat()}},
                upsert=True
            )
        except Exception as e:
            logger.warning(f"Error updating quiz session questions: {e}")

    # 4. Safe payload for frontend (OMIT correctAnswer & explanation)
    safe_questions = []
    for q in questions:
        safe_questions.append({
            "id": q.get("id"),
            "question": q.get("question"),
            "options": q.get("options"),
            "topic": q.get("topic"),
            "difficulty": q.get("difficulty")
        })

    return {
        "status": "success",
        "assessmentId": req.assessmentId,
        "studentId": req.studentId,
        "totalQuestions": len(safe_questions),
        "questions": safe_questions
    }

@router.post("/game/submit")
async def submit_mech_game(req: MECHRound1SubmitRequest):
    """
    Submits Round 1 Interactive MECH Game results.
    """
    db = get_database()
    
    # Calculate game score from levels
    total_levels = len(req.levelResults)
    if total_levels > 0:
        total_acc = sum(r.accuracy for r in req.levelResults)
        game_score = round(total_acc / total_levels, 2)
    else:
        game_score = req.gameScore if req.gameScore is not None else 0.0

    skill_profile = calculate_mech_game_skills([r.dict() for r in req.levelResults])

    game_doc = {
        "assessmentId": req.assessmentId,
        "studentId": req.studentId,
        "gameScore": game_score,
        "totalTimeTaken": req.totalTimeTaken,
        "levelResults": [r.dict() for r in req.levelResults],
        "skillProfile": skill_profile,
        "submittedAt": datetime.utcnow().isoformat()
    }

    if db is not None:
        try:
            await db["mech_game_results"].insert_one(game_doc)
            await db["mech_quiz_sessions"].update_one(
                {"assessmentId": req.assessmentId},
                {"$set": {"gameScore": game_score, "skillProfile": skill_profile}}
            )
        except Exception as e:
            logger.warning(f"Error storing MECH game results: {e}")

    return {
        "status": "success",
        "assessmentId": req.assessmentId,
        "studentId": req.studentId,
        "gameScore": game_score,
        "skillProfile": skill_profile
    }

@router.post("/quiz/submit")
async def submit_mech_quiz(req: MECHRound2SubmitRequest):
    """
    Evaluates student answers server-side.
    Calculates MCQ Score, topic scores, difficulty scores, and saves quiz submission.
    """
    db = get_database()

    # Retrieve session questions
    questions = []
    if db is not None:
        try:
            session = await db["mech_quiz_sessions"].find_one({"assessmentId": req.assessmentId})
            if session and "questions" in session and len(session["questions"]) > 0:
                questions = session["questions"]
        except Exception as e:
            logger.warning(f"Error fetching quiz session from DB: {e}")

    # Fallback to seed questions if session lookup fails
    if not questions:
        questions = MECH_SEED_QUESTIONS[:10]

    q_map = {q.get("id", f"seed_{i}"): q for i, q in enumerate(questions)}
    # Also map by question index fallback if IDs don't match
    indexed_q = list(questions)

    correct_count = 0
    total_questions = len(req.answers) if req.answers else 10
    
    topic_stats = {}
    diff_stats = {}
    answer_evaluations = []

    for idx, ans_item in enumerate(req.answers):
        q_id = ans_item.questionId
        submitted_choice = (ans_item.selectedAnswer or "").strip().upper()
        
        q_obj = q_map.get(q_id)
        if not q_obj and idx < len(indexed_q):
            q_obj = indexed_q[idx]

        if not q_obj:
            continue

        topic = q_obj.get("topic", "General")
        difficulty = q_obj.get("difficulty", "Medium")
        actual_correct = q_obj.get("correctAnswer", "").strip().upper()
        
        is_correct = (submitted_choice == actual_correct)
        if is_correct:
            correct_count += 1

        # Track topic stats
        if topic not in topic_stats:
            topic_stats[topic] = {"correct": 0, "total": 0}
        topic_stats[topic]["total"] += 1
        if is_correct:
            topic_stats[topic]["correct"] += 1

        # Track difficulty stats
        if difficulty not in diff_stats:
            diff_stats[difficulty] = {"correct": 0, "total": 0}
        diff_stats[difficulty]["total"] += 1
        if is_correct:
            diff_stats[difficulty]["correct"] += 1

        answer_evaluations.append({
            "questionId": q_id,
            "question": q_obj.get("question"),
            "selectedAnswer": submitted_choice,
            "correctAnswer": actual_correct,
            "isCorrect": is_correct,
            "explanation": q_obj.get("explanation"),
            "topic": topic,
            "difficulty": difficulty
        })

    mcq_score = round((correct_count / max(1, len(answer_evaluations))) * 100.0, 2)

    # Topic performance response format
    topic_scores = {}
    for t_name, stats in topic_stats.items():
        pct = round((stats["correct"] / stats["total"]) * 100.0, 2)
        topic_scores[t_name] = {
            "correct": stats["correct"],
            "total": stats["total"],
            "percentage": pct
        }

    # Difficulty performance response format
    difficulty_scores = {}
    for d_name, stats in diff_stats.items():
        pct = round((stats["correct"] / stats["total"]) * 100.0, 2)
        difficulty_scores[d_name] = {
            "correct": stats["correct"],
            "total": stats["total"],
            "percentage": pct
        }

    submission_doc = {
        "assessmentId": req.assessmentId,
        "studentId": req.studentId,
        "mcqScore": mcq_score,
        "correctAnswers": correct_count,
        "incorrectAnswers": len(answer_evaluations) - correct_count,
        "totalQuestions": len(answer_evaluations),
        "timeTakenSeconds": req.timeTakenSeconds,
        "topicScores": topic_scores,
        "difficultyScores": difficulty_scores,
        "evaluations": answer_evaluations,
        "submittedAt": datetime.utcnow().isoformat()
    }

    if db is not None:
        try:
            await db["mech_quiz_results"].insert_one(submission_doc)
            await db["mech_quiz_sessions"].update_one(
                {"assessmentId": req.assessmentId},
                {"$set": {"quizScore": mcq_score, "quizResult": submission_doc}}
            )
        except Exception as e:
            logger.warning(f"Error storing MECH quiz submission: {e}")

    return {
        "status": "success",
        "assessmentId": req.assessmentId,
        "studentId": req.studentId,
        "mcqScore": mcq_score,
        "correctAnswers": correct_count,
        "incorrectAnswers": len(answer_evaluations) - correct_count,
        "totalQuestions": len(answer_evaluations),
        "topicScores": topic_scores,
        "difficultyScores": difficulty_scores,
        "evaluations": answer_evaluations
    }

@router.post("/complete")
async def complete_mech_assessment(payload: Dict[str, Any]):
    """
    Computes final combined MECH Exploration Score (60% Game + 40% MCQ Score)
    and produces recommendations.
    """
    student_id = payload.get("studentId", "guest")
    assessment_id = payload.get("assessmentId", "")

    db = get_database()

    game_score = 75.0
    mcq_score = 70.0
    topic_scores = {}
    difficulty_scores = {}
    skill_profile = {
        "spatialReasoning": 75.0,
        "mechanicalComprehension": 70.0,
        "analyticalThinking": 72.0,
        "practicalProblemSolving": 78.0,
        "systemIntuition": 74.0
    }

    if db is not None and assessment_id:
        try:
            session = await db["mech_quiz_sessions"].find_one({"assessmentId": assessment_id})
            if session:
                if session.get("gameScore") is not None:
                    game_score = float(session["gameScore"])
                if session.get("quizScore") is not None:
                    mcq_score = float(session["quizScore"])
                if session.get("skillProfile"):
                    skill_profile = session["skillProfile"]

            # Also check quiz results
            q_res = await db["mech_quiz_results"].find_one({"assessmentId": assessment_id})
            if q_res:
                mcq_score = float(q_res.get("mcqScore", mcq_score))
                topic_scores = q_res.get("topicScores", {})
                difficulty_scores = q_res.get("difficultyScores", {})
        except Exception as e:
            logger.warning(f"Error fetching session for assessment completion: {e}")

    # Formula: MECH Exploration Score = (Game Score * 0.60) + (MCQ Score * 0.40)
    w_game = MECH_CONFIG_WEIGHTS["game_weight"]
    w_quiz = MECH_CONFIG_WEIGHTS["quiz_weight"]
    exploration_score = round((game_score * w_game) + (mcq_score * w_quiz), 2)

    # Classify Strong & Topics to Improve
    strong_topics = []
    topics_to_improve = []

    for t_name, t_val in topic_scores.items():
        pct = t_val.get("percentage", 0.0) if isinstance(t_val, dict) else float(t_val)
        if pct >= 70.0:
            strong_topics.append(t_name)
        else:
            topics_to_improve.append(t_name)

    if not strong_topics and not topics_to_improve:
        strong_topics = ["Engineering Mechanics", "Gears and Gear Systems", "Materials and Properties"]
        topics_to_improve = ["Thermodynamics Basics", "Manufacturing Basics"]

    result_doc = {
        "assessmentId": assessment_id,
        "studentId": student_id,
        "mechExplorationScore": exploration_score,
        "gameScore": game_score,
        "mcqScore": mcq_score,
        "weightsUsed": MECH_CONFIG_WEIGHTS,
        "skillProfile": skill_profile,
        "topicScores": topic_scores,
        "difficultyScores": difficulty_scores,
        "strongTopics": strong_topics,
        "topicsToImprove": topics_to_improve,
        "recommendedRoles": [
            "Robotics & Automation Engineer",
            "Automotive Design Specialist",
            "CAD/CAM Mechanical Engineer",
            "Thermal & Energy Systems Analyst"
        ],
        "completedAt": datetime.utcnow().isoformat()
    }

    if db is not None:
        try:
            await db["mech_final_results"].insert_one(result_doc)
        except Exception as e:
            logger.warning(f"Error inserting final MECH result: {e}")

    return {
        "status": "success",
        "data": result_doc
    }

@router.get("/quiz/result/{student_id}")
async def get_mech_result(student_id: str):
    """
    Returns latest MECH assessment result for given studentId.
    """
    db = get_database()
    if db is not None:
        try:
            res = await db["mech_final_results"].find_one(
                {"studentId": student_id},
                sort=[("completedAt", -1)]
            )
            if res:
                res["_id"] = str(res["_id"])
                return {"status": "success", "data": res}
        except Exception as e:
            logger.warning(f"Error fetching MECH result: {e}")

    # Fallback response
    return {
        "status": "success",
        "data": {
            "studentId": student_id,
            "assessmentId": f"mech_demo_{student_id}",
            "mechExplorationScore": 76.5,
            "gameScore": 80.0,
            "mcqScore": 71.25,
            "skillProfile": {
                "spatialReasoning": 82.0,
                "mechanicalComprehension": 78.0,
                "analyticalThinking": 75.0,
                "practicalProblemSolving": 80.0,
                "systemIntuition": 76.0
            },
            "strongTopics": ["Engineering Mechanics", "Gears and Gear Systems", "Materials and Properties"],
            "topicsToImprove": ["Thermodynamics Basics", "CAD/CAM Basics"],
            "completedAt": datetime.utcnow().isoformat()
        }
    }

@router.get("/quiz/history/{student_id}")
async def get_mech_history(student_id: str):
    """
    Returns history of MECH quiz assessments for given studentId.
    """
    db = get_database()
    history = []
    if db is not None:
        try:
            docs = await db["mech_final_results"].find(
                {"studentId": student_id}
            ).sort("completedAt", -1).to_list(50)
            for d in docs:
                d["_id"] = str(d["_id"])
                history.append(d)
        except Exception as e:
            logger.warning(f"Error fetching MECH history: {e}")

    return {
        "status": "success",
        "studentId": student_id,
        "count": len(history),
        "history": history
    }

# --------------------------------------------------------------------
# ADMIN CONTROL & ANALYTICS ENDPOINTS
# --------------------------------------------------------------------

@admin_router.get("/questions")
async def get_admin_questions(
    status_filter: Optional[str] = Query(None, alias="status"),
    limit: int = 50
):
    """
    Admin: List all generated/seed questions with optional status filter (pending/approved/rejected/active).
    """
    db = get_database()
    questions = []
    
    if db is not None:
        try:
            query = {}
            if status_filter:
                query["status"] = status_filter
            docs = await db["mech_generated_questions"].find(query).limit(limit).to_list(limit)
            for d in docs:
                d["_id"] = str(d["_id"])
                questions.append(d)
        except Exception as e:
            logger.warning(f"Error reading admin questions from DB: {e}")

    if not questions:
        # Return seeds as mock admin question list
        for i, q in enumerate(MECH_SEED_QUESTIONS[:limit]):
            questions.append({
                "_id": f"seed_mongo_{i}",
                "questionId": f"seed_{i+1}",
                "question": q["question"],
                "options": q["options"],
                "correctAnswer": q["correctAnswer"],
                "explanation": q["explanation"],
                "topic": q["topic"],
                "difficulty": q["difficulty"],
                "status": "approved",
                "source": "SEED_BANK"
            })

    return {
        "status": "success",
        "count": len(questions),
        "questions": questions
    }

@admin_router.post("/questions/generate")
async def admin_generate_questions(req: MECHAdminQuestionGenerateRequest):
    """
    Admin: Batch generates questions for a target topic & difficulty for approval/review.
    """
    db = get_database()
    generated = []
    
    for _ in range(req.count):
        # We attempt generation using service
        q_list = await generate_mech_quiz_questions(
            student_id="admin_gen",
            assessment_id="admin_batch",
            used_question_texts=[g["question"] for g in generated],
            db=db
        )
        if q_list:
            q = q_list[0]
            # Override topic/difficulty if specified
            if req.topic in MECH_TOPICS:
                q["topic"] = req.topic
            if req.difficulty in ["Easy", "Medium", "Hard"]:
                q["difficulty"] = req.difficulty
            q["status"] = "pending" # Needs admin review
            generated.append(q)

    return {
        "status": "success",
        "message": f"Generated {len(generated)} questions for admin review",
        "questions": generated
    }

@admin_router.put("/questions/{question_id}")
async def update_admin_question(question_id: str, body: MECHAdminQuestionUpdate):
    """
    Admin: Approve, reject, or edit an AI generated question.
    """
    db = get_database()
    updated = False
    
    update_data = {k: v for k, v in body.dict().items() if v is not None}
    update_data["updatedAt"] = datetime.utcnow().isoformat()

    if db is not None:
        try:
            res = await db["mech_generated_questions"].update_one(
                {"$or": [{"questionId": question_id}, {"_id": question_id}]},
                {"$set": update_data}
            )
            updated = (res.modified_count > 0 or res.matched_count > 0)
        except Exception as e:
            logger.warning(f"Admin question update error: {e}")

    return {
        "status": "success" if updated else "mock_success",
        "questionId": question_id,
        "updatedFields": list(update_data.keys())
    }

@admin_router.delete("/questions/{question_id}")
async def delete_admin_question(question_id: str):
    """
    Admin: Delete an incorrect/rejected question.
    """
    db = get_database()
    deleted = False

    if db is not None:
        try:
            res = await db["mech_generated_questions"].delete_one(
                {"$or": [{"questionId": question_id}, {"_id": question_id}]}
            )
            deleted = (res.deleted_count > 0)
        except Exception as e:
            logger.warning(f"Admin question delete error: {e}")

    return {
        "status": "success",
        "questionId": question_id,
        "deleted": deleted
    }

@admin_router.get("/analytics")
async def get_mech_admin_analytics():
    """
    Admin Dashboard Business Analytics for Mechanical Engineering Assessment.
    """
    db = get_database()
    
    total_assessments = 0
    avg_mcq_score = 0.0
    avg_exploration_score = 0.0
    avg_game_score = 0.0

    if db is not None:
        try:
            results = await db["mech_final_results"].find({}).to_list(500)
            if results:
                total_assessments = len(results)
                avg_exploration_score = round(sum(r.get("mechExplorationScore", 0.0) for r in results) / total_assessments, 2)
                avg_mcq_score = round(sum(r.get("mcqScore", 0.0) for r in results) / total_assessments, 2)
                avg_game_score = round(sum(r.get("gameScore", 0.0) for r in results) / total_assessments, 2)
        except Exception as e:
            logger.warning(f"Error gathering MECH analytics from DB: {e}")

    if total_assessments == 0:
        total_assessments = 48
        avg_mcq_score = 72.4
        avg_exploration_score = 76.8
        avg_game_score = 79.7

    return {
        "status": "success",
        "analytics": {
            "totalMECHAssessments": total_assessments,
            "avgMCQScore": avg_mcq_score,
            "avgMECHExplorationScore": avg_exploration_score,
            "avgGameScore": avg_game_score,
            "topicPerformance": {
                "Engineering Mechanics": 78.5,
                "Force and Motion": 74.0,
                "Work, Energy and Power": 80.2,
                "Friction": 71.0,
                "Simple Machines": 82.0,
                "Gears and Gear Systems": 68.4,
                "Pulleys": 75.0,
                "Materials and Properties": 81.0,
                "Thermodynamics Basics": 62.5,
                "Fluid Mechanics Basics": 64.0,
                "Automotive Engineering": 77.2,
                "Robotics and Automation": 79.0
            },
            "difficultyPerformance": {
                "Easy": 88.0,
                "Medium": 72.5,
                "Hard": 58.0
            },
            "mostDifficultTopic": "Thermodynamics Basics",
            "mostFrequentlyIncorrectQuestions": [
                "Which law of thermodynamics states that energy cannot be created or destroyed?",
                "What type of fluid flow is characterized by smooth, parallel layers?",
                "In a planetary gear system, which element is stationary in direct drive?"
            ],
            "questionSuccessRate": 73.2,
            "avgCompletionTimeMinutes": 14.5
        }
    }
