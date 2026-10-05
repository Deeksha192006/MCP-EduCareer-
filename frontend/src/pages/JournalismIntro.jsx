import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Newspaper, 
  ArrowRight, 
  Play, 
  ShieldCheck, 
  Search, 
  Mic, 
  FileText, 
  Sparkles,
  Award
} from 'lucide-react';

const JournalismIntro = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Hero Header */}
      <div 
        className="banner-header" 
        style={{ 
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(120, 53, 15, 0.85), rgba(15, 23, 42, 0.95))',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '28px',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 0 24px rgba(245, 158, 11, 0.4)'
          }}>
            <Newspaper size={32} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#fcd34d', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Media, Arts & Communications Stream Exploration
            </span>
            <h1 style={{ fontSize: '30px', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
              BA Journalism & Mass Communication
            </h1>
          </div>
        </div>

        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '15px', maxWidth: '880px' }}>
          In an age of viral social media, generative AI, and breaking news cycles, truthful journalism is democracy's cornerstone. Media professionals uncover facts, hold public figures accountable, investigate deepfake dispatches, and inform millions under strict deadlines. Step into the role of Senior Editor in our <strong>Newsroom Challenge</strong> simulation.
        </p>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/journalism-assessment')}
            className="btn btn-primary"
            style={{
              padding: '12px 24px',
              fontSize: '15px',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
              color: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(245, 158, 11, 0.3)'
            }}
          >
            <Play size={18} />
            <span>Launch Newsroom Challenge</span>
            <ArrowRight size={18} />
          </button>
          
          <button
            onClick={() => navigate('/arts-science-exploration')}
            className="btn btn-secondary"
            style={{
              padding: '12px 20px',
              fontSize: '14px',
              borderRadius: '12px',
              cursor: 'pointer'
            }}
          >
            Back to Arts & Science Hub
          </button>
        </div>
      </div>

      {/* 4 Core Pillars of the Newsroom Simulation */}
      <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-bright)', marginBottom: '16px' }}>
        What You'll Experience in the Simulation
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div className="card" style={{ padding: '20px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', color: '#f59e0b' }}>
            <Search size={20} />
            <h4 style={{ fontSize: '15px', fontWeight: 700 }}>Source Triangulation</h4>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Verify viral social media claims against telemetry, field reporters, and verified official records before hitting broadcast.
          </p>
        </div>

        <div className="card" style={{ padding: '20px', borderLeft: '4px solid #ea580c' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', color: '#ea580c' }}>
            <Mic size={20} />
            <h4 style={{ fontSize: '15px', fontWeight: 700 }}>Accountability Inquiries</h4>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Ask sharp, evidence-anchored interview questions that avoid both hostile sensationalism and soft PR spin.
          </p>
        </div>

        <div className="card" style={{ padding: '20px', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', color: '#10b981' }}>
            <ShieldCheck size={20} />
            <h4 style={{ fontSize: '15px', fontWeight: 700 }}>Media Forensics & AI</h4>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Detect synthetic media, manipulated video cuts, and voice clones before reporting political controversies.
          </p>
        </div>

        <div className="card" style={{ padding: '20px', borderLeft: '4px solid #6366f1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', color: '#6366f1' }}>
            <FileText size={20} />
            <h4 style={{ fontSize: '15px', fontWeight: 700 }}>The Inverted Pyramid</h4>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Master fast, crisp news writing: Who, What, When, Where, Why in your opening lead under strict press deadlines.
          </p>
        </div>
      </div>

      {/* Ethical & Exploratory Notice Banner */}
      <div 
        style={{ 
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          borderRadius: '16px',
          padding: '18px 24px',
          display: 'flex',
          gap: '16px',
          alignItems: 'center'
        }}
      >
        <ShieldCheck size={28} color="#f59e0b" style={{ flexShrink: 0 }} />
        <div>
          <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#fcd34d', marginBottom: '4px' }}>
            Educational Simulation Notice
          </h5>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
            This simulation tests critical thinking, information literacy, and ethical judgment in simulated newsroom situations. It is an exploratory career orientation game, not a formal press accreditation or journalistic examination.
          </p>
        </div>
      </div>
    </div>
  );
};

export default JournalismIntro;
