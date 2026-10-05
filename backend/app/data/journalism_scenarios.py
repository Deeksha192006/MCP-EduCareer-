NEWSROOM_CHALLENGES = [
    {
        "challengeId": "jrnl_ch_1",
        "challengeNumber": 1,
        "title": "Challenge 1: Breaking Viral Claim vs. Corroborated Facts",
        "stageName": "The Breaking News Desk",
        "skillTested": "Critical Verification & Source Corroboration",
        "scenario": "A viral post with 450,000 views on social media claims that the city's drinking water treatment facility suffered an untreatable chemical spill 45 minutes ago and taps are toxic. Competing tabloids are re-tweeting it with sirens. The chief municipal water engineer has not yet answered their phone, but an anonymous message on Telegram sends an alarming video showing foaming brown water.",
        "taskDescription": "As the Senior Breaking News Editor, you have 10 minutes before the 12:00 PM news bulletin. How do you handle this breaking claim?",
        "options": [
            {
                "id": "opt_verify_multi_source",
                "label": "Dispatch a field reporter directly to the treatment plant with a mobile test kit, cross-reference municipal water pressure telemetry dashboards, contact the State Pollution Control Board, and publish a measured live-update: 'Officials probing water quality reports; awaiting verified test lab telemetry.'",
                "verificationScore": 25,
                "ethicsScore": 25,
                "interviewingScore": 15,
                "communicationScore": 20,
                "mediaLiteracyScore": 25,
                "isOptimal": True,
                "score": 20.0,
                "consequence": "Within 25 minutes, your field reporter and the State Lab confirm the foaming water video was 4-year-old footage from an industrial incident in another province. The municipal plant operates normally. Your newsroom prevented mass panic while scooping the factual debunk.",
                "editorialFeedback": "Exemplary verification! You refused to amplify unverified viral claims and deployed multi-source triangulation (field reporter, telemetry, regulatory body)."
            },
            {
                "id": "opt_publish_with_alleged",
                "label": "Immediately broadcast a breaking alert banner: 'BREAKING: Chemical Leak Allegedly Poisons City Water, Netizens Urged Not to Drink — Awaiting Official Confirmation.'",
                "verificationScore": 8,
                "ethicsScore": 5,
                "interviewingScore": 5,
                "communicationScore": 10,
                "mediaLiteracyScore": 6,
                "isOptimal": False,
                "score": 7.0,
                "consequence": "Supermarkets run out of bottled water in 15 minutes, traffic snarls the city as panic spreads, and 4 elderly citizens faint in stampedes. Later, the video is proven to be a hoax. The Press Council issues a formal reprimand to your channel.",
                "editorialFeedback": "Using words like 'allegedly' does not shield journalists from reckless panic propagation. Verification must precede dissemination, especially when public health and safety are concerned."
            },
            {
                "id": "opt_ignore_completely",
                "label": "Ignore the story entirely until the municipal PR spokesperson holds a scheduled press conference tomorrow morning at 10 AM.",
                "verificationScore": 12,
                "ethicsScore": 14,
                "interviewingScore": 0,
                "communicationScore": 5,
                "mediaLiteracyScore": 8,
                "isOptimal": False,
                "score": 8.0,
                "consequence": "While you didn't publish false news, the unchecked viral hoax filled the information vacuum, leaving 2 million citizens anxious and reliant on conspiratorial group chats throughout the night.",
                "editorialFeedback": "Journalism requires proactive vigilance. When harmful rumors spread, responsible newsrooms actively investigate and provide reassuring context rather than leaving citizens in the dark."
            }
        ],
        "optimalOptionId": "opt_verify_multi_source",
        "maxScore": 20.0
    },
    {
        "challengeId": "jrnl_ch_2",
        "challengeNumber": 2,
        "title": "Challenge 2: The High-Stakes Public Accountability Interview",
        "stageName": "Investigative & Field Inquiries",
        "skillTested": "Objective Questioning & Accountability",
        "scenario": "A newly inaugurated ₹200-crore flyover has developed major structural cracks after the first monsoon rains. The Minister of Public Works agrees to a 4-minute live interview. The Minister's press secretary demands that you stick to 'positive infrastructure milestones.' You have one opening question to set the tone.",
        "taskDescription": "Choose the most professional, incisive, and ethically balanced opening question.",
        "options": [
            {
                "id": "opt_evidence_based_inquiry",
                "label": "'Minister, independent structural engineers from IIT have documented 4-centimeter fissure lines on Pillar 7 of the 3-month-old flyover. What specific audit reports cleared this concrete batch, and what immediate timeline has been established for public safety inspections?'",
                "verificationScore": 22,
                "ethicsScore": 25,
                "interviewingScore": 25,
                "communicationScore": 24,
                "mediaLiteracyScore": 20,
                "isOptimal": True,
                "score": 20.0,
                "consequence": "The Minister cannot deflect because the question is anchored in concrete technical findings rather than hostility. On air, the Minister commits to an immediate independent audit and closes the lane for precautionary testing.",
                "editorialFeedback": "Masterful interviewing! Grounding questions in verified data and public safety prevents partisan deflection while upholding accountability."
            },
            {
                "id": "opt_sensational_accusation",
                "label": "'Minister, isn't it obvious that corrupt contractors in your department embezzled taxpayer funds and built a death-trap flyover destined to collapse?'",
                "verificationScore": 5,
                "ethicsScore": 6,
                "interviewingScore": 5,
                "communicationScore": 7,
                "mediaLiteracyScore": 5,
                "isOptimal": False,
                "score": 6.0,
                "consequence": "The Minister attacks your blatant bias, walks off the live set citing editorial unprofessionalism, and files a defamation notice. The critical safety questions remain unanswered.",
                "editorialFeedback": "Leading, accusatory questions give subjects an easy excuse to walk out. Good journalism lets evidence do the talking instead of adopting prosecutor bravado."
            },
            {
                "id": "opt_softball_question",
                "label": "'Minister, could you tell us about your vision for modern transit in the city, and are you satisfied with how the new flyover connects commuter hubs?'",
                "verificationScore": 8,
                "ethicsScore": 8,
                "interviewingScore": 6,
                "communicationScore": 12,
                "mediaLiteracyScore": 8,
                "isOptimal": False,
                "score": 7.0,
                "consequence": "The Minister spends the entire 4 minutes delivering PR talking points. The public is left unaware of dangerous cracks above commuter roadways.",
                "editorialFeedback": "Softball questions surrender the Fourth Estate's core duty: holding power to account on matters of public safety."
            }
        ],
        "optimalOptionId": "opt_evidence_based_inquiry",
        "maxScore": 20.0
    },
    {
        "challengeId": "jrnl_ch_3",
        "challengeNumber": 3,
        "title": "Challenge 3: Crafting the Ethical Headline",
        "stageName": "The Copy & Headline Desk",
        "skillTested": "Media Ethics & Anti-Sensationalism",
        "scenario": "A mild earthquake (magnitude 3.4 on the Richter scale) occurred 40 km offshore at 3:15 AM. Seismologists confirmed no damage, zero casualties, and zero tsunami risk. However, it was felt as a light vibration in high-rise buildings. Your digital portal's advertising manager urges: 'We need clicks, everyone is searching!'",
        "taskDescription": "Select the headline that best balances newsworthiness, precision, and public responsibility.",
        "options": [
            {
                "id": "opt_accurate_ethical_headline",
                "label": "'Mild 3.4 Magnitude Offshore Tremor Felt in Coastal High-Rises; Seismologists Report No Damage or Tsunami Threat'",
                "verificationScore": 25,
                "ethicsScore": 25,
                "interviewingScore": 15,
                "communicationScore": 25,
                "mediaLiteracyScore": 22,
                "isOptimal": True,
                "score": 20.0,
                "consequence": "The story achieves high organic engagement as concerned residents seek verified information. Readers praise your publication for calmness and trust ratings increase.",
                "editorialFeedback": "Flawless headline! It answers the reader's immediate questions (magnitude, location, safety status) without inciting alarm or misrepresenting severity."
            },
            {
                "id": "opt_clickbait_alarmist",
                "label": "'NIGHTMARE IN THE DEEP: Massive Tremors Shake Sleeping City — Is The Big One Coming?'",
                "verificationScore": 4,
                "ethicsScore": 4,
                "interviewingScore": 0,
                "communicationScore": 6,
                "mediaLiteracyScore": 4,
                "isOptimal": False,
                "score": 5.0,
                "consequence": "You gain 30,000 quick clicks in the first hour, but readers are furious when they open the article. The news outlet is heavily mocked on social media for fearmongering and loses 1,500 newsletter subscribers.",
                "editorialFeedback": "Clickbait headline that exaggerates magnitude 3.4 as 'Massive' and speculates on catastrophic doom. This destroys editorial credibility for fleeting pageviews."
            },
            {
                "id": "opt_cryptic_curiosity_gap",
                "label": "'You Won't Believe What Woke Up Coastal Residents at 3 AM Today!'",
                "verificationScore": 10,
                "ethicsScore": 10,
                "interviewingScore": 0,
                "communicationScore": 8,
                "mediaLiteracyScore": 10,
                "isOptimal": False,
                "score": 8.0,
                "consequence": "Readers find the tabloid curiosity gap style inappropriate for geological and emergency information. Engagement drops rapidly.",
                "editorialFeedback": "Curiosity gap tactics trivialize important civic and natural events. News headlines must convey primary informative substance."
            }
        ],
        "optimalOptionId": "opt_accurate_ethical_headline",
        "maxScore": 20.0
    },
    {
        "challengeId": "jrnl_ch_4",
        "challengeNumber": 4,
        "title": "Challenge 4: Spotting AI Deepfakes & Manipulated Context",
        "stageName": "Digital Forensics & Verification Desk",
        "skillTested": "Digital Forensics & Media Literacy",
        "scenario": "During an intense local municipal election, an audio-visual clip surfaces on encrypted messaging apps showing an opposition candidate apparently accepting a suitcase of cash in a dimly lit hotel room. The audio sounds authentic, but you notice inconsistent ear-shadowing, blurring around the collar lines, and unnatural pupil reflections in the candidate's eyes.",
        "taskDescription": "What forensic verification workflow do you execute prior to any publishing decision?",
        "options": [
            {
                "id": "opt_forensic_pipeline",
                "label": "Run frame-by-frame EXIF/metadata analysis, pass audio through frequency spectrogram tools to detect synthetic acoustic artifacts, perform reverse-image search on the background furniture, and contact the candidate's campaign for on-record timestamped alibis.",
                "verificationScore": 25,
                "ethicsScore": 25,
                "interviewingScore": 20,
                "communicationScore": 20,
                "mediaLiteracyScore": 25,
                "isOptimal": True,
                "score": 20.0,
                "consequence": "Forensic spectrograms reveal tell-tale voice-cloning phase anomalies and the background matches a stock video from a 2018 spy film! You publish an exclusive investigative exposé revealing a coordinated deepfake smear campaign.",
                "editorialFeedback": "Outstanding media forensics! Modern journalists must master digital forensics, synthetic media detection, and right-of-reply before broadcasting explosive political claims."
            },
            {
                "id": "opt_publish_with_disclaimer",
                "label": "Publish the video immediately with a caption: 'Unverified video circulating online claims to show candidate. Viewer discretion advised — we cannot independently confirm its authenticity.'",
                "verificationScore": 5,
                "ethicsScore": 5,
                "interviewingScore": 5,
                "communicationScore": 8,
                "mediaLiteracyScore": 5,
                "isOptimal": False,
                "score": 6.0,
                "consequence": "The video sways undecided voters before being proven fake days later. Your publication is sued for election interference and gross negligence.",
                "editorialFeedback": "Disclaimers do not excuse distributing manufactured disinformation. A journalist's primary mandate is filtering the signal from synthetic noise."
            },
            {
                "id": "opt_forward_to_rival",
                "label": "Send the video to the opposing party's spokesperson and ask them for a spicy reaction quote to publish alongside the clip.",
                "verificationScore": 6,
                "ethicsScore": 4,
                "interviewingScore": 10,
                "communicationScore": 6,
                "mediaLiteracyScore": 6,
                "isOptimal": False,
                "score": 6.0,
                "consequence": "The rival party weaponizes the leak on state television, citing your news organization as the source of the leak, embroiling your newsroom in an ethical scandal.",
                "editorialFeedback": "Using unverified material to bait political rivals violates neutrality and editorial independence."
            }
        ],
        "optimalOptionId": "opt_forensic_pipeline",
        "maxScore": 20.0
    },
    {
        "challengeId": "jrnl_ch_5",
        "challengeNumber": 5,
        "title": "Challenge 5: The Inverted Pyramid Lead Writer",
        "stageName": "The Front-Page Lead Writer",
        "skillTested": "Inverted Pyramid & Concise News Reporting",
        "scenario": "The State Education Board has just released an emergency circular at 4:30 PM: Due to an unseasonal severe cyclone alert along the eastern seaboard, all schools and colleges in 8 coastal districts will remain closed on Monday and Tuesday, while exams scheduled for those dates are postponed to the following week. You must compose the opening 3-sentence lead paragraph for the 5:00 PM edition.",
        "taskDescription": "Choose the lead paragraph that best exemplifies the classical Inverted Pyramid (Who, What, Where, When, Why in clear, accessible language).",
        "options": [
            {
                "id": "opt_perfect_inverted_pyramid",
                "label": "'All schools and colleges across eight coastal districts will remain closed on Monday and Tuesday due to an escalating severe cyclone alert, the State Education Department announced today. Scheduled board examinations have been deferred to next week, with revised timetables to be published on the official portal tomorrow morning. District disaster management authorities have urged students and parents to rely strictly on official bulletins.'",
                "verificationScore": 25,
                "ethicsScore": 24,
                "interviewingScore": 18,
                "communicationScore": 25,
                "mediaLiteracyScore": 22,
                "isOptimal": True,
                "score": 20.0,
                "consequence": "Over 800,000 anxious parents and students immediately get clear, calm, and actionable information in their first glance without confusion.",
                "editorialFeedback": "Exemplary Inverted Pyramid lead! It answers Who, What, Where, When, Why in the first two sentences, follows up with official instructions, and keeps the language crisp and accessible."
            },
            {
                "id": "opt_rambling_prose",
                "label": "'As dark thunderclouds ominous as midnight gathered over the tranquil shores of the eastern coastline, education authorities sat in tense emergency meetings contemplating the fate of young minds amidst nature's impending wrath. It was decided that perhaps books must be set aside as waves roar, closing schools in various coastal areas.'",
                "verificationScore": 10,
                "ethicsScore": 12,
                "interviewingScore": 5,
                "communicationScore": 7,
                "mediaLiteracyScore": 10,
                "isOptimal": False,
                "score": 8.0,
                "consequence": "Confused parents are forced to read poetic metaphors without discovering which districts are affected or what happens to Monday's exams.",
                "editorialFeedback": "Flowery creative prose obscures critical breaking news. News reporting demands immediate clarity, dates, locations, and actions."
            },
            {
                "id": "opt_incomplete_fragment",
                "label": "'School holidays have been declared! Students rejoice as cyclone brings two days off across the state, stay tuned for further updates!'",
                "verificationScore": 8,
                "ethicsScore": 8,
                "interviewingScore": 4,
                "communicationScore": 9,
                "mediaLiteracyScore": 8,
                "isOptimal": False,
                "score": 7.0,
                "consequence": "Students across non-coastal inland districts mistakenly stay home assuming schools statewide are shut. Examination centres face widespread student absenteeism.",
                "editorialFeedback": "Omission of crucial qualifiers ('eight coastal districts') spreads harmful misinformation during a civil emergency."
            }
        ],
        "optimalOptionId": "opt_perfect_inverted_pyramid",
        "maxScore": 20.0
    }
]

