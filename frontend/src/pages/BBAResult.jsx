import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bbaAPI } from '../services/api';
import { 
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import { 
  Trophy, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw, 
  Sparkles, Award, ShieldCheck, DollarSign, TrendingUp, Users, ArrowLeft, Info
} from 'lucide-react';

const BBAResult = ({ user }) => {
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
      const res = await bbaAPI.getResult(studentId);
      setResultData(res.data);
    } catch (err) {
      console.error("Failed to load result:", err);
      setErrorMsg("Assessment results not yet found. Please complete the Startup Simulator challenge first.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <RefreshCw size={40} className="spin-icon" style={{ color: '#f59e0b', marginBottom: '16px' }} />
        <h3 style={{ color: '#ffffff' }}>Auditing Venture Financial Performance...</h3>
      </div>
    );
  }

  if (errorMsg || !resultData) {
    return (
      <div className="page-container" style={{ maxWidth: '600px', margin: '60px auto', textAlign: 'center' }}>
        <div className="glass-card" style={{ padding: '32px' }}>
          <AlertTriangle size={44} color="#f59e0b" style={{ marginBottom: '16px' }} />
          <h3 style={{ color: '#ffffff', fontSize: '20px', marginBottom: '8px' }}>No Simulation Results Yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>{errorMsg}</p>
          <button 
            onClick={() => navigate('/arts-science-exploration/bba/assessment')} 
            className="btn btn-primary"
            style={{ padding: '10px 24px', margin: '0 auto', background: 'linear-gradient(135deg, #f59e0b, #ea580c)' }}
          >
            Launch Startup Simulator
          </button>
        </div>
      </div>
    );
  }

  const finalRes = resultData.finalResult || {};
  const skillScores = resultData.skillScores || {};
  const roundSummaries = resultData.roundSummaries || [];

  const radarData = [
    { subject: 'Business Reasoning', score: skillScores.businessReasoning || 0 },
    { subject: 'Resource Mgmt', score: skillScores.resourceManagement || 0 },
    { subject: 'Strategic Thinking', score: skillScores.strategicThinking || 0 },
    { subject: 'Risk Decisions', score: skillScores.decisionMakingUnderRisk || 0 },
    { subject: 'Financial Acumen', score: skillScores.financialAcumen || 0 }
  ];

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', paddingBottom: '50px' }}>
      {/* Top Banner Card */}
      <div 
        className="glass-card" 
        style={{ 
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(69, 26, 3, 0.95))',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '24px',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              <Trophy size={16} />
              <span>Simulation Completed & Audited</span>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', margin: '4px 0 8px' }}>
              Startup Simulator: Commercial Audit & Leadership Score
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', maxWidth: '640px', lineHeight: '1.5', margin: 0 }}>
              {finalRes.recommendationNote || "You have successfully navigated all 5 venture rounds."}
            </p>
          </div>

          <div style={{ textAlign: 'right', background: 'rgba(245, 158, 11, 0.1)', padding: '16px 24px', borderRadius: '16px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <div style={{ fontSize: '11px', color: '#fcd34d', fontWeight: 700, textTransform: 'uppercase' }}>Commercial Score</div>
            <div style={{ fontSize: '36px', fontWeight: 900, color: '#f59e0b' }}>{Math.round(resultData.gameScore || 0)}/100</div>
            <div style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: 600 }}>{finalRes.compatibilityBand || 'Strong Commercial Acumen'}</div>
          </div>
        </div>

        {/* Financial KPI Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 16px', borderRadius: '10px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Treasury Cash Balance</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#10b981' }}>₹{Math.round(resultData.finalCash || 0).toLocaleString()}</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 16px', borderRadius: '10px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Monthly Recurring Rev (MRR)</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#38bdf8' }}>+₹{Math.round(resultData.finalMRR || 0).toLocaleString()}/mo</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 16px', borderRadius: '10px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Customer NPS</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#f59e0b' }}>{Math.round(resultData.finalNPS || 50)}/100</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 16px', borderRadius: '10px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Strategic Decisions Optimal</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#a78bfa' }}>{roundSummaries.filter(r => r.isOptimal).length} / 5</div>
          </div>
        </div>
      </div>

      {/* Skills Radar & Strengths Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* Radar Chart */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '16px' }}>
            Executive & Strategic Competency Radar
          </h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                <PolarRadiusAxis domain={[0, 100]} stroke="#64748b" />
                <Radar name="Student" dataKey="score" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strengths & Growth Areas */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '14px' }}>
              Identified Commercial Strengths
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', marginBottom: '8px' }}>
                Demonstrated Strengths:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {(finalRes.strengths || ['Strategic Thinking']).map((str, idx) => (
                  <span key={idx} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '12px', fontWeight: 600 }}>
                    ✓ {str}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', marginBottom: '8px' }}>
                Recommended Strategy Focus:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {(finalRes.growthAreas || ['Unit Economics Modeling']).map((ga, idx) => (
                  <span key={idx} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)', fontSize: '12px', fontWeight: 600 }}>
                    ⚡ {ga}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase' }}>
              Aligned Corporate & Venture Roles:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {(finalRes.recommendedRoles || ['Venture Founder', 'Product Manager']).map((role, idx) => (
                <span key={idx} style={{ fontSize: '11.5px', padding: '3px 8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)', color: '#e2e8f0', border: '1px solid var(--border-color)' }}>
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Round-by-Round Financial Audit */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#ffffff', marginBottom: '16px' }}>
          Venture Decision Ledger & Consequence History
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {roundSummaries.map((rnd, idx) => (
            <div 
              key={idx}
              style={{
                padding: '16px 20px',
                borderRadius: '12px',
                background: rnd.isOptimal ? 'rgba(16, 185, 129, 0.06)' : 'rgba(245, 158, 11, 0.06)',
                border: rnd.isOptimal ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(245, 158, 11, 0.25)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div style={{ maxWidth: '820px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  {rnd.isOptimal ? (
                    <CheckCircle2 size={18} color="#10b981" />
                  ) : (
                    <AlertTriangle size={18} color="#f59e0b" />
                  )}
                  <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '14.5px' }}>{rnd.title}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>({rnd.skillTested})</span>
                </div>
                <div style={{ fontSize: '13px', color: '#e2e8f0', margin: '4px 0 6px 26px' }}>
                  <strong>Your Move:</strong> "{rnd.chosenOptionLabel}"
                </div>
                <div style={{ fontSize: '12.5px', color: '#94a3b8', margin: '0 0 4px 26px', lineHeight: '1.4' }}>
                  <strong>Consequence:</strong> {rnd.consequence}
                </div>
                <div style={{ fontSize: '12px', color: '#38bdf8', margin: '0 0 0 26px' }}>
                  Cost Incurred: ₹{rnd.costIncurred?.toLocaleString()} | Treasury Post-Round: ₹{rnd.cashRemaining?.toLocaleString()}
                </div>
              </div>

              <div style={{ textAlign: 'right', minWidth: '70px' }}>
                <span style={{ fontWeight: 800, fontSize: '15px', color: rnd.isOptimal ? '#10b981' : '#f59e0b' }}>
                  +{rnd.scoreEarned} pts
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exploratory Notice Banner */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(245, 158, 11, 0.08)', padding: '16px 20px', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.25)', marginBottom: '24px' }}>
        <Info size={22} color="#f59e0b" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: '12.5px', color: '#cbd5e1', lineHeight: '1.5' }}>
          <strong>Educational Notice:</strong> {finalRes.disclaimer || "This virtual business simulation tests exploratory decision-making and strategic resource allocation. It is not an accredited financial appraisal or guaranteed indicator of entrepreneurial success."}
        </span>
      </div>

      {/* Bottom Action Buttons */}
      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
        <button 
          onClick={() => navigate('/arts-science-exploration/bba/assessment')}
          className="btn btn-outline"
          style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <RefreshCw size={16} />
          <span>Retry Startup Simulator</span>
        </button>
        <button 
          onClick={() => navigate('/arts-science-exploration')}
          className="btn btn-primary"
          style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #f59e0b, #ea580c)' }}
        >
          <span>Explore Other Arts & Science Courses</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default BBAResult;
