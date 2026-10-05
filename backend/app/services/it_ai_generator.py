import os
import json
import random
import uuid
import logging
from typing import List, Dict, Any, Optional
import httpx
from app.data.it_question_bank import IT_SEED_QUESTIONS, IT_TOPICS

logger = logging.getLogger(__name__)

# Configurable default difficulty ratios
DEFAULT_DIFFICULTY_DISTRIBUTION = {
    "Easy": 3,
    "Medium": 5,
    "Hard": 2
}

def validate_it_question(q: Dict[str, Any]) -> bool:
    """
    Validates an AI-generated IT question.
    Must satisfy:
    - Non-empty question string (at least 10 chars)
    - Exactly 4 options (A, B, C, D) with non-empty text
    - No duplicate options
    - Valid correctAnswer ('A', 'B', 'C', or 'D')
    - Non-empty explanation
    - Valid topic in IT_TOPICS
    - Valid difficulty in ['Easy', 'Medium', 'Hard']
    - Suitable for 12th-standard introductory IT exploration
    """
    try:
        question = str(q.get("question", "")).strip()
        options = q.get("options", {})
        correct = str(q.get("correctAnswer", "")).strip().upper()
        explanation = str(q.get("explanation", "")).strip()
        topic = str(q.get("topic", "")).strip()
        difficulty = str(q.get("difficulty", "")).strip()

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

        if topic not in IT_TOPICS:
            return False

        if difficulty not in ["Easy", "Medium", "Hard"]:
            return False

        return True
    except Exception as e:
        logger.warning(f"IT Question validation exception: {e}")
        return False

def get_personalized_topics(previous_performance: Optional[Dict[str, float]] = None) -> List[str]:
    """
    Selects 10 topics distributed across IT topics, prioritizing weaker topics if performance history exists.
    """
    selected_topics = []
    if previous_performance:
        # Sort topics by performance ascending (weakest first)
        weak_topics = sorted(previous_performance.keys(), key=lambda t: previous_performance[t])
        valid_weak = [t for t in weak_topics if t in IT_TOPICS]
        # Take up to 5 weak topics
        selected_topics.extend(valid_weak[:5])
    
    remaining_count = 10 - len(selected_topics)
    available = [t for t in IT_TOPICS if t not in selected_topics]
    random.shuffle(available)
    selected_topics.extend(available[:remaining_count])
    
    # If still less than 10, pad with random choices from IT_TOPICS
    while len(selected_topics) < 10:
        selected_topics.append(random.choice(IT_TOPICS))
        
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
    Attempts to call external LLM API if API key is present.
    """
    gemini_key = os.getenv("GEMINI_API_KEY")
    openai_key = os.getenv("OPENAI_API_KEY")
    
    prompt = f"""You are an expert Information Technology educator creating an assessment for 12th-standard students.
Generate one original multiple-choice question about '{topic}' at '{difficulty}' difficulty.

Respond ONLY with a valid JSON object matching this schema:
{{
    "question": "Clear, unambiguous question text",
    "options": {{
        "A": "Option text A",
        "B": "Option text B",
        "C": "Option text C",
        "D": "Option text D"
    }},
    "correctAnswer": "A",
    "explanation": "Clear, educational explanation of why the answer is correct",
    "topic": "{topic}",
    "difficulty": "{difficulty}"
}}
"""

    if gemini_key:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_key}"
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"temperature": 0.4, "responseMimeType": "application/json"}
            }
            async with httpx.AsyncClient(timeout=8.0) as client:
                resp = await client.post(url, json=payload)
                if resp.status_code == 200:
                    res_json = resp.json()
                    text = res_json['candidates'][0]['content']['parts'][0]['text']
                    q_data = json.loads(text)
                    if validate_it_question(q_data):
                        return q_data
        except Exception as e:
            logger.warning(f"Gemini API generation failed for IT: {e}")

    if openai_key:
        try:
            url = "https://api.openai.com/v1/chat/completions"
            headers = {"Authorization": f"Bearer {openai_key}", "Content-Type": "application/json"}
            payload = {
                "model": "gpt-3.5-turbo",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.4,
                "response_format": {"type": "json_object"}
            }
            async with httpx.AsyncClient(timeout=8.0) as client:
                resp = await client.post(url, headers=headers, json=payload)
                if resp.status_code == 200:
                    res_json = resp.json()
                    content = res_json['choices'][0]['message']['content']
                    q_data = json.loads(content)
                    if validate_it_question(q_data):
                        return q_data
        except Exception as e:
            logger.warning(f"OpenAI API generation failed for IT: {e}")

    return None

async def generate_it_quiz_questions(
    student_id: str,
    assessment_id: str,
    previous_performance: Optional[Dict[str, float]] = None,
    previous_avg_score: Optional[float] = None,
    used_questions: Optional[List[str]] = None,
    custom_distribution: Optional[Dict[str, int]] = None
) -> List[Dict[str, Any]]:
    """
    Generates 10 IT questions personalized by student performance and difficulty distribution.
    Uses AI generation with fallback to IT_SEED_QUESTIONS. Avoids previously used questions for the student.
    """
    used_q_texts = set(used_questions or [])
    diff_dist = custom_distribution or calculate_adaptive_distribution(previous_avg_score)
    topics = get_personalized_topics(previous_performance)
    
    # Expand requested difficulty list
    difficulty_queue = []
    for diff, count in diff_dist.items():
        difficulty_queue.extend([diff] * count)
    random.shuffle(difficulty_queue)

    final_questions = []

    for i in range(10):
        topic = topics[i % len(topics)]
        difficulty = difficulty_queue[i % len(difficulty_queue)]

        # Try LLM first
        llm_q = await call_llm_for_question(topic, difficulty)
        if llm_q and llm_q["question"] not in used_q_texts:
            llm_q["id"] = f"it_gen_{uuid.uuid4().hex[:8]}"
            llm_q["status"] = "approved"
            final_questions.append(llm_q)
            used_q_texts.add(llm_q["question"])
            continue

        # Fallback to seed questions matching topic or difficulty
        matching_seeds = [
            q for q in IT_SEED_QUESTIONS
            if q["question"] not in used_q_texts and validate_it_question(q)
        ]
        
        # Priority match: topic & difficulty
        p1 = [q for q in matching_seeds if q["topic"] == topic and q["difficulty"] == difficulty]
        p2 = [q for q in matching_seeds if q["topic"] == topic]
        p3 = [q for q in matching_seeds if q["difficulty"] == difficulty]

        chosen_seed = None
        if p1:
            chosen_seed = random.choice(p1)
        elif p2:
            chosen_seed = random.choice(p2)
        elif p3:
            chosen_seed = random.choice(p3)
        elif matching_seeds:
            chosen_seed = random.choice(matching_seeds)
        else:
            # Re-use from IT_SEED_QUESTIONS if pool exhausted
            chosen_seed = random.choice(IT_SEED_QUESTIONS)

        seed_copy = dict(chosen_seed)
        if not seed_copy.get("id") or seed_copy["id"] in [q.get("id") for q in final_questions]:
            seed_copy["id"] = f"it_seed_{uuid.uuid4().hex[:8]}"
        
        final_questions.append(seed_copy)
        used_q_texts.add(seed_copy["question"])

    return final_questions
