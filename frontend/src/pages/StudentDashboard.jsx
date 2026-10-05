import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { studentAPI } from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Award, Compass, TrendingUp, BookOpen, CheckCircle, 
  FileText, Sparkles, Columns, Palette, Cpu, Coins, ArrowRight 
} from 'lucide-react';

const StudentDashboard = ({ user }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const isCompleted = localStorage.getItem('assessment_completed');
    if (user?.role === 'student' && user?.id !== 'student-demo-1' && isCompleted !== 'true') {
      navigate('/student/assessment');
      return;
    }

    const fetchDashboard = async () => {
      try {
        const studentId = user?.id || 'student-demo-1';
        const res = await studentAPI.getDashboard(studentId);
        setData(res.data);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [user, navigate]);

  if (loading) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p style={{ fontSize: '16px', fontWeight: 600 }}>Loading AI Performance & Career Insights...</p>
      </div>
    );
  }

  const student = data?.student || {};
  const guidance = data?.guidance || {};
  const category = guidance?.category || { title: 'High Performer', key: 'HIGH_PERFORMER' };
  const perf = guidance?.predicted_performance || {};
  const topStream = guidance?.streams?.[0] || { title: 'Computer Science' };
  const topCareer = guidance?.careers?.[0] || { title: 'Software Developer', match_score: 87 };

  const subjectData = [
    { subject: 'Math', score: student.academic?.math || 92 },
    { subject: 'Science', score: student.academic?.science || 89 },
    { subject: 'English', score: student.academic?.english || 78 },
  ];

  const careerMatchData = (guidance.careers || []).slice(0, 4).map(c => ({
    name: c.title,
    match: c.match_score
  }));

  const getBadgeClass = (key) => {
    if (key === 'HIGH_PERFORMER') return 'badge-high-performer';
    if (key === 'CONSISTENT_LEARNER') return 'badge-consistent';
    if (key === 'POTENTIAL_PERFORMER') return 'badge-potential';
    if (key === 'NEEDS_ACADEMIC_SUPPORT') return 'badge-support';
    return 'badge-multi-talented';
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      <Navbar 
        title={`Welcome, ${student.name || 'Student'}`} 
        subtitle="AI-Powered Student Performance & Career Guidance Portal"
        user={user}
      />

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card" style={{ borderLeftColor: 'var(--primary)' }}>
          <div className="kpi-title">Overall Performance</div>
          <div className="kpi-value">{student.academic?.overall_percentage || 86.3}%</div>
          <div className="kpi-subtitle">Predicted Grade: {perf.predicted_grade || 88.5}% ({perf.grade_letter || 'A'})</div>
        </div>

        <div className="kpi-card" style={{ borderLeftColor: 'var(--success)' }}>
          <div className="kpi-title">Attendance Rate</div>
          <div className="kpi-value" style={{ color: 'var(--success)' }}>{student.academic?.attendance_percentage || 94}%</div>
          <div className="kpi-subtitle">Regularity & Discipline Track</div>
        </div>

        <div className="kpi-card" style={{ borderLeftColor: 'var(--secondary)' }}>
          <div className="kpi-title">Student Category</div>
          <div style={{ marginTop: '4px' }}>
            <span className={`badge ${getBadgeClass(category.key)}`}>
              {category.title}
            </span>
          </div>
          <div className="kpi-subtitle" style={{ marginTop: '6px' }}>{category.description}</div>
        </div>

        <div className="kpi-card" style={{ borderLeftColor: 'var(--accent)' }}>
          <div className="kpi-title">Top Stream Match</div>
          <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>
            {topStream.title}
          </div>
          <div className="kpi-subtitle">Match Confidence: {topStream.match_score || 91}%</div>
        </div>

        <div className="kpi-card" style={{ borderLeftColor: 'var(--warning)' }}>
          <div className="kpi-title">Top Career Outcome</div>
          <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>
            {topCareer.title}
          </div>
          <div className="kpi-subtitle">Match Score: {topCareer.match_score}%</div>
        </div>
      </div>

      {/* Action Banner for 12th Standard Course & Career Module */}
      <div className="banner-header" style={{ margin: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ maxWidth: '780px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              <Sparkles size={16} />
              <span>Multi-Stage 12th Course & Career Recommendation Engine</span>
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
              Explore Academic Streams & Test Your Compatibility
            </h3>
            <p className="banner-subtitle">
              Take interactive simulation games (75% weight) and conceptual written assessments (25% weight) across Engineering, Arts & Science, and Commerce & Accounting.
            </p>
          </div>

          <button onClick={() => navigate('/student/12th-guidance')} className="btn btn-primary" style={{ padding: '12px 20px', whiteSpace: 'nowrap' }}>
            <Compass size={18} />
            <span>12th Course & Career Hub</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Quick Stream Launch Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-blue)' }}>
          <button 
            onClick={() => navigate('/engineering-exploration')} 
            className="btn btn-outline" 
            style={{ justifyContent: 'flex-start', background: '#ffffff', padding: '10px 14px' }}
          >
            <Cpu size={18} style={{ color: 'var(--primary)' }} />
            <span style={{ fontWeight: 700 }}>Engineering Arcade</span>
          </button>

          <button 
            onClick={() => navigate('/arts-science-exploration')} 
            className="btn btn-outline" 
            style={{ justifyContent: 'flex-start', background: '#ffffff', padding: '10px 14px' }}
          >
            <Palette size={18} style={{ color: 'var(--accent-purple)' }} />
            <span style={{ fontWeight: 700 }}>Arts & Science Arcade</span>
          </button>

          <button 
            onClick={() => navigate('/commerce-exploration')} 
            className="btn btn-outline" 
            style={{ justifyContent: 'flex-start', background: '#ffffff', padding: '10px 14px' }}
          >
            <Coins size={18} style={{ color: 'var(--accent)' }} />
            <span style={{ fontWeight: 700 }}>Commerce Arcade</span>
          </button>

          <button 
            onClick={() => navigate('/student/recommendations')} 
            className="btn btn-outline" 
            style={{ justifyContent: 'flex-start', background: '#ffffff', padding: '10px 14px', borderColor: 'var(--border-blue)', color: 'var(--primary)' }}
          >
            <Award size={18} />
            <span style={{ fontWeight: 700 }}>75:25 Recommendations</span>
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Subject Scores Bar Chart */}
        <div className="card">
          <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-main)' }}>
            Academic Subject Breakdown
          </h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={subjectData}>
                <XAxis dataKey="subject" stroke="#475569" fontSize={12} fontWeight={600} />
                <YAxis domain={[0, 100]} stroke="#475569" fontSize={12} fontWeight={600} />
                <Tooltip 
                  contentStyle={{ 
                    background: '#ffffff', 
                    border: '1px solid #cbd5e1', 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
                    color: '#0f172a',
                    fontWeight: 600
                  }} 
                />
                <Bar dataKey="score" fill="#1e40af" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Career Match Scores Chart */}
        <div className="card">
          <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-main)' }}>
            Top Career Match Probability (%)
          </h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={careerMatchData} layout="vertical">
                <XAxis type="number" domain={[0, 100]} stroke="#475569" fontSize={12} fontWeight={600} />
                <YAxis dataKey="name" type="category" stroke="#475569" width={140} fontSize={12} fontWeight={600} />
                <Tooltip 
                  contentStyle={{ 
                    background: '#ffffff', 
                    border: '1px solid #cbd5e1', 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
                    color: '#0f172a',
                    fontWeight: 600
                  }} 
                />
                <Bar dataKey="match" fill="#0f766e" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
