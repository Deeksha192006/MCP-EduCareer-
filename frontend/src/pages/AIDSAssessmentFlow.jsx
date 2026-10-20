import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { aidsAPI, pilotValidationAPI } from '../services/api';
import QueensSafeBoardGame from '../components/aids/QueensSafeBoardGame';
import SmartMoveChallengeGame from '../components/aids/SmartMoveChallengeGame';
import SmartSnakeGame from '../components/aids/SmartSnakeGame';
import WaterTargetChallengeGame from '../components/aids/WaterTargetChallengeGame';
import SafeRiverMissionGame from '../components/aids/SafeRiverMissionGame';
import AIDSQuiz from '../components/aids/AIDSQuiz';
import { Trophy, ArrowRight, RefreshCw, CheckCircle2, Sparkles, BrainCircuit, ShieldAlert, Award } from 'lucide-react';

const AIDS_GAMES = [
  { id: 'aids_game_queens', name: "Queen's Safe Board", icon: '♛', skill: 'Logical Thinking & Constraint Reasoning' },
  { id: 'aids_game_tictactoe', name: 'Smart Move Challenge', icon: '⭕', skill: 'Decision Making & Pattern Recognition' },
  { id: 'aids_game_snake', name: 'Smart Snake', icon: '🐍', skill: 'Path Planning & Spatial Reasoning' },
  { id: 'aids_game_waterjug', name: 'Water Target Challenge', icon: '💧', skill: 'Algorithmic Thinking & Numerical Reasoning' },
  { id: 'aids_game_river', name: 'Safe River Mission', icon: '🚣', skill: 'Constraint Reasoning & Problem Solving' },
];

