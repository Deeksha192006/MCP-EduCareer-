import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, ArrowRight, ShieldAlert, CheckCircle2, Brain, Play, HelpCircle, Lightbulb, Compass, Award } from 'lucide-react';
import { CSE_SKILLS_DEFINITION } from '../data/cseGamesRegistry';

const CSEIntro = ({ user }) => {
  const navigate = useNavigate();

  const handleStartAssessment = () => {
    navigate('/engineering-exploration/cse/assessment');
  };

  return (
    <div className="page-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px' }}>
      {/* Header Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 27, 75, 0.95))',
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
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Cpu size={28} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#a5b4fc', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              ENGINEERING EXPLORATION MODULE
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '2px 0 0 0', color: '#ffffff' }}>
              Computer Science Engineering
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
          background: 'rgba(99, 102, 241, 0.2)',
          borderRadius: '10px',
          borderLeft: '4px solid #818cf8'
        }}>
          "Test your logical thinking, problem-solving, pattern recognition and programming ability through interactive challenges."
        </p>

        <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
          Computer Science Engineering goes beyond simply writing code. It evaluates how you break down complex logic,
          discover hidden patterns, optimize algorithmic efficiency, and make structured decisions under constraints.
        </p>
      </div>

      {/* Skills Being Assessed Section */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}>
          <Brain size={20} style={{ color: 'var(--primary)' }} />
          <span>Core Competencies Assessed</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {CSE_SKILLS_DEFINITION.map((skill) => (
            <div
              key={skill.id}
              className="card"
              style={{
                padding: '20px',
                borderRadius: '12px',
                background: '#ffffff',
                border: '1.5px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <CheckCircle2 size={18} style={{ color: '#10b981' }} />
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                  {skill.label}
                </h3>
              </div>
              <p style={{ color: '#475569', fontSize: '13px', lineHeight: '1.5', margin: 0 }}>
                {skill.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Before Starting Guidance & Rules */}
      <div className="card" style={{
        padding: '24px',
        borderRadius: '16px',
        background: '#fffbeb',
        border: '1.5px solid #fde68a',
        marginBottom: '32px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: '#b45309' }}>
          <ShieldAlert size={22} />
          <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0, color: '#b45309' }}>
            Important Guidelines Before Starting
          </h3>
        </div>

        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '14px', color: '#1e293b', lineHeight: '1.6' }}>
            <span style={{ minWidth: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', marginTop: '7px' }}></span>
            <span><strong style={{ color: '#0f172a' }}>Multiple Interactive Games:</strong> You will play a series of problem-solving games measuring different logic dimensions.</span>
          </li>
          <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '14px', color: '#1e293b', lineHeight: '1.6' }}>
            <span style={{ minWidth: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', marginTop: '7px' }}></span>
            <span><strong style={{ color: '#0f172a' }}>Performance & Speed Metrics:</strong> Scores are calculated dynamically based on correctness, solution efficiency, and response time.</span>
          </li>
          <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '14px', color: '#1e293b', lineHeight: '1.6' }}>
            <span style={{ minWidth: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', marginTop: '7px' }}></span>
            <span><strong style={{ color: '#0f172a' }}>Exploratory Compatibility Score:</strong> The output is an exploratory suitability index to aid self-discovery, <em>NOT an absolute prediction or guaranteed career decision</em>.</span>
          </li>
          <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '14px', color: '#1e293b', lineHeight: '1.6' }}>
            <span style={{ minWidth: '8px', height: '8px', borderRadius: '50%', background: '#10b981', marginTop: '7px' }}></span>
            <span><strong style={{ color: '#0f172a' }}>Holistic Evaluation:</strong> Use your result alongside academic marks, personal passion, and counsellor guidance.</span>
          </li>
        </ul>
      </div>

      {/* Action CTA */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
        <button
          onClick={() => navigate('/engineering-exploration')}
          className="btn btn-outline"
          style={{ padding: '14px 28px', fontSize: '15px', borderRadius: '10px' }}
        >
          Back to Hub
        </button>

        <button
          onClick={handleStartAssessment}
          className="btn btn-primary"
          style={{
            padding: '14px 36px',
            fontSize: '16px',
            fontWeight: '700',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            boxShadow: 'var(--shadow-glow)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <Play size={20} fill="white" />
          <span>Start CSE Assessment</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default CSEIntro;
