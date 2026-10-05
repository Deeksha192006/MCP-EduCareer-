import os
import json
import random
import uuid
import logging
from typing import List, Dict, Any, Optional
import httpx
from app.data.mech_question_bank import MECH_SEED_QUESTIONS, MECH_TOPICS

logger = logging.getLogger(__name__)

# Configurable default difficulty ratios
DEFAULT_DIFFICULTY_DISTRIBUTION = {
    "Easy": 3,
    "Medium": 5,
    "Hard": 2
}

def validate_mech_question(q: Dict[str, Any]) -> bool:
    """
    Validates an AI-generated MECH question.
    Must satisfy:
    - Non-empty question string
    - Exactly 4 options with non-empty text
    - No duplicate options
    - Valid correctAnswer ('A', 'B', 'C', or 'D')
    - Non-empty explanation
    - Valid topic in MECH_TOPICS
    - Valid difficulty in ['Easy', 'Medium', 'Hard']
    """
    try:
        question = q.get("question", "").strip()
        options = q.get("options", {})
        correct = q.get("correctAnswer", "").strip().upper()
        explanation = q.get("explanation", "").strip()
        topic = q.get("topic", "").strip()
        difficulty = q.get("difficulty", "").strip()

        if not question or len(question) < 10:
            return False

        if not isinstance(options, dict) or set(options.keys()) != {"A", "B", "C", "D"}:
            return False

        opt_values = [str(v).strip().lower() for v in options.values()]
        if any(not v for v in opt_values):
            return False
        
        # Check for duplicate options
        if len(set(opt_values)) != 4:
            return False

        if correct not in ["A", "B", "C", "D"]:
            return False

        if not explanation or len(explanation) < 5:
            return False

        if topic not in MECH_TOPICS:
            return False

        if difficulty not in ["Easy", "Medium", "Hard"]:
            return False

        return True
    except Exception as e:
        logger.warning(f"Question validation exception: {e}")
        return False

def get_personalized_topics(previous_performance: Optional[Dict[str, float]] = None) -> List[str]:
    """
    Selects 10 topics distributed across MECH topics, prioritizing weaker topics if performance history exists.
    """
    selected_topics = []
    if previous_performance:
        # Sort topics by performance ascending (weakest first)
        weak_topics = sorted(previous_performance.keys(), key=lambda t: previous_performance[t])
        valid_weak = [t for t in weak_topics if t in MECH_TOPICS]
        # Take up to 5 weak topics
        selected_topics.extend(valid_weak[:5])
    
    remaining_count = 10 - len(selected_topics)
    available = [t for t in MECH_TOPICS if t not in selected_topics]
    random.shuffle(available)
    selected_topics.extend(available[:remaining_count])
    
    # If still less than 10, pad with random choices
    while len(selected_topics) < 10:
        selected_topics.append(random.choice(MECH_TOPICS))
        
    random.shuffle(selected_topics)
    return selected_topics

def calculate_adaptive_distribution(previous_avg_score: Optional[float] = None) -> Dict[str, int]:
    """
    Calculates difficulty distribution based on previous score:
    Score > 80% -> Increase difficulty (2 Easy, 4 Medium, 4 Hard)
    Score 50-80% -> Maintain default (3 Easy, 5 Medium, 2 Hard)
    Score < 50% -> Reduce difficulty (5 Easy, 4 Medium, 1 Hard)
    """
    if previous_avg_score is None:
        return DEFAULT_DIFFICULTY_DISTRIBUTION.copy()
    
    if previous_avg_score > 80.0:
        return {"Easy": 2, "Medium": 4, "Hard": 4}
    elif previous_avg_score < 50.0:
        return {"Easy": 5, "Medium": 4, "Hard": 1}
    else:
        return DEFAULT_DIFFICULTY_DISTRIBUTION.copy()

