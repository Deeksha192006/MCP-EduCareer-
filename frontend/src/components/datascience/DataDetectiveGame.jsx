import React, { useState, useEffect } from 'react';
import { 
  LineChart as RechartsLineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell
} from 'recharts';
import { 
  Play, ArrowRight, Trophy, Sparkles, CheckCircle2, AlertTriangle, 
  HelpCircle, RefreshCw, Database, Clock, TrendingUp, Search, ShieldCheck
} from 'lucide-react';

const DataDetectiveGame = ({ levels = [], onComplete, isSubmitting = false }) => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [levelStartTime, setLevelStartTime] = useState(Date.now());
  const [attempts, setAttempts] = useState(1);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);

  useEffect(() => {
    let timer;
    if (gameStarted) {
      timer = setInterval(() => {
        setTotalElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted]);

  const currentLevel = levels[currentLevelIdx] || {};

  const handleStart = () => {
    setGameStarted(true);
    setLevelStartTime(Date.now());
  };

  const handleOptionSelect = (optId) => {
    if (showFeedback) return;
    setSelectedOptionId(optId);
  };

  const handleConfirmAnswer = () => {
    if (!selectedOptionId) return;

    const timeSpent = Math.max(1, Math.round((Date.now() - levelStartTime) / 1000));
    const newSubmission = {
      levelId: currentLevel.levelId,
      selectedOption: selectedOptionId,
      timeTaken: timeSpent,
      attempts: attempts
    };

    const updatedSubmissions = [...submissions, newSubmission];
    setSubmissions(updatedSubmissions);
    setShowFeedback(true);
  };

  const handleNextLevel = () => {
    setShowFeedback(false);
    setSelectedOptionId('');
    setAttempts(1);

    if (currentLevelIdx + 1 < levels.length) {
      setCurrentLevelIdx((prev) => prev + 1);
      setLevelStartTime(Date.now());
    } else {
      // Completed all levels, submit to parent
      if (onComplete) {
        onComplete(submissions, totalElapsedTime);
      }
    }
  };

  if (!gameStarted) {
    return (
      <div className="glass-card" style={{ padding: '36px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(139, 92, 246, 0.2))',
          border: '1.5px solid rgba(56, 189, 248, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          color: '#38bdf8'
        }}>
          <Database size={36} />
        </div>

        <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', marginBottom: '12px' }}>
          Data Detective: Mystery Investigation
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6', marginBottom: '28px', maxWidth: '620px', margin: '0 auto 28px' }}>
          Step into the agency as a Junior Data Detective. Investigate non-linear trend sequences, detect distributed cluster anomalies, solve confounding correlation mysteries, and diagnose security telemetry logs!
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '32px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ color: '#38bdf8', fontWeight: 700, fontSize: '18px' }}>5 Levels</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Progressive Mystery Cases</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ color: '#ec4899', fontWeight: 700, fontSize: '18px' }}>Server Verified</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Objective Aptitude Proof</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ color: '#10b981', fontWeight: 700, fontSize: '18px' }}>B.Sc. Data Science</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Career Alignment Score</div>
          </div>
        </div>

        <button 
          onClick={handleStart}
          className="btn btn-primary"
          style={{
            padding: '14px 36px',
            fontSize: '16px',
            fontWeight: 700,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #38bdf8, #8b5cf6)',
            boxShadow: '0 4px 20px rgba(56, 189, 248, 0.3)',
            cursor: 'pointer'
          }}
        >
          <Play size={18} />
          <span>Launch Investigation</span>
          <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  // Visual dataset rendering based on level
  const renderLevelVisual = () => {
    if (currentLevel.levelId === 'ds_lvl_1') {
      const lineData = [
        { day: 'Day 1', visits: 120 },
        { day: 'Day 2', visits: 150 },
        { day: 'Day 3', visits: 190 },
        { day: 'Day 4', visits: 240 },
        { day: 'Day 5', visits: 300 },
        { day: 'Day 6 (?)', visits: null }
      ];
      return (
        <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '14px', padding: '16px', marginBottom: '20px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#38bdf8' }}>Web Traffic Trend (Thousands of Visits)</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Sequence: 120 → 150 (+30) → 190 (+40) → 240 (+50) → 300 (+60)</span>
          </div>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer>
              <RechartsLineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[100, 400]} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #38bdf8', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="visits" stroke="#38bdf8" strokeWidth={3} dot={{ fill: '#38bdf8', r: 5 }} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    if (currentLevel.levelId === 'ds_lvl_2') {
      const barData = currentLevel.dataset || [
        { service: 'Auth', latency: 22 },
        { service: 'Cart', latency: 25 },
        { service: 'Catalog', latency: 21 },
        { service: 'Search', latency: 24 },
        { service: 'Payment', latency: 198 },
        { service: 'Notif', latency: 26 },
        { service: 'Profile', latency: 23 },
        { service: 'Review', latency: 20 }
      ];
      return (
        <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '14px', padding: '16px', marginBottom: '20px', border: '1px solid rgba(236, 72, 153, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#ec4899' }}>Microservice API Response Latency (Milliseconds)</span>
            <span style={{ fontSize: '12px', color: '#f43f5e' }}>Baseline standard: ~20-26ms</span>
          </div>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="service" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #ec4899', borderRadius: '8px' }} />
                <Bar dataKey="latency" fill="#ec4899" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.latency > 100 ? '#f43f5e' : '#38bdf8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    if (currentLevel.levelId === 'ds_lvl_3') {
      return (
        <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '14px', padding: '20px', marginBottom: '20px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <span style={{ fontSize: '24px' }}>🍦 ⇄ 🏖️</span>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#f59e0b' }}>Case Brief: The Ice Cream & Beach Rescue Paradox</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Empirical Correlation: r = +0.89 (P &lt; 0.001)</div>
            </div>
          </div>
          <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '12px 16px', borderRadius: '8px', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>
            "City municipal open-data reveals that on days when ice cream revenue peaks, beach lifeguard rescue interventions and sunburn emergencies also spike dramatically. Does ice cream cause sunburns?"
          </div>
        </div>
      );
    }

    if (currentLevel.levelId === 'ds_lvl_4') {
      const tableRows = currentLevel.table || [
        { region: 'North', q1: 45, q2: 55, q3: '?', total: 160 },
        { region: 'South', q1: 30, q2: 40, q3: 40, total: 110 },
        { region: 'West', q1: 50, q2: 60, q3: 50, total: 160 },
        { region: 'Total', q1: 125, q2: 155, q3: 150, total: 430 }
      ];
      return (
        <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '14px', padding: '16px', marginBottom: '20px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#10b981', marginBottom: '12px' }}>
            Corrupted Regional Sales Matrix ($ in Thousands)
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#94a3b8' }}>
                  <th style={{ padding: '8px 12px', textAlign: 'left' }}>Region</th>
                  <th style={{ padding: '8px 12px', textAlign: 'center' }}>Q1</th>
                  <th style={{ padding: '8px 12px', textAlign: 'center' }}>Q2</th>
                  <th style={{ padding: '8px 12px', textAlign: 'center' }}>Q3</th>
                  <th style={{ padding: '8px 12px', textAlign: 'center', color: '#38bdf8' }}>Row Total</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', fontWeight: r.region === 'Total' ? 700 : 400 }}>
                    <td style={{ padding: '8px 12px', color: r.region === 'Total' ? '#38bdf8' : '#e2e8f0' }}>{r.region}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'center' }}>{r.q1}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'center' }}>{r.q2}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'center', color: r.q3 === '?' ? '#f43f5e' : '#e2e8f0', fontWeight: r.q3 === '?' ? 800 : 400 }}>
                      {r.q3 === '?' ? (
                        <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(244, 63, 94, 0.2)', border: '1px dashed #f43f5e' }}>?</span>
                      ) : r.q3}
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'center', color: '#38bdf8', fontWeight: 700 }}>{r.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (currentLevel.levelId === 'ds_lvl_5') {
      const clues = currentLevel.clues || [
        "Log Clue 1: 94% of incoming traffic originates from a single /24 IP subnet with identical User-Agent headers.",
        "Log Clue 2: Average user session duration is 0.38 seconds (Human baseline: 145 seconds).",
        "Log Clue 3: 88% of transactions failed at credit card CVV verification, with sequential alphanumeric card attempts."
      ];
      return (
        <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '14px', padding: '16px', marginBottom: '20px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <AlertTriangle size={18} color="#ef4444" />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#ef4444' }}>Live Telemetry Audit Logs (Time: 02:15 AM)</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {clues.map((clue, idx) => (
              <div key={idx} style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '10px 14px', borderRadius: '8px', borderLeft: '3px solid #ef4444', fontSize: '12.5px', color: '#f8fafc', fontFamily: 'monospace' }}>
                {clue}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="glass-card" style={{ padding: '28px', maxWidth: '880px', margin: '0 auto', position: 'relative' }}>
      {/* Level Header & Progress */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {currentLevel.skillTested || 'Data Analysis'}
          </span>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', margin: '2px 0 0' }}>
            {currentLevel.levelName || `Level ${currentLevelIdx + 1}`}
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
            <Clock size={16} color="#38bdf8" />
            <span>{Math.floor(totalElapsedTime / 60)}:{(totalElapsedTime % 60).toString().padStart(2, '0')}</span>
          </div>
          <div style={{
            fontSize: '12px',
            fontWeight: 700,
            padding: '4px 12px',
            borderRadius: '20px',
            background: 'rgba(56, 189, 248, 0.15)',
            color: '#38bdf8',
            border: '1px solid rgba(56, 189, 248, 0.3)'
          }}>
            Case {currentLevelIdx + 1} of {levels.length}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', marginBottom: '24px', overflow: 'hidden' }}>
        <div style={{
          width: `${((currentLevelIdx + 1) / levels.length) * 100}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #38bdf8, #8b5cf6)',
          transition: 'width 0.3s ease'
        }} />
      </div>

      {/* Problem Instruction */}
      <div style={{ fontSize: '14.5px', color: '#e2e8f0', lineHeight: '1.6', marginBottom: '18px' }}>
        {currentLevel.instruction}
      </div>

      {/* Interactive Visual/Data Canvas */}
      {renderLevelVisual()}

      {/* Options List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
        {(currentLevel.options || []).map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          return (
            <div
              key={opt.id}
              onClick={() => handleOptionSelect(opt.id)}
              style={{
                padding: '14px 18px',
                borderRadius: '12px',
                border: isSelected ? '1.5px solid #38bdf8' : '1px solid var(--border-color)',
                background: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                color: isSelected ? '#ffffff' : '#cbd5e1',
                cursor: showFeedback ? 'default' : 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}
            >
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: isSelected ? '5px solid #38bdf8' : '2px solid #64748b',
                background: isSelected ? '#ffffff' : 'transparent',
                marginTop: '2px',
                flexShrink: 0
              }} />
              <div style={{ fontSize: '13.5px', lineHeight: '1.4' }}>
                {opt.label || opt.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submission & Feedback Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {showFeedback ? 'Investigation step recorded on server.' : 'Select the most scientifically sound hypothesis.'}
        </div>

        <div>
          {!showFeedback ? (
            <button
              onClick={handleConfirmAnswer}
              disabled={!selectedOptionId}
              className="btn btn-primary"
              style={{
                padding: '10px 24px',
                fontWeight: 700,
                borderRadius: '8px',
                background: selectedOptionId ? 'linear-gradient(135deg, #38bdf8, #8b5cf6)' : 'rgba(255, 255, 255, 0.1)',
                opacity: selectedOptionId ? 1 : 0.5,
                cursor: selectedOptionId ? 'pointer' : 'not-allowed'
              }}
            >
              Confirm Deduction
            </button>
          ) : (
            <button
              onClick={handleNextLevel}
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{
                padding: '10px 24px',
                fontWeight: 700,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={16} className="spin-icon" />
                  <span>Evaluating Server Submission...</span>
                </>
              ) : currentLevelIdx + 1 < levels.length ? (
                <>
                  <span>Next Case</span>
                  <ArrowRight size={16} />
                </>
              ) : (
                <>
                  <span>Finalize Investigation</span>
                  <CheckCircle2 size={16} />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataDetectiveGame;
