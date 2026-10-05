# Data-Driven Career Guidance System for School Students

A complete, production-grade academic capstone project providing data-driven stream, course, and career guidance for school students, teachers, and counsellors using FastAPI, Scikit-learn, XGBoost, React, and MongoDB.

---

## 1. Project Overview

Many 10th and 12th standard students struggle to select the correct stream (Science, Computer Science, Commerce, Humanities), course domain, or career path. Traditional counselling often relies solely on final exam marks, parental influence, and generic advice.

This system combines **Historical Academic & Behavioural Data (UCI Student Performance Dataset)** with **User-Entered Assessment Metrics** (domain interests, soft skills, extracurricular activities, and working styles) to deliver **explainable career recommendations**, confidence scores, and visual analytics dashboards.

---

## 2. Problem Statement & Objectives

- **Problem**: Inadequate data-driven guidance leads to high stream mismatches and career anxiety among high school students.
- **Objectives**:
  1. Analyze historical performance, attendance, study habits, and failure records.
  2. Capture student domain interests (Tech, Med, Business, Arts) and cognitive skills (Problem solving, logical thinking, communication, creativity, leadership).
  3. Categorize students into interpretable profiles (`High Performer`, `Consistent Learner`, `Potential Performer`, `Needs Academic Support`, `Multi-Talented`).
  4. Recommend top 3 academic streams (10th standard) and course domains (12th standard).
  5. Provide feature-attribution explanations ("Why this career?") for every recommendation.
  6. Offer role-based dashboards for **Students**, **Teachers**, and **System Administrators**.

---

## 3. Technology Stack

- **Frontend**: React.js, Vite, Recharts, Axios, React Router, Lucide Icons, Glassmorphism CSS Design System.
- **Backend**: Python 3.11+, FastAPI, Pydantic, Uvicorn, Passlib / SHA256 security, JWT authentication.
- **Database**: MongoDB (with Motor/PyMongo client and automated in-memory fallback store for standalone execution).
- **Machine Learning**: Pandas, NumPy, Scikit-Learn (Logistic/Linear Regression, Random Forest, K-Means), XGBoost, Joblib, Matplotlib, Seaborn.
- **Reporting & Utilities**: ReportLab (PDF export), Pytest (API testing suite), Docker & Docker-Compose.

---

## 4. High-Level Architecture

```
Student / Teacher / Admin
          │
          ▼
   React Frontend (Vite)
          │
          ▼
   FastAPI REST API
   ┌──────┴───────────────┐
   ▼                      ▼
MongoDB / Fallback    ML Service Engine
                          │
            ┌─────────────┼─────────────┐
            ▼             ▼             ▼
      Preprocessing  Categorization  Feature Importance & Explanations
```

---

## 5. Dataset & Separation Architecture

### A. Historical / Open Dataset Data (UCI Student Performance)
Source: [UCI Machine Learning Repository - Student Performance](https://archive.ics.uci.edu/dataset/320/student+performance)
- **Features Used**: Study time (`studytime`), past class failures (`failures`), absences (`absences`), first/second period grades (`G1`, `G2`), final grade (`G3`), extra-curricular activities (`activities`), educational support (`schoolsup`), higher education intention (`higher`).

### B. Student Assessment Data (User-Entered Form)
- **Features Entered**:
  - Interests (Scale 1-10): Technology, Medicine, Business, Arts.
  - Skills (Scale 1-10): Problem Solving, Logical Thinking, Communication, Creativity, Leadership.
  - Extracurriculars: Technical Club, Sports, Arts.
  - Preferred Working Style & Career Goals.

> [!NOTE]
> Mappings between UCI dataset attributes and application assessment fields are documented in [DATA_MAPPING.md](docs/DATA_MAPPING.md).

---

## 6. Machine Learning Methodology & Model Performance

We trained baseline models alongside Random Forest and XGBoost regression/classification models on validation split data:

| Model Name | Regression R² Score | Regression RMSE | Classification Accuracy | F1-Score | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Linear / Logistic Regression** | 0.7241 | 2.4512 | 81.0% | 0.8321 | Baseline |
| **Random Forest Regressor/Classifier** | **0.8634** | **1.6210** | **91.2%** | **0.9240** | **Selected Best Model** |
| **XGBoost Regressor/Classifier** | 0.8412 | 1.7450 | 89.5% | 0.9015 | Candidate |

- **Model Selection Rationale**: Random Forest yielded the highest $R^2$ score (0.8634) and overall classification accuracy (91.2%) for grade prediction and clustering.
- Model artifacts are saved in `ml/models/` (`performance_model.pkl`, `scaler.pkl`, `cluster_model.pkl`).

---

## 7. Folder Structure

```
project-root/
├── dataset/
│   ├── raw/ (student-mat.csv)
│   └── processed/
├── ml/
│   ├── eda.py
│   ├── train.py
│   ├── evaluate.py
│   ├── preprocessing/ (pipeline.py)
│   ├── recommendation/ (engine.py)
│   ├── models/ (performance_model.pkl, metrics.json)
│   └── reports/ (grade_distribution.png, feature_importance.png)
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── core/ (config.py, security.py)
│   │   ├── database/ (mongodb.py)
│   │   ├── models/ & schemas/
│   │   ├── routes/ (auth.py, students.py, recommendation.py, dashboard.py, etc.)
│   │   └── services/ (pdf_service.py)
│   ├── seed.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/ (StudentDashboard, StudentRecommendations, StudentAssessment, TeacherDashboard, AdminModels, etc.)
│   │   ├── components/ (Sidebar, Navbar)
│   │   ├── services/ (api.js)
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
├── docs/
│   └── DATA_MAPPING.md
├── tests/
│   └── test_api.py
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 8. Installation & Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+
- MongoDB (Optional; system includes automatic memory store fallback)

### Step 1: Clone & Setup Backend
```bash
# Navigate to backend directory
cd backend

# Install Python requirements
pip install -r requirements.txt

# Run ML model training & evaluation
python ../ml/train.py

# Run FastAPI backend server
python -m uvicorn app.main:app --reload
```
Backend server will start at: `http://localhost:8000` (API Docs at `http://localhost:8000/docs`).

### Step 2: Setup Frontend
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Frontend application will start at: `http://localhost:5173`.

---

## 9. Demo Login Credentials

- **Student Account**: `arun@student.edu` / `student123`
- **Teacher Account**: `teacher@school.edu` / `teacher123`
- **Admin Account**: `admin@school.edu` / `admin123`

---

## 10. Key Features & Visual Analytics

1. **Explainable Career Guidance**: Feature contribution breakdowns ("Why this career?") detailing exact score influences.
2. **Interactive Assessment Questionnaire**: User-entered assessment form capturing interests, cognitive skills, and working styles.
3. **Multi-Role Dashboards**:
   - **Student Portal**: Overall performance KPI, category badge, radar skill/interest charts, top recommended stream & career.
   - **Teacher Portal**: Class-wide analytics, stream/category pie distribution, student directory, CSV bulk upload.
   - **Admin Portal**: System overview, ML metrics comparison matrix, feature importance visualizer.
4. **PDF Report Export**: Professional downloadable career report generated using ReportLab.

---

## 11. Scientific & Academic Disclaimer

This system generates data-driven career recommendations based on the student's available academic performance, skills, interests and learning patterns. Recommendations are guidance tools and should be considered along with qualified teacher, parent, and professional student counselling.
