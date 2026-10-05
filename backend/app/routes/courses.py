from fastapi import APIRouter, HTTPException
from typing import List
from app.database.mongodb import get_database
from app.schemas.course import CourseResponse, CareerDetailResponse
from app.database.course_catalog import COURSES_CATALOG

router = APIRouter(prefix="/courses", tags=["Courses Knowledge Base"])

@router.get("", response_model=List[CourseResponse])
def get_courses():
    db_inst = get_database()
    if db_inst.is_memory_fallback:
        courses = db_inst.memory_store.get("courses", COURSES_CATALOG)
    else:
        courses = list(db_inst.db.courses.find({}))
        if not courses:
            courses = COURSES_CATALOG
    
    for c in courses:
        if "_id" in c:
            c["id"] = str(c["_id"])
    return courses

@router.get("/{course_id}", response_model=CourseResponse)
def get_course_by_id(course_id: str):
    db_inst = get_database()
    if db_inst.is_memory_fallback:
        c = next((item for item in db_inst.memory_store.get("courses", COURSES_CATALOG) if item.get("id") == course_id or item.get("_id") == course_id), None)
    else:
        c = db_inst.db.courses.find_one({"id": course_id})

    if not c:
        c = next((item for item in COURSES_CATALOG if course_id.lower() in item["course_name"].lower()), None)
    
    if not c:
        raise HTTPException(status_code=404, detail="Course not found")
    
    c["id"] = str(c.get("_id", c.get("id")))
    return c

@router.get("/career-details/{career_title}", response_model=CareerDetailResponse)
def get_career_details(career_title: str):
    for c in COURSES_CATALOG:
        if any(career_title.lower() in cp.lower() for cp in c["career_paths"]):
            return {
                "title": career_title,
                "domain": c["domain"],
                "description": f"Professional career path in {c['domain']} requiring expertise in {', '.join(c['recommended_skills'][:3])}.",
                "req_subjects": c["relevant_subjects"],
                "req_skills": c["recommended_skills"],
                "suggested_skills_to_learn": ["SQL / Advanced Data Tools", "Project Management", "Domain Specialization"],
                "beginner_project_ideas": [
                    f"Build a showcase portfolio project demonstrating core skills in {career_title}.",
                    "Analyze real-world industry datasets or case studies."
                ],
                "typical_responsibilities": [
                    "Design and implement domain-specific solutions.",
                    "Collaborate with cross-functional teams and stakeholders.",
                    "Continuously optimize processes and learn emerging technologies."
                ]
            }

    return {
        "title": career_title,
        "domain": "Technology & Professional Services",
        "description": f"Targeted career path requiring strong analytical and domain skills.",
        "req_subjects": ["Mathematics", "Computer Science", "English"],
        "req_skills": ["Problem Solving", "Logical Thinking", "Communication"],
        "suggested_skills_to_learn": ["Domain Fundamentals", "Practical Tooling", "Portfolio Building"],
        "beginner_project_ideas": ["Build an end-to-end domain project and document learning outcomes."],
        "typical_responsibilities": ["Solve complex domain challenges", "Apply analytical thinking to deliver results"]
    }
