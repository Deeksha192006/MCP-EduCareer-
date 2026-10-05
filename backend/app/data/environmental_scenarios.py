ENV_CHALLENGES = [
    {
        "challengeId": "env_ch_1",
        "challengeNumber": 1,
        "title": "Challenge 1: Clean Energy Transition & Smog Abatement",
        "skillTested": "Scientific Reasoning & Renewable Energy Systems",
        "context": "Verdant Valley relies on an aging sub-bituminous coal plant for 85% of its electricity. Winter temperature inversions trap toxic sulfur dioxide and PM2.5 particulates in the valley basin, causing emergency room visits for child asthma to double.",
        "options": [
            {
                "id": "opt_solar_microgrid",
                "label": "Decentralized Rooftop Solar Co-ops + Valley Wind Microgrid + Battery Storage — Cost: ₹40,000. Replaces 60% of coal generation, cuts valley AQI by 70 points, and avoids long-distance transmission losses.",
                "cost": 40000,
                "aqiDelta": -70,
                "cleanEnergyDelta": 55,
                "waterDelta": 5,
                "wasteDelta": 0,
                "isOptimal": True,
                "score": 20.0,
                "consequence": "Air Quality index improves dramatically from Hazardous (185) to Moderate (115)! Hospital respiratory visits plunge by 48% within 90 days.",
                "reasoning": "Decentralized renewable microgrids address root emissions at source without ongoing fossil fuel extraction externalities."
            },
            {
                "id": "opt_smoke_scrubbers",
                "label": "Install Flue-Gas Desulfurization Scrubbers on Old Coal Plant — Cost: ₹25,000. Marginal reduction in SO2, but zero reduction in CO2 greenhouse emissions and creates toxic coal ash sludge.",
                "cost": 25000,
                "aqiDelta": -15,
                "cleanEnergyDelta": 0,
                "waterDelta": -10,
                "wasteDelta": -15,
                "isOptimal": False,
                "score": 9.0,
                "consequence": "Air quality improves slightly, but coal ash ponds threaten to contaminate municipal groundwater. Coal dependence is locked in for another decade.",
                "reasoning": "End-of-pipe scrubbing treats symptoms while shifting pollutants from atmospheric to aquatic/soil phases."
            },
            {
                "id": "opt_diesel_generators",
                "label": "Deploy Mobile Diesel Generators during Peak Smog Days — Cost: ₹15,000. Cheap initial capital expenditure.",
                "cost": 15000,
                "aqiDelta": 30,
                "cleanEnergyDelta": -5,
                "waterDelta": 0,
                "wasteDelta": 0,
                "isOptimal": False,
                "score": 4.0,
                "consequence": "Diesel exhaust soot and black carbon spike valley air pollution into severe emergency levels (AQI 215). Citizens protest outside Town Hall.",
                "reasoning": "Diesel generators have high particulate emission factors and poor thermodynamic efficiency."
            }
        ],
        "optimalOptionId": "opt_solar_microgrid",
        "maxScore": 20.0
    },
    {
        "challengeId": "env_ch_2",
        "challengeNumber": 2,
        "title": "Challenge 2: Severe Groundwater Depletion & Sponge City Design",
        "skillTested": "Hydrological Systems & Watershed Management",
        "context": "Due to extensive asphalt roads and unregulated private borewells, rainwater drains rapidly into flood canals rather than percolating. The valley aquifer water table has plummeted 12 meters, leaving municipal reservoirs at a critical 35% capacity.",
        "options": [
            {
                "id": "opt_sponge_basin",
                "label": "Sponge City Overhaul: Mandatory Rainwater Percolation Pits, Permeable Pavements, and Restoring Natural Wetland Infiltration Basins — Cost: ₹35,000. Captures 80% of seasonal monsoon runoff.",
                "cost": 35000,
                "aqiDelta": -5,
                "cleanEnergyDelta": 0,
                "waterDelta": 45,
                "wasteDelta": 5,
                "isOptimal": True,
                "score": 20.0,
                "consequence": "Aquifer recharge rates quadruple! Valley water reserves surge to a resilient 80%, ending seasonal tap shortages naturally.",
                "reasoning": "Sponge city ecological engineering restores natural hydrological infiltration and bio-swale percolation."
            },
            {
                "id": "opt_deep_borewells",
                "label": "Drill Ultra-Deep 1,000-Foot Deep Borewells into Confined Fossil Aquifer — Cost: ₹30,000. Provides immediate water for 6 months.",
                "cost": 30000,
                "aqiDelta": 0,
                "cleanEnergyDelta": -5,
                "waterDelta": 10,
                "wasteDelta": 0,
                "isOptimal": False,
                "score": 8.0,
                "consequence": "Mines non-renewable fossil water that took 10,000 years to accumulate. By month 7, heavy fluoride and arsenic leach into the drinking supply.",
                "reasoning": "Extracting from non-recharging deep aquifers causes irreversible depletion and groundwater mineral contamination."
            },
            {
                "id": "opt_water_tankers",
                "label": "Contract Diesel Water Tanker Trucks from Adjacent River Basin — Cost: ₹45,000/quarter.",
                "cost": 45000,
                "aqiDelta": 15,
                "cleanEnergyDelta": 0,
                "waterDelta": 15,
                "wasteDelta": 0,
                "isOptimal": False,
                "score": 6.0,
                "consequence": "Drains the municipal treasury while neighboring farmers protest water-theft. Truck traffic increases diesel exhaust and road degradation.",
                "reasoning": "External resource extraction ignores local hydrological balance and triggers regional socio-ecological conflict."
            }
        ],
        "optimalOptionId": "opt_sponge_basin",
        "maxScore": 20.0
    },
    {
        "challengeId": "env_ch_3",
        "challengeNumber": 3,
        "title": "Challenge 3: Landfill Methane Fire & Circular Economy",
        "skillTested": "Circular Economy & Solid Waste Dynamics",
        "context": "Verdant Valley's open dumping ground has reached 40 meters in height. Spontaneous subsurface methane combustion has triggered continuous toxic smoke fires, while toxic leachate is detected 300 meters from agricultural soils.",
        "options": [
            {
                "id": "opt_zero_waste_circular",
                "label": "Source-Segregation Mandate, Decentralized Aerobic Composting Units, and Material Recovery Facility (MRF) for High-Grade Plastics — Cost: ₹30,000. Diverts 65% of organic and recyclable municipal waste.",
                "cost": 30000,
                "aqiDelta": -25,
                "cleanEnergyDelta": 10,
                "waterDelta": 10,
                "wasteDelta": 55,
                "isOptimal": True,
                "score": 20.0,
                "consequence": "Landfill input volume drops by 65%! Rich organic compost is distributed to local farms, eliminating chemical fertilizer dependency and stopping methane fires.",
                "reasoning": "Circular zero-waste systems separate biodegradable organics from recyclables, eliminating anaerobic methane generation."
            },
            {
                "id": "opt_giant_incinerator",
                "label": "Build a High-Temperature Mass-Burn Waste-to-Energy Incinerator — Cost: ₹55,000. Burns all unsorted trash.",
                "cost": 55000,
                "aqiDelta": 20,
                "cleanEnergyDelta": 5,
                "waterDelta": -5,
                "wasteDelta": 30,
                "isOptimal": False,
                "score": 8.0,
                "consequence": "Consumes more than a third of the town budget. Incomplete combustion of mixed chlorinated plastics releases carcinogenic dioxins and furans into downwind neighborhoods.",
                "reasoning": "Mass-burn incineration without rigorous source separation emits persistent organic pollutants (POPs) and produces toxic fly ash."
            },
            {
                "id": "opt_expand_dump",
                "label": "Acquire 40 Acres of Native Forest Land to Expand Open Dumping — Cost: ₹20,000.",
                "cost": 20000,
                "aqiDelta": 10,
                "cleanEnergyDelta": 0,
                "waterDelta": -20,
                "wasteDelta": -10,
                "isOptimal": False,
                "score": 4.0,
                "consequence": "Clear-cuts pristine biodiversity corridor, displacing wildlife and doubling the toxic leachate footprint into the valley water table.",
                "reasoning": "Linear 'throw-away' expansion compounds land degradation and destroys ecological carbon sinks."
            }
        ],
        "optimalOptionId": "opt_zero_waste_circular",
        "maxScore": 20.0
    },
    {
        "challengeId": "env_ch_4",
        "challengeNumber": 4,
        "title": "Challenge 4: Industrial Effluent & Aquatic Eutrophication",
        "skillTested": "Aquatic Ecology & Phytoremediation",
        "context": "An industrial cluster and upstream fertilizer runoff are dumping excess nitrates and phosphorus into River Serene. A massive thick green algal bloom has carpeted the river surface, suffocating fish via hypoxia (dissolved oxygen drop to 1.2 mg/L).",
        "options": [
            {
                "id": "opt_constructed_wetland",
                "label": "Constructed Phytoremediation Wetland Beds (Cattails, Reeds & Floating Macrophytes) + Zero Liquid Discharge (ZLD) Industrial Mandate — Cost: ₹30,000. Plants naturally absorb 85% of nitrates and phosphates.",
                "cost": 30000,
                "aqiDelta": 0,
                "cleanEnergyDelta": 0,
                "waterDelta": 25,
                "wasteDelta": 10,
                "isOptimal": True,
                "score": 20.0,
                "consequence": "Nature-based bio-filtration cleans the river! Dissolved oxygen recovers to a healthy 7.5 mg/L, native otters and fish return, and algal blooms dissolve.",
                "reasoning": "Phytoremediation harnesses natural microbial and wetland rhizospheres to biologically sequester excess nutrients without synthetic chemicals."
            },
            {
                "id": "opt_chemical_algaecide",
                "label": "Spray Copper Sulfate Chemical Algaecide Across River Surface — Cost: ₹18,000.",
                "cost": 18000,
                "aqiDelta": 0,
                "cleanEnergyDelta": 0,
                "waterDelta": -15,
                "wasteDelta": 0,
                "isOptimal": False,
                "score": 7.0,
                "consequence": "Kills algae temporarily, but dying algae rot at the river bottom, consuming all remaining oxygen and triggering massive fish die-offs. Toxic copper accumulates in riverbed sediment.",
                "reasoning": "Chemical algaecides cause secondary decomposition spikes and heavy metal ecotoxicity throughout aquatic trophic levels."
            },
            {
                "id": "opt_concrete_culvert",
                "label": "Encase the River in High Concrete Walls and Divert Out of Sight — Cost: ₹28,000.",
                "cost": 28000,
                "aqiDelta": 0,
                "cleanEnergyDelta": 0,
                "waterDelta": -20,
                "wasteDelta": 0,
                "isOptimal": False,
                "score": 5.0,
                "consequence": "Destroys the riparian buffer zone, eliminates river self-cleansing capacity, and accelerates downstream flash flooding.",
                "reasoning": "Hard engineering culverts destroy riparian riverbanks, stripping waterways of ecological self-purification mechanisms."
            }
        ],
        "optimalOptionId": "opt_constructed_wetland",
        "maxScore": 20.0
    },
    {
        "challengeId": "env_ch_5",
        "challengeNumber": 5,
        "title": "Challenge 5: Urban Heat Island & Biodiversity Corridors",
        "skillTested": "Urban Microclimate & Ecological Resilience",
        "context": "Dense concrete structures and lack of canopy shade have elevated downtown surface temperatures to 43°C (6.8°C above surrounding rural woods). Vulnerable elderly residents face heat exhaustion, while air conditioning power draws threaten grid blackouts.",
        "options": [
            {
                "id": "opt_urban_forest_canopy",
                "label": "Dense Native Miyawaki Micro-Forests, Green Vegetated Roofs, and Shaded Bio-Corridors along Major Avenues — Cost: ₹25,000. Rapid 10x growth rate, absorbs stormwater, and creates continuous wildlife corridors.",
                "cost": 25000,
                "aqiDelta": -20,
                "cleanEnergyDelta": 5,
                "waterDelta": 10,
                "wasteDelta": 0,
                "isOptimal": True,
                "score": 20.0,
                "consequence": "Downtown ambient temperature drops by 4.2°C through natural evapotranspiration! Building cooling energy bills drop 22%, and native bird species return.",
                "reasoning": "Biophilic urban design mitigates urban heat islands through evapotranspiration, improves air filtration, and enhances climate resilience."
            },
            {
                "id": "opt_outdoor_ac_misters",
                "label": "Install High-Pressure Evaporative Water Misters and Outdoor Coolers on Streetlamp Poles — Cost: ₹35,000.",
                "cost": 35000,
                "aqiDelta": 0,
                "cleanEnergyDelta": -10,
                "waterDelta": -25,
                "wasteDelta": 0,
                "isOptimal": False,
                "score": 6.0,
                "consequence": "Severely drains depleted municipal water reserves and spikes electrical peak load without addressing root thermodynamic radiation.",
                "reasoning": "Outdoor localized mechanical cooling consumes massive water and energy while dissipating more waste heat into the broader atmosphere."
            },
            {
                "id": "opt_white_paint_only",
                "label": "Paint Only Municipal Building Roofs with Reflective White Paint — Cost: ₹10,000.",
                "cost": 10000,
                "aqiDelta": -2,
                "cleanEnergyDelta": 0,
                "waterDelta": 0,
                "wasteDelta": 0,
                "isOptimal": False,
                "score": 11.0,
                "consequence": "Marginal cooling for 3 government buildings, but fails to address vast asphalt roadways, lack of tree shade, or regional biodiversity collapse.",
                "reasoning": "Isolated albedo interventions without ecological vegetation corridors provide narrow localized micro-benefits."
            }
        ],
        "optimalOptionId": "opt_urban_forest_canopy",
        "maxScore": 20.0
    }
]

