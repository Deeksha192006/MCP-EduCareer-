import React, { useState, useEffect } from 'react';
import { studentAPI, coursesAPI } from '../services/api';
import { 
  Compass, Award, BookOpen, Target, CheckCircle, AlertTriangle, 
  HelpCircle, Sliders, FileText, ChevronRight, Layers, Lightbulb, 
  TrendingUp, Sparkles, RefreshCw, BarChart2, ShieldCheck, ArrowRight,
  Calculator, Zap, Cpu, Radio, Wrench, BrainCircuit, CheckSquare, Square,
  Flame, Star, Play
} from 'lucide-react';

const Student12thGuidance = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [guidance, setGuidance] = useState(null);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [careerDetail, setCareerDetail] = useState(null);
  
  // Active Filter for Stage 1 Courses
  const [activeCategory, setActiveCategory] = useState('ALL');

  // Modals & Interactive Drawers
  const [showTransparency, setShowTransparency] = useState(false);
  const [showConfusedModal, setShowConfusedModal] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [showStreamQuiz, setShowStreamQuiz] = useState(false);
  const [confusedData, setConfusedData] = useState(null);
  
  // Interactive 12th Cutoff Calculator State
  const [cutoffMarks, setCutoffMarks] = useState({ math: 90, physics: 86, chemistry: 82 });
  const [calculatedCutoff, setCalculatedCutoff] = useState(174.0);

  // Quick Stream Quiz State
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);

  // Simulator State
  const [simMarks, setSimMarks] = useState({ math: 85, physics: 85, chemistry: 85, computer_science: 90 });
  const [simSkills, setSimSkills] = useState({ problem_solving: 9, logical_thinking: 9 });
  const [simResults, setSimResults] = useState(null);
  const [simulating, setSimulating] = useState(false);

  // Interactive Checklist State
  const [checkedItems, setCheckedItems] = useState({});

  const studentId = user?.id || 'student-demo-1';

  useEffect(() => {
    fetchGuidance();
  }, [studentId]);

  useEffect(() => {
    // Calculate 12th Tamil Nadu / General Engineering Cutoff = Math + Physics/2 + Chemistry/2
    const m = parseFloat(cutoffMarks.math) || 0;
    const p = parseFloat(cutoffMarks.physics) || 0;
    const c = parseFloat(cutoffMarks.chemistry) || 0;
    const cutoff = m + (p / 2) + (c / 2);
    setCalculatedCutoff(cutoff.toFixed(2));
  }, [cutoffMarks]);

  const fetchGuidance = async () => {
    setLoading(true);
    try {
      const res = await studentAPI.get12thGuidance(studentId);
      setGuidance(res.data);
      if (res.data.top_careers && res.data.top_careers.length > 0) {
        handleSelectCareer(res.data.top_careers[0].career_title);
      }
    } catch (err) {
      console.error("Error fetching 12th guidance:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCareer = async (careerTitle) => {
    setSelectedCareer(careerTitle);
    try {
      const res = await coursesAPI.getCareerDetails(careerTitle);
      setCareerDetail(res.data);
    } catch (err) {
      console.error("Error fetching career detail:", err);
    }
  };

  const handleOpenConfusedMode = async () => {
    try {
      const res = await studentAPI.exploreConfusedMode(studentId);
      setConfusedData(res.data);
      setShowConfusedModal(true);
    } catch (err) {
      console.error("Error exploring confused mode:", err);
    }
  };

  const handleRunSimulation = async () => {
    setSimulating(true);
    try {
      const res = await studentAPI.simulateWhatIf(studentId, simMarks, simSkills);
      setSimResults(res.data);
    } catch (err) {
      console.error("Error running simulation:", err);
    } finally {
      setSimulating(false);
    }
  };

  const toggleChecklist = (id) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Stream Quiz Questions
  const quizQuestions = [
    {
      q: "What type of problem solving excites you the most?",
      options: [
        { label: "Building apps, code puzzles, & AI algorithms", stream: "CSE / AI&DS" },
        { label: "Designing microchips, robotics & wireless signals", stream: "ECE" },
        { label: "Power grids, electric vehicles & green energy", stream: "EEE" },
        { label: "Mechanical gears, 3D printing & engine physics", stream: "MECH" }
      ]
    },
    {
      q: "Which subject topic did you enjoy most in 12th Grade?",
      options: [
        { label: "Computer Science & Boolean Logic", stream: "CSE / AI&DS" },
        { label: "Electromagnetism & Semiconductors", stream: "ECE" },
        { label: "Current Electricity & Circuits", stream: "EEE" },
        { label: "Laws of Motion & Mechanics", stream: "MECH" }
      ]
    },
    {
      q: "Where do you see yourself working after Graduation?",
      options: [
        { label: "Top Tech Firm / Software Architect", stream: "CSE / AI&DS" },
        { label: "Embedded Systems / Telecom Giant", stream: "ECE" },
        { label: "EV Automobile / Renewable Energy Power Plant", stream: "EEE" },
        { label: "Robotics / Manufacturing / Design Engineer", stream: "MECH" }
      ]
    }
  ];

  const handleQuizAnswer = (option) => {
    const updated = { ...quizAnswers, [quizStep]: option.stream };
    setQuizAnswers(updated);
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      // Calculate winner
      const counts = {};
      Object.values(updated).forEach(st => counts[st] = (counts[st] || 0) + 1);
      let topStream = "CSE / AI&DS";
      let maxC = 0;
      Object.entries(counts).forEach(([st, c]) => {
        if (c > maxC) { maxC = c; topStream = st; }
      });
      setQuizResult(topStream);
    }
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers({});
    setQuizResult(null);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <RefreshCw className="animate-spin" size={40} style={{ color: 'var(--primary)', marginBottom: '16px' }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '16px', fontWeight: 600 }}>Analyzing 12th Marks, Aptitude & AI Models...</p>
      </div>
    );
  }

  const topCourses = guidance?.top_courses || [];
  const topCareers = guidance?.top_careers || [];
  const skillGaps = guidance?.skill_gaps || [];
  const roadmap = guidance?.learning_roadmap || [];
  const nlpIntent = guidance?.nlp_analysis?.career_intent || {};

  // Category filter
  const filteredCourses = topCourses.filter(c => {
    if (activeCategory === 'ALL') return true;
    if (activeCategory === 'CSE' && (c.course.includes('Computer') || c.course.includes('Software') || c.course.includes('Data') || c.course.includes('AI'))) return true;
    if (activeCategory === 'ECE' && (c.course.includes('Electronics') || c.course.includes('Communication'))) return true;
    if (activeCategory === 'EEE' && (c.course.includes('Electrical') || c.course.includes('Energy'))) return true;
    if (activeCategory === 'MECH' && (c.course.includes('Mechanical') || c.course.includes('Robotics') || c.course.includes('Mechatronics'))) return true;
    return false;
  });

  const getTierBadge = (cutoff) => {
    if (cutoff >= 185) return { text: "Tier-1 Premier Cutoff (IIT/NIT/Anna Univ Campus)", color: "#34d399", bg: "rgba(16, 185, 129, 0.2)" };
    if (cutoff >= 165) return { text: "Tier-1/Tier-2 Top Engineering Colleges", color: "#60a5fa", bg: "rgba(59, 130, 246, 0.2)" };
    if (cutoff >= 140) return { text: "Reputed State & Autonomous Institutions", color: "#c084fc", bg: "rgba(139, 92, 246, 0.2)" };
    return { text: "Good Regional & Specialized Engineering Colleges", color: "#fbbf24", bg: "rgba(245, 158, 11, 0.2)" };
  };

  const tierInfo = getTierBadge(calculatedCutoff);

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* Hero Banner Header */}
      <div className="banner-header">
        <div className="banner-title-row">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>
              <span style={{ background: 'var(--primary-light)', padding: '4px 10px', borderRadius: '20px', border: '1px solid var(--primary-border)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} style={{ color: 'var(--primary)' }} />
                <span>Class 12th Pass Graduate Hub</span>
              </span>
              <span style={{ color: 'var(--text-dim)' }}>•</span>
              <span style={{ color: 'var(--success)', fontWeight: 700 }}>AI Multi-Stage Match Engine</span>
            </div>
            
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
              Your 12th Engineering & Career Pathfinder
            </h1>
            <p className="banner-subtitle">
              Interactive 12th Engineering Cutoff calculator, AI multi-stage course matching, NLP intent mapping, and 6-month pre-college skill prep.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={() => setShowStreamQuiz(true)} className="btn btn-primary" style={{ fontSize: '13px' }}>
              <Play size={16} />
              <span>3-Min Stream Quiz</span>
            </button>

            <button onClick={handleOpenConfusedMode} className="btn btn-outline" style={{ fontSize: '13px', borderColor: 'var(--warning-border)', color: 'var(--warning)', background: 'var(--warning-bg)' }}>
              <HelpCircle size={16} />
              <span>"I'm Confused" Mode</span>
            </button>

            <button onClick={() => setShowTransparency(true)} className="btn btn-outline" style={{ fontSize: '13px' }}>
              <BarChart2 size={16} />
              <span>Algorithm Score</span>
            </button>

            <a href={studentAPI.exportReportPDF(studentId)} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ fontSize: '13px', borderColor: 'rgba(99, 102, 241, 0.4)' }}>
              <FileText size={16} />
              <span>PDF Report</span>
            </a>
          </div>
        </div>

        {/* Metrics Bar */}
        <div className="metrics-bar">
          <div className="metric-item">
            <span className="metric-label">Profile Readiness</span>
            <div className="progress-bar-bg">
              <div className="progress-fill-emerald" style={{ width: `${guidance?.profile_completeness}%` }}></div>
            </div>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>{guidance?.profile_completeness}% Complete</span>
          </div>

          <div className="metric-item">
            <span className="metric-label">Matching Confidence</span>
            <div className="progress-bar-bg">
              <div className="progress-fill-indigo" style={{ width: `${guidance?.recommendation_confidence}%` }}></div>
            </div>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#a5b4fc', marginTop: '4px' }}>{guidance?.recommendation_confidence}% High Match</span>
          </div>

          <div className="metric-item">
            <span className="metric-label">NLP Intent Domain</span>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#fbbf24', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Flame size={16} />
              {nlpIntent.primary_domain || 'Technology & Engineering'}
            </span>
          </div>

          <div className="metric-item">
            <span className="metric-label">ML Model Engine</span>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#e0e7ff', marginTop: '4px' }}>
              {guidance?.model_version || 'v3.0 Multi-Output XGBoost'}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive 12th Engineering Cutoff Calculator */}
      <div className="cutoff-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.25)', border: '1px solid rgba(139, 92, 246, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc' }}>
              <Calculator size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>
                Interactive 12th Board Engineering Cutoff Calculator
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Engineering Cutoff = Maths + (Physics / 2) + (Chemistry / 2) [Max Score: 200]
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(17, 24, 39, 0.7)', padding: '10px 20px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Calculated Cutoff:</span>
            <span style={{ fontSize: '26px', fontWeight: 800, color: '#a5b4fc', fontFamily: "'Outfit', sans-serif" }}>
              {calculatedCutoff} <span style={{ fontSize: '14px', color: 'var(--text-dim)' }}>/ 200</span>
            </span>
          </div>
        </div>

        {/* Sliders Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', background: 'rgba(17, 24, 39, 0.5)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label className="form-label" style={{ margin: 0, fontSize: '13px' }}>Mathematics (100)</label>
              <span style={{ color: '#38bdf8', fontWeight: 700, fontSize: '13px' }}>{cutoffMarks.math}</span>
            </div>
            <input 
              type="range" 
              min="35" 
              max="100" 
              value={cutoffMarks.math} 
              onChange={(e) => setCutoffMarks({ ...cutoffMarks, math: e.target.value })} 
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label className="form-label" style={{ margin: 0, fontSize: '13px' }}>Physics (100)</label>
              <span style={{ color: '#818cf8', fontWeight: 700, fontSize: '13px' }}>{cutoffMarks.physics}</span>
            </div>
            <input 
              type="range" 
              min="35" 
              max="100" 
              value={cutoffMarks.physics} 
              onChange={(e) => setCutoffMarks({ ...cutoffMarks, physics: e.target.value })} 
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label className="form-label" style={{ margin: 0, fontSize: '13px' }}>Chemistry (100)</label>
              <span style={{ color: '#f472b6', fontWeight: 700, fontSize: '13px' }}>{cutoffMarks.chemistry}</span>
            </div>
            <input 
              type="range" 
              min="35" 
              max="100" 
              value={cutoffMarks.chemistry} 
              onChange={(e) => setCutoffMarks({ ...cutoffMarks, chemistry: e.target.value })} 
            />
          </div>
        </div>

        {/* Tier Prediction Badge */}
        <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>College Category Predictor:</span>
          <span style={{ padding: '6px 14px', borderRadius: '20px', background: tierInfo.bg, color: tierInfo.color, fontWeight: 700, fontSize: '12px', border: `1px solid ${tierInfo.color}40` }}>
            {tierInfo.text}
          </span>
        </div>
      </div>

      {/* Decision Journey Step Map */}
      <div className="journey-container">
        <h2 style={{ fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Compass size={18} style={{ color: 'var(--primary)' }} />
          Your 12th-to-College Decision Journey Map
        </h2>

        <div className="journey-steps-grid">
          <div className="journey-step">
            <span style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: 700 }}>STEP 1</span>
            <p style={{ fontSize: '12px', fontWeight: 700, marginTop: '2px' }}>12th Board Marks</p>
          </div>
          <div className="journey-step">
            <span style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: 700 }}>STEP 2</span>
            <p style={{ fontSize: '12px', fontWeight: 700, marginTop: '2px' }}>Aptitude Test</p>
          </div>
          <div className="journey-step">
            <span style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: 700 }}>STEP 3</span>
            <p style={{ fontSize: '12px', fontWeight: 700, marginTop: '2px' }}>NLP Interest Extraction</p>
          </div>
          <div className="journey-step">
            <span style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: 700 }}>STEP 4</span>
            <p style={{ fontSize: '12px', fontWeight: 700, marginTop: '2px' }}>Branch Compatibility</p>
          </div>
          <div className="journey-step">
            <span style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: 700 }}>STEP 5</span>
            <p style={{ fontSize: '12px', fontWeight: 700, marginTop: '2px' }}>Career Target</p>
          </div>
          <div className="journey-step active">
            <span style={{ fontSize: '10px', color: '#34d399', fontWeight: 700 }}>STEP 6</span>
            <p style={{ fontSize: '12px', fontWeight: 700, marginTop: '2px', color: '#34d399' }}>Pre-College Prep</p>
          </div>
        </div>
      </div>

      {/* Interactive Main Two Column Grid */}
      <div className="two-col-grid">
        
        {/* Left Column: Stage 1 Courses */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={20} style={{ color: 'var(--primary)' }} />
              Recommended Engineering Branches
            </h2>

            <button onClick={() => setShowSimulator(true)} className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '12px', borderColor: 'var(--primary)' }}>
              <Sliders size={14} />
              "What-If" Simulator
            </button>
          </div>

          {/* Interactive Category Filter Nav */}
          <div className="stream-tabs-nav">
            <button className={`stream-tab-item ${activeCategory === 'ALL' ? 'active' : ''}`} onClick={() => setActiveCategory('ALL')}>
              <span>All Branches</span>
            </button>
            <button className={`stream-tab-item ${activeCategory === 'CSE' ? 'active' : ''}`} onClick={() => setActiveCategory('CSE')}>
              <Cpu size={14} />
              <span>CSE & AI</span>
            </button>
            <button className={`stream-tab-item ${activeCategory === 'ECE' ? 'active' : ''}`} onClick={() => setActiveCategory('ECE')}>
              <Radio size={14} />
              <span>ECE</span>
            </button>
            <button className={`stream-tab-item ${activeCategory === 'EEE' ? 'active' : ''}`} onClick={() => setActiveCategory('EEE')}>
              <Zap size={14} />
              <span>EEE</span>
            </button>
            <button className={`stream-tab-item ${activeCategory === 'MECH' ? 'active' : ''}`} onClick={() => setActiveCategory('MECH')}>
              <Wrench size={14} />
              <span>Mechanical</span>
            </button>
          </div>

          {filteredCourses.map((c, idx) => (
            <div key={idx} className={`course-card ${idx === 0 ? 'highlight' : ''}`}>
              <div className="course-header-row">
                <div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="badge badge-consistent">Rank #{idx + 1}</span>
                    <span className="badge badge-potential">{c.duration || '4 Years B.E / B.Tech'}</span>
                    {idx === 0 && <span className="badge badge-high-performer">🔥 Top Match</span>}
                  </div>
                  <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#ffffff' }}>{c.course}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Degree: <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{c.degree_type}</span> | Stream: <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{c.domain}</span>
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div className="match-score-big">{c.match_score}%</div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Match Score</span>
                </div>
              </div>

              {/* Why Match Box */}
              <div className="why-match-box">
                <div className="why-match-title">
                  ✓ Why this matches your 12th profile:
                </div>
                {c.why_matches?.map((wm, wIdx) => (
                  <div key={wIdx} className="why-match-point">• {wm}</div>
                ))}
              </div>

              {/* Challenge Box */}
              {c.potential_challenges?.length > 0 && (
                <div className="challenge-box">
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#fbbf24' }}>
                    ⚠ Pre-Requisite Focus Area:
                  </div>
                  {c.potential_challenges.map((pc, pIdx) => (
                    <div key={pIdx} style={{ fontSize: '12px', color: '#fef08a', marginLeft: '8px', marginTop: '2px' }}>• {pc}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Column: Stage 2 Careers & Skill Gap Analysis */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="glass-card">
            <h2 style={{ fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Target size={20} style={{ color: 'var(--primary)' }} />
              Stage 2 — Future Career Targets
            </h2>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>Click any career to explore skills & beginner projects:</span>

            <div className="pills-group">
              {topCareers.map((car, cIdx) => (
                <button
                  key={cIdx}
                  onClick={() => handleSelectCareer(car.career_title)}
                  className={`pill-btn ${selectedCareer === car.career_title ? 'active' : ''}`}
                >
                  {car.career_title} ({car.readiness_score}%)
                </button>
              ))}
            </div>

            {careerDetail && (
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>{careerDetail.title}</h3>
                  <span style={{ fontSize: '12px', color: '#34d399', fontWeight: 700, background: 'rgba(16, 185, 129, 0.15)', padding: '4px 10px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    High Global Demand
                  </span>
                </div>
                
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px', lineHeight: '1.5' }}>{careerDetail.description}</p>

                <div style={{ marginTop: '14px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', display: 'block', marginBottom: '6px' }}>Essential Core Skills:</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {careerDetail.req_skills?.map((sk, skIdx) => (
                      <span key={skIdx} style={{ fontSize: '11px', padding: '4px 10px', background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '6px' }}>
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: '14px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#fbbf24', display: 'block', marginBottom: '6px' }}>Recommended 1st Year Projects:</span>
                  <ul style={{ paddingLeft: '18px', fontSize: '12px', color: 'var(--text-main)', lineHeight: '1.6' }}>
                    {careerDetail.beginner_project_ideas?.map((pi, pIdx) => (
                      <li key={pIdx}>{pi}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Skill Gap Analysis Box */}
          <div className="glass-card">
            <h3 style={{ fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <TrendingUp size={18} style={{ color: 'var(--success)' }} />
              Aptitude & Skill Readiness Analysis
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {skillGaps.map((sg, sgIdx) => (
                <div key={sgIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'rgba(17, 24, 39, 0.65)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>{sg.skill}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                      Required Level: {sg.target_level}/10 | Your Score: {sg.student_level}/10
                    </span>
                  </div>
                  <span className={`badge ${sg.status.includes('Strong') ? 'badge-high-performer' : 'badge-support'}`}>
                    {sg.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 6-Month Actionable Pre-College Roadmap */}
      <div className="glass-card" style={{ marginTop: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '19px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={22} style={{ color: 'var(--primary)' }} />
              Pre-College 6-Month Actionable Learning Roadmap
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Follow these recommended milestones before your college semester begins to get ahead of the curve!
            </p>
          </div>
        </div>

        <div className="roadmap-grid">
          {roadmap.map((rm, rIdx) => {
            const isDone = checkedItems[`rm-${rIdx}`];
            return (
              <div 
                key={rIdx} 
                className="roadmap-step"
                style={{ border: isDone ? '1px solid rgba(16, 185, 129, 0.5)' : undefined, background: isDone ? 'rgba(16, 185, 129, 0.08)' : undefined }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: isDone ? '#34d399' : 'var(--primary)' }}>{rm.month}</span>
                  <button onClick={() => toggleChecklist(`rm-${rIdx}`)} style={{ background: 'none', border: 'none', color: isDone ? '#34d399' : 'var(--text-muted)', cursor: 'pointer' }}>
                    {isDone ? <CheckSquare size={16} /> : <Square size={16} />}
                  </button>
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>{rm.focus}</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4', marginTop: '4px' }}>{rm.action}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL: 3-Min Stream Quiz */}
      {showStreamQuiz && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#ec4899', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={22} />
                3-Minute Interactive Stream Matcher Quiz
              </h3>
              <button onClick={() => { setShowStreamQuiz(false); resetQuiz(); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '20px' }}>✕</button>
            </div>

            {!quizResult ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Question {quizStep + 1} of {quizQuestions.length}</span>
                  <span style={{ fontSize: '12px', color: '#ec4899', fontWeight: 700 }}>Step {quizStep + 1}</span>
                </div>

                <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '16px' }}>
                  {quizQuestions[quizStep].q}
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {quizQuestions[quizStep].options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => handleQuizAnswer(opt)}
                      style={{
                        padding: '14px 18px',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(30, 41, 69, 0.7)',
                        border: '1px solid var(--border-color)',
                        color: 'white',
                        textAlign: 'left',
                        fontWeight: 600,
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ec4899'; e.currentTarget.style.background = 'rgba(236, 72, 153, 0.15)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.background = 'rgba(30, 41, 69, 0.7)'; }}
                    >
                      <span>{opt.label}</span>
                      <ChevronRight size={18} style={{ color: '#ec4899' }} />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'white' }}>
                  <Award size={32} />
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff' }}>Your Recommended Engineering Stream:</h3>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#ec4899', margin: '12px 0', fontFamily: "'Outfit', sans-serif" }}>
                  {quizResult}
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 24px' }}>
                  Based on your choices, your natural interest maps strongly to {quizResult}. Try out our interactive department exploration module to test your hands-on aptitude!
                </p>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button onClick={resetQuiz} className="btn btn-outline" style={{ padding: '10px 20px' }}>
                    Retake Quiz
                  </button>
                  <button onClick={() => setShowStreamQuiz(false)} className="btn btn-primary" style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #ec4899, #8b5cf6)' }}>
                    Explore {quizResult} Details
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: Transparency Algorithm */}
      {showTransparency && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart2 size={20} style={{ color: 'var(--primary)' }} />
                AI Recommendation Transparency & Model Architecture
              </h3>
              <button onClick={() => setShowTransparency(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '18px' }}>✕</button>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              The recommendation engine calculates a transparent weighted score using 6 distinct parameters:
            </p>

            <div style={{ background: 'rgba(17, 24, 39, 0.8)', padding: '16px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>12th Academic Subject Compatibility</span><strong style={{ color: 'var(--primary)' }}>25% Weight</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Domain Interest Compatibility</span><strong style={{ color: 'var(--primary)' }}>20% Weight</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Skill & Aptitude Compatibility</span><strong style={{ color: 'var(--primary)' }}>20% Weight</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>NLP Career Intent Extraction</span><strong style={{ color: 'var(--primary)' }}>15% Weight</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Working Style Preference</span><strong style={{ color: 'var(--primary)' }}>10% Weight</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Explicit Student Career Preference</span><strong style={{ color: 'var(--primary)' }}>10% Weight</strong></div>
            </div>

            <div style={{ textAlign: 'right', marginTop: '20px' }}>
              <button onClick={() => setShowTransparency(false)} className="btn btn-primary" style={{ padding: '8px 20px' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: "What-If" Simulator */}
      {showSimulator && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={20} style={{ color: 'var(--primary)' }} />
                "What If I Improve?" Scenario Simulator
              </h3>
              <button onClick={() => setShowSimulator(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '18px' }}>✕</button>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Simulate how improving your subject marks would impact your projected Course Match scores:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label className="form-label">Mathematics (%)</label>
                <input type="number" value={simMarks.math} onChange={(e) => setSimMarks({ ...simMarks, math: e.target.value })} className="form-input" />
              </div>
              <div>
                <label className="form-label">Physics (%)</label>
                <input type="number" value={simMarks.physics} onChange={(e) => setSimMarks({ ...simMarks, physics: e.target.value })} className="form-input" />
              </div>
            </div>

            <button onClick={handleRunSimulation} disabled={simulating} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              {simulating ? 'Calculating Projected Gain...' : 'Run Simulation'}
            </button>

            {simResults && (
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--success)' }}>Projected Match Score Gains:</h4>
                {simResults.comparison?.map((comp, cIdx) => (
                  <div key={cIdx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '8px 12px', background: 'rgba(17, 24, 39, 0.6)', borderRadius: '6px' }}>
                    <span>{comp.course}</span>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>{comp.current_match}% ➔ </span>
                      <strong style={{ color: 'var(--success)' }}>{comp.projected_match}% ({comp.projected_gain})</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: "I'm Confused" Mode */}
      {showConfusedModal && confusedData && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HelpCircle size={20} />
                "I'm Not Sure What to Choose" Mode
              </h3>
              <button onClick={() => setShowConfusedModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '18px' }}>✕</button>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>{confusedData.message}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700 }}>Your Top Domain Strengths:</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {confusedData.strongest_domains?.map((d, dIdx) => (
                  <div key={dIdx} style={{ padding: '10px', background: 'rgba(17, 24, 39, 0.6)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#a5b4fc', display: 'block' }}>{d.domain}</span>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--success)' }}>{d.score}% Affinity</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ textAlign: 'right', marginTop: '20px' }}>
              <button onClick={() => setShowConfusedModal(false)} className="btn btn-primary" style={{ padding: '8px 20px', background: 'var(--warning)' }}>Got It!</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Student12thGuidance;
