# Data Mapping Specification

## Data Architecture & Separation

This document specifies the exact mapping between the **Historical Open Dataset (UCI Student Performance Dataset)** and the **Student Assessment Data (User-Entered App Features)**, detailing how they combine into feature vectors for machine learning and career recommendation engines.

> [!IMPORTANT]
> - **Historical Open Dataset**: Used for baseline academic prediction, attendance impact, failure history, and learning behaviour modeling.
> - **Student Assessment Data**: User-entered assessment fields evaluating domain interests, soft/hard skills, extracurricular activities, and working style preferences.

---

## 1. Feature Mapping Matrix

| Feature Category | Source Field (UCI Dataset / App Form) | Internal Application Feature | Data Type | Scale / Range | Purpose / Engine Role |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Academic Performance** | `G1`, `G2`, `G3` (UCI) / `math`, `science`, `english` (Form) | `academic_score` | Float | 0 - 100% | Performance prediction, Stream scoring (Science/CS/Commerce) |
| **Attendance & Discipline** | `absences` (UCI) / `attendance_percentage` (Form) | `attendance_score` | Float | 0 - 100% | Learning behaviour score, Risk detection |
| **Learning Effort** | `studytime`, `failures`, `schoolsup`, `famsup` (UCI) | `learning_behaviour_score` | Float | 0 - 1.0 | Student Categorization (High Performer, Needs Support, etc.) |
| **Extracurricular** | `activities` (UCI) / `technical`, `sports`, `arts` (Form) | `activity_score` | Float | 0 - 1.0 | Multi-Talented categorization, Stream & Career affinity |
| **Domain Interests** | Assessment Form | `interests.technology` | Integer | 1 - 10 | Stream (CS/Tech), Career (Software, AI, Cybersecurity) |
| **Domain Interests** | Assessment Form | `interests.medicine` | Integer | 1 - 10 | Course & Career (Healthcare, Biotech, Doctor) |
| **Domain Interests** | Assessment Form | `interests.business` | Integer | 1 - 10 | Stream (Commerce), Career (Finance, Marketing, Admin) |
| **Domain Interests** | Assessment Form | `interests.arts` | Integer | 1 - 10 | Stream (Humanities), Career (Design, Animation, Arts) |
| **Cognitive & Soft Skills** | Assessment Form | `skills.problem_solving` | Integer | 1 - 10 | Strength score, CS/Tech/Science stream fit |
| **Cognitive & Soft Skills** | Assessment Form | `skills.logical_thinking` | Integer | 1 - 10 | Strength score, Science/Engineering path fit |
| **Cognitive & Soft Skills** | Assessment Form | `skills.communication` | Integer | 1 - 10 | Strength score, Commerce/Humanities/Law fit |
| **Cognitive & Soft Skills** | Assessment Form | `skills.creativity` | Integer | 1 - 10 | Strength score, Design/Content/Media fit |
| **Cognitive & Soft Skills** | Assessment Form | `skills.leadership` | Integer | 1 - 10 | Strength score, Business/Management path fit |
| **Aspirational Goals** | `higher` (UCI) / Assessment Form | `career_preference`, `working_style` | String | Categorical | Explanation engine justification & validation |

---

## 2. Derived Feature Engineering Formulas

1. **Academic Score**:
   $$\text{academic\_score} = \frac{\text{math} \times 0.35 + \text{science} \times 0.35 + \text{english} \times 0.30}{100} \times 100$$

2. **Attendance Score**:
   $$\text{attendance\_score} = \max\left(0, 100 - \frac{\text{absences}}{93} \times 100\right)$$

3. **Learning Behaviour Score**:
   $$\text{learning\_behaviour\_score} = \text{Norm}(\text{studytime}) \times 0.4 + (1 - \text{failures}/4) \times 0.4 + \text{support\_flag} \times 0.2$$

4. **Strength Score**:
   $$\text{strength\_score} = \frac{\text{problem\_solving} + \text{logical\_thinking} + \text{communication} + \text{creativity} + \text{leadership}}{50} \times 100$$

---

## 3. Machine Learning Target Mapping

- **Target 1: Performance Prediction (`G3` / `overall_percentage`)**:
  - Regression Target: $G3 \in [0, 20]$ or converted percentage $0 - 100\%$.
  - Classification Target: Pass ($G3 \ge 10$) vs Fail ($G3 < 10$), or Grade levels (A: $\ge 16$, B: $14-15$, C: $12-13$, D: $10-11$, F: $<10$).
- **Target 2: Student Category (Clustering / Rule Engine)**:
  - `HIGH PERFORMER`: Academic Score $\ge 80\%$, Attendance $\ge 85\%$, High Learning Behaviour.
  - `CONSISTENT LEARNER`: Academic Score $65-80\%$, Stable Attendance $\ge 80\%$.
  - `POTENTIAL PERFORMER`: Academic Score $50-65\%$, Study time $\ge 3$, High improvement trajectory.
  - `NEEDS ACADEMIC SUPPORT`: Academic Score $< 50\%$ or Attendance $< 70\%$ or Failures $> 0$.
  - `MULTI-TALENTED`: High Academics ($> 75\%$) + Participation in 2+ extracurricular domains (Tech/Sports/Arts).