def evaluate_environmental_simulation(submissions: list) -> dict:
    """
    Evaluates student governance in Eco Guardian.
    Calculates final AQI, clean energy %, water reserve %, waste diverted %, town budget, and environmental science competencies.
    """
    challenge_dict = {ch["challengeId"]: ch for ch in ENV_CHALLENGES}

    budget_remaining = 150000
    aqi = 185  # Starts unhealthy (185)
    clean_energy = 15  # Starts at 15%
    water_reserves = 35  # Starts at critical 35%
    waste_diverted = 20  # Starts at 20%

    total_score = 0.0
    optimal_count = 0
    challenge_summaries = []

    skill_totals = {
        "scientificReasoning": 0.0,
        "sustainabilityAwareness": 0.0,
        "systemsThinking": 0.0,
        "environmentalProblemSolving": 0.0,
        "resourceBudgetBalancing": 0.0
    }

    for sub in submissions:
        ch = challenge_dict.get(sub.challengeId)
        if not ch:
            continue

        selected_id = sub.selectedOptionId or ""
        chosen_opt = next((opt for opt in ch["options"] if opt["id"] == selected_id), None)

        is_optimal = (selected_id == ch["optimalOptionId"])
        earned = chosen_opt["score"] if chosen_opt else 0.0
        total_score += earned
        if is_optimal:
            optimal_count += 1

        cost = chosen_opt.get("cost", 0) if chosen_opt else 0
        budget_remaining = max(0, budget_remaining - cost)

        aqi = max(20, min(300, aqi + (chosen_opt.get("aqiDelta", 0) if chosen_opt else 0)))
        clean_energy = max(0, min(100, clean_energy + (chosen_opt.get("cleanEnergyDelta", 0) if chosen_opt else 0)))
        water_reserves = max(0, min(100, water_reserves + (chosen_opt.get("waterDelta", 0) if chosen_opt else 0)))
        waste_diverted = max(0, min(100, waste_diverted + (chosen_opt.get("wasteDelta", 0) if chosen_opt else 0)))

        # Skill Attribution
        if ch["challengeId"] == "env_ch_1":
            skill_totals["scientificReasoning"] += (earned / ch["maxScore"]) * 100
            skill_totals["sustainabilityAwareness"] += (earned / ch["maxScore"]) * 80
        elif ch["challengeId"] == "env_ch_2":
            skill_totals["systemsThinking"] += (earned / ch["maxScore"]) * 100
            skill_totals["environmentalProblemSolving"] += (earned / ch["maxScore"]) * 80
        elif ch["challengeId"] == "env_ch_3":
            skill_totals["sustainabilityAwareness"] += (earned / ch["maxScore"]) * 100
            skill_totals["resourceBudgetBalancing"] += (earned / ch["maxScore"]) * 80
        elif ch["challengeId"] == "env_ch_4":
            skill_totals["scientificReasoning"] += (earned / ch["maxScore"]) * 100
            skill_totals["environmentalProblemSolving"] += (earned / ch["maxScore"]) * 100
        elif ch["challengeId"] == "env_ch_5":
            skill_totals["systemsThinking"] += (earned / ch["maxScore"]) * 100
            skill_totals["sustainabilityAwareness"] += (earned / ch["maxScore"]) * 80

        challenge_summaries.append({
            "challengeId": ch["challengeId"],
            "title": ch["title"],
            "skillTested": ch["skillTested"],
            "chosenOptionLabel": chosen_opt["label"] if chosen_opt else "No action",
            "isOptimal": is_optimal,
            "costIncurred": cost,
            "consequence": chosen_opt["consequence"] if chosen_opt else "Incomplete",
            "scoreEarned": earned
        })

    accuracy = round((optimal_count / len(ENV_CHALLENGES)) * 100.0, 1)

    final_skills = {
        "scientificReasoning": round(min(100.0, skill_totals["scientificReasoning"] / 2.0), 1),
        "sustainabilityAwareness": round(min(100.0, skill_totals["sustainabilityAwareness"] / 2.4), 1),
        "systemsThinking": round(min(100.0, skill_totals["systemsThinking"] / 2.0), 1),
        "environmentalProblemSolving": round(min(100.0, skill_totals["environmentalProblemSolving"] / 1.8), 1),
        "resourceBudgetBalancing": round(min(100.0, max(40.0, (budget_remaining / 150000) * 100)), 1)
    }

    # Normalize skills
    for k in final_skills:
        final_skills[k] = round(min(100.0, max(20.0, final_skills[k])), 1)

    if total_score >= 85.0:
        band = "Master Eco Guardian & Systems Ecologist"
        note = "You demonstrated masterful holistic systems thinking, prioritizing ecological root-cause restoration over expensive end-of-pipe band-aids. Outstanding alignment with B.Sc. Environmental Science."
    elif total_score >= 65.0:
        band = "Strong Environmental Strategist"
        note = "You achieved substantial ecological improvements in air and water indicators while balancing municipal capital responsibly. Great aptitude for environmental science."
    elif total_score >= 45.0:
        band = "Developing Ecological Steward"
        note = "You made commendable progress on several fronts. Deepening systems thinking will help avoid shifting pollutants from air to soil or water."
    else:
        band = "Exploratory Environmental Perspective"
        note = "An exploratory beginning in sustainability. Learning nature-based bio-remediation and circular economy dynamics will build foundational environmental insight."

    return {
        "gameScore": round(total_score, 1),
        "accuracy": accuracy,
        "finalAQI": aqi,
        "finalCleanEnergy": clean_energy,
        "finalWaterReserves": water_reserves,
        "finalWasteDiverted": waste_diverted,
        "finalBudget": budget_remaining,
        "skillScores": final_skills,
        "challengeSummaries": challenge_summaries,
        "compatibilityBand": band,
        "recommendationNote": note,
        "strengths": [k for k, v in final_skills.items() if v >= 75.0] or ["Ecological Awareness"],
        "growthAreas": [k for k, v in final_skills.items() if v < 70.0] or ["Hydrological Sponge Systems"],
        "recommendedRoles": ["Environmental Impact Consultant", "Urban Sustainability Planner", "Ecological Restoration Specialist", "Renewable Energy Analyst", "Water Resource Manager"],
        "disclaimer": "This interactive town simulation is an exploratory educational exercise in environmental problem-solving and systems thinking, not a professional environmental impact assessment (EIA)."
    }
