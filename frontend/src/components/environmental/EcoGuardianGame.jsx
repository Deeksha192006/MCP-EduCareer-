import React, { useState, useEffect } from 'react';
import { 
  Leaf, Play, ArrowRight, Trophy, Sparkles, CheckCircle2, 
  AlertCircle, Clock, ShieldCheck, Wind, Droplets, Zap, Trash2, DollarSign, RefreshCw
} from 'lucide-react';

const EcoGuardianGame = ({ challenges = [], onComplete, isSubmitting = false }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [challengeStartTime, setChallengeStartTime] = useState(Date.now());
  const [confirmed, setConfirmed] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);

  // Dynamic Town Ecological Indicators
  const [aqi, setAqi] = useState(185);
  const [cleanEnergy, setCleanEnergy] = useState(15);
  const [waterReserves, setWaterReserves] = useState(35);
  const [wasteDiverted, setWasteDiverted] = useState(20);
  const [budgetRemaining, setBudgetRemaining] = useState(150000);

  useEffect(() => {
    let timer;
    if (gameStarted) {
      timer = setInterval(() => {
        setTotalElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted]);

  const currentChallenge = challenges[currentIdx] || {};

  const handleStart = () => {
    setGameStarted(true);
    setChallengeStartTime(Date.now());
  };

  const handleOptionSelect = (optId) => {
    if (confirmed) return;
    setSelectedOptionId(optId);
  };

  const handleConfirmAnswer = () => {
    if (!selectedOptionId) return;

    const timeSpent = Math.max(1, Math.round((Date.now() - challengeStartTime) / 1000));
    const newSubmission = {
      challengeId: currentChallenge.challengeId,
      selectedOptionId: selectedOptionId,
      timeTaken: timeSpent
    };

    const chosenOpt = (currentChallenge.options || []).find(o => o.id === selectedOptionId);
    if (chosenOpt) {
      const cost = chosenOpt.cost || 0;
      const aqiChange = chosenOpt.aqiDelta || 0;
      const energyChange = chosenOpt.cleanEnergyDelta || 0;
      const waterChange = chosenOpt.waterDelta || 0;
      const wasteChange = chosenOpt.wasteDelta || 0;

      setBudgetRemaining((prev) => Math.max(0, prev - cost));
      setAqi((prev) => Math.max(20, Math.min(300, prev + aqiChange)));
      setCleanEnergy((prev) => Math.max(0, Math.min(100, prev + energyChange)));
      setWaterReserves((prev) => Math.max(0, Math.min(100, prev + waterChange)));
      setWasteDiverted((prev) => Math.max(0, Math.min(100, prev + wasteChange)));
    }

    const updated = [...submissions, newSubmission];
    setSubmissions(updated);
    setConfirmed(true);
  };

  const handleNext = () => {
    setConfirmed(false);
    setSelectedOptionId('');

    if (currentIdx + 1 < challenges.length) {
      setCurrentIdx((prev) => prev + 1);
      setChallengeStartTime(Date.now());
    } else {
      if (onComplete) {
        onComplete(submissions, totalElapsedTime);
      }
    }
  };

  const getAqiColor = (val) => {
    if (val <= 50) return '#10b981';
    if (val <= 100) return '#38bdf8';
    if (val <= 150) return '#f59e0b';
    return '#ef4444';
  };

  const getAqiLabel = (val) => {
    if (val <= 50) return 'Good';
    if (val <= 100) return 'Moderate';
    if (val <= 150) return 'Unhealthy';
    return 'Hazardous';
  };

  if (!gameStarted) {
    return (
      <div className="glass-card" style={{ padding: '36px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2))',
          border: '1.5px solid rgba(16, 185, 129, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          color: '#10b981'
        }}>
          <Leaf size={36} />
        </div>

        <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', marginBottom: '12px' }}>
          Eco Guardian: Sustainable Valley Simulation
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6', marginBottom: '28px', maxWidth: '620px', margin: '0 auto 28px' }}>
          Take the oath as Verdant Valley's Chief Sustainability Officer. Balance a ₹1,50,000 municipal budget while solving severe smog, groundwater exhaustion, landfill fires, river eutrophication, and urban heat waves!
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '32px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ color: '#10b981', fontWeight: 700, fontSize: '18px' }}>5 Systems</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Air, Water, Energy, Waste, Heat</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ color: '#38bdf8', fontWeight: 700, fontSize: '18px' }}>₹1,50,000</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Municipal Green Budget</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: '18px' }}>Systems Ecology</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>B.Sc. Environmental Science</div>
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
            background: 'linear-gradient(135deg, #10b981, #06b6d4)',
            boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
            cursor: 'pointer'
          }}
        >
          <Play size={18} />
          <span>Assume Town Governance</span>
          <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ padding: '28px', maxWidth: '880px', margin: '0 auto', position: 'relative' }}>
      {/* Town Environmental Dashboard Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '12px',
        background: 'rgba(15, 23, 42, 0.85)',
        padding: '16px 20px',
        borderRadius: '14px',
        marginBottom: '20px',
        border: '1px solid rgba(16, 185, 129, 0.3)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            <Wind size={14} color={getAqiColor(aqi)} />
            <span>Air Quality (AQI)</span>
          </div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: getAqiColor(aqi) }}>
            {aqi} <span style={{ fontSize: '11px', fontWeight: 600 }}>({getAqiLabel(aqi)})</span>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            <Zap size={14} color="#38bdf8" />
            <span>Clean Energy</span>
          </div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#38bdf8' }}>
            {cleanEnergy}%
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            <Droplets size={14} color="#06b6d4" />
            <span>Water Reserves</span>
          </div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: waterReserves < 40 ? '#ef4444' : '#06b6d4' }}>
            {waterReserves}%
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            <Trash2 size={14} color="#10b981" />
            <span>Waste Diverted</span>
          </div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#10b981' }}>
            {wasteDiverted}%
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            <DollarSign size={14} color="#f59e0b" />
            <span>Budget Balance</span>
          </div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#f59e0b' }}>
            ₹{budgetRemaining.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Challenge Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {currentChallenge.skillTested || 'Systems Thinking'}
          </span>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', margin: '2px 0 0' }}>
            {currentChallenge.title || `Challenge ${currentIdx + 1}`}
          </h2>
        </div>

        <div style={{
          fontSize: '12px',
          fontWeight: 700,
          padding: '4px 12px',
          borderRadius: '20px',
          background: 'rgba(16, 185, 129, 0.15)',
          color: '#10b981',
          border: '1px solid rgba(16, 185, 129, 0.3)'
        }}>
          Challenge {currentIdx + 1} of {challenges.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', marginBottom: '24px', overflow: 'hidden' }}>
        <div style={{
          width: `${((currentIdx + 1) / challenges.length) * 100}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #10b981, #06b6d4)',
          transition: 'width 0.3s ease'
        }} />
      </div>

      {/* Challenge Context Box */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.75)',
        borderRadius: '14px',
        padding: '18px 20px',
        marginBottom: '20px',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        fontSize: '14.5px',
        color: '#f1f5f9',
        lineHeight: '1.6'
      }}>
        {currentChallenge.context}
      </div>

      {/* Options List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        {(currentChallenge.options || []).map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          return (
            <div
              key={opt.id}
              onClick={() => handleOptionSelect(opt.id)}
              style={{
                padding: '16px 20px',
                borderRadius: '12px',
                border: isSelected ? '1.5px solid #10b981' : '1px solid var(--border-color)',
                background: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
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
                border: isSelected ? '5px solid #10b981' : '2px solid #64748b',
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
          {confirmed ? 'Environmental policy ratified on server. Town health updated.' : 'Choose the ecological solution that creates sustainable root-cause recovery.'}
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
                background: selectedOptionId ? 'linear-gradient(135deg, #10b981, #06b6d4)' : 'rgba(255, 255, 255, 0.1)',
                opacity: selectedOptionId ? 1 : 0.5,
                cursor: selectedOptionId ? 'pointer' : 'not-allowed'
              }}
            >
              Ratify Solution
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
                  <span>Evaluating Systems Model on Server...</span>
                </>
              ) : currentIdx + 1 < challenges.length ? (
                <>
                  <span>Next Challenge</span>
                  <ArrowRight size={16} />
                </>
              ) : (
                <>
                  <span>Finalize Town Audit</span>
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

export default EcoGuardianGame;
