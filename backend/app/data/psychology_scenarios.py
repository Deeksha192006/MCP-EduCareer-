PSYCHOLOGY_SCENARIOS = [
    {
        "scenarioId": "psych_sc_1",
        "title": "Scenario 1: The Overwhelmed Project Partner",
        "skillTested": "Empathy-Oriented Reasoning & De-escalation",
        "difficulty": "medium",
        "context": "You and your classmate Priya are collaborating on a pivotal class presentation. Priya is normally dependable and attentive, but today she missed the shared slides deadline, arrived 20 minutes late with dark circles under her eyes, and abruptly snapped when a teammate asked where her section was.",
        "dilemma": "How do you respond to Priya's abrupt reaction and uncharacteristic delay?",
        "options": [
            {
                "id": "opt_empathy_private",
                "label": "Wait until after class, speak with her privately in a quiet setting, and ask an open-ended, non-judgmental question: 'I noticed things seemed stressful today, Priya. Are you doing alright?'",
                "isOptimal": True,
                "score": 20.0,
                "consequence": "Priya feels psychologically safe. She breaks down and confides that her grandmother was hospitalized overnight. Because you validated her humanity before the task, you work together to redistribute the slides and deliver on time.",
                "reasoning": "Demonstrates high empathy-oriented reasoning and emotional de-escalation by avoiding public shaming and addressing emotional distress prior to task logistics."
            },
            {
                "id": "opt_public_confront",
                "label": "Call out her behavior in the group chat immediately: 'We all have stress, Priya, but you can't just miss deadlines and yell at us.'",
                "isOptimal": False,
                "score": 5.0,
                "consequence": "Priya feels publicly humiliated, turns off her notifications, and withdraws completely from the project. Group tension escalates to maximum hostility.",
                "reasoning": "Ignores social context and underlying cues; triggers defense mechanisms and destroys interpersonal trust."
            },
            {
                "id": "opt_premature_advice",
                "label": "Send her a link to a time-management and Pomodoro productivity app, telling her that better planning prevents last-minute stress.",
                "isOptimal": False,
                "score": 8.0,
                "consequence": "Priya feels unheard and misunderstood. The advice feels dismissive of her actual emotional state.",
                "reasoning": "Offers generic cognitive solutions without first diagnosing the affective root cause or demonstrating active listening."
            },
            {
                "id": "opt_passive_punish",
                "label": "Quietly finish her slides without telling her, and inform the teacher privately to deduct marks from Priya's grade.",
                "isOptimal": False,
                "score": 5.0,
                "consequence": "Priya is blindsided by the teacher's disciplinary warning, feeling betrayed by her peers while already enduring an acute personal crisis.",
                "reasoning": "Lacks constructive communication and basic observational curiosity into why an established high-performer suddenly faltered."
            }
        ],
        "optimalOptionId": "opt_empathy_private",
        "maxScore": 20.0
    },
    {
        "scenarioId": "psych_sc_2",
        "title": "Scenario 2: Conformity Pressure & Groupthink",
        "skillTested": "Social Perception & Ethical Critical Thinking",
        "difficulty": "medium",
        "context": "During lunch break, a popular student in your friend circle shares an unverified, embarrassing screenshot concerning a new classmate's family difficulties. Everyone at the table laughs and starts forwarding the image across WhatsApp groups. Your closest friend nudges you to share it with your club members.",
        "dilemma": "How do you navigate intense peer conformity pressure when ethical boundaries are breached?",
        "options": [
            {
                "id": "opt_courage_challenge",
                "label": "Politely decline to forward it and speak up with calibrated assertiveness: 'Hold on guys, this is someone's private personal life, and we have no idea if it's even authentic. Spreading it could cause serious harm.'",
                "isOptimal": True,
                "score": 20.0,
                "consequence": "By breaking the spiral of silence, two other classmates who were privately uncomfortable also voice agreement. The viral sharing stops in your group.",
                "reasoning": "Demonstrates high social independence, moral courage, and an understanding of how pluralistic ignorance and groupthink perpetuate harm."
            },
            {
                "id": "opt_peer_forward",
                "label": "Forward the screenshot as requested so nobody thinks you are socially awkward or a party pooper.",
                "isOptimal": False,
                "score": 4.0,
                "consequence": "You conform to the social group, but the victimized student experiences acute panic and depressive distress upon seeing the screenshot forwarded widely.",
                "reasoning": "Surrenders individual ethical judgment to normative social influence."
            },
            {
                "id": "opt_silent_bystander",
                "label": "Don't forward the image, but smile along awkwardly and say nothing to avoid drawing any attention to yourself.",
                "isOptimal": False,
                "score": 10.0,
                "consequence": "You preserve your own safety, but your silence signals passive approval to the group, allowing the rumor to proliferate unchecked.",
                "reasoning": "Classic bystander effect; lacks active ethical agency despite having personal moral awareness."
            },
            {
                "id": "opt_explosive_lecture",
                "label": "Yell at everyone at the table, accuse them of being terrible human beings, and storm off dramatically.",
                "isOptimal": False,
                "score": 8.0,
                "consequence": "The group dismisses your outrage as performative drama, mocks you after you leave, and continues circulating the screenshot out of spite.",
                "reasoning": "High emotional reactivity without strategic communication diminishes the likelihood of behavioral change."
            }
        ],
        "optimalOptionId": "opt_courage_challenge",
        "maxScore": 20.0
    },
    {
        "scenarioId": "psych_sc_3",
        "title": "Scenario 3: The Pre-Exam Anxiety Spiral",
        "skillTested": "Observation & Cognitive Reframing",
        "difficulty": "hard",
        "context": "Ten minutes before a high-stakes board examination, your friend Rohan is hyperventilating in the hallway, pacing rapidly, and repeating in a tremor: 'I forgot all the formulas... If I score below 90%, my life is over. My parents will never forgive me.'",
        "dilemma": "How do you assist Rohan in breaking through an acute panic catastrophizing loop?",
        "options": [
            {
                "id": "opt_grounding_reframe",
                "label": "Guide him through physiological regulation first (slow 4-second box breathing), acknowledge his genuine fear, and gently reframe the catastrophe: 'Rohan, feel your feet on the ground. Your nervous system is flooded right now, but your preparation hasn't disappeared. One test does not determine your worth or life.'",
                "isOptimal": True,
                "score": 20.0,
                "consequence": "His physiological parasympathetic nervous system engages, heart rate decelerates, and working memory restores access to the studied material before entering the hall.",
                "reasoning": "Demonstrates clinical and psychological intuition: somatic stabilization must precede cognitive reframing; validates fear without feeding catastrophic distortions."
            },
            {
                "id": "opt_toxic_positivity",
                "label": "Slap him playfully on the back and say: 'Cheer up buddy! Just smile! Everything happens for the best, no need to worry at all!'",
                "isOptimal": False,
                "score": 6.0,
                "consequence": "Rohan feels completely alienated and misunderstood. The superficial cheerfulness intensifies his internal shame and panic.",
                "reasoning": "Employs toxic positivity, which invalidates authentic neurobiological distress."
            },
            {
                "id": "opt_rational_debate",
                "label": "Argue logically with him: 'That is statistically false. Your average this term is 88%, so claiming your life is over is mathematically irrational.'",
                "isOptimal": False,
                "score": 9.0,
                "consequence": "In the middle of acute amygdala activation, rational debate feels combative and increases his agitation.",
                "reasoning": "Cognitive logic cannot be processed by a brain currently in an acute fight-or-flight sympathetic surge."
            },
            {
                "id": "opt_catastrophe_feed",
                "label": "Say: 'Honestly you might be right, the test today is rumored to be brutal. Quick, let's cram these 4 pages!'",
                "isOptimal": False,
                "score": 4.0,
                "consequence": "His panic surges into full disassociation and dizziness, severely incapacitating his cognitive functioning.",
                "reasoning": "Directly feeds and reinforces catastrophic cognitive distortions during acute distress."
            }
        ],
        "optimalOptionId": "opt_grounding_reframe",
        "maxScore": 20.0
    },
    {
        "scenarioId": "psych_sc_4",
        "title": "Scenario 4: Non-Verbal Cues & Fundamental Attribution Bias",
        "skillTested": "Social Perception & Attribution Reasoning",
        "difficulty": "medium",
        "context": "A new transfer student, Samuel, is assigned to your science debate group. Throughout the brainstorming session, Samuel speaks in a quiet monotone, maintains minimal eye contact, and looks towards the floor when ideas are debated. A teammate remarks: 'Samuel clearly doesn't care about our team score and did zero homework.'",
        "dilemma": "How do you evaluate Samuel's behavior and the teammate's assertion?",
        "options": [
            {
                "id": "opt_attribution_correction",
                "label": "Recognize that downward gaze and soft tone may reflect cultural respect, unfamiliarity, or social anxiety rather than apathy. Create an inviting, low-pressure entry point: 'Samuel, we'd love to hear your perspective on the genetics section whenever you feel ready.'",
                "isOptimal": True,
                "score": 20.0,
                "consequence": "Samuel feels respected rather than judged. He opens his notebook, revealing meticulous handwritten research, and shares insightful arguments that elevate the entire group.",
                "reasoning": "Corrects for Fundamental Attribution Error (attributing situational behavior to internal character flaws); recognizes cultural and social nuances in non-verbal signals."
            },
            {
                "id": "opt_confirm_bias",
                "label": "Agree with your teammate: 'Yeah, body language never lies. If he can't look us in the eye, he's obviously lazy or hiding something.'",
                "isOptimal": False,
                "score": 5.0,
                "consequence": "Samuel experiences ostracization, confirms his fears of not belonging, and completely shuts down for the rest of the semester.",
                "reasoning": "Falls into pseudo-scientific over-interpretation of non-verbal signals without considering baseline, culture, or situational factors."
            },
            {
                "id": "opt_interrogate_direct",
                "label": "Confront him bluntly in front of everyone: 'Samuel, why are you staring at the floor? Speak louder so we know you are listening.'",
                "isOptimal": False,
                "score": 6.0,
                "consequence": "Samuel freezes in humiliation and leaves the room at the first opportunity.",
                "reasoning": "High aggressive demand increases social threat response in someone already experiencing inhibition."
            },
            {
                "id": "opt_exclude_silent",
                "label": "Ignore Samuel entirely and divide his portion among the remaining members without speaking to him.",
                "isOptimal": False,
                "score": 5.0,
                "consequence": "Samuel is rendered invisible and deprived of an opportunity to participate or contribute his skills.",
                "reasoning": "Passive exclusion based on premature behavioral bias."
            }
        ],
        "optimalOptionId": "opt_attribution_correction",
        "maxScore": 20.0
    },
    {
        "scenarioId": "psych_sc_5",
        "title": "Scenario 5: Conflict Mediation & Restorative Justice",
        "skillTested": "Conflict Resolution & Multi-Perspective Synthesis",
        "difficulty": "hard",
        "context": "As the student council lead, you are asked to mediate an escalating feud between Tanvi (3-year club veteran who feels seniority entitles her to lead the annual exhibition) and Kevin (a talented newcomer whose innovative digital prototype drew praise from teachers). Both are threatening to resign if the other leads.",
        "dilemma": "How do you mediate this conflict without leaving one party resentful or alienated?",
        "options": [
            {
                "id": "opt_restorative_synthesis",
                "label": "Facilitate a structured restorative meeting where each party first articulates the other's viewpoint and underlying needs (Tanvi's need for institutional recognition & Kevin's need for creative innovation), then structure a co-leadership model where Tanvi directs institutional curation and Kevin leads digital experience.",
                "isOptimal": True,
                "score": 20.0,
                "consequence": "Both students feel deeply heard. Instead of a zero-sum battle, their complementary skillsets produce the most celebrated exhibition in the school's history.",
                "reasoning": "Mastery of restorative conflict mediation, interest-based bargaining, and perspective-taking synthesis."
            },
            {
                "id": "opt_strict_seniority",
                "label": "Award leadership entirely to Tanvi because seniority must always take precedence to maintain institutional hierarchy.",
                "isOptimal": False,
                "score": 7.0,
                "consequence": "Kevin resigns in disillusionment, taking his technical skills elsewhere, while the club stagnates with repetitive traditional formats.",
                "reasoning": "Rigid authoritarian adjudication suppresses innovation and creates long-term institutional resentment."
            },
            {
                "id": "opt_strict_merit",
                "label": "Award leadership entirely to Kevin because modern organizations must only value recent output and dismiss past loyalty.",
                "isOptimal": False,
                "score": 7.0,
                "consequence": "Tanvi feels discarded after years of dedication, spreading bitter gossip and creating a toxic faction in the club.",
                "reasoning": "Fails to appreciate the social psychological importance of organizational justice, loyalty, and emotional belonging."
            },
            {
                "id": "opt_arbitrary_chance",
                "label": "Flip a coin to decide who leads, telling them that fate decided so neither can be angry at you.",
                "isOptimal": False,
                "score": 4.0,
                "consequence": "Both feel insulted that their years of passion and skill were reduced to an arbitrary coin toss. Both lose respect for leadership.",
                "reasoning": "Abdicates leadership and conflict resolution responsibility; ignores underlying psychological needs."
            }
        ],
        "optimalOptionId": "opt_restorative_synthesis",
        "maxScore": 20.0
    }
]

