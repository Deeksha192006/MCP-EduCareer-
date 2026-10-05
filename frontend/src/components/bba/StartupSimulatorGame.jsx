import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Play, ArrowRight, Trophy, Sparkles, CheckCircle2, 
  AlertCircle, Clock, ShieldCheck, TrendingUp, DollarSign, Users, Award, RefreshCw
} from 'lucide-react';

const StartupSimulatorGame = ({ rounds = [], onComplete, isSubmitting = false }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [roundStartTime, setRoundStartTime] = useState(Date.now());
  const [confirmed, setConfirmed] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);

  // Dynamic Financial HUD state
  const [cashBalance, setCashBalance] = useState(100000);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [npsScore, setNpsScore] = useState(50);

  useEffect(() => {
    let timer;
    if (gameStarted) {
      timer = setInterval(() => {
        setTotalElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted]);

  const currentRound = rounds[currentIdx] || {};

  const handleStart = () => {
    setGameStarted(true);
    setRoundStartTime(Date.now());
  };

  const handleOptionSelect = (optId) => {
    if (confirmed) return;
    setSelectedOptionId(optId);
  };

  const handleConfirmAnswer = () => {
    if (!selectedOptionId) return;

    const timeSpent = Math.max(1, Math.round((Date.now() - roundStartTime) / 1000));
    const newSubmission = {
      roundId: currentRound.roundId,
      selectedOptionId: selectedOptionId,
      timeTaken: timeSpent
    };

    const chosenOpt = (currentRound.options || []).find(o => o.id === selectedOptionId);
    if (chosenOpt) {
      const cost = chosenOpt.setupCost || 0;
      const rev = chosenOpt.monthlyRevenueImpact || 0;
      const nps = chosenOpt.npsImpact || 0;
      setCashBalance((prev) => Math.max(0, prev - cost + rev));
      setMonthlyRevenue((prev) => Math.max(0, prev + rev));
      setNpsScore((prev) => Math.max(0, Math.min(100, prev + nps)));
    }

    const updated = [...submissions, newSubmission];
    setSubmissions(updated);
    setConfirmed(true);
  };

  const handleNext = () => {
    setConfirmed(false);
    setSelectedOptionId('');

    if (currentIdx + 1 < rounds.length) {
      setCurrentIdx((prev) => prev + 1);
      setRoundStartTime(Date.now());
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
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(234, 88, 12, 0.2))',
          border: '1.5px solid rgba(245, 158, 11, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          color: '#f59e0b'
        }}>
          <Briefcase size={36} />
        </div>

        <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', marginBottom: '12px' }}>
          Startup Simulator: Virtual Venture Management
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6', marginBottom: '28px', maxWidth: '620px', margin: '0 auto 28px' }}>
          You have ₹1,00,000 in seed capital. Navigate 5 multi-round executive dilemmas: business model selection, pricing elasticity, CAC acquisition channels, talent hiring, and surviving an aggressive competitor shock!
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '32px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ color: '#10b981', fontWeight: 700, fontSize: '18px' }}>₹1,00,000</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Initial Seed Treasury</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: '18px' }}>5 Rounds</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Months 1 to 5 Scaling</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ color: '#38bdf8', fontWeight: 700, fontSize: '18px' }}>BBA Alignment</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Commercial & Strategy Score</div>
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
            background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
            boxShadow: '0 4px 20px rgba(245, 158, 11, 0.3)',
            cursor: 'pointer'
          }}
        >
          <Play size={18} />
          <span>Launch Virtual Venture</span>
          <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ padding: '28px', maxWidth: '880px', margin: '0 auto', position: 'relative' }}>
      {/* Financial HUD Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px',
        background: 'rgba(15, 23, 42, 0.85)',
        padding: '14px 20px',
        borderRadius: '14px',
        marginBottom: '20px',
        border: '1px solid rgba(245, 158, 11, 0.3)'
      }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Cash In Treasury</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: cashBalance < 25000 ? '#ef4444' : '#10b981' }}>
            ₹{cashBalance.toLocaleString()}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Monthly Revenue (MRR)</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#38bdf8' }}>
            +₹{monthlyRevenue.toLocaleString()}/mo
          </div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Customer NPS</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#f59e0b' }}>
            {npsScore}/100
          </div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Simulation Time</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#cbd5e1' }}>
            {Math.floor(totalElapsedTime / 60)}:{(totalElapsedTime % 60).toString().padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Round Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {currentRound.skillTested || 'Strategic Management'}
          </span>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', margin: '2px 0 0' }}>
            {currentRound.title || `Round ${currentIdx + 1}`}
          </h2>
        </div>

        <div style={{
          fontSize: '12px',
          fontWeight: 700,
          padding: '4px 12px',
          borderRadius: '20px',
          background: 'rgba(245, 158, 11, 0.15)',
          color: '#f59e0b',
          border: '1px solid rgba(245, 158, 11, 0.3)'
        }}>
          Round {currentIdx + 1} of {rounds.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', marginBottom: '24px', overflow: 'hidden' }}>
        <div style={{
          width: `${((currentIdx + 1) / rounds.length) * 100}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #f59e0b, #ea580c)',
          transition: 'width 0.3s ease'
        }} />
      </div>

      {/* Round Context Narrative */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.75)',
        borderRadius: '14px',
        padding: '18px 20px',
        marginBottom: '20px',
        border: '1px solid rgba(245, 158, 11, 0.25)',
        fontSize: '14.5px',
        color: '#f1f5f9',
        lineHeight: '1.6'
      }}>
        {currentRound.context}
      </div>

      {/* Options List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        {(currentRound.options || []).map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          return (
            <div
              key={opt.id}
              onClick={() => handleOptionSelect(opt.id)}
              style={{
                padding: '16px 20px',
                borderRadius: '12px',
                border: isSelected ? '1.5px solid #f59e0b' : '1px solid var(--border-color)',
                background: isSelected ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.03)',
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
                border: isSelected ? '5px solid #f59e0b' : '2px solid #64748b',
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
          {confirmed ? 'Capital allocation confirmed on server. Balance updated.' : 'Allocate budget and commit to this round’s strategic direction.'}
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
                background: selectedOptionId ? 'linear-gradient(135deg, #f59e0b, #ea580c)' : 'rgba(255, 255, 255, 0.1)',
                opacity: selectedOptionId ? 1 : 0.5,
                cursor: selectedOptionId ? 'pointer' : 'not-allowed'
              }}
            >
              Execute Decision
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
                  <span>Auditing Financial P&L on Server...</span>
                </>
              ) : currentIdx + 1 < rounds.length ? (
                <>
                  <span>Next Month</span>
                  <ArrowRight size={16} />
                </>
              ) : (
                <>
                  <span>Finalize Simulation</span>
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

export default StartupSimulatorGame;
