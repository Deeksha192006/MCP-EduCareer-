import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, ArrowRight, ShieldAlert, CheckCircle2, Brain, Play, Layers } from 'lucide-react';

const EEE_SKILLS_LIST = [
  { label: 'Electrical Reasoning', desc: 'Understanding voltage, current, power relationships and electrical principles' },
  { label: 'Circuit Thinking', desc: 'Analyzing closed circuit loops, switches, and load connections' },
  { label: 'Logical Thinking', desc: 'Deductive reasoning and multi-stage electrical flow path selection' },
  { label: 'Problem Solving', desc: 'Diagnosing electrical system faults and broken circuit connections' },
  { label: 'Energy Management', desc: 'Allocating limited power budgets and managing appliance priority loads' },
  { label: 'Numerical Reasoning', desc: 'Basic mathematical calculations of wattage, voltage, and energy budgets' },
  { label: 'Decision Making', desc: 'Selecting optimal component trade-offs under power constraints' }
];

const EEEIntro = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="page-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px' }}>
      {/* Top Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 27, 75, 0.95))',
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
            <Zap size={28} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#fbbf24', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              ENGINEERING EXPLORATION MODULE
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '2px 0 0 0', color: '#ffffff' }}>
              Electrical and Electronics Engineering
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
          background: 'rgba(245, 158, 11, 0.18)',
          borderRadius: '10px',
          borderLeft: '4px solid #f59e0b'
        }}>
          "Explore your electrical reasoning, circuit understanding, energy management and problem-solving abilities through an interactive assessment."
        </p>

        <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
          Electrical and Electronics Engineering (EEE) focuses on power generation, electrical networks, control machinery, energy distribution, and electronic systems.
          This exploratory module measures your demonstrated analytical aptitudes through two progressive evaluation rounds.
        </p>
      </div>

      {/* 2-Round Structure Overview Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="card" style={{ padding: '24px', borderRadius: '16px', border: '1.5px solid #fde68a', background: '#ffffff', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#d97706', marginBottom: '4px' }}>ROUND 1</div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: '#0f172a' }}>Smart Power Distribution Challenge</h3>
          <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.5', marginBottom: '12px' }}>
            Interactive 5-level skill game evaluating circuit loops, power distribution, fault detection, energy optimization, and flow puzzles.
          </p>
          <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '12px', background: '#fffbeb', color: '#d97706', fontWeight: '600', border: '1px solid #fde68a' }}>
            Weight: 60% of Score
          </span>
        </div>

        <div className="card" style={{ padding: '24px', borderRadius: '16px', border: '1.5px solid #a7f3d0', background: '#ffffff', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#059669', marginBottom: '4px' }}>ROUND 2</div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: '#0f172a' }}>EEE Fundamentals Assessment</h3>
          <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.5', marginBottom: '12px' }}>
            10 multiple-choice questions covering basic electrical concepts, circuits, electronics, digital logic, and electrical machines.
          </p>
          <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '12px', background: '#ecfdf5', color: '#059669', fontWeight: '600', border: '1px solid #a7f3d0' }}>
            Weight: 40% of Score
          </span>
        </div>
      </div>

      {/* Skills Assessed Section */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}>
          <Brain size={22} style={{ color: '#f59e0b' }} />
          <span>Skills Assessed in EEE Module</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {EEE_SKILLS_LIST.map((skill, idx) => (
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
          onClick={() => navigate('/engineering-exploration/eee/assessment')}
          className="btn btn-primary"
          style={{
            padding: '14px 36px',
            fontSize: '16px',
            fontWeight: '700',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            border: 'none',
            color: 'white'
          }}
        >
          <Play size={20} fill="white" />
          <span>Start EEE Assessment</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default EEEIntro;
