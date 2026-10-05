import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, Play, ArrowRight, Trophy, Sparkles, CheckCircle2, 
  AlertCircle, Clock, ShieldCheck, HelpCircle, RefreshCw, Users, Info, MessageSquare
} from 'lucide-react';

const MindExplorerGame = ({ scenarios = [], onComplete, isSubmitting = false }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [scenarioStartTime, setScenarioStartTime] = useState(Date.now());
  const [confirmed, setConfirmed] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);

  useEffect(() => {
    let timer;
    if (gameStarted) {
      timer = setInterval(() => {
        setTotalElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted]);

  const currentScenario = scenarios[currentIdx] || {};

  const handleStart = () => {
    setGameStarted(true);
    setScenarioStartTime(Date.now());
  };

  const handleOptionSelect = (optId) => {
    if (confirmed) return;
    setSelectedOptionId(optId);
  };

  const handleConfirmAnswer = () => {
    if (!selectedOptionId) return;

    const timeSpent = Math.max(1, Math.round((Date.now() - scenarioStartTime) / 1000));
    const newSubmission = {
      scenarioId: currentScenario.scenarioId,
      selectedOptionId: selectedOptionId,
      timeTaken: timeSpent
    };

    const updated = [...submissions, newSubmission];
    setSubmissions(updated);
    setConfirmed(true);
  };

  const handleNext = () => {
    setConfirmed(false);
    setSelectedOptionId('');

    if (currentIdx + 1 < scenarios.length) {
      setCurrentIdx((prev) => prev + 1);
      setScenarioStartTime(Date.now());
    } else {
      if (onComplete) {
        onComplete(submissions, totalElapsedTime);
      }
    }
  };

  if (!gameStarted) {
    return (
      <div className="glass-card" style={{ padding: '36px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(139, 92, 246, 0.2))',
          border: '1.5px solid rgba(236, 72, 153, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          color: '#ec4899'
        }}>
          <HeartHandshake size={36} />
        </div>

        <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', marginBottom: '12px' }}>
          Mind Explorer: Social & Emotional Decision Lab
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px', maxWidth: '620px', margin: '0 auto 24px' }}>
          Explore real-life social dynamics, active empathy, non-verbal cues, and conflict mediation. Choose how you would act in 5 challenging interpersonal situations and discover the consequence of each path.
        </p>

        {/* Ethical Notice Banner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(236, 72, 153, 0.08)', padding: '12px 18px', borderRadius: '12px', border: '1px solid rgba(236, 72, 153, 0.25)', maxWidth: '640px', margin: '0 auto 28px', textAlign: 'left' }}>
          <Info size={20} color="#ec4899" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '12.5px', color: '#cbd5e1', lineHeight: '1.4' }}>
            <strong>Ethical Notice:</strong> This simulation is an exploratory educational exercise in social reasoning. It does <em>not</em> diagnose mental health, measure psychological traits, or evaluate your personal psychology.
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '32px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ color: '#ec4899', fontWeight: 700, fontSize: '18px' }}>5 Dilemmas</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Real Interpersonal Scenarios</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ color: '#38bdf8', fontWeight: 700, fontSize: '18px' }}>Consequences</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Multi-Perspective Outcomes</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ color: '#10b981', fontWeight: 700, fontSize: '18px' }}>B.Sc. Psychology</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Behavioral Sciences Match</div>
          </div>
        </div>

        <button 
          onClick={handleStart}
          className="btn btn-primary"
          style={{
            padding: '14px 36px',
            fontSize: '16px',
            fontWeight: 700,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
            boxShadow: '0 4px 20px rgba(236, 72, 153, 0.3)',
            cursor: 'pointer'
          }}
        >
          <Play size={18} />
          <span>Enter Mind Explorer</span>
          <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ padding: '28px', maxWidth: '880px', margin: '0 auto', position: 'relative' }}>
      {/* Header & Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#ec4899', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {currentScenario.skillTested || 'Social Reasoning'}
          </span>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', margin: '2px 0 0' }}>
            {currentScenario.title || `Scenario ${currentIdx + 1}`}
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
            <Clock size={16} color="#ec4899" />
            <span>{Math.floor(totalElapsedTime / 60)}:{(totalElapsedTime % 60).toString().padStart(2, '0')}</span>
          </div>
          <div style={{
            fontSize: '12px',
            fontWeight: 700,
            padding: '4px 12px',
            borderRadius: '20px',
            background: 'rgba(236, 72, 153, 0.15)',
            color: '#ec4899',
            border: '1px solid rgba(236, 72, 153, 0.3)'
          }}>
            Dilemma {currentIdx + 1} of {scenarios.length}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', marginBottom: '24px', overflow: 'hidden' }}>
        <div style={{
          width: `${((currentIdx + 1) / scenarios.length) * 100}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #ec4899, #8b5cf6)',
          transition: 'width 0.3s ease'
        }} />
      </div>

      {/* Scenario Context Box */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.75)',
        borderRadius: '14px',
        padding: '20px',
        marginBottom: '20px',
        border: '1px solid rgba(236, 72, 153, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#f472b6', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase' }}>
          <MessageSquare size={16} />
          <span>Situational Context</span>
        </div>
        <p style={{ color: '#f1f5f9', fontSize: '14.5px', lineHeight: '1.6', margin: '0 0 14px' }}>
          {currentScenario.context}
        </p>
        <div style={{ background: 'rgba(236, 72, 153, 0.1)', padding: '10px 14px', borderRadius: '8px', borderLeft: '3px solid #ec4899', fontSize: '13.5px', color: '#fbcfe8', fontWeight: 600 }}>
          {currentScenario.dilemma}
        </div>
      </div>

      {/* Options List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        {(currentScenario.options || []).map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          return (
            <div
              key={opt.id}
              onClick={() => handleOptionSelect(opt.id)}
              style={{
                padding: '16px 20px',
                borderRadius: '12px',
                border: isSelected ? '1.5px solid #ec4899' : '1px solid var(--border-color)',
                background: isSelected ? 'rgba(236, 72, 153, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                color: isSelected ? '#ffffff' : '#cbd5e1',
                cursor: confirmed ? 'default' : 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}
            >
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: isSelected ? '5px solid #ec4899' : '2px solid #64748b',
                background: isSelected ? '#ffffff' : 'transparent',
                marginTop: '2px',
                flexShrink: 0
              }} />
              <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
                {opt.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {confirmed ? 'Decision recorded on server. Consequence logged.' : 'Choose the action you believe reflects the most thoughtful response.'}
        </div>

        <div>
          {!confirmed ? (
            <button
              onClick={handleConfirmAnswer}
              disabled={!selectedOptionId}
              className="btn btn-primary"
              style={{
                padding: '10px 24px',
                fontWeight: 700,
                borderRadius: '8px',
                background: selectedOptionId ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : 'rgba(255, 255, 255, 0.1)',
                opacity: selectedOptionId ? 1 : 0.5,
                cursor: selectedOptionId ? 'pointer' : 'not-allowed'
              }}
            >
              Commit Decision
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{
                padding: '10px 24px',
                fontWeight: 700,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={16} className="spin-icon" />
                  <span>Evaluating Server Submission...</span>
                </>
              ) : currentIdx + 1 < scenarios.length ? (
                <>
                  <span>Next Dilemma</span>
                  <ArrowRight size={16} />
                </>
              ) : (
                <>
                  <span>Finalize Mind Explorer</span>
                  <CheckCircle2 size={16} />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MindExplorerGame;
