import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  ArrowRight, 
  Play, 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  ShieldCheck, 
  Users, 
  Award,
  Zap
} from 'lucide-react';

const BBAIntro = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Hero Header */}
      <div 
        className="banner-header" 
        style={{ 
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(69, 26, 3, 0.9), rgba(15, 23, 42, 0.95))',
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
            <Briefcase size={32} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#fcd34d', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Management & Commerce Stream Exploration
            </span>
            <h1 style={{ fontSize: '30px', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
              BBA — Bachelor of Business Administration
            </h1>
          </div>
        </div>

        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '15px', maxWidth: '880px' }}>
          Business leadership is not about memorizing textbook definitions; it is the high-stakes art of allocating finite capital, pricing for maximum margin, scaling customer acquisition, and out-strategizing market competition. Experience enterprise management in our <strong>Startup Simulator</strong>.
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '24px' }}>
          <button
            onClick={() => navigate('/arts-science-exploration/bba/assessment')}
            className="btn btn-primary"
            style={{
              padding: '12px 28px',
              fontSize: '15px',
              fontWeight: 700,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            <Play size={18} />
            <span>Start Startup Simulator</span>
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

      {/* Grid of Simulation Pillars & Evaluated Skills */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        <div className="glass-card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', color: '#f59e0b' }}>
            <TrendingUp size={22} />
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#ffffff', margin: 0 }}>Executive Decisions Tested</h3>
          </div>
          <ul style={{ paddingLeft: '18px', color: 'var(--text-muted)', fontSize: '13.5px', lineHeight: '1.7', margin: 0 }}>
            <li>Business model selection (SaaS vs D2C hardware vs marketplace)</li>
            <li>Pricing elasticity and unit economics optimization</li>
            <li>Growth marketing channels and customer acquisition cost (CAC)</li>
            <li>Hiring talent vs preserving cash runway</li>
            <li>Crisis response to venture-backed aggressive competition</li>
          </ul>
        </div>

        <div className="glass-card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', color: '#38bdf8' }}>
            <Award size={22} />
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#ffffff', margin: 0 }}>Evaluated Competencies</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { name: 'Business Reasoning', desc: 'Synthesizing operational trade-offs and market dynamics' },
              { name: 'Resource Management', desc: 'Balancing treasury burn rate with growth speed' },
              { name: 'Strategic Thinking', desc: 'Creating defensible moats against commoditization' },
              { name: 'Decision Making Under Risk', desc: 'Navigating uncertainty without freezing operations' },
              { name: 'Financial Acumen', desc: 'Understanding recurring revenue, gross margins, and LTV' }
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
      <div className="glass-card" style={{ padding: '24px', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', marginBottom: '14px' }}>
          Career Pathways in Business & Management
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          {[
            { title: 'Startup Founder / CEO', desc: 'Directs company vision, product-market fit, capital fundraising, and corporate strategy.' },
            { title: 'Product Manager', desc: 'Orchestrates engineering, design, and commercial teams to deliver market-winning software.' },
            { title: 'Operations Strategy Consultant', desc: 'Optimizes supply chain, unit economics, and operational efficiency for enterprises.' },
            { title: 'Growth Marketing Director', desc: 'Builds viral distribution channels, performance ad engines, and customer brand loyalty.' }
          ].map((role, idx) => (
            <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 700, color: '#f59e0b', fontSize: '14px', marginBottom: '4px' }}>{role.title}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>{role.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BBAIntro;
