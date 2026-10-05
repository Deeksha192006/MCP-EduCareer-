import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Leaf, 
  ArrowRight, 
  Play, 
  Wind, 
  Droplets, 
  Zap, 
  ShieldCheck, 
  Globe, 
  Sparkles,
  Award
} from 'lucide-react';

const EnvScienceIntro = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Hero Header */}
      <div 
        className="banner-header" 
        style={{ 
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(6, 78, 59, 0.9), rgba(15, 23, 42, 0.95))',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '28px',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #10b981, #06b6d4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 0 24px rgba(16, 185, 129, 0.4)'
          }}>
            <Leaf size={32} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Science & Sustainability Stream Exploration
            </span>
            <h1 style={{ fontSize: '30px', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
              B.Sc. Environmental Science
            </h1>
          </div>
        </div>

        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '15px', maxWidth: '880px' }}>
          Climate change, urban heat, water scarcity, and ecosystem collapse are the defining global challenges of the 21st century. Environmental scientists design nature-based solutions, renewable energy microgrids, sponge cities, and circular waste economies. Assume town governance in our <strong>Eco Guardian</strong> simulation.
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '24px' }}>
          <button
            onClick={() => navigate('/arts-science-exploration/environmental-science/assessment')}
            className="btn btn-primary"
            style={{
              padding: '12px 28px',
              fontSize: '15px',
              fontWeight: 700,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            <Play size={18} />
            <span>Start Eco Guardian Challenge</span>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', color: '#10b981' }}>
            <Globe size={22} />
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#ffffff', margin: 0 }}>Ecological Systems Explored</h3>
          </div>
          <ul style={{ paddingLeft: '18px', color: 'var(--text-muted)', fontSize: '13.5px', lineHeight: '1.7', margin: 0 }}>
            <li>Clean energy transition and particulate PM2.5 smog abatement</li>
            <li>Sponge city percolation design and aquifer water table recharge</li>
            <li>Circular economy waste segregation vs methane landfill fires</li>
            <li>Constructed phytoremediation wetlands for industrial river cleanup</li>
            <li>Miyawaki micro-forests and urban heat island mitigation</li>
          </ul>
        </div>

        <div className="glass-card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', color: '#06b6d4' }}>
            <Award size={22} />
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#ffffff', margin: 0 }}>Evaluated Competencies</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { name: 'Scientific Reasoning', desc: 'Understanding biogeochemical cycles and ecological root causes' },
              { name: 'Sustainability Awareness', desc: 'Prioritizing regenerative nature-based systems over band-aids' },
              { name: 'Systems Thinking', desc: 'Anticipating how air, water, and soil policies cross-influence each other' },
              { name: 'Problem Solving', desc: 'Formulating high-impact bio-remediation interventions' },
              { name: 'Budget & Resource Balancing', desc: 'Achieving maximum ecological recovery within finite municipal capital' }
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
      <div className="glass-card" style={{ padding: '24px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', marginBottom: '14px' }}>
          Career Pathways in Environmental Science & Climate Action
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          {[
            { title: 'Environmental Consultant', desc: 'Conducts environmental impact assessments (EIA) and compliance audits for infrastructure projects.' },
            { title: 'Urban Sustainability Planner', desc: 'Designs sponge cities, renewable zoning, clean mobility corridors, and green municipal masterplans.' },
            { title: 'Ecological Restoration Specialist', desc: 'Rehabilitates degraded wetlands, mined landscapes, river basins, and native forests.' },
            { title: 'Climate & Carbon Policy Analyst', desc: 'Models carbon footprint reduction, greenhouse emissions reporting, and clean energy incentives.' }
          ].map((role, idx) => (
            <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 700, color: '#10b981', fontSize: '14px', marginBottom: '4px' }}>{role.title}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>{role.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnvScienceIntro;
