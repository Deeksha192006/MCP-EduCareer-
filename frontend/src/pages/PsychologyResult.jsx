import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { psychologyAPI } from '../services/api';
import { 
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import { 
  Trophy, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw, 
  Sparkles, Award, ShieldCheck, Info, Clock, Users, ArrowLeft
} from 'lucide-react';

const PsychologyResult = ({ user }) => {
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
      const res = await psychologyAPI.getResult(studentId);
      setResultData(res.data);
    } catch (err) {
      console.error("Failed to load result:", err);
      setErrorMsg("Assessment results not yet found. Please complete the Mind Explorer challenge first.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <RefreshCw size={40} className="spin-icon" style={{ color: '#ec4899', marginBottom: '16px' }} />
        <h3 style={{ color: '#ffffff' }}>Compiling Social Reasoning Synthesis...</h3>
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
            onClick={() => navigate('/arts-science-exploration/psychology/assessment')} 
            className="btn btn-primary"
            style={{ padding: '10px 24px', margin: '0 auto', background: 'linear-gradient(135deg, #ec4899, #8b5cf6)' }}
          >
            Launch Mind Explorer
          </button>
        </div>
      </div>
    );
  }

  const finalRes = resultData.finalResult || {};
  const skillScores = resultData.skillScores || {};
  const scenarioResults = resultData.scenarioResults || [];

  const radarData = [
    { subject: 'Empathy Reasoning', score: skillScores.empathyOrientedReasoning || 0 },
    { subject: 'Social Perception', score: skillScores.socialPerception || 0 },
    { subject: 'Critical Thinking', score: skillScores.criticalThinking || 0 },
    { subject: 'Observation', score: skillScores.observationSkills || 0 },
    { subject: 'Conflict Resolution', score: skillScores.conflictResolution || 0 }
  ];

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', paddingBottom: '50px' }}>
      {/* Top Banner Card */}
      <div 
        className="glass-card" 
        style={{ 
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(76, 29, 65, 0.95))',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '24px',
          border: '1px solid rgba(236, 72, 153, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f472b6', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              <Trophy size={16} />
              <span>Assessment Completed & Evaluated</span>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', margin: '4px 0 8px' }}>
              Mind Explorer: Social & Emotional Reasoning Profile
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', maxWidth: '640px', lineHeight: '1.5', margin: 0 }}>
              {finalRes.recommendationNote || "You have successfully explored all 5 social dilemmas."}
            </p>
          </div>

          <div style={{ textAlign: 'right', background: 'rgba(236, 72, 153, 0.1)', padding: '16px 24px', borderRadius: '16px', border: '1px solid rgba(236, 72, 153, 0.3)' }}>
            <div style={{ fontSize: '11px', color: '#f472b6', fontWeight: 700, textTransform: 'uppercase' }}>Compatibility Score</div>
            <div style={{ fontSize: '36px', fontWeight: 900, color: '#ec4899' }}>{Math.round(resultData.gameScore || 0)}/100</div>
            <div style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: 600 }}>{finalRes.compatibilityBand || 'Strong Aptitude'}</div>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 16px', borderRadius: '10px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Optimal Perspective Accuracy</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#10b981' }}>{resultData.accuracy || 0}%</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 16px', borderRadius: '10px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Reflection Time</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#cbd5e1' }}>{Math.floor((resultData.totalTime || 0) / 60)}m {(resultData.totalTime || 0) % 60}s</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 16px', borderRadius: '10px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Dilemmas Handled</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#ec4899' }}>{scenarioResults.length} / 5</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 16px', borderRadius: '10px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Evaluation Standard</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#a78bfa' }}>Restorative & Empathic</div>
          </div>
        </div>
      </div>

      {/* Skills Radar & Strengths Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* Radar Chart */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '16px' }}>
            Social & Interpersonal Competency Radar
          </h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                <PolarRadiusAxis domain={[0, 100]} stroke="#64748b" />
                <Radar name="Student" dataKey="score" stroke="#ec4899" fill="#ec4899" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strengths & Growth Areas */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '14px' }}>
              Identified Interpersonal Strengths
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', marginBottom: '8px' }}>
                Demonstrated Strengths:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {(finalRes.strengths || ['Empathy-Oriented Reasoning']).map((str, idx) => (
                  <span key={idx} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '12px', fontWeight: 600 }}>
                    ✓ {str}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', marginBottom: '8px' }}>
                Recommended Exploration Focus:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {(finalRes.growthAreas || ['Restorative Dispute Architecture']).map((ga, idx) => (
                  <span key={idx} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)', fontSize: '12px', fontWeight: 600 }}>
                    ⚡ {ga}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase' }}>
              Aligned Human Science Pathways:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {(finalRes.recommendedRoles || ['Organizational Counselor', 'Behavioral Researcher']).map((role, idx) => (
                <span key={idx} style={{ fontSize: '11.5px', padding: '3px 8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)', color: '#e2e8f0', border: '1px solid var(--border-color)' }}>
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scenario-by-Scenario Consequence Recap */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#ffffff', marginBottom: '16px' }}>
          Interpersonal Consequence Log
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {scenarioResults.map((sc, idx) => (
            <div 
              key={idx}
              style={{
                padding: '16px 20px',
                borderRadius: '12px',
                background: sc.isOptimal ? 'rgba(16, 185, 129, 0.06)' : 'rgba(245, 158, 11, 0.06)',
                border: sc.isOptimal ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(245, 158, 11, 0.25)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div style={{ maxWidth: '820px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  {sc.isOptimal ? (
                    <CheckCircle2 size={18} color="#10b981" />
                  ) : (
                    <AlertTriangle size={18} color="#f59e0b" />
                  )}
                  <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '14.5px' }}>{sc.title}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>({sc.skillTested})</span>
                </div>
                <div style={{ fontSize: '13px', color: '#e2e8f0', margin: '4px 0 6px 26px' }}>
                  <strong>Your Action:</strong> "{sc.chosenOptionLabel}"
                </div>
                <div style={{ fontSize: '12.5px', color: '#94a3b8', margin: '0 0 4px 26px', lineHeight: '1.4' }}>
                  <strong>Consequence:</strong> {sc.consequence}
                </div>
                <div style={{ fontSize: '12px', color: '#a78bfa', margin: '0 0 0 26px', fontStyle: 'italic' }}>
                  <strong>Perspective Insight:</strong> {sc.reasoning}
                </div>
              </div>

              <div style={{ textAlign: 'right', minWidth: '70px' }}>
                <span style={{ fontWeight: 800, fontSize: '15px', color: sc.isOptimal ? '#10b981' : '#f59e0b' }}>
                  +{sc.scoreEarned} pts
                </span>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{sc.timeTaken}s taken</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mandatory Ethical Notice Banner */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(236, 72, 153, 0.08)', padding: '16px 20px', borderRadius: '12px', border: '1px solid rgba(236, 72, 153, 0.25)', marginBottom: '24px' }}>
        <Info size={22} color="#ec4899" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: '12.5px', color: '#cbd5e1', lineHeight: '1.5' }}>
          <strong>Educational Ethical Guardrail:</strong> {finalRes.disclaimer || "This simulation evaluates exploratory social reasoning and situational perspective-taking. It does NOT diagnose psychological conditions, measure clinical traits, or substitute for professional counseling assessment."}
        </span>
      </div>

      {/* Bottom Action Buttons */}
      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
        <button 
          onClick={() => navigate('/arts-science-exploration/psychology/assessment')}
          className="btn btn-outline"
          style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <RefreshCw size={16} />
          <span>Retry Mind Explorer</span>
        </button>
        <button 
          onClick={() => navigate('/arts-science-exploration')}
          className="btn btn-primary"
          style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #ec4899, #8b5cf6)' }}
        >
          <span>Explore Other Arts & Science Courses</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default PsychologyResult;
