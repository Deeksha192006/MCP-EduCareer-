import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cseAPI } from '../services/api';
import { CSE_SKILLS_DEFINITION } from '../data/cseGamesRegistry';
import { Cpu, Award, ShieldAlert, RotateCcw, ArrowRight, CheckCircle2, BarChart2, Compass, Layers } from 'lucide-react';

const CSEResult = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [assessment, setAssessment] = useState(null);

  useEffect(() => {
    fetchResult();
  }, [user]);

  const fetchResult = async () => {
    setLoading(true);
    try {
      const studentId = user?.id || 'student-demo-1';
      const res = await cseAPI.getAssessment(studentId);
      setAssessment(res.data);
    } catch (err) {
      console.error('Failed to load CSE assessment result:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div className="spin-icon" style={{ fontSize: '32px', marginBottom: '16px' }}>⚡</div>
        <h3>Computing CSE Skill Profile...</h3>
      </div>
    );
  }

  const skillScores = assessment?.skillScores || {
    logicalThinking: 0,
    problemSolving: 0,
    patternRecognition: 0,
    algorithmicThinking: 0,
    programmingLogic: 0,
    decisionMaking: 0
  };

  const compatibilityScore = assessment?.cseCompatibilityScore || 0;

  return (
    <div className="page-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px' }}>
      {/* Top Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(30, 41, 69, 0.95))',
        border: '1px solid rgba(99, 102, 241, 0.4)',
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
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Award size={28} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.05em' }}>
              ENGINEERING EXPLORATION REPORT
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0 }}>
              CSE Skill Profile & Exploration Score
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
          background: 'rgba(99, 102, 241, 0.12)',
          borderRadius: '14px',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          marginTop: '20px'
        }}>
          <div>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '4px' }}>
              CSE EXPLORATION SCORE
            </div>
            <div style={{ fontSize: '36px', fontWeight: '800', color: 'white', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span>CSE Compatibility:</span>
              <span style={{
                background: 'linear-gradient(90deg, #818cf8, #c084fc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {compatibilityScore}%
              </span>
            </div>
          </div>

          <div style={{
            padding: '12px 20px',
            borderRadius: '10px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#10b981',
            fontWeight: '600',
            fontSize: '14px'
          }}>
            Status: Assessment Completed
          </div>
        </div>

        {/* Neutral Exploratory Statement */}
        <div style={{
          marginTop: '20px',
          fontSize: '15px',
          lineHeight: '1.6',
          color: 'var(--text-main)',
          padding: '16px',
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: '10px',
          borderLeft: '4px solid var(--primary)'
        }}>
          "Your performance shows a strong alignment with the skills assessed for Computer Science Engineering."
        </div>
      </div>

      {/* CSE Skill Profile Breakdown */}
      <div className="card" style={{ padding: '28px', borderRadius: '16px', marginBottom: '28px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart2 size={22} style={{ color: 'var(--primary)' }} />
          <span>CSE Skill Profile Breakdown</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
          {CSE_SKILLS_DEFINITION.map((skill) => {
            const scoreVal = Math.round(skillScores[skill.id] || 0);

            return (
              <div key={skill.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div>
                    <span style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-main)' }}>
                      {skill.label}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '10px' }}>
                      ({skill.description})
                    </span>
                  </div>
                  <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--primary)' }}>
                    {scoreVal}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div style={{
                  height: '10px',
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '6px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${scoreVal}%`,
                    background: scoreVal > 75 
                      ? 'linear-gradient(90deg, #6366f1, #10b981)' 
                      : scoreVal > 40 
                      ? 'linear-gradient(90deg, #6366f1, #8b5cf6)' 
                      : 'linear-gradient(90deg, #f59e0b, #ef4444)',
                    borderRadius: '6px',
                    transition: 'width 0.8s ease-in-out'
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Game Attempts Summary Table */}
      <div className="card" style={{ padding: '28px', borderRadius: '16px', marginBottom: '28px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={20} style={{ color: 'var(--secondary)' }} />
          <span>Game Performance Summary</span>
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 8px' }}>Game Name</th>
                <th style={{ padding: '12px 8px' }}>Skill Tested</th>
                <th style={{ padding: '12px 8px' }}>Score</th>
                <th style={{ padding: '12px 8px' }}>Accuracy</th>
                <th style={{ padding: '12px 8px' }}>Time</th>
                <th style={{ padding: '12px 8px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {(assessment?.gamePerformance || []).map((g) => (
                <tr key={g.gameId} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px 8px', fontWeight: '600' }}>{g.gameName}</td>
                  <td style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>{g.skillTested}</td>
                  <td style={{ padding: '12px 8px', fontWeight: '700', color: 'var(--primary)' }}>{g.score} / 100</td>
                  <td style={{ padding: '12px 8px' }}>{Math.round((g.accuracy || 0) * 100)}%</td>
                  <td style={{ padding: '12px 8px' }}>{g.timeTaken}s</td>
                  <td style={{ padding: '12px 8px' }}>
                    <span style={{
                      fontSize: '11px',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      background: g.completed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                      color: g.completed ? '#10b981' : 'var(--text-muted)'
                    }}>
                      {g.completed ? 'Completed' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Disclaimers Card */}
      <div className="card" style={{
        padding: '24px',
        borderRadius: '16px',
        background: 'rgba(30, 41, 69, 0.4)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        marginBottom: '32px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f59e0b', marginBottom: '12px' }}>
          <ShieldAlert size={20} />
          <h4 style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>Exploratory Assessment Disclaimer</h4>
        </div>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>
          This score reflects your performance across interactive problem-solving games and provides an exploratory indication of your compatibility with Computer Science Engineering core skills.
          It is <strong>NOT a definitive prediction or guarantee</strong> that you should or must choose CSE. Combine these insights with your 12th standard academic scores, personal passions, and guidance counsellor discussions.
        </p>
      </div>

      {/* Navigation Footer */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
        <button
          onClick={() => navigate('/engineering-exploration/cse/assessment')}
          className="btn btn-outline"
          style={{ padding: '12px 24px', borderRadius: '10px' }}
        >
          <RotateCcw size={18} />
          <span>Retake CSE Assessment</span>
        </button>

        <button
          onClick={() => navigate('/engineering-exploration')}
          className="btn btn-outline"
          style={{ padding: '12px 24px', borderRadius: '10px' }}
        >
          <span>Back to Engineering Exploration Hub</span>
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

export default CSEResult;
