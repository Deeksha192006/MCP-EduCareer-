import React, { useState, useEffect } from 'react';
import { BrainCircuit, Play, ArrowRight, Trophy, Gauge, Activity, Sparkles, CheckCircle2, AlertTriangle, TrendingUp, BarChart2, Search, Database } from 'lucide-react';

const AIDS_GAME_LEVELS = [
  {
    id: "aids_lvl_1",
    name: "Level 1 — Find the Pattern",
    skillTested: "Pattern Recognition",
    difficulty: "easy",
    instruction: "Analyze the numerical progression sequence below. Identify the rule governing the sequence and select the correct missing next number!",
    sequence: [10, 20, 30, 40, "?"],
    options: [
      { value: "50", isCorrect: true, note: "✨ Correct! Constant step size of +10 per term." },
      { value: "45", isCorrect: false, note: "Incorrect step calculation." },
      { value: "60", isCorrect: false, note: "Skipped a step value." },
      { value: "100", isCorrect: false, note: "Exponential scaling is not applied here." }
    ]
  },
  {
    id: "aids_lvl_2",
    name: "Level 2 — Data Detective",
    skillTested: "Data Interpretation",
    difficulty: "medium",
    instruction: "Examine the student performance table below and answer the analytical data query correctly!",
    tableData: [
      { student: "Student A", studyHours: 2, attendance: "75%", score: 62 },
      { student: "Student B", studyHours: 5, attendance: "90%", score: 84 },
      { student: "Student C", studyHours: 3, attendance: "80%", score: 71 },
      { student: "Student D", studyHours: 6, attendance: "95%", score: 91 }
    ],
    question: "Which student achieved the HIGHEST overall score, and what factor correlates most strongly with high performance?",
    options: [
      { id: "opt_d", label: "Student D (Score: 91) — Higher study hours & higher attendance", isCorrect: true },
      { id: "opt_b", label: "Student B (Score: 84) — Equal performance", isCorrect: false },
      { id: "opt_a", label: "Student A (Score: 62) — Lowest study hours", isCorrect: false },
      { id: "opt_c", label: "Student C (Score: 71) — Median score", isCorrect: false }
    ]
  },
  {
    id: "aids_lvl_3",
    name: "Level 3 — Find the Anomaly",
    skillTested: "Anomaly Detection & Analytical Thinking",
    difficulty: "medium",
    instruction: "A sensor recorded temperature values over 8 consecutive minutes. One sensor reading is an abnormal outlier (anomaly). Click on the anomaly!",
    dataset: [48, 51, 49, 52, 50, 98, 51, 49],
    anomalyValue: 98,
    explanation: "98°C is significantly higher than the baseline average of ~50°C, indicating a sensor glitch or transient spike!"
  },
  {
    id: "aids_lvl_4",
    name: "Level 4 — Prediction Challenge",
    skillTested: "Prediction Ability",
    difficulty: "medium",
    instruction: "Analyze monthly revenue growth data over 4 consecutive months. Based on the linear trend (+20k/month), predict the May revenue!",
    monthlyData: [
      { month: "January", revenue: "$100k" },
      { month: "February", revenue: "$120k" },
      { month: "March", revenue: "$140k" },
      { month: "April", revenue: "$160k" },
      { month: "May", revenue: "?" }
    ],
    options: [
      { value: "$180k", isCorrect: true, note: "✨ Correct! Following the steady linear trend of +$20k increase per month." },
      { value: "$165k", isCorrect: false, note: "Underestimates trend slope." },
      { value: "$220k", isCorrect: false, note: "Overestimates trend slope." },
      { value: "$140k", isCorrect: false, note: "Predicts flat zero growth." }
    ]
  },
  {
    id: "aids_lvl_5",
    name: "Level 5 — Data Decision Challenge",
    skillTested: "Analytical Thinking & Decision Making",
    difficulty: "hard",
    instruction: "A company tracks performance across 3 distinct product lines. Which product demonstrates high growth velocity and warrants additional analytical investment?",
    products: [
      { id: "prod_a", name: "Product A", metrics: "Sales: $500k | Growth Rate: +2% (Stagnant)", isCorrect: false },
      { id: "prod_b", name: "Product B", metrics: "Sales: $250k | Growth Rate: +45% (High Velocity)", isCorrect: true, text: "✨ Optimal Decision! Product B shows high growth rate (+45%), making it the best target for scaling!" },
      { id: "prod_c", name: "Product C", metrics: "Sales: $30k   | Growth Rate: -15% (Declining)", isCorrect: false }
    ]
  },
  {
    id: "aids_lvl_6",
    name: "Level 6 — Correlation Thinking",
    skillTested: "Analytical Reasoning",
    difficulty: "hard",
    instruction: "Examine the bivariate relationship between Study Hours and Exam Scores:",
    correlationData: [
      { hours: 1, score: 50 },
      { hours: 2, score: 55 },
      { hours: 3, score: 63 },
      { hours: 4, score: 72 },
      { hours: 5, score: 80 }
    ],
    question: "What statistical relationship (correlation) is demonstrated by this data?",
    options: [
      { id: "c1", label: "Strong Positive Correlation (As study hours increase, exam scores consistently increase)", isCorrect: true },
      { id: "c2", label: "Negative Correlation (As study hours increase, exam scores decrease)", isCorrect: false },
      { id: "c3", label: "Zero Correlation (Study hours have no relationship with exam scores)", isCorrect: false },
      { id: "c4", label: "Non-linear Random Variance", isCorrect: false }
    ]
  }
];

