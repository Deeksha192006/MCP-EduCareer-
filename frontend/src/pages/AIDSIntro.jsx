import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, ArrowRight, CheckCircle2, Brain, Play, ShieldAlert, Sparkles } from 'lucide-react';
import { pilotValidationAPI } from '../services/api';

const AIDS_GAMES_INFO = [
  { icon: '♛', name: "Queen's Safe Board", desc: 'Position queens safely without overlapping horizontal, vertical, or diagonal attack paths.' },
  { icon: '⭕', name: 'Smart Move Challenge', desc: 'Outsmart your opponent in a quick 3-in-a-row tactical grid challenge.' },
  { icon: '🐍', name: 'Smart Snake', desc: 'Guide the moving snake across dynamic obstacles and plan safe movement corridors.' },
  { icon: '💧', name: 'Water Target Challenge', desc: 'Fill, empty, and pour between two containers to measure exact target volumes.' },
  { icon: '🚣', name: 'Safe River Mission', desc: 'Guide travelers across the river safely adhering to group balance constraints.' },
];

const AIDS_SKILLS_LIST = [
  { label: 'Logical Thinking', desc: 'Deductive reasoning and multi-step conditional thinking' },
  { label: 'Problem Solving', desc: 'Formulating systematic paths and solutions to reach targets' },
  { label: 'Pattern Recognition', desc: 'Recognizing alignments, traps, and strategic lines' },
  { label: 'Decision Making', desc: 'Evaluating trade-offs and choosing optimal actions in real time' },
  { label: 'Planning & Foresight', desc: 'Anticipating future consequences and multi-step moves ahead' },
  { label: 'Constraint Reasoning', desc: 'Satisfying multiple simultaneous safety and boundary rules' },
  { label: 'Algorithmic Thinking', desc: 'Designing step-by-step sequential operations to reach goals' },
  { label: 'Computational Thinking', desc: 'Decomposing complex puzzles into simple, executable logic' },
  { label: 'Spatial Reasoning', desc: 'Navigating 2D boards and anticipating collisions' }
];

