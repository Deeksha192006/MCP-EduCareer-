from typing import List, Dict, Any, Optional
from app.core.weight_config import weight_config, ScoreRangeError
from app.database.mongodb import get_database

COMMERCE_COURSES_SPEC = [
    {
        "courseKey": "bcom-accfinance",
        "courseId": "course-bcom-accfinance",
        "courseName": "B.Com. Accounting and Finance",
        "gameKey": "finance-master",
        "gameName": "Finance Master",
        "gameCollection": "commerce_finance_master_assessments",
        "writtenKey": "bcom-accfinance",
        "writtenCollection": "commerce_accfinance_written_assessments",
        "domain": "Accounting, Auditing & Financial Reporting",
        "keySkills": ["Numerical Reasoning", "Accounting Knowledge", "Accuracy", "Logical Reasoning", "Attention to Detail"],
        "careerRoles": ["Chartered Accountant (CA)", "Financial Analyst", "Audit Associate", "Management Accountant", "Corporate Controller"]
    },
    {
        "courseKey": "bcom-bankins",
        "courseId": "course-bcom-bankins",
        "courseName": "B.Com. Banking and Insurance",
        "gameKey": "banking-quest",
        "gameName": "Banking Quest",
        "gameCollection": "commerce_banking_quest_assessments",
        "writtenKey": "bcom-bankins",
        "writtenCollection": "commerce_bankins_written_assessments",
        "domain": "Banking Operations, Credit & Risk Management",
        "keySkills": ["Financial Literacy", "Numerical Reasoning", "Customer Problem-Solving", "Decision-Making", "Risk Awareness"],
        "careerRoles": ["Bank Probationary Officer", "Credit & Loan Underwriter", "Insurance Risk Actuary", "Wealth Management Consultant", "Treasury Executive"]
    },
    {
        "courseKey": "bcom-tax",
        "courseId": "course-bcom-tax",
        "courseName": "B.Com. Taxation",
        "gameKey": "tax-detective",
        "gameName": "Tax Detective",
        "gameCollection": "commerce_tax_detective_assessments",
        "writtenKey": "bcom-tax",
        "writtenCollection": "commerce_tax_written_assessments",
        "domain": "Direct & Indirect Taxation, GST & Audit Forensics",
        "keySkills": ["Numerical Accuracy", "Attention to Detail", "Rule-Based Reasoning", "Analytical Thinking", "Tax Concepts"],
        "careerRoles": ["Tax Consultant", "GST Practitioner", "Corporate Tax Analyst", "Revenue & Customs Officer", "Audit & Assurance Associate"]
    },
    {
        "courseKey": "bcom-corpsec",
        "courseId": "course-bcom-corpsec",
        "courseName": "B.Com. Corporate Secretaryship",
        "gameKey": "corporate-decision",
        "gameName": "Corporate Decision Challenge",
        "gameCollection": "commerce_corporate_decision_assessments",
        "writtenKey": "bcom-corpsec",
        "writtenCollection": "commerce_corpsec_written_assessments",
        "domain": "Corporate Governance, Company Law & Secretarial Practice",
        "keySkills": ["Attention to Detail", "Organizational Thinking", "Ethical Reasoning", "Communication", "Decision-Making"],
        "careerRoles": ["Company Secretary (CS)", "Corporate Governance Officer", "Legal & Compliance Manager", "Boardroom Administrator", "Secretarial Auditor"]
    },
    {
        "courseKey": "bba-tycoon",
        "courseId": "course-bba-tycoon",
        "courseName": "BBA",
        "gameKey": "business-tycoon",
        "gameName": "Business Tycoon",
        "gameCollection": "commerce_business_tycoon_assessments",
        "writtenKey": "bba-tycoon",
        "writtenCollection": "commerce_bba_tycoon_written_assessments",
        "domain": "Strategic Enterprise Management & Entrepreneurship",
        "keySkills": ["Strategic Thinking", "Business Reasoning", "Resource Management", "Creativity", "Decision-Making"],
        "careerRoles": ["Startup Founder / Entrepreneur", "Operations Manager", "Business Development Executive", "Product Strategist", "Management Consultant"]
    }
]