def evaluate_journalism_simulation(submissions: list) -> dict:
    submission_map = {s.get("challengeId"): s.get("selectedOptionId") for s in submissions}
    
    total_score = 0.0
    optimal_count = 0
    verification_accum = 0.0
    ethics_accum = 0.0
    interviewing_accum = 0.0
    communication_accum = 0.0
    media_literacy_accum = 0.0
    
    challenge_summaries = []

    for ch in NEWSROOM_CHALLENGES:
        ch_id = ch["challengeId"]
        selected_opt_id = submission_map.get(ch_id)
        chosen_opt = next((o for o in ch.get("options", []) if o["id"] == selected_opt_id), None)

        if chosen_opt:
            earned = float(chosen_opt.get("score", 0.0))
            is_optimal = bool(chosen_opt.get("isOptimal", False))
            v_score = float(chosen_opt.get("verificationScore", 10.0))
            e_score = float(chosen_opt.get("ethicsScore", 10.0))
            i_score = float(chosen_opt.get("interviewingScore", 10.0))
            c_score = float(chosen_opt.get("communicationScore", 10.0))
            m_score = float(chosen_opt.get("mediaLiteracyScore", 10.0))
        else:
            earned = 0.0
            is_optimal = False
            v_score, e_score, i_score, c_score, m_score = 5.0, 5.0, 5.0, 5.0, 5.0

        if is_optimal:
            optimal_count += 1

        total_score += earned
        verification_accum += v_score
        ethics_accum += e_score
        interviewing_accum += i_score
        communication_accum += c_score
        media_literacy_accum += m_score

        challenge_summaries.append({
            "challengeId": ch["challengeId"],
            "title": ch["title"],
            "stageName": ch.get("stageName", "Newsroom"),
            "skillTested": ch["skillTested"],
            "chosenOptionLabel": chosen_opt["label"] if chosen_opt else "No choice submitted",
            "isOptimal": is_optimal,
            "consequence": chosen_opt["consequence"] if chosen_opt else "Incomplete",
            "editorialFeedback": chosen_opt["editorialFeedback"] if chosen_opt else "No action taken",
            "scoreEarned": earned
        })

    num_ch = max(1, len(NEWSROOM_CHALLENGES))
    accuracy = round((optimal_count / num_ch) * 100.0, 1)

    # Normalize skill scores to 0-100 scale (each challenge has max ~25 per dimension)
    verification_score = round(min(100.0, max(20.0, (verification_accum / (num_ch * 25.0)) * 100.0)), 1)
    ethics_score = round(min(100.0, max(20.0, (ethics_accum / (num_ch * 25.0)) * 100.0)), 1)
    interviewing_score = round(min(100.0, max(20.0, (interviewing_accum / (num_ch * 22.0)) * 100.0)), 1)
    communication_score = round(min(100.0, max(20.0, (communication_accum / (num_ch * 24.0)) * 100.0)), 1)
    media_literacy_score = round(min(100.0, max(20.0, (media_literacy_accum / (num_ch * 24.0)) * 100.0)), 1)

    skill_scores = {
        "criticalVerification": verification_score,
        "mediaEthics": ethics_score,
        "investigativeInquiry": interviewing_score,
        "clearCommunication": communication_score,
        "digitalMediaLiteracy": media_literacy_score
    }

    if total_score >= 85.0:
        band = "Master Investigative Reporter & Editor"
        note = "You demonstrated impeccable journalistic integrity, rigorous forensic verification, and clear public interest communication under tight deadlines. Exceptional aptitude for BA Journalism & Mass Communication."
    elif total_score >= 65.0:
        band = "Diligent Newsroom Journalist"
        note = "You showed solid ethical awareness and careful source verification across challenging breaking scenarios. Strong potential in news reporting and media production."
    elif total_score >= 45.0:
        band = "Developing Media Communicator"
        note = "Good instinct for public communication. Focusing further on verifying viral digital claims and resisting sensational framing will elevate your editorial authority."
    else:
        band = "Exploratory Media Observer"
        note = "An encouraging introduction to the fast-paced world of newsrooms. Exploring digital forensics and the inverted pyramid will strengthen your journalistic foundations."

    strengths = [name for name, score in skill_scores.items() if score >= 75.0]
    if not strengths:
        strengths = ["Public Interest Curiosity"]

    growth_areas = [name for name, score in skill_scores.items() if score < 70.0]
    if not growth_areas:
        growth_areas = ["Real-time Pressure Management"]

    return {
        "gameScore": round(total_score, 1),
        "accuracy": accuracy,
        "verificationScore": verification_score,
        "ethicsScore": ethics_score,
        "interviewingScore": interviewing_score,
        "communicationScore": communication_score,
        "mediaLiteracyScore": media_literacy_score,
        "skillScores": skill_scores,
        "challengeSummaries": challenge_summaries,
        "compatibilityBand": band,
        "recommendationNote": note,
        "strengths": strengths,
        "growthAreas": growth_areas,
        "recommendedRoles": [
            "Investigative Journalist",
            "Fact-Checking Analyst & OSINT Researcher",
            "Broadcast News Anchor & Field Reporter",
            "Senior Copy & Headline Editor",
            "Public Relations & Crisis Communications Specialist",
            "Digital Media Producer & Podcaster"
        ],
        "disclaimer": "This newsroom challenge is an educational interactive simulation designed to cultivate critical thinking, media literacy, and communication ethics. It does not certify formal press accreditation or professional journalistic licensing."
    }

