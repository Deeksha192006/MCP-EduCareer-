import React, { useState, useEffect } from 'react';
import { 
  Crown, RotateCcw, Lightbulb, CheckCircle2, ArrowRight, Award, 
  AlertTriangle, Undo2, Volume2, VolumeX, Play, Sparkles, ShieldCheck 
} from 'lucide-react';
import { gameAudio } from '../../utils/gameAudio';

// Known valid configurations for hint guidance
const KNOWN_SOLUTIONS = {
  4: [[0, 1], [1, 3], [2, 0], [3, 2]],
  5: [[0, 0], [1, 2], [2, 4], [3, 1], [4, 3]],
  6: [[0, 1], [1, 3], [2, 5], [3, 0], [4, 2], [5, 4]]
};

const LEVELS = [
  { level: 1, size: 4, name: "Level 1: 4 × 4 Board", description: "Place 4 Queens safely without any horizontal, vertical, or diagonal attacks." },
  { level: 2, size: 5, name: "Level 2: 5 × 5 Board", description: "Place 5 Queens safely across expanded diagonal intersections." },
  { level: 3, size: 6, name: "Level 3: 6 × 6 Board", description: "Master constraint reasoning by placing 6 Queens safely on a larger board." }
];

const QueensSafeBoardGame = ({ onGameComplete }) => {
  // Game lifecycle: 'intro' | 'playing' | 'completed'
  const [gameState, setGameState] = useState('intro');
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const currentLevel = LEVELS[currentLevelIdx];
  const boardSize = currentLevel.size;

  // Queens placed: array of [r, c]
  const [queens, setQueens] = useState([]);
  const [hoveredCell, setHoveredCell] = useState(null); // [r, c] | null
  const [moveCount, setMoveCount] = useState(0);
  const [history, setHistory] = useState([]);
  const [conflictInfo, setConflictInfo] = useState(null); // { message, conflictingPairs }
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [levelSolved, setLevelSolved] = useState(false);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [muted, setMuted] = useState(gameAudio.isMuted());
  const [isShaking, setIsShaking] = useState(false);

  // Setup level
  const initLevel = (idx = currentLevelIdx) => {
    setQueens([]);
    setHoveredCell(null);
    setMoveCount(0);
    setHistory([]);
    setConflictInfo(null);
    setShowHint(false);
    setLevelSolved(false);
    setIsShaking(false);
  };

  const handleStartGame = () => {
    gameAudio.playClick();
    setStartTime(Date.now());
    initLevel(0);
    setGameState('playing');
  };

  const toggleSound = () => {
    const isMute = gameAudio.toggleMute();
    setMuted(isMute);
    if (!isMute) gameAudio.playClick();
  };

  // Find all pairwise conflicts between queens
  const findConflicts = (queenList) => {
    const conflicts = [];
    for (let i = 0; i < queenList.length; i++) {
      for (let j = i + 1; j < queenList.length; j++) {
        const [r1, c1] = queenList[i];
        const [r2, c2] = queenList[j];

        const sameRow = r1 === r2;
        const sameCol = c1 === c2;
        const sameDiag = Math.abs(r1 - r2) === Math.abs(c1 - c2);

        if (sameRow || sameCol || sameDiag) {
          let reason = sameRow 
            ? `Row ${r1 + 1}` 
            : sameCol 
            ? `Column ${c1 + 1}` 
            : `Diagonal`;
          conflicts.push({
            pair: [[r1, c1], [r2, c2]],
            reason: `Queen at (${r1 + 1}, ${c1 + 1}) attacks Queen at (${r2 + 1}, ${c2 + 1}) along the same ${reason}!`
          });
        }
      }
    }
    return conflicts;
  };

  // Check if a cell is under attack from any currently placed queen
  const isCellUnderAttack = (r, c, queenList = queens) => {
    return queenList.some(([qr, qc]) => {
      if (qr === r && qc === c) return false;
      const sameRow = qr === r;
      const sameCol = qc === c;
      const sameDiag = Math.abs(qr - r) === Math.abs(qc - c);
      return sameRow || sameCol || sameDiag;
    });
  };

  // Student clicks a cell on the board
  const handleCellClick = (r, c) => {
    if (levelSolved) return;

    // Check if cell already has a queen -> remove it
    const existingIndex = queens.findIndex(([qr, qc]) => qr === r && qc === c);
    if (existingIndex !== -1) {
      gameAudio.playClick();
      const updated = queens.filter((_, idx) => idx !== existingIndex);
      setHistory(prev => [...prev, queens]);
      setQueens(updated);
      setMoveCount(prev => prev + 1);

      const conflicts = findConflicts(updated);
      if (conflicts.length > 0) {
        setConflictInfo(conflicts[0]);
      } else {
        setConflictInfo(null);
      }
      return;
    }

    // Placing a new queen
    if (queens.length >= boardSize) {
      gameAudio.playError();
      return;
    }

    gameAudio.playMove();
    const updated = [...queens, [r, c]];
    setHistory(prev => [...prev, queens]);
    setQueens(updated);
    setMoveCount(prev => prev + 1);

    const conflicts = findConflicts(updated);
    if (conflicts.length > 0) {
      gameAudio.playError();
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 450);
      setConflictInfo(conflicts[0]);
    } else {
      setConflictInfo(null);
      // Check win condition: all boardSize queens placed with 0 conflicts!
      if (updated.length === boardSize) {
        gameAudio.playLevelUp();
        setLevelSolved(true);
        if (!completedLevels.includes(currentLevel.level)) {
          setCompletedLevels(prev => [...prev, currentLevel.level]);
        }
      } else {
        gameAudio.playClick();
      }
    }
  };

  const handleUndo = () => {
    if (history.length === 0 || levelSolved) return;
    gameAudio.playClick();
    const previous = history[history.length - 1];
    setQueens(previous);
    setHistory(prev => prev.slice(0, -1));

    const conflicts = findConflicts(previous);
    if (conflicts.length > 0) {
      setConflictInfo(conflicts[0]);
    } else {
      setConflictInfo(null);
    }
  };

  const handleUseHint = () => {
    if (!showHint) {
      gameAudio.playClick();
      setShowHint(true);
      setHintsUsed(prev => prev + 1);
    }
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

  const handleFinishChallenge = () => {
    gameAudio.playClick();
    const timeTaken = startTime ? Math.round((Date.now() - startTime) / 1000) : 60;
    const baseScore = 100;
    const penalty = Math.min(40, hintsUsed * 6 + (moveCount > boardSize * 3 ? (moveCount - boardSize * 3) * 2 : 0));
    const finalScore = Math.max(60, baseScore - penalty);

    if (onGameComplete) {
      onGameComplete({
        gameId: "aids_game_queens",
        gameName: "Queen's Safe Board",
        score: finalScore,
        maxScore: 100,
        accuracy: finalScore / 100,
        timeTaken,
        attempts: moveCount
      });
    }
  };

  // Conflict state detection for cells
  const conflictingQueenCoords = conflictInfo
    ? conflictInfo.pair.map(([r, c]) => `${r},${c}`)
    : [];

  // Cognitive Skill Breakdown Scores
  const logicalSkill = Math.min(98, Math.max(70, Math.round(95 - hintsUsed * 4)));
  const constraintSkill = conflictInfo ? 80 : 96;
  const planningSkill = Math.min(95, Math.max(70, Math.round(94 - (moveCount > 12 ? (moveCount - 12) * 2 : 0))));
  const patternSkill = 92;

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
          background: '#faf5ff',
          color: '#9333ea',
          padding: '6px 16px',
          borderRadius: '999px',
          fontSize: '13px',
          fontWeight: '700',
          marginBottom: '20px',
          border: '1px solid #e9d5ff'
        }}>
          <Crown size={16} /> Game 1 of 5 • Artificial Intelligence & Data Science
        </div>

        <h1 style={{
          fontSize: '32px',
          fontWeight: '800',
          color: '#0f172a',
          marginBottom: '12px'
        }}>
          ♛ Queen's Safe Board
        </h1>

        <p style={{
          fontSize: '16px',
          color: '#475569',
          maxWidth: '620px',
          margin: '0 auto 24px',
          lineHeight: '1.6'
        }}>
          <strong>🎯 Your Mission:</strong> Place the queens on the board so that <strong>no two queens can attack each other</strong>.
        </p>

        {/* Rules & Visual Example Box */}
        <div style={{
          background: '#f8fafc',
          border: '1.5px solid #e2e8f0',
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '680px',
          margin: '0 auto 28px',
          textAlign: 'left'
        }}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>
            👑 How a Queen Moves:
          </h3>
          <ul style={{ fontSize: '14px', color: '#334155', lineHeight: '1.8', paddingLeft: '20px', marginBottom: '18px' }}>
            <li>• A queen can move <strong>horizontally</strong> along her entire row.</li>
            <li>• A queen can move <strong>vertically</strong> along her entire column.</li>
            <li>• A queen can move <strong>diagonally</strong> in all four diagonal directions.</li>
            <li>• No two queens can share the same row, column, or diagonal line!</li>
          </ul>

          {/* Mini 3x3 Visual Attack Illustration */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            background: 'white',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid #cbd5e1'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 36px)',
              gridTemplateRows: 'repeat(3, 36px)',
              gap: '2px',
              background: '#cbd5e1',
              padding: '2px',
              borderRadius: '6px'
            }}>
              {/* Row 0 */}
              <div style={{ background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#dc2626' }}>✕</div>
              <div style={{ background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#dc2626' }}>✕</div>
              <div style={{ background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#dc2626' }}>✕</div>
              {/* Row 1 */}
              <div style={{ background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#dc2626' }}>✕</div>
              <div style={{ background: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '18px', fontWeight: 'bold' }}>♛</div>
              <div style={{ background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#dc2626' }}>✕</div>
              {/* Row 2 */}
              <div style={{ background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#dc2626' }}>✕</div>
              <div style={{ background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#dc2626' }}>✕</div>
              <div style={{ background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#dc2626' }}>✕</div>
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', maxWidth: '280px' }}>
              Red cells (<strong style={{ color: '#dc2626' }}>✕</strong>) show the attack zone radiating outwards horizontally, vertically, and diagonally from the Queen ♛!
            </div>
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
            background: 'linear-gradient(135deg, #9333ea, #7e22ce)',
            color: 'white',
            fontSize: '17px',
            fontWeight: '700',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(147, 51, 234, 0.35)',
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
          QUEEN'S SAFE BOARD SOLVED 🎉
        </h2>
        <p style={{ color: '#64748b', fontSize: '15px', maxWidth: '540px', margin: '0 auto 28px' }}>
          You demonstrated sharp constraint reasoning, systematic spatial planning, and logical foresight.
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
            <div style={{ fontSize: '30px', fontWeight: '800', color: '#9333ea' }}>
              {Math.max(60, 100 - hintsUsed * 6)} / 100
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Total Moves</div>
            <div style={{ fontSize: '30px', fontWeight: '800', color: '#0f172a' }}>{moveCount}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Levels Solved</div>
            <div style={{ fontSize: '30px', fontWeight: '800', color: '#10b981' }}>{LEVELS.length} / {LEVELS.length}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Hints Used</div>
            <div style={{ fontSize: '30px', fontWeight: '800', color: '#f59e0b' }}>{hintsUsed}</div>
          </div>
        </div>

        {/* Skill Indicators */}
        <div style={{
          background: '#faf5ff',
          borderRadius: '16px',
          border: '1px solid #e9d5ff',
          padding: '20px 24px',
          marginBottom: '32px',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Sparkles size={18} color="#9333ea" />
            <strong style={{ color: '#7e22ce', fontSize: '15px' }}>Exploratory Cognitive Indicators:</strong>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
            <div style={{ background: 'white', padding: '12px 16px', borderRadius: '10px', border: '1px solid #f3e8ff' }}>
              <div style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>Logical Thinking</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#9333ea' }}>{logicalSkill} / 100</div>
            </div>
            <div style={{ background: 'white', padding: '12px 16px', borderRadius: '10px', border: '1px solid #f3e8ff' }}>
              <div style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>Constraint Reasoning</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#9333ea' }}>{constraintSkill} / 100</div>
            </div>
            <div style={{ background: 'white', padding: '12px 16px', borderRadius: '10px', border: '1px solid #f3e8ff' }}>
              <div style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>Planning & Foresight</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#9333ea' }}>{planningSkill} / 100</div>
            </div>
            <div style={{ background: 'white', padding: '12px 16px', borderRadius: '10px', border: '1px solid #f3e8ff' }}>
              <div style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>Pattern Recognition</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#9333ea' }}>{patternSkill} / 100</div>
            </div>
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '12px', marginBottom: 0 }}>
            * Note: These metrics are exploratory indicators used by the multi-criteria career recommendation system.
          </p>
        </div>

        <button
          onClick={handleFinishChallenge}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '16px 42px',
            borderRadius: '12px',
            background: '#9333ea',
            color: 'white',
            border: 'none',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(147, 51, 234, 0.3)'
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
            background: '#9333ea',
            color: 'white',
            borderRadius: '8px',
            padding: '5px 12px',
            fontSize: '13px',
            fontWeight: '700'
          }}>
            Game 1 of 5
          </span>

          {LEVELS.map((lvl, idx) => (
            <button
              key={lvl.level}
              onClick={() => {
                gameAudio.playClick();
                setCurrentLevelIdx(idx);
                initLevel(idx);
              }}
              style={{
                padding: '5px 12px',
                borderRadius: '8px',
                background: currentLevelIdx === idx ? '#9333ea' : '#f1f5f9',
                color: currentLevelIdx === idx ? 'white' : '#475569',
                border: currentLevelIdx === idx ? '1px solid #9333ea' : '1px solid #cbd5e1',
                fontWeight: '700',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              {lvl.size}×{lvl.size} {completedLevels.includes(lvl.level) && '✓'}
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
            Queens: <strong style={{ color: queens.length === boardSize && !conflictInfo ? '#16a34a' : '#9333ea' }}>{queens.length}</strong> / {boardSize}
          </div>

          <div style={{
            fontSize: '14px',
            fontWeight: '700',
            color: '#0f172a',
            background: '#f8fafc',
            padding: '5px 12px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            Moves: {moveCount}
          </div>

          {history.length > 0 && !levelSolved && (
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
              color: muted ? '#94a3b8' : '#9333ea'
            }}
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          <button
            onClick={() => initLevel(currentLevelIdx)}
            title="Reset Board"
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

      {/* Target Mission Guidance */}
      <div style={{
        background: '#faf5ff',
        border: '1.5px solid #e9d5ff',
        borderRadius: '12px',
        padding: '12px 20px',
        marginBottom: '18px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Crown size={20} color="#9333ea" />
          <span style={{ fontSize: '14px', fontWeight: '800', color: '#6b21a8' }}>
            {currentLevel.name}: Place exactly {boardSize} Queens on the board with ZERO mutual attacks!
          </span>
        </div>
        <span style={{ fontSize: '12px', color: '#7e22ce', fontWeight: '700' }}>
          Click an empty cell to place, click a queen to remove
        </span>
      </div>

      {/* ------------------------------------------------------- */}
      {/* INTERACTIVE CHESSBOARD CANVAS                           */}
      {/* ------------------------------------------------------- */}
      <div 
        className={isShaking ? 'game-shake' : ''}
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '1.5px solid #e2e8f0',
          padding: '30px 20px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
          gap: '4px',
          background: '#334155',
          padding: '12px',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.15)',
          maxWidth: '520px',
          width: '100%',
          aspectRatio: '1 / 1'
        }}>
          {Array.from({ length: boardSize }).map((_, r) =>
            Array.from({ length: boardSize }).map((_, c) => {
              const isDarkSquare = (r + c) % 2 === 1;
              const hasQueen = queens.some(([qr, qc]) => qr === r && qc === c);
              const isConflicting = conflictingQueenCoords.includes(`${r},${c}`);
              const isHovered = hoveredCell && hoveredCell[0] === r && hoveredCell[1] === c;

              // Check if hovered cell is attacked by existing queens (shows safe/danger preview)
              const wouldBeAttacked = !hasQueen && hoveredCell && isCellUnderAttack(r, c);

              let bgColor = isDarkSquare ? '#f1f5f9' : '#ffffff';
              if (hasQueen) {
                bgColor = isConflicting ? '#fee2e2' : '#f3e8ff';
              } else if (isHovered) {
                bgColor = wouldBeAttacked ? '#fef2f2' : '#ecfdf5';
              }

              return (
                <div
                  key={`cell-${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  onMouseEnter={() => setHoveredCell([r, c])}
                  onMouseLeave={() => setHoveredCell(null)}
                  style={{
                    background: bgColor,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: boardSize <= 4 ? '38px' : boardSize <= 5 ? '32px' : '28px',
                    transition: 'all 0.15s ease',
                    position: 'relative',
                    border: isConflicting 
                      ? '2px solid #ef4444' 
                      : hasQueen 
                      ? '2px solid #a855f7' 
                      : '1px solid rgba(0,0,0,0.06)'
                  }}
                >
                  {hasQueen ? (
                    <span 
                      className={isConflicting ? 'game-shake' : 'game-bob'}
                      style={{
                        display: 'inline-block',
                        color: isConflicting ? '#dc2626' : '#7e22ce',
                        filter: isConflicting 
                          ? 'drop-shadow(0 2px 6px rgba(220, 38, 38, 0.4))' 
                          : 'drop-shadow(0 2px 6px rgba(126, 34, 206, 0.3))'
                      }}
                    >
                      ♛
                    </span>
                  ) : isHovered ? (
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '800',
                      color: wouldBeAttacked ? '#ef4444' : '#10b981',
                      opacity: 0.7
                    }}>
                      {wouldBeAttacked ? '✕' : '+'}
                    </span>
                  ) : null}
                </div>
              );
            })
          )}
        </div>

        {/* Legend / Status Indicators below Board */}
        <div style={{
          display: 'flex',
          gap: '20px',
          marginTop: '16px',
          fontSize: '12px',
          fontWeight: '700',
          color: '#64748b',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#7e22ce', fontSize: '16px' }}>♛</span> Safe Queen
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#dc2626', fontSize: '16px' }}>♛</span> Conflicting Queen
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#10b981', fontWeight: '900' }}>+</span> Safe Spot on Hover
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#ef4444', fontWeight: '900' }}>✕</span> Under Attack on Hover
          </div>
        </div>
      </div>

      {/* Immediate Visual Feedback Banner */}
      {conflictInfo && (
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
          <AlertTriangle size={22} color="#dc2626" />
          <span style={{ color: '#991b1b', fontSize: '14px', fontWeight: '700' }}>
            {conflictInfo.reason}
          </span>
        </div>
      )}

      {/* Level Solved Success Banner */}
      {levelSolved && (
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
              <strong style={{ color: '#15803d', fontSize: '16px' }}>Board Solved! 🎉</strong>
              <p style={{ color: '#166534', fontSize: '13px', margin: 0 }}>
                All {boardSize} queens are completely safe without mutual attacks in {moveCount} moves!
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
        {!showHint && !levelSolved && (
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
            💡 <strong>Hint for {currentLevel.size}×{currentLevel.size}:</strong> A safe opening queen placement can be placed at Row {KNOWN_SOLUTIONS[boardSize][0][0] + 1}, Column {KNOWN_SOLUTIONS[boardSize][0][1] + 1}! Avoid placing queens in neighboring columns and diagonals.
          </div>
        )}
      </div>

    </div>
  );
};

export default QueensSafeBoardGame;
