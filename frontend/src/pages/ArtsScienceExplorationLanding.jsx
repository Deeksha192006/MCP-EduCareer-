import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BrainCircuit, 
  HeartHandshake, 
  Briefcase, 
  TreePine, 
  Newspaper, 
  ArrowRight, 
  Sparkles, 
  Gamepad2, 
  CheckCircle2, 
  Play, 
  Trophy, 
  ShieldCheck,
  FileText
} from 'lucide-react';
import WrittenAssessmentModal from '../components/written/WrittenAssessmentModal';

const ArtsScienceExplorationLanding = ({ user }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('ALL');
  const [activeWrittenTestKey, setActiveWrittenTestKey] = useState(null);

  const studentId = user?.id || 'student-demo-1';

  const courses = [
    {
      id: 'data-science',
      key: 'data-science',
      code: 'B.Sc Data Science',
      title: 'Data Detective',
      description: 'Step into data mystery puzzles! Clean noisy survey data, spot statistical outliers, detect anomalies, and uncover business insights.',
      icon: BrainCircuit,
      active: true,
      path: '/arts-science-exploration/data-science',
      color: '#1e40af',
      skills: ['Analytical Thinking', 'Data Interpretation', 'Logical Reasoning', 'Pattern Recognition'],
      gamesCount: '5 Scenario Rounds',
      badge: '📈 High Demand',
      writtenTestTitle: 'B.Sc Data Science Written Exam'
    },
    {
      id: 'psychology',
      key: 'psychology',
      code: 'B.Sc Psychology',
      title: 'Mind Explorer',
      description: 'Navigate complex human behavior scenarios. Assess emotional reactions, active listening, and social communication choices.',
      icon: HeartHandshake,
      active: true,
      path: '/arts-science-exploration/psychology',
      color: '#6d28d9',
      skills: ['Empathy-Oriented Reasoning', 'Critical Observation', 'Active Listening', 'Social Communication'],
      gamesCount: '5 Scenario Dilemmas',
      badge: '🧠 Behavioral Science',
      writtenTestTitle: 'B.Sc Psychology Written Exam'
    },
    {
      id: 'bba',
      key: 'bba',
      code: 'BBA',
      title: 'Startup Simulator',
      description: 'Lead a virtual tech venture! Allocate seed capital, manage cash burn rate, launch marketing campaigns, and handle PR crises.',
      icon: Briefcase,
      active: true,
      path: '/arts-science-exploration/bba',
      color: '#0284c7',
      skills: ['Strategic Decision-Making', 'Resource Allocation', 'Risk Management', 'Crisis Resolution'],
      gamesCount: '5 Business Quarters',
      badge: '💼 Venture Leadership',
      writtenTestTitle: 'BBA Business Concepts Written Exam'
    },
    {
      id: 'environmental-science',
      key: 'environmental-science',
      code: 'B.Sc Environmental Science',
      title: 'Eco-Explorer',
      description: 'Act as an environmental officer. Investigate river pollution sources, balance town planning with ecology, and restore wetlands.',
      icon: TreePine,
      active: true,
      path: '/arts-science-exploration/environmental-science',
      color: '#0f766e',
      skills: ['Environmental Systems', 'Ecology Forensics', 'Sustainable Planning', 'Risk Mitigation'],
      gamesCount: '5 Conservation Levels',
      badge: '🌿 Climate & Sustainability',
      writtenTestTitle: 'B.Sc Env Science Written Exam'
    },
    {
      id: 'journalism',
      key: 'journalism',
      code: 'BA Journalism',
      title: 'Media Fact-Checker',
      description: 'Work in a fast-paced digital newsroom! Verify viral social media posts, verify cross-sources, spot deepfakes, and edit press releases.',
      icon: Newspaper,
      active: true,
      path: '/arts-science-exploration/journalism',
      color: '#b45309',
      skills: ['Fact-Checking', 'Source Verification', 'Media Ethics', 'Clear Communication'],
      gamesCount: '5 Editorial Missions',
      badge: '📰 Media & Press',
      writtenTestTitle: 'BA Journalism Written Exam'
    }
  ];

  const filteredCourses = courses.filter(c => {
    if (filter === 'ALL') return true;
    if (filter === 'SCIENCE' && (c.id === 'data-science' || c.id === 'environmental-science')) return true;
    if (filter === 'ARTS' && (c.id === 'psychology' || c.id === 'bba' || c.id === 'journalism')) return true;
    return false;
  });

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
            <Gamepad2 size={26} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Experiential Career Arcade for 12th Standard Students
            </span>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
              Arts & Science Career Exploration Hub
            </h1>
          </div>
        </div>

        <p className="banner-subtitle">
          Explore career-defining pathways outside traditional engineering. Experience what it’s like to be a Data Scientist, Psychologist, Startup Founder, Environmental Ecologist, or Investigative Journalist through interactive simulations and scenario challenges!
        </p>
      </div>

      {/* Filter Pills */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setFilter('ALL')} 
            className={`pill-btn ${filter === 'ALL' ? 'active' : ''}`}
          >
            All Courses ({courses.length})
          </button>
          <button 
            onClick={() => setFilter('SCIENCE')} 
            className={`pill-btn ${filter === 'SCIENCE' ? 'active' : ''}`}
          >
            Sciences & Analytics
          </button>
          <button 
            onClick={() => setFilter('ARTS')} 
            className={`pill-btn ${filter === 'ARTS' ? 'active' : ''}`}
          >
            Humanities, Media & Business
          </button>
        </div>

        <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>
          💡 Completing games unlocks real-world career suitability insights!
        </span>
      </div>

      {/* Grid of Courses */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
        {filteredCourses.map((course) => {
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
                  onClick={() => setActiveWrittenTestKey(course.key)}
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
      {activeWrittenTestKey && (
        <WrittenAssessmentModal
          courseKey={activeWrittenTestKey}
          studentId={studentId}
          onClose={() => setActiveWrittenTestKey(null)}
          onComplete={() => {
            setActiveWrittenTestKey(null);
            navigate('/student/recommendations');
          }}
        />
      )}
    </div>
  );
};

export default ArtsScienceExplorationLanding;
