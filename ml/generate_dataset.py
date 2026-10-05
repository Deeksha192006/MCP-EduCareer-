import os
import random
import numpy as np
import pandas as pd

DATASET_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dataset", "raw"))
os.makedirs(DATASET_DIR, exist_ok=True)
DATASET_PATH = os.path.join(DATASET_DIR, "student_extended_dataset.csv")

def generate_extended_student_dataset(n_samples=2500, random_seed=42):
    np.random.seed(random_seed)
    random.seed(random_seed)

    records = []
    
    track_profiles = [
        {
            "career": "doctor_healthcare",
            "stream": "medical_science",
            "science_mean": 92, "math_mean": 75, "english_mean": 82,
            "med_interest_mean": 9.5, "tech_interest_mean": 4.5, "biz_interest_mean": 4.0, "arts_interest_mean": 4.0,
            "nlp_med_mean": 9.0, "nlp_tech_mean": 3.5, "nlp_biz_mean": 3.5
        },
        {
            "career": "software_developer",
            "stream": "computer_science",
            "science_mean": 80, "math_mean": 92, "english_mean": 78,
            "med_interest_mean": 3.5, "tech_interest_mean": 9.5, "biz_interest_mean": 5.5, "arts_interest_mean": 4.0,
            "nlp_med_mean": 3.0, "nlp_tech_mean": 9.2, "nlp_biz_mean": 4.5
        },
        {
            "career": "ai_ml_engineer",
            "stream": "computer_science",
            "science_mean": 85, "math_mean": 95, "english_mean": 80,
            "med_interest_mean": 4.0, "tech_interest_mean": 9.8, "biz_interest_mean": 5.0, "arts_interest_mean": 3.5,
            "nlp_med_mean": 3.5, "nlp_tech_mean": 9.5, "nlp_biz_mean": 4.0
        },
        {
            "career": "tech_entrepreneur",
            "stream": "commerce",
            "science_mean": 75, "math_mean": 85, "english_mean": 85,
            "med_interest_mean": 3.5, "tech_interest_mean": 8.5, "biz_interest_mean": 9.5, "arts_interest_mean": 5.0,
            "nlp_med_mean": 3.0, "nlp_tech_mean": 8.0, "nlp_biz_mean": 9.5
        },
        {
            "career": "business_analyst",
            "stream": "commerce",
            "science_mean": 70, "math_mean": 88, "english_mean": 84,
            "med_interest_mean": 3.0, "tech_interest_mean": 6.5, "biz_interest_mean": 9.5, "arts_interest_mean": 4.5,
            "nlp_med_mean": 2.5, "nlp_tech_mean": 5.5, "nlp_biz_mean": 9.2
        },
        {
            "career": "ui_ux_designer",
            "stream": "humanities",
            "science_mean": 70, "math_mean": 72, "english_mean": 88,
            "med_interest_mean": 3.0, "tech_interest_mean": 7.0, "biz_interest_mean": 5.0, "arts_interest_mean": 9.5,
            "nlp_med_mean": 2.5, "nlp_tech_mean": 6.0, "nlp_biz_mean": 4.5
        },
        {
            "career": "psychologist",
            "stream": "humanities",
            "science_mean": 75, "math_mean": 68, "english_mean": 92,
            "med_interest_mean": 6.5, "tech_interest_mean": 3.5, "biz_interest_mean": 4.0, "arts_interest_mean": 8.5,
            "nlp_med_mean": 6.0, "nlp_tech_mean": 3.0, "nlp_biz_mean": 4.0
        }
    ]

    for i in range(n_samples):
        prof = random.choice(track_profiles)
        grade_std = random.choice([10, 12])
        
        # Marks
        science = int(np.clip(np.random.normal(prof["science_mean"], 6), 40, 100))
        math = int(np.clip(np.random.normal(prof["math_mean"], 6), 40, 100))
        english = int(np.clip(np.random.normal(prof["english_mean"], 6), 40, 100))
        attendance = int(np.clip(np.random.normal(92, 5), 60, 100))
        studytime = random.choice([1, 2, 3, 4])
        failures = random.choices([0, 1, 2], weights=[0.85, 0.10, 0.05])[0]

        # Ratings 1-10
        problem_solving = int(np.clip(np.random.normal(8 if math > 80 else 6, 1), 1, 10))
        logical_thinking = int(np.clip(np.random.normal(8 if math > 80 else 6, 1), 1, 10))
        communication = int(np.clip(np.random.normal(8 if english > 80 else 6, 1), 1, 10))
        creativity = int(np.clip(np.random.normal(9 if prof["career"] == "ui_ux_designer" else 6, 1), 1, 10))
        leadership = int(np.clip(np.random.normal(9 if "entrepreneur" in prof["career"] else 6, 1), 1, 10))

        # Interests
        tech_interest = int(np.clip(np.random.normal(prof["tech_interest_mean"], 1.0), 1, 10))
        med_interest = int(np.clip(np.random.normal(prof["med_interest_mean"], 1.0), 1, 10))
        biz_interest = int(np.clip(np.random.normal(prof["biz_interest_mean"], 1.0), 1, 10))
        arts_interest = int(np.clip(np.random.normal(prof["arts_interest_mean"], 1.0), 1, 10))

        # NLP mindset scores
        nlp_med = round(float(np.clip(np.random.normal(prof["nlp_med_mean"], 1.0), 1.0, 10.0)), 1)
        nlp_tech = round(float(np.clip(np.random.normal(prof["nlp_tech_mean"], 1.0), 1.0, 10.0)), 1)
        nlp_biz = round(float(np.clip(np.random.normal(prof["nlp_biz_mean"], 1.0), 1.0, 10.0)), 1)

        overall = round((math * 0.4 + science * 0.4 + english * 0.2), 1)

        records.append({
            "student_id": f"STD-{1000 + i}",
            "grade_std": grade_std,
            "math": math,
            "science": science,
            "english": english,
            "attendance": attendance,
            "studytime": studytime,
            "failures": failures,
            "overall_percentage": overall,
            "problem_solving": problem_solving,
            "logical_thinking": logical_thinking,
            "communication": communication,
            "creativity": creativity,
            "leadership": leadership,
            "tech_interest": tech_interest,
            "med_interest": med_interest,
            "biz_interest": biz_interest,
            "arts_interest": arts_interest,
            "nlp_med": nlp_med,
            "nlp_tech": nlp_tech,
            "nlp_biz": nlp_biz,
            "recommended_stream": prof["stream"],
            "target_career": prof["career"]
        })

    df = pd.DataFrame(records)
    df.to_csv(DATASET_PATH, index=False)
    print(f"Successfully generated extended dataset with {len(df)} student samples at {DATASET_PATH}")
    return df

if __name__ == "__main__":
    generate_extended_student_dataset()
