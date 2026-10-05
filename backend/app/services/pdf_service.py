import os
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_student_pdf_report(student_data: dict, prediction_data: dict) -> bytes:
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
    story = []
    
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'DocTitle', parent=styles['Heading1'], fontSize=18, leading=22,
        textColor=colors.HexColor('#4f46e5'), alignment=1, spaceAfter=8
    )
    subtitle_style = ParagraphStyle(
        'DocSubtitle', parent=styles['Normal'], fontSize=9, leading=12,
        textColor=colors.HexColor('#6b7280'), alignment=1, spaceAfter=15
    )
    section_heading = ParagraphStyle(
        'SectionHeading', parent=styles['Heading2'], fontSize=12, leading=15,
        textColor=colors.HexColor('#1e1b4b'), spaceBefore=10, spaceAfter=6
    )
    normal_text = ParagraphStyle(
        'NormalText', parent=styles['Normal'], fontSize=8.5, leading=12,
        textColor=colors.HexColor('#374151')
    )

    # Title Banner
    story.append(Paragraph("12TH STANDARD COURSE & CAREER GUIDANCE REPORT", title_style))
    story.append(Paragraph("Data-Driven Educational Path, Skill Gap Analysis & 6-Month Actionable Roadmap", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#e5e7eb'), spaceAfter=12))

    # Student Profile Summary
    st_name = student_data.get('name', 'Arun Kumar')
    st_email = student_data.get('email', 'arun@student.edu')
    st_grade = str(student_data.get('grade', 12))
    st_school = student_data.get('school', 'Gabriel Pereira High School')

    info_data = [
        [Paragraph("<b>Student Name:</b>", normal_text), Paragraph(st_name, normal_text), Paragraph("<b>Grade Standard:</b>", normal_text), Paragraph(f"Class {st_grade}", normal_text)],
        [Paragraph("<b>Email Address:</b>", normal_text), Paragraph(st_email, normal_text), Paragraph("<b>School Institute:</b>", normal_text), Paragraph(st_school, normal_text)],
        [Paragraph("<b>Profile Completeness:</b>", normal_text), Paragraph(f"{prediction_data.get('profile_completeness', 100)}%", normal_text), Paragraph("<b>Recommendation Confidence:</b>", normal_text), Paragraph(f"{prediction_data.get('recommendation_confidence', 86)}%", normal_text)]
    ]
    t_info = Table(info_data, colWidths=[110, 160, 110, 160])
    t_info.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f9fafb')),
        ('PADDING', (0,0), (-1,-1), 5),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e5e7eb')),
    ]))
    story.append(t_info)
    story.append(Spacer(1, 10))

    # Top Recommended 12th Courses Table
    story.append(Paragraph("Top Recommended Degree Courses (Stage 1)", section_heading))
    top_courses = prediction_data.get('top_courses', [])
    c_rows = [[Paragraph("<b>Degree Course Name</b>", normal_text), Paragraph("<b>Degree Type</b>", normal_text), Paragraph("<b>Domain</b>", normal_text), Paragraph("<b>Match Score</b>", normal_text)]]
    for c in top_courses[:4]:
        c_rows.append([
            Paragraph(c.get('course', 'B.Tech CS'), normal_text),
            Paragraph(c.get('degree_type', 'Bachelor\'s'), normal_text),
            Paragraph(c.get('domain', 'Technology'), normal_text),
            Paragraph(f"<b>{c.get('match_score', 90)}%</b>", normal_text)
        ])
    t_c = Table(c_rows, colWidths=[180, 120, 140, 100])
    t_c.setStyle(TableStyle([
        ('HEADERBACKGROUND', (0,0), (-1,0), colors.HexColor('#e0e7ff')),
        ('PADDING', (0,0), (-1,-1), 5),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
    ]))
    story.append(t_c)
    story.append(Spacer(1, 10))

    # Top Career Paths Table (Stage 2)
    story.append(Paragraph("Top Career Outcomes & Preparation Readiness (Stage 2)", section_heading))
    top_careers = prediction_data.get('top_careers', [])
    car_rows = [[Paragraph("<b>Target Career Title</b>", normal_text), Paragraph("<b>Parent Degree Course</b>", normal_text), Paragraph("<b>Preparation Readiness</b>", normal_text)]]
    for car in top_careers[:4]:
        car_rows.append([
            Paragraph(car.get('career_title', 'Software Developer'), normal_text),
            Paragraph(car.get('parent_course', 'B.Tech Computer Science'), normal_text),
            Paragraph(f"<b>{car.get('readiness_score', 88)}%</b>", normal_text)
        ])
    t_car = Table(car_rows, colWidths=[200, 220, 120])
    t_car.setStyle(TableStyle([
        ('HEADERBACKGROUND', (0,0), (-1,0), colors.HexColor('#dbeafe')),
        ('PADDING', (0,0), (-1,-1), 5),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
    ]))
    story.append(t_car)
    story.append(Spacer(1, 10))

    # Skill Gap & Roadmap Section
    story.append(Paragraph("Personalized Skill Gap Analysis & 6-Month Roadmap", section_heading))
    gaps = prediction_data.get('skill_gaps', [])
    gap_rows = [[Paragraph("<b>Required Skill</b>", normal_text), Paragraph("<b>Target Level</b>", normal_text), Paragraph("<b>Your Level</b>", normal_text), Paragraph("<b>Status</b>", normal_text)]]
    for g in gaps[:4]:
        gap_rows.append([
            Paragraph(g.get('skill', ''), normal_text),
            Paragraph(g.get('target_level', ''), normal_text),
            Paragraph(g.get('student_level', ''), normal_text),
            Paragraph(g.get('status', ''), normal_text)
        ])
    t_gap = Table(gap_rows, colWidths=[160, 100, 100, 180])
    t_gap.setStyle(TableStyle([
        ('HEADERBACKGROUND', (0,0), (-1,0), colors.HexColor('#fef3c7')),
        ('PADDING', (0,0), (-1,-1), 5),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#fde68a')),
    ]))
    story.append(t_gap)
    story.append(Spacer(1, 12))

    # Disclaimer
    disclaimer_text = (
        "<b>Academic Disclaimer:</b> " + prediction_data.get('disclaimer', 
        "This report provides personalized educational guidance based on available academic, skill, interest and NLP responses. Recommendations should be reviewed with qualified educators.")
    )
    story.append(Paragraph(disclaimer_text, ParagraphStyle('Disc', parent=normal_text, fontSize=7.5, textColor=colors.HexColor('#6b7280'))))

    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
