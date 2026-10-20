import React, { useState, useEffect } from 'react';
import { 
  RotateCcw, Lightbulb, AlertTriangle, CheckCircle2, ArrowRight, 
  Award, Users, ShieldAlert, Volume2, VolumeX, Play, Sparkles, Undo2 
} from 'lucide-react';
import { gameAudio } from '../../utils/gameAudio';

const MissionariesCannibalsGame = ({ onGameComplete }) => {
  // Game lifecycle: 'intro' | 'playing' | 'completed'
  const [gameState, setGameState] = useState('intro');
  const [difficulty, setDifficulty] = useState('medium'); // 'easy' (2 M, 2 C), 'medium' (3 M, 3 C), 'hard' (3 M, 3 C strict)

  const totalPeople = difficulty === 'easy' ? 2 : 3;

  // Banks: counts of Missionaries and Cannibals
  const [leftM, setLeftM] = useState(3);
  const [leftC, setLeftC] = useState(3);
  const [rightM, setRightM] = useState(0);
  const [rightC, setRightC] = useState(0);

  // Boat state
  const [boatBank, setBoatBank] = useState('left'); // 'left' | 'right'
  const [boatM, setBoatM] = useState(0);
  const [boatC, setBoatC] = useState(0);
  const [boatPositionX, setBoatPositionX] = useState(0); // 0 (left) to 100 (right)
  const [isRowing, setIsRowing] = useState(false);

  // Statistics & Feedback
  const [moveCount, setMoveCount] = useState(0);
  const [history, setHistory] = useState([]);
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'error' | 'success' | 'info', text: string }
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [muted, setMuted] = useState(gameAudio.isMuted());
  const [isShaking, setIsShaking] = useState(false);

  const initGame = (selectedDiff = difficulty) => {
    const count = selectedDiff === 'easy' ? 2 : 3;
    setLeftM(count);
    setLeftC(count);
    setRightM(0);
    setRightC(0);
    setBoatBank('left');
    setBoatM(0);
    setBoatC(0);
    setBoatPositionX(0);
    setIsRowing(false);
    setMoveCount(0);
    setHistory([]);
    setStatusMessage(null);
    setShowHint(false);
    setIsShaking(false);
  };

  const handleStartGame = () => {
    gameAudio.playClick();
    setStartTime(Date.now());
    initGame(difficulty);
    setGameState('playing');
  };

  const toggleSound = () => {
    const isMute = gameAudio.toggleMute();
    setMuted(isMute);
    if (!isMute) gameAudio.playClick();
  };

  // Rule: Cannibals must not outnumber missionaries on either bank when missionaries are present!
  const validateBankSafety = (m, c, bankName) => {
    if (m > 0 && c > m) {
      return `⚠️ Unsafe state on ${bankName}: Cannibals (${c}) outnumber Missionaries (${m})! Missionaries are overwhelmed.`;
    }
    return null;
  };

  // Boarding / Disembarking
  const handleBoardMissionary = () => {
    if (isRowing) return;
    setStatusMessage(null);
    if (boatM + boatC >= 2) {
      gameAudio.playError();
      setStatusMessage({ type: 'error', text: 'Boat is full! Maximum capacity is 2 people.' });
      return;
    }

    if (boatBank === 'left') {
      if (leftM > 0) {
        gameAudio.playMove();
        setLeftM(prev => prev - 1);
        setBoatM(prev => prev + 1);
      }
    } else {
      if (rightM > 0) {
        gameAudio.playMove();
        setRightM(prev => prev - 1);
        setBoatM(prev => prev + 1);
      }
    }
  };

  const handleUnboardMissionary = () => {
    if (isRowing || boatM === 0) return;
    gameAudio.playMove();
    setStatusMessage(null);
    setBoatM(prev => prev - 1);
    if (boatBank === 'left') {
      setLeftM(prev => prev + 1);
    } else {
      setRightM(prev => prev + 1);
    }
  };

  const handleBoardCannibal = () => {
    if (isRowing) return;
    setStatusMessage(null);
    if (boatM + boatC >= 2) {
      gameAudio.playError();
      setStatusMessage({ type: 'error', text: 'Boat is full! Maximum capacity is 2 people.' });
      return;
    }

    if (boatBank === 'left') {
      if (leftC > 0) {
        gameAudio.playMove();
        setLeftC(prev => prev - 1);
        setBoatC(prev => prev + 1);
      }
    } else {
      if (rightC > 0) {
        gameAudio.playMove();
        setRightC(prev => prev - 1);
        setBoatC(prev => prev + 1);
      }
    }
  };

  const handleUnboardCannibal = () => {
    if (isRowing || boatC === 0) return;
    gameAudio.playMove();
    setStatusMessage(null);
    setBoatC(prev => prev - 1);
    if (boatBank === 'left') {
      setLeftC(prev => prev + 1);
    } else {
      setRightC(prev => prev + 1);
    }
  };

  // Row Boat Across River
  const handleRowBoat = () => {
    if (isRowing) return;
    if (boatM + boatC === 0) {
      gameAudio.playError();
      setStatusMessage({ type: 'error', text: 'The boat cannot move by itself! At least 1 passenger must row it.' });
      return;
    }

    // Save previous snapshot for undo
    const snapshot = {
      leftM,
      leftC,
      rightM,
      rightC,
      boatBank,
      boatM,
      boatC,
      boatPositionX
    };

    const nextBank = boatBank === 'left' ? 'right' : 'left';
    setIsRowing(true);
    gameAudio.playPour(); // Oar sound

    // Animate boat translation across river
    setBoatPositionX(nextBank === 'right' ? 100 : 0);

    setTimeout(() => {
      const newLeftM = nextBank === 'right' ? leftM : leftM + boatM;
      const newLeftC = nextBank === 'right' ? leftC : leftC + boatC;
      const newRightM = nextBank === 'right' ? rightM + boatM : rightM;
      const newRightC = nextBank === 'right' ? rightC + boatC : rightC;

      setLeftM(newLeftM);
      setLeftC(newLeftC);
      setRightM(newRightM);
      setRightC(newRightC);
      setBoatBank(nextBank);
      setBoatM(0);
      setBoatC(0);
      setIsRowing(false);
      setMoveCount(prev => prev + 1);
      setHistory(prev => [...prev, snapshot]);

      // Validate constraints
      const errLeft = validateBankSafety(newLeftM, newLeftC, 'Left Bank');
      const errRight = validateBankSafety(newRightM, newRightC, 'Right Bank');
      const conflict = errLeft || errRight;

      if (conflict) {
        gameAudio.playError();
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
        setStatusMessage({
          type: 'error',
          text: conflict
        });
      } else {
        // Check win condition
        if (newRightM === totalPeople && newRightC === totalPeople) {
          gameAudio.playLevelUp();
          setStatusMessage({
            type: 'success',
            text: '🎉 Victory! All Missionaries and Cannibals safely reached the Right Bank!'
          });
          setTimeout(() => {
            setGameState('completed');
          }, 900);
        } else {
          gameAudio.playSuccess();
          setStatusMessage({
            type: 'info',
            text: `Safe crossing! Boat reached the ${nextBank.toUpperCase()} bank.`
          });
        }
      }
    }, 1100);
  };

  const handleUndo = () => {
    if (history.length === 0 || isRowing) return;
    gameAudio.playClick();
    const last = history[history.length - 1];
    setLeftM(last.leftM);
    setLeftC(last.leftC);
    setRightM(last.rightM);
    setRightC(last.rightC);
    setBoatBank(last.boatBank);
    setBoatM(last.boatM);
    setBoatC(last.boatC);
    setBoatPositionX(last.boatPositionX);
    setHistory(prev => prev.slice(0, -1));
    setStatusMessage(null);
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
    const minExpected = difficulty === 'easy' ? 5 : 11;
    let score = 100;
    if (moveCount > minExpected) {
      score = Math.max(50, 100 - (moveCount - minExpected) * 5);
    }

    if (onGameComplete) {
      onGameComplete({
        score,
        maxScore: 100,
        accuracy: score / 100,
        timeTaken,
        attempts: moveCount
      });
    }
  };

  // Cognitive skills metrics
  const logicalSkill = Math.min(96, Math.max(70, Math.round(95 - (moveCount > 11 ? (moveCount - 11) * 3 : 0))));
  const constraintSkill = statusMessage?.type === 'error' ? 80 : 96;
  const planningSkill = Math.min(95, Math.max(68, Math.round(92 - hintsUsed * 5)));

  // -------------------------------------------------------------
  // 1. INTRO SCREEN
  // -------------------------------------------------------------
  if (gameState === 'intro') {
    return (
      <div style={{
        maxWidth: '840px',
        margin: '0 auto',
        background: '#ffffff',
        borderRadius: '20px',
        border: '1.5px solid #e2e8f0',
        padding: '40px 32px',
        boxShadow: '0 12px 36px rgba(15, 23, 42, 0.08)',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: '#f5f3ff',
          color: '#7c3aed',
          padding: '6px 16px',
          borderRadius: '999px',
          fontSize: '13px',
          fontWeight: '700',
          marginBottom: '20px',
          border: '1px solid #ddd6fe'
        }}>
          <Users size={16} /> Game 4 of 5 • Computer Science Exploration
        </div>

        <h1 style={{
          fontSize: '32px',
          fontWeight: '800',
          color: '#0f172a',
          marginBottom: '12px'
        }}>
          Missionaries and Cannibals 🚣
        </h1>

        <p style={{
          fontSize: '16px',
          color: '#475569',
          maxWidth: '620px',
          margin: '0 auto 28px',
          lineHeight: '1.6'
        }}>
          A classic artificial intelligence state-space challenge. Ferry everyone across the river, but never allow Cannibals to outnumber Missionaries on either riverbank!
        </p>

        {/* Difficulty Selection */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#334155', marginBottom: '12px' }}>
            SELECT DIFFICULTY LEVEL:
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={() => { gameAudio.playClick(); setDifficulty('easy'); }}
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                border: difficulty === 'easy' ? '2px solid #10b981' : '1px solid #cbd5e1',
                background: difficulty === 'easy' ? '#ecfdf5' : '#ffffff',
                color: difficulty === 'easy' ? '#065f46' : '#475569',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '14px'
              }}
            >
              🟢 Easy (2 Missionaries, 2 Cannibals)
            </button>
            <button
              onClick={() => { gameAudio.playClick(); setDifficulty('medium'); }}
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                border: difficulty === 'medium' ? '2px solid #7c3aed' : '1px solid #cbd5e1',
                background: difficulty === 'medium' ? '#f5f3ff' : '#ffffff',
                color: difficulty === 'medium' ? '#6d28d9' : '#475569',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '14px'
              }}
            >
              🟡 Medium (3 Missionaries, 3 Cannibals)
            </button>
            <button
              onClick={() => { gameAudio.playClick(); setDifficulty('hard'); }}
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                border: difficulty === 'hard' ? '2px solid #ef4444' : '1px solid #cbd5e1',
                background: difficulty === 'hard' ? '#fef2f2' : '#ffffff',
                color: difficulty === 'hard' ? '#991b1b' : '#475569',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '14px'
              }}
            >
              🔴 Hard (Strict 11-Move Target)
            </button>
          </div>
        </div>

        {/* Start Game Action */}
        <button
          onClick={handleStartGame}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '16px 42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            color: 'white',
            fontSize: '17px',
            fontWeight: '700',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(124, 58, 237, 0.35)',
            transition: 'transform 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <Play size={20} fill="white" />
          <span>START CHALLENGE</span>
        </button>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. RESULT SCREEN
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
          CHALLENGE COMPLETE 🎉
        </h2>
        <p style={{ color: '#64748b', fontSize: '15px', maxWidth: '540px', margin: '0 auto 28px' }}>
          You navigated complex multi-step constraint invariants without leaving any missionary outnumbered!
        </p>

        {/* Metrics Grid */}
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
            <div style={{ fontSize: '30px', fontWeight: '800', color: '#7c3aed' }}>
              {Math.max(50, Math.round(100 - (moveCount > 11 ? (moveCount - 11) * 5 : 0)))} / 100
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Total Moves</div>
            <div style={{ fontSize: '30px', fontWeight: '800', color: '#0f172a' }}>{moveCount}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Difficulty</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#10b981', textTransform: 'capitalize' }}>{difficulty}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Hints Used</div>
            <div style={{ fontSize: '30px', fontWeight: '800', color: '#f59e0b' }}>{hintsUsed}</div>
          </div>
        </div>

        {/* Skill Indicators */}
        <div style={{
          background: '#f5f3ff',
          borderRadius: '16px',
          border: '1px solid #ddd6fe',
          padding: '20px 24px',
          marginBottom: '32px',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Sparkles size={18} color="#7c3aed" />
            <strong style={{ color: '#6d28d9', fontSize: '15px' }}>Cognitive Capabilities Demonstrated:</strong>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
            <div style={{ background: 'white', padding: '12px 16px', borderRadius: '10px', border: '1px solid #ede9fe' }}>
              <div style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>Logical Reasoning</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#7c3aed' }}>{logicalSkill} / 100</div>
            </div>
            <div style={{ background: 'white', padding: '12px 16px', borderRadius: '10px', border: '1px solid #ede9fe' }}>
              <div style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>Constraint Solving</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#7c3aed' }}>{constraintSkill} / 100</div>
            </div>
            <div style={{ background: 'white', padding: '12px 16px', borderRadius: '10px', border: '1px solid #ede9fe' }}>
              <div style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>Planning & Foresight</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#7c3aed' }}>{planningSkill} / 100</div>
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
            background: '#7c3aed',
            color: 'white',
            border: 'none',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(124, 58, 237, 0.3)'
          }}
        >
          <span>Continue to Next Game</span>
          <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 3. PLAYING SCENE
  // -------------------------------------------------------------
  return (
    <div style={{ maxWidth: '920px', margin: '0 auto' }}>

      {/* Top Header Controls Bar */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '1.5px solid #e2e8f0',
        padding: '14px 20px',
        marginBottom: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            background: '#7c3aed',
            color: 'white',
            borderRadius: '8px',
            padding: '5px 12px',
            fontSize: '13px',
            fontWeight: '700'
          }}>
            Game 4 of 5
          </span>
          <span style={{
            background: '#f1f5f9',
            color: '#334155',
            borderRadius: '8px',
            padding: '5px 12px',
            fontSize: '13px',
            fontWeight: '700'
          }}>
            Moves: {moveCount}
          </span>
          <span style={{
            background: '#f5f3ff',
            color: '#7c3aed',
            border: '1px solid #ddd6fe',
            borderRadius: '8px',
            padding: '5px 12px',
            fontSize: '13px',
            fontWeight: '700',
            textTransform: 'capitalize'
          }}>
            {difficulty} Level
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {history.length > 0 && !isRowing && (
            <button
              onClick={handleUndo}
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
              <Undo2 size={14} /> Undo
            </button>
          )}

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
              color: muted ? '#94a3b8' : '#7c3aed'
            }}
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          <button
            onClick={() => initGame(difficulty)}
            title="Restart Challenge"
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

      {/* Safety Constraint Rule Banner */}
      <div style={{
        background: '#fffbeb',
        border: '1.5px solid #fde68a',
        borderRadius: '12px',
        padding: '10px 18px',
        marginBottom: '18px',
        fontSize: '13px',
        color: '#92400e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <strong>⚠️ Invariant Rule:</strong>
        <span>
          Cannibals must NEVER outnumber Missionaries on either bank when Missionaries are present! Boat holds max 2 passengers.
        </span>
      </div>

      {/* ------------------------------------------------------- */}
      {/* LIVE ANIMATED RIVER SCENE CANVAS                       */}
      {/* ------------------------------------------------------- */}
      <div 
        className={isShaking ? 'game-shake' : ''}
        style={{
          background: '#0c4a6e',
          borderRadius: '20px',
          border: '2px solid #0369a1',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(12, 74, 110, 0.25)',
          marginBottom: '20px',
          position: 'relative'
        }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(200px, 1fr) 2fr minmax(200px, 1fr)',
          minHeight: '380px'
        }}>

          {/* ================= LEFT BANK ================= */}
          <div style={{
            background: 'linear-gradient(180deg, #15803d, #166534)',
            padding: '20px 16px',
            borderRight: '4px solid #ca8a04',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            zIndex: 10
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ color: '#dcfce7', fontWeight: '800', fontSize: '14px' }}>
                  🌳 LEFT BANK
                </span>
                <span className="game-bob" style={{ fontSize: '18px' }}>🌲</span>
              </div>

              {/* People on Left Bank */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Missionaries */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  border: '1px solid rgba(255, 255, 255, 0.25)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ color: '#dbeafe', fontSize: '12px', fontWeight: '700' }}>Missionaries ({leftM})</span>
                    {boatBank === 'left' && leftM > 0 && !isRowing && (
                      <button
                        onClick={handleBoardMissionary}
                        style={{
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '3px 8px',
                          fontSize: '11px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        + Board
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', fontSize: '20px' }}>
                    {Array.from({ length: leftM }).map((_, i) => (
                      <span key={`lm-${i}`} className="game-bob">👨‍💼</span>
                    ))}
                    {leftM === 0 && <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>None</span>}
                  </div>
                </div>

                {/* Cannibals */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  border: '1px solid rgba(255, 255, 255, 0.25)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ color: '#fef08a', fontSize: '12px', fontWeight: '700' }}>Cannibals ({leftC})</span>
                    {boatBank === 'left' && leftC > 0 && !isRowing && (
                      <button
                        onClick={handleBoardCannibal}
                        style={{
                          background: '#d97706',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '3px 8px',
                          fontSize: '11px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        + Board
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', fontSize: '20px' }}>
                    {Array.from({ length: leftC }).map((_, i) => (
                      <span key={`lc-${i}`} className="game-bob">🧑‍🌾</span>
                    ))}
                    {leftC === 0 && <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>None</span>}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ color: '#86efac', fontSize: '11px', textAlign: 'center', marginTop: '14px' }}>
              Starting Bank
            </div>
          </div>

          {/* ================= FLOWING RIVER & BOAT ================= */}
          <div style={{
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(180deg, #0284c7, #0369a1 40%, #075985)'
          }}>
            {/* Animated River Waves SVG */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '200%',
              height: '100%',
              pointerEvents: 'none',
              opacity: 0.25,
              animation: 'riverWave 12s linear infinite'
            }}>
              <svg width="100%" height="100%" viewBox="0 0 1000 400" preserveAspectRatio="none">
                <path d="M 0 50 Q 125 30 250 50 T 500 50 T 750 50 T 1000 50 L 1000 400 L 0 400 Z" fill="#38bdf8" />
                <path d="M 0 160 Q 125 140 250 160 T 500 160 T 750 160 T 1000 160 L 1000 400 L 0 400 Z" fill="#0284c7" />
                <path d="M 0 280 Q 125 260 250 280 T 500 280 T 750 280 T 1000 280 L 1000 400 L 0 400 Z" fill="#075985" />
              </svg>
            </div>

            <div style={{
              position: 'absolute',
              top: '20px',
              color: 'rgba(255, 255, 255, 0.4)',
              fontSize: '13px',
              fontWeight: '700',
              letterSpacing: '2px'
            }}>
              ≈ ≈ FLOWING RIVER ≈ ≈
            </div>

            {/* THE BOAT */}
            <div style={{
              position: 'absolute',
              left: `${15 + (boatPositionX * 0.70)}%`,
              bottom: '90px',
              transform: 'translateX(-50%)',
              transition: isRowing ? 'left 1.1s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
              zIndex: 20
            }}>
              <div 
                className={!isRowing ? 'game-bob' : ''}
                style={{
                  background: 'linear-gradient(180deg, #78350f, #451a03)',
                  border: '2px solid #d97706',
                  borderRadius: '12px 12px 28px 28px',
                  padding: '12px 18px',
                  minWidth: '150px',
                  boxShadow: '0 8px 18px rgba(0,0,0,0.4)',
                  textAlign: 'center',
                  color: 'white'
                }}
              >
                {/* Passenger Slots in Boat */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '8px' }}>
                  {/* Missionaries in boat */}
                  {Array.from({ length: boatM }).map((_, i) => (
                    <div
                      key={`bm-${i}`}
                      onClick={handleUnboardMissionary}
                      title="Click to unboard"
                      style={{
                        background: 'rgba(59, 130, 246, 0.4)',
                        border: '1.5px solid #93c5fd',
                        borderRadius: '8px',
                        padding: '4px 8px',
                        fontSize: '20px',
                        cursor: isRowing ? 'default' : 'pointer'
                      }}
                    >
                      👨‍💼
                    </div>
                  ))}

                  {/* Cannibals in boat */}
                  {Array.from({ length: boatC }).map((_, i) => (
                    <div
                      key={`bc-${i}`}
                      onClick={handleUnboardCannibal}
                      title="Click to unboard"
                      style={{
                        background: 'rgba(217, 119, 6, 0.4)',
                        border: '1.5px solid #fde68a',
                        borderRadius: '8px',
                        padding: '4px 8px',
                        fontSize: '20px',
                        cursor: isRowing ? 'default' : 'pointer'
                      }}
                    >
                      🧑‍🌾
                    </div>
                  ))}

                  {/* Empty slots */}
                  {Array.from({ length: 2 - (boatM + boatC) }).map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px dashed rgba(255,255,255,0.3)',
                        borderRadius: '8px',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        color: 'rgba(255,255,255,0.5)'
                      }}
                    >
                      Seat {i + 1}
                    </div>
                  ))}
                </div>

                <div style={{ fontSize: '11px', fontWeight: '800', color: '#fde68a' }}>
                  {isRowing ? '🚣 Crossing River...' : `Boat at ${boatBank.toUpperCase()} Bank`}
                </div>
              </div>
            </div>

            {/* Row Across Button */}
            <div style={{ position: 'absolute', bottom: '20px', zIndex: 25 }}>
              <button
                onClick={handleRowBoat}
                disabled={isRowing || (boatM + boatC === 0)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 28px',
                  borderRadius: '12px',
                  background: isRowing || (boatM + boatC === 0) ? '#64748b' : '#f59e0b',
                  color: '#0f172a',
                  border: 'none',
                  fontSize: '15px',
                  fontWeight: '800',
                  cursor: isRowing || (boatM + boatC === 0) ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                  transition: 'transform 0.15s ease'
                }}
              >
                <span>{boatBank === 'left' ? 'Row to Right Bank ➔' : '⬅ Row to Left Bank'}</span>
              </button>
            </div>
          </div>

          {/* ================= RIGHT BANK ================= */}
          <div style={{
            background: 'linear-gradient(180deg, #15803d, #166534)',
            padding: '20px 16px',
            borderLeft: '4px solid #ca8a04',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            zIndex: 10
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ color: '#dcfce7', fontWeight: '800', fontSize: '14px' }}>
                  🌿 RIGHT BANK
                </span>
                <span className="game-bob" style={{ fontSize: '18px' }}>🏁</span>
              </div>

              {/* People on Right Bank */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Missionaries */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  border: '1px solid rgba(255, 255, 255, 0.25)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ color: '#dbeafe', fontSize: '12px', fontWeight: '700' }}>Missionaries ({rightM})</span>
                    {boatBank === 'right' && rightM > 0 && !isRowing && (
                      <button
                        onClick={handleBoardMissionary}
                        style={{
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '3px 8px',
                          fontSize: '11px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        + Board
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', fontSize: '20px' }}>
                    {Array.from({ length: rightM }).map((_, i) => (
                      <span key={`rm-${i}`} className="game-bob">👨‍💼</span>
                    ))}
                    {rightM === 0 && <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>None</span>}
                  </div>
                </div>

                {/* Cannibals */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  border: '1px solid rgba(255, 255, 255, 0.25)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ color: '#fef08a', fontSize: '12px', fontWeight: '700' }}>Cannibals ({rightC})</span>
                    {boatBank === 'right' && rightC > 0 && !isRowing && (
                      <button
                        onClick={handleBoardCannibal}
                        style={{
                          background: '#d97706',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '3px 8px',
                          fontSize: '11px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        + Board
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', fontSize: '20px' }}>
                    {Array.from({ length: rightC }).map((_, i) => (
                      <span key={`rc-${i}`} className="game-bob">🧑‍🌾</span>
                    ))}
                    {rightC === 0 && <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>None</span>}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ color: '#86efac', fontSize: '11px', textAlign: 'center', marginTop: '14px' }}>
              Goal: All 6 Safely Here
            </div>
          </div>
        </div>
      </div>

      {/* Immediate Visual Feedback Banner */}
      {statusMessage && (
        <div style={{
          background: statusMessage.type === 'error' ? '#fef2f2' : (statusMessage.type === 'success' ? '#f0fdf4' : '#eff6ff'),
          border: `1.5px solid ${statusMessage.type === 'error' ? '#fecaca' : (statusMessage.type === 'success' ? '#bbf7d0' : '#bfdbfe')}`,
          borderRadius: '14px',
          padding: '14px 20px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          animation: 'scaleUp 0.2s ease-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {statusMessage.type === 'error' && <AlertTriangle size={22} color="#dc2626" />}
            {statusMessage.type === 'success' && <CheckCircle2 size={22} color="#16a34a" />}
            {statusMessage.type === 'info' && <Users size={22} color="#7c3aed" />}
            <span style={{
              color: statusMessage.type === 'error' ? '#991b1b' : (statusMessage.type === 'success' ? '#166534' : '#6d28d9'),
              fontSize: '14px',
              fontWeight: '700'
            }}>
              {statusMessage.text}
            </span>
          </div>

          {statusMessage.type === 'error' && history.length > 0 && (
            <button
              onClick={handleUndo}
              style={{
                background: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Undo Unsafe Move
            </button>
          )}
        </div>
      )}

      {/* Hint System */}
      <div style={{ textAlign: 'center' }}>
        {!showHint && (
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
            💡 <strong>Hint:</strong> Start by sending 2 Cannibals across, then 1 Cannibal returns. Next send 2 Cannibals, and 1 returns. Then send 2 Missionaries across, but bring 1 Missionary + 1 Cannibal back to maintain parity!
          </div>
        )}
      </div>

    </div>
  );
};

export default MissionariesCannibalsGame;
