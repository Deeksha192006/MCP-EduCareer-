import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cseAPI } from '../services/api';
import { CSE_GAMES_REGISTRY } from '../data/cseGamesRegistry';
import ShortestPathGame from '../components/cse/ShortestPathGame';
import OddOneOutGame from '../components/cse/OddOneOutGame';
import DebugCodeGame from '../components/cse/DebugCodeGame';
import LogicSequenceGame from '../components/cse/LogicSequenceGame';
import AlgorithmPuzzleGame from '../components/cse/AlgorithmPuzzleGame';
import { CheckCircle2, Clock, Play, ArrowRight, ArrowLeft, ShieldAlert, Award, ChevronRight, RefreshCw, BarChart2 } from 'lucide-react';

const CSEAssessmentFlow = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [assessment, setAssessment] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0); // 0..4 = Games 1..5
  const [submittingGame, setSubmittingGame] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    initAssessment();
  }, [user]);

  const initAssessment = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const studentId = user?.id || 'student-demo-1';
      const res = await cseAPI.startAssessment(studentId);
      setAssessment(res.data);
      // Auto-set step based on completed games
      const completedCount = (res.data.gamePerformance || []).filter(g => g.completed).length;
      if (completedCount >= 5) {
        setCurrentStepIndex(4);
      } else {
        setCurrentStepIndex(completedCount);
      }
    } catch (err) {
      console.error('Failed to initialize CSE assessment:', err);
      setErrorMsg('Could not connect to backend server. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Callback when ANY interactive 3-round game completes
  const handleInteractiveGameComplete = async (gameMetrics) => {
    setSubmittingGame(true);
    try {
      const studentId = user?.id || 'student-demo-1';
      const activeGameConfig = CSE_GAMES_REGISTRY[currentStepIndex];

      const payload = {
        studentId,
        gameId: activeGameConfig.gameId,
        score: gameMetrics.score,
        maxScore: gameMetrics.maxScore || 100,
        accuracy: gameMetrics.accuracy,
        timeTaken: gameMetrics.timeTaken,
        attempts: gameMetrics.attempts || 1,
        difficulty: activeGameConfig.difficulty || 'medium'
      };

      const res = await cseAPI.submitGame(payload);
      setAssessment(res.data);

      // Advance to next game or finish
      if (currentStepIndex < CSE_GAMES_REGISTRY.length - 1) {
        setCurrentStepIndex(prev => prev + 1);
      } else {
        await handleFinishAssessment();
      }
    } catch (err) {
      console.error('Error recording gameplay score:', err);
      setErrorMsg('Failed to persist gameplay score to backend.');
    } finally {
      setSubmittingGame(false);
    }
  };

  const handleFinishAssessment = async () => {
    setLoading(true);
    try {
      const studentId = user?.id || 'student-demo-1';
      await cseAPI.completeAssessment(studentId);
      navigate('/engineering-exploration/cse/result');
    } catch (err) {
      console.error('Failed to complete assessment:', err);
      setErrorMsg('Failed to generate final CSE profile.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <RefreshCw size={36} className="spin-icon" style={{ color: 'var(--primary)', marginBottom: '16px' }} />
        <h3>Loading CSE Skill Assessment...</h3>
      </div>
    );
  }

  const activeGame = CSE_GAMES_REGISTRY[currentStepIndex] || CSE_GAMES_REGISTRY[0];
  const activePerf = (assessment?.gamePerformance || []).find(g => g.gameId === activeGame.gameId);

  const renderCurrentGameComponent = () => {
    switch (activeGame.gameId) {
      case 'cse_logic_01':
        return <ShortestPathGame onGameComplete={handleInteractiveGameComplete} />;
      case 'cse_pattern_02':
        return <OddOneOutGame onGameComplete={handleInteractiveGameComplete} />;
      case 'cse_code_03':
        return <DebugCodeGame onGameComplete={handleInteractiveGameComplete} />;
      case 'cse_algo_04':
        return <LogicSequenceGame onGameComplete={handleInteractiveGameComplete} />;
      case 'cse_puzzle_05':
        return <AlgorithmPuzzleGame onGameComplete={handleInteractiveGameComplete} />;
      default:
        return <ShortestPathGame onGameComplete={handleInteractiveGameComplete} />;
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '1050px', margin: '0 auto', padding: '24px' }}>
      {/* Header & Flow Tracker */}
      <div className="card" style={{ padding: '20px', borderRadius: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '700' }}>CSE SKILL ASSESSMENT FLOW</span>
            <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>
              Module Session Progress
            </h2>
          </div>
          <button
            onClick={() => navigate('/engineering-exploration/cse')}
            className="btn btn-outline"
            style={{ padding: '6px 12px', fontSize: '13px' }}
          >
            Exit Assessment
          </button>
        </div>

        {/* Stepper Dots */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
          {CSE_GAMES_REGISTRY.map((game, idx) => {
            const isCompleted = (assessment?.gamePerformance || []).find(g => g.gameId === game.gameId)?.completed;
            const isActive = idx === currentStepIndex;

            return (
              <React.Fragment key={game.gameId}>
                <div
                  onClick={() => setCurrentStepIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 14px',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    background: isActive ? '#eff6ff' : isCompleted ? '#ecfdf5' : '#f8fafc',
                    border: isActive ? '1.5px solid var(--primary)' : isCompleted ? '1.5px solid #10b981' : '1px solid var(--border-color)',
                    whiteSpace: 'nowrap',
                    boxShadow: isActive ? '0 2px 8px rgba(37, 99, 235, 0.15)' : 'none'
                  }}
                >
                  <div style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: isCompleted ? '#10b981' : isActive ? 'var(--primary)' : '#cbd5e1',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: '700'
                  }}>
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: isActive ? '700' : '600',
                    color: isActive ? 'var(--primary)' : isCompleted ? '#059669' : 'var(--text-muted)'
                  }}>
                    Game {idx + 1}
                  </span>
                </div>
                {idx < CSE_GAMES_REGISTRY.length - 1 && (
                  <div style={{ flex: 1, height: '2px', background: isCompleted ? '#10b981' : '#e2e8f0', minWidth: '16px' }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {errorMsg && (
        <div className="card" style={{ padding: '16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', marginBottom: '20px', color: '#b91c1c' }}>
          {errorMsg}
        </div>
      )}

      {/* Main Active Game Card */}
      <div className="card" style={{ padding: '32px', borderRadius: '16px', background: '#ffffff', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '12px', background: '#eff6ff', color: 'var(--primary)', border: '1px solid #bfdbfe', fontWeight: '700' }}>
              GAME {currentStepIndex + 1} OF 5 (3 ROUNDS PER GAME)
            </span>
            <h2 style={{ fontSize: '24px', fontWeight: '800', marginTop: '10px', marginBottom: '4px', color: '#0f172a' }}>
              {activeGame.gameName}
            </h2>
            <div style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: '600' }}>
              Evaluates: {activeGame.skillTested}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <span style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '8px', background: '#f8fafc', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              Difficulty: <strong style={{ color: 'var(--text-main)' }}>{activeGame.difficulty.toUpperCase()}</strong>
            </span>
            <span style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '8px', background: '#f8fafc', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              Est. Time: <strong style={{ color: 'var(--text-main)' }}>{activeGame.estimatedTimeSec}s</strong>
            </span>
          </div>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
          {activeGame.description}
        </p>

        {/* Status of this game */}
        {activePerf?.completed && (
          <div style={{
            padding: '14px 20px',
            borderRadius: '12px',
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#059669' }}>
              <CheckCircle2 size={20} />
              <span style={{ fontWeight: '700' }}>Game Previously Completed</span>
            </div>
            <div style={{ fontSize: '14px', color: '#0f172a' }}>
              Recorded Score: <strong style={{ color: '#059669' }}>{activePerf.score} / 100</strong> ({Math.round((activePerf.accuracy || 0) * 100)}% accuracy)
            </div>
          </div>
        )}

        {/* Render Active 3-Round Interactive Game */}
        {renderCurrentGameComponent()}
      </div>

      {/* Complete Button Footer */}
      <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={handleFinishAssessment}
          className="btn btn-primary"
          style={{ padding: '12px 24px' }}
        >
          <BarChart2 size={18} />
          <span>View Current CSE Skill Profile & Results</span>
        </button>
      </div>
    </div>
  );
};

export default CSEAssessmentFlow;
