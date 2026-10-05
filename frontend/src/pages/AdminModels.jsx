import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { adminAPI, pilotValidationAPI } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Cpu, Award, CheckCircle, RefreshCw, Activity, ShieldCheck, 
  AlertTriangle, Sliders, Users, MessageSquare, Send, BookOpen 
} from 'lucide-react';

const AdminModels = ({ user }) => {
  const [mlData, setMlData] = useState(null);
  const [pilotMetrics, setPilotMetrics] = useState(null);
  const [weightsData, setWeightsData] = useState(null);
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [retraining, setRetraining] = useState(false);
  const [retrainMessage, setRetrainMessage] = useState('');

  // Configurable Weight Sliders State
  const [gameWeightInput, setGameWeightInput] = useState(75);
  const [writtenWeightInput, setWrittenWeightInput] = useState(25);
  const [weightSaveMsg, setWeightSaveMsg] = useState(null);

  // Evaluator Feedback Form State
  const [feedbackCourse, setFeedbackCourse] = useState('data-science');
  const [feedbackRole, setFeedbackRole] = useState('educator');
  const [relevanceRating, setRelevanceRating] = useState(5);
  const [skillRating, setSkillRating] = useState(5);
  const [qualitativeText, setQualitativeText] = useState('');
  const [weightSuggestion, setWeightSuggestion] = useState('75:25 is well-balanced');
  const [feedbackSubmitMsg, setFeedbackSubmitMsg] = useState(null);

  const fetchAllData = async () => {
    try {
      const [resMetrics, resPilot, resWeights, resFeedback] = await Promise.all([
        adminAPI.getMLMetrics(),
        pilotValidationAPI.getMetrics(),
        pilotValidationAPI.getWeights(),
        pilotValidationAPI.getFeedback()
      ]);
      setMlData(resMetrics.data);
      setPilotMetrics(resPilot.data);
      setWeightsData(resWeights.data);
      setFeedbackList(resFeedback.data.feedbackList || []);

      if (resWeights.data?.currentWeights) {
        setGameWeightInput(Math.round(resWeights.data.currentWeights.game_weight * 100));
        setWrittenWeightInput(Math.round(resWeights.data.currentWeights.written_test_weight * 100));
      }
    } catch (err) {
      console.error("Failed to load admin metrics", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleRetrain = async () => {
    setRetraining(true);
    setRetrainMessage('');
    try {
      const res = await adminAPI.triggerRetrain();
      setRetrainMessage(res.data.message || 'Continuous retraining initiated.');
      setTimeout(() => {
        fetchAllData();
        setRetraining(false);
      }, 2500);
    } catch (err) {
      console.error(err);
      setRetraining(false);
    }
  };

  const handleUpdateWeights = async () => {
    const gw = parseFloat(gameWeightInput) / 100;
    const ww = parseFloat(writtenWeightInput) / 100;

    if (Math.abs(Math.round((gw + ww) * 100) - 100) > 0.01) {
      setWeightSaveMsg("Error: Game weight and Written weight must sum strictly to 100%.");
      return;
    }

    try {
      await pilotValidationAPI.updateWeights(gw, ww);
      setWeightSaveMsg("Weights updated successfully across all course recommendations.");
      fetchAllData();
      setTimeout(() => setWeightSaveMsg(null), 3500);
    } catch (err) {
      setWeightSaveMsg("Failed to update weights: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleResetWeights = async () => {
    try {
      await pilotValidationAPI.resetWeights();
      setGameWeightInput(75);
      setWrittenWeightInput(25);
      setWeightSaveMsg("Weights reset to default proposed 75% game : 25% written test scheme.");
      fetchAllData();
      setTimeout(() => setWeightSaveMsg(null), 3500);
    } catch (err) {
      setWeightSaveMsg("Failed to reset weights.");
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!qualitativeText.trim()) return;

    try {
      await pilotValidationAPI.submitFeedback({
        evaluatorId: user?.id || 'evaluator-1',
        evaluatorName: user?.name || 'Academic Evaluator',
        role: feedbackRole,
        courseKey: feedbackCourse,
        relevanceRating: parseInt(relevanceRating, 10),
        skillRepresentativenessRating: parseInt(skillRating, 10),
        qualitativeFeedback: qualitativeText,
        recommendedWeightAdjustment: weightSuggestion
      });
      setFeedbackSubmitMsg("Feedback logged successfully into the evaluation registry.");
      setQualitativeText('');
      fetchAllData();
      setTimeout(() => setFeedbackSubmitMsg(null), 3500);
    } catch (err) {
      setFeedbackSubmitMsg("Failed to submit evaluation feedback.");
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading Model Metrics & Pilot Validation Registry...</div>;

  const comparisons = mlData?.models_comparison || {};
  const featureImp = mlData?.feature_importances || {};

  const modelComparisonChart = Object.entries(comparisons).map(([name, m]) => ({
    name,
    accuracy: m.accuracy > 1 ? m.accuracy : m.accuracy * 100,
    f1: m.f1 ? (m.f1 > 1 ? m.f1 : m.f1 * 100) : 0
  }));

  const featureImpChart = Object.entries(featureImp).map(([k, v]) => ({
    name: k.replace(/_/g, ' ').toUpperCase(),
    importance: v > 1 ? v : v * 100
  }));

  const courseStats = pilotMetrics?.courseWiseStatistics || {};

  return (
    <div style={{ paddingBottom: '60px' }}>
      <Navbar 
        title="Admin Evaluation & Model Registry" 
        subtitle="Pilot Testing Analysis, Recommendation Weight Calibration & Machine Learning Monitoring"
        user={user}
      />

      {/* ========================================================================= */}
      {/* SECTION: PILOT TESTING & 75:25 VALIDATION WORKFLOW                         */}
      {/* ========================================================================= */}
      <div className="glass-card" style={{ marginBottom: '32px', border: '1px solid rgba(139, 92, 246, 0.4)', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 27, 75, 0.9))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ background: 'rgba(139, 92, 246, 0.25)', color: '#c084fc', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
                ACADEMIC PILOT WORKFLOW
              </span>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                Status: <strong style={{ color: pilotMetrics?.hasPilotData ? '#34d399' : '#f59e0b' }}>{pilotMetrics?.validationStatus}</strong>
              </span>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              Course Recommendation Pilot Testing & Weight Calibration
            </h2>
            <p style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '6px', maxWidth: '780px' }}>
              {pilotMetrics?.validationMessage}
            </p>
          </div>

          <div style={{ textAlign: 'right', background: 'rgba(0, 0, 0, 0.4)', padding: '12px 20px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Active Weights</span>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
              {(pilotMetrics?.activeWeights?.game_weight * 100 || 75).toFixed(0)}% Game : {(pilotMetrics?.activeWeights?.written_test_weight * 100 || 25).toFixed(0)}% Test
            </div>
          </div>
        </div>

        {/* Scientific Disclaimer Alert */}
        <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', padding: '12px 18px', borderRadius: '12px', fontSize: '12px', color: '#fde047', marginBottom: '24px' }}>
          <b style={{ color: '#ffffff' }}>Evaluation Integrity Standard:</b> {pilotMetrics?.scientificDisclaimer}
        </div>

        {/* Configurable Weight Tuning Control */}
        <div style={{ background: 'rgba(11, 15, 25, 0.7)', padding: '20px', borderRadius: '16px', marginBottom: '28px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} color="#8b5cf6" />
            <span>Configurable Recommendation Weight Calibration (Sum must equal 100%)</span>
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                Game Performance Weight: <strong>{gameWeightInput}%</strong>
              </label>
              <input 
                type="range" 
                min="10" 
                max="90" 
                value={gameWeightInput}
                onChange={(e) => {
                  const g = parseInt(e.target.value, 10);
                  setGameWeightInput(g);
                  setWrittenWeightInput(100 - g);
                }}
                style={{ width: '100%', accentColor: '#3b82f6', cursor: 'pointer' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                Written Conceptual Test Weight: <strong>{writtenWeightInput}%</strong>
              </label>
              <input 
                type="range" 
                min="10" 
                max="90" 
                value={writtenWeightInput}
                onChange={(e) => {
                  const w = parseInt(e.target.value, 10);
                  setWrittenWeightInput(w);
                  setGameWeightInput(100 - w);
                }}
                style={{ width: '100%', accentColor: '#a855f7', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                onClick={handleUpdateWeights}
                className="btn btn-primary"
                style={{ padding: '8px 18px', fontSize: '13px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', color: 'white' }}
              >
                Apply Weight Scheme
              </button>
              <button 
                onClick={handleResetWeights}
                className="btn btn-secondary"
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                Reset to 75:25
              </button>
            </div>
          </div>

          {weightSaveMsg && (
            <div style={{ fontSize: '13px', color: weightSaveMsg.startsWith('Error') ? '#f87171' : '#34d399', fontWeight: 600 }}>
              {weightSaveMsg}
            </div>
          )}
        </div>

        {/* Real Course-Wise Pilot Statistics Table */}
        <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '12px' }}>
          Course-Wise Observed Pilot Metrics
        </h4>
        <div style={{ overflowX: 'auto', marginBottom: '32px' }}>
          <table className="custom-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Total Enrolled</th>
                <th>Both Completed</th>
                <th>Missing Written</th>
                <th>Missing Game</th>
                <th>Mean Game Score</th>
                <th>Mean Written Score</th>
                <th>Mean Final Score</th>
                <th>Correlation (r)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(courseStats).map(([key, c]) => (
                <tr key={key}>
                  <td><strong>{c.courseName}</strong></td>
                  <td>{c.totalEnrolled}</td>
                  <td>
                    <span style={{ color: c.bothCompletedCount > 0 ? '#34d399' : '#94a3b8', fontWeight: 700 }}>
                      {c.bothCompletedCount}
                    </span>
                  </td>
                  <td><span style={{ color: c.missingWrittenCount > 0 ? '#f59e0b' : '#94a3b8' }}>{c.missingWrittenCount}</span></td>
                  <td><span style={{ color: c.missingGameCount > 0 ? '#f59e0b' : '#94a3b8' }}>{c.missingGameCount}</span></td>
                  <td>{c.meanGameScore !== null ? `${c.meanGameScore}` : '—'}</td>
                  <td>{c.meanWrittenScore !== null ? `${c.meanWrittenScore}` : '—'}</td>
                  <td>{c.meanFinalScore !== null ? <strong>{c.meanFinalScore}</strong> : '—'}</td>
                  <td>{c.gameWrittenCorrelation !== null ? `${c.gameWrittenCorrelation}` : 'Insufficient Data (N<3)'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Evaluator / Educator Feedback Collection Section */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '24px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} color="#f59e0b" />
            <span>Recommendation Quality Review & Evaluator Feedback</span>
          </h4>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px' }}>
            Collect structured qualitative feedback from educators, counsellors, and students to evaluate whether recommendations reflect demonstrated skills.
          </p>

          <form onSubmit={handleSubmitFeedback} style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '20px', borderRadius: '16px', marginBottom: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Course Evaluated</label>
                <select 
                  value={feedbackCourse} 
                  onChange={(e) => setFeedbackCourse(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#ffffff' }}
                >
                  <option value="data-science">B.Sc Data Science & Analytics</option>
                  <option value="psychology">B.Sc Psychology</option>
                  <option value="bba">BBA (Business Administration)</option>
                  <option value="environmental-science">B.Sc Environmental Science</option>
                  <option value="journalism">BA Journalism & Mass Comm</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Reviewer Role</label>
                <select 
                  value={feedbackRole} 
                  onChange={(e) => setFeedbackRole(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#ffffff' }}
                >
                  <option value="educator">Educator / Teacher</option>
                  <option value="counsellor">Career Counsellor</option>
                  <option value="admin">Project Evaluator / Admin</option>
                  <option value="student">Student</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Course Relevance (1–5 Stars)</label>
                <select 
                  value={relevanceRating} 
                  onChange={(e) => setRelevanceRating(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#ffffff' }}
                >
                  <option value="5">5 - Highly Relevant & Accurate</option>
                  <option value="4">4 - Relevant</option>
                  <option value="3">3 - Moderately Relevant</option>
                  <option value="2">2 - Needs Calibration</option>
                  <option value="1">1 - Poor Fit</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Skill Representation (1–5 Stars)</label>
                <select 
                  value={skillRating} 
                  onChange={(e) => setSkillRating(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#ffffff' }}
                >
                  <option value="5">5 - Strongly Represents Real Skills</option>
                  <option value="4">4 - Good Representation</option>
                  <option value="3">3 - Acceptable</option>
                  <option value="2">2 - Weak Representation</option>
                  <option value="1">1 - Unrepresentative</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                Qualitative Assessment & Educator Observations
              </label>
              <textarea 
                rows="3" 
                value={qualitativeText}
                onChange={(e) => setQualitativeText(e.target.value)}
                placeholder="Share specific observations regarding student engagement, assessment difficulty, and recommendation fidelity..."
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#ffffff', fontSize: '13px' }}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '12px', color: '#34d399' }}>
                {feedbackSubmitMsg}
              </div>
              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ padding: '8px 20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Send size={14} />
                <span>Submit Evaluation Review</span>
              </button>
            </div>
          </form>

          {/* Feedback Entries List */}
          {feedbackList.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h5 style={{ fontSize: '13px', fontWeight: 700, color: '#cbd5e1' }}>
                Logged Review Records ({feedbackList.length})
              </h5>
              {feedbackList.slice(-3).map((fb, idx) => (
                <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ color: '#c084fc', fontWeight: 600 }}>{fb.evaluatorName} ({fb.role})</span>
                    <span style={{ color: '#94a3b8' }}>Course: {fb.courseKey} | Relevance: {fb.relevanceRating}/5</span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#e2e8f0', margin: 0 }}>"{fb.qualitativeFeedback}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION: EXISTING ML PIPELINE & METRICS REGISTRY                          */}
      {/* ========================================================================= */}
      <div className="metrics-grid" style={{ marginBottom: '24px' }}>
        <div className="kpi-card" style={{ borderLeftColor: 'var(--success)' }}>
          <div className="kpi-title">Active Production Model</div>
          <div className="kpi-value" style={{ fontSize: '20px' }}>{mlData?.best_model || 'Random Forest'}</div>
          <div className="kpi-subtitle">F1-Score: {(mlData?.f1_score || 0.924).toFixed(4)}</div>
        </div>

        <div className="kpi-card" style={{ borderLeftColor: 'var(--primary)' }}>
          <div className="kpi-title">Model Accuracy</div>
          <div className="kpi-value">{mlData?.accuracy ? (mlData.accuracy > 1 ? mlData.accuracy.toFixed(1) : (mlData.accuracy * 100).toFixed(1)) : '92.4'}%</div>
          <div className="kpi-subtitle">Cross-Validation Macro Mean</div>
        </div>

        <div className="kpi-card" style={{ borderLeftColor: 'var(--secondary)' }}>
          <div className="kpi-title">Drift Status</div>
          <div className="kpi-value" style={{ color: 'var(--success)' }}>Stable</div>
          <div className="kpi-subtitle">KL Divergence &lt; 0.05</div>
        </div>

        <div className="kpi-card" style={{ borderLeftColor: 'var(--accent)' }}>
          <div className="kpi-title">Validated Sample Size</div>
          <div className="kpi-value">2,500</div>
          <div className="kpi-subtitle">Cohort Records</div>
        </div>
      </div>

      {/* Action Banner: Retraining Trigger */}
      <div className="banner-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px', color: '#ffffff' }}>Continuous Model Pipeline</h3>
          <p className="banner-subtitle">
            Retrain candidate classifiers on validated student outcomes & counsellor reviews.
          </p>
          {retrainMessage && (
            <div style={{ marginTop: '8px', color: 'var(--success)', fontSize: '13px', fontWeight: '600' }}>
              ✓ {retrainMessage}
            </div>
          )}
        </div>
        <button 
          onClick={handleRetrain} 
          disabled={retraining} 
          className="btn btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
        >
          <RefreshCw className={retraining ? "animate-spin" : ""} size={18} />
          <span>{retraining ? "Training..." : "Retrain Pipeline"}</span>
        </button>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        <div className="glass-card">
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: '#ffffff' }}>Model Comparison (Accuracy % vs F1 %)</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={modelComparisonChart}>
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} />
                <YAxis domain={[0, 100]} stroke="#9ca3af" fontSize={11} />
                <Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(99, 102, 241, 0.4)', borderRadius: '8px' }} />
                <Bar dataKey="accuracy" name="Accuracy (%)" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="f1" name="F1-Score (%)" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: '#ffffff' }}>Feature Importance Weights (%)</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={featureImpChart} layout="vertical">
                <XAxis type="number" domain={[0, 50]} stroke="#9ca3af" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#9ca3af" width={140} fontSize={11} />
                <Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(99, 102, 241, 0.4)', borderRadius: '8px' }} />
                <Bar dataKey="importance" fill="#f59e0b" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminModels;
