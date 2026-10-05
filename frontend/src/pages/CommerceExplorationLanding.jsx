import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  Coins, 
  Building2, 
  Receipt, 
  FileText, 
  TrendingUp,
  CheckCircle2,
  ShieldCheck,
  Award,
  BookOpen
} from 'lucide-react';
import WrittenAssessmentModal from '../components/written/WrittenAssessmentModal';

const CommerceExplorationLanding = ({ user }) => {
  const navigate = useNavigate();
  const [writtenModalCourse, setWrittenModalCourse] = useState(null);

  const studentId = user?.id || 'student-demo-1';

  const courses = [
    {
      id: 'bcom-accfinance',
      key: 'bcom-accfinance',
      code: 'B.Com. Accounting and Finance',
      title: 'Finance Master',
      description: 'Act as a corporate accountant. Master double-entry classification, formulate journal entries, balance ledgers, and audit trial balances.',
      icon: Coins,
      active: true,
      path: '/commerce-exploration/finance-master',
      color: '#0f766e',
      skills: ['Numerical Reasoning', 'Accounting Knowledge', 'Accuracy', 'Logical Reasoning', 'Attention to Detail'],
      gamesCount: '5 Accountancy Levels',
      badge: '💰 Accounting & Audit',
      writtenTestTitle: 'B.Com Accounting & Finance Written Exam'
    },
    {
      id: 'bcom-bankins',
      key: 'bcom-bankins',
      code: 'B.Com. Banking and Insurance',
      title: 'Banking Quest',
      description: 'Step into retail banking operations. Resolve customer accounts, assess credit loan risks, evaluate insurance policies, and combat fraudulent transactions.',
      icon: Building2,
      active: true,
      path: '/commerce-exploration/banking-quest',
      color: '#0284c7',
      skills: ['Financial Literacy', 'Numerical Reasoning', 'Customer Problem-Solving', 'Decision-Making', 'Risk Awareness'],
      gamesCount: '5 Banking Quests',
      badge: '🏦 Banking & Risk',
      writtenTestTitle: 'B.Com Banking & Insurance Written Exam'
    },
    {
      id: 'bcom-tax',
      key: 'bcom-tax',
      code: 'B.Com. Taxation',
      title: 'Tax Detective',
      description: 'Operate as a junior tax forensic investigator. Classify direct and indirect taxes, calculate GST slabs, uncover fraudulent invoice flaws, and reconcile tax returns.',
      icon: Receipt,
      active: true,
      path: '/commerce-exploration/tax-detective',
      color: '#b45309',
      skills: ['Numerical Accuracy', 'Attention to Detail', 'Rule-Based Reasoning', 'Analytical Thinking', 'Tax Concepts'],
      gamesCount: '5 Tax Investigations',
      badge: '🔍 Tax & GST Forensics',
      writtenTestTitle: 'B.Com Taxation Written Exam'
    },
    {
      id: 'bcom-corpsec',
      key: 'bcom-corpsec',
      code: 'B.Com. Corporate Secretaryship',
      title: 'Corporate Decision Challenge',
      description: 'Lead company governance as an assistant company secretary. Structure board meetings, audit legal statutory documents, and resolve boardroom crises.',
      icon: FileText,
      active: true,
      path: '/commerce-exploration/corporate-decision',
      color: '#6d28d9',
      skills: ['Attention to Detail', 'Organizational Thinking', 'Ethical Reasoning', 'Communication', 'Decision-Making'],
      gamesCount: '5 Governance Levels',
      badge: '🏛️ Corporate Law & CS',
      writtenTestTitle: 'B.Com Corporate Secretaryship Written Exam'
    },
    {
      id: 'bba-tycoon',
      key: 'bba-tycoon',
      code: 'BBA',
      title: 'Business Tycoon',
      description: 'Build, fund, and scale a lean startup over 5 rounds! Select high-potential niches, manage cash runways, optimize marketing ROI, and adapt to supply disruptions.',
      icon: TrendingUp,
      active: true,
      path: '/commerce-exploration/business-tycoon',
      color: '#1e40af',
      skills: ['Strategic Thinking', 'Business Reasoning', 'Resource Management', 'Creativity', 'Decision-Making'],
      gamesCount: '5 Startup Rounds',
      badge: '🚀 Venture Management',
      writtenTestTitle: 'BBA Business Tycoon Written Exam'
    }
  ];

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* Hero Header */}
      <div className="banner-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'var(--primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <Coins size={26} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Commerce & Accounting Career Stream
            </span>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
              Commerce, Banking & Management Arcade
            </h1>
          </div>
        </div>

        <p className="banner-subtitle">
          Discover your potential in financial leadership, corporate law, banking operations, taxation forensics, and enterprise venture management. Complete real-world interactive games and conceptual written assessments to discover your personalized <strong>75:25 Course Compatibility Match</strong>!
        </p>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-blue)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>
            <CheckCircle2 size={16} color="var(--success)" />
            <span>5 Interactive Real-World Simulation Games (75% Weight)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>
            <ShieldCheck size={16} color="var(--secondary)" />
            <span>Server-Graded Written Assessments (25% Weight)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>
            <Sparkles size={16} color="var(--warning)" />
            <span>Holistic 75:25 Course Match Scoring</span>
          </div>
        </div>
      </div>

      {/* Info Callout */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '16px', 
        marginBottom: '24px',
        padding: '14px 20px',
        borderRadius: 'var(--radius-md)',
        background: '#ffffff',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Award size={18} color="var(--primary)" />
          <span style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: 600 }}>
            Formula: <strong>Final Course Match Score = (Game Score × 0.75) + (Written Test Score × 0.25)</strong>
          </span>
        </div>
        <span style={{ fontSize: '13px', color: 'var(--text-dim)', fontWeight: 500 }}>
          Both components must be completed for course recommendation calculation
        </span>
      </div>

      {/* Course Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
        {courses.map((course) => {
          const IconComp = course.icon;
          return (
            <div
              key={course.id}
              className="course-card"
              style={{
                borderTop: `4px solid ${course.color}`
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: `${course.color}15`,
                    border: `1px solid ${course.color}35`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: course.color
                  }}>
                    <IconComp size={24} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      background: `${course.color}15`,
                      color: course.color,
                      border: `1px solid ${course.color}30`
                    }}>
                      {course.badge}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontWeight: 600 }}>
                      {course.gamesCount}
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: '13px', fontWeight: 700, color: course.color, textTransform: 'uppercase', marginBottom: '4px' }}>
                  {course.code}
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                  {course.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6, marginBottom: '18px' }}>
                  {course.description}
                </p>

                {course.skills && (
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Core Competencies Evaluated
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {course.skills.map((s, idx) => (
                        <span key={idx} style={{
                          fontSize: '12px',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          background: '#f8fafc',
                          color: 'var(--text-muted)',
                          border: '1px solid var(--border-color)',
                          fontWeight: 600
                        }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <button
                  onClick={() => navigate(course.path)}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '12px',
                    fontWeight: 700,
                    fontSize: '14px',
                    background: course.color,
                    border: 'none',
                    borderRadius: '10px'
                  }}
                >
                  <Play size={16} />
                  <span>Play {course.title} Game</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={() => setWrittenModalCourse(course.key)}
                  className="btn btn-outline"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '10px',
                    fontWeight: 600,
                    fontSize: '13px',
                    borderRadius: '10px'
                  }}
                >
                  <FileText size={16} style={{ color: course.color }} />
                  <span>Take Written Assessment</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Written Assessment Modal */}
      {writtenModalCourse && (
        <WrittenAssessmentModal
          courseKey={writtenModalCourse}
          studentId={studentId}
          onClose={() => setWrittenModalCourse(null)}
          onComplete={() => {
            setWrittenModalCourse(null);
            navigate('/student/recommendations');
          }}
        />
      )}
    </div>
  );
};

export default CommerceExplorationLanding;