class CommerceRecommendationService:
    """
    Computes course recommendations for the Commerce & Accounting stream:
      Final Course Match Score = (Game Score * 0.75) + (Written Test Score * 0.25)
    Strictly isolated per course. If either assessment is missing, does not assign silent zeros;
    marks status as INCOMPLETE.
    """

    @classmethod
    def get_student_assessment_records(cls, student_id: str) -> Dict[str, Any]:
        db_inst = get_database()

        def fetch_doc(col_name: str, query: dict):
            if db_inst.is_memory_fallback:
                items = db_inst.memory_store.get(col_name, [])
                return next((it for it in items if all(it.get(k) == v for k, v in query.items())), None)
            else:
                return db_inst.db[col_name].find_one(query)

        records = {}
        for spec in COMMERCE_COURSES_SPEC:
            game_doc = fetch_doc(spec["gameCollection"], {"studentId": student_id, "completed": True})
            written_doc = fetch_doc("written_assessments", {"studentId": student_id, "courseKey": spec["writtenKey"], "completed": True})
            if not written_doc:
                written_doc = fetch_doc(spec.get("writtenCollection", ""), {"studentId": student_id, "completed": True})
            
            # If written assessment was saved inside the game document
            if not written_doc and game_doc and game_doc.get("writtenTestCompleted"):
                written_doc = {
                    "studentId": student_id,
                    "courseKey": spec["writtenKey"],
                    "score": game_doc.get("writtenTestScore", 0.0),
                    "completed": True
                }

            records[spec["courseKey"]] = {
                "game": game_doc if (game_doc and game_doc.get("completed")) else None,
                "written": written_doc if (written_doc and written_doc.get("completed")) else None
            }
        return records

    @classmethod
    def calculate_recommendations(cls, student_id: str) -> Dict[str, Any]:
        weights = weight_config.get_weights()
        records = cls.get_student_assessment_records(student_id)

        course_matches = []
        completed_course_matches = []

        for spec in COMMERCE_COURSES_SPEC:
            ck = spec["courseKey"]
            rec = records.get(ck, {})
            game_record = rec.get("game")
            written_record = rec.get("written")

            has_game = game_record is not None
            has_written = written_record is not None

            game_score = float(game_record.get("gameScore", 0.0)) if has_game else None
            written_score = float(written_record.get("score", written_record.get("scorePercentage", 0.0))) if has_written else None

            match_score = None
            explanation = ""
            status_text = "INCOMPLETE"

            if has_game and has_written:
                status_text = "COMPLETE"
                gw = weights.get("game_weight", weights.get("gameWeight", 0.75))
                ww = weights.get("written_test_weight", weights.get("writtenWeight", 0.25))
                match_score = round((game_score * gw) + (written_score * ww), 1)
                explanation = (
                    f"Synthesized from {game_score:.1f}% simulation performance in {spec['gameName']} "
                    f"({int(gw*100)}% weight) and {written_score:.1f}% conceptual score in the written examination ({int(ww*100)}% weight). "
                    f"Reflects strong aptitude for {spec['domain']}."
                )
            elif has_game and not has_written:
                status_text = "WRITTEN_TEST_PENDING"
                explanation = (
                    f"Completed {spec['gameName']} with score {game_score:.1f}%. "
                    f"Written conceptual assessment (25% weightage) is pending. Complete the written test to view your final recommendation."
                )
            elif not has_game and has_written:
                status_text = "GAME_PENDING"
                explanation = (
                    f"Completed written assessment with score {written_score:.1f}%. "
                    f"Interactive simulation game {spec['gameName']} (75% weightage) is pending. Complete the game to calculate your course match."
                )
            else:
                status_text = "NOT_STARTED"
                explanation = (
                    f"Both the interactive {spec['gameName']} game and the conceptual written assessment are pending for {spec['courseName']}."
                )

            # Analyze strengths and growth areas
            strengths = []
            growth_areas = []
            if has_game:
                skill_scores = game_record.get("skillScores", {})
                for sk, sc in skill_scores.items():
                    if sc >= 75:
                        strengths.append(f"Demonstrated high aptitude in {sk} ({sc:.0f}%)")
                    elif sc < 60:
                        growth_areas.append(f"Opportunity to strengthen {sk} ({sc:.0f}%)")

            if has_written:
                score_val = written_record.get("score", 0.0)
                if score_val >= 80:
                    strengths.append(f"Solid conceptual mastery in written assessments ({score_val:.0f}% score)")
                elif score_val < 60:
                    growth_areas.append("Review fundamental accounting and regulatory concepts to improve test performance")

            course_match_obj = {
                "courseKey": ck,
                "courseId": spec["courseId"],
                "courseName": spec["courseName"],
                "domain": spec["domain"],
                "status": status_text,
                "gameScore": game_score,
                "writtenScore": written_score,
                "finalMatchScore": match_score,
                "keySkills": spec["keySkills"],
                "careerRoles": spec["careerRoles"],
                "strengths": strengths if strengths else ["Complete full evaluations to reveal strengths"],
                "areasForImprovement": growth_areas if growth_areas else ["No critical skill deficiencies identified"],
                "explanation": explanation
            }

            course_matches.append(course_match_obj)
            if match_score is not None:
                completed_course_matches.append(course_match_obj)

        # Sort completed matches by finalMatchScore descending
        completed_course_matches.sort(key=lambda x: x["finalMatchScore"], reverse=True)

        top_match = completed_course_matches[0] if completed_course_matches else None

        gw_val = weights.get("game_weight", weights.get("gameWeight", 0.75))
        ww_val = weights.get("written_test_weight", weights.get("writtenWeight", 0.25))

        return {
            "studentId": student_id,
            "stream": "Commerce & Accounting",
            "weightingFormula": {
                "gameWeight": gw_val,
                "writtenWeight": ww_val,
                "description": f"Final Course Match Score = (Game Score × {gw_val}) + (Written Test Score × {ww_val})"
            },
            "topRecommendation": top_match,
            "allCourses": course_matches,
            "completedCount": len(completed_course_matches),
            "totalCourses": len(COMMERCE_COURSES_SPEC)
        }