const AIDSAssessmentFlow = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stage, setStage] = useState(0); // 0 = Round 1 Games, 1 = Round 1 Summary, 2 = Round 2 Quiz
  const [activeGameIdx, setActiveGameIdx] = useState(0);
  const [completedGameResults, setCompletedGameResults] = useState({});
  const [aidsSession, setAidsSession] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [weights, setWeights] = useState({ game_weight: 0.75, written_test_weight: 0.25 });

  useEffect(() => {
    initAssessment();
  }, [user]);

  const initAssessment = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const studentId = user?.id || 'student-demo-1';
      const [resSession, resQuiz, resWeights] = await Promise.all([
        aidsAPI.startAssessment(studentId),
        aidsAPI.getQuizQuestions(),
        pilotValidationAPI.getWeights().catch(() => ({ data: { currentWeights: { game_weight: 0.75, written_test_weight: 0.25 } } }))
      ]);

      setAidsSession(resSession.data);
      setQuizQuestions(resQuiz.data);
      if (resWeights.data?.currentWeights) {
        setWeights(resWeights.data.currentWeights);
      }

      if (resSession.data.round1?.completed && !resSession.data.round2?.completed) {
        setStage(1);
      } else if (resSession.data.round2?.completed) {
        navigate('/engineering-exploration/aids/result');
      } else {
        setStage(0);
      }
    } catch (err) {
      console.error("Failed to initialize AIDS session:", err);
      setErrorMsg("Could not connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  const handleGameComplete = async (gameResult) => {
    const updated = {
      ...completedGameResults,
      [gameResult.gameId]: gameResult
    };
    setCompletedGameResults(updated);

    // If more games remain in the 5-game set
    if (activeGameIdx < AIDS_GAMES.length - 1) {
      setActiveGameIdx(prev => prev + 1);
    } else {
      // All 5 games finished -> Submit Round 1
      setLoading(true);
      try {
        const studentId = user?.id || 'student-demo-1';
        const levelResults = Object.values(updated);
        const totalTime = levelResults.reduce((acc, curr) => acc + (curr.timeTaken || 0), 0);
        const res = await aidsAPI.submitGame(studentId, levelResults, totalTime);
        setAidsSession(res.data);
        setStage(1);
      } catch (err) {
        console.error("Error saving Round 1 Game results:", err);
        setErrorMsg("Failed to save Round 1 results.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleStartRound2 = () => {
    setStage(2);
  };

  const handleRound2Complete = async (answers, totalTime) => {
    setLoading(true);
    try {
      const studentId = user?.id || 'student-demo-1';
      await aidsAPI.submitQuiz(studentId, answers, totalTime);
      await aidsAPI.completeAssessment(studentId);
      navigate('/engineering-exploration/aids/result');
    } catch (err) {
      console.error("Error saving Round 2 Quiz results:", err);
      setErrorMsg("Failed to complete AIDS assessment.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <RefreshCw size={36} className="spin-icon" style={{ color: '#8b5cf6', marginBottom: '16px' }} />
        <h3 style={{ color: '#0f172a' }}>Loading AIDS Assessment Session...</h3>
      </div>
    );
  }

  const r1Data = aidsSession?.round1 || {};
  const skillScores = r1Data?.skillScores || {};
  const gameWeightPct = Math.round((weights.game_weight || 0.75) * 100);
  const writtenWeightPct = Math.round((weights.written_test_weight || 0.25) * 100);

  return (
    <div className="page-container" style={{ maxWidth: '1080px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Header Banner */}
      <div style={{
        background: '#ffffff',
        padding: '20px 24px',
        borderRadius: '16px',
        border: '1.5px solid #e2e8f0',
        marginBottom: '24px',
        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#7c3aed', fontSize: '12px', fontWeight: '800', letterSpacing: '0.05em' }}>
              <BrainCircuit size={16} />
              <span>AIDS EXPLORATION MODULE</span>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '4px 0 0 0' }}>
              Artificial Intelligence & Data Science Assessment
            </h2>
          </div>
          <button
            onClick={() => navigate('/engineering-exploration/aids')}
            className="btn btn-outline"
            style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '10px' }}
          >
            Exit Assessment
          </button>
        </div>

        {/* 2-Round Progress Bar */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{
            flex: 1,
            minWidth: '240px',
            padding: '12px 18px',
            borderRadius: '12px',
            background: stage === 0 ? '#f5f3ff' : stage >= 1 ? '#ecfdf5' : '#f8fafc',
            border: stage === 0 ? '1.5px solid #8b5cf6' : stage >= 1 ? '1.5px solid #10b981' : '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: stage >= 1 ? '#10b981' : '#7c3aed',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '13px'
            }}>
              {stage >= 1 ? '✓' : '1'}
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>ROUND 1 ({gameWeightPct}% WEIGHT)</div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Interactive Skill Games (5 Games)</div>
            </div>
          </div>

          <div style={{ color: '#94a3b8', fontWeight: 'bold' }}>➔</div>

          <div style={{
            flex: 1,
            minWidth: '240px',
            padding: '12px 18px',
            borderRadius: '12px',
            background: stage === 2 ? '#ecfdf5' : '#f8fafc',
            border: stage === 2 ? '1.5px solid #10b981' : '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: stage === 2 ? '#10b981' : '#cbd5e1',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '13px'
            }}>
              2
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>ROUND 2 ({writtenWeightPct}% WEIGHT)</div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>AI & Data Science Technical Quiz</div>
            </div>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div style={{ padding: '14px 20px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', marginBottom: '20px', color: '#b91c1c', fontSize: '14px' }}>
          {errorMsg}
        </div>
      )}

      {/* STAGE 0: 5 INTERACTIVE GAMES */}
      {stage === 0 && (
        <div>
          {/* Game Stepper Tabs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '10px',
            marginBottom: '20px'
          }}>
            {AIDS_GAMES.map((g, idx) => {
              const isDone = !!completedGameResults[g.id];
              const isCurrent = idx === activeGameIdx;

              return (
                <button
                  key={g.id}
                  onClick={() => setActiveGameIdx(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: isCurrent ? '2px solid #7c3aed' : isDone ? '1.5px solid #86efac' : '1px solid #e2e8f0',
                    background: isCurrent ? '#f5f3ff' : isDone ? '#f0fdf4' : '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{g.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>GAME {idx + 1}</div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {g.name}
                    </div>
                  </div>
                  {isDone && <CheckCircle2 size={16} color="#16a34a" />}
                </button>
              );
            })}
          </div>

          {/* Active Game Component */}
          {activeGameIdx === 0 && <QueensSafeBoardGame onGameComplete={handleGameComplete} />}
          {activeGameIdx === 1 && <SmartMoveChallengeGame onGameComplete={handleGameComplete} />}
          {activeGameIdx === 2 && <SmartSnakeGame onGameComplete={handleGameComplete} />}
          {activeGameIdx === 3 && <WaterTargetChallengeGame onGameComplete={handleGameComplete} />}
          {activeGameIdx === 4 && <SafeRiverMissionGame onGameComplete={handleGameComplete} />}
        </div>
      )}

      {/* STAGE 1: ROUND 1 RESULT SUMMARY */}
      {stage === 1 && (
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '1.5px solid #e2e8f0',
          padding: '36px 32px',
          boxShadow: '0 8px 32px rgba(15, 23, 42, 0.06)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)'
            }}>
              <Trophy size={38} />
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
              AIDS Game Performance
            </h2>
            <p style={{ color: '#64748b', fontSize: '15px', maxWidth: '560px', margin: '0 auto' }}>
              All 5 interactive challenges completed successfully! Your exploratory computational thinking profile has been computed.
            </p>
          </div>

          {/* Overview Score Card */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '16px',
            background: '#f8fafc',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            marginBottom: '32px',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Overall Game Score</div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#7c3aed', marginTop: '4px' }}>
                {r1Data.gameScore || 0} / 100
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Accuracy</div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#10b981', marginTop: '4px' }}>
                {Math.round((r1Data.accuracy || 0) * 100)}%
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Total Time Spent</div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#2563eb', marginTop: '4px' }}>
                {r1Data.totalTime || 0}s
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Total Actions / Attempts</div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#f59e0b', marginTop: '4px' }}>
                {r1Data.attempts || 0}
              </div>
            </div>
          </div>

          {/* Skill-wise Performance Cards */}
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="#7c3aed" />
            <span>Exploratory Skill Indicators</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '28px' }}>
            {Object.entries(skillScores).map(([skillKey, scoreVal]) => (
              <div key={skillKey} style={{ padding: '16px', borderRadius: '12px', background: '#ffffff', border: '1.5px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                  <span style={{ textTransform: 'capitalize', fontWeight: '700', color: '#1e293b' }}>
                    {skillKey.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <span style={{ fontWeight: '800', color: '#7c3aed' }}>{scoreVal}%</span>
                </div>
                <div style={{ height: '8px', width: '100%', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${scoreVal}%`, background: 'linear-gradient(90deg, #7c3aed, #a855f7)', borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Educational Disclaimer */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            background: '#fffbeb',
            border: '1.5px solid #fde68a',
            padding: '16px 20px',
            borderRadius: '12px',
            marginBottom: '32px',
            color: '#92400e',
            fontSize: '13px',
            lineHeight: '1.5'
          }}>
            <ShieldAlert size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Exploratory Skill Note:</strong> These games are designed as exploratory skill indicators to help school students discover their problem-solving and algorithmic interests. They must <strong>NOT</strong> be treated as psychological diagnoses or definitive guarantees of suitability for Artificial Intelligence & Data Science.
            </div>
          </div>

          {/* Continue CTA */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={handleStartRound2}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '16px 42px',
                fontWeight: '700',
                fontSize: '16px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(16, 185, 129, 0.35)'
              }}
            >
              <span>Continue to Round 2 — AI & Data Science Quiz</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 2: ROUND 2 QUIZ */}
      {stage === 2 && (
        <AIDSQuiz questions={quizQuestions} onQuizComplete={handleRound2Complete} />
      )}
    </div>
  );
};

export default AIDSAssessmentFlow;
