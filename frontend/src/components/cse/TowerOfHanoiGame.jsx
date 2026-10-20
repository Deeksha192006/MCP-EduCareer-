import React, { useState, useEffect } from 'react';
import { 
  RotateCcw, Lightbulb, CheckCircle2, ArrowRight, Award, 
  Layers, AlertCircle, Volume2, VolumeX, Play, Sparkles, Undo2 
} from 'lucide-react';
import { gameAudio } from '../../utils/gameAudio';

const DISK_PALETTE = [
  { size: 1, width: 60, color: '#ef4444', label: 'Disk 1' },
  { size: 2, width: 85, color: '#f97316', label: 'Disk 2' },
  { size: 3, width: 110, color: '#eab308', label: 'Disk 3' },
  { size: 4, width: 135, color: '#10b981', label: 'Disk 4' },
  { size: 5, width: 160, color: '#3b82f6', label: 'Disk 5' },
];

const TowerOfHanoiGame = ({ onGameComplete }) => {
  // Game lifecycle: 'intro' | 'playing' | 'completed'
  const [gameState, setGameState] = useState('intro');
  const [diskCount, setDiskCount] = useState(3); // 3, 4, or 5 disks

  // Rods contain array of disk numbers (smaller number = smaller disk)
  // e.g. for 3 disks: rod A = [3, 2, 1]
  const [rods, setRods] = useState({
    A: [3, 2, 1],
    B: [],
    C: []
  });

  const [selectedRod, setSelectedRod] = useState(null); // 'A' | 'B' | 'C' | null
  const [movingAnimation, setMovingAnimation] = useState(null); // { disk, from, to } | null
  const [moveCount, setMoveCount] = useState(0);
  const [history, setHistory] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [muted, setMuted] = useState(gameAudio.isMuted());
  const [isShaking, setIsShaking] = useState(false);

  const minMoves = Math.pow(2, diskCount) - 1;

  const initGame = (count = diskCount) => {
    const initialDisks = [];
    for (let i = count; i >= 1; i--) {
      initialDisks.push(i);
    }
    setRods({
      A: initialDisks,
      B: [],
      C: []
    });
    setSelectedRod(null);
    setMovingAnimation(null);
    setMoveCount(0);
    setHistory([]);
    setErrorMessage(null);
    setShowHint(false);
    setIsShaking(false);
  };

  const handleStartGame = () => {
    gameAudio.playClick();
    setStartTime(Date.now());
    initGame(diskCount);
    setGameState('playing');
  };

  const toggleSound = () => {
    const isMute = gameAudio.toggleMute();
    setMuted(isMute);
    if (!isMute) gameAudio.playClick();
  };

  const handleRodClick = (rodKey) => {
    if (movingAnimation) return;
    setErrorMessage(null);

    // Case 1: Pick up top disk from this rod
    if (selectedRod === null) {
      if (rods[rodKey].length === 0) {
        gameAudio.playError();
        setErrorMessage(`Rod ${rodKey} is empty! Select a rod with stacked disks.`);
        return;
      }
      gameAudio.playMove();
      setSelectedRod(rodKey);
    } else {
      // Case 2: Deselect if clicking the same rod
      if (selectedRod === rodKey) {
        gameAudio.playClick();
        setSelectedRod(null);
        return;
      }

      // Case 3: Move disk from selectedRod to rodKey
      const sourceDisks = rods[selectedRod];
      const targetDisks = rods[rodKey];
      const movingDisk = sourceDisks[sourceDisks.length - 1];

      // Rule Validation: Cannot place larger disk on smaller disk
      if (targetDisks.length > 0) {
        const topTargetDisk = targetDisks[targetDisks.length - 1];
        if (movingDisk > topTargetDisk) {
          gameAudio.playError();
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 500);
          setErrorMessage(`⚠️ Invalid Move: Larger disks cannot be placed on smaller disks (Disk ${movingDisk} > Disk ${topTargetDisk})!`);
          setSelectedRod(null);
          return;
        }
      }

      // Physical trajectory animation trigger
      gameAudio.playMove();
      setMovingAnimation({
        disk: movingDisk,
        from: selectedRod,
        to: rodKey
      });

      setTimeout(() => {
        const newSource = [...sourceDisks.slice(0, -1)];
        const newTarget = [...targetDisks, movingDisk];
        const newRods = {
          ...rods,
          [selectedRod]: newSource,
          [rodKey]: newTarget
        };

        setHistory(prev => [...prev, rods]);
        setRods(newRods);
        setSelectedRod(null);
        setMovingAnimation(null);
        setMoveCount(prev => prev + 1);

        // Win condition: All disks stacked on Rod C
        if (newRods.C.length === diskCount) {
          gameAudio.playLevelUp();
          setTimeout(() => {
            setGameState('completed');
          }, 800);
        }
      }, 550);
    }
  };

  const handleUndo = () => {
    if (history.length === 0 || movingAnimation) return;
    gameAudio.playClick();
    const prev = history[history.length - 1];
    setRods(prev);
    setHistory(prevHist => prevHist.slice(0, -1));
    setSelectedRod(null);
    setErrorMessage(null);
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
    let score = 100;
    if (moveCount > minMoves) {
      const extraMoves = moveCount - minMoves;
      score = Math.max(60, 100 - extraMoves * 3);
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

  // Skill calculations
  const algoSkill = Math.min(98, Math.max(70, Math.round(96 - (moveCount > minMoves ? (moveCount - minMoves) * 3 : 0))));
  const seqSkill = 95;
  const planSkill = Math.min(94, Math.max(68, Math.round(92 - hintsUsed * 5)));

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
          background: '#eff6ff',
          color: '#2563eb',
          padding: '6px 16px',
          borderRadius: '999px',
          fontSize: '13px',
          fontWeight: '700',
          marginBottom: '20px',
          border: '1px solid #bfdbfe'
        }}>
          <Layers size={16} /> Game 5 of 5 • Computer Science Exploration
        </div>

        <h1 style={{
          fontSize: '32px',
          fontWeight: '800',
          color: '#0f172a',
          marginBottom: '12px'
        }}>
          Tower of Hanoi 🗼
        </h1>

        <p style={{
          fontSize: '16px',
          color: '#475569',
          maxWidth: '620px',
          margin: '0 auto 28px',
          lineHeight: '1.6'
        }}>
          The foundational recursive puzzle. Transfer the entire stack of disks from Rod A to Rod C, never placing a larger disk onto a smaller disk!
        </p>

        {/* Level / Disk Count Selection */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#334155', marginBottom: '12px' }}>
            SELECT DISK COMPLEXITY:
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={() => { gameAudio.playClick(); setDiskCount(3); }}
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                border: diskCount === 3 ? '2px solid #10b981' : '1px solid #cbd5e1',
                background: diskCount === 3 ? '#ecfdf5' : '#ffffff',
                color: diskCount === 3 ? '#065f46' : '#475569',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '14px'
              }}
            >
              🟢 3 Disks (Min: 7 moves)
            </button>
            <button
              onClick={() => { gameAudio.playClick(); setDiskCount(4); }}
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                border: diskCount === 4 ? '2px solid #2563eb' : '1px solid #cbd5e1',
                background: diskCount === 4 ? '#eff6ff' : '#ffffff',
                color: diskCount === 4 ? '#1d4ed8' : '#475569',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '14px'
              }}
            >
              🟡 4 Disks (Min: 15 moves)
            </button>
            <button
              onClick={() => { gameAudio.playClick(); setDiskCount(5); }}
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                border: diskCount === 5 ? '2px solid #ef4444' : '1px solid #cbd5e1',
                background: diskCount === 5 ? '#fef2f2' : '#ffffff',
                color: diskCount === 5 ? '#991b1b' : '#475569',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '14px'
              }}
            >
              🔴 5 Disks (Min: 31 moves)
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
          TOWER OF HANOI SOLVED 🎉
        </h2>
        <p style={{ color: '#64748b', fontSize: '15px', maxWidth: '540px', margin: '0 auto 28px' }}>
          You demonstrated recursive sequence planning and algorithmic state execution.
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
            <div style={{ fontSize: '30px', fontWeight: '800', color: '#2563eb' }}>
              {Math.max(60, Math.round(100 - (moveCount > minMoves ? (moveCount - minMoves) * 3 : 0)))} / 100
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Your Moves</div>
            <div style={{ fontSize: '30px', fontWeight: '800', color: '#0f172a' }}>{moveCount}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Optimal Moves</div>
            <div style={{ fontSize: '30px', fontWeight: '800', color: '#10b981' }}>{minMoves}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Disks</div>
            <div style={{ fontSize: '30px', fontWeight: '800', color: '#f59e0b' }}>{diskCount}</div>
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
            <Sparkles size={18} color="#2563eb" />
            <strong style={{ color: '#1e40af', fontSize: '15px' }}>Cognitive Capabilities Demonstrated:</strong>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
            <div style={{ background: 'white', padding: '12px 16px', borderRadius: '10px', border: '1px solid #dbeafe' }}>
              <div style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>Algorithmic Thinking</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#1d4ed8' }}>{algoSkill} / 100</div>
            </div>
            <div style={{ background: 'white', padding: '12px 16px', borderRadius: '10px', border: '1px solid #dbeafe' }}>
              <div style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>Sequencing & Order</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#1d4ed8' }}>{seqSkill} / 100</div>
            </div>
            <div style={{ background: 'white', padding: '12px 16px', borderRadius: '10px', border: '1px solid #dbeafe' }}>
              <div style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>Planning & Foresight</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#1d4ed8' }}>{planSkill} / 100</div>
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
          <span>Complete CSE Assessment</span>
          <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 3. PLAYING SCENE
  // -------------------------------------------------------------
  return (
    <div style={{ maxWidth: '880px', margin: '0 auto' }}>

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
            background: '#2563eb',
            color: 'white',
            borderRadius: '8px',
            padding: '5px 12px',
            fontSize: '13px',
            fontWeight: '700'
          }}>
            Game 5 of 5
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
            background: '#eff6ff',
            color: '#1d4ed8',
            border: '1px solid #bfdbfe',
            borderRadius: '8px',
            padding: '5px 12px',
            fontSize: '13px',
            fontWeight: '700'
          }}>
            {diskCount} Disks (Min: {minMoves})
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {history.length > 0 && (
            <button
              onClick={handleUndo}
              disabled={!!movingAnimation}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '6px 12px',
                cursor: movingAnimation ? 'not-allowed' : 'pointer',
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
              color: muted ? '#94a3b8' : '#2563eb'
            }}
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          <button
            onClick={() => initGame(diskCount)}
            title="Restart Puzzle"
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

      {/* Rules Notice */}
      <div style={{
        background: '#eff6ff',
        border: '1.5px solid #bfdbfe',
        borderRadius: '12px',
        padding: '10px 18px',
        marginBottom: '18px',
        fontSize: '13px',
        color: '#1e40af',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <strong>🎯 Objective:</strong>
        <span>
          Transfer all {diskCount} disks from <strong>Rod A</strong> onto <strong>Rod C</strong>. Larger disks can never sit on smaller disks!
        </span>
      </div>

      {/* ------------------------------------------------------- */}
      {/* 2D PHYSICAL DISK RODS STAGE                             */}
      {/* ------------------------------------------------------- */}
      <div 
        className={isShaking ? 'game-shake' : ''}
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '1.5px solid #e2e8f0',
          padding: '36px 24px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
          marginBottom: '20px'
        }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          minHeight: '260px',
          alignItems: 'flex-end',
          position: 'relative'
        }}>
          {['A', 'B', 'C'].map((rodKey) => {
            const diskList = rods[rodKey];
            const isSelected = selectedRod === rodKey;

            return (
              <div
                key={rodKey}
                onClick={() => handleRodClick(rodKey)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  padding: '10px 0',
                  borderRadius: '16px',
                  background: isSelected ? '#eff6ff' : 'transparent',
                  border: isSelected ? '2px dashed #3b82f6' : '2px dashed transparent',
                  transition: 'background 0.2s ease'
                }}
              >
                {/* Vertical Rod Spindle */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '220px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  alignItems: 'center'
                }}>
                  {/* The central wooden peg */}
                  <div style={{
                    position: 'absolute',
                    top: '15px',
                    bottom: '0',
                    width: '12px',
                    background: 'linear-gradient(90deg, #94a3b8, #64748b)',
                    borderRadius: '6px 6px 0 0',
                    zIndex: 1
                  }} />

                  {/* Stacked Disks on this Rod */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column-reverse',
                    alignItems: 'center',
                    gap: '4px',
                    width: '100%',
                    zIndex: 10,
                    marginBottom: '2px'
                  }}>
                    {diskList.map((diskSize, idx) => {
                      const diskDef = DISK_PALETTE.find(d => d.size === diskSize);
                      const isTopDisk = idx === diskList.length - 1;
                      const isHoverLifting = isSelected && isTopDisk;

                      return (
                        <div
                          key={`disk-${diskSize}`}
                          style={{
                            width: `${diskDef?.width}px`,
                            height: '24px',
                            borderRadius: '8px',
                            background: diskDef?.color,
                            boxShadow: isHoverLifting 
                              ? '0 8px 18px rgba(0,0,0,0.35)' 
                              : '0 2px 6px rgba(0,0,0,0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '11px',
                            fontWeight: '800',
                            border: '1.5px solid rgba(255,255,255,0.4)',
                            transform: isHoverLifting ? 'translateY(-22px)' : 'translateY(0)',
                            transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                          }}
                        >
                          {diskSize}
                        </div>
                      );
                    })}
                  </div>

                  {/* Wooden Base Pedestal */}
                  <div style={{
                    width: '180px',
                    height: '14px',
                    background: 'linear-gradient(180deg, #475569, #334155)',
                    borderRadius: '6px',
                    zIndex: 20
                  }} />
                </div>

                {/* Rod Label & Status */}
                <div style={{ marginTop: '12px', textAlign: 'center' }}>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '800',
                    color: rodKey === 'C' ? '#15803d' : '#0f172a'
                  }}>
                    Rod {rodKey} {rodKey === 'A' ? '(Source)' : rodKey === 'C' ? '(Target 🏁)' : '(Auxiliary)'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
                    {isSelected ? '🔼 Selected (Click target rod)' : 'Click to select / move'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Immediate Visual Feedback Banner */}
      {errorMessage && (
        <div style={{
          background: '#fef2f2',
          border: '1.5px solid #fecaca',
          borderRadius: '14px',
          padding: '14px 20px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'scaleUp 0.2s ease-out'
        }}>
          <AlertCircle size={22} color="#dc2626" />
          <span style={{ color: '#991b1b', fontSize: '14px', fontWeight: '700' }}>
            {errorMessage}
          </span>
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
            💡 <strong>Recursive Strategy:</strong> To move N disks from A to C:
            1. Move (N-1) disks from A to B.
            2. Move the largest disk from A to C.
            3. Move (N-1) disks from B to C.
            Keep alternating the smallest disk every second move!
          </div>
        )}
      </div>

    </div>
  );
};

export default TowerOfHanoiGame;
