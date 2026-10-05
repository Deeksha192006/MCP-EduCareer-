DATA_SCIENCE_LEVELS = [
    {
        "levelId": "ds_lvl_1",
        "levelName": "Level 1 — Pattern & Trend Sleuth",
        "skillTested": "Pattern Recognition & Numerical Skills",
        "difficulty": "easy",
        "instruction": "Analyze the web traffic sequence (in thousands of visits) over consecutive days: 120, 150, 190, 240, 300, ? . Identify the accelerating rate of growth and determine the next value.",
        "sequence": [120, 150, 190, 240, 300, "?"],
        "deltaSteps": "+30, +40, +50, +60... (+70)",
        "options": [
            {"id": "opt_370", "value": "370", "label": "370k (Increment increases by +10 each day: +70)", "isCorrect": True, "explanation": "Spot on! The second-order difference is constant (+10): 30, 40, 50, 60, so next addition is +70, yielding 370k."},
            {"id": "opt_360", "value": "360", "label": "360k (Constant +60 repeat)", "isCorrect": False, "explanation": "Incorrect: growth is non-linear; the step itself is expanding by 10 each day."},
            {"id": "opt_380", "value": "380", "label": "380k (Steep acceleration +80)", "isCorrect": False, "explanation": "Too high: the delta increases by 10, not 20."},
            {"id": "opt_350", "value": "350", "label": "350k (Arithmetic average)", "isCorrect": False, "explanation": "Underestimates the accelerating trend."}
        ],
        "correctOptionId": "opt_370",
        "maxScore": 20.0
    },
    {
        "levelId": "ds_lvl_2",
        "levelName": "Level 2 — Outlier & Anomaly Isolation",
        "skillTested": "Anomaly Detection & Data Interpretation",
        "difficulty": "medium",
        "instruction": "A cloud cluster tracks API endpoint response latency across 8 microservices. Normal latencies cluster between 20ms and 26ms. Identify the outlier anomaly and the statistical reason it represents an incident.",
        "dataset": [
            {"service": "Auth-Service", "latency": 22, "isAnomaly": False},
            {"service": "Cart-Service", "latency": 25, "isAnomaly": False},
            {"service": "Catalog-Service", "latency": 21, "isAnomaly": False},
            {"service": "Search-Service", "latency": 24, "isAnomaly": False},
            {"service": "Payment-Gateway", "latency": 198, "isAnomaly": True},
            {"service": "Notification-Service", "latency": 26, "isAnomaly": False},
            {"service": "User-Profile", "latency": 23, "isAnomaly": False},
            {"service": "Review-Service", "latency": 20, "isAnomaly": False}
        ],
        "options": [
            {"id": "opt_payment", "label": "Payment-Gateway (198ms) — High outlier exceeding 7 standard deviations above normal cluster (~23ms)", "isCorrect": True, "explanation": "Correct! 198ms is an extreme statistical outlier (z-score > 7), indicating a critical database bottleneck or network timeout."},
            {"id": "opt_notif", "label": "Notification-Service (26ms) — Maximum latency in the 20-30ms range", "isCorrect": False, "explanation": "26ms is well within normal operating variance (mean ~23ms)."},
            {"id": "opt_catalog", "label": "Catalog-Service (21ms) — Abnormally low latency", "isCorrect": False, "explanation": "21ms is optimal healthy performance, not an incident outlier."},
            {"id": "opt_all", "label": "All services are within standard distributed computing tolerance", "isCorrect": False, "explanation": "198ms is nearly 10x the median latency and cannot be ignored in production."}
        ],
        "correctOptionId": "opt_payment",
        "maxScore": 20.0
    },
    {
        "levelId": "ds_lvl_3",
        "levelName": "Level 3 — Correlation vs. Causation Mystery",
        "skillTested": "Logical Reasoning & Scientific Thinking",
        "difficulty": "medium",
        "instruction": "A city open-data study discovered a strong positive correlation (r = 0.89) between Ice Cream Sales volume and Beach Rescue / Sunburn Incidents. What is the sound data science interpretation?",
        "options": [
            {"id": "opt_confounder", "label": "Confounding Variable: Hot summer temperatures cause both higher ice cream consumption AND increased beach outdoor exposure.", "isCorrect": True, "explanation": "Excellent scientific reasoning! Correlation does not equal causation. Both metrics are independently driven by ambient summer heat."},
            {"id": "opt_direct_cause", "label": "Direct Causation: Consuming cold dairy directly increases skin vulnerability to UV radiation.", "isCorrect": False, "explanation": "Biologically and logically unsound: there is no causal pathway connecting ice cream to UV erythema."},
            {"id": "opt_reverse_cause", "label": "Reverse Causation: Having a sunburn causes people to seek out ice cream parlors.", "isCorrect": False, "explanation": "While cooling down feels nice, it does not explain rescue incidents or the aggregate population curve."},
            {"id": "opt_spurious", "label": "Data Error: The Pearson correlation coefficient must have been computed incorrectly.", "isCorrect": False, "explanation": "The correlation is genuine and statistically valid; the mistake is assuming causation without controlling for the third variable (temperature)."}
        ],
        "correctOptionId": "opt_confounder",
        "maxScore": 20.0
    },
    {
        "levelId": "ds_lvl_4",
        "levelName": "Level 4 — Missing Data Imputation & Deduction",
        "skillTested": "Numerical Skills & Matrix Deductions",
        "difficulty": "hard",
        "instruction": "Examine the quarterly sales matrix below. One crucial regional entry (North Region, Q3) was corrupted during database migration. Use the marginal row/column summaries to deduce the exact missing value.",
        "table": [
            {"region": "North", "q1": 45, "q2": 55, "q3": "?", "total": 160},
            {"region": "South", "q1": 30, "q2": 40, "q3": 40, "total": 110},
            {"region": "West", "q1": 50, "q2": 60, "q3": 50, "total": 160},
            {"region": "Total", "q1": 125, "q2": 155, "q3": 150, "total": 430}
        ],
        "options": [
            {"id": "opt_60", "value": "60", "label": "60 ($60k) — Verified by Row: 160 - (45 + 55) = 60, and Column: 150 - (40 + 50) = 60", "isCorrect": True, "explanation": "Mathematical precision! Both the row total (160 - 100 = 60) and column total (150 - 90 = 60) cross-verify 60."},
            {"id": "opt_50", "value": "50", "label": "50 ($50k) — Equal to West Q3", "isCorrect": False, "explanation": "Row sum would only equal 150, failing the row total constraint of 160."},
            {"id": "opt_70", "value": "70", "label": "70 ($70k) — Based on +10 step from Q2", "isCorrect": False, "explanation": "Fails row total (would yield 170 instead of 160)."},
            {"id": "opt_55", "value": "55", "label": "55 ($55k) — Row median value", "isCorrect": False, "explanation": "Violates the documented marginal totals."}
        ],
        "correctOptionId": "opt_60",
        "maxScore": 20.0
    },
    {
        "levelId": "ds_lvl_5",
        "levelName": "Level 5 — The Midnight Cart Surge Mystery",
        "skillTested": "Analytical Thinking & Hypothesis Testing",
        "difficulty": "hard",
        "instruction": "At 02:15 AM on Sunday, an online retail platform recorded 8,500 checkout attempts in 10 minutes. The CEO needs a conclusive data diagnosis before taking action. Examine the 3 log clues below and select the data-backed diagnosis and mitigation.",
        "clues": [
            "Log Clue 1: 94% of incoming traffic originates from a single /24 IP subnet with identical User-Agent headers.",
            "Log Clue 2: Average user session duration is 0.38 seconds (Human baseline: 145 seconds).",
            "Log Clue 3: 88% of transactions failed at credit card CVV verification, with sequential alphanumeric card attempts."
        ],
        "options": [
            {
                "id": "opt_bot_attack",
                "label": "Automated Credential-Stuffing / Card Testing Bot Attack — Immediate Action: Rate-limit the suspicious /24 subnet, enforce CAPTCHA, and alert payment security.",
                "isCorrect": True,
                "explanation": "Master detective work! The sub-second session length, concentrated IP cluster, and sequential CVV failures prove an automated carding bot attack, requiring immediate rate-limiting and security filtering."
            },
            {
                "id": "opt_viral_campaign",
                "label": "Viral Influencer Flash Sale — Immediate Action: Scale cloud Kubernetes pods to handle genuine customer demand.",
                "isCorrect": False,
                "explanation": "Flawed hypothesis: Real human shoppers browse for minutes, have diverse geographical IPs, and do not trigger 88% CVV validation errors."
            },
            {
                "id": "opt_payment_bug",
                "label": "Payment Gateway Configuration Glitch — Immediate Action: Shut down the entire store checkout.",
                "isCorrect": False,
                "explanation": "Disproportionate action: The sub-second session duration and single IP cluster demonstrate malicious external traffic, not internal software code failure."
            },
            {
                "id": "opt_crawler",
                "label": "Benign Search Engine Web Indexer — Immediate Action: Take no action, allow indexing.",
                "isCorrect": False,
                "explanation": "Search engine crawlers (Googlebot, Bingbot) do not attempt checkout purchases or input credit card numbers."
            }
        ],
        "correctOptionId": "opt_bot_attack",
        "maxScore": 20.0
    }
]

