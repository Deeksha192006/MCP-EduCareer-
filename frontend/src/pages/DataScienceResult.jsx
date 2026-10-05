import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataScienceAPI } from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import { 
  Trophy, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw, 
  Sparkles, Award, ShieldCheck, Compass, Info, Clock, Target, ArrowLeft
} from 'lucide-react';

const DataScienceResult = ({ user }) => {
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
      const res = await dataScienceAPI.getResult(studentId);
      setResultData(res.data);
    } catch (err) {
      console.error("Failed to load result:", err);
      setErrorMsg("Assessment results not yet found. Please complete the Data Detective challenge first.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <RefreshCw size={40} className="spin-icon" style={{ color: '#38bdf8', marginBottom: '16px' }} />
        <h3 style={{ color: '#ffffff' }}>Compiling Data Detective Telemetry Analysis...</h3>
      </div>
    );
  }

  if (errorMsg || !resultData) {
    return (
      <div className="page-container" style={{ maxWidth: '600px', margin: '60px auto', textAlign: 'center' }}>
        <div className="glass-card" style={{ padding: '32px' }}>
          <AlertTriangle size={44} color="#f59e0b" style={{ marginBottom: '16px' }} />
          <h3 style={{ color: '#ffffff', fontSize: '20px', marginBottom: '8px' }}>No Results Yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>{errorMsg}</p>
          <button 
            onClick={() => navigate('/arts-science-exploration/data-science/assessment')} 
            className="btn btn-primary"
            style={{ padding: '10px 24px', margin: '0 auto' }}
          >
            Launch Data Detective
          </button>
        </div>
      </div>
    );
  }

  const finalRes = resultData.finalResult || {};
  const skillScores = resultData.skillScores || {};
  const levelResults = resultData.levelResults || [];

  const radarData = [
    { subject: 'Analytical Thinking', score: skillScores.analyticalThinking || 0 },
    { subject: 'Data Interpretation', score: skillScores.dataInterpretation || 0 },
    { subject: 'Logical Reasoning', score: skillScores.logicalReasoning || 0 },
    { subject: 'Numerical Skills', score: skillScores.numericalSkills || 0 },
    { subject: 'Hypothesis Testing', score: skillScores.hypothesisTesting || 0 }
  ];

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', paddingBottom: '50px' }}>
      {/* Top Banner Card */}
      <div 
        className="glass-card" 
        style={{ 
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(8, 47, 73, 0.95))',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '24px',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              <Trophy size={16} />
              <span>Assessment Completed & Verified</span>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', margin: '4px 0 8px' }}>
              Data Detective: Performance & Career Suitability
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', maxWidth: '640px', lineHeight: '1.5', margin: 0 }}>
              {finalRes.recommendationNote || "You have successfully completed all 5 investigation cases."}
            </p>
          </div>

          <div style={{ textAlign: 'right', background: 'rgba(56, 189, 248, 0.1)', padding: '16px 24px', borderRadius: '16px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
            <div style={{ fontSize: '11px', color: '#7dd3fc', fontWeight: 700, textTransform: 'uppercase' }}>Compatibility Score</div>
            <div style={{ fontSize: '36px', fontWeight: 900, color: '#38bdf8' }}>{Math.round(resultData.gameScore || 0)}/100</div>
            <div style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: 600 }}>{finalRes.compatibilityBand || 'Strong Aptitude'}</div>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 16px', borderRadius: '10px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Investigation Accuracy</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#10b981' }}>{resultData.accuracy || 0}%</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 16px', borderRadius: '10px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Time Taken</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#cbd5e1' }}>{Math.floor((resultData.totalTime || 0) / 60)}m {(resultData.totalTime || 0) % 60}s</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 16px', borderRadius: '10px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Cases Solved</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#38bdf8' }}>{levelResults.filter(l => l.isCorrect).length} / {levelResults.length}</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 16px', borderRadius: '10px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Verification Method</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#8b5cf6' }}>Server Ground-Truth</div>
          </div>
        </div>
      </div>

      {/* Skills Radar & Strengths Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* Radar Chart */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '16px' }}>
            Cognitive & Data Competency Profile
          </h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                <PolarRadiusAxis domain={[0, 100]} stroke="#64748b" />
                <Radar name="Student" dataKey="score" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strengths & Growth Areas */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '14px' }}>
              Identified Strengths & Growth Areas
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', marginBottom: '8px' }}>
                Key Strengths:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {(finalRes.strengths || ['Analytical Aptitude']).map((str, idx) => (
                  <span key={idx} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '12px', fontWeight: 600 }}>
                    ✓ {str}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', marginBottom: '8px' }}>
                Recommended Growth Focus:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {(finalRes.growthAreas || ['Advanced Statistical Imputation']).map((ga, idx) => (
                  <span key={idx} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)', fontSize: '12px', fontWeight: 600 }}>
                    ⚡ {ga}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase' }}>
              Aligned Career Specializations:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {(finalRes.recommendedRoles || ['Data Scientist', 'Data Analyst']).map((role, idx) => (
                <span key={idx} style={{ fontSize: '11.5px', padding: '3px 8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)', color: '#e2e8f0', border: '1px solid var(--border-color)' }}>
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Case-by-Case Breakdown */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#ffffff', marginBottom: '16px' }}>
          Investigation Case File Breakdown
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {levelResults.map((lvl, idx) => (
            <div 
              key={idx}
              style={{
                padding: '14px 18px',
                borderRadius: '12px',
                background: lvl.isCorrect ? 'rgba(16, 185, 129, 0.06)' : 'rgba(239, 68, 68, 0.06)',
                border: lvl.isCorrect ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(239, 68, 68, 0.25)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '10px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {lvl.isCorrect ? (
                    <CheckCircle2 size={18} color="#10b981" />
                  ) : (
                    <AlertTriangle size={18} color="#ef4444" />
                  )}
                  <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '14.5px' }}>{lvl.levelName}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>({lvl.skillTested})</span>
                </div>
                <p style={{ margin: '6px 0 0 26px', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.4' }}>
                  {lvl.feedback}
                </p>
              </div>

              <div style={{ textAlign: 'right', minWidth: '80px' }}>
                <span style={{ fontWeight: 800, fontSize: '15px', color: lvl.isCorrect ? '#10b981' : '#ef4444' }}>
                  +{lvl.scoreEarned} pts
                </span>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{lvl.timeTaken}s taken</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ethical Guardrail Disclaimer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(56, 189, 248, 0.06)', padding: '14px 18px', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.2)', marginBottom: '24px' }}>
        <Info size={20} color="#38bdf8" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: '12.5px', color: '#94a3b8', lineHeight: '1.5' }}>
          <strong>Educational Notice:</strong> {finalRes.disclaimer || "This simulation is an exploratory aptitude indicator designed to discover course interest, not a clinical psychological evaluation or deterministic career prediction."}
        </span>
      </div>

      {/* Bottom Action Buttons */}
      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
        <button 
          onClick={() => navigate('/arts-science-exploration/data-science/assessment')}
          className="btn btn-outline"
          style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <RefreshCw size={16} />
          <span>Retry Data Detective</span>
        </button>
        <button 
          onClick={() => navigate('/arts-science-exploration')}
          className="btn btn-primary"
          style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #38bdf8, #6366f1)' }}
        >
          <span>Explore Other Arts & Science Courses</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default DataScienceResult;
