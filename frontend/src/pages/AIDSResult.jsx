import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { aidsAPI, pilotValidationAPI } from '../services/api';
import { BrainCircuit, Award, RotateCcw, CheckCircle2, BookOpen, Lightbulb, TrendingUp, ShieldAlert, Sparkles } from 'lucide-react';

const AIDSResult = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [weights, setWeights] = useState({ game_weight: 0.75, written_test_weight: 0.25 });

  useEffect(() => {
    fetchResult();
  }, [user]);

  const fetchResult = async () => {
    setLoading(true);
    try {
      const studentId = user?.id || 'student-demo-1';
      const [resResult, resWeights] = await Promise.all([
        aidsAPI.getResult(studentId),
        pilotValidationAPI.getWeights().catch(() => ({ data: { currentWeights: { game_weight: 0.75, written_test_weight: 0.25 } } }))
      ]);
      setResult(resResult.data);
      if (resWeights.data?.currentWeights) {
        setWeights(resWeights.data.currentWeights);
      }
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
        <h3 style={{ color: '#0f172a' }}>Computing Final AIDS Exploration Report...</h3>
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
  const levelResults = r1.levelResults || [];

  const gameWeightPct = Math.round((weights.game_weight || 0.75) * 100);
  const writtenWeightPct = Math.round((weights.written_test_weight || 0.25) * 100);

  // Filter out internal technical/legacy keys if needed, keeping student-friendly skills
  const studentSkillsList = [
    { key: 'logicalThinking', label: 'Logical Thinking' },
    { key: 'problemSolving', label: 'Problem Solving' },
    { key: 'patternRecognition', label: 'Pattern Recognition' },
    { key: 'decisionMaking', label: 'Decision Making' },
    { key: 'planning', label: 'Planning & Foresight' },
    { key: 'constraintReasoning', label: 'Constraint Reasoning' },
    { key: 'algorithmicThinking', label: 'Algorithmic Thinking' },
    { key: 'computationalThinking', label: 'Computational Thinking' },
    { key: 'spatialReasoning', label: 'Spatial Reasoning' },
  ];

  return (
    <div className="page-container" style={{ maxWidth: '1040px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
        border: '1.5px solid rgba(139, 92, 246, 0.4)',
        padding: '32px',
        borderRadius: '20px',
        marginBottom: '28px',
        color: 'white',
        boxShadow: '0 12px 36px rgba(30, 27, 75, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)'
          }}>
            <Award size={32} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#c4b5fd', letterSpacing: '0.06em' }}>
              FINAL AIDS EXPLORATION REPORT
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '2px 0 0 0', color: 'white' }}>
              Artificial Intelligence & Data Science Skill Profile
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
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          border: '1px solid rgba(196, 181, 253, 0.25)',
          marginTop: '20px'
        }}>
          <div>
            <div style={{ fontSize: '13px', color: '#e0e7ff', fontWeight: '600', marginBottom: '4px' }}>
              FINAL MATCH SCORE ({gameWeightPct}% GAME + {writtenWeightPct}% WRITTEN TEST)
            </div>
            <div style={{ fontSize: '34px', fontWeight: '800', color: 'white', display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span>Exploration Match:</span>
              <span style={{ color: '#a7f3d0' }}>
                {score}%
              </span>
            </div>
          </div>

          <div style={{
            padding: '12px 22px',
            borderRadius: '12px',
            background: score >= 60 ? 'rgba(16, 185, 129, 0.25)' : 'rgba(139, 92, 246, 0.25)',
            border: score >= 60 ? '1.5px solid #10b981' : '1.5px solid #a78bfa',
            color: score >= 60 ? '#6ee7b7' : '#ddd6fe',
            fontWeight: '800',
            fontSize: '15px'
          }}>
            Alignment Band: {band}
          </div>
        </div>

        <div style={{
          marginTop: '20px',
          fontSize: '15px',
          lineHeight: '1.6',
          color: '#e0e7ff',
          padding: '16px 20px',
          background: 'rgba(255, 255, 255, 0.06)',
          borderRadius: '12px',
          borderLeft: '4px solid #a78bfa'
        }}>
          "Your assessment performance reveals an active profile across logical thinking, problem decomposition, and pattern recognition suitable for exploratory AI & Data Science studies."
        </div>
      </div>

      {/* Round 1 vs Round 2 Score Summaries */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        <div style={{
          background: '#ffffff',
          padding: '24px',
          borderRadius: '16px',
          border: '1.5px solid #e2e8f0',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)'
        }}>
          <div style={{ fontSize: '12px', fontWeight: '800', color: '#7c3aed', textTransform: 'uppercase' }}>
            ROUND 1 — 5 SKILL GAMES ({gameWeightPct}%)
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: '4px 0 8px 0' }}>
            {r1.gameScore || 0} / 100
          </div>
          <div style={{ fontSize: '13px', color: '#64748b' }}>
            Interactive Game Performance (Accuracy: {Math.round((r1.accuracy || 0) * 100)}%, Total Time: {r1.totalTime || 0}s)
          </div>
        </div>

        <div style={{
          background: '#ffffff',
          padding: '24px',
          borderRadius: '16px',
          border: '1.5px solid #e2e8f0',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)'
        }}>
          <div style={{ fontSize: '12px', fontWeight: '800', color: '#059669', textTransform: 'uppercase' }}>
            ROUND 2 — TECHNICAL QUIZ ({writtenWeightPct}%)
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: '4px 0 8px 0' }}>
            {r2.quizScore || 0} / 100
          </div>
          <div style={{ fontSize: '13px', color: '#64748b' }}>
            AI & Data Science Quiz ({r2.correctAnswers || 0} / {r2.totalQuestions || 10} Correct Questions)
          </div>
        </div>
      </div>

      {/* 5-Game Individual Summary */}
      {levelResults.length > 0 && (
        <div style={{
          background: '#ffffff',
          padding: '24px',
          borderRadius: '16px',
          border: '1.5px solid #e2e8f0',
          marginBottom: '28px',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>
            Interactive Game Breakdown
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
            {levelResults.map((lvl) => (
              <div key={lvl.levelId} style={{
                background: '#f8fafc',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>
                  {lvl.levelName}
                </div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#7c3aed' }}>
                  {lvl.score} / 100
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                  Moves: {lvl.attempts || 1} • {lvl.timeTaken || 0}s
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Cognitive Skill Indicators (8 Skills) */}
      <div style={{
        background: '#ffffff',
        padding: '28px',
        borderRadius: '16px',
        border: '1.5px solid #e2e8f0',
        marginBottom: '28px',
        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#0f172a' }}>
          <BrainCircuit size={22} style={{ color: '#7c3aed' }} />
          <span>Exploratory Skill Indicators</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {studentSkillsList.map(({ key, label }) => {
            const scoreVal = skillProfile[key] || 0;
            return (
              <div key={key} style={{ padding: '16px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700', marginBottom: '8px' }}>
                  <span style={{ color: '#1e293b' }}>{label}</span>
                  <span style={{ color: '#7c3aed' }}>{scoreVal}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${scoreVal}%`, height: '100%', background: 'linear-gradient(90deg, #7c3aed, #a855f7)', transition: 'width 0.4s ease' }} />
                </div>
              </div>
            );
          })}
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
          marginTop: '24px',
          color: '#92400e',
          fontSize: '13px',
          lineHeight: '1.5'
        }}>
          <ShieldAlert size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Notice for Students & Parents:</strong> These exploratory skill indicators are provided to encourage curiosity, logical reasoning, and strategic thinking. They must <strong>NOT</strong> be presented as psychological diagnoses or guarantees of suitability for Artificial Intelligence and Data Science.
          </div>
        </div>
      </div>

      {/* Strengths & Improvement Areas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {/* Strengths */}
        <div style={{ padding: '24px', borderRadius: '16px', border: '1.5px solid #a7f3d0', background: '#ecfdf5' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#065f46', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={20} />
            <span>Demonstrated Strengths</span>
          </h3>
          <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {strengths.map((str, idx) => (
              <li key={idx} style={{ fontSize: '14px', color: '#065f46', fontWeight: '700', textTransform: 'capitalize' }}>
                {str.replace(/([A-Z])/g, ' $1')}
              </li>
            ))}
          </ul>
        </div>

        {/* Improvement Areas */}
        <div style={{ padding: '24px', borderRadius: '16px', border: '1.5px solid #ddd6fe', background: '#f5f3ff' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#5b21b6', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lightbulb size={20} />
            <span>Opportunities for Growth</span>
          </h3>
          <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {improvementAreas.map((imp, idx) => (
              <li key={idx} style={{ fontSize: '14px', color: '#5b21b6', fontWeight: '600', textTransform: 'capitalize' }}>
                {imp.replace(/([A-Z])/g, ' $1')}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Suggested Learning Actions */}
      <div style={{
        background: '#ffffff',
        padding: '28px',
        borderRadius: '16px',
        border: '1.5px solid #e2e8f0',
        marginBottom: '32px',
        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', color: '#0f172a' }}>
          <BookOpen size={22} style={{ color: '#7c3aed' }} />
          <span>Personalized Exploratory Learning Actions</span>
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {suggestions.map((sug, idx) => (
            <div key={idx} style={{ padding: '14px 18px', borderRadius: '10px', background: '#f8fafc', borderLeft: '4px solid #7c3aed', fontSize: '14px', lineHeight: '1.5', color: '#1e293b' }}>
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
          style={{ padding: '12px 24px', fontWeight: '700', borderRadius: '10px', background: 'linear-gradient(135deg, #7c3aed, #6366f1)', border: 'none' }}
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