def evaluate_psychology_submission(submissions: list) -> dict:
    """
    Server-side evaluation of Mind Explorer decisions.
    Evaluates empathy, social perception, critical thinking, observation, and conflict resolution.
    Strictly educational: does NOT diagnose personality or mental health.
    """
    scenario_dict = {sc["scenarioId"]: sc for sc in PSYCHOLOGY_SCENARIOS}
    total_score = 0.0
    optimal_count = 0
    scenario_results = []

    skill_totals = {
        "empathyOrientedReasoning": 0.0,
        "socialPerception": 0.0,
        "criticalThinking": 0.0,
        "observationSkills": 0.0,
        "conflictResolution": 0.0
    }

    for sub in submissions:
        sc = scenario_dict.get(sub.scenarioId)
        if not sc:
            continue

        selected_id = sub.selectedOptionId or ""
        chosen_opt = next((opt for opt in sc["options"] if opt["id"] == selected_id), None)
        
        is_optimal = (selected_id == sc["optimalOptionId"])
        earned = chosen_opt["score"] if chosen_opt else 0.0
        
        total_score += earned
        if is_optimal:
            optimal_count += 1

        # Skill distribution based on scenario
        if sc["scenarioId"] == "psych_sc_1":
            skill_totals["empathyOrientedReasoning"] += (earned / sc["maxScore"]) * 100
            skill_totals["observationSkills"] += (earned / sc["maxScore"]) * 80
        elif sc["scenarioId"] == "psych_sc_2":
            skill_totals["socialPerception"] += (earned / sc["maxScore"]) * 100
            skill_totals["criticalThinking"] += (earned / sc["maxScore"]) * 80
        elif sc["scenarioId"] == "psych_sc_3":
            skill_totals["observationSkills"] += (earned / sc["maxScore"]) * 100
            skill_totals["empathyOrientedReasoning"] += (earned / sc["maxScore"]) * 80
        elif sc["scenarioId"] == "psych_sc_4":
            skill_totals["socialPerception"] += (earned / sc["maxScore"]) * 100
            skill_totals["criticalThinking"] += (earned / sc["maxScore"]) * 80
        elif sc["scenarioId"] == "psych_sc_5":
            skill_totals["conflictResolution"] += (earned / sc["maxScore"]) * 100
            skill_totals["empathyOrientedReasoning"] += (earned / sc["maxScore"]) * 80

        scenario_results.append({
            "scenarioId": sc["scenarioId"],
            "title": sc["title"],
            "skillTested": sc["skillTested"],
            "isOptimal": is_optimal,
            "scoreEarned": round(earned, 1),
            "maxScore": sc["maxScore"],
            "timeTaken": sub.timeTaken,
            "chosenOptionLabel": chosen_opt["label"] if chosen_opt else "No choice",
            "consequence": chosen_opt["consequence"] if chosen_opt else "No action taken.",
            "reasoning": chosen_opt["reasoning"] if chosen_opt else "Incomplete"
        })

    accuracy = round((optimal_count / len(PSYCHOLOGY_SCENARIOS)) * 100.0, 1)

    final_skills = {
        "empathyOrientedReasoning": round(min(100.0, skill_totals["empathyOrientedReasoning"] / 2.6 * 100 / 100), 1),
        "socialPerception": round(min(100.0, skill_totals["socialPerception"] / 2.0), 1),
        "criticalThinking": round(min(100.0, skill_totals["criticalThinking"] / 1.6), 1),
        "observationSkills": round(min(100.0, skill_totals["observationSkills"] / 1.8), 1),
        "conflictResolution": round(min(100.0, skill_totals["conflictResolution"]), 1)
    }

    # Normalize skill scores properly
    for k in final_skills:
        final_skills[k] = round(min(100.0, max(15.0, final_skills[k])), 1)

    if total_score >= 85.0:
        band = "Exceptional Interpersonal & Empathic Acumen"
        note = "Your decisions demonstrated advanced perspective-taking, ethical assertiveness under peer pressure, and sophisticated restorative conflict mediation. You show strong alignment with B.Sc. Psychology and behavioral sciences."
    elif total_score >= 65.0:
        band = "Strong Social & Emotional Reasoning"
        note = "You demonstrated keen empathy and constructive problem-solving across social dilemmas, navigating complex human dynamics with thoughtfulness."
    elif total_score >= 45.0:
        band = "Developing Social Intuition"
        note = "You showed healthy instinct in several situations. Practicing non-violent communication and deeper active listening will further refine your interpersonal acumen."
    else:
        band = "Exploratory Social Perspective"
        note = "An exploratory starting point. Deepening your understanding of cognitive biases and perspective-taking will strengthen interpersonal effectiveness."

    return {
        "gameScore": round(total_score, 1),
        "accuracy": accuracy,
        "skillScores": final_skills,
        "scenarioResults": scenario_results,
        "compatibilityBand": band,
        "recommendationNote": note,
        "strengths": [k for k, v in final_skills.items() if v >= 75.0] or ["Active Curiosity in Human Dynamics"],
        "growthAreas": [k for k, v in final_skills.items() if v < 70.0] or ["Restorative Dispute Architecture"],
        "recommendedRoles": ["Organizational Counselor", "Behavioral Researcher", "Cognitive Specialist", "Human Resources Consultant", "Child Guidance Specialist"],
        "disclaimer": "This simulation evaluates exploratory social reasoning and situational perspective-taking. It does NOT diagnose psychological conditions, measure clinical traits, or substitute for professional counseling assessment."
    }
