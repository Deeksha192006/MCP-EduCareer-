BBA_SIMULATION_ROUNDS = [
    {
        "roundId": "bba_rnd_1",
        "roundNumber": 1,
        "title": "Round 1: Value Proposition & Product Selection",
        "skillTested": "Strategic Thinking & Market Opportunity",
        "budgetAvailable": 100000,
        "context": "You have ₹1,00,000 in seed capital from an angel grant. Your first strategic move is selecting the business model and initial product to launch.",
        "options": [
            {
                "id": "opt_saas_app",
                "label": "AI Exam Prep & Study Copilot (SaaS App) — Setup Cost: ₹25,000. Low variable unit cost (₹50/user server load), 85% gross margin potential, fast viral potential among 12th students.",
                "setupCost": 25000,
                "monthlyRevenueImpact": 18000,
                "npsImpact": 20,
                "riskLevel": "Low",
                "isOptimal": True,
                "score": 20.0,
                "consequence": "Smart, capital-efficient choice! You preserved ₹75,000 in cash runway while securing high gross margins and immediate addressable customer density.",
                "reasoning": "SaaS business models provide capital efficiency, rapid iterative loops, and superior gross margins for early-stage ventures."
            },
            {
                "id": "opt_d2c_bottle",
                "label": "Eco-Friendly Bamboo Insulated Bottles (D2C Hardware) — Setup Cost: ₹55,000 for minimum factory order quantity, packaging, and freight. High inventory holding cost, 35% margin.",
                "setupCost": 55000,
                "monthlyRevenueImpact": 12000,
                "npsImpact": 12,
                "riskLevel": "High",
                "isOptimal": False,
                "score": 10.0,
                "consequence": "Over half your seed capital is immediately locked into physical inventory boxes in a garage. Cash flow is dangerously restricted.",
                "reasoning": "Physical hardware with large minimum order quantities presents high inventory holding risk for low-capital startups."
            },
            {
                "id": "opt_tutor_marketplace",
                "label": "On-Demand Peer Tutoring Marketplace — Setup Cost: ₹35,000 for platform portal. Requires simultaneous acquisition of both student tutors and learners (Chicken-and-egg problem).",
                "setupCost": 35000,
                "monthlyRevenueImpact": 10000,
                "npsImpact": 14,
                "riskLevel": "Medium",
                "isOptimal": False,
                "score": 14.0,
                "consequence": "Platform launched, but two-sided marketplace friction slows early adoption as tutors await students and students find few tutors.",
                "reasoning": "Two-sided network effects require substantial marketing spend to overcome liquidity constraints."
            }
        ],
        "optimalOptionId": "opt_saas_app",
        "maxScore": 20.0
    },
    {
        "roundId": "bba_rnd_2",
        "roundNumber": 2,
        "title": "Round 2: Pricing Strategy & Unit Economics",
        "skillTested": "Financial Acumen & Pricing Elasticity",
        "context": "Your product has 500 beta signups. It is time to implement a pricing model. Your customer research shows students have pocket money budgets, but parents are willing to invest in academic performance.",
        "options": [
            {
                "id": "opt_value_pricing",
                "label": "Freemium with ₹299/month Pro Tier (Unlimited Mock Exams & AI Explanations) — Free tier drives virality, while 12% convert to paid Pro. Balanced margin & predictable recurring revenue.",
                "setupCost": 5000,
                "monthlyRevenueImpact": 32000,
                "npsImpact": 18,
                "isOptimal": True,
                "score": 20.0,
                "consequence": "Outstanding unit economics! 350 students convert within 3 weeks, generating ₹1,04,650 in monthly recurring revenue (MRR) with minimal churn.",
                "reasoning": "Freemium combined with value-aligned subscription tiers lowers customer acquisition friction while securing steady recurring cash flow."
            },
            {
                "id": "opt_penetration_cheap",
                "label": "Ultra-Low Penetration Pricing: ₹29/month — Maximizes raw user volume, but revenue barely covers server hosting and payment gateway transaction fees.",
                "setupCost": 2000,
                "monthlyRevenueImpact": 8000,
                "npsImpact": 10,
                "isOptimal": False,
                "score": 10.0,
                "consequence": "You acquire 2,000 signups, but earn only ₹58,000 total. Heavy server hosting bills consume the small revenue, leaving no budget for marketing.",
                "reasoning": "Fails the fundamental unit economics test: high customer volume without margin creates negative cash operating cycles."
            },
            {
                "id": "opt_premium_skimming",
                "label": "Luxury Premium Pricing: ₹1,499/month — Targets only affluent students with personal coaching.",
                "setupCost": 8000,
                "monthlyRevenueImpact": 15000,
                "npsImpact": -5,
                "isOptimal": False,
                "score": 8.0,
                "consequence": "Only 10 students buy. Conversion drops to 0.4%, and students complain in school group chats that the price is predatory.",
                "reasoning": "Price skimming fails in youth markets where peer network effects and word-of-mouth are the primary growth drivers."
            }
        ],
        "optimalOptionId": "opt_value_pricing",
        "maxScore": 20.0
    },
    {
        "roundId": "bba_rnd_3",
        "roundNumber": 3,
        "title": "Round 3: Marketing Channel & Customer Acquisition",
        "skillTested": "Resource Management & Growth Marketing",
        "context": "Competitors are starting to notice your momentum. You need to allocate marketing capital to scale your customer base. You have ₹45,000 discretionary marketing budget.",
        "options": [
            {
                "id": "opt_campus_ambassador",
                "label": "Campus Student Ambassador Program & Micro-Creator Study Reels — Cost: ₹18,000. Recruit top school toppers to showcase authentic study workflows with referral discounts.",
                "setupCost": 18000,
                "monthlyRevenueImpact": 40000,
                "npsImpact": 22,
                "isOptimal": True,
                "score": 20.0,
                "consequence": "Viral organic growth! Referral loops multiply paid users by 3.2x. Customer Acquisition Cost (CAC) drops to an industry-leading ₹65 per user.",
                "reasoning": "Peer advocacy and relatable content-led marketing yield high trust, low CAC, and high customer lifetime value (LTV)."
            },
            {
                "id": "opt_expensive_adwords",
                "label": "Generic Google Search Ads bidding on high-competition keywords like 'Study App' and 'Exam Prep' — Cost: ₹42,000 in two weeks.",
                "setupCost": 42000,
                "monthlyRevenueImpact": 22000,
                "npsImpact": 5,
                "isOptimal": False,
                "score": 9.0,
                "consequence": "Large legacy education corporations bid against you, inflating click costs to ₹120 per click. Your budget evaporates with sub-par conversion.",
                "reasoning": "Startups should avoid capital-depleting head-to-head ad auctions against heavily funded incumbents."
            },
            {
                "id": "opt_print_flyers",
                "label": "Print 20,000 physical flyers and distribute them outside school gates — Cost: ₹15,000.",
                "setupCost": 15000,
                "monthlyRevenueImpact": 5000,
                "npsImpact": -2,
                "isOptimal": False,
                "score": 6.0,
                "consequence": "Most flyers are immediately discarded on the sidewalk. Only 18 students scan the QR code.",
                "reasoning": "Offline mass flyer distribution lacks audience targeting, analytics tracking, and digital conversion velocity."
            }
        ],
        "optimalOptionId": "opt_campus_ambassador",
        "maxScore": 20.0
    },
    {
        "roundId": "bba_rnd_4",
        "roundNumber": 4,
        "title": "Round 4: Team Hiring & Operational Scalability",
        "skillTested": "Organizational Leadership & Runway Preservation",
        "context": "Customer support tickets are accumulating (250 tickets/day), and an app bug caused 15 users to lose mock exam drafts. You need to hire talent while watching your remaining cash runway.",
        "options": [
            {
                "id": "opt_hire_eng_support",
                "label": "Hire an experienced Full-Stack Engineer + Part-time Student Support Rep — Cost: ₹24,000/month. Fixes app bugs permanently and resolves user tickets in under 15 minutes.",
                "setupCost": 24000,
                "monthlyRevenueImpact": 28000,
                "npsImpact": 25,
                "isOptimal": True,
                "score": 20.0,
                "consequence": "Product stability reaches 99.9%. Churn drops from 12% to 2.1%. Customer Satisfaction (NPS) jumps to a glowing +74!",
                "reasoning": "Investing in core product reliability and customer delight directly protects recurring revenue and prevents churn bleed."
            },
            {
                "id": "opt_hire_sales_bro",
                "label": "Hire a high-cost outbound tele-sales agent with high commission — Cost: ₹35,000/month. Makes cold calls to parents.",
                "setupCost": 35000,
                "monthlyRevenueImpact": 15000,
                "npsImpact": -8,
                "isOptimal": False,
                "score": 8.0,
                "consequence": "Parents complain about aggressive tele-calling. Meanwhile, software crashes continue unabated, driving existing users away.",
                "reasoning": "Pouring sales effort into a leaky product with unresolved bugs accelerates negative brand reputation."
            },
            {
                "id": "opt_solo_burnout",
                "label": "Hire nobody. Attempt to write code, answer 250 support emails, and run marketing alone 18 hours a day.",
                "setupCost": 0,
                "monthlyRevenueImpact": -10000,
                "npsImpact": -18,
                "isOptimal": False,
                "score": 7.0,
                "consequence": "Within 2 weeks you suffer extreme sleep deprivation and burnout. Unanswered support tickets pile up, and 40% of paying users cancel.",
                "reasoning": "False frugality: founder bottlenecking leads to operational paralysis and enterprise collapse."
            }
        ],
        "optimalOptionId": "opt_hire_eng_support",
        "maxScore": 20.0
    },
    {
        "roundId": "bba_rnd_5",
        "roundNumber": 5,
        "title": "Round 5: Competitor Shock & Strategic Moat",
        "skillTested": "Crisis Management & Strategic Moat Building",
        "context": "CRISIS EVENT: A venture-backed giant 'MegaEdu Inc.' copies your UI design, launches a lookalike feature, and advertises it for 100% free for 3 months to crush you. How do you respond?",
        "options": [
            {
                "id": "opt_differentiation_moat",
                "label": "Build a Community & Personalization Moat: Launch 1-on-1 peer study circles, personalized diagnostic feedback, and school leaderboard tournaments that corporate giants cannot replicate.",
                "setupCost": 15000,
                "monthlyRevenueImpact": 35000,
                "npsImpact": 28,
                "isOptimal": True,
                "score": 20.0,
                "consequence": "Masterful strategic triumph! Students love the close-knit community culture. 94% of your user base refuses to switch to the impersonal corporate clone.",
                "reasoning": "David beats Goliath through customer intimacy, community network moats, and tailored speed, rather than matching predatory subsidies."
            },
            {
                "id": "opt_price_war_suicide",
                "label": "Engage in an all-out Price War: Make your app 100% free as well and burn all remaining cash to survive.",
                "setupCost": 45000,
                "monthlyRevenueImpact": -40000,
                "npsImpact": 0,
                "isOptimal": False,
                "score": 5.0,
                "consequence": "You run out of cash in 22 days. You can no longer pay the cloud server bills or employee salaries, forcing bankruptcy.",
                "reasoning": "Never fight a war of financial attrition against a rival with 100x your capital balance."
            },
            {
                "id": "opt_panic_quit",
                "label": "Panic, give up, and announce on Twitter that you are closing down because big corporations always win.",
                "setupCost": 0,
                "monthlyRevenueImpact": -50000,
                "npsImpact": -30,
                "isOptimal": False,
                "score": 3.0,
                "consequence": "Your startup dissolves overnight, forfeiting all brand equity and customer goodwill built over previous months.",
                "reasoning": "Demonstrates zero resilience or strategic agility when facing inevitable market competition."
            }
        ],
        "optimalOptionId": "opt_differentiation_moat",
        "maxScore": 20.0
    }
]

