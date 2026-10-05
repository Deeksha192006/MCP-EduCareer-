from typing import List, Dict, Any, Optional
from app.core.weight_config import weight_config, ScoreRangeError
from app.database.mongodb import get_database

COURSES_SPEC = [
    {
        "courseKey": "data-science",
        "courseId": "course-bsc-datascience",
        "courseName": "B.Sc. Data Science",
        "officialDegree": "B.Sc Data Science & Analytics",
        "gameName": "Data Detective",
        "gameCollection": "data_science_assessments",
        "writtenKey": "data-science",
        "domain": "Technology & Quantitative Science",
        "keySkills": ["Analytical Thinking", "Data Interpretation", "Logical Reasoning", "Numerical Problem-Solving"],
        "careerRoles": ["Data Scientist", "Business Intelligence Analyst", "Data Engineer", "Machine Learning Specialist"]
    },
    {
        "courseKey": "psychology",
        "courseId": "course-bsc-psychology",
        "courseName": "B.Sc. Psychology",
        "officialDegree": "B.Sc Psychology",
        "gameName": "Mind Explorer",
        "gameCollection": "psychology_assessments",
        "writtenKey": "psychology",
        "domain": "Behavioral & Social Science",
        "keySkills": ["Empathy-Oriented Reasoning", "Observation", "Social Reasoning", "Critical Thinking"],
        "careerRoles": ["Cognitive Specialist", "Organizational Counsellor", "Behavioral Researcher", "HR Consultant"]
    },
    {
        "courseKey": "bba",
        "courseId": "course-bba",
        "courseName": "BBA",
        "officialDegree": "BBA (Bachelor of Business Administration)",
        "gameName": "Startup Simulator",
        "gameCollection": "bba_assessments",
        "writtenKey": "bba",
        "domain": "Business Administration & Management",
        "keySkills": ["Business Reasoning", "Strategic Thinking", "Resource Management", "Decision-Making"],
        "careerRoles": ["Business Analyst", "Marketing Strategist", "Venture Manager", "Operations Lead"]
    },
    {
        "courseKey": "environmental-science",
        "courseId": "course-bsc-envscience",
        "courseName": "B.Sc. Environmental Science",
        "officialDegree": "B.Sc Environmental Science",
        "gameName": "Eco Guardian",
        "gameCollection": "environmental_assessments",
        "writtenKey": "environmental-science",
        "domain": "Science & Sustainability",
        "keySkills": ["Scientific Reasoning", "Systems Thinking", "Environmental Problem-Solving", "Sustainability Awareness"],
        "careerRoles": ["Environmental Impact Consultant", "Sustainability Specialist", "Ecologist", "Water Resource Manager"]
    },
    {
        "courseKey": "journalism",
        "courseId": "course-ba-journalism",
        "courseName": "BA Journalism and Mass Communication",
        "officialDegree": "BA Journalism & Mass Communication",
        "gameName": "Newsroom Challenge",
        "gameCollection": "journalism_assessments",
        "writtenKey": "journalism",
        "domain": "Media & Mass Communication",
        "keySkills": ["Verbal Reasoning", "Media Literacy", "Critical Thinking", "Clear Communication"],
        "careerRoles": ["Investigative Journalist", "Fact-Checking Analyst", "Broadcast Reporter", "Copy Editor"]
    }
]

