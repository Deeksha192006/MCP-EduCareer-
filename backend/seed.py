import uuid
from datetime import datetime
from app.database.mongodb import get_database
from app.database.course_catalog import COURSES_CATALOG
from app.core.security import get_password_hash
from app.ml.predictor import predictor_service

SEED_STUDENTS = [
    {
        "name": "Arun Kumar",
        "email": "arun@student.edu",
        "grade": 12,
        "school": "Gabriel Pereira High School",
        "academic": {
            "math": 92, "science": 89, "english": 82, "physics": 90, "chemistry": 88, 
            "computer_science": 95, "accountancy": 65, "economics": 70, "business_studies": 68,
            "overall_percentage": 89.5, "attendance_percentage": 94, "studytime": 3, "failures": 0, "absences": 3
        },
        "skills": {"problem_solving": 9, "logical_thinking": 9, "communication": 7, "creativity": 8, "leadership": 8},
        "interests": {"technology": 10, "medicine": 4, "business": 7, "arts": 9},
        "activities": {"technical": True, "sports": False, "arts": True},
        "career_preference": "B.Tech Computer Science",
        "preferred_working_style": "Designing and building applications",
        "text_responses": {
            "dream_project": "I enjoy coding and solving mathematical problems. I want to build AI systems and user intuitive web software.",
            "workplace_mindset": "I thrive in tech innovation teams building scalable products.",
            "learning_interests": "Programming tutorials, machine learning, Figma design systems, and software engineering."
        }
    },
    {
        "name": "Priya Sharma",
        "email": "priya@student.edu",
        "grade": 12,
        "school": "Gabriel Pereira High School",
        "academic": {
            "math": 80, "science": 95, "english": 85, "physics": 92, "chemistry": 94, 
            "biology": 96, "computer_science": 70, "accountancy": 55, "economics": 60, "business_studies": 55,
            "overall_percentage": 91.0, "attendance_percentage": 96, "studytime": 4, "failures": 0, "absences": 2
        },
        "skills": {"problem_solving": 8, "logical_thinking": 8, "communication": 8, "creativity": 7, "leadership": 7},
        "interests": {"technology": 5, "medicine": 10, "business": 4, "arts": 5},
        "activities": {"technical": False, "sports": True, "arts": True},
        "career_preference": "MBBS",
        "preferred_working_style": "Clinical Healthcare & Diagnostics",
        "text_responses": {
            "dream_project": "I want to become a medical specialist, research human genetics, and diagnose illnesses in patients.",
            "workplace_mindset": "Caring for patients in hospitals and conducting medical research.",
            "learning_interests": "Anatomy books, medical technology journals, and clinical case studies."
        }
    }
]

def seed_demo_data():
    db_inst = get_database()

    admin_user = {
        "_id": "admin-1",
        "name": "System Admin",
        "email": "admin@school.edu",
        "password": get_password_hash("admin123"),
        "role": "admin",
        "school": "Global Education District",
        "created_at": datetime.utcnow().isoformat()
    }
    teacher_user = {
        "_id": "teacher-1",
        "name": "Prof. Sarah Jenkins",
        "email": "teacher@school.edu",
        "password": get_password_hash("teacher123"),
        "role": "teacher",
        "school": "Gabriel Pereira High School",
        "created_at": datetime.utcnow().isoformat()
    }
    student_user = {
        "_id": "student-demo-1",
        "name": "Arun Kumar",
        "email": "arun@student.edu",
        "password": get_password_hash("student123"),
        "role": "student",
        "school": "Gabriel Pereira High School",
        "created_at": datetime.utcnow().isoformat()
    }

    if db_inst.is_memory_fallback:
        db_inst.memory_store["users"] = [admin_user, teacher_user, student_user]
        db_inst.memory_store["students"] = []
        db_inst.memory_store["courses"] = COURSES_CATALOG
    else:
        for user_doc in [admin_user, teacher_user, student_user]:
            db_inst.db.users.replace_one({"_id": user_doc["_id"]}, user_doc, upsert=True)
        
        for c_doc in COURSES_CATALOG:
            db_inst.db.courses.replace_one({"id": c_doc["id"]}, c_doc, upsert=True)

    for st in SEED_STUDENTS:
        st_id = "student-demo-1" if st["name"] == "Arun Kumar" else str(uuid.uuid4())
        st["_id"] = st_id
        st["id"] = st_id
        st["created_at"] = datetime.utcnow().isoformat()

        guidance = predictor_service.generate_full_guidance(st)
        st["category"] = guidance["category"]
        st["top_stream"] = guidance["streams"][0]["title"] if guidance.get("streams") else "Computer Science"
        st["top_career"] = guidance["careers"][0]["title"] if guidance.get("careers") else "Software Developer"

        if db_inst.is_memory_fallback:
            db_inst.memory_store["students"].append(st)
        else:
            db_inst.db.students.replace_one({"_id": st["_id"]}, st, upsert=True)

if __name__ == "__main__":
    from app.database.mongodb import connect_to_mongo
    connect_to_mongo()
    seed_demo_data()
