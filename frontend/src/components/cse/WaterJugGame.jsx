import React, { useState } from 'react';
import { RotateCcw, Lightbulb, Award, ArrowRight, Droplets, CheckCircle2, ChevronRight } from 'lucide-react';

const LEVELS = [
  {
    level: 1,
    capA: 5,
    capB: 3,
    target: 4,
    minMoves: 6,
    hint: "Try filling Jug A (5L), pouring it into Jug B (3L). Jug A will have 2L left. Empty Jug B, transfer the 2L into Jug B, then fill Jug A and top up Jug B!"
  },
  {
    level: 2,
    capA: 7,
    capB: 4,
    target: 5,
    minMoves: 6,
    hint: "Fill Jug A (7L), pour into Jug B (4L) leaving 3L in A. Empty B, pour 3L from A into B. Fill A (7L), and pour 1L into B until B is full!"
  },
  {
    level: 3,
    capA: 8,
    capB: 5,
    target: 6,
    minMoves: 6,
    hint: "Fill Jug A (8L), pour into B (5L) leaving 3L in A. Empty B, put 3L into B. Fill A (8L), then fill B (needs 2L), leaving exactly 6L in A!"
  }
];

const WaterJugGame = ({ onGameComplete }) => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const currentLevel = LEVELS[currentLevelIdx];

  const [jugA, setJugA] = useState(0);
  const [jugB, setJugB] = useState(0);
  const [moveCount, setMoveCount] = useState(0);
  const [history, setHistory] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [startTime] = useState(Date.now());
  const [totalOperations, setTotalOperations] = useState(0);

  const checkTargetReached = (valA, valB) => {
    if (valA === currentLevel.target || valB === currentLevel.target) {
      setLevelCompleted(true);
      if (!completedLevels.includes(currentLevel.level)) {
        setCompletedLevels([...completedLevels, currentLevel.level]);
      }
    }
  };

  const recordMove = (newA, newB) => {
    setHistory([...history, { a: jugA, b: jugB }]);
    setJugA(newA);
    setJugB(newB);
    setMoveCount(prev => prev + 1);
    setTotalOperations(prev => prev + 1);
    checkTargetReached(newA, newB);
  };

  // Actions for Jug A
  const handleFillA = () => {
    if (levelCompleted || jugA === currentLevel.capA) return;
    recordMove(currentLevel.capA, jugB);
  };

  const handleEmptyA = () => {
    if (levelCompleted || jugA === 0) return;
    recordMove(0, jugB);
  };

  // Actions for Jug B
  const handleFillB = () => {
    if (levelCompleted || jugB === currentLevel.capB) return;
    recordMove(jugA, currentLevel.capB);
  };

  const handleEmptyB = () => {
    if (levelCompleted || jugB === 0) return;
    recordMove(jugA, 0);
  };

  // Pour A into B
  const handlePourAtoB = () => {
    if (levelCompleted || jugA === 0 || jugB === currentLevel.capB) return;
    const spaceInB = currentLevel.capB - jugB;
    const transfer = Math.min(jugA, spaceInB);
    recordMove(jugA - transfer, jugB + transfer);
  };

  // Pour B into A
  const handlePourBtoA = () => {
    if (levelCompleted || jugB === 0 || jugA === currentLevel.capA) return;
    const spaceInA = currentLevel.capA - jugA;
    const transfer = Math.min(jugB, spaceInA);
    recordMove(jugA + transfer, jugB - transfer);
  };

  const handleUndo = () => {
    if (history.length === 0 || levelCompleted) return;
    const last = history[history.length - 1];
    setJugA(last.a);
    setJugB(last.b);
    setHistory(history.slice(0, -1));
  };

  const handleRestartLevel = () => {
    setJugA(0);
    setJugB(0);
    setMoveCount(0);
    setHistory([]);
    setShowHint(false);
    setLevelCompleted(false);
  };

  const handleNextLevel = () => {
    if (currentLevelIdx < LEVELS.length - 1) {
      setCurrentLevelIdx(prev => prev + 1);
      setJugA(0);
      setJugB(0);
      setMoveCount(0);
      setHistory([]);
      setShowHint(false);
      setLevelCompleted(false);
    } else {
      handleFinalFinish();
    }
  };

  const handleFinalFinish = () => {
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    const score = Math.min(100, Math.max(60, 100 - (totalOperations > 20 ? (totalOperations - 20) * 3 : 0)));
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

  const pctA = Math.round((jugA / currentLevel.capA) * 100);
  const pctB = Math.round((jugB / currentLevel.capB) * 100);

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      {/* Top Level Nav Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#f8fafc',
        padding: '16px 20px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {LEVELS.map((lvl, idx) => (
            <button
              key={lvl.level}
              onClick={() => {
                setCurrentLevelIdx(idx);
                setJugA(0);
                setJugB(0);
                setMoveCount(0);
                setHistory([]);
                setLevelCompleted(false);
              }}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                background: currentLevelIdx === idx ? '#0284c7' : '#ffffff',
                color: currentLevelIdx === idx ? 'white' : '#475569',
                border: currentLevelIdx === idx ? '1px solid #0284c7' : '1px solid #cbd5e1',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Level {lvl.level} {completedLevels.includes(lvl.level) && '✓'}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
            Operations: <strong style={{ color: '#0284c7' }}>{moveCount}</strong>
          </span>
          {history.length > 0 && !levelCompleted && (
            <button
              onClick={handleUndo}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600'
              }}
            >
              Undo
            </button>
          )}
          <button
            onClick={handleRestartLevel}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600'
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
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ fontSize: '13px', color: '#0369a1', fontWeight: '700', textTransform: 'uppercase' }}>
            Mission Objective
          </div>
          <div style={{ fontSize: '18px', fontWeight: '800', color: '#0c4a6e', marginTop: '2px' }}>
            Measure exactly <span style={{ color: '#0284c7' }}>{currentLevel.target} Litres</span> in either jug!
          </div>
        </div>
        <div style={{
          padding: '8px 16px',
          background: 'white',
          borderRadius: '10px',
          border: '1px solid #7dd3fc',
          fontSize: '13px',
          fontWeight: '700',
          color: '#0369a1'
        }}>
          Minimum Moves: ~{currentLevel.minMoves}
        </div>
      </div>

      {/* Visual Jug Area */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '1.5px solid #e2e8f0',
        padding: '36px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '80px', alignItems: 'flex-end', minHeight: '260px' }}>
          {/* Jug A */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '160px' }}>
            <div style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
              Jug A ({currentLevel.capA}L)
            </div>

            {/* Container Cylinder */}
            <div style={{
              width: '120px',
              height: '200px',
              border: '3px solid #334155',
              borderTop: 'none',
              borderRadius: '0 0 16px 16px',
              position: 'relative',
              background: '#f8fafc',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end'
            }}>
              {/* Water */}
              <div style={{
                width: '100%',
                height: `${pctA}%`,
                background: jugA === currentLevel.target 
                  ? 'linear-gradient(180deg, #34d399, #059669)' 
                  : 'linear-gradient(180deg, #38bdf8, #0284c7)',
                transition: 'height 0.4s ease-in-out',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '800',
                fontSize: '18px'
              }}>
                {jugA > 0 && `${jugA}L`}
              </div>
            </div>

            <div style={{ marginTop: '10px', fontSize: '14px', fontWeight: '700', color: '#475569' }}>
              {jugA} / {currentLevel.capA} Litres
            </div>

            {/* Jug A Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', marginTop: '14px' }}>
              <button
                onClick={handleFillA}
                disabled={jugA === currentLevel.capA || levelCompleted}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  background: '#0284c7',
                  color: 'white',
                  border: 'none',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: jugA === currentLevel.capA ? 'default' : 'pointer',
                  opacity: jugA === currentLevel.capA ? 0.6 : 1
                }}
              >
                Fill Jug A (to {currentLevel.capA}L)
              </button>
              <button
                onClick={handleEmptyA}
                disabled={jugA === 0 || levelCompleted}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  background: '#f1f5f9',
                  color: '#475569',
                  border: '1px solid #cbd5e1',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: jugA === 0 ? 'default' : 'pointer',
                  opacity: jugA === 0 ? 0.6 : 1
                }}
              >
                Empty Jug A
              </button>
            </div>
          </div>

          {/* Transfer Buttons Center Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '30px' }}>
            <button
              onClick={handlePourAtoB}
              disabled={jugA === 0 || jugB === currentLevel.capB || levelCompleted}
              style={{
                padding: '10px 16px',
                borderRadius: '10px',
                background: '#e0f2fe',
                border: '1.5px solid #7dd3fc',
                color: '#0369a1',
                fontWeight: '800',
                fontSize: '13px',
                cursor: jugA === 0 || jugB === currentLevel.capB ? 'default' : 'pointer',
                opacity: jugA === 0 || jugB === currentLevel.capB ? 0.5 : 1
              }}
            >
              Pour A ➔ B
            </button>
            <button
              onClick={handlePourBtoA}
              disabled={jugB === 0 || jugA === currentLevel.capA || levelCompleted}
              style={{
                padding: '10px 16px',
                borderRadius: '10px',
                background: '#e0f2fe',
                border: '1.5px solid #7dd3fc',
                color: '#0369a1',
                fontWeight: '800',
                fontSize: '13px',
                cursor: jugB === 0 || jugA === currentLevel.capA ? 'default' : 'pointer',
                opacity: jugB === 0 || jugA === currentLevel.capA ? 0.5 : 1
              }}
            >
              Pour B ➔ A
            </button>
          </div>

          {/* Jug B */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '160px' }}>
            <div style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
              Jug B ({currentLevel.capB}L)
            </div>

            {/* Container Cylinder */}
            <div style={{
              width: '110px',
              height: '170px',
              border: '3px solid #334155',
              borderTop: 'none',
              borderRadius: '0 0 16px 16px',
              position: 'relative',
              background: '#f8fafc',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end'
            }}>
              {/* Water */}
              <div style={{
                width: '100%',
                height: `${pctB}%`,
                background: jugB === currentLevel.target 
                  ? 'linear-gradient(180deg, #34d399, #059669)' 
                  : 'linear-gradient(180deg, #38bdf8, #0284c7)',
                transition: 'height 0.4s ease-in-out',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '800',
                fontSize: '18px'
              }}>
                {jugB > 0 && `${jugB}L`}
              </div>
            </div>

            <div style={{ marginTop: '10px', fontSize: '14px', fontWeight: '700', color: '#475569' }}>
              {jugB} / {currentLevel.capB} Litres
            </div>

            {/* Jug B Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', marginTop: '14px' }}>
              <button
                onClick={handleFillB}
                disabled={jugB === currentLevel.capB || levelCompleted}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  background: '#0284c7',
                  color: 'white',
                  border: 'none',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: jugB === currentLevel.capB ? 'default' : 'pointer',
                  opacity: jugB === currentLevel.capB ? 0.6 : 1
                }}
              >
                Fill Jug B (to {currentLevel.capB}L)
              </button>
              <button
                onClick={handleEmptyB}
                disabled={jugB === 0 || levelCompleted}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  background: '#f1f5f9',
                  color: '#475569',
                  border: '1px solid #cbd5e1',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: jugB === 0 ? 'default' : 'pointer',
                  opacity: jugB === 0 ? 0.6 : 1
                }}
              >
                Empty Jug B
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {levelCompleted && (
        <div style={{
          padding: '18px 24px',
          background: '#f0fdf4',
          border: '1.5px solid #86efac',
          borderRadius: '12px',
          color: '#166534',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CheckCircle2 size={24} color="#16a34a" />
            <div>
              <strong style={{ fontSize: '16px' }}>Target Reached!</strong>
              <div style={{ fontSize: '14px', marginTop: '2px' }}>
                You measured exactly {currentLevel.target}L in {moveCount} moves!
              </div>
            </div>
          </div>

          <button
            onClick={handleNextLevel}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 22px',
              borderRadius: '8px',
              background: '#16a34a',
              color: 'white',
              border: 'none',
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(22, 163, 74, 0.3)'
            }}
          >
            <span>{currentLevelIdx < LEVELS.length - 1 ? 'Next Level' : 'Complete Challenge'}</span>
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Bottom Hint Bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <button
          onClick={() => setShowHint(prev => !prev)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 18px',
            borderRadius: '10px',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            color: '#475569'
          }}
        >
          <Lightbulb size={16} color="#eab308" /> {showHint ? 'Hide Hint' : 'Need a Strategy Hint?'}
        </button>
      </div>

      {showHint && (
        <div style={{
          marginTop: '14px',
          padding: '14px 18px',
          background: '#fffbeb',
          borderRadius: '10px',
          border: '1px solid #fde68a',
          color: '#92400e',
          fontSize: '14px',
          lineHeight: '1.5'
        }}>
          💡 <strong>Level {currentLevel.level} Strategy:</strong> {currentLevel.hint}
        </div>
      )}
    </div>
  );
};

export default WaterJugGame;
