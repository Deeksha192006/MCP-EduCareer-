import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { commerceAPI } from '../../services/api';
import CommerceSimulationGame from '../../components/commerce/CommerceSimulationGame';
import WrittenAssessmentModal from '../../components/written/WrittenAssessmentModal';
import { 
  RefreshCw, 
  ArrowLeft, 
  Award, 
  TrendingUp, 
  ShieldCheck, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  Compass, 
  Sparkles,
  BarChart3
} from 'lucide-react';

const CommerceGameFlowPage = ({ 
  user, 
  gameKey, 
  courseName, 
  gameTitle, 
  themeColor = '#10b981',
  writtenCourseKey
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [gameData, setGameData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  const [showWrittenModal, setShowWrittenModal] = useState(false);

  const studentId = user?.id || 'student-demo-1';

  useEffect(() => {
    loadGame();
  }, [gameKey, studentId]);

  const loadGame = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [levelsRes, startRes] = await Promise.all([
        commerceAPI.getLevels(gameKey),
        commerceAPI.startGame(studentId, gameKey)
      ]);
      setGameData(levelsRes.data);

      if (startRes.data?.completed) {
        setGameResult(startRes.data);
      }
    } catch (err) {
      console.error("Failed to load commerce game:", err);
      setErrorMsg("Failed to connect to backend server. Please verify the API is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleGameComplete = async (submissions, totalElapsedTime) => {
    setIsSubmitting(true);
    try {
      const res = await commerceAPI.submitGame(studentId, gameKey, submissions, totalElapsedTime);
      setGameResult(res.data);
    } catch (err) {
      console.error("Error submitting game evaluation:", err);
      setErrorMsg("Failed to submit game evaluation. Please retry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestart = () => {
    setGameResult(null);
    loadGame();
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <RefreshCw size={40} className="spin-icon" style={{ color: themeColor, marginBottom: '16px' }} />
        <h3 style={{ color: '#ffffff', fontSize: '20px' }}>Initializing {gameTitle}...</h3>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>Loading business scenarios and interactive challenge data</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '60px 20px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ color: '#ef4444', fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>
          Connection Error
        </div>
        <p style={{ color: '#cbd5e1', marginBottom: '24px' }}>{errorMsg}</p>
        <button onClick={loadGame} className="btn btn-primary" style={{ padding: '10px 24px' }}>
          Retry Initialization
        </button>
      </div>
    );
  }

  // Result View
  if (gameResult) {
    const skills = gameResult.skillScores || {};
    return (
      <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
        {/* Banner */}
        <div 
          className="banner-header" 
          style={{ 
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(6, 78, 59, 0.8), rgba(17, 24, 39, 0.95))',
            borderRadius: '20px',
            padding: '28px 32px',
            border: `1px solid ${themeColor}40`,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: themeColor, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Assessment Completed: {courseName}
              </span>
              <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
                {gameTitle} — Performance Report
              </h1>
            </div>

            <button 
              onClick={() => navigate('/commerce-exploration')}
              className="btn btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}
            >
              <ArrowLeft size={16} />
              <span>Back to Commerce Arcade</span>
            </button>
          </div>
        </div>

        {/* Score Summary Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div className="glass-card" style={{ padding: '20px', borderRadius: '14px', background: 'rgba(15, 23, 42, 0.7)', border: `1px solid ${themeColor}40` }}>
            <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Game Score</div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: themeColor, marginTop: '4px' }}>
              {gameResult.gameScore} / 100
            </div>
            <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '4px' }}>
              Contributes 75% toward Final Match Score
            </div>
          </div>

          <div className="glass-card" style={{ padding: '20px', borderRadius: '14px', background: 'rgba(15, 23, 42, 0.7)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Accuracy Rate</div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
              {gameResult.accuracy}%
            </div>
            <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '4px' }}>
              {gameResult.correctCount} of {gameResult.totalLevels} levels correct
            </div>
          </div>

          <div className="glass-card" style={{ padding: '20px', borderRadius: '14px', background: 'rgba(15, 23, 42, 0.7)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Elapsed Time</div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
              {gameResult.totalTime}s
            </div>
            <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '4px' }}>
              Decision-making speed
            </div>
          </div>
        </div>

        {/* 75:25 Recommendation Callout Banner */}
        <div style={{
          padding: '20px 24px',
          borderRadius: '16px',
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a5b4fc', fontSize: '13px', fontWeight: 700 }}>
              <Sparkles size={16} />
              <span>Next Step: Complete Written Assessment (25% Weight)</span>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '14px', marginTop: '4px', maxWidth: '640px', margin: 0 }}>
              The <strong>75:25 recommendation formula</strong> requires both the game score (75%) and the written test score (25%) before calculating your official Course Compatibility Match.
            </p>
          </div>

          <button
            onClick={() => setShowWrittenModal(true)}
            className="btn btn-primary"
            style={{
              padding: '12px 24px',
              fontWeight: 700,
              fontSize: '14px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <BookOpen size={16} />
            <span>Take Written Assessment (25%)</span>
          </button>
        </div>

        {/* Evaluated Skills Breakdown */}
        <div className="glass-card" style={{ padding: '24px', borderRadius: '16px', background: 'rgba(15, 23, 42, 0.7)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={20} color={themeColor} />
            <span>Evaluated Skill Competencies</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {Object.entries(skills).map(([skillName, score]) => (
              <div key={skillName}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{skillName}</span>
                  <span style={{ color: themeColor, fontWeight: 700 }}>{score}%</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: `${score}%`, 
                      background: `linear-gradient(90deg, ${themeColor}, #38bdf8)`,
                      borderRadius: '4px',
                      transition: 'width 0.6s ease'
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Level Breakdown & Educational Review */}
        <div className="glass-card" style={{ padding: '24px', borderRadius: '16px', background: 'rgba(15, 23, 42, 0.7)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', marginBottom: '16px' }}>
            Scenario Level Review & Explanations
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(gameResult.levelBreakdown || []).map((lvl) => (
              <div 
                key={lvl.level}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: lvl.isCorrect ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                  border: lvl.isCorrect ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>
                    {lvl.title}
                  </span>
                  <span style={{ 
                    fontSize: '12px', 
                    fontWeight: 700, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px',
                    color: lvl.isCorrect ? '#34d399' : '#f87171'
                  }}>
                    {lvl.isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                    {lvl.isCorrect ? 'Correct Decision' : 'Incorrect Choice'}
                  </span>
                </div>
                <p style={{ color: '#cbd5e1', fontSize: '13px', lineHeight: '1.5', margin: 0 }}>
                  💡 <strong>Educational Insight:</strong> {lvl.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <button 
            onClick={handleRestart}
            className="btn btn-outline"
            style={{ padding: '10px 20px', fontSize: '13px' }}
          >
            Retry Game Simulation
          </button>

          <button 
            onClick={() => navigate('/commerce-exploration')}
            className="btn btn-primary"
            style={{ padding: '10px 24px', fontSize: '13px' }}
          >
            Return to Commerce Arcade
          </button>
        </div>

        {/* Modal for Written Assessment */}
        {showWrittenModal && (
          <WrittenAssessmentModal
            courseKey={writtenCourseKey}
            courseName={courseName}
            studentId={studentId}
            onClose={() => setShowWrittenModal(false)}
            onCompleted={(res) => {
              console.log("Written test finished:", res);
              setShowWrittenModal(false);
              navigate('/student/recommendations');
            }}
          />
        )}
      </div>
    );
  }

  // Active Game Play View
  return (
    <div style={{ paddingBottom: '40px' }}>
      <button 
        onClick={() => navigate('/commerce-exploration')}
        style={{
          background: 'none',
          border: 'none',
          color: '#94a3b8',
          fontSize: '13px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer',
          marginBottom: '16px'
        }}
      >
        <ArrowLeft size={16} />
        <span>Exit to Commerce Arcade</span>
      </button>

      <CommerceSimulationGame
        gameKey={gameKey}
        courseName={courseName}
        gameTitle={gameTitle}
        levels={gameData?.levels || []}
        themeColor={themeColor}
        onComplete={handleGameComplete}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default CommerceGameFlowPage;
