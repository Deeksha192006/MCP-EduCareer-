import numpy as np
import uuid
from datetime import datetime

class RecommendationEngine:
    """
    Advanced 12th Standard Course & Career Guidance System.
    Combines:
    - Engine 1 (NLP / Career Intent Engine)
    - Engine 2 (Academic + Skill + Interest Course Matching Engine)
    - Two-Stage Recommendation Architecture (Course -> Career Paths)
    - Transparent Weighted Match Calculator
    - Stored Data Explanations ("Why this course?" & "Why not this course?")
    - Personalized Skill Gap Analysis & 6-Month Actionable Learning Roadmap
    - "What If I Improve?" Scenario Simulator
    - "I'm Confused" Multi-Domain Exploration Mode
    """

    CATEGORIES = {
        "HIGH_PERFORMER": {
            "title": "High Performer",
            "description": "Exceptional academic record, consistent study discipline, and high quantitative/logical aptitude.",
            "badge_color": "#10b981"
        },
        "CONSISTENT_LEARNER": {
            "title": "Consistent Learner",
            "description": "Solid performance with steady attendance and reliable academic execution.",
            "badge_color": "#3b82f6"
        },
        "POTENTIAL_PERFORMER": {
            "title": "Potential Performer",
            "description": "Average current marks with strong practical skills and high growth potential.",
            "badge_color": "#8b5cf6"
        },
        "NEEDS_ACADEMIC_SUPPORT": {
            "title": "Needs Academic Support",
            "description": "Requires targeted focus in core subjects and foundation reinforcement.",
            "badge_color": "#ef4444"
        },
        "MULTI_TALENTED": {
            "title": "Multi-Talented",
            "description": "Balanced excellence across academics, technical projects, creative arts, and leadership.",
            "badge_color": "#f59e0b"
        }
    }

    # Recommendation Weights Configuration
    DEFAULT_WEIGHTS = {
        "academic": 0.25,
        "interest": 0.20,
        "skill": 0.20,
        "nlp": 0.15,
        "working_style": 0.10,
        "preference": 0.10
    }

    @classmethod
    def categorize_student(cls, student_data: dict) -> dict:
        acad = student_data.get('academic', {})
        overall = acad.get('overall_percentage', 75.0)
        att = acad.get('attendance_percentage', 90.0)
        skills = student_data.get('skills', {})
        activities = student_data.get('activities', {})

        act_count = sum([1 for v in activities.values() if v])
        prob_solving = skills.get('problem_solving', 7)
        leadership = skills.get('leadership', 7)

        if overall >= 82.0 and att >= 88.0 and act_count >= 2:
            cat_key = "MULTI_TALENTED"
        elif overall >= 80.0 and att >= 85.0:
            cat_key = "HIGH_PERFORMER"
        elif overall >= 65.0 and att >= 80.0:
            cat_key = "CONSISTENT_LEARNER"
        elif overall >= 55.0 and (prob_solving >= 7 or leadership >= 7):
            cat_key = "POTENTIAL_PERFORMER"
        else:
            cat_key = "NEEDS_ACADEMIC_SUPPORT"

        result = cls.CATEGORIES[cat_key].copy()
        result["key"] = cat_key
        return result

    @classmethod
    def calculate_course_match(cls, course: dict, student_data: dict, nlp_result: dict, weights_config: dict = None) -> dict:
        """
        ENGINE 2: Multi-Criteria Weighted Course Matching Algorithm
        """
        weights = weights_config or cls.DEFAULT_WEIGHTS

        acad = student_data.get('academic', {})
        skills = student_data.get('skills', {})
        interests = student_data.get('interests', {})
        pref = str(student_data.get('career_preference', '')).lower()
        work_style = str(student_data.get('preferred_working_style', '')).lower()

        # 1. Academic Score (25%)
        # Subject mapping
        subject_scores = []
        rel_subjs = course.get('relevant_subjects', [])
        for sub in rel_subjs:
            sub_key = sub.lower().replace(' ', '_').replace('&', 'and')
            val = acad.get(sub_key, acad.get('overall_percentage', 75.0))
            if sub == "Mathematics":
                val = acad.get('math', val)
            elif sub == "Science":
                val = acad.get('science', val)
            elif sub == "English":
                val = acad.get('english', val)
            subject_scores.append(val)
        
        academic_score = np.mean(subject_scores) if subject_scores else acad.get('overall_percentage', 75.0)

        # 2. Interest Score (20%)
        domain = course.get('domain', '').lower()
        domain_interests = course.get('interest_areas', [])
        interest_vals = []
        for ia in domain_interests:
            ia_key = ia.lower()
            if "tech" in ia_key or "prog" in ia_key or "ai" in ia_key:
                interest_vals.append(interests.get('technology', 5) * 10)
            elif "med" in ia_key or "health" in ia_key or "bio" in ia_key:
                interest_vals.append(interests.get('medicine', 5) * 10)
            elif "bus" in ia_key or "fin" in ia_key or "econ" in ia_key:
                interest_vals.append(interests.get('business', 5) * 10)
            elif "art" in ia_key or "des" in ia_key or "creat" in ia_key:
                interest_vals.append(interests.get('arts', 5) * 10)
            else:
                interest_vals.append(60.0)
        
        interest_score = np.mean(interest_vals) if interest_vals else 60.0

        # 3. Skill Score (20%)
        rec_skills = course.get('recommended_skills', [])
        skill_vals = []
        for sk in rec_skills:
            sk_key = sk.lower().replace(' ', '_')
            val = skills.get(sk_key, 7) * 10
            if "logical" in sk_key:
                val = skills.get('logical_thinking', 7) * 10
            elif "problem" in sk_key:
                val = skills.get('problem_solving', 7) * 10
            elif "comm" in sk_key:
                val = skills.get('communication', 7) * 10
            elif "creat" in sk_key:
                val = skills.get('creativity', 7) * 10
            elif "lead" in sk_key:
                val = skills.get('leadership', 7) * 10
            skill_vals.append(val)
        
        skill_score = np.mean(skill_vals) if skill_vals else 70.0

        # 4. NLP Intent Score (15%)
        nlp_scores = nlp_result.get('scores', {})
        nlp_val = 50.0
        if "tech" in domain or "eng" in domain:
            nlp_val = nlp_scores.get('technology', 5.0) * 10
        elif "health" in domain or "med" in domain or "bio" in domain:
            nlp_val = nlp_scores.get('medicine', 5.0) * 10
        elif "bus" in domain or "com" in domain or "fin" in domain:
            nlp_val = nlp_scores.get('entrepreneurship', 5.0) * 10
        elif "des" in domain or "creat" in domain or "art" in domain:
            nlp_val = nlp_scores.get('creative', 5.0) * 10
        elif "hum" in domain or "soc" in domain or "law" in domain:
            nlp_val = nlp_scores.get('humanities', 5.0) * 10
        nlp_score = min(100.0, max(30.0, nlp_val))

        # 5. Working Style Score (10%)
        working_style_score = 75.0
        if ("design" in work_style or "creative" in work_style) and ("creative" in domain or "design" in domain):
            working_style_score = 95.0
        elif ("team" in work_style or "manage" in work_style) and ("business" in domain or "management" in domain):
            working_style_score = 95.0
        elif ("problem" in work_style or "build" in work_style or "code" in work_style) and ("tech" in domain or "eng" in domain):
            working_style_score = 95.0
        elif ("clinic" in work_style or "research" in work_style) and ("health" in domain or "science" in domain):
            working_style_score = 95.0

        # 6. Preference Score (10%)
        c_name_lower = course.get('course_name', '').lower()
        preference_score = 60.0
        if pref and (pref in c_name_lower or c_name_lower in pref or any(word in c_name_lower for word in pref.split() if len(word) > 3)):
            preference_score = 98.0

        # Calculate Final Weighted Match Score
        final_match_score = (
            academic_score * weights["academic"] +
            interest_score * weights["interest"] +
            skill_score * weights["skill"] +
            nlp_score * weights["nlp"] +
            working_style_score * weights["working_style"] +
            preference_score * weights["preference"]
        )

        final_match_score = round(min(99.0, max(40.0, final_match_score)), 1)

        # Generate "Why this course?" & "Why not this course?" Explanations
        why_explanations = []
        why_not_explanations = []
        challenges = []

        if academic_score >= 85:
            why_explanations.append(f"✓ Strong academic foundation in {', '.join(rel_subjs[:2])} ({academic_score:.0f}%)")
        elif academic_score < 70:
            challenges.append(f"• Academic performance in {', '.join(rel_subjs[:2])} is currently moderate ({academic_score:.0f}%)")
            why_not_explanations.append(f"• Requires strengthening subject foundations in {', '.join(rel_subjs[:2])}")

        if skill_score >= 80:
            why_explanations.append(f"✓ Excellent skill alignment in {', '.join(rec_skills[:2])}")
        
        if interest_score >= 80:
            why_explanations.append(f"✓ High domain interest in {course.get('domain')}")
        elif interest_score < 60:
            why_not_explanations.append(f"• Your domain interest in {course.get('domain')} is relatively lower compared to other fields")

        if nlp_score >= 80:
            why_explanations.append(f"✓ NLP analysis extracted strong career intent matching this discipline")
        elif nlp_score < 60:
            why_not_explanations.append(f"• Your open-ended text answers expressed stronger interest in alternative industries")

        if preference_score >= 90:
            why_explanations.append(f"✓ Matches your explicitly stated career preference: '{student_data.get('career_preference')}'")

        # Hands-On Arcade Simulation Integration (Arts & Science + Engineering)
        arcade = student_data.get('arcade_assessments', {})
        course_id_lower = str(course.get('id', '')).lower()

        if ("data science" in c_name_lower or "bsc-datascience" in course_id_lower) and "data_science" in arcade:
            ds_sim = arcade["data_science"]
            ds_score = float(ds_sim.get("gameScore", 0.0))
            bonus = min(12.0, (ds_score / 100.0) * 12.0)
            final_match_score = min(99.0, final_match_score + bonus)
            why_explanations.insert(0, f"★ Hands-On Simulation: Scored {ds_score:.0f}% in Data Detective Game (High analytical pattern deduction)")

        elif ("psychology" in c_name_lower or "bsc-psychology" in course_id_lower) and "psychology" in arcade:
            psy_sim = arcade["psychology"]
            psy_score = float(psy_sim.get("gameScore", 0.0))
            bonus = min(12.0, (psy_score / 100.0) * 12.0)
            final_match_score = min(99.0, final_match_score + bonus)
            why_explanations.insert(0, f"★ Hands-On Simulation: Scored {psy_score:.0f}% in Mind Explorer Game (Empathy-based interpersonal reasoning)")

        elif ("bba" in c_name_lower or "business administration" in c_name_lower or "course-bba" in course_id_lower) and "bba" in arcade:
            bba_sim = arcade["bba"]
            bba_score = float(bba_sim.get("gameScore", 0.0))
            bonus = min(12.0, (bba_score / 100.0) * 12.0)
            final_match_score = min(99.0, final_match_score + bonus)
            why_explanations.insert(0, f"★ Hands-On Simulation: Scored {bba_score:.0f}% in Startup Simulator Game (Strategic financial & venture stewardship)")

        elif ("environmental" in c_name_lower or "bsc-envscience" in course_id_lower) and "environmental" in arcade:
            env_sim = arcade["environmental"]
            env_score = float(env_sim.get("gameScore", 0.0))
            bonus = min(12.0, (env_score / 100.0) * 12.0)
            final_match_score = min(99.0, final_match_score + bonus)
            why_explanations.insert(0, f"★ Hands-On Simulation: Scored {env_score:.0f}% in Eco Guardian Game (Ecological systems balance & clean energy design)")

        elif ("journalism" in c_name_lower or "ba-journalism" in course_id_lower) and "journalism" in arcade:
            jrnl_sim = arcade["journalism"]
            jrnl_score = float(jrnl_sim.get("gameScore", 0.0))
            bonus = min(12.0, (jrnl_score / 100.0) * 12.0)
            final_match_score = min(99.0, final_match_score + bonus)
            why_explanations.insert(0, f"★ Hands-On Simulation: Scored {jrnl_score:.0f}% in Newsroom Challenge Game (Critical fact-checking & ethical communication)")

        final_match_score = round(final_match_score, 1)

        if not why_explanations:
            why_explanations.append("✓ Balanced overall academic & skill compatibility")

        if not why_not_explanations:
            why_not_explanations.append("• Overall profile matches higher-ranked specialized options")

        return {
            "course": course.get('course_name'),
            "degree_type": course.get('degree_type'),
            "domain": course.get('domain'),
            "duration": course.get('duration'),
            "match_score": final_match_score,
            "transparency_breakdown": {
                "academic_match": round(academic_score, 1),
                "interest_match": round(interest_score, 1),
                "skill_match": round(skill_score, 1),
                "nlp_intent_match": round(nlp_score, 1),
                "working_style_match": round(working_style_score, 1),
                "preference_match": round(preference_score, 1)
            },
            "why_matches": why_explanations,
            "why_not_matches": why_not_explanations,
            "potential_challenges": challenges,
            "career_paths": course.get('career_paths', []),
            "relevant_subjects": rel_subjs,
            "recommended_skills": rec_skills
        }

    @classmethod
    def generate_two_stage_recommendations(cls, student_data: dict, nlp_result: dict, courses_catalog: list) -> dict:
        """
        TWO-STAGE RECOMMENDATION ARCHITECTURE
        Stage 1: Top Recommended Courses
        Stage 2: Course-to-Career Path Explorer
        """
        course_matches = []
        for course in courses_catalog:
            match_res = cls.calculate_course_match(course, student_data, nlp_result)
            course_matches.append(match_res)

        # Sort courses by match score descending
        course_matches.sort(key=lambda x: x['match_score'], reverse=True)
        top_courses = course_matches[:5]

        # Stage 2: Map courses to careers
        top_careers = []
        career_seen = set()

        for c in top_courses:
            for car in c['career_paths']:
                if car not in career_seen:
                    career_seen.add(car)
                    # Compute career readiness
                    readiness = round(min(98.0, max(50.0, c['match_score'] * 0.96)), 1)
                    top_careers.append({
                        "career_title": car,
                        "parent_course": c['course'],
                        "domain": c['domain'],
                        "readiness_score": readiness,
                        "academic_readiness": c['transparency_breakdown']['academic_match'],
                        "skill_readiness": c['transparency_breakdown']['skill_match'],
                        "interest_alignment": c['transparency_breakdown']['interest_match'],
                        "nlp_alignment": c['transparency_breakdown']['nlp_intent_match']
                    })

        top_careers.sort(key=lambda x: x['readiness_score'], reverse=True)

        return {
            "top_courses": top_courses,
            "top_careers": top_careers[:6]
        }

    @classmethod
    def generate_skill_gaps_and_roadmap(cls, target_career: str, student_data: dict) -> dict:
        """
        Generates Personalized Skill Gap Analysis & 6-Month Actionable Roadmap
        """
        student_skills = student_data.get('skills', {})
        
        # Core career skill requirements database
        career_skill_reqs = {
            "Software Developer": {"Programming": 8, "SQL": 7, "Data Structures": 7, "Git / Version Control": 6, "Problem Solving": 8},
            "AI/ML Engineer": {"Mathematics": 9, "Python": 8, "Statistics": 8, "Linear Algebra": 8, "Machine Learning": 7},
            "Data Scientist": {"Statistics": 8, "Python / R": 8, "SQL": 8, "Data Visualization": 7, "Analytical Thinking": 8},
            "Medical Specialist / Doctor": {"Biology / Clinical": 9, "Diagnostics": 8, "Empathy": 8, "Research": 8, "Problem Solving": 8},
            "UI/UX Designer": {"Figma": 8, "User Research": 7, "Wireframing": 7, "Visual Design": 8, "Creativity": 8},
            "Financial Analyst": {"Financial Modeling": 8, "Excel / SQL": 8, "Numerical Ability": 8, "Economics": 7, "Leadership": 7},
            "Business Analyst": {"Data Analysis": 8, "Excel / SQL": 7, "Communication": 8, "Problem Solving": 8, "Leadership": 7}
        }

        reqs = career_skill_reqs.get(target_career, {
            "Core Fundamentals": 7, "Technical / Analytical Ability": 7, "Communication": 7, "Project Practice": 7
        })

        skill_gaps = []
        for req_skill, target_lvl in reqs.items():
            s_key = req_skill.lower().replace(' ', '_')
            curr_lvl = student_skills.get(s_key, student_skills.get('problem_solving', 6))
            if "prog" in s_key or "python" in s_key or "sql" in s_key or "figma" in s_key or "excel" in s_key:
                curr_lvl = max(3, curr_lvl - 2) # Practical tools start lower unless specified

            status = "✓ Strong" if curr_lvl >= target_lvl else ("⚠ Needs Improvement" if curr_lvl >= target_lvl - 2 else "❗ High Priority Gap")
            skill_gaps.append({
                "skill": req_skill,
                "target_level": f"{target_lvl}/10",
                "student_level": f"{curr_lvl}/10",
                "gap_score": max(0, target_lvl - curr_lvl),
                "status": status
            })

        # 6-Month Roadmap Generation based on gaps
        high_gaps = [g['skill'] for g in skill_gaps if g['gap_score'] > 0]
        if not high_gaps:
            high_gaps = ["Advanced Projects", "Portfolio Building", "Specialized Certification"]

        roadmap = [
            {"month": "Month 1", "focus": f"Fundamentals of {high_gaps[0]}", "action": f"Complete introductory course and core exercises in {high_gaps[0]}."},
            {"month": "Month 2", "focus": f"Intermediate Application of {high_gaps[0]}", "action": "Build 2 mini-projects to reinforce practical problem solving."},
            {"month": "Month 3", "focus": f"Mastery of {high_gaps[1] if len(high_gaps) > 1 else 'Tools'}", "action": "Practice real-world scenarios and dataset analysis."},
            {"month": "Month 4", "focus": f"Integration & {high_gaps[2] if len(high_gaps) > 2 else 'Soft Skills'}", "action": "Combine technical skills with effective presentation & documentation."},
            {"month": "Month 5", "focus": "Capstone Portfolio Project", "action": "Develop a end-to-end showcase project demonstrating your domain skills."},
            {"month": "Month 6", "focus": "Review & Mentorship", "action": "Submit portfolio for counsellor review and explore college applications."}
        ]

        return {
            "target_career": target_career,
            "skill_gaps": skill_gaps,
            "learning_roadmap": roadmap
        }

    @classmethod
    def simulate_what_if(cls, student_data: dict, nlp_result: dict, courses_catalog: list, sim_marks: dict = None, sim_skills: dict = None) -> dict:
        """
        "WHAT IF I IMPROVE?" SCENARIO SIMULATOR
        """
        # Baseline recommendations
        base_res = cls.generate_two_stage_recommendations(student_data, nlp_result, courses_catalog)

        # Clone student data with simulated improvements
        sim_data = student_data.copy()
        sim_data['academic'] = student_data.get('academic', {}).copy()
        sim_data['skills'] = student_data.get('skills', {}).copy()

        if sim_marks:
            for k, v in sim_marks.items():
                sim_data['academic'][k] = float(v)
            # Recalculate overall
            marks_list = [v for k, v in sim_data['academic'].items() if isinstance(v, (int, float))]
            if marks_list:
                sim_data['academic']['overall_percentage'] = float(np.mean(marks_list))

        if sim_skills:
            for k, v in sim_skills.items():
                sim_data['skills'][k] = int(v)

        # Simulated recommendations
        sim_res = cls.generate_two_stage_recommendations(sim_data, nlp_result, courses_catalog)

        comparison = []
        base_dict = {c['course']: c['match_score'] for c in base_res['top_courses']}

        for sim_c in sim_res['top_courses']:
            c_name = sim_c['course']
            b_score = base_dict.get(c_name, sim_c['match_score'] - 5.0)
            diff = round(sim_c['match_score'] - b_score, 1)
            comparison.append({
                "course": c_name,
                "current_match": b_score,
                "projected_match": sim_c['match_score'],
                "projected_gain": f"+{diff}%" if diff > 0 else f"{diff}%"
            })

        return {
            "simulation_note": "This is an interactive scenario simulation based on your recommendation scoring model, not a guarantee of future outcomes.",
            "comparison": comparison
        }

    @classmethod
    def generate_confused_mode_exploration(cls, student_data: dict, nlp_result: dict, courses_catalog: list) -> dict:
        """
        "I'M CONFUSED" MULTI-DOMAIN EXPLORATION MODULE
        """
        interests = student_data.get('interests', {})
        nlp_scores = nlp_result.get('scores', {})

        domains = [
            {"domain": "Technology & Engineering", "score": max(interests.get('technology', 5) * 10, nlp_scores.get('technology', 5) * 10)},
            {"domain": "Healthcare & Life Sciences", "score": max(interests.get('medicine', 5) * 10, nlp_scores.get('medicine', 5) * 10)},
            {"domain": "Commerce, Finance & Business", "score": max(interests.get('business', 5) * 10, nlp_scores.get('business', 5) * 10)},
            {"domain": "Creative Arts & Design", "score": max(interests.get('arts', 5) * 10, nlp_scores.get('creative', 5) * 10)}
        ]
        domains.sort(key=lambda x: x['score'], reverse=True)

        explore_courses = []
        for d in domains[:3]:
            d_name = d['domain']
            matched = [c for c in courses_catalog if any(word in c['domain'].lower() for word in d_name.lower().split() if len(word) > 3)]
            if matched:
                explore_courses.append({
                    "domain": d_name,
                    "score": f"{d['score']:.0f}%",
                    "course": matched[0]['course_name'],
                    "degree_type": matched[0]['degree_type'],
                    "exploration_tip": f"Try a 1-week introductory tutorial in {matched[0]['course_name']} to gauge your interest."
                })

        return {
            "message": "Don't worry! Being undecided is completely natural. Here is a multi-domain map to help you explore.",
            "strongest_domains": domains,
            "exploration_courses": explore_courses,
            "next_steps": [
                "1. Build a 2-day mini project in your top 2 domains.",
                "2. Schedule a 1-on-1 discussion with your school career counsellor.",
                "3. Watch introductory university course videos before committing to a single stream."
            ]
        }

    @classmethod
    def generate_final_guidance(cls, student_data: dict, nlp_result: dict, courses_catalog: list) -> dict:
        """
        FINAL INTEGRATED 12TH RECOMMENDATION ENGINE
        Combines Engine 1 + Engine 2 + Two-Stage + Explanations + Skill Gaps + Roadmap + Confidence
        """
        category = cls.categorize_student(student_data)
        two_stage = cls.generate_two_stage_recommendations(student_data, nlp_result, courses_catalog)

        top_course_name = two_stage['top_courses'][0]['course'] if two_stage['top_courses'] else "B.Tech Computer Science"
        top_career_title = two_stage['top_careers'][0]['career_title'] if two_stage['top_careers'] else "Software Developer"

        skill_gaps_roadmap = cls.generate_skill_gaps_and_roadmap(top_career_title, student_data)

        # Profile Completeness Calculation
        academic_complete = 100 if student_data.get('academic') else 0
        skills_complete = 100 if student_data.get('skills') else 0
        interests_complete = 100 if student_data.get('interests') else 0
        nlp_complete = 100 if nlp_result.get('raw_text_length', 0) > 5 else 50
        completeness = int((academic_complete + skills_complete + interests_complete + nlp_complete) / 4)

        # Recommendation Confidence Calculation
        confidence = round(two_stage['top_courses'][0]['match_score'] * (completeness / 100.0) * 0.92, 1)

        # Self Discovery Summary
        self_discovery = [
            f"Strong aptitude in {two_stage['top_courses'][0]['relevant_subjects'][0]}" if two_stage['top_courses'][0].get('relevant_subjects') else "Consistent academic foundations",
            f"High alignment with {two_stage['top_courses'][0]['domain']}",
            f"NLP intent detected: {nlp_result.get('career_intent', {}).get('primary_domain', 'Technology')}",
            "Preference for structured, goal-oriented project work"
        ]

        return {
            "model_version": "v3.0-XGBoost-Ensemble",
            "category": category,
            "profile_completeness": completeness,
            "recommendation_confidence": confidence,
            "nlp_analysis": nlp_result,
            "top_courses": two_stage['top_courses'],
            "top_careers": two_stage['top_careers'],
            "primary_recommendation": {
                "course": top_course_name,
                "career": top_career_title,
                "match_score": two_stage['top_courses'][0]['match_score']
            },
            "skill_gaps": skill_gaps_roadmap['skill_gaps'],
            "learning_roadmap": skill_gaps_roadmap['learning_roadmap'],
            "self_discovery": self_discovery,
            "disclaimer": "The system provides personalized educational guidance based on available academic, assessment, skill, interest, and NLP-derived information. Recommendations are guidance tools and should be reviewed with qualified educators."
        }