class ArtsScienceRecommendationService:
    """
    Computes course recommendations for the Arts & Science stream based on:
      Final Course Match Score = (Game Score * 0.75) + (Written Test Score * 0.25)
    Strictly isolated per course. If either assessment is missing, does not compute a final score.
    """

    @classmethod
    def get_student_assessment_records(cls, student_id: str) -> Dict[str, Any]:
        db_inst = get_database()

        def fetch_doc(col_name: str, query: dict):
            if db_inst.is_memory_fallback:
                items = db_inst.memory_store.get(col_name, [])
                return next((it for it in items if all(it.get(k) == v for k, v in query.items())), None)
            return db_inst.db[col_name].find_one(query)

        records = {}
        for spec in COURSES_SPEC:
            c_key = spec["courseKey"]
            game_doc = fetch_doc(spec["gameCollection"], {"studentId": student_id, "completed": True})
            written_doc = fetch_doc("written_assessments", {"studentId": student_id, "courseKey": spec["writtenKey"], "completed": True})
            records[c_key] = {
                "game": game_doc,
                "written": written_doc
            }
        return records

    @classmethod
    def evaluate_course_match(
        cls,
        spec: Dict[str, Any],
        game_doc: Optional[Dict[str, Any]],
        written_doc: Optional[Dict[str, Any]],
        custom_weights: Optional[Dict[str, float]] = None
    ) -> Dict[str, Any]:
        weights = custom_weights or weight_config.get_weights()
        w_g = weights["game_weight"]
        w_w = weights["written_test_weight"]

        has_game = bool(game_doc and game_doc.get("completed"))
        has_written = bool(written_doc and written_doc.get("completed"))

        game_score = None
        written_score = None

        if has_game:
            raw_g = float(game_doc.get("gameScore", 0.0))
            if not (0.0 <= raw_g <= 100.0):
                raise ScoreRangeError(f"Game score {raw_g} for {spec['courseName']} is out of range [0, 100].")
            game_score = round(raw_g, 1)

        if has_written:
            raw_w = float(written_doc.get("score", 0.0))
            if not (0.0 <= raw_w <= 100.0):
                raise ScoreRangeError(f"Written score {raw_w} for {spec['courseName']} is out of range [0, 100].")
            written_score = round(raw_w, 1)

        # Missing assessment handling
        if has_game and has_written:
            status_code = "BOTH_COMPLETED"
            final_match_score = weight_config.calculate_course_match(game_score, written_score, weights)
            status_message = "Both hands-on simulation and written conceptual test completed."
            missing_assessments = []
        elif has_game and not has_written:
            status_code = "WRITTEN_TEST_PENDING"
            final_match_score = None
            status_message = f"Hands-on simulation completed ({game_score:.1f}/100). Written test is pending."
            missing_assessments = ["Written Conceptual Assessment"]
        elif not has_game and has_written:
            status_code = "GAME_PENDING"
            final_match_score = None
            status_message = f"Written test completed ({written_score:.1f}/100). Interactive simulation is pending."
            missing_assessments = ["Interactive Simulation Game"]
        else:
            status_code = "NOT_STARTED"
            final_match_score = None
            status_message = "Neither the simulation game nor the written test has been attempted."
            missing_assessments = ["Interactive Simulation Game", "Written Conceptual Assessment"]

        # Extract skill breakdown
        skill_scores = {}
        strengths = []
        improvement_areas = []

        if has_game and game_doc:
            g_skills = game_doc.get("skillScores", {})
            for sk_name, sk_val in g_skills.items():
                skill_scores[f"Game: {sk_name}"] = round(float(sk_val), 1)

            fr = game_doc.get("finalResult", {})
            strengths.extend(fr.get("strengths", []))
            improvement_areas.extend(fr.get("growthAreas", []))

        if has_written and written_doc:
            w_topics = written_doc.get("topicScores", {})
            for top_name, top_val in w_topics.items():
                skill_scores[f"Knowledge: {top_name}"] = round(float(top_val), 1)
                if top_val >= 75.0 and top_name not in strengths:
                    strengths.append(top_name)
                elif top_val < 60.0 and top_name not in improvement_areas:
                    improvement_areas.append(top_name)

        if not strengths:
            strengths = ["Foundational Curiosity"]
        if not improvement_areas:
            improvement_areas = ["Deep Conceptual Mastery"]

        # Build student-friendly transparent explanation
        if status_code == "BOTH_COMPLETED":
            explanation = (
                f"Your final course match score of {final_match_score:.1f}% is calculated using your "
                f"Game Performance ({game_score:.1f} × {w_g * 100:.0f}%) and Written Test Performance "
                f"({written_score:.1f} × {w_w * 100:.0f}%). "
                f"You demonstrated strong hands-on problem-solving in '{spec['gameName']}' combined with solid "
                f"conceptual grasp across {len(written_doc.get('topicScores', {}))} core course topics."
            )
        elif status_code == "WRITTEN_TEST_PENDING":
            explanation = (
                f"You completed the '{spec['gameName']}' simulation with a score of {game_score:.1f}/100. "
                f"To receive your final course match score, you still need to complete the written conceptual test (25% weightage)."
            )
        elif status_code == "GAME_PENDING":
            explanation = (
                f"You completed the written conceptual test with a score of {written_score:.1f}/100. "
                f"To receive your final course match score, you still need to complete the '{spec['gameName']}' simulation (75% weightage)."
            )
        else:
            explanation = (
                f"Explore this course by completing both the '{spec['gameName']}' simulation (75%) and "
                f"the written conceptual test (25%) to discover your course match score."
            )

        return {
            "courseKey": spec["courseKey"],
            "courseId": spec["courseId"],
            "courseName": spec["courseName"],
            "officialDegree": spec["officialDegree"],
            "gameName": spec["gameName"],
            "domain": spec["domain"],
            "statusCode": status_code,
            "statusMessage": status_message,
            "isComplete": (status_code == "BOTH_COMPLETED"),
            "missingAssessments": missing_assessments,
            "gameScore": game_score,
            "writtenTestScore": written_score,
            "finalCourseMatchScore": final_match_score,
            "weightageBreakdown": {
                "gameWeightPercentage": round(w_g * 100.0, 1),
                "writtenWeightPercentage": round(w_w * 100.0, 1),
                "gameWeightedPoints": round(game_score * w_g, 2) if game_score is not None else None,
                "writtenWeightedPoints": round(written_score * w_w, 2) if written_score is not None else None
            },
            "skillWisePerformance": skill_scores,
            "strengths": strengths[:4],
            "improvementAreas": improvement_areas[:3],
            "careerRoles": spec["careerRoles"],
            "explanation": explanation
        }

    @classmethod
    def get_all_course_recommendations(
        cls,
        student_id: str,
        custom_weights: Optional[Dict[str, float]] = None
    ) -> Dict[str, Any]:
        """
        Calculates match scores for all 5 Arts & Science courses.
        Sorts completed courses in descending order of finalCourseMatchScore.
        Incomplete courses are presented with explicit pending indicators.
        """
        records = cls.get_student_assessment_records(student_id)
        weights = custom_weights or weight_config.get_weights()

        evaluated = []
        for spec in COURSES_SPEC:
            rec = records.get(spec["courseKey"], {})
            course_res = cls.evaluate_course_match(
                spec=spec,
                game_doc=rec.get("game"),
                written_doc=rec.get("written"),
                custom_weights=weights
            )
            evaluated.append(course_res)

        # Separate completed vs incomplete
        completed_courses = [c for c in evaluated if c["isComplete"]]
        incomplete_courses = [c for c in evaluated if not c["isComplete"]]

        # Sort completed courses descending by finalCourseMatchScore
        completed_courses.sort(key=lambda x: x["finalCourseMatchScore"], reverse=True)

        # Overall recommendation list: completed first (ordered), then incomplete
        ordered_recommendations = completed_courses + incomplete_courses

        return {
            "studentId": student_id,
            "totalCoursesEvaluated": len(COURSES_SPEC),
            "completedCoursesCount": len(completed_courses),
            "pendingCoursesCount": len(incomplete_courses),
            "activeWeights": weights,
            "weightingFormula": (
                f"Final Course Match Score = (Game Score × {weights['game_weight']}) + "
                f"(Written Test Score × {weights['written_test_weight']})"
            ),
            "topRecommendation": completed_courses[0] if completed_courses else None,
            "completedRecommendations": completed_courses,
            "incompleteCourses": incomplete_courses,
            "allCourses": ordered_recommendations,
            "academicDisclaimer": (
                "The course match score reflects demonstrated interest, hands-on simulation aptitude, "
                "and conceptual written test performance. It is an exploratory guidance indicator, "
                "not a guarantee of academic admission, test scores, future employment, or salary."
            )
        }