const AIDSIntro = ({ user }) => {
  const navigate = useNavigate();
  const [weights, setWeights] = useState({ game_weight: 0.75, written_test_weight: 0.25 });

  useEffect(() => {
    pilotValidationAPI.getWeights()
      .then(res => {
        if (res.data?.currentWeights) setWeights(res.data.currentWeights);
      })
      .catch(() => {});
  }, []);

  const gameWeightPct = Math.round((weights.game_weight || 0.75) * 100);
  const writtenWeightPct = Math.round((weights.written_test_weight || 0.25) * 100);

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
            <BrainCircuit size={32} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#c4b5fd', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              ENGINEERING EXPLORATION MODULE
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '2px 0 0 0', color: '#ffffff' }}>
              Artificial Intelligence and Data Science
            </h1>
          </div>
        </div>

        <p style={{
          color: '#ffffff',
          fontSize: '16px',
          fontWeight: '500',
          lineHeight: '1.6',
          marginBottom: '20px',
          padding: '16px 20px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          borderLeft: '4px solid #a78bfa'
        }}>
          "Explore your logical thinking, problem solving, and computational reasoning through interactive games designed for 10th and 12th standard students."
        </p>

        <p style={{ color: '#e0e7ff', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
          Artificial Intelligence and Data Science (AIDS) powers modern innovation—from predictive data intelligence to smart autonomous systems.
          This exploratory module evaluates your foundational computational thinking and logical aptitudes through 5 interactive games and a conceptual quiz.
        </p>
      </div>

      {/* 2-Round Structure Overview Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{
          padding: '24px',
          borderRadius: '16px',
          border: '1.5px solid #ddd6fe',
          background: '#ffffff',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)'
        }}>
          <div style={{ fontSize: '12px', fontWeight: '800', color: '#7c3aed', marginBottom: '4px' }}>
            ROUND 1 ({gameWeightPct}% WEIGHT)
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px', color: '#0f172a' }}>
            5 Interactive Skill Games
          </h3>
          <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.5', marginBottom: '14px' }}>
            Play through 5 engaging challenges: Queen's Safe Board, Smart Move Challenge, Smart Snake, Water Target Challenge, and Safe River Mission.
          </p>
          <span style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '12px', background: '#f5f3ff', color: '#7c3aed', fontWeight: '700', border: '1px solid #ddd6fe' }}>
            Interactive Game Evaluation
          </span>
        </div>

        <div style={{
          padding: '24px',
          borderRadius: '16px',
          border: '1.5px solid #a7f3d0',
          background: '#ffffff',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)'
        }}>
          <div style={{ fontSize: '12px', fontWeight: '800', color: '#059669', marginBottom: '4px' }}>
            ROUND 2 ({writtenWeightPct}% WEIGHT)
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px', color: '#0f172a' }}>
            AI & Data Science Technical Quiz
          </h3>
          <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.5', marginBottom: '14px' }}>
            10 student-friendly multiple-choice questions covering AI concepts, machine learning basics, data analysis, statistics, and visualization.
          </p>
          <span style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '12px', background: '#ecfdf5', color: '#059669', fontWeight: '700', border: '1px solid #a7f3d0' }}>
            Concept Understanding Quiz
          </span>
        </div>
      </div>

      {/* The 5 Games Highlight Section */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}>
          <Sparkles size={22} style={{ color: '#7c3aed' }} />
          <span>The 5 Interactive AIDS Games</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
          {AIDS_GAMES_INFO.map((g, idx) => (
            <div key={idx} style={{
              background: '#ffffff',
              padding: '18px 20px',
              borderRadius: '14px',
              border: '1.5px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{ fontSize: '22px' }}>{g.icon}</span>
                <strong style={{ fontSize: '15px', color: '#0f172a' }}>{g.name}</strong>
              </div>
              <p style={{ color: '#64748b', fontSize: '13px', lineHeight: '1.5', margin: 0 }}>
                {g.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Assessed Section */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}>
          <Brain size={22} style={{ color: '#7c3aed' }} />
          <span>Exploratory Skills Evaluated</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
          {AIDS_SKILLS_LIST.map((skill, idx) => (
            <div key={idx} style={{ padding: '18px', borderRadius: '12px', background: '#ffffff', border: '1.5px solid #e2e8f0', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <CheckCircle2 size={18} style={{ color: '#10b981' }} />
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: 0 }}>{skill.label}</h3>
              </div>
              <p style={{ color: '#64748b', fontSize: '13px', lineHeight: '1.5', margin: 0 }}>{skill.desc}</p>
            </div>
          ))}
        </div>

        {/* Notice */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          background: '#fffbeb',
          border: '1.5px solid #fde68a',
          padding: '16px 20px',
          borderRadius: '12px',
          marginTop: '20px',
          color: '#92400e',
          fontSize: '13px',
          lineHeight: '1.5'
        }}>
          <ShieldAlert size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Student & Parent Guidance:</strong> These computational skill indicators are exploratory reflections to assist high school students in discovering artificial intelligence fields. They must <strong>NOT</strong> be presented as psychological diagnoses or guarantees of career success.
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
        <button
          onClick={() => navigate('/engineering-exploration')}
          className="btn btn-outline"
          style={{ padding: '14px 28px', fontSize: '15px', borderRadius: '12px' }}
        >
          Back to Exploration Hub
        </button>

        <button
          onClick={() => navigate('/engineering-exploration/aids/assessment')}
          style={{
            padding: '14px 36px',
            fontSize: '16px',
            fontWeight: '700',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
            boxShadow: '0 6px 20px rgba(124, 58, 237, 0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            border: 'none',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          <Play size={20} fill="white" />
          <span>Start AIDS Assessment</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default AIDSIntro;
