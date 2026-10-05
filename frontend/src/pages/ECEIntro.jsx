import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio, ArrowRight, ShieldAlert, CheckCircle2, Brain, Play, Layers, HelpCircle } from 'lucide-react';

const ECE_SKILLS_LIST = [
  { label: 'Logical Thinking', desc: 'Deductive analysis and problem decomposition' },
  { label: 'Circuit Reasoning', desc: 'Understanding component behavior and voltage/current loops' },
  { label: 'Pattern Recognition', desc: 'Spotting structural anomalies and waveform trends' },
  { label: 'Problem Solving', desc: 'Diagnosing faults and fixing hardware/logic errors' },
  { label: 'Signal Understanding', desc: 'Analysing analog vs digital signal flows and modulation' },
  { label: 'Technical Knowledge', desc: 'Foundational 12th-standard electronics and physics concepts' }
];

const ECEIntro = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="page-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px' }}>
      {/* Top Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 27, 75, 0.95))',
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
            <Radio size={28} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#67e8f9', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              ENGINEERING EXPLORATION MODULE
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '2px 0 0 0', color: '#ffffff' }}>
              Electronics & Communication Engineering
            </h1>
          </div>
        </div>

        <p style={{
          color: '#ffffff',
          fontSize: '17px',
          fontWeight: '500',
          lineHeight: '1.6',
          marginBottom: '20px',
          padding: '16px 20px',
          background: 'rgba(6, 182, 212, 0.18)',
          borderRadius: '10px',
          borderLeft: '4px solid #06b6d4'
        }}>
          "Explore your electronics, circuit reasoning, signal understanding and problem-solving abilities through an interactive assessment."
        </p>

        <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
          Electronics & Communication Engineering (ECE) combines hardware design, signal transmission, microcontrollers, and digital logic.
          This exploratory module evaluates your analytical abilities and foundational knowledge through two interactive rounds.
        </p>
      </div>

      {/* 2-Round Structure Overview Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="card" style={{ padding: '24px', borderRadius: '16px', border: '1.5px solid #bfdbfe', background: '#ffffff', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#2563eb', marginBottom: '4px' }}>ROUND 1</div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: '#0f172a' }}>Circuit Builder Challenge</h3>
          <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.5', marginBottom: '12px' }}>
            Interactive 5-level skill game evaluating circuit loops, fault detection, component selection, and signal paths.
          </p>
          <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '12px', background: '#eff6ff', color: '#2563eb', fontWeight: '600', border: '1px solid #bfdbfe' }}>
            Weight: 60% of Score
          </span>
        </div>

        <div className="card" style={{ padding: '24px', borderRadius: '16px', border: '1.5px solid #ddd6fe', background: '#ffffff', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#7c3aed', marginBottom: '4px' }}>ROUND 2</div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: '#0f172a' }}>ECE Technical Knowledge Quiz</h3>
          <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.5', marginBottom: '12px' }}>
            10 multiple-choice questions covering basic electronics, digital logic gates, circuits, and signals.
          </p>
          <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '12px', background: '#f5f3ff', color: '#7c3aed', fontWeight: '600', border: '1px solid #ddd6fe' }}>
            Weight: 40% of Score
          </span>
        </div>
      </div>

      {/* Skills Being Assessed Section */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}>
          <Brain size={22} style={{ color: '#06b6d4' }} />
          <span>Skills Assessed in ECE Module</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {ECE_SKILLS_LIST.map((skill, idx) => (
            <div key={idx} className="card" style={{ padding: '20px', borderRadius: '12px', background: '#ffffff', border: '1.5px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <CheckCircle2 size={18} style={{ color: '#10b981' }} />
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0 }}>{skill.label}</h3>
              </div>
              <p style={{ color: '#475569', fontSize: '13px', lineHeight: '1.5', margin: 0 }}>{skill.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
        <button
          onClick={() => navigate('/engineering-exploration')}
          className="btn btn-outline"
          style={{ padding: '14px 28px', fontSize: '15px', borderRadius: '10px' }}
        >
          Back to Exploration Hub
        </button>

        <button
          onClick={() => navigate('/engineering-exploration/ece/assessment')}
          className="btn btn-primary"
          style={{
            padding: '14px 36px',
            fontSize: '16px',
            fontWeight: '700',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <Play size={20} fill="white" />
          <span>Start ECE Assessment</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default ECEIntro;
