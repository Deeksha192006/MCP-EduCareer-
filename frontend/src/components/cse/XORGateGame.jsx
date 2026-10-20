import React, { useState, useEffect } from 'react';
import { 
  Zap, CheckCircle2, XCircle, RotateCcw, ArrowRight, Award, 
  Lightbulb, Volume2, VolumeX, Play, ShieldAlert, Cpu, Sparkles 
} from 'lucide-react';
import { gameAudio } from '../../utils/gameAudio';

const XORGateGame = ({ onGameComplete }) => {
  // Game lifecycle states: 'intro' | 'playing' | 'completed'
  const [gameState, setGameState] = useState('intro');
  const [level, setLevel] = useState(1); // 1: Basic (Rounds 1-2), 2: Dynamic (Rounds 3-4), 3: Two-stage cascaded (Round 5)
  const [round, setRound] = useState(1);
  const totalRounds = 5;

  // Circuit inputs
  const [inputA, setInputA] = useState(0);
  const [inputB, setInputB] = useState(0);
  const [inputC, setInputC] = useState(0); // for Level 3 cascaded

  // Gameplay & interaction states
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null); // { correct: bool, text: string }
  const [isAnimatingSignal, setIsAnimatingSignal] = useState(false);
  const [gateGlow, setGateGlow] = useState(false);
  const [outputRevealed, setOutputRevealed] = useState(false);
  const [floatingScore, setFloatingScore] = useState(null);
  const [isShaking, setIsShaking] = useState(false);

  // Score & metrics tracking
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [muted, setMuted] = useState(gameAudio.isMuted());

  // Setup round inputs
  const setupRound = (r) => {
    setSelectedAnswer(null);
    setFeedback(null);
    setShowHint(false);
    setIsAnimatingSignal(false);
    setGateGlow(false);
    setOutputRevealed(false);
    setFloatingScore(null);
    setIsShaking(false);

    if (r <= 2) {
      // Level 1: Basic 2-input XOR
      setLevel(1);
      // Give complementary or matching pairs across rounds
      const a = r === 1 ? 1 : 0;
      const b = r === 1 ? 0 : 0;
      setInputA(a);
      setInputB(b);
      setInputC(0);
    } else if (r <= 4) {
      // Level 2: Dynamic binary patterns
      setLevel(2);
      const a = Math.round(Math.random());
      const b = 1 - a; // guarantee interesting test case
      setInputA(a);
      setInputB(b);
      setInputC(0);
    } else {
      // Level 3: Two-stage cascaded logic (A XOR B) XOR C
      setLevel(3);
      const a = 1;
      const b = 1;
      const c = 1;
      setInputA(a);
      setInputB(b);
      setInputC(c);
    }
  };

  const handleStartGame = () => {
    gameAudio.playClick();
    setStartTime(Date.now());
    setGameState('playing');
    setupRound(1);
  };

  const toggleSound = () => {
    const isMute = gameAudio.toggleMute();
    setMuted(isMute);
    if (!isMute) gameAudio.playClick();
  };

  // Intermediate and final correct values
  const intermediateVal = inputA ^ inputB;
  const correctOutput = level === 3 ? (intermediateVal ^ inputC) : (inputA ^ inputB);

  // Allow student to flip inputs interactively before predicting (optional experimentation)
  const toggleInput = (which) => {
    if (feedback !== null || isAnimatingSignal) return;
    gameAudio.playSwitch();
    if (which === 'A') setInputA(prev => 1 - prev);
    if (which === 'B') setInputB(prev => 1 - prev);
    if (which === 'C') setInputC(prev => 1 - prev);
  };

  const handleSelectAnswer = (ans) => {
    if (feedback !== null || isAnimatingSignal) return;

    gameAudio.playClick();
    setSelectedAnswer(ans);
    setTotalAttempts(prev => prev + 1);
    setIsAnimatingSignal(true);
    gameAudio.playSignal();

    // Staged animation: Signal propagates -> Gate activates -> Output evaluated
    setTimeout(() => {
      setGateGlow(true);
    }, 450);

    setTimeout(() => {
      setIsAnimatingSignal(false);
      setOutputRevealed(true);

      const isCorrect = ans === correctOutput;

      if (isCorrect) {
        gameAudio.playSuccess();
        setCorrectAnswers(prev => prev + 1);
        setScore(prev => prev + 20);
        setFloatingScore('+20');
        setTimeout(() => setFloatingScore(null), 1800);

        setFeedback({
          correct: true,
          text: level === 1
            ? `Correct! Inputs are ${inputA === inputB ? 'IDENTICAL' : 'DIFFERENT'}, so ${inputA} ⊕ ${inputB} = ${ans}.`
            : level === 2
            ? `Excellent! For inputs A=${inputA} and B=${inputB}, different signals produce 1, identical signals produce 0.`
            : `Outstanding! Stage 1 (${inputA} ⊕ ${inputB}) = ${intermediateVal}, then Stage 2 (${intermediateVal} ⊕ ${inputC}) = ${ans}!`
        });
      } else {
        gameAudio.playError();
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);

        setFeedback({
          correct: false,
          text: level < 3
            ? `Incorrect. The correct output is ${correctOutput}. Remember: XOR outputs 1 ONLY when the inputs are DIFFERENT!`
            : `Incorrect. Stage 1 gave ${inputA} ⊕ ${inputB} = ${intermediateVal}. Then ${intermediateVal} ⊕ ${inputC} = ${correctOutput}.`
        });
      }
    }, 850);
  };

  const handleNextRound = () => {
    gameAudio.playClick();
    if (round < totalRounds) {
      const nextR = round + 1;
      setRound(nextR);
      setupRound(nextR);
    } else {
      gameAudio.playLevelUp();
      setGameState('completed');
    }
  };

  const handleRestart = () => {
    gameAudio.playClick();
    setRound(1);
    setScore(0);
    setCorrectAnswers(0);
    setTotalAttempts(0);
    setHintsUsed(0);
    setGameState('playing');
    setupRound(1);
  };

  const handleUseHint = () => {
    if (!showHint) {
      gameAudio.playClick();
      setShowHint(true);
      setHintsUsed(prev => prev + 1);
    }
  };

  const handleFinish = () => {
    gameAudio.playClick();
    const timeTaken = startTime ? Math.round((Date.now() - startTime) / 1000) : 60;
    const accuracy = totalAttempts > 0 ? correctAnswers / totalAttempts : 0;
    const finalScore = Math.min(100, Math.round((correctAnswers / totalRounds) * 100));

    if (onGameComplete) {
      onGameComplete({
        score: finalScore,
        maxScore: 100,
        accuracy: accuracy,
        timeTaken: timeTaken,
        attempts: totalAttempts
      });
    }
  };

  // Skill calculations for display
  const logicalSkill = Math.min(98, Math.max(70, Math.round(75 + (correctAnswers / totalRounds) * 22)));
  const booleanSkill = Math.min(100, Math.max(65, Math.round((correctAnswers / totalRounds) * 100)));
  const patternSkill = Math.min(95, Math.max(70, Math.round(70 + (correctAnswers / totalRounds) * 24)));

  // -------------------------------------------------------------
  // 1. INTRO / START SCREEN
  // -------------------------------------------------------------
  if (gameState === 'intro') {
    return (
      <div style={{
        maxWidth: '820px',
        margin: '0 auto',
        background: '#ffffff',
        borderRadius: '20px',
        border: '1.5px solid #e2e8f0',
        padding: '44px 32px',
        boxShadow: '0 12px 36px rgba(15, 23, 42, 0.08)',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: '#eff6ff',
          color: '#1d4ed8',
          padding: '6px 16px',
          borderRadius: '999px',
          fontSize: '13px',
          fontWeight: '700',
          marginBottom: '20px',
          border: '1px solid #bfdbfe'
        }}>
          <Cpu size={16} /> Game 1 of 5 • Computer Science Exploration
        </div>

        <h1 style={{
          fontSize: '32px',
          fontWeight: '800',
          color: '#0f172a',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}>
          <span>XOR Gate Challenge</span>
          <span className="game-pulse" style={{ display: 'inline-block' }}>⚡</span>
        </h1>

        <p style={{
          fontSize: '16px',
          color: '#475569',
          maxWidth: '620px',
          margin: '0 auto 28px',
          lineHeight: '1.6'
        }}>
          Step inside a real-time digital logic circuit simulator. Toggle binary input switches, observe electron pulse propagation through logic gates, and deduce binary state outputs!
        </p>

        {/* Feature Highlights Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '36px',
          textAlign: 'left'
        }}>
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '16px 20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '18px' }}>🟢</span>
              <strong style={{ color: '#0f172a', fontSize: '14px' }}>Level 1: Basic Gate</strong>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
              Master the foundational 2-input XOR truth table with live signal tracking.
            </p>
          </div>

          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '16px 20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '18px' }}>🟡</span>
              <strong style={{ color: '#0f172a', fontSize: '14px' }}>Level 2: Dynamic Logic</strong>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
              Analyze alternating binary signals and test quick pattern recognition.
            </p>
          </div>

          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '16px 20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '18px' }}>🔴</span>
              <strong style={{ color: '#0f172a', fontSize: '14px' }}>Level 3: Cascaded Gates</strong>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
              Multi-stage logic: feed intermediate gate signals directly into stage 2.
            </p>
          </div>
        </div>

        {/* Start Game Action */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', alignItems: 'center' }}>
          <button
            onClick={handleStartGame}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '16px 42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: 'white',
              fontSize: '17px',
              fontWeight: '700',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(37, 99, 235, 0.35)',
              transition: 'transform 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Play size={20} fill="white" />
            <span>START GAME</span>
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. RESULT / COMPLETION SCREEN
  // -------------------------------------------------------------
  if (gameState === 'completed') {
    return (
      <div style={{
        maxWidth: '820px',
        margin: '0 auto',
        background: '#ffffff',
        borderRadius: '20px',
        border: '1.5px solid #e2e8f0',
        padding: '40px 32px',
        textAlign: 'center',
        boxShadow: '0 12px 36px rgba(15, 23, 42, 0.08)'
      }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)'
        }}>
          <Award size={40} />
        </div>

        <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
          GAME COMPLETE 🎉
        </h2>
        <p style={{ color: '#64748b', fontSize: '15px', maxWidth: '540px', margin: '0 auto 28px' }}>
          You completed the XOR Gate Challenge! Your interactive circuit deductions have been recorded.
        </p>

        {/* Score & Key Performance Metrics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '16px',
          background: '#f8fafc',
          padding: '24px',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          marginBottom: '32px'
        }}>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Score</div>
            <div style={{ fontSize: '30px', fontWeight: '800', color: '#2563eb' }}>{score} / 100</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Correct</div>
            <div style={{ fontSize: '30px', fontWeight: '800', color: '#10b981' }}>{correctAnswers} / {totalRounds}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Attempts</div>
            <div style={{ fontSize: '30px', fontWeight: '800', color: '#0f172a' }}>{totalAttempts}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Hints Used</div>
            <div style={{ fontSize: '30px', fontWeight: '800', color: '#f59e0b' }}>{hintsUsed}</div>
          </div>
        </div>

        {/* Exploratory Skill Profile Radar / Indicators */}
        <div style={{
          background: '#eff6ff',
          borderRadius: '16px',
          border: '1px solid #bfdbfe',
          padding: '20px 24px',
          marginBottom: '32px',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Sparkles size={18} color="#2563eb" />
            <strong style={{ color: '#1e40af', fontSize: '15px' }}>Deductive Skills Demonstrated:</strong>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
            <div style={{ background: 'white', padding: '12px 16px', borderRadius: '10px', border: '1px solid #dbeafe' }}>
              <div style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>Logical Thinking</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#1d4ed8' }}>{logicalSkill} / 100</div>
            </div>
            <div style={{ background: 'white', padding: '12px 16px', borderRadius: '10px', border: '1px solid #dbeafe' }}>
              <div style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>Boolean Reasoning</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#1d4ed8' }}>{booleanSkill} / 100</div>
            </div>
            <div style={{ background: 'white', padding: '12px 16px', borderRadius: '10px', border: '1px solid #dbeafe' }}>
              <div style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>Pattern Recognition</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#1d4ed8' }}>{patternSkill} / 100</div>
            </div>
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '12px', marginBottom: 0 }}>
            * Note: These metrics are exploratory indicators used by the multi-criteria career recommendation system.
          </p>
        </div>

        <button
          onClick={handleFinish}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '16px 42px',
            borderRadius: '12px',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(37, 99, 235, 0.3)'
          }}
        >
          <span>Continue to Next Game</span>
          <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 3. ACTIVE GAME PLAYING SCENE
  // -------------------------------------------------------------
  const levelBadge = level === 1 
    ? { label: 'Level 1: Basic XOR', color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0' }
    : level === 2
    ? { label: 'Level 2: Dynamic Signals', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' }
    : { label: 'Level 3: Cascaded Two-Stage', color: '#ef4444', bg: '#fef2f2', border: '#fecaca' };

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', position: 'relative' }}>
      
      {/* Floating Score +20 Animation */}
      {floatingScore && (
        <div style={{
          position: 'absolute',
          top: '25%',
          right: '15%',
          zIndex: 50,
          color: '#10b981',
          fontSize: '28px',
          fontWeight: '900',
          textShadow: '0 2px 8px rgba(16, 185, 129, 0.4)',
          animation: 'floatScore 1.8s ease-out forwards',
          pointerEvents: 'none'
        }}>
          {floatingScore}
        </div>
      )}

      {/* Top Header Control & Progress Bar */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '1.5px solid #e2e8f0',
        padding: '16px 20px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '12px'
        }}>
          {/* Game & Round Tracker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              background: '#1e40af',
              color: 'white',
              borderRadius: '8px',
              padding: '5px 12px',
              fontSize: '13px',
              fontWeight: '700'
            }}>
              Game 1 of 5
            </span>
            <span style={{
              background: '#f1f5f9',
              color: '#334155',
              borderRadius: '8px',
              padding: '5px 12px',
              fontSize: '13px',
              fontWeight: '700'
            }}>
              Round {round} / {totalRounds}
            </span>
            <span style={{
              background: levelBadge.bg,
              color: levelBadge.color,
              border: `1px solid ${levelBadge.border}`,
              borderRadius: '8px',
              padding: '5px 12px',
              fontSize: '13px',
              fontWeight: '700'
            }}>
              {levelBadge.label}
            </span>
          </div>

          {/* Controls: Score, Sound & Restart */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              fontSize: '15px',
              fontWeight: '700',
              color: '#0f172a',
              background: '#f8fafc',
              padding: '5px 12px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              Score: <span style={{ color: '#2563eb' }}>{score}</span>
            </div>

            {/* Mute/Unmute Button */}
            <button
              onClick={toggleSound}
              title={muted ? 'Unmute Sound' : 'Mute Sound'}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '6px 10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                color: muted ? '#94a3b8' : '#2563eb'
              }}
            >
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            {/* Restart */}
            <button
              onClick={handleRestart}
              title="Restart Game"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '6px 12px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                color: '#475569'
              }}
            >
              <RotateCcw size={14} /> Restart
            </button>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div style={{
          width: '100%',
          height: '8px',
          background: '#f1f5f9',
          borderRadius: '999px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${((round - 1) / totalRounds) * 100}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #3b82f6, #2563eb)',
            borderRadius: '999px',
            transition: 'width 0.4s ease'
          }} />
        </div>
      </div>

      {/* Truth Table Mini Cheatsheet */}
      <div style={{
        background: '#eff6ff',
        border: '1.5px solid #bfdbfe',
        borderRadius: '12px',
        padding: '10px 18px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={16} color="#2563eb" />
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#1e40af' }}>
            XOR Rule: Output is 1 ONLY when inputs are DIFFERENT
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px', fontSize: '12px', fontWeight: '700', color: '#1e3a8a' }}>
          <span style={{ background: 'white', padding: '3px 8px', borderRadius: '5px', border: '1px solid #dbeafe' }}>0 ⊕ 0 = 0</span>
          <span style={{ background: 'white', padding: '3px 8px', borderRadius: '5px', border: '1px solid #dbeafe' }}>0 ⊕ 1 = 1</span>
          <span style={{ background: 'white', padding: '3px 8px', borderRadius: '5px', border: '1px solid #dbeafe' }}>1 ⊕ 0 = 1</span>
          <span style={{ background: 'white', padding: '3px 8px', borderRadius: '5px', border: '1px solid #dbeafe' }}>1 ⊕ 1 = 0</span>
        </div>
      </div>

      {/* Main Interactive Circuit Stage Card */}
      <div 
        className={isShaking ? 'game-shake' : ''}
        style={{
          background: '#0f172a', // Sleek high-tech circuit dark canvas
          borderRadius: '20px',
          border: '2px solid #334155',
          padding: '28px 24px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
          marginBottom: '24px',
          color: 'white'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc', marginBottom: '6px' }}>
            {level === 1 && 'Observe the input switches and predict the XOR output:'}
            {level === 2 && 'Signal pulse active: Deduce the binary state at the output indicator:'}
            {level === 3 && 'Two-Stage Cascade: Evaluate Stage 1 (A ⊕ B) then pass to Stage 2 with C:'}
          </h3>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
            {level < 3 
              ? 'Click switches to test how logic gates react, or directly choose the predicted output.'
              : 'Follow the signal path across both logic gates from left to right.'}
          </p>
        </div>

        {/* ----------------------------------------------------- */}
        {/* SVG INTERACTIVE CIRCUIT CANVAS                        */}
        {/* ----------------------------------------------------- */}
        <div style={{
          width: '100%',
          overflowX: 'auto',
          display: 'flex',
          justifyContent: 'center',
          padding: '10px 0'
        }}>
          {level < 3 ? (
            /* ================================================= */
            /* SINGLE STAGE XOR CIRCUIT (LEVELS 1 & 2)           */
            /* ================================================= */
            <svg viewBox="0 0 740 260" style={{ width: '100%', maxWidth: '720px', height: 'auto' }}>
              <defs>
                <linearGradient id="activeWireGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>
                <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Wire A: Switch A -> Gate Top Input */}
              <path
                d="M 140 70 L 290 70 L 290 95 L 340 95"
                fill="none"
                stroke={inputA === 1 ? '#38bdf8' : '#334155'}
                strokeWidth={inputA === 1 ? '4' : '3'}
                filter={inputA === 1 ? 'url(#neonGlow)' : 'none'}
              />
              {/* Electron pulse on Wire A */}
              {inputA === 1 && (
                <path
                  d="M 140 70 L 290 70 L 290 95 L 340 95"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeDasharray="6 8"
                  style={{ animation: 'electronFlow 0.8s linear infinite' }}
                />
              )}

              {/* Wire B: Switch B -> Gate Bottom Input */}
              <path
                d="M 140 190 L 290 190 L 290 165 L 340 165"
                fill="none"
                stroke={inputB === 1 ? '#38bdf8' : '#334155'}
                strokeWidth={inputB === 1 ? '4' : '3'}
                filter={inputB === 1 ? 'url(#neonGlow)' : 'none'}
              />
              {/* Electron pulse on Wire B */}
              {inputB === 1 && (
                <path
                  d="M 140 190 L 290 190 L 290 165 L 340 165"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeDasharray="6 8"
                  style={{ animation: 'electronFlow 0.8s linear infinite' }}
                />
              )}

              {/* Output Wire: Gate Output -> Bulb */}
              <path
                d="M 450 130 L 590 130"
                fill="none"
                stroke={outputRevealed ? (correctOutput === 1 ? '#10b981' : '#64748b') : (isAnimatingSignal ? '#38bdf8' : '#334155')}
                strokeWidth={outputRevealed || isAnimatingSignal ? '4' : '3'}
                filter={outputRevealed && correctOutput === 1 ? 'url(#neonGlow)' : 'none'}
              />
              {outputRevealed && correctOutput === 1 && (
                <path
                  d="M 450 130 L 590 130"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeDasharray="6 8"
                  style={{ animation: 'electronFlow 0.6s linear infinite' }}
                />
              )}

              {/* SWITCH A (Interactive button) */}
              <g 
                onClick={() => toggleInput('A')} 
                style={{ cursor: feedback ? 'default' : 'pointer' }}
                transform="translate(40, 42)"
              >
                <rect width="90" height="56" rx="10" fill="#1e293b" stroke={inputA === 1 ? '#38bdf8' : '#475569'} strokeWidth="2" />
                <circle cx="28" cy="28" r="14" fill={inputA === 1 ? '#0284c7' : '#334155'} />
                <circle cx="28" cy="28" r="8" fill={inputA === 1 ? '#38bdf8' : '#64748b'} filter={inputA === 1 ? 'url(#neonGlow)' : 'none'} />
                <text x="56" y="24" fill="#94a3b8" fontSize="11" fontWeight="700">IN A</text>
                <text x="56" y="42" fill={inputA === 1 ? '#38bdf8' : '#f8fafc'} fontSize="18" fontWeight="800">{inputA}</text>
              </g>

              {/* SWITCH B (Interactive button) */}
              <g 
                onClick={() => toggleInput('B')} 
                style={{ cursor: feedback ? 'default' : 'pointer' }}
                transform="translate(40, 162)"
              >
                <rect width="90" height="56" rx="10" fill="#1e293b" stroke={inputB === 1 ? '#38bdf8' : '#475569'} strokeWidth="2" />
                <circle cx="28" cy="28" r="14" fill={inputB === 1 ? '#0284c7' : '#334155'} />
                <circle cx="28" cy="28" r="8" fill={inputB === 1 ? '#38bdf8' : '#64748b'} filter={inputB === 1 ? 'url(#neonGlow)' : 'none'} />
                <text x="56" y="24" fill="#94a3b8" fontSize="11" fontWeight="700">IN B</text>
                <text x="56" y="42" fill={inputB === 1 ? '#38bdf8' : '#f8fafc'} fontSize="18" fontWeight="800">{inputB}</text>
              </g>

              {/* XOR GATE SYMBOL */}
              <g transform="translate(340, 80)">
                {/* Outer curved back arc */}
                <path
                  d="M -12 0 Q 8 50 -12 100"
                  fill="none"
                  stroke={gateGlow ? '#38bdf8' : '#64748b'}
                  strokeWidth="3.5"
                />
                {/* Main XOR Gate Body */}
                <path
                  d="M 0 0 Q 20 50 0 100 Q 55 100 110 50 Q 55 0 0 0 Z"
                  fill={gateGlow ? '#1e3a8a' : '#1e293b'}
                  stroke={gateGlow ? '#38bdf8' : '#475569'}
                  strokeWidth="3"
                  filter={gateGlow ? 'url(#neonGlow)' : 'none'}
                />
                <text x="40" y="56" fill={gateGlow ? '#38bdf8' : '#94a3b8'} fontSize="16" fontWeight="800">
                  XOR
                </text>
              </g>

              {/* OUTPUT INDICATOR / BULB */}
              <g transform="translate(590, 92)">
                <rect width="110" height="76" rx="14" fill="#1e293b" stroke={outputRevealed ? (correctOutput === 1 ? '#10b981' : '#ef4444') : '#475569'} strokeWidth="2.5" />
                <circle
                  cx="55"
                  cy="38"
                  r="24"
                  fill={outputRevealed ? (correctOutput === 1 ? '#10b981' : '#334155') : (isAnimatingSignal ? '#0284c7' : '#1e293b')}
                  filter={outputRevealed && correctOutput === 1 ? 'url(#neonGlow)' : 'none'}
                />
                <text
                  x="55"
                  y="46"
                  textAnchor="middle"
                  fill="white"
                  fontSize="22"
                  fontWeight="900"
                >
                  {outputRevealed ? correctOutput : '?'}
                </text>
                <text x="55" y="68" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="700">OUTPUT</text>
              </g>
            </svg>
          ) : (
            /* ================================================= */
            /* TWO-STAGE CASCADED XOR CIRCUIT (LEVEL 3)          */
            /* ================================================= */
            <svg viewBox="0 0 820 280" style={{ width: '100%', maxWidth: '800px', height: 'auto' }}>
              <defs>
                <filter id="neonGlowCascade" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Wires to Gate 1 */}
              <path
                d="M 110 50 L 190 50 L 190 65 L 230 65"
                fill="none"
                stroke={inputA === 1 ? '#38bdf8' : '#334155'}
                strokeWidth="3.5"
              />
              <path
                d="M 110 130 L 190 130 L 190 115 L 230 115"
                fill="none"
                stroke={inputB === 1 ? '#38bdf8' : '#334155'}
                strokeWidth="3.5"
              />

              {/* Intermediate Wire: Gate 1 -> Gate 2 Top Input */}
              <path
                d="M 320 90 L 440 90 L 440 125 L 480 125"
                fill="none"
                stroke={intermediateVal === 1 ? '#38bdf8' : '#475569'}
                strokeWidth={intermediateVal === 1 ? '4' : '3'}
                filter={intermediateVal === 1 ? 'url(#neonGlowCascade)' : 'none'}
              />
              {intermediateVal === 1 && (
                <path
                  d="M 320 90 L 440 90 L 440 125 L 480 125"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeDasharray="6 8"
                  style={{ animation: 'electronFlow 0.8s linear infinite' }}
                />
              )}

              {/* Wire C: Input C -> Gate 2 Bottom Input */}
              <path
                d="M 110 220 L 440 220 L 440 175 L 480 175"
                fill="none"
                stroke={inputC === 1 ? '#38bdf8' : '#334155'}
                strokeWidth={inputC === 1 ? '4' : '3'}
                filter={inputC === 1 ? 'url(#neonGlowCascade)' : 'none'}
              />

              {/* Final Output Wire: Gate 2 -> Final Bulb */}
              <path
                d="M 570 150 L 680 150"
                fill="none"
                stroke={outputRevealed ? (correctOutput === 1 ? '#10b981' : '#64748b') : '#334155'}
                strokeWidth={outputRevealed ? '4' : '3'}
                filter={outputRevealed && correctOutput === 1 ? 'url(#neonGlowCascade)' : 'none'}
              />

              {/* Inputs A, B, C Buttons */}
              <g onClick={() => toggleInput('A')} style={{ cursor: feedback ? 'default' : 'pointer' }} transform="translate(30, 24)">
                <rect width="80" height="50" rx="8" fill="#1e293b" stroke={inputA === 1 ? '#38bdf8' : '#475569'} strokeWidth="2" />
                <text x="40" y="24" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="700">IN A</text>
                <text x="40" y="42" textAnchor="middle" fill={inputA === 1 ? '#38bdf8' : 'white'} fontSize="16" fontWeight="800">{inputA}</text>
              </g>

              <g onClick={() => toggleInput('B')} style={{ cursor: feedback ? 'default' : 'pointer' }} transform="translate(30, 104)">
                <rect width="80" height="50" rx="8" fill="#1e293b" stroke={inputB === 1 ? '#38bdf8' : '#475569'} strokeWidth="2" />
                <text x="40" y="24" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="700">IN B</text>
                <text x="40" y="42" textAnchor="middle" fill={inputB === 1 ? '#38bdf8' : 'white'} fontSize="16" fontWeight="800">{inputB}</text>
              </g>

              <g onClick={() => toggleInput('C')} style={{ cursor: feedback ? 'default' : 'pointer' }} transform="translate(30, 194)">
                <rect width="80" height="50" rx="8" fill="#1e293b" stroke={inputC === 1 ? '#38bdf8' : '#475569'} strokeWidth="2" />
                <text x="40" y="24" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="700">IN C</text>
                <text x="40" y="42" textAnchor="middle" fill={inputC === 1 ? '#38bdf8' : 'white'} fontSize="16" fontWeight="800">{inputC}</text>
              </g>

              {/* GATE 1 */}
              <g transform="translate(230, 50)">
                <path d="M -10 0 Q 6 40 -10 80" fill="none" stroke="#64748b" strokeWidth="3" />
                <path d="M 0 0 Q 16 40 0 80 Q 45 80 90 40 Q 45 0 0 0 Z" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.5" />
                <text x="32" y="46" fill="#38bdf8" fontSize="13" fontWeight="800">XOR 1</text>
                <text x="96" y="25" fill="#a7f3d0" fontSize="11" fontWeight="700">({intermediateVal})</text>
              </g>

              {/* GATE 2 */}
              <g transform="translate(480, 110)">
                <path d="M -10 0 Q 6 40 -10 80" fill="none" stroke="#64748b" strokeWidth="3" />
                <path d="M 0 0 Q 16 40 0 80 Q 45 80 90 40 Q 45 0 0 0 Z" fill={gateGlow ? '#1e3a8a' : '#1e293b'} stroke={gateGlow ? '#38bdf8' : '#475569'} strokeWidth="2.5" />
                <text x="32" y="46" fill={gateGlow ? '#38bdf8' : '#94a3b8'} fontSize="13" fontWeight="800">XOR 2</text>
              </g>

              {/* FINAL BULB */}
              <g transform="translate(680, 112)">
                <rect width="90" height="76" rx="12" fill="#1e293b" stroke={outputRevealed ? (correctOutput === 1 ? '#10b981' : '#ef4444') : '#475569'} strokeWidth="2" />
                <circle cx="45" cy="38" r="22" fill={outputRevealed ? (correctOutput === 1 ? '#10b981' : '#334155') : '#1e293b'} />
                <text x="45" y="46" textAnchor="middle" fill="white" fontSize="20" fontWeight="900">{outputRevealed ? correctOutput : '?'}</text>
                <text x="45" y="66" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="700">FINAL OUT</text>
              </g>
            </svg>
          )}
        </div>

        {/* ----------------------------------------------------- */}
        {/* INTERACTIVE PREDICTION CONTROLS                       */}
        {/* ----------------------------------------------------- */}
        <div style={{
          marginTop: '24px',
          background: '#1e293b',
          borderRadius: '16px',
          padding: '20px',
          textAlign: 'center',
          border: '1px solid #334155'
        }}>
          <p style={{
            fontSize: '15px',
            fontWeight: '700',
            color: '#e2e8f0',
            marginBottom: '16px'
          }}>
            What will the output state be?
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            {/* Button 0 */}
            <button
              disabled={feedback !== null || isAnimatingSignal}
              onClick={() => handleSelectAnswer(0)}
              style={{
                width: '120px',
                height: '56px',
                borderRadius: '12px',
                fontSize: '22px',
                fontWeight: '800',
                cursor: feedback !== null ? 'not-allowed' : 'pointer',
                background: selectedAnswer === 0 
                  ? (feedback ? (feedback.correct ? '#10b981' : '#ef4444') : '#3b82f6')
                  : '#0f172a',
                color: 'white',
                border: selectedAnswer === 0 ? '2px solid white' : '2px solid #475569',
                boxShadow: selectedAnswer === 0 ? '0 0 16px rgba(59, 130, 246, 0.6)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              0
            </button>

            {/* Button 1 */}
            <button
              disabled={feedback !== null || isAnimatingSignal}
              onClick={() => handleSelectAnswer(1)}
              style={{
                width: '120px',
                height: '56px',
                borderRadius: '12px',
                fontSize: '22px',
                fontWeight: '800',
                cursor: feedback !== null ? 'not-allowed' : 'pointer',
                background: selectedAnswer === 1 
                  ? (feedback ? (feedback.correct ? '#10b981' : '#ef4444') : '#3b82f6')
                  : '#0f172a',
                color: 'white',
                border: selectedAnswer === 1 ? '2px solid white' : '2px solid #475569',
                boxShadow: selectedAnswer === 1 ? '0 0 16px rgba(59, 130, 246, 0.6)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              1
            </button>
          </div>
        </div>
      </div>

      {/* Immediate Visual Feedback Banner */}
      {feedback && (
        <div style={{
          background: feedback.correct ? '#f0fdf4' : '#fef2f2',
          border: `1.5px solid ${feedback.correct ? '#bbf7d0' : '#fecaca'}`,
          borderRadius: '14px',
          padding: '18px 24px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          animation: 'scaleUp 0.25s ease-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '240px' }}>
            {feedback.correct ? (
              <CheckCircle2 size={28} color="#15803d" />
            ) : (
              <XCircle size={28} color="#b91c1c" />
            )}
            <div>
              <strong style={{
                color: feedback.correct ? '#15803d' : '#b91c1c',
                fontSize: '15px',
                display: 'block',
                marginBottom: '2px'
              }}>
                {feedback.correct ? 'Brilliant deduction!' : 'Incorrect state'}
              </strong>
              <p style={{
                color: feedback.correct ? '#166534' : '#991b1b',
                fontSize: '14px',
                margin: 0
              }}>
                {feedback.text}
              </p>
            </div>
          </div>

          <button
            onClick={handleNextRound}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '10px',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
            }}
          >
            <span>{round < totalRounds ? 'Next Round' : 'View Challenge Results'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* Hint & Strategy System */}
      <div style={{ textAlign: 'center' }}>
        {!showHint && feedback === null && (
          <button
            onClick={handleUseHint}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Lightbulb size={16} color="#f59e0b" />
            <span>Need a Hint?</span>
          </button>
        )}

        {showHint && (
          <div style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '12px',
            padding: '12px 18px',
            color: '#92400e',
            fontSize: '13px',
            textAlign: 'left',
            maxWidth: '680px',
            margin: '0 auto',
            animation: 'fadeIn 0.3s ease'
          }}>
            💡 <strong>Hint:</strong> {level === 1 && `Look at Input A (${inputA}) and Input B (${inputB}). Are they different? If yes, XOR produces 1. If both are identical (e.g. 0 and 0, or 1 and 1), XOR produces 0.`}
            {level === 2 && `Binary signals with opposite polarity always activate the XOR gate to 1. Matching states collapse to 0.`}
            {level === 3 && `Break it down: Gate 1 does ${inputA} ⊕ ${inputB} = ${intermediateVal}. Then take ${intermediateVal} and XOR with Input C (${inputC}).`}
          </div>
        )}
      </div>

    </div>
  );
};

export default XORGateGame;
