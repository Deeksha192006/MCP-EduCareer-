import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eceAPI } from '../services/api';
import { Radio, Award, ShieldAlert, RotateCcw, ArrowRight, CheckCircle2, BarChart2, Compass, Layers, BookOpen, Lightbulb, Sparkles, BrainCircuit } from 'lucide-react';

const ECEResult = ({ user }) => {
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
      const res = await eceAPI.getResult(studentId);
      setResult(res.data);
    } catch (err) {
      console.error("Failed to load ECE result:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div className="spin-icon" style={{ fontSize: '32px', marginBottom: '16px' }}>⚡</div>
        <h3>Computing Final ECE Exploration Report...</h3>
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
        border: '1px solid rgba(6, 182, 212, 0.4)',
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
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)'
          }}>
            <Award size={28} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#06b6d4', letterSpacing: '0.05em' }}>
              FINAL ECE EXPLORATION REPORT
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0 }}>
              Electronics & Communication Skill Profile
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
          background: 'rgba(6, 182, 212, 0.12)',
          borderRadius: '14px',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          marginTop: '20px'
        }}>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '4px' }}>
              ECE EXPLORATION SCORE (ROUND 1 60% + ROUND 2 40%)
            </div>
            <div style={{ fontSize: '36px', fontWeight: '800', color: 'white', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span>ECE Compatibility:</span>
              <span style={{
                background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
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
          borderLeft: '4px solid #06b6d4'
        }}>
          "Your assessment performance shows alignment with several skills commonly used in Electronics and Communication Engineering."
        </div>
      </div>

      {/* Round 1 vs Round 2 Score Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        <div className="card" style={{ padding: '24px', borderRadius: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary)' }}>ROUND 1 — SKILL GAME (60%)</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'white', margin: '4px 0 8px 0' }}>{r1.gameScore || 0} / 100</div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Circuit Builder Challenge (Accuracy: {Math.round((r1.accuracy || 0) * 100)}%, Time: {r1.totalTime || 0}s)
          </div>
        </div>

        <div className="card" style={{ padding: '24px', borderRadius: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--secondary)' }}>ROUND 2 — TECHNICAL QUIZ (40%)</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'white', margin: '4px 0 8px 0' }}>{r2.quizScore || 0} / 100</div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            ECE Technical Assessment ({r2.correctAnswers || 0} / {r2.totalQuestions || 10} Correct MCQs)
          </div>
        </div>
      </div>

      {/* ECE Skill Profile Breakdown */}
      <div className="card" style={{ padding: '28px', borderRadius: '16px', marginBottom: '28px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart2 size={22} style={{ color: '#06b6d4' }} />
          <span>ECE Skill Profile Breakdown</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
          {[
            { id: 'circuitReasoning', label: 'Circuit Reasoning', desc: 'Understanding component loops, voltage drops & currents' },
            { id: 'logicalThinking', label: 'Logical Thinking', desc: 'Deductive fault identification & truth table reasoning' },
            { id: 'problemSolving', label: 'Problem Solving', desc: 'Solving hardware anomalies & optimal route selection' },
            { id: 'decisionMaking', label: 'Decision Making', desc: 'Trade-off analysis between battery series/parallel capacities' },
            { id: 'signalUnderstanding', label: 'Signal Understanding', desc: 'Analog vs digital signal paths & modulation basics' },
            { id: 'technicalKnowledge', label: 'Technical Knowledge', desc: 'Derived directly from 10-question ECE Technical MCQ Quiz' }
          ].map(skill => {
            const val = Math.round(skillProfile[skill.id] || 0);

            return (
              <div key={skill.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div>
                    <span style={{ fontSize: '15px', fontWeight: '600', color: 'white' }}>{skill.label}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '10px' }}>({skill.desc})</span>
                  </div>
                  <span style={{ fontSize: '16px', fontWeight: '700', color: '#06b6d4' }}>{val}%</span>
                </div>
                <div style={{ height: '10px', width: '100%', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${val}%`,
                    background: val >= 75 ? 'linear-gradient(90deg, #06b6d4, #10b981)' : val >= 50 ? 'linear-gradient(90deg, #06b6d4, #8b5cf6)' : 'linear-gradient(90deg, #f59e0b, #ef4444)',
                    borderRadius: '6px',
                    transition: 'width 0.8s ease'
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strengths & Improvement Areas Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        <div className="card" style={{ padding: '24px', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#10b981', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} />
            <span>Your Stronger Areas</span>
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {strengths.map((str, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'white' }}>
                <CheckCircle2 size={16} style={{ color: '#10b981' }} />
                <span style={{ textTransform: 'capitalize' }}>{str.replace(/([A-Z])/g, ' $1')}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card" style={{ padding: '24px', borderRadius: '16px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#f59e0b', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lightbulb size={20} />
            <span>Suggested Learning Focus</span>
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {suggestions.map((sug, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: 'var(--text-main)', lineHeight: '1.5' }}>
                <span style={{ minWidth: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b', marginTop: '6px' }} />
                <span>{sug}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Explore Before You Decide Box */}
      <div className="card" style={{
        padding: '24px',
        borderRadius: '16px',
        background: 'rgba(30, 41, 69, 0.4)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        marginBottom: '32px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f59e0b', marginBottom: '12px' }}>
          <ShieldAlert size={20} />
          <h4 style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>Explore Before You Decide</h4>
        </div>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>
          Your result is based on your performance in this assessment. Consider your 12th academic performance, personal interests, long-term career goals, and guidance from teachers/counsellors before choosing an engineering department.
        </p>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
        <button
          onClick={() => navigate('/engineering-exploration')}
          className="btn btn-outline"
          style={{ padding: '12px 24px', borderRadius: '10px' }}
        >
          Return to Engineering Exploration
        </button>

        <button
          onClick={() => navigate('/student/performance')}
          className="btn btn-outline"
          style={{ padding: '12px 24px', borderRadius: '10px' }}
        >
          View Skill Gaps
        </button>

        <button
          onClick={() => navigate('/student/recommendations')}
          className="btn btn-primary"
          style={{ padding: '12px 28px', borderRadius: '10px', fontWeight: '600' }}
        >
          <Compass size={18} />
          <span>View Overall Stream Guidance</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default ECEResult;
