import React, { useState, useEffect } from 'react';
import { 
  RotateCcw, Lightbulb, Award, ArrowRight, Droplets, CheckCircle2, 
  Volume2, VolumeX, Play, Sparkles, Undo2, ArrowRightLeft, Target 
} from 'lucide-react';
import { gameAudio } from '../../utils/gameAudio';

const LEVELS = [
  {
    level: 1,
    title: "Level 1 (Easy)",
    capA: 5,
    capB: 3,
    target: 4,
    minMoves: 6,
    hint: "1. Fill Jug A (5L). 2. Pour A into B (A has 2L, B has 3L). 3. Empty B. 4. Transfer the 2L from A into B. 5. Fill A (5L). 6. Pour A into B until B is full (needs 1L). Jug A now has exactly 4 Litres!"
  },
  {
    level: 2,
    title: "Level 2 (Medium)",
    capA: 7,
    capB: 4,
    target: 5,
    minMoves: 6,
    hint: "1. Fill Jug A (7L). 2. Pour into B (B has 4L, A has 3L). 3. Empty B. 4. Transfer 3L from A to B. 5. Fill A (7L). 6. Pour 1L from A into B to fill B (4L). Jug A has exactly 5 Litres left!"
  },
  {
    level: 3,
    title: "Level 3 (Hard)",
    capA: 8,
    capB: 5,
    target: 6,
    minMoves: 6,
    hint: "1. Fill Jug A (8L). 2. Pour into B (leaves 3L in A). 3. Empty B. 4. Transfer 3L into B. 5. Fill A (8L). 6. Pour 2L from A into B to fill it. Jug A now has exactly 6 Litres!"
  }
];