def evaluate_bba_simulation(submissions: list) -> dict:
    """
    Evaluates student performance in the 5-round Startup Simulator.
    Calculates final treasury balance, revenue, NPS, business skill attribution, and compatibility.
    """
    round_dict = {rnd["roundId"]: rnd for rnd in BBA_SIMULATION_ROUNDS}
    
    starting_capital = 100000
    current_cash = starting_capital
    cumulative_mrr = 0
    cumulative_nps = 50  # Baseline neutral NPS
    total_score = 0.0
    optimal_count = 0
    round_summaries = []

    skill_totals = {
        "businessReasoning": 0.0,
        "resourceManagement": 0.0,
        "strategicThinking": 0.0,
        "decisionMakingUnderRisk": 0.0,
        "financialAcumen": 0.0
    }

    for sub in submissions:
        rnd = round_dict.get(sub.roundId)
        if not rnd:
            continue

        chosen_id = sub.selectedOptionId or ""
        chosen_opt = next((opt for opt in rnd["options"] if opt["id"] == chosen_id), None)
        
        is_optimal = (chosen_id == rnd["optimalOptionId"])
        earned = chosen_opt["score"] if chosen_opt else 0.0
        total_score += earned
        if is_optimal:
            optimal_count += 1

        cost = chosen_opt.get("setupCost", 0) if chosen_opt else 0
        rev_impact = chosen_opt.get("monthlyRevenueImpact", 0) if chosen_opt else 0
        nps_delta = chosen_opt.get("npsImpact", 0) if chosen_opt else 0

        current_cash = max(0, current_cash - cost + rev_impact)
        cumulative_mrr = max(0, cumulative_mrr + rev_impact)
        cumulative_nps = max(0, min(100, cumulative_nps + nps_delta))

        # Skill Attribution
        if rnd["roundId"] == "bba_rnd_1":
            skill_totals["strategicThinking"] += (earned / rnd["maxScore"]) * 100
            skill_totals["businessReasoning"] += (earned / rnd["maxScore"]) * 80
        elif rnd["roundId"] == "bba_rnd_2":
            skill_totals["financialAcumen"] += (earned / rnd["maxScore"]) * 100
            skill_totals["resourceManagement"] += (earned / rnd["maxScore"]) * 80
        elif rnd["roundId"] == "bba_rnd_3":
            skill_totals["resourceManagement"] += (earned / rnd["maxScore"]) * 100
            skill_totals["strategicThinking"] += (earned / rnd["maxScore"]) * 80
        elif rnd["roundId"] == "bba_rnd_4":
            skill_totals["businessReasoning"] += (earned / rnd["maxScore"]) * 100
            skill_totals["decisionMakingUnderRisk"] += (earned / rnd["maxScore"]) * 80
        elif rnd["roundId"] == "bba_rnd_5":
            skill_totals["decisionMakingUnderRisk"] += (earned / rnd["maxScore"]) * 100
            skill_totals["strategicThinking"] += (earned / rnd["maxScore"]) * 100

        round_summaries.append({
            "roundId": rnd["roundId"],
            "roundNumber": rnd["roundNumber"],
            "title": rnd["title"],
            "skillTested": rnd["skillTested"],
            "chosenOptionLabel": chosen_opt["label"] if chosen_opt else "No decision",
            "isOptimal": is_optimal,
            "costIncurred": cost,
            "cashRemaining": current_cash,
            "consequence": chosen_opt["consequence"] if chosen_opt else "Incomplete",
            "scoreEarned": earned
        })

    accuracy = round((optimal_count / len(BBA_SIMULATION_ROUNDS)) * 100.0, 1)

    final_skills = {
        "businessReasoning": round(min(100.0, skill_totals["businessReasoning"] / 1.8), 1),
        "resourceManagement": round(min(100.0, skill_totals["resourceManagement"] / 1.8), 1),
        "strategicThinking": round(min(100.0, skill_totals["strategicThinking"] / 2.6), 1),
        "decisionMakingUnderRisk": round(min(100.0, skill_totals["decisionMakingUnderRisk"] / 1.8), 1),
        "financialAcumen": round(min(100.0, skill_totals["financialAcumen"]), 1)
    }

    # Normalize skills
    for k in final_skills:
        final_skills[k] = round(min(100.0, max(20.0, final_skills[k])), 1)

    # Valuation & Compatibility Band
    if total_score >= 85.0:
        band = "Visionary Entrepreneurial Leadership"
        note = "You demonstrated brilliant capital allocation, pricing acumen, and defensible moat-building under competitive threat. Exceptional natural match for BBA and venture management."
    elif total_score >= 65.0:
        band = "Strong Commercial & Strategic Aptitude"
        note = "You managed your runway and customer growth with sound business judgment, showing high promise for enterprise leadership and management."
    elif total_score >= 45.0:
        band = "Moderate Business Acumen"
        note = "You have solid foundational instincts. Deepening your understanding of unit economics and cash flow preservation will empower stronger commercial decisions."
    else:
        band = "Emerging Business Sense"
        note = "An exploratory beginning in entrepreneurship. Learning to balance aggressive customer acquisition with sustainable runway management will be valuable."

    return {
        "gameScore": round(total_score, 1),
        "accuracy": accuracy,
        "finalCash": current_cash,
        "finalMRR": cumulative_mrr,
        "finalNPS": cumulative_nps,
        "skillScores": final_skills,
        "roundSummaries": round_summaries,
        "compatibilityBand": band,
        "recommendationNote": note,
        "strengths": [k for k, v in final_skills.items() if v >= 75.0] or ["Commercial Curiosity"],
        "growthAreas": [k for k, v in final_skills.items() if v < 70.0] or ["Unit Economics Modeling"],
        "recommendedRoles": ["Venture Founder / Entrepreneur", "Product Manager", "Operations Strategy Specialist", "Growth Marketing Lead", "Management Consultant"],
        "disclaimer": "This virtual business simulation tests exploratory decision-making and strategic resource allocation. It is not an accredited financial appraisal or guaranteed indicator of entrepreneurial success."
    }
