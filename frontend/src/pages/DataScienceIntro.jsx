import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LineChart, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Play, 
  Database, 
  Layers, 
  Award, 
  ShieldCheck,
  Cpu,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';

const DataScienceIntro = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Hero Header */}
      <div 
        className="banner-header" 
        style={{ 
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(8, 47, 73, 0.9), rgba(15, 23, 42, 0.95))',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '28px',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 0 24px rgba(56, 189, 248, 0.4)'
          }}>
            <Database size={32} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#7dd3fc', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Arts & Science Stream Exploration
            </span>
            <h1 style={{ fontSize: '30px', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
              B.Sc. Data Science & Analytics
            </h1>
          </div>
        </div>

        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '15px', maxWidth: '880px' }}>
          Data is the lifeblood of modern society. From sports analytics and cancer research to fraud detection and recommendation engines, data scientists transform raw numbers into game-changing decisions. Discover whether this path aligns with your mind in our <strong>Data Detective</strong> challenge.
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '24px' }}>
          <button
            onClick={() => navigate('/arts-science-exploration/data-science/assessment')}
            className="btn btn-primary"
            style={{
              padding: '12px 28px',
              fontSize: '15px',
              fontWeight: 700,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            <Play size={18} />
            <span>Start Data Detective Challenge</span>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', color: '#38bdf8' }}>
            <TrendingUp size={22} />
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#ffffff', margin: 0 }}>What You'll Explore</h3>
          </div>
          <ul style={{ paddingLeft: '18px', color: 'var(--text-muted)', fontSize: '13.5px', lineHeight: '1.7', margin: 0 }}>
            <li>Accelerating non-linear sequence modeling</li>
            <li>Outlier and anomaly isolation in distributed cloud clusters</li>
            <li>Debunking spurious correlations vs genuine causation</li>
            <li>Missing data imputation using matrix constraints</li>
            <li>Security telemetry anomaly forensics and threat diagnosis</li>
          </ul>
        </div>

        <div className="glass-card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', color: '#8b5cf6' }}>
            <BrainCircuit size={22} />
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#ffffff', margin: 0 }}>Evaluated Aptitudes</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { name: 'Analytical Thinking', desc: 'Dissecting complex multi-variable scenarios into evidence-backed deductions' },
              { name: 'Data Interpretation', desc: 'Reading patterns, matrices, and charts under uncertainty' },
              { name: 'Logical Reasoning', desc: 'Identifying logical fallacies and causal dependencies' },
              { name: 'Numerical Skills', desc: 'Matrix arithmetic and second-order delta deductions' },
              { name: 'Hypothesis Testing', desc: 'Formulating empirical diagnoses based on telemetry logs' }
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
      <div className="glass-card" style={{ padding: '24px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', marginBottom: '14px' }}>
          Typical Career Pathways in Data Science
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          {[
            { title: 'Data Scientist', desc: 'Builds predictive models, algorithms, and automated machine intelligence systems.' },
            { title: 'Business Intelligence Analyst', desc: 'Translates complex enterprise databases into visual dashboards for executives.' },
            { title: 'Machine Learning Associate', desc: 'Fine-tunes neural models, features, and algorithmic training pipelines.' },
            { title: 'Data Engineer', desc: 'Architects robust cloud data warehouses, pipelines, and streaming infrastructure.' }
          ].map((role, idx) => (
            <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 700, color: '#38bdf8', fontSize: '14px', marginBottom: '4px' }}>{role.title}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>{role.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataScienceIntro;
