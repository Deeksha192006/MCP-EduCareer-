import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bbaAPI } from '../services/api';
import StartupSimulatorGame from '../components/bba/StartupSimulatorGame';
import { RefreshCw, AlertCircle, ArrowLeft } from 'lucide-react';

const BBAAssessmentFlow = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [rounds, setRounds] = useState([]);
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
      const [startRes, roundsRes] = await Promise.all([
        bbaAPI.startAssessment(studentId),
        bbaAPI.getRounds()
      ]);
      setSession(startRes.data);
      setRounds(roundsRes.data);

      if (startRes.data.completed) {
        navigate('/arts-science-exploration/bba/result');
      }
    } catch (err) {
      console.error("Failed to load BBA simulation:", err);
      setErrorMsg("Failed to connect to backend server. Please verify the API is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleGameComplete = async (submissions, totalElapsedTime) => {
    setSubmitting(true);
    try {
      await bbaAPI.submitGame(studentId, submissions, totalElapsedTime);
      navigate('/arts-science-exploration/bba/result');
    } catch (err) {
      console.error("Error submitting Startup Simulator:", err);
      setErrorMsg("Failed to save simulation results to backend. Please retry.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <RefreshCw size={40} className="spin-icon" style={{ color: '#f59e0b', marginBottom: '16px' }} />
        <h3 style={{ color: '#ffffff', fontSize: '20px' }}>Initializing Venture Simulator...</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading market parameters and seed balance...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="page-container" style={{ maxWidth: '600px', margin: '60px auto', textAlign: 'center' }}>
        <div className="glass-card" style={{ padding: '32px', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
          <AlertCircle size={44} color="#ef4444" style={{ marginBottom: '16px' }} />
          <h3 style={{ color: '#ffffff', fontSize: '20px', marginBottom: '8px' }}>Connection Error</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>{errorMsg}</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button onClick={initAssessment} className="btn btn-primary" style={{ padding: '10px 20px' }}>
              <RefreshCw size={16} />
              <span>Retry</span>
            </button>
            <button onClick={() => navigate('/arts-science-exploration')} className="btn btn-outline" style={{ padding: '10px 20px' }}>
              <ArrowLeft size={16} />
              <span>Back to Hub</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', paddingBottom: '40px' }}>
      <StartupSimulatorGame
        rounds={rounds}
        onComplete={handleGameComplete}
        isSubmitting={submitting}
      />
    </div>
  );
};

export default BBAAssessmentFlow;
