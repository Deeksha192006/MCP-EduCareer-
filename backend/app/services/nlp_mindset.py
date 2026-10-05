import re
from typing import Dict, List, Any

class NLPMindsetAnalyzer:
    """
    ENGINE 1 — NLP / Career Intent Engine
    Processes open-ended student text answers (dream_project, workplace_mindset,
    learning_interests, preferred_working_style) to extract:
    - Career Intent & Category
    - Subject Interests
    - Extracted Skills & Goals
    - Preferred Work Style
    - Mentioned Technologies, Industries & Professions
    - Confusion points & Areas of Uncertainty
    """

    MINDSET_DICTIONARIES = {
        "entrepreneurship": {
            "keywords": [
                "startup", "business", "venture", "revenue", "profit", "market", "product", 
                "company", "entrepreneur", "ceo", "founder", "investment", "finance", "client",
                "sales", "strategy", "risk", "leadership", "lead", "manage", "launch", "trade",
                "commerce", "negotiate", "scalable", "franchise", "brand", "monetize"
            ],
            "label": "Entrepreneurial & Business Mindset",
            "tag": "🚀 Entrepreneurial Mindset",
            "color": "#f59e0b"
        },
        "technology": {
            "keywords": [
                "code", "coding", "software", "app", "python", "java", "javascript", "react", "ai", 
                "artificial intelligence", "machine learning", "data", "system", "hardware", "robot", 
                "automation", "computer", "developer", "web", "algorithm", "tech", "digital", "program",
                "cyber", "database", "stack", "model", "build", "cloud", "security"
            ],
            "label": "Technology & Engineering Mindset",
            "tag": "💻 Tech Builder Mindset",
            "color": "#6366f1"
        },
        "medicine": {
            "keywords": [
                "doctor", "patient", "cure", "hospital", "medicine", "health", "healthcare",
                "biology", "genetics", "disease", "clinical", "surgery", "bio", "pharma",
                "diagnosis", "treatment", "medical", "anatomy", "vaccine", "research"
            ],
            "label": "Medical & Clinical Mindset",
            "tag": "🩺 Medical Researcher Mindset",
            "color": "#10b981"
        },
        "creative": {
            "keywords": [
                "design", "art", "ui/ux", "draw", "paint", "music", "video", "animation",
                "fashion", "novel", "story", "content", "media", "creative", "graphic",
                "aesthetic", "illustration", "visual", "film", "acting", "figma"
            ],
            "label": "Creative & Design Mindset",
            "tag": "🎨 Creative Innovator Mindset",
            "color": "#ec4899"
        },
        "humanities": {
            "keywords": [
                "psychology", "counseling", "society", "human behavior", "mental health",
                "ethics", "policy", "community", "empathy", "teaching", "history", "social",
                "literature", "welfare", "counselor", "philosophy", "culture", "law", "legal"
            ],
            "label": "Social & Behavioral Mindset",
            "tag": "🧠 Human Behavior & Social Mindset",
            "color": "#8b5cf6"
        }
    }

    TECHNOLOGIES_DICT = ["python", "javascript", "react", "sql", "ai", "machine learning", "figma", "tableau", "excel", "cloud", "cybersecurity", "robotics", "java", "c++", "pytorch"]
    INDUSTRIES_DICT = ["tech", "healthcare", "finance", "education", "design", "media", "e-commerce", "biotech", "legal", "robotics"]
    PROFESSIONS_DICT = ["ai engineer", "software developer", "data scientist", "doctor", "ui/ux designer", "business analyst", "psychologist", "lawyer", "founder", "cybersecurity engineer", "architect"]

    CONFUSION_KEYWORDS = ["confused", "not sure", "uncertain", "undecided", "don't know", "multiple interests", "stuck between", "doubt", "hard to choose", "maybe"]

    @classmethod
    def analyze_responses(cls, text_responses: Dict[str, str]) -> Dict[str, Any]:
        combined_text = " ".join([
            text_responses.get("dream_project", ""),
            text_responses.get("workplace_mindset", ""),
            text_responses.get("learning_interests", ""),
            text_responses.get("preferred_working_style", "")
        ]).lower()

        tokens = re.findall(r'\b[a-z0-9\-/]+\b', combined_text)

        domain_counts = {}
        matched_keywords = {}

        for domain, config in cls.MINDSET_DICTIONARIES.items():
            count = 0
            matches = []
            for kw in config["keywords"]:
                if " " in kw:
                    if kw in combined_text:
                        count += 2
                        matches.append(kw)
                else:
                    kw_count = tokens.count(kw)
                    if kw_count > 0:
                        count += kw_count
                        matches.append(kw)
            
            domain_counts[domain] = count
            matched_keywords[domain] = list(set(matches))

        scores = {}
        detected_tags = []
        summary_bullets = []

        total_words = max(1, len(tokens))

        for domain, count in domain_counts.items():
            config = cls.MINDSET_DICTIONARIES[domain]
            score = 4.0 + min(6.0, count * 1.5)
            scores[domain] = round(score, 1)

            if count >= 2 or score >= 7.0:
                detected_tags.append(config["tag"])
                kws_str = ", ".join(matched_keywords[domain][:4])
                summary_bullets.append(f"{config['label']} ({score}/10): Keywords [{kws_str}]")

        if not detected_tags:
            detected_tags.append("🌱 Balanced Explorer Mindset")
            summary_bullets.append("Balanced Interest Profile across multiple domains.")

        # Extract specific entities
        tech_found = [t for t in cls.TECHNOLOGIES_DICT if t in combined_text]
        ind_found = [i for i in cls.INDUSTRIES_DICT if i in combined_text]
        prof_found = [p for p in cls.PROFESSIONS_DICT if p in combined_text]
        confusion_found = [c for c in cls.CONFUSION_KEYWORDS if c in combined_text]

        # Determine Primary Career Intent
        top_domain = max(scores, key=scores.get) if scores else "technology"
        career_intent = {
            "primary_domain": top_domain.title(),
            "confidence_score": round(scores.get(top_domain, 5.0) * 10, 1),
            "target_professions": prof_found if prof_found else [f"Specialist in {top_domain.title()}"],
            "mentioned_technologies": tech_found,
            "mentioned_industries": ind_found,
            "is_confused": len(confusion_found) > 0,
            "confusion_notes": f"Detected uncertainty markers: {', '.join(confusion_found)}" if confusion_found else "Clear preference indicated."
        }

        return {
            "scores": scores,
            "detected_tags": detected_tags,
            "matched_keywords": matched_keywords,
            "summary_bullets": summary_bullets,
            "career_intent": career_intent,
            "entity_extraction": {
                "technologies": tech_found,
                "industries": ind_found,
                "professions": prof_found,
                "confusion_markers": confusion_found
            },
            "raw_text_length": total_words
        }