def evaluate_data_science_submission(submissions: list) -> dict:
    """
    Server-side validation of Data Detective level submissions.
    Calculates exact scores, individual skill competencies, and exploratory feedback.
    """
    level_dict = {lvl["levelId"]: lvl for lvl in DATA_SCIENCE_LEVELS}
    
    total_score = 0.0
    correct_count = 0
    level_results = []
    
    skill_totals = {
        "analyticalThinking": 0.0,
        "dataInterpretation": 0.0,
        "logicalReasoning": 0.0,
        "numericalSkills": 0.0,
        "hypothesisTesting": 0.0
    }
    
    for sub in submissions:
        lvl = level_dict.get(sub.levelId)
        if not lvl:
            continue
            
        selected_id = sub.selectedOption or ""
        is_correct = (selected_id == lvl["correctOptionId"])
        
        # Calculate time & attempt penalty if any
        earned = lvl["maxScore"] if is_correct else 0.0
        if is_correct and sub.attempts > 1:
            earned = max(5.0, earned - (sub.attempts - 1) * 3.0)
            
        total_score += earned
        if is_correct:
            correct_count += 1
            
        # Skill attribution mapping based on level
        if lvl["levelId"] == "ds_lvl_1":
            skill_totals["patternRecognition"] = skill_totals.get("patternRecognition", 0) + (earned / lvl["maxScore"]) * 100
            skill_totals["numericalSkills"] += (earned / lvl["maxScore"]) * 100
        elif lvl["levelId"] == "ds_lvl_2":
            skill_totals["dataInterpretation"] += (earned / lvl["maxScore"]) * 100
            skill_totals["analyticalThinking"] += (earned / lvl["maxScore"]) * 50
        elif lvl["levelId"] == "ds_lvl_3":
            skill_totals["logicalReasoning"] += (earned / lvl["maxScore"]) * 100
            skill_totals["analyticalThinking"] += (earned / lvl["maxScore"]) * 50
        elif lvl["levelId"] == "ds_lvl_4":
            skill_totals["numericalSkills"] += (earned / lvl["maxScore"]) * 100
            skill_totals["dataInterpretation"] += (earned / lvl["maxScore"]) * 50
        elif lvl["levelId"] == "ds_lvl_5":
            skill_totals["hypothesisTesting"] += (earned / lvl["maxScore"]) * 100
            skill_totals["analyticalThinking"] += (earned / lvl["maxScore"]) * 100
            
        level_results.append({
            "levelId": lvl["levelId"],
            "levelName": lvl["levelName"],
            "skillTested": lvl["skillTested"],
            "difficulty": lvl["difficulty"],
            "isCorrect": is_correct,
            "scoreEarned": round(earned, 1),
            "maxScore": lvl["maxScore"],
            "timeTaken": sub.timeTaken,
            "attempts": sub.attempts,
            "feedback": next((opt["explanation"] for opt in lvl["options"] if opt["id"] == selected_id), "Answer recorded.")
        })
        
    accuracy = round((correct_count / len(DATA_SCIENCE_LEVELS)) * 100.0, 1)
    
    # Normalize skill scores to 0 - 100 scale
    final_skills = {
        "analyticalThinking": round(min(100.0, skill_totals["analyticalThinking"] / 2.0), 1),
        "dataInterpretation": round(min(100.0, skill_totals["dataInterpretation"] / 1.5), 1),
        "logicalReasoning": round(min(100.0, skill_totals["logicalReasoning"]), 1),
        "numericalSkills": round(min(100.0, skill_totals["numericalSkills"] / 2.0), 1),
        "hypothesisTesting": round(min(100.0, skill_totals["hypothesisTesting"]), 1)
    }
    
    # Compute Compatibility Band
    if total_score >= 85.0:
        band = "Exceptional Analytical Aptitude"
        recommendation_note = "Your demonstrated mastery in pattern deduction, statistical anomaly detection, and empirical hypothesis testing shows a powerful alignment with B.Sc. Data Science & Analytics."
    elif total_score >= 65.0:
        band = "Strong Data Aptitude"
        recommendation_note = "You demonstrated solid logical and numerical reasoning across core data scenarios, showing great potential for data analysis and predictive modeling."
    elif total_score >= 45.0:
        band = "Moderate Analytical Orientation"
        recommendation_note = "You showed good foundational intuition for data interpretation. Strengthening statistics and discrete logic will unlock deeper data science competencies."
    else:
        band = "Emerging Analytical Skills"
        recommendation_note = "An exploratory starting point. Exploring practical data visualization and statistical fundamentals will help build foundational confidence."
        
    return {
        "gameScore": round(total_score, 1),
        "accuracy": accuracy,
        "skillScores": final_skills,
        "levelResults": level_results,
        "compatibilityBand": band,
        "recommendationNote": recommendation_note,
        "strengths": [k for k, v in final_skills.items() if v >= 75.0] or ["Data Curiosity"],
        "growthAreas": [k for k, v in final_skills.items() if v < 70.0] or ["Advanced Statistical Imputation"],
        "recommendedRoles": ["Data Scientist", "Data Analyst", "Business Intelligence Specialist", "Machine Learning Associate", "Data Engineer"]
    }
