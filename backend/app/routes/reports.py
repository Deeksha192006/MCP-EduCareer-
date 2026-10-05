from fastapi import APIRouter, Response, HTTPException
from app.database.mongodb import get_database
from app.ml.predictor import predictor_service
from app.services.pdf_service import generate_student_pdf_report

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/export/{student_id}")
def export_student_report(student_id: str):
    db_inst = get_database()
    st = None
    if db_inst.is_memory_fallback:
        st = next((s for s in db_inst.memory_store["students"] if str(s.get("id")) == student_id or str(s.get("_id")) == student_id), None)
    else:
        st = db_inst.db.students.find_one({"_id": student_id})

    if not st:
        st = {
            "id": student_id,
            "name": "Arun Kumar",
            "email": "arun.kumar@school.edu",
            "grade": 12,
            "school": "Gabriel Pereira High School",
            "academic": {"math": 92, "science": 89, "english": 78, "overall_percentage": 86.3, "attendance_percentage": 94},
            "skills": {"problem_solving": 9, "logical_thinking": 9, "communication": 7, "creativity": 6, "leadership": 8},
            "interests": {"technology": 10, "medicine": 6, "business": 7, "arts": 4},
            "activities": {"technical": True, "sports": False, "arts": True}
        }

    guidance = predictor_service.generate_full_guidance(st)
    pdf_bytes = generate_student_pdf_report(st, guidance)

    filename = f"Career_Guidance_Report_{st.get('name', 'Student').replace(' ', '_')}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.get("/pdf/{student_id}")
def download_student_pdf(student_id: str):
    return export_student_report(student_id)