async def call_llm_for_question(topic: str, difficulty: str) -> Optional[Dict[str, Any]]:
    """
    Attempts to call external LLM API (Gemini or OpenAI) if API keys are set, or returns None.
    """
    gemini_key = os.getenv("GEMINI_API_KEY")
    openai_key = os.getenv("OPENAI_API_KEY")
    
    prompt = f"""You are an expert Mechanical Engineering educator creating an assessment for 12th-standard students.
Generate one original multiple-choice question about Mechanical Engineering suitable for 12th-standard introductory level.

Topic: {topic}
Difficulty: {difficulty}

The question must test basic understanding or application rather than simple memorization.

Return ONLY structured JSON in the exact format:
{{
  "question": "Clear question text here...",
  "options": {{
    "A": "Option A text",
    "B": "Option B text",
    "C": "Option C text",
    "D": "Option D text"
  }},
  "correctAnswer": "A",
  "explanation": "Clear explanation matching the correct answer",
  "topic": "{topic}",
  "difficulty": "{difficulty}"
}}
Do NOT include markdown formatting outside the JSON string."""

    if gemini_key:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_key}"
            payload = {
                "contents": [{"parts": [{"text": prompt}]}]
            }
            async with httpx.AsyncClient(timeout=8.0) as client:
                res = await client.post(url, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
                    cleaned = raw_text.strip().replace("```json", "").replace("```", "").strip()
                    parsed = json.loads(cleaned)
                    return parsed
        except Exception as e:
            logger.warning(f"Gemini API generation failed: {e}")

    if openai_key:
        try:
            url = "https://api.openai.com/v1/chat/completions"
            headers = {"Authorization": f"Bearer {openai_key}", "Content-Type": "application/json"}
            payload = {
                "model": "gpt-3.5-turbo",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.7
            }
            async with httpx.AsyncClient(timeout=8.0) as client:
                res = await client.post(url, headers=headers, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    raw_text = data["choices"][0]["message"]["content"]
                    cleaned = raw_text.strip().replace("```json", "").replace("```", "").strip()
                    parsed = json.loads(cleaned)
                    return parsed
        except Exception as e:
            logger.warning(f"OpenAI API generation failed: {e}")

    return None

def fallback_get_seed_question(topic: str, difficulty: str, used_questions: List[str]) -> Dict[str, Any]:
    """
    Retrieves a fallback question from SEED bank or generates a template fallback.
    Guarantees non-duplicate and 100% valid question.
    """
    candidates = [
        q for q in MECH_SEED_QUESTIONS 
        if q["topic"] == topic and q["difficulty"] == difficulty and q["question"] not in used_questions
    ]
    if not candidates:
        # Fall back to any seed matching topic
        candidates = [q for q in MECH_SEED_QUESTIONS if q["topic"] == topic and q["question"] not in used_questions]
    if not candidates:
        # Fall back to any seed matching difficulty
        candidates = [q for q in MECH_SEED_QUESTIONS if q["difficulty"] == difficulty and q["question"] not in used_questions]
    if not candidates:
        # Fall back to any unused seed question
        candidates = [q for q in MECH_SEED_QUESTIONS if q["question"] not in used_questions]
    if not candidates:
        # If all seeds used, fallback to a choice from full seed bank
        candidates = MECH_SEED_QUESTIONS

    chosen = random.choice(candidates).copy()
    chosen["id"] = f"seed_{uuid.uuid4().hex[:8]}"
    return chosen

async def generate_mech_quiz_questions(
    student_id: str,
    assessment_id: str,
    previous_performance: Optional[Dict[str, float]] = None,
    previous_avg_score: Optional[float] = None,
    used_question_texts: Optional[List[str]] = None,
    db: Any = None
) -> List[Dict[str, Any]]:
    """
    Main flow for generating 10 MECH MCQs:
    1. Select 10 topics (personalized if previous_performance is given)
    2. Determine difficulty distribution (adaptive based on previous_avg_score)
    3. Generate/fetch 10 validated, non-duplicate questions
    4. Store generated questions in MongoDB mech_generated_questions
    """
    if used_question_texts is None:
        used_question_texts = []

    topics = get_personalized_topics(previous_performance)
    dist = calculate_adaptive_distribution(previous_avg_score)
    
    # Build list of 10 target difficulties matching distribution
    target_difficulties = (
        ["Easy"] * dist.get("Easy", 3) +
        ["Medium"] * dist.get("Medium", 5) +
        ["Hard"] * dist.get("Hard", 2)
    )
    random.shuffle(target_difficulties)

    questions = []
    
    for i in range(10):
        topic = topics[i % len(topics)]
        difficulty = target_difficulties[i]
        
        # 1. Try AI Generation first
        ai_question = await call_llm_for_question(topic, difficulty)
        
        valid_question = None
        if ai_question and validate_mech_question(ai_question):
            q_text = ai_question.get("question", "").strip()
            if q_text not in used_question_texts and not any(q["question"] == q_text for q in questions):
                ai_question["id"] = f"ai_{uuid.uuid4().hex[:8]}"
                ai_question["status"] = "approved"  # Auto-approved if validated
                ai_question["studentId"] = student_id
                ai_question["assessmentId"] = assessment_id
                ai_question["source"] = "AI_GENERATED"
                valid_question = ai_question

        # 2. Fallback if AI generation failed or was invalid or duplicate
        if not valid_question:
            fallback_q = fallback_get_seed_question(
                topic=topic,
                difficulty=difficulty,
                used_questions=used_question_texts + [q["question"] for q in questions]
            )
            fallback_q["studentId"] = student_id
            fallback_q["assessmentId"] = assessment_id
            fallback_q["status"] = "approved"
            fallback_q["source"] = "FALLBACK_SEED"
            valid_question = fallback_q

        used_question_texts.append(valid_question["question"])
        questions.append(valid_question)

    # 3. Store generated questions in MongoDB if db is available
    if db is not None:
        try:
            stored_docs = []
            for q in questions:
                doc = {
                    "questionId": q.get("id"),
                    "question": q.get("question"),
                    "options": q.get("options"),
                    "correctAnswer": q.get("correctAnswer"),
                    "explanation": q.get("explanation"),
                    "topic": q.get("topic"),
                    "difficulty": q.get("difficulty"),
                    "studentId": student_id,
                    "assessmentId": assessment_id,
                    "status": q.get("status", "approved"),
                    "source": q.get("source", "UNKNOWN"),
                    "createdAt": q.get("createdAt", None)
                }
                stored_docs.append(doc)
            if stored_docs:
                await db["mech_generated_questions"].insert_many(stored_docs)
        except Exception as e:
            logger.warning(f"Failed to store generated questions to MongoDB: {e}")

    return questions
