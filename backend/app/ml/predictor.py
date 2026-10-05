import os
import joblib
import pandas as pd
import numpy as np
import sys

# Ensure ml package is in path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..")))
from ml.recommendation.engine import RecommendationEngine
from app.services.nlp_mindset import NLPMindsetAnalyzer
from app.database.course_catalog import COURSES_CATALOG

MODELS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "ml", "models"))

class MLPredictorService:
    def __init__(self):
        self.model = None
        self.scaler = None
        self.cluster_model = None
        self.load_models()

    def load_models(self):
        model_path = os.path.join(MODELS_DIR, "performance_model.pkl")
        scaler_path = os.path.join(MODELS_DIR, "scaler.pkl")
        cluster_path = os.path.join(MODELS_DIR, "cluster_model.pkl")

        if os.path.exists(model_path):
            try:
                self.model = joblib.load(model_path)
                self.scaler = joblib.load(scaler_path)
                self.cluster_model = joblib.load(cluster_path)
            except Exception:
                pass

    def predict_performance(self, student_data: dict) -> dict:
        acad = student_data.get('academic', {})
        math = acad.get('math', 75)
        science = acad.get('science', 75)
        english = acad.get('english', 75)
        overall = acad.get('overall_percentage', (math * 0.4 + science * 0.4 + english * 0.2))
        attendance = acad.get('attendance_percentage', 90)

        if self.model and self.scaler:
            try:
                g1 = math / 5.0
                g2 = science / 5.0
                studytime = acad.get('studytime', 2)
                failures = acad.get('failures', 0)
                absences = int(np.clip(93 * (1 - attendance / 100.0), 0, 93))
                
                feat_vec = [studytime, failures, absences, 3, 3, 1, 1, 4, g1, g2, overall, attendance, 80.0]
                scaled = self.scaler.transform([feat_vec])
                pred_g3 = self.model.predict(scaled)[0]
                pred_perc = min(99.0, max(40.0, round((pred_g3 / 20.0) * 100.0, 1)))
            except Exception:
                pred_perc = round(overall, 1)
        else:
            pred_perc = round(overall, 1)

        if pred_perc >= 85:
            letter = "A+"
        elif pred_perc >= 75:
            letter = "A"
        elif pred_perc >= 65:
            letter = "B"
        elif pred_perc >= 55:
            letter = "C"
        else:
            letter = "D"

        strengths = []
        improvements = []

        if math >= 85:
            strengths.append("Mathematics & Quantitative Reasoning")
        elif math < 70:
            improvements.append("Mathematics Problem Solving Practice")

        if science >= 85:
            strengths.append("Scientific Concepts & Analytical Thinking")
        elif science < 70:
            improvements.append("Science Fundamentals & Lab Concepts")

        if attendance < 85:
            improvements.append("Class Attendance & Regularity")

        skills = student_data.get('skills', {})
        if skills.get('communication', 7) < 7:
            improvements.append("Verbal & Written Communication Skills")

        if not strengths:
            strengths.append("Consistent Overall Performance")
        if not improvements:
            improvements.append("Maintain Consistent Study Habits & Advanced Projects")

        return {
            "predicted_grade": pred_perc,
            "confidence_score": 88.5,
            "grade_letter": letter,
            "strengths": strengths,
            "improvement_areas": improvements
        }

    def generate_full_guidance(self, student_data: dict) -> dict:
        nlp_res = NLPMindsetAnalyzer.analyze_responses(student_data.get('text_responses', {}))
        
        # 12th Standard Final Guidance
        final_guidance = RecommendationEngine.generate_final_guidance(student_data, nlp_res, COURSES_CATALOG)
        perf = self.predict_performance(student_data)

        # Legacy 10th compatibility fields
        streams = [
            {"id": "cs", "title": c["course"], "description": c["domain"], "match_score": c["match_score"]}
            for c in final_guidance["top_courses"][:3]
        ]
        careers = [
            {"id": c["career_title"].lower().replace(' ', '_'), "title": c["career_title"], "domain": c["domain"], "match_score": c["readiness_score"], "explanation": f"Matches {c['parent_course']}"}
            for c in final_guidance["top_careers"][:3]
        ]

        return {
            "category": final_guidance["category"],
            "streams": streams,
            "careers": careers,
            "top_courses": final_guidance["top_courses"],
            "top_careers": final_guidance["top_careers"],
            "skill_gaps": final_guidance["skill_gaps"],
            "learning_roadmap": final_guidance["learning_roadmap"],
            "profile_completeness": final_guidance["profile_completeness"],
            "recommendation_confidence": final_guidance["recommendation_confidence"],
            "nlp_analysis": nlp_res,
            "predicted_performance": perf,
            "disclaimer": final_guidance["disclaimer"],
            "model_version": final_guidance["model_version"]
        }

predictor_service = MLPredictorService()
