import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Award, 
  ShieldCheck, 
  HelpCircle,
  TrendingUp,
  BrainCircuit,
  Coins
} from 'lucide-react';

const CommerceSimulationGame = ({ 
  gameKey, 
  courseName, 
  gameTitle, 
  levels = [], 
  themeColor = '#0f766e', 
  onComplete,
  isSubmitting = false
}) => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);

  useEffect(() => {
    if (gameFinished) return;
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [gameFinished]);

  const currentLevel = levels[currentLevelIdx] || {};
  const isLastLevel = currentLevelIdx === levels.length - 1;

  const handleSelectOption = (optionId) => {
    if (confirmed) return;
    setSelectedOptionId(optionId);
  };

  const handleConfirmDecision = () => {
    if (!selectedOptionId) return;
    setConfirmed(true);

    const newSubmissions = [
      ...submissions.filter(s => s.level !== currentLevel.level),
      {
        level: currentLevel.level,
        selectedOptionId: selectedOptionId
      }
    ];
    setSubmissions(newSubmissions);
  };

  const handleNextLevel = () => {
    if (isLastLevel) {
      setGameFinished(true);
      if (onComplete) {
        onComplete(newSubmissionsList(), elapsedTime);
      }
    } else {
      setCurrentLevelIdx(prev => prev + 1);
      setSelectedOptionId(null);
      setConfirmed(false);
    }
  };

  const newSubmissionsList = () => {
    return submissions;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!levels || levels.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
        <p style={{ fontSize: '15px', fontWeight: 600 }}>Loading simulation levels from the secure server...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
      
      {/* Top Header Card */}
      <div 
        className="card" 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '16px',
          borderLeft: `4px solid ${themeColor}`
        }}
      >
        <div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: themeColor, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {courseName}
          </span>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
            {gameTitle}
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '14px', fontWeight: 600 }}>
            <Clock size={16} color={themeColor} />
            <span>Time: {formatTime(elapsedTime)}</span>
          </div>

          <div style={{
            padding: '6px 14px',
            borderRadius: '9999px',
            background: `${themeColor}15`,
            border: `1px solid ${themeColor}35`,
            color: themeColor,
            fontWeight: 700,
            fontSize: '13px'
          }}>
            Level {currentLevelIdx + 1} of {levels.length}
          </div>
        </div>
      </div>

      {/* Level Progress Indicator */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {levels.map((lvl, idx) => {
          const isCurrent = idx === currentLevelIdx;
          const isDone = idx < currentLevelIdx || (idx === currentLevelIdx && confirmed);
          return (
            <div 
              key={idx}
              style={{
                flex: 1,
                height: '8px',
                borderRadius: '9999px',
                background: isDone ? themeColor : isCurrent ? `${themeColor}50` : '#e2e8f0',
                transition: 'all 0.3s ease'
              }}
            />
          );
        })}
      </div>

      {/* Main Challenge Card */}
      <div 
        className="card" 
        style={{ 
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '22px'
        }}
      >
        <div>
          <span style={{ 
            fontSize: '12px', 
            fontWeight: 700, 
            padding: '4px 10px', 
            borderRadius: '6px', 
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            border: '1px solid var(--primary-border)'
          }}>
            {currentLevel.title}
          </span>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6, marginTop: '10px' }}>
            {currentLevel.description}
          </p>
        </div>

        {/* Fictional Scenario Box */}
        <div style={{ 
          padding: '20px 22px', 
          borderRadius: '12px', 
          background: '#f8fafc', 
          borderLeft: `4px solid ${themeColor}`,
          borderTop: '1px solid var(--border-color)',
          borderRight: '1px solid var(--border-color)',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: themeColor, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.06em' }}>
            Real-World Industry Scenario
          </div>
          <p style={{ color: 'var(--text-main)', fontSize: '15px', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
            {currentLevel.scenario}
          </p>
        </div>

        {/* Question Prompt */}
        <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
          {currentLevel.challenge}
        </div>

        {/* Options Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {(currentLevel.options || []).map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                disabled={confirmed}
                style={{
                  padding: '16px 20px',
                  borderRadius: '12px',
                  border: isSelected ? `2px solid ${themeColor}` : '1.5px solid var(--border-color)',
                  background: isSelected ? `${themeColor}12` : '#ffffff',
                  color: isSelected ? 'var(--text-main)' : 'var(--text-muted)',
                  textAlign: 'left',
                  fontSize: '15px',
                  lineHeight: 1.5,
                  cursor: confirmed ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? 'var(--shadow-sm)' : 'none'
                }}
              >
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  border: isSelected ? `6px solid ${themeColor}` : '2px solid #cbd5e1',
                  background: '#ffffff',
                  marginTop: '1px',
                  flexShrink: 0
                }} />
                <div style={{ flex: 1, fontWeight: isSelected ? 700 : 500 }}>{opt.text}</div>
              </button>
            );
          })}
        </div>

        {/* Action Button & Confirmation */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
          {!confirmed ? (
            <button
              onClick={handleConfirmDecision}
              disabled={!selectedOptionId}
              className="btn btn-primary"
              style={{
                padding: '12px 28px',
                fontWeight: 700,
                fontSize: '14px',
                background: selectedOptionId ? themeColor : '#e2e8f0',
                color: selectedOptionId ? '#ffffff' : '#94a3b8',
                cursor: selectedOptionId ? 'pointer' : 'not-allowed',
                border: 'none',
                borderRadius: '10px'
              }}
            >
              Confirm Choice
            </button>
          ) : (
            <button
              onClick={handleNextLevel}
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{
                padding: '12px 30px',
                fontWeight: 700,
                fontSize: '14px',
                background: themeColor,
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: isSubmitting ? 'wait' : 'pointer'
              }}
            >
              <span>{isLastLevel ? (isSubmitting ? 'Submitting Evaluation...' : 'Complete & View Results') : 'Next Level'}</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Educational Notice */}
      <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-dim)' }}>
        🛡️ Academic simulation for 12th-standard career exploration. Evaluates practical problem-solving aptitude.
      </div>
    </div>
  );
};

export default CommerceSimulationGame;
