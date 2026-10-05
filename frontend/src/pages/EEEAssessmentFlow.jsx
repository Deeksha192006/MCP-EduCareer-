import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eeeAPI } from '../services/api';
import SmartPowerGame from '../components/eee/SmartPowerGame';
import EEEQuiz from '../components/eee/EEEQuiz';
import { Trophy, ArrowRight, RefreshCw, Zap } from 'lucide-react';

const EEEAssessmentFlow = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stage, setStage] = useState(0); // 0 = Round 1 Game, 1 = Round 1 Result, 2 = Round 2 Quiz
  const [eeeSession, setEeeSession] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    initAssessment();
  }, [user]);

  const initAssessment = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const studentId = user?.id || 'student-demo-1';
      const res = await eeeAPI.startAssessment(studentId);
      setEeeSession(res.data);

      const qRes = await eeeAPI.getQuizQuestions();
      setQuizQuestions(qRes.data);

      if (res.data.round1?.completed && !res.data.round2?.completed) {
        setStage(1);
      } else if (res.data.round2?.completed) {
        navigate('/engineering-exploration/eee/result');
      } else {
        setStage(0);
      }
    } catch (err) {
      console.error("Failed to initialize EEE session:", err);
      setErrorMsg("Could not connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  const handleRound1Complete = async (levelResults, totalTime) => {
    setLoading(true);
    try {
      const studentId = user?.id || 'student-demo-1';
      const res = await eeeAPI.submitGame(studentId, levelResults, totalTime);
      setEeeSession(res.data);
      setStage(1);
    } catch (err) {
      console.error("Error saving Round 1 Game results:", err);
      setErrorMsg("Failed to save Round 1 results.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartRound2 = () => {
    setStage(2);
  };

  const handleRound2Complete = async (answers, totalTime) => {
    setLoading(true);
    try {
      const studentId = user?.id || 'student-demo-1';
      await eeeAPI.submitQuiz(studentId, answers, totalTime);
      await eeeAPI.completeAssessment(studentId);
      navigate('/engineering-exploration/eee/result');
    } catch (err) {
      console.error("Error saving Round 2 Quiz results:", err);
      setErrorMsg("Failed to complete EEE assessment.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <RefreshCw size={36} className="spin-icon" style={{ color: '#f59e0b', marginBottom: '16px' }} />
        <h3>Loading EEE Assessment Session...</h3>
      </div>
    );
  }

  const r1Data = eeeSession?.round1 || {};
  const skillScores = r1Data?.skillScores || {};

  return (
    <div className="page-container" style={{ maxWidth: '1050px', margin: '0 auto', padding: '24px' }}>
      {/* Header Banner */}
      <div className="card" style={{ padding: '20px', borderRadius: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: '700' }}>EEE ASSESSMENT FLOW</span>
            <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>
              Module Session Progress
            </h2>
          </div>
          <button
            onClick={() => navigate('/engineering-exploration/eee')}
            className="btn btn-outline"
            style={{ padding: '6px 12px', fontSize: '13px' }}
          >
            Exit Assessment
          </button>
        </div>

        {/* 2-Round Progress Bar */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: '12px',
            background: stage === 0 ? 'rgba(245, 158, 11, 0.25)' : stage >= 1 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
            border: stage === 0 ? '1px solid #f59e0b' : stage >= 1 ? '1px solid #10b981' : '1px solid transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: stage >= 1 ? '#10b981' : '#f59e0b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '12px' }}>
              {stage >= 1 ? '✓' : '1'}
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ROUND 1 (60%)</div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: 'white' }}>Smart Power Distribution Challenge</div>
            </div>
          </div>

          <div style={{ color: 'var(--text-muted)' }}>➔</div>

          <div style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: '12px',
            background: stage === 2 ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.05)',
            border: stage === 2 ? '1px solid #10b981' : '1px solid transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: stage === 2 ? '#10b981' : 'rgba(255, 255, 255, 0.2)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '12px' }}>
              2
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ROUND 2 (40%)</div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: 'white' }}>EEE Technical MCQ Quiz</div>
            </div>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="card" style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid var(--danger)', borderRadius: '12px', marginBottom: '20px', color: '#fca5a5' }}>
          {errorMsg}
        </div>
      )}

      {/* RENDER ACTIVE STAGE */}
      {stage === 0 && (
        <SmartPowerGame onGameComplete={handleRound1Complete} />
      )}

      {/* STAGE 1: ROUND 1 RESULT INTERMEDIATE CARD */}
      {stage === 1 && (
        <div className="card" style={{ padding: '32px', borderRadius: '16px', background: 'rgba(23, 32, 54, 0.9)', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <Trophy size={48} style={{ color: '#10b981', margin: '0 auto 12px auto' }} />
            <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>Round 1 Result</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Smart Power Distribution Challenge Performance</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>OVERALL GAME SCORE</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#fbbf24', marginTop: '4px' }}>{r1Data.gameScore} / 100</div>
            </div>

            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ACCURACY</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#10b981', marginTop: '4px' }}>{Math.round((r1Data.accuracy || 0) * 100)}%</div>
            </div>

            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(59, 130, 246, 0.3)', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>TIME SPENT</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#60a5fa', marginTop: '4px' }}>{r1Data.totalTime}s</div>
            </div>
          </div>

          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Round 1 Skill-Wise Performance</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            {Object.entries(skillScores).map(([skillKey, scoreVal]) => (
              <div key={skillKey} style={{ padding: '14px', borderRadius: '10px', background: 'rgba(11, 15, 25, 0.6)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ textTransform: 'capitalize', fontWeight: '600', color: 'var(--text-main)' }}>{skillKey.replace(/([A-Z])/g, ' $1')}</span>
                  <span style={{ fontWeight: '700', color: '#fbbf24' }}>{scoreVal}%</span>
                </div>
                <div style={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${scoreVal}%`, background: '#f59e0b' }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={handleStartRound2}
              className="btn btn-primary"
              style={{ padding: '14px 36px', fontWeight: '700', fontSize: '16px', borderRadius: '12px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none' }}
            >
              <span>Continue to Round 2 — EEE Technical Quiz</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 2: ROUND 2 QUIZ */}
      {stage === 2 && (
        <EEEQuiz questions={quizQuestions} onQuizComplete={handleRound2Complete} />
      )}
    </div>
  );
};

export default EEEAssessmentFlow;
