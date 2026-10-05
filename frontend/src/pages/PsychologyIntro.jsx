import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HeartHandshake, 
  ArrowRight, 
  Play, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  Brain, 
  Info,
  CheckCircle2,
  Compass
} from 'lucide-react';

const PsychologyIntro = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Hero Header */}
      <div 
        className="banner-header" 
        style={{ 
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(76, 29, 65, 0.9), rgba(15, 23, 42, 0.95))',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '28px',
          border: '1px solid rgba(236, 72, 153, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 0 24px rgba(236, 72, 153, 0.4)'
          }}>
            <HeartHandshake size={32} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#f472b6', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Arts & Science Stream Exploration
            </span>
            <h1 style={{ fontSize: '30px', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
              B.Sc. Psychology & Behavioral Science
            </h1>
          </div>
        </div>

        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '15px', maxWidth: '880px' }}>
          Human decisions, emotions, cognitive biases, and social interactions shape every organization, school, and community. Discover the scientific and interpersonal dimensions of psychology through our <strong>Mind Explorer</strong> situational simulation.
        </p>

        {/* Ethical Notice Banner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(236, 72, 153, 0.1)', padding: '14px 20px', borderRadius: '12px', border: '1px solid rgba(236, 72, 153, 0.3)', marginTop: '20px', maxWidth: '780px' }}>
          <Info size={22} color="#ec4899" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '13px', color: '#fbcfe8', lineHeight: '1.5' }}>
            <strong>Important Guardrail:</strong> This simulation is an exploratory learning exercise in social perspective-taking. It does <em>not</em> claim to diagnose students, evaluate personal mental health, or administer clinical psychometric testing.
          </span>
        </div>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '24px' }}>
          <button
            onClick={() => navigate('/arts-science-exploration/psychology/assessment')}
            className="btn btn-primary"
            style={{
              padding: '12px 28px',
              fontSize: '15px',
              fontWeight: 700,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            <Play size={18} />
            <span>Start Mind Explorer Challenge</span>
            <ArrowRight size={18} />
          </button>
          <button
            onClick={() => navigate('/arts-science-exploration')}
            className="btn btn-outline"
            style={{ padding: '12px 20px', borderRadius: '10px' }}
          >
            Back to Arts & Science Hub
          </button>
        </div>
      </div>

      {/* Grid of Course Pillars & Evaluated Skills */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        <div className="glass-card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', color: '#ec4899' }}>
            <Brain size={22} />
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#ffffff', margin: 0 }}>What You'll Explore</h3>
          </div>
          <ul style={{ paddingLeft: '18px', color: 'var(--text-muted)', fontSize: '13.5px', lineHeight: '1.7', margin: 0 }}>
            <li>Active listening and de-escalating acute interpersonal distress</li>
            <li>Conformity pressure, pluralistic ignorance, and groupthink dynamics</li>
            <li>Physiological grounding and cognitive reframing in exam anxiety</li>
            <li>Attribution biases in interpreting non-verbal and cultural signals</li>
            <li>Restorative justice, structured mediation, and collaborative problem-solving</li>
          </ul>
        </div>

        <div className="glass-card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', color: '#38bdf8' }}>
            <Users size={22} />
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#ffffff', margin: 0 }}>Evaluated Social Reasoning</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { name: 'Empathy-Oriented Reasoning', desc: 'Validating affective states and emotional needs prior to logistics' },
              { name: 'Social Perception', desc: 'Identifying peer conformity dynamics and group influences' },
              { name: 'Critical Thinking', desc: 'Distinguishing situational stressors from character dispositions' },
              { name: 'Observation Skills', desc: 'Sensing physiological and non-verbal cues in stressful contexts' },
              { name: 'Conflict Resolution', desc: 'Synthesizing conflicting needs into win-win co-leadership' }
            ].map((sk, idx) => (
              <div key={idx} style={{ fontSize: '12.5px' }}>
                <span style={{ fontWeight: 700, color: '#e0e7ff' }}>{sk.name}: </span>
                <span style={{ color: 'var(--text-muted)' }}>{sk.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Target Careers Showcase */}
      <div className="glass-card" style={{ padding: '24px', border: '1px solid rgba(236, 72, 153, 0.25)' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', marginBottom: '14px' }}>
          Real-World Career Pathways in Behavioral Science
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          {[
            { title: 'Organizational Counselor', desc: 'Helps enterprise teams optimize communication, well-being, and workplace morale.' },
            { title: 'Behavioral Researcher', desc: 'Designs empirical studies to investigate consumer habits, habit formation, and decisions.' },
            { title: 'HR & Talent Consultant', desc: 'Aligns hiring, mediation, team dynamics, and leadership coaching.' },
            { title: 'Child Guidance Counselor', desc: 'Supports youth development, academic stress management, and emotional resilience.' }
          ].map((role, idx) => (
            <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 700, color: '#ec4899', fontSize: '14px', marginBottom: '4px' }}>{role.title}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>{role.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PsychologyIntro;
