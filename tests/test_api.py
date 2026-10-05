import sys
import os
import pytest
from fastapi.testclient import TestClient

# Add backend directory to python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

def test_auth_login_admin():
    response = client.post("/api/auth/login", json={
        "email": "admin@school.edu",
        "password": "admin123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["role"] == "admin"

def test_auth_login_student():
    response = client.post("/api/auth/login", json={
        "email": "arun@student.edu",
        "password": "student123"
    })
    assert response.status_code == 200
    assert response.json()["user"]["role"] == "student"

def test_list_students():
    response = client.get("/api/students")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) > 0

def test_create_student():
    new_student = {
        "name": "Test Student",
        "email": "teststudent@school.edu",
        "grade": 10,
        "school": "Test High",
        "academic": {"math": 80, "science": 85, "english": 75, "attendance_percentage": 92},
        "skills": {"problem_solving": 8, "logical_thinking": 8, "communication": 7, "creativity": 6, "leadership": 7},
        "interests": {"technology": 9, "medicine": 5, "business": 6, "arts": 4},
        "activities": {"technical": True, "sports": False, "arts": False}
    }
    response = client.post("/api/students", json=new_student)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Student"
    assert "category" in data

def test_recommendations():
    response = client.get("/api/recommend/student-demo-1")
    assert response.status_code == 200
    data = response.json()
    assert "category" in data
    assert "streams" in data
    assert "careers" in data

def test_ml_metrics():
    response = client.get("/api/ml/metrics")
    assert response.status_code == 200
    assert "best_model" in response.json()

def test_pdf_report_export():
    response = client.get("/api/reports/export/student-demo-1")
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"

import uuid

def test_user_registration():
    unique_email = f"user_{uuid.uuid4().hex[:8]}@student.edu"
    response = client.post("/api/auth/register", json={
        "name": "New Entrepreneur Student",
        "email": unique_email,
        "password": "password123",
        "role": "student",
        "grade": 10,
        "school": "Innovation Academy"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["name"] == "New Entrepreneur Student"


def test_assessment_with_nlp_mindset():
    response = client.post("/api/assessment", json={
        "student_id": "student-demo-1",
        "academic": {"math": 90, "science": 88, "english": 82, "attendance_percentage": 95},
        "skills": {"problem_solving": 9, "logical_thinking": 9, "communication": 8, "creativity": 7, "leadership": 9},
        "interests": {"technology": 10, "medicine": 4, "business": 9, "arts": 5},
        "activities": {"technical": True, "sports": False, "arts": True},
        "career_preference": "Tech Entrepreneur / Startup Founder",
        "preferred_working_style": "Venture Leadership",
        "text_responses": {
            "dream_project": "I want to launch a scalable tech startup that builds AI models for enterprise automation.",
            "workplace_mindset": "I thrive when taking risks, founding companies, raising venture capital, and leading teams.",
            "learning_interests": "Reading startup biographies, business finance books, and building Python software apps."
        }
    })
    assert response.status_code == 200
    data = response.json()
    assert "nlp_mindset_scores" in data
    assert "detected_mindset_tags" in data
    assert any("Entrepreneurial" in tag for tag in data["detected_mindset_tags"])

