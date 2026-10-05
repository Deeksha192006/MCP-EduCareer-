import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Cpu, 
  Palette, 
  Coins, 
  Sparkles, 
  ArrowRight, 
  Gamepad2, 
  FileText, 
  ShieldCheck, 
  Award, 
  TrendingUp, 
  Layers, 
  CheckCircle2, 
  Users, 
  Compass, 
  BrainCircuit,
  BarChart3
} from 'lucide-react';

const LandingPage = ({ user }) => {
  const navigate = useNavigate();

  const streams = [
    {
      id: 'engineering',
      title: 'Engineering & Technology',
      subtitle: 'CSE, AI & Data Science, ECE, EEE, Mechanical',
      desc: 'Test your problem-solving, circuit design, logic patterns, power grid balancing, and mechanical physics through interactive engineering simulations.',
      icon: Cpu,
      color: '#1e40af',
      badgeBg: '#eff6ff',
      badgeColor: '#1e40af',
      badgeText: '5 Engineering Hubs',
      path: '/engineering-exploration',
      skills: ['Algorithmic Logic', 'Circuit Design', 'Spatial Mechanics', 'System Architecture']
    },
    {
      id: 'arts-science',
      title: 'Arts & Science',
      subtitle: 'Data Science, Psychology, BBA, Environmental, Journalism',
      desc: 'Solve data mysteries, analyze cognitive behaviors, manage startup budgets, protect wetland habitats, and verify breaking journalistic news.',
      icon: Palette,
      color: '#6d28d9',
      badgeBg: '#faf5ff',
      badgeColor: '#6d28d9',
      badgeText: '5 Specialized Domains',
      path: '/arts-science-exploration',
      skills: ['Data Detective', 'Behavioral Empathy', 'Resource Allocation', 'Investigative Fact-Checking']
    },
    {
      id: 'commerce',
      title: 'Commerce & Accounting',
      subtitle: 'Accounting & Finance, Banking, Taxation, CS, BBA',
      desc: 'Step into junior accountant, bank underwriter, and tax auditor roles. Post double-entry journals, detect invoice anomalies, and scale virtual startups.',
      icon: Coins,
      color: '#0f766e',
      badgeBg: '#f0fdfa',
      badgeColor: '#0f766e',
      badgeText: '5 Financial Arcades',
      path: '/commerce-exploration',
      skills: ['Double-Entry Journals', 'Credit & Risk Analysis', 'GST Calculation', 'Corporate Governance']
    }
  ];

  const highlights = [
    {
      title: 'Finance Master',
      stream: 'Commerce & Accounting',
      desc: 'Post real double-entry journal records, balance ledgers, and catch trial balance suspense anomalies.',
      icon: Coins,
      color: '#0f766e'
    },
    {
      title: 'Data Detective',
      stream: 'Arts & Science',
      desc: 'Inspect interactive datasets, detect regression anomalies, and uncover data patterns.',
      icon: BrainCircuit,
      color: '#6d28d9'
    },
    {
      title: 'Circuit Lab & Power Grid',
      stream: 'Engineering',
      desc: 'Wire up logic gates, test load balancing across regional grids, and solve hardware puzzles.',
      icon: Cpu,
      color: '#1e40af'
    }
  ];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', color: 'var(--text-main)', paddingBottom: '40px' }}>
      
      {/* Top Navigation Bar */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '32px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="brand-logo" style={{ width: '40px', height: '40px' }}>
            <GraduationCap size={22} />
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: 'var(--text-main)' }}>
              EduCareer AI
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', fontWeight: 500 }}>
              Career Guidance Platform
            </div>
          </div>
        </div>

        <nav style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button 
            onClick={() => navigate('/engineering-exploration')} 
            className="btn btn-outline" 
            style={{ fontSize: '13px', padding: '8px 14px' }}
          >
            Engineering
          </button>
          <button 
            onClick={() => navigate('/arts-science-exploration')} 
            className="btn btn-outline" 
            style={{ fontSize: '13px', padding: '8px 14px' }}
          >
            Arts & Science
          </button>
          <button 
            onClick={() => navigate('/commerce-exploration')} 
            className="btn btn-outline" 
            style={{ fontSize: '13px', padding: '8px 14px' }}
          >
            Commerce
          </button>
          
          <button 
            onClick={() => navigate(user ? '/student/dashboard' : '/login')} 
            className="btn btn-primary" 
            style={{ fontSize: '13px', padding: '8px 18px' }}
          >
            {user ? 'My Dashboard' : 'Sign In'}
            <ArrowRight size={14} />
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 60%, #e0f2fe 100%)',
        border: '1px solid var(--border-blue)',
        borderRadius: 'var(--radius-lg)',
        padding: '48px 40px',
        marginBottom: '40px',
        boxShadow: 'var(--shadow-sm)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '840px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--primary-light)',
            border: '1px solid var(--primary-border)',
            padding: '6px 14px',
            borderRadius: '9999px',
            fontSize: '13px',
            fontWeight: 700,
            color: 'var(--primary)',
            marginBottom: '16px'
          }}>
            <Sparkles size={16} />
            <span>Data-Driven Career Guidance for 12th Standard Students</span>
          </div>

          <h1 style={{
            fontSize: '38px',
            fontWeight: 800,
            color: 'var(--text-main)',
            letterSpacing: '-0.03em',
            lineHeight: 1.2,
            marginBottom: '16px'
          }}>
            Discover Your True College Degree & Career Through Hands-On Simulation
          </h1>

          <p style={{
            fontSize: '17px',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            marginBottom: '28px'
          }}>
            Make confident, data-backed career decisions. Experience day-in-the-life interactive simulation games 
            (<strong>75% weight</strong>) combined with conceptual written assessments (<strong>25% weight</strong>) 
            to uncover your optimal degree compatibility.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => navigate(user ? '/student/dashboard' : '/login')} 
              className="btn btn-primary" 
              style={{ padding: '12px 24px', fontSize: '15px' }}
            >
              <span>Launch Student Dashboard</span>
              <ArrowRight size={18} />
            </button>

            <button 
              onClick={() => navigate('/student/12th-guidance')} 
              className="btn btn-outline" 
              style={{ padding: '12px 24px', fontSize: '15px' }}
            >
              <Compass size={18} />
              <span>12th Cutoff & Career Pathfinder</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '20px',
          marginTop: '40px',
          paddingTop: '28px',
          borderTop: '1px solid rgba(191, 219, 254, 0.6)'
        }}>
          <div>
            <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--primary)', fontFamily: 'Outfit, sans-serif' }}>
              3
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
              Core Academic Streams
            </div>
          </div>
          <div>
            <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--secondary)', fontFamily: 'Outfit, sans-serif' }}>
              15
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
              Career Degree Courses
            </div>
          </div>
          <div>
            <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--accent)', fontFamily: 'Outfit, sans-serif' }}>
              15
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
              Interactive Simulation Games
            </div>
          </div>
          <div>
            <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--accent-purple)', fontFamily: 'Outfit, sans-serif' }}>
              75 : 25
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
              Game : Written Formula
            </div>
          </div>
        </div>
      </section>

      {/* Stream Selection Section */}
      <section style={{ marginBottom: '48px' }}>
        <div style={{ marginBottom: '24px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Academic Streams
          </span>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
            Explore Degree Streams & Career Arcades
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Select your 12th standard domain to begin hands-on aptitude games and comprehensive written assessments.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          {streams.map((stream) => {
            const IconComp = stream.icon;
            return (
              <div 
                key={stream.id} 
                className="card" 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  borderTop: `4px solid ${stream.color}` 
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: stream.badgeBg,
                      border: `1px solid ${stream.color}30`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: stream.color
                    }}>
                      <IconComp size={24} />
                    </div>
                    <span style={{
                      background: stream.badgeBg,
                      color: stream.badgeColor,
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      border: `1px solid ${stream.color}25`
                    }}>
                      {stream.badgeText}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                    {stream.title}
                  </h3>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--secondary)', marginBottom: '10px' }}>
                    {stream.subtitle}
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '16px' }}>
                    {stream.desc}
                  </p>

                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Competencies Evaluated
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {stream.skills.map((skill, sIdx) => (
                        <span 
                          key={sIdx}
                          style={{
                            background: '#f8fafc',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-muted)',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 600
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => navigate(stream.path)} 
                  className="btn btn-outline" 
                  style={{ width: '100%', justifyContent: 'space-between', padding: '12px 18px', fontWeight: 700 }}
                >
                  <span>Explore {stream.title}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* How The Career Guidance System Works */}
      <section style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '36px',
        marginBottom: '48px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 36px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Proven Methodology
          </span>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
            How The Career Guidance System Works
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginTop: '6px' }}>
            A transparent, dual-assessment pipeline designed to give students clear insights without guesswork or bias.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          <div style={{ padding: '20px', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '14px' }}>
              1
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
              Simulation Games (75%)
            </h4>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Complete 5 progressive simulation challenges modeling real-world day-in-the-life industry tasks.
            </p>
          </div>

          <div style={{ padding: '20px', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#f0fdf4', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '14px' }}>
              2
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
              Written Exams (25%)
            </h4>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Take a 10-question conceptual multiple-choice test evaluating subject fundamentals and logic.
            </p>
          </div>

          <div style={{ padding: '20px', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#faf5ff', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '14px' }}>
              3
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
              Composite Recommendation
            </h4>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              The system calculates Final Match Score = (Game × 0.75) + (Written × 0.25) per course with complete isolation.
            </p>
          </div>

          <div style={{ padding: '20px', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#fffbeb', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '14px' }}>
              4
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
              Actionable Skill Roadmap
            </h4>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Receive strengths, areas for improvement, college cutoff analysis, and a 6-month pre-college curriculum plan.
            </p>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section style={{ marginBottom: '48px' }}>
        <div style={{ marginBottom: '24px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Interactive Highlights
          </span>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
            Featured Hands-On Aptitude Arcades
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {highlights.map((h, i) => {
            const IconComp = h.icon;
            return (
              <div key={i} className="card" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: `${h.color}15`,
                  color: h.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <IconComp size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: h.color, textTransform: 'uppercase' }}>
                    {h.stream}
                  </div>
                  <h4 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px', marginBottom: '6px' }}>
                    {h.title}
                  </h4>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    {h.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Professional Footer */}
      <footer style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '32px 36px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div className="brand-logo" style={{ width: '32px', height: '32px' }}>
              <GraduationCap size={18} />
            </div>
            <span style={{ fontSize: '16px', fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: 'var(--text-main)' }}>
              EduCareer AI
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-dim)', maxWidth: '540px' }}>
            Academic exploratory guidance platform for school students. Evaluates demonstrated interest and aptitude through interactive simulation and conceptual assessments.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', fontSize: '14px', fontWeight: 600 }}>
          <button onClick={() => navigate('/student/dashboard')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}>
            Student Portal
          </button>
          <span style={{ color: 'var(--border-strong)' }}>•</span>
          <button onClick={() => navigate('/teacher/dashboard')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            Teacher / Counsellor
          </button>
          <span style={{ color: 'var(--border-strong)' }}>•</span>
          <button onClick={() => navigate('/admin/dashboard')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            Admin Portal
          </button>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
