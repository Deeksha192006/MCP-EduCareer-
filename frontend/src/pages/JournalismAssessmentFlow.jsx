import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { journalismAPI } from '../services/api';
import NewsroomChallengeGame from '../components/journalism/NewsroomChallengeGame';
import { RefreshCw, AlertCircle, ArrowLeft } from 'lucide-react';

const JournalismAssessmentFlow = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [challenges, setChallenges] = useState([]);
  const [session, setSession] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const studentId = user?.id || 'student-demo-1';

  useEffect(() => {
    initAssessment();
  }, [studentId]);

  const initAssessment = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [startRes, challengesRes] = await Promise.all([
        journalismAPI.startAssessment(studentId),
        journalismAPI.getChallenges()
      ]);
      setSession(startRes.data);
      setChallenges(challengesRes.data);

      if (startRes.data.completed) {
        navigate('/journalism-result');
      }
    } catch (err) {
      console.error("Failed to load Journalism assessment:", err);
      setErrorMsg("Failed to connect to backend server. Please verify the API is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleGameComplete = async ({ submissions, totalTime }) => {
    setSubmitting(true);
    try {
      await journalismAPI.submitGame(studentId, submissions, totalTime);
      navigate('/journalism-result');
    } catch (err) {
      console.error("Error submitting Newsroom Challenge simulation:", err);
      setErrorMsg("Failed to save newsroom results to backend. Please retry.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <RefreshCw size={40} className="spin-icon" style={{ color: '#f59e0b', marginBottom: '16px' }} />
        <h3 style={{ color: '#ffffff', fontSize: '20px' }}>Connecting to Newsroom Wire Feeds...</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Calibrating breaking desks, telemetries, and editorial verification pipelines...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="page-container" style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center' }}>
        <div className="card" style={{ padding: '32px', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
          <AlertCircle size={48} color="#ef4444" style={{ marginBottom: '16px' }} />
          <h3 style={{ color: '#ffffff', marginBottom: '8px' }}>Newsroom Connection Error</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>{errorMsg}</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button onClick={() => navigate('/arts-science-exploration')} className="btn btn-secondary">
              Return to Hub
            </button>
            <button onClick={initAssessment} className="btn btn-primary" style={{ background: '#f59e0b', color: '#0f172a' }}>
              Retry Wire Sync
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', paddingBottom: '40px' }}>
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => navigate('/journalism-intro')}
          className="btn btn-secondary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '13px' }}
        >
          <ArrowLeft size={16} />
          <span>Exit to Overview</span>
        </button>
      </div>

      {submitting ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <RefreshCw size={44} className="spin-icon" style={{ color: '#f59e0b', marginBottom: '16px' }} />
          <h3 style={{ color: '#ffffff', fontSize: '22px' }}>Submitting Newsroom Edition...</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Auditing source corroboration, ethics indices, and lead paragraph structure...
          </p>
        </div>
      ) : (
        <NewsroomChallengeGame
          challenges={challenges}
          onComplete={handleGameComplete}
        />
      )}
    </div>
  );
};

export default JournalismAssessmentFlow;