const WaterJugGame = ({ onGameComplete }) => {
  // Game lifecycle: 'intro' | 'playing' | 'completed'
  const [gameState, setGameState] = useState('intro');
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const currentLevel = LEVELS[currentLevelIdx];

  const [jugA, setJugA] = useState(0);
  const [jugB, setJugB] = useState(0);
  const [moveCount, setMoveCount] = useState(0);
  const [history, setHistory] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [totalOperations, setTotalOperations] = useState(0);
  const [muted, setMuted] = useState(gameAudio.isMuted());

  // Animation visual states: 'filling-A' | 'filling-B' | 'pouring-A-to-B' | 'pouring-B-to-A' | 'emptying-A' | 'emptying-B' | null
  const [animatingAction, setAnimatingAction] = useState(null);
  const [isShaking, setIsShaking] = useState(false);

  const initLevel = (idx = currentLevelIdx) => {
    setJugA(0);
    setJugB(0);
    setMoveCount(0);
    setHistory([]);
    setShowHint(false);
    setLevelCompleted(false);
    setAnimatingAction(null);
  };

  const handleStartGame = () => {
    gameAudio.playClick();
    setStartTime(Date.now());
    setGameState('playing');
    initLevel(0);
  };

  const toggleSound = () => {
    const isMute = gameAudio.toggleMute();
    setMuted(isMute);
    if (!isMute) gameAudio.playClick();
  };

  const checkTargetReached = (valA, valB) => {
    if (valA === currentLevel.target || valB === currentLevel.target) {
      gameAudio.playSuccess();
      setLevelCompleted(true);
      if (!completedLevels.includes(currentLevel.level)) {
        setCompletedLevels(prev => [...prev, currentLevel.level]);
      }
    }
  };

  // Generic state transition with animation delay
  const executeAnimatedMove = (actionName, newA, newB) => {
    if (levelCompleted || animatingAction) return;

    setAnimatingAction(actionName);
    gameAudio.playPour();

    setTimeout(() => {
      setHistory(prev => [...prev, { a: jugA, b: jugB }]);
      setJugA(newA);
      setJugB(newB);
      setMoveCount(prev => prev + 1);
      setTotalOperations(prev => prev + 1);
      setAnimatingAction(null);
      checkTargetReached(newA, newB);
    }, 650);
  };

  // Actions
  const handleFillA = () => {
    if (jugA >= currentLevel.capA) return;
    executeAnimatedMove('filling-A', currentLevel.capA, jugB);
  };

  const handleFillB = () => {
    if (jugB >= currentLevel.capB) return;
    executeAnimatedMove('filling-B', jugA, currentLevel.capB);
  };

  const handleEmptyA = () => {
    if (jugA <= 0) return;
    executeAnimatedMove('emptying-A', 0, jugB);
  };

  const handleEmptyB = () => {
    if (jugB <= 0) return;
    executeAnimatedMove('emptying-B', jugA, 0);
  };

  const handlePourAtoB = () => {
    if (jugA <= 0 || jugB >= currentLevel.capB) return;
    const spaceInB = currentLevel.capB - jugB;
    const transfer = Math.min(jugA, spaceInB);
    executeAnimatedMove('pouring-A-to-B', jugA - transfer, jugB + transfer);
  };

  const handlePourBtoA = () => {
    if (jugB <= 0 || jugA >= currentLevel.capA) return;
    const spaceInA = currentLevel.capA - jugA;
    const transfer = Math.min(jugB, spaceInA);
    executeAnimatedMove('pouring-B-to-A', jugA + transfer, jugB - transfer);
  };

  const handleUndo = () => {
    if (history.length === 0 || levelCompleted || animatingAction) return;
    gameAudio.playClick();
    const last = history[history.length - 1];
    setJugA(last.a);
    setJugB(last.b);
    setHistory(prev => prev.slice(0, -1));
  };

  const handleNextLevel = () => {
    gameAudio.playClick();
    if (currentLevelIdx < LEVELS.length - 1) {
      const nextIdx = currentLevelIdx + 1;
      setCurrentLevelIdx(nextIdx);
      initLevel(nextIdx);
    } else {
      gameAudio.playLevelUp();
      setGameState('completed');
    }
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
    // Efficiency scoring
    const expectedMoves = 18; // total across 3 levels (~6 moves each)
    const score = Math.min(100, Math.max(60, 100 - (totalOperations > expectedMoves ? (totalOperations - expectedMoves) * 4 : 0)));

    if (onGameComplete) {
      onGameComplete({
        score,
        maxScore: 100,
        accuracy: 1.0,
        timeTaken,
        attempts: totalOperations
      });
    }
  };

  // Liquid heights
  const pctA = Math.round((jugA / currentLevel.capA) * 100);
  const pctB = Math.round((jugB / currentLevel.capB) * 100);

  // Skill indicators
  const algoSkill = Math.min(98, Math.max(72, Math.round(96 - (totalOperations > 20 ? (totalOperations - 20) * 3 : 0))));
  const numReasoningSkill = 92;
  const probSolvingSkill = Math.min(95, Math.max(70, Math.round(92 - hintsUsed * 5)));

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
          background: '#f0f9ff',
          color: '#0284c7',
          padding: '6px 16px',
          borderRadius: '999px',
          fontSize: '13px',
          fontWeight: '700',
          marginBottom: '20px',
          border: '1px solid #bae6fd'
        }}>
          <Droplets size={16} /> Game 3 of 5 • Computer Science Exploration
        </div>

        <h1 style={{
          fontSize: '32px',
          fontWeight: '800',
          color: '#0f172a',
          marginBottom: '12px'
        }}>
          Water Jug Challenge 💧
        </h1>

        <p style={{
          fontSize: '16px',
          color: '#475569',
          maxWidth: '620px',
          margin: '0 auto 28px',
          lineHeight: '1.6'
        }}>
          Measure exact liquid volumes using unmarked containers. Fill, pour, and transfer water with physical simulations to reach the target volume in minimal steps!
        </p>

        {/* Level Cards Overview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '36px',
          textAlign: 'left'
        }}>
          {LEVELS.map((lvl) => (
            <div
              key={lvl.level}
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '16px 20px'
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#0284c7', marginBottom: '4px' }}>
                {lvl.title}
              </div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>
                Jugs: {lvl.capA}L & {lvl.capB}L
              </div>
              <div style={{ fontSize: '13px', color: '#16a34a', fontWeight: '700' }}>
                Target: Exactly {lvl.target} Litres
              </div>
            </div>
          ))}
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
            background: 'linear-gradient(135deg, #0284c7, #0369a1)',
            color: 'white',
            fontSize: '17px',
            fontWeight: '700',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(2, 132, 199, 0.35)',
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
          WATER JUG CHALLENGE COMPLETE 🎉
        </h2>
        <p style={{ color: '#64748b', fontSize: '15px', maxWidth: '540px', margin: '0 auto 28px' }}>
          You demonstrated state-space exploration, arithmetic planning, and algorithmic optimization.
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
            <div style={{ fontSize: '30px', fontWeight: '800', color: '#0284c7' }}>
              {Math.min(100, Math.max(60, 100 - (totalOperations > 18 ? (totalOperations - 18) * 3 : 0)))} / 100
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Operations</div>
            <div style={{ fontSize: '30px', fontWeight: '800', color: '#0f172a' }}>{totalOperations}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Levels Completed</div>
            <div style={{ fontSize: '30px', fontWeight: '800', color: '#10b981' }}>{LEVELS.length} / {LEVELS.length}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Hints Used</div>
            <div style={{ fontSize: '30px', fontWeight: '800', color: '#f59e0b' }}>{hintsUsed}</div>
          </div>
        </div>

        {/* Skill Indicators */}
        <div style={{
          background: '#eff6ff',
          borderRadius: '16px',
          border: '1px solid #bfdbfe',
          padding: '20px 24px',
          marginBottom: '32px',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Sparkles size={18} color="#0284c7" />
            <strong style={{ color: '#0369a1', fontSize: '15px' }}>Cognitive Capabilities Demonstrated:</strong>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
            <div style={{ background: 'white', padding: '12px 16px', borderRadius: '10px', border: '1px solid #dbeafe' }}>
              <div style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>Algorithmic Thinking</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#0284c7' }}>{algoSkill} / 100</div>
            </div>
            <div style={{ background: 'white', padding: '12px 16px', borderRadius: '10px', border: '1px solid #dbeafe' }}>
              <div style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>Numerical Reasoning</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#0284c7' }}>{numReasoningSkill} / 100</div>
            </div>
            <div style={{ background: 'white', padding: '12px 16px', borderRadius: '10px', border: '1px solid #dbeafe' }}>
              <div style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>Problem Solving</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#0284c7' }}>{probSolvingSkill} / 100</div>
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
            background: '#0284c7',
            color: 'white',
            border: 'none',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(2, 132, 199, 0.3)'
          }}
        >
          <span>Continue to Next Game</span>
          <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 3. ACTIVE PLAYING SCENE
  // -------------------------------------------------------------
  return (
    <div style={{ maxWidth: '880px', margin: '0 auto' }}>

      {/* Top Header & Controls */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            background: '#0284c7',
            color: 'white',
            borderRadius: '8px',
            padding: '5px 12px',
            fontSize: '13px',
            fontWeight: '700'
          }}>
            Game 3 of 5
          </span>

          {LEVELS.map((lvl, idx) => (
            <button
              key={lvl.level}
              onClick={() => {
                if (animatingAction) return;
                gameAudio.playClick();
                setCurrentLevelIdx(idx);
                initLevel(idx);
              }}
              style={{
                padding: '5px 12px',
                borderRadius: '8px',
                background: currentLevelIdx === idx ? '#0284c7' : '#f1f5f9',
                color: currentLevelIdx === idx ? 'white' : '#475569',
                border: currentLevelIdx === idx ? '1px solid #0284c7' : '1px solid #cbd5e1',
                fontWeight: '700',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Lvl {lvl.level} {completedLevels.includes(lvl.level) && '✓'}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '700',
            color: '#0f172a',
            background: '#f8fafc',
            padding: '5px 12px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            Moves: <span style={{ color: '#0284c7' }}>{moveCount}</span>
          </div>

          {history.length > 0 && !levelCompleted && (
            <button
              onClick={handleUndo}
              disabled={!!animatingAction}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '6px 12px',
                cursor: animatingAction ? 'not-allowed' : 'pointer',
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
              color: muted ? '#94a3b8' : '#0284c7'
            }}
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          <button
            onClick={() => initLevel(currentLevelIdx)}
            title="Reset Jugs"
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
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>

      {/* Target Mission Banner */}
      <div style={{
        background: '#f0f9ff',
        border: '1.5px solid #bae6fd',
        borderRadius: '12px',
        padding: '12px 20px',
        marginBottom: '18px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Target size={22} color="#0284c7" />
          <span style={{ fontSize: '15px', fontWeight: '800', color: '#0c4a6e' }}>
            Mission: Measure exactly <span style={{ color: '#0284c7' }}>{currentLevel.target} Litres</span> in either container!
          </span>
        </div>
        <div style={{ fontSize: '12px', fontWeight: '700', color: '#0369a1', background: 'white', padding: '4px 10px', borderRadius: '6px', border: '1px solid #bae6fd' }}>
          Optimal: ~{currentLevel.minMoves} moves
        </div>
      </div>

      {/* ------------------------------------------------------- */}
      {/* 2D PHYSICAL INTERACTIVE JUGS LAB STAGE                  */}
      {/* ------------------------------------------------------- */}
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        border: '1.5px solid #e2e8f0',
        padding: '30px 24px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
        marginBottom: '20px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          gap: '80px',
          minHeight: '290px',
          position: 'relative'
        }}>

          {/* ================= JUG A ================= */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '180px' }}>
            <div style={{
              fontSize: '16px',
              fontWeight: '800',
              color: jugA === currentLevel.target ? '#15803d' : '#0f172a',
              marginBottom: '10px'
            }}>
              Jug A: <span style={{ color: '#0284c7' }}>{jugA}</span> / {currentLevel.capA} L
            </div>

            {/* Tap / Spout Water Stream on Filling A */}
            {animatingAction === 'filling-A' && (
              <div style={{
                width: '6px',
                height: '50px',
                background: 'linear-gradient(180deg, #38bdf8, #0284c7)',
                borderRadius: '3px',
                marginBottom: '-4px',
                animation: 'scaleUp 0.2s ease-in-out'
              }} />
            )}

            {/* Container Cylinder with Calibration Ticks */}
            <div style={{
              width: '130px',
              height: '210px',
              border: '3.5px solid #334155',
              borderTop: 'none',
              borderRadius: '0 0 18px 18px',
              position: 'relative',
              background: '#f8fafc',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              boxShadow: 'inset 0 0 12px rgba(0,0,0,0.06)'
            }}>
              {/* Measurement calibration tick lines */}
              {Array.from({ length: currentLevel.capA - 1 }).map((_, i) => (
                <div
                  key={`tick-a-${i}`}
                  style={{
                    position: 'absolute',
                    bottom: `${((i + 1) / currentLevel.capA) * 100}%`,
                    left: 0,
                    width: '18px',
                    height: '1.5px',
                    background: '#94a3b8',
                    zIndex: 10
                  }}
                />
              ))}

              {/* Water Liquid Level with Animation */}
              <div style={{
                width: '100%',
                height: `${pctA}%`,
                background: jugA === currentLevel.target 
                  ? 'linear-gradient(180deg, #34d399, #059669)' 
                  : 'linear-gradient(180deg, #38bdf8, #0284c7)',
                transition: 'height 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                {/* Surface ripple */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'rgba(255, 255, 255, 0.6)'
                }} />

                {jugA > 0 && (
                  <span style={{
                    color: 'white',
                    fontWeight: '900',
                    fontSize: '18px',
                    textShadow: '0 1px 3px rgba(0,0,0,0.3)'
                  }}>
                    {jugA} L
                  </span>
                )}
              </div>
            </div>

            {/* Jug A Local Control Buttons */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
              <button
                onClick={handleFillA}
                disabled={jugA >= currentLevel.capA || levelCompleted || !!animatingAction}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: jugA >= currentLevel.capA ? '#f1f5f9' : '#0284c7',
                  color: jugA >= currentLevel.capA ? '#94a3b8' : 'white',
                  border: 'none',
                  fontWeight: '700',
                  fontSize: '12px',
                  cursor: jugA >= currentLevel.capA || animatingAction ? 'not-allowed' : 'pointer'
                }}
              >
                Fill A
              </button>
              <button
                onClick={handleEmptyA}
                disabled={jugA <= 0 || levelCompleted || !!animatingAction}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: jugA <= 0 ? '#f1f5f9' : '#ef4444',
                  color: jugA <= 0 ? '#94a3b8' : 'white',
                  border: 'none',
                  fontWeight: '700',
                  fontSize: '12px',
                  cursor: jugA <= 0 || animatingAction ? 'not-allowed' : 'pointer'
                }}
              >
                Empty A
              </button>
            </div>
          </div>

          {/* ================= TRANSFER CONTROLS IN MIDDLE ================= */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '30px' }}>
            <button
              onClick={handlePourAtoB}
              disabled={jugA <= 0 || jugB >= currentLevel.capB || levelCompleted || !!animatingAction}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 18px',
                borderRadius: '10px',
                background: jugA <= 0 || jugB >= currentLevel.capB ? '#f1f5f9' : '#3b82f6',
                color: jugA <= 0 || jugB >= currentLevel.capB ? '#94a3b8' : 'white',
                border: 'none',
                fontWeight: '700',
                fontSize: '13px',
                cursor: jugA <= 0 || jugB >= currentLevel.capB || animatingAction ? 'not-allowed' : 'pointer',
                boxShadow: jugA > 0 && jugB < currentLevel.capB ? '0 2px 8px rgba(59, 130, 246, 0.25)' : 'none'
              }}
            >
              <span>Pour A ➔ B</span>
            </button>

            <button
              onClick={handlePourBtoA}
              disabled={jugB <= 0 || jugA >= currentLevel.capA || levelCompleted || !!animatingAction}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 18px',
                borderRadius: '10px',
                background: jugB <= 0 || jugA >= currentLevel.capA ? '#f1f5f9' : '#3b82f6',
                color: jugB <= 0 || jugA >= currentLevel.capA ? '#94a3b8' : 'white',
                border: 'none',
                fontWeight: '700',
                fontSize: '13px',
                cursor: jugB <= 0 || jugA >= currentLevel.capA || animatingAction ? 'not-allowed' : 'pointer',
                boxShadow: jugB > 0 && jugA < currentLevel.capA ? '0 2px 8px rgba(59, 130, 246, 0.25)' : 'none'
              }}
            >
              <span>⬅ Pour B ➔ A</span>
            </button>
          </div>

          {/* ================= JUG B ================= */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '180px' }}>
            <div style={{
              fontSize: '16px',
              fontWeight: '800',
              color: jugB === currentLevel.target ? '#15803d' : '#0f172a',
              marginBottom: '10px'
            }}>
              Jug B: <span style={{ color: '#0284c7' }}>{jugB}</span> / {currentLevel.capB} L
            </div>

            {/* Tap / Spout Water Stream on Filling B */}
            {animatingAction === 'filling-B' && (
              <div style={{
                width: '6px',
                height: '50px',
                background: 'linear-gradient(180deg, #38bdf8, #0284c7)',
                borderRadius: '3px',
                marginBottom: '-4px',
                animation: 'scaleUp 0.2s ease-in-out'
              }} />
            )}

            {/* Container Cylinder with Calibration Ticks */}
            <div style={{
              width: '110px',
              height: '170px',
              border: '3.5px solid #334155',
              borderTop: 'none',
              borderRadius: '0 0 16px 16px',
              position: 'relative',
              background: '#f8fafc',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              boxShadow: 'inset 0 0 12px rgba(0,0,0,0.06)'
            }}>
              {/* Measurement calibration tick lines */}
              {Array.from({ length: currentLevel.capB - 1 }).map((_, i) => (
                <div
                  key={`tick-b-${i}`}
                  style={{
                    position: 'absolute',
                    bottom: `${((i + 1) / currentLevel.capB) * 100}%`,
                    left: 0,
                    width: '16px',
                    height: '1.5px',
                    background: '#94a3b8',
                    zIndex: 10
                  }}
                />
              ))}

              {/* Water Liquid Level with Animation */}
              <div style={{
                width: '100%',
                height: `${pctB}%`,
                background: jugB === currentLevel.target 
                  ? 'linear-gradient(180deg, #34d399, #059669)' 
                  : 'linear-gradient(180deg, #38bdf8, #0284c7)',
                transition: 'height 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'rgba(255, 255, 255, 0.6)'
                }} />

                {jugB > 0 && (
                  <span style={{
                    color: 'white',
                    fontWeight: '900',
                    fontSize: '18px',
                    textShadow: '0 1px 3px rgba(0,0,0,0.3)'
                  }}>
                    {jugB} L
                  </span>
                )}
              </div>
            </div>

            {/* Jug B Local Control Buttons */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
              <button
                onClick={handleFillB}
                disabled={jugB >= currentLevel.capB || levelCompleted || !!animatingAction}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: jugB >= currentLevel.capB ? '#f1f5f9' : '#0284c7',
                  color: jugB >= currentLevel.capB ? '#94a3b8' : 'white',
                  border: 'none',
                  fontWeight: '700',
                  fontSize: '12px',
                  cursor: jugB >= currentLevel.capB || animatingAction ? 'not-allowed' : 'pointer'
                }}
              >
                Fill B
              </button>
              <button
                onClick={handleEmptyB}
                disabled={jugB <= 0 || levelCompleted || !!animatingAction}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: jugB <= 0 ? '#f1f5f9' : '#ef4444',
                  color: jugB <= 0 ? '#94a3b8' : 'white',
                  border: 'none',
                  fontWeight: '700',
                  fontSize: '12px',
                  cursor: jugB <= 0 || animatingAction ? 'not-allowed' : 'pointer'
                }}
              >
                Empty B
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Target Reached Success Banner */}
      {levelCompleted && (
        <div style={{
          background: '#f0fdf4',
          border: '1.5px solid #86efac',
          borderRadius: '14px',
          padding: '16px 24px',
          marginBottom: '18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          animation: 'scaleUp 0.25s ease-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 size={26} color="#16a34a" />
            <div>
              <strong style={{ color: '#15803d', fontSize: '16px' }}>Target Reached! 🎉</strong>
              <p style={{ color: '#166534', fontSize: '13px', margin: 0 }}>
                You successfully measured exactly {currentLevel.target} Litres in {moveCount} moves!
              </p>
            </div>
          </div>

          <button
            onClick={handleNextLevel}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '10px',
              background: '#16a34a',
              color: 'white',
              border: 'none',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)'
            }}
          >
            <span>{currentLevelIdx < LEVELS.length - 1 ? 'Next Level ➔' : 'View Results'}</span>
          </button>
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
            💡 <strong>Hint for {currentLevel.title}:</strong> {currentLevel.hint}
          </div>
        )}
      </div>

    </div>
  );
};

export default WaterJugGame;
