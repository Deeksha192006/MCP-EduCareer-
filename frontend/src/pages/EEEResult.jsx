import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eeeAPI } from '../services/api';
import { Zap, Award, RotateCcw, ArrowRight, CheckCircle2, BarChart2, BookOpen, Lightbulb, Sparkles, Brain } from 'lucide-react';

const EEEResult = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchResult();
  }, [user]);

  const fetchResult = async () => {
    setLoading(true);
    try {
      const studentId = user?.id || 'student-demo-1';
      const res = await eeeAPI.getResult(studentId);
      setResult(res.data);
    } catch (err) {
      console.error("Failed to load EEE result:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div className="spin-icon" style={{ fontSize: '32px', marginBottom: '16px' }}>⚡</div>
        <h3>Computing Final EEE Exploration Report...</h3>
      </div>
    );
  }

  const finalRes = result?.finalResult || {};
  const skillProfile = finalRes?.skillProfile || {};
  const score = finalRes?.explorationScore || 0;
  const band = finalRes?.compatibilityBand || 'Needs Further Exploration';
  const strengths = finalRes?.strengths || [];
  const improvementAreas = finalRes?.improvementAreas || [];
  const suggestions = finalRes?.learningSuggestions || [];

  const r1 = result?.round1 || {};
  const r2 = result?.round2 || {};

  return (
    <div className="page-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px' }}>
      {/* Top Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(30, 41, 69, 0.95))',
        border: '1px solid rgba(245, 158, 11, 0.4)',
        padding: '32px',
        borderRadius: '16px',
        marginBottom: '28px',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)'
          }}>
            <Award size={28} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#f59e0b', letterSpacing: '0.05em' }}>
              FINAL EEE EXPLORATION REPORT
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0 }}>
              Electrical & Electronics Skill Profile
            </h1>
          </div>
        </div>

        {/* Compatibility Score Display */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          padding: '24px',
          background: 'rgba(245, 158, 11, 0.12)',
          borderRadius: '14px',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          marginTop: '20px'
        }}>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '4px' }}>
              EEE EXPLORATION SCORE (ROUND 1 60% + ROUND 2 40%)
            </div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: 'white', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span>EEE Compatibility:</span>
              <span style={{
                background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {score}%
              </span>
            </div>
          </div>

          <div style={{
            padding: '12px 20px',
            borderRadius: '10px',
            background: score >= 60 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
            border: score >= 60 ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(245, 158, 11, 0.4)',
            color: score >= 60 ? '#10b981' : '#f59e0b',
            fontWeight: '700',
            fontSize: '15px'
          }}>
            Alignment Band: {band}
          </div>
        </div>

        <div style={{
          marginTop: '20px',
          fontSize: '15px',
          lineHeight: '1.6',
          color: 'var(--text-main)',
          padding: '16px',
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: '10px',
          borderLeft: '4px solid #f59e0b'
        }}>
          "Your assessment performance shows alignment with several skills associated with Electrical and Electronics Engineering."
        </div>
      </div>

      {/* Round 1 vs Round 2 Score Summaries */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        <div className="card" style={{ padding: '24px', borderRadius: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#f59e0b' }}>ROUND 1 — SKILL GAME (60%)</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'white', margin: '4px 0 8px 0' }}>{r1.gameScore || 0} / 100</div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Smart Power Distribution Challenge (Accuracy: {Math.round((r1.accuracy || 0) * 100)}%, Time: {r1.totalTime || 0}s)
          </div>
        </div>

        <div className="card" style={{ padding: '24px', borderRadius: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#10b981' }}>ROUND 2 — TECHNICAL QUIZ (40%)</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'white', margin: '4px 0 8px 0' }}>{r2.quizScore || 0} / 100</div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            EEE Fundamentals Assessment ({r2.correctAnswers || 0} / {r2.totalQuestions || 10} Correct Answers)
          </div>
        </div>
      </div>

      {/* Detailed EEE Skill Profile (8 Skills) */}
      <div className="card" style={{ padding: '28px', borderRadius: '16px', marginBottom: '28px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Brain size={22} style={{ color: '#f59e0b' }} />
          <span>EEE Skill Profile</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {Object.entries(skillProfile).map(([skillKey, scoreVal]) => (
            <div key={skillKey} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(23, 32, 54, 0.6)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                <span style={{ textTransform: 'capitalize' }}>{skillKey.replace(/([A-Z])/g, ' $1')}</span>
                <span style={{ color: '#fbbf24', fontWeight: '700' }}>{scoreVal}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${scoreVal}%`, height: '100%', background: 'linear-gradient(90deg, #f59e0b, #d97706)', transition: 'width 0.4s ease' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Improvement Areas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {/* Strengths */}
        <div className="card" style={{ padding: '24px', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.3)', background: 'rgba(16, 185, 129, 0.05)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#10b981', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={20} />
            <span>Your Stronger Areas</span>
          </h3>
          <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {strengths.map((str, idx) => (
              <li key={idx} style={{ fontSize: '15px', color: 'var(--text-main)', fontWeight: '600', textTransform: 'capitalize' }}>
                {str.replace(/([A-Z])/g, ' $1')}
              </li>
            ))}
          </ul>
        </div>

        {/* Improvement Areas */}
        <div className="card" style={{ padding: '24px', borderRadius: '16px', border: '1px solid rgba(245, 158, 11, 0.3)', background: 'rgba(245, 158, 11, 0.05)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#f59e0b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lightbulb size={20} />
            <span>Areas to Improve</span>
          </h3>
          <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {improvementAreas.map((imp, idx) => (
              <li key={idx} style={{ fontSize: '15px', color: 'var(--text-main)', fontWeight: '500', textTransform: 'capitalize' }}>
                {imp.replace(/([A-Z])/g, ' $1')}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Suggested Learning Actions */}
      <div className="card" style={{ padding: '28px', borderRadius: '16px', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BookOpen size={22} style={{ color: '#3b82f6' }} />
          <span>Suggested Learning Actions</span>
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {suggestions.map((sug, idx) => (
            <div key={idx} style={{ padding: '14px 18px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.08)', borderLeft: '4px solid #3b82f6', fontSize: '14px', lineHeight: '1.5', color: 'var(--text-main)' }}>
              <strong>{idx + 1}.</strong> {sug}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center' }}>
        <button
          onClick={() => navigate('/student/12th-guidance')}
          className="btn btn-primary"
          style={{ padding: '12px 24px', fontWeight: '700', borderRadius: '10px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none' }}
        >
          Explore EEE & Recommendations
        </button>

        <button
          onClick={() => navigate('/student/performance')}
          className="btn btn-outline"
          style={{ padding: '12px 24px', fontWeight: '600', borderRadius: '10px' }}
        >
          View Skill Gaps
        </button>

        <button
          onClick={() => navigate('/student/recommendations')}
          className="btn btn-outline"
          style={{ padding: '12px 24px', fontWeight: '600', borderRadius: '10px' }}
        >
          View Learning Roadmap
        </button>

        <button
          onClick={() => navigate('/engineering-exploration/eee/assessment')}
          className="btn btn-outline"
          style={{ padding: '12px 24px', fontWeight: '600', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <RotateCcw size={16} />
          <span>Retake Assessment</span>
        </button>

        <button
          onClick={() => navigate('/engineering-exploration')}
          className="btn btn-outline"
          style={{ padding: '12px 24px', fontWeight: '600', borderRadius: '10px' }}
        >
          Return to Engineering Exploration
        </button>
      </div>
    </div>
  );
};

export default EEEResult;