const DataDetectiveGame = ({ onGameComplete }) => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [levelResults, setLevelResults] = useState([]);
  const [attempts, setAttempts] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);
  const [secondsSpent, setSecondsSpent] = useState(0);
  const [timerActive, setTimerActive] = useState(true);

  // Level 1 Option Choice
  const [selectedPatternOpt, setSelectedPatternOpt] = useState(null);

  // Level 2 Option Choice
  const [selectedL2OptId, setSelectedL2OptId] = useState(null);

  // Level 3 Selected Value
  const [selectedAnomalyVal, setSelectedAnomalyVal] = useState(null);

  // Level 4 Option Choice
  const [selectedPredictionOpt, setSelectedPredictionOpt] = useState(null);

  // Level 5 Option Choice
  const [selectedProdId, setSelectedProdId] = useState(null);

  // Level 6 Option Choice
  const [selectedCorrOptId, setSelectedCorrOptId] = useState(null);

  const currentLevel = AIDS_GAME_LEVELS[currentLevelIdx];

  useEffect(() => {
    let interval = null;
    if (timerActive && !isGameOver) {
      interval = setInterval(() => setSecondsSpent(prev => prev + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, isGameOver]);

  useEffect(() => {
    // Reset selections per level
    setSelectedPatternOpt(null);
    setSelectedL2OptId(null);
    setSelectedAnomalyVal(null);
    setSelectedPredictionOpt(null);
    setSelectedProdId(null);
    setSelectedCorrOptId(null);
    setAttempts(1);
  }, [currentLevelIdx]);

  const handleNextLevel = () => {
    let isCorrect = false;

    if (currentLevel.id === "aids_lvl_1") {
      const opt = currentLevel.options.find(o => o.value === selectedPatternOpt);
      isCorrect = opt?.isCorrect === true;
    } else if (currentLevel.id === "aids_lvl_2") {
      const opt = currentLevel.options.find(o => o.id === selectedL2OptId);
      isCorrect = opt?.isCorrect === true;
    } else if (currentLevel.id === "aids_lvl_3") {
      isCorrect = selectedAnomalyVal === currentLevel.anomalyValue;
    } else if (currentLevel.id === "aids_lvl_4") {
      const opt = currentLevel.options.find(o => o.value === selectedPredictionOpt);
      isCorrect = opt?.isCorrect === true;
    } else if (currentLevel.id === "aids_lvl_5") {
      const prod = currentLevel.products.find(p => p.id === selectedProdId);
      isCorrect = prod?.isCorrect === true;
    } else if (currentLevel.id === "aids_lvl_6") {
      const opt = currentLevel.options.find(o => o.id === selectedCorrOptId);
      isCorrect = opt?.isCorrect === true;
    }

    const levelScore = isCorrect ? Math.max(70, 100 - ((attempts - 1) * 15)) : 30.0;

    const levelRecord = {
      levelId: currentLevel.id,
      levelName: currentLevel.name,
      skillTested: currentLevel.skillTested,
      difficulty: currentLevel.difficulty,
      score: levelScore,
      accuracy: isCorrect ? 1.0 : 0.3,
      timeTaken: Math.max(8, Math.round(secondsSpent / (currentLevelIdx + 1))),
      attempts: attempts,
      completed: true
    };

    const newResults = [...levelResults, levelRecord];
    setLevelResults(newResults);

    if (currentLevelIdx < AIDS_GAME_LEVELS.length - 1) {
      setCurrentLevelIdx(prev => prev + 1);
    } else {
      setTimerActive(false);
      setIsGameOver(true);

      if (onGameComplete) {
        onGameComplete(newResults, secondsSpent);
      }
    }
  };

  return (
    <div className="game-container" style={{ width: '100%', color: 'var(--text-main)' }}>
      {/* Game Header Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        background: 'rgba(17, 24, 39, 0.95)',
        border: '1px solid rgba(139, 92, 246, 0.4)',
        borderRadius: '14px',
        marginBottom: '20px',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <BrainCircuit size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>Data Detective Challenge</h3>
            <span style={{ fontSize: '13px', color: '#a78bfa', fontWeight: '600' }}>
              {currentLevel.name} (Level {currentLevelIdx + 1} of 6)
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '18px', alignItems: 'center', fontSize: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={16} style={{ color: '#a78bfa' }} />
            <span>Tested Skill: <strong>{currentLevel.skillTested}</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Gauge size={16} style={{ color: '#38bdf8' }} />
            <span>Time Spent: <strong>{secondsSpent}s</strong></span>
          </div>
        </div>
      </div>

      {!isGameOver ? (
        <div className="card" style={{ padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', background: 'rgba(17, 24, 39, 0.7)' }}>
          {/* Level Instructions */}
          <div style={{
            padding: '16px',
            borderRadius: '12px',
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.25)',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <Sparkles size={22} style={{ color: '#a78bfa', shrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: '700', fontSize: '15px', color: '#c4b5fd', marginBottom: '4px' }}>
                Mission Objective:
              </div>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5', color: 'var(--text-main)' }}>
                {currentLevel.instruction}
              </p>
            </div>
          </div>

          {/* LEVEL 1 INTERFACE */}
          {currentLevel.id === "aids_lvl_1" && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '28px', padding: '20px', borderRadius: '14px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                {currentLevel.sequence.map((num, idx) => (
                  <div key={idx} style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '12px',
                    background: num === "?" ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255,255,255,0.05)',
                    border: num === "?" ? '2px dashed #8b5cf6' : '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: '800',
                    color: num === "?" ? '#c4b5fd' : 'white'
                  }}>
                    {num === "?" && selectedPatternOpt ? selectedPatternOpt : num}
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }}>
                {currentLevel.options.map((opt, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedPatternOpt(opt.value)}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      border: selectedPatternOpt === opt.value ? '2px solid #8b5cf6' : '1px solid var(--border-color)',
                      background: selectedPatternOpt === opt.value ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.03)',
                      cursor: 'pointer',
                      textAlign: 'center',
                      fontSize: '18px',
                      fontWeight: '700'
                    }}
                  >
                    {opt.value}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LEVEL 2 INTERFACE */}
          {currentLevel.id === "aids_lvl_2" && (
            <div>
              <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ background: 'rgba(139, 92, 246, 0.2)', borderBottom: '1px solid rgba(139, 92, 246, 0.4)' }}>
                      <th style={{ padding: '12px' }}>Student</th>
                      <th style={{ padding: '12px' }}>Study Hours</th>
                      <th style={{ padding: '12px' }}>Attendance</th>
                      <th style={{ padding: '12px' }}>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentLevel.tableData.map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '12px', fontWeight: '700' }}>{row.student}</td>
                        <td style={{ padding: '12px' }}>{row.studyHours} hrs/day</td>
                        <td style={{ padding: '12px' }}>{row.attendance}</td>
                        <td style={{ padding: '12px', fontWeight: '800', color: '#a78bfa' }}>{row.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-main)' }}>
                {currentLevel.question}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {currentLevel.options.map((opt) => (
                  <label
                    key={opt.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '16px',
                      borderRadius: '12px',
                      border: selectedL2OptId === opt.id ? '2px solid #8b5cf6' : '1px solid var(--border-color)',
                      background: selectedL2OptId === opt.id ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255,255,255,0.02)',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="aids_lvl2"
                      checked={selectedL2OptId === opt.id}
                      onChange={() => setSelectedL2OptId(opt.id)}
                      style={{ accentColor: '#8b5cf6' }}
                    />
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* LEVEL 3 INTERFACE */}
          {currentLevel.id === "aids_lvl_3" && (
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center', marginBottom: '28px' }}>
                {currentLevel.dataset.map((val, idx) => {
                  const isSelected = selectedAnomalyVal === val;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedAnomalyVal(val)}
                      style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '14px',
                        border: isSelected ? '2px solid #ef4444' : '1px solid var(--border-color)',
                        background: isSelected ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255,255,255,0.03)',
                        color: isSelected ? '#fca5a5' : 'white',
                        fontSize: '20px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>

              {selectedAnomalyVal && (
                <div style={{ padding: '14px', borderRadius: '10px', background: selectedAnomalyVal === currentLevel.anomalyValue ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', border: selectedAnomalyVal === currentLevel.anomalyValue ? '1px solid #10b981' : '1px solid #ef4444', fontSize: '14px', textAlign: 'center', marginBottom: '20px' }}>
                  {selectedAnomalyVal === currentLevel.anomalyValue
                    ? `✨ ANOMALY DETECTED! ${currentLevel.explanation}`
                    : `⚠️ ${selectedAnomalyVal} is within normal baseline range (~50). Inspect other values!`}
                </div>
              )}
            </div>
          )}

          {/* LEVEL 4 INTERFACE */}
          {currentLevel.id === "aids_lvl_4" && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-around', gap: '12px', marginBottom: '28px', padding: '20px', borderRadius: '14px', background: 'rgba(15, 23, 42, 0.8)' }}>
                {currentLevel.monthlyData.map((item, idx) => (
                  <div key={idx} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>{item.month}</div>
                    <div style={{
                      padding: '12px 16px',
                      borderRadius: '10px',
                      background: item.revenue === "?" ? 'rgba(139, 92, 246, 0.25)' : 'rgba(59, 130, 246, 0.15)',
                      border: item.revenue === "?" ? '2px dashed #8b5cf6' : '1px solid #3b82f6',
                      fontWeight: '800',
                      fontSize: '16px',
                      color: item.revenue === "?" ? '#c4b5fd' : '#93c5fd'
                    }}>
                      {item.revenue === "?" && selectedPredictionOpt ? selectedPredictionOpt : item.revenue}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }}>
                {currentLevel.options.map((opt, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedPredictionOpt(opt.value)}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      border: selectedPredictionOpt === opt.value ? '2px solid #8b5cf6' : '1px solid var(--border-color)',
                      background: selectedPredictionOpt === opt.value ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.03)',
                      cursor: 'pointer',
                      textAlign: 'center',
                      fontSize: '18px',
                      fontWeight: '700'
                    }}
                  >
                    {opt.value}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LEVEL 5 INTERFACE */}
          {currentLevel.id === "aids_lvl_5" && (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                {currentLevel.products.map((prod) => {
                  const isSelected = selectedProdId === prod.id;
                  return (
                    <div
                      key={prod.id}
                      onClick={() => setSelectedProdId(prod.id)}
                      style={{
                        padding: '18px',
                        borderRadius: '12px',
                        border: isSelected ? '2px solid #8b5cf6' : '1px solid var(--border-color)',
                        background: isSelected ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255,255,255,0.03)',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>{prod.name}</div>
                      <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{prod.metrics}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* LEVEL 6 INTERFACE */}
          {currentLevel.id === "aids_lvl_6" && (
            <div>
              <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.8)', marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', color: '#a78bfa', fontWeight: '700', marginBottom: '8px' }}>BIVARIATE DATASET:</div>
                <div style={{ display: 'flex', gap: '16px', overflowX: 'auto' }}>
                  {currentLevel.correlationData.map((row, idx) => (
                    <div key={idx} style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', textAlign: 'center', minWidth: '90px' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{row.hours} hrs</div>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: '#34d399' }}>{row.score} pts</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-main)' }}>
                {currentLevel.question}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {currentLevel.options.map((opt) => (
                  <label
                    key={opt.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '16px',
                      borderRadius: '12px',
                      border: selectedCorrOptId === opt.id ? '2px solid #8b5cf6' : '1px solid var(--border-color)',
                      background: selectedCorrOptId === opt.id ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255,255,255,0.02)',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="aids_lvl6"
                      checked={selectedCorrOptId === opt.id}
                      onChange={() => setSelectedCorrOptId(opt.id)}
                      style={{ accentColor: '#8b5cf6' }}
                    />
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Submit / Next Level Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
            <button
              onClick={handleNextLevel}
              className="btn btn-primary"
              style={{
                padding: '12px 28px',
                fontSize: '15px',
                fontWeight: '700',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                color: 'white',
                border: 'none'
              }}
            >
              <span>{currentLevelIdx < AIDS_GAME_LEVELS.length - 1 ? 'Submit & Proceed to Next Level' : 'Complete Round 1 Game'}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      ) : (
        /* Round 1 Complete Summary Card */
        <div className="card" style={{ padding: '32px', textAlign: 'center', borderRadius: '16px', border: '1px solid rgba(139, 92, 246, 0.4)', background: 'rgba(139, 92, 246, 0.05)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.2)', border: '2px solid #8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: '#c4b5fd' }}>
            <Trophy size={36} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
            Round 1 Complete — Data Detective Result
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '24px' }}>
            You completed the Data Detective Challenge! Here is your demonstrated skill breakdown:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px', textAlign: 'left' }}>
            {levelResults.map((r, idx) => (
              <div key={idx} style={{ padding: '14px', borderRadius: '10px', background: 'rgba(17, 24, 39, 0.8)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>{r.levelName}</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#c4b5fd' }}>{r.score}%</div>
                <div style={{ fontSize: '11px', color: '#34d399', marginTop: '2px' }}>Skill: {r.skillTested}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onGameComplete && onGameComplete(levelResults, secondsSpent)}
            className="btn btn-primary"
            style={{ padding: '14px 32px', fontSize: '16px', fontWeight: '700', borderRadius: '12px', background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', border: 'none' }}
          >
            <span>Continue to Round 2 — AIDS Technical Quiz</span>
            <ArrowRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default DataDetectiveGame;
