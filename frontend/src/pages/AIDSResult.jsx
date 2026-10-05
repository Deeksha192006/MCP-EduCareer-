import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { aidsAPI } from '../services/api';
import { BrainCircuit, Award, RotateCcw, CheckCircle2, BookOpen, Lightbulb, TrendingUp } from 'lucide-react';

const AIDSResult = ({ user }) => {
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
      const res = await aidsAPI.getResult(studentId);
      setResult(res.data);
    } catch (err) {
      console.error("Failed to load AIDS result:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div className="spin-icon" style={{ fontSize: '32px', marginBottom: '16px' }}>🤖</div>
        <h3>Computing Final AIDS Exploration Report...</h3>
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
        border: '1px solid rgba(139, 92, 246, 0.4)',
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
            background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)'
          }}>
            <Award size={28} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#a78bfa', letterSpacing: '0.05em' }}>
              FINAL AIDS EXPLORATION REPORT
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0 }}>
              AI & Data Science Skill Profile
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
          background: 'rgba(139, 92, 246, 0.12)',
          borderRadius: '14px',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          marginTop: '20px'
        }}>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '4px' }}>
              AIDS EXPLORATION SCORE (ROUND 1 60% + ROUND 2 40%)
            </div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: 'white', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span>AIDS Compatibility:</span>
              <span style={{
                background: 'linear-gradient(90deg, #c4b5fd, #8b5cf6)',
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
            background: score >= 60 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(139, 92, 246, 0.15)',
            border: score >= 60 ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(139, 92, 246, 0.4)',
            color: score >= 60 ? '#10b981' : '#c4b5fd',
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
          borderLeft: '4px solid #8b5cf6'
        }}>
          "Your assessment performance shows alignment with several skills associated with Artificial Intelligence and Data Science."
        </div>
      </div>

      {/* Round 1 vs Round 2 Score Summaries */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        <div className="card" style={{ padding: '24px', borderRadius: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#a78bfa' }}>ROUND 1 — SKILL GAME (60%)</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'white', margin: '4px 0 8px 0' }}>{r1.gameScore || 0} / 100</div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Data Detective Challenge (Accuracy: {Math.round((r1.accuracy || 0) * 100)}%, Time: {r1.totalTime || 0}s)
          </div>
        </div>

        <div className="card" style={{ padding: '24px', borderRadius: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#10b981' }}>ROUND 2 — TECHNICAL QUIZ (40%)</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'white', margin: '4px 0 8px 0' }}>{r2.quizScore || 0} / 100</div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            AI & Data Science Quiz ({r2.correctAnswers || 0} / {r2.totalQuestions || 10} Correct Answers)
          </div>
        </div>
      </div>

      {/* Detailed Data & AI Skill Profile (8 Skills) */}
      <div className="card" style={{ padding: '28px', borderRadius: '16px', marginBottom: '28px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BrainCircuit size={22} style={{ color: '#8b5cf6' }} />
          <span>Data & AI Skill Profile</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {Object.entries(skillProfile).map(([skillKey, scoreVal]) => (
            <div key={skillKey} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(23, 32, 54, 0.6)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                <span style={{ textTransform: 'capitalize' }}>{skillKey.replace(/([A-Z])/g, ' $1')}</span>
                <span style={{ color: '#c4b5fd', fontWeight: '700' }}>{scoreVal}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${scoreVal}%`, height: '100%', background: 'linear-gradient(90deg, #8b5cf6, #6366f1)', transition: 'width 0.4s ease' }} />
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
        <div className="card" style={{ padding: '24px', borderRadius: '16px', border: '1px solid rgba(139, 92, 246, 0.3)', background: 'rgba(139, 92, 246, 0.05)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#a78bfa', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
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

      {/* Business Analytics Insight Card */}
      <div className="card" style={{ padding: '24px', borderRadius: '16px', marginBottom: '28px', border: '1px solid rgba(59, 130, 246, 0.3)', background: 'rgba(59, 130, 246, 0.06)' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#60a5fa', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={20} />
          <span>Business Analytics Insight</span>
        </h3>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-main)', margin: 0 }}>
          Your performance in data interpretation and anomaly detection demonstrates a strong foundation for business analytics tasks, predictive modeling, and strategic data decision-making.
        </p>
      </div>

      {/* Suggested Learning Actions */}
      <div className="card" style={{ padding: '28px', borderRadius: '16px', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BookOpen size={22} style={{ color: '#8b5cf6' }} />
          <span>Suggested Learning Actions</span>
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {suggestions.map((sug, idx) => (
            <div key={idx} style={{ padding: '14px 18px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.08)', borderLeft: '4px solid #8b5cf6', fontSize: '14px', lineHeight: '1.5', color: 'var(--text-main)' }}>
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
          style={{ padding: '12px 24px', fontWeight: '700', borderRadius: '10px', background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', border: 'none' }}
        >
          Explore AIDS & Recommendations
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
          onClick={() => navigate('/engineering-exploration/aids/assessment')}
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

export default AIDSResult;
