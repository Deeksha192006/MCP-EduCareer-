import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { journalismAPI } from '../services/api';
import { 
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import { 
  Trophy, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw, 
  Sparkles, Award, ShieldCheck, Newspaper, Search, Mic, FileText, Eye, ArrowLeft, Info
} from 'lucide-react';

const JournalismResult = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [resultData, setResultData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const studentId = user?.id || 'student-demo-1';

  useEffect(() => {
    fetchResult();
  }, [studentId]);

  const fetchResult = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await journalismAPI.getResult(studentId);
      setResultData(res.data);
    } catch (err) {
      console.error("Failed to load result:", err);
      setErrorMsg("Assessment results not yet found. Please complete the Newsroom Challenge first.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <RefreshCw size={40} className="spin-icon" style={{ color: '#f59e0b', marginBottom: '16px' }} />
        <h3 style={{ color: '#ffffff' }}>Auditing Editorial & Verification Scores...</h3>
      </div>
    );
  }

  if (errorMsg || !resultData) {
    return (
      <div className="page-container" style={{ maxWidth: '600px', margin: '60px auto', textAlign: 'center' }}>
        <div className="glass-card" style={{ padding: '32px' }}>
          <AlertTriangle size={44} color="#f59e0b" style={{ marginBottom: '16px' }} />
          <h3 style={{ color: '#ffffff', fontSize: '20px', marginBottom: '8px' }}>No Newsroom Records Yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>{errorMsg}</p>
          <button 
            onClick={() => navigate('/journalism-assessment')} 
            className="btn btn-primary"
            style={{ padding: '10px 24px', margin: '0 auto', background: 'linear-gradient(135deg, #f59e0b, #ea580c)', color: '#0f172a' }}
          >
            Launch Newsroom Challenge
          </button>
        </div>
      </div>
    );
  }

  const {
    gameScore,
    accuracy,
    verificationScore,
    ethicsScore,
    interviewingScore,
    communicationScore,
    mediaLiteracyScore,
    skillScores = {},
    challengeSummaries = [],
    finalResult = {}
  } = resultData;

  const radarData = [
    { subject: 'Verification', score: skillScores.criticalVerification || verificationScore || 70 },
    { subject: 'Ethics', score: skillScores.mediaEthics || ethicsScore || 70 },
    { subject: 'Inquiry', score: skillScores.investigativeInquiry || interviewingScore || 70 },
    { subject: 'Writing', score: skillScores.clearCommunication || communicationScore || 70 },
    { subject: 'Forensics', score: skillScores.digitalMediaLiteracy || mediaLiteracyScore || 70 },
  ];

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', paddingBottom: '50px' }}>
      {/* Top Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <button
          onClick={() => navigate('/arts-science-exploration')}
          className="btn btn-secondary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '13px' }}
        >
          <ArrowLeft size={16} />
          <span>Arts & Science Arcade</span>
        </button>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          BA Journalism & Mass Communication — Newsroom Challenge Edition
        </span>
      </div>

      {/* Hero Performance Header */}
      <div 
        className="glass-card" 
        style={{ 
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(120, 53, 15, 0.8), rgba(15, 23, 42, 0.95))',
          borderRadius: '24px',
          padding: '36px',
          marginBottom: '28px',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '24px' }}>
          <div style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span style={{ 
                background: 'rgba(245, 158, 11, 0.2)', 
                color: '#fcd34d', 
                padding: '4px 12px', 
                borderRadius: '20px', 
                fontSize: '12px', 
                fontWeight: 700,
                border: '1px solid rgba(245, 158, 11, 0.4)'
              }}>
                JOURNALISM CREDENTIAL AUDIT
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                Completed {new Date(resultData.completedAt || Date.now()).toLocaleDateString()}
              </span>
            </div>

            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', marginBottom: '12px', letterSpacing: '-0.02em' }}>
              {finalResult.compatibilityBand || "Master Investigative Reporter & Editor"}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>
              {finalResult.recommendationNote || "You demonstrated high journalistic integrity, meticulous source verification, and impartial communication under deadline pressure."}
            </p>
          </div>

          {/* Big Score Badge */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.85)',
            border: '2px solid rgba(245, 158, 11, 0.4)',
            borderRadius: '20px',
            padding: '24px 32px',
            textAlign: 'center',
            boxShadow: '0 8px 30px rgba(245, 158, 11, 0.15)'
          }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#fcd34d', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Overall Score
            </span>
            <div style={{ fontSize: '48px', fontWeight: 900, color: '#ffffff', lineHeight: 1.1, marginTop: '4px' }}>
              {gameScore}
              <span style={{ fontSize: '20px', color: '#94a3b8' }}>/100</span>
            </div>
            <div style={{ fontSize: '13px', color: '#34d399', fontWeight: 600, marginTop: '6px' }}>
              {accuracy}% Editorial Accuracy
            </div>
          </div>
        </div>
      </div>

      {/* 5 Dimensional Metrics */}
      <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-bright)', marginBottom: '16px' }}>
        Newsroom Core Competencies
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div className="card" style={{ padding: '20px', textAlign: 'center', borderTop: '4px solid #f59e0b' }}>
          <Search size={24} color="#f59e0b" style={{ margin: '0 auto 8px' }} />
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Source Verification</span>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
            {verificationScore || 85}%
          </div>
        </div>

        <div className="card" style={{ padding: '20px', textAlign: 'center', borderTop: '4px solid #10b981' }}>
          <ShieldCheck size={24} color="#10b981" style={{ margin: '0 auto 8px' }} />
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Media Ethics</span>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
            {ethicsScore || 90}%
          </div>
        </div>

        <div className="card" style={{ padding: '20px', textAlign: 'center', borderTop: '4px solid #ea580c' }}>
          <Mic size={24} color="#ea580c" style={{ margin: '0 auto 8px' }} />
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Inquiry & Interviewing</span>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
            {interviewingScore || 80}%
          </div>
        </div>

        <div className="card" style={{ padding: '20px', textAlign: 'center', borderTop: '4px solid #3b82f6' }}>
          <FileText size={24} color="#3b82f6" style={{ margin: '0 auto 8px' }} />
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Clear Communication</span>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
            {communicationScore || 85}%
          </div>
        </div>

        <div className="card" style={{ padding: '20px', textAlign: 'center', borderTop: '4px solid #a855f7' }}>
          <Eye size={24} color="#a855f7" style={{ margin: '0 auto 8px' }} />
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Digital Forensics</span>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
            {mediaLiteracyScore || 88}%
          </div>
        </div>
      </div>

      {/* Radar Chart & Career Alignment */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-bright)', marginBottom: '16px', alignSelf: 'flex-start' }}>
            Editorial Skill Profile
          </h4>
          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
                <PolarRadiusAxis stroke="#334155" domain={[0, 100]} />
                <Radar name="Student" dataKey="score" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-bright)', marginBottom: '16px' }}>
            Career Pathways in Media & Journalism
          </h4>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Based on your investigative rigor, ethical discernment, and communication clarity:
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
            {(finalResult.recommendedRoles || [
              "Investigative Journalist",
              "Fact-Checking Analyst & OSINT Researcher",
              "Broadcast News Anchor & Field Reporter",
              "Senior Copy & Headline Editor",
              "Public Relations & Communications Specialist",
              "Digital Media Producer"
            ]).map((role, idx) => (
              <span
                key={idx}
                style={{
                  background: 'rgba(245, 158, 11, 0.12)',
                  color: '#fcd34d',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  padding: '6px 14px',
                  borderRadius: '16px',
                  fontSize: '13px',
                  fontWeight: 600
                }}
              >
                {role}
              </span>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#34d399', textTransform: 'uppercase' }}>
              Identified Strengths:
            </span>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
              {(finalResult.strengths || ["Critical Verification", "Media Ethics"]).map((s, i) => (
                <span key={i} style={{ fontSize: '12px', color: '#e2e8f0', background: 'rgba(52, 211, 153, 0.1)', padding: '2px 8px', borderRadius: '8px' }}>
                  ✓ {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Challenge-by-Challenge Editorial Debrief */}
      <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-bright)', marginBottom: '16px' }}>
        Newsroom Assignment Debrief
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
        {challengeSummaries.map((summary, idx) => (
          <div 
            key={idx}
            className="card" 
            style={{ 
              padding: '20px', 
              borderLeft: summary.isOptimal ? '4px solid #10b981' : '4px solid #f59e0b'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#94a3b8'
                }}>
                  {summary.stageName || `Assignment ${idx + 1}`}
                </span>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                  {summary.title}
                </h4>
              </div>
              <span style={{
                fontSize: '12px',
                fontWeight: 700,
                color: summary.isOptimal ? '#34d399' : '#f59e0b'
              }}>
                +{summary.scoreEarned} pts
              </span>
            </div>

            <p style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '8px' }}>
              <strong>Decision Made:</strong> {summary.chosenOptionLabel}
            </p>
            <p style={{ fontSize: '13px', color: summary.isOptimal ? '#6ee7b7' : '#fde047', marginBottom: '6px' }}>
              <strong>Outcome:</strong> {summary.consequence}
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>
              <strong>Editor's Note:</strong> {summary.editorialFeedback}
            </p>
          </div>
        ))}
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
          alignItems: 'center',
          marginBottom: '28px'
        }}
      >
        <Info size={28} color="#f59e0b" style={{ flexShrink: 0 }} />
        <div>
          <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#fcd34d', marginBottom: '4px' }}>
            Exploratory Simulation Notice
          </h5>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
            {finalResult.disclaimer || "This newsroom challenge is an educational interactive simulation designed to cultivate critical thinking, media literacy, and communication ethics. It does not certify formal press accreditation or professional journalistic licensing."}
          </p>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <button
          onClick={() => navigate('/arts-science-exploration')}
          className="btn btn-primary"
          style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #f59e0b, #ea580c)', color: '#0f172a', fontWeight: 700 }}
        >
          Explore Other Arts & Science Courses
        </button>
        <button
          onClick={() => navigate('/journalism-assessment')}
          className="btn btn-secondary"
          style={{ padding: '12px 24px' }}
        >
          Retake Newsroom Challenge
        </button>
      </div>
    </div>
  );
};

export default JournalismResult;
