import React, { useState, useEffect } from 'react';
import { RotateCcw, Lightbulb, CheckCircle2, ArrowRight, Award, Layers, AlertCircle } from 'lucide-react';

const DISK_COLORS = [
  '#ef4444', // Red (Disk 1 - smallest)
  '#f97316', // Orange (Disk 2)
  '#eab308', // Yellow (Disk 3)
  '#10b981', // Green (Disk 4)
  '#3b82f6', // Blue (Disk 5 - largest)
];

const TowerOfHanoiGame = ({ onGameComplete }) => {
  const [diskCount, setDiskCount] = useState(3); // Level 1: 3 disks, Level 2: 4, Level 3: 5
  // Rods contain array of disk numbers (smaller number = smaller disk)
  // e.g. for 3 disks: rodA = [3, 2, 1] (bottom to top)
  const [rods, setRods] = useState({
    A: [3, 2, 1],
    B: [],
    C: []
  });
  const [selectedRod, setSelectedRod] = useState(null); // Rod currently selected to move from
  const [moveCount, setMoveCount] = useState(0);
  const [history, setHistory] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [startTime] = useState(Date.now());

  const minMoves = Math.pow(2, diskCount) - 1;

  const initGame = (count) => {
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
    setMoveCount(0);
    setHistory([]);
    setErrorMessage(null);
    setIsCompleted(false);
    setShowHint(false);
  };

  useEffect(() => {
    initGame(diskCount);
  }, [diskCount]);

  const handleRodClick = (rodKey) => {
    if (isCompleted) return;
    setErrorMessage(null);

    // If no rod selected yet, pick top disk from this rod
    if (selectedRod === null) {
      if (rods[rodKey].length === 0) {
        setErrorMessage(`Rod ${rodKey} is empty! Select a rod with disks.`);
        return;
      }
      setSelectedRod(rodKey);
    } else {
      // If clicking the same rod again, deselect
      if (selectedRod === rodKey) {
        setSelectedRod(null);
        return;
      }

      // Trying to move top disk from selectedRod to rodKey
      const sourceDisks = rods[selectedRod];
      const targetDisks = rods[rodKey];
      const movingDisk = sourceDisks[sourceDisks.length - 1];

      // Validate: Cannot place larger disk on smaller disk
      if (targetDisks.length > 0) {
        const topTargetDisk = targetDisks[targetDisks.length - 1];
        if (movingDisk > topTargetDisk) {
          setErrorMessage(`❌ Invalid Move! You cannot place a larger disk (Size ${movingDisk}) on a smaller disk (Size ${topTargetDisk})!`);
          setSelectedRod(null);
          return;
        }
      }

      // Perform move
      const newSource = [...sourceDisks.slice(0, -1)];
      const newTarget = [...targetDisks, movingDisk];
      const newRods = {
        ...rods,
        [selectedRod]: newSource,
        [rodKey]: newTarget
      };

      setHistory([...history, rods]);
      setRods(newRods);
      setSelectedRod(null);
      const newMoveCount = moveCount + 1;
      setMoveCount(newMoveCount);

      // Check win condition: all disks on Rod C
      if (newRods.C.length === diskCount) {
        setIsCompleted(true);
      }
    }
  };

  const handleUndo = () => {
    if (history.length === 0 || isCompleted) return;
    const prev = history[history.length - 1];
    setRods(prev);
    setHistory(history.slice(0, -1));
    setSelectedRod(null);
    setErrorMessage(null);
  };

  const handleRestart = () => {
    initGame(diskCount);
  };

  const handleFinish = () => {
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    // Score based on efficiency compared to minimum moves
    let score = 100;
    if (moveCount > minMoves) {
      const extraMoves = moveCount - minMoves;
      score = Math.max(60, 100 - extraMoves * 4);
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

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      {/* Top Header */}
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
        {/* Level selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748b' }}>Disks:</span>
          {[3, 4, 5].map(cnt => (
            <button
              key={cnt}
              onClick={() => setDiskCount(cnt)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                background: diskCount === cnt ? '#2563eb' : '#ffffff',
                color: diskCount === cnt ? 'white' : '#475569',
                border: diskCount === cnt ? '1px solid #2563eb' : '1px solid #cbd5e1',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              {cnt} Disks (Level {cnt - 2})
            </button>
          ))}
        </div>

        {/* Moves & Reset */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
            Moves: <strong style={{ color: '#2563eb' }}>{moveCount}</strong> / Min: <strong>{minMoves}</strong>
          </div>
          {history.length > 0 && !isCompleted && (
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
            onClick={handleRestart}
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
            <RotateCcw size={14} /> Restart
          </button>
        </div>
      </div>

      {/* Rules Notice */}
      <div style={{
        background: '#eff6ff',
        border: '1.5px solid #bfdbfe',
        borderRadius: '12px',
        padding: '12px 18px',
        marginBottom: '20px',
        fontSize: '13px',
        color: '#1e40af'
      }}>
        <strong>Rules:</strong> Move all disks from <strong>Rod A</strong> to <strong>Rod C</strong>. You can only move one disk at a time, and a larger disk can never be placed on top of a smaller disk! Click a rod to select its top disk, then click another rod to move it.
      </div>

      {/* Main Interactive Rods Canvas */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '1.5px solid #e2e8f0',
        padding: '36px 20px 20px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', minHeight: '260px', position: 'relative' }}>
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
                  width: '200px',
                  cursor: 'pointer',
                  padding: '10px 4px',
                  borderRadius: '12px',
                  background: isSelected ? '#eff6ff' : 'transparent',
                  border: isSelected ? '2px dashed #2563eb' : '2px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Rod Vertical Spindle */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '190px',
                  display: 'flex',
                  flexDirection: 'column-reverse',
                  alignItems: 'center'
                }}>
                  {/* Central Pole */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    width: '12px',
                    height: '170px',
                    background: '#94a3b8',
                    borderRadius: '6px 6px 0 0',
                    zIndex: 1
                  }} />

                  {/* Disks stacked from bottom to top */}
                  {diskList.map((diskSize, idx) => {
                    const widthPx = 50 + diskSize * 26;
                    const isTopDisk = idx === diskList.length - 1;
                    const isLifted = isSelected && isTopDisk;

                    return (
                      <div
                        key={diskSize}
                        style={{
                          width: `${widthPx}px`,
                          height: '24px',
                          background: DISK_COLORS[diskSize - 1] || '#3b82f6',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: '800',
                          fontSize: '12px',
                          zIndex: 2,
                          marginBottom: '2px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                          transform: isLifted ? 'translateY(-20px)' : 'none',
                          transition: 'transform 0.2s ease-in-out'
                        }}
                      >
                        {diskSize}
                      </div>
                    );
                  })}
                </div>

                {/* Base Platform */}
                <div style={{
                  width: '170px',
                  height: '14px',
                  background: '#475569',
                  borderRadius: '4px',
                  marginTop: '4px',
                  zIndex: 3
                }} />

                {/* Label */}
                <div style={{
                  marginTop: '10px',
                  fontSize: '15px',
                  fontWeight: '800',
                  color: rodKey === 'C' ? '#16a34a' : '#0f172a'
                }}>
                  Rod {rodKey} {rodKey === 'A' && '(Start)'} {rodKey === 'C' && '(Target)'}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
                  {isSelected ? 'Selected (Click target rod)' : 'Click to pick / place'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Error / Alert Message */}
      {errorMessage && (
        <div style={{
          padding: '12px 18px',
          background: '#fef2f2',
          border: '1.5px solid #fca5a5',
          borderRadius: '10px',
          color: '#991b1b',
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <AlertCircle size={18} color="#dc2626" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Completion Banner */}
      {isCompleted && (
        <div style={{
          padding: '24px',
          background: '#f0fdf4',
          border: '1.5px solid #86efac',
          borderRadius: '12px',
          color: '#166534',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <CheckCircle2 size={32} color="#16a34a" />
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>Tower of Hanoi Solved!</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
                You moved all {diskCount} disks to Rod C in {moveCount} moves (Minimum possible: {minMoves})!
              </p>
            </div>
          </div>

          <button
            onClick={handleFinish}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '12px 28px',
              borderRadius: '10px',
              background: '#16a34a',
              color: 'white',
              border: 'none',
              fontWeight: '700',
              fontSize: '15px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)'
            }}
          >
            <span>Finish Assessment</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* Hint Section */}
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
          💡 <strong>Recursive Thinking Hint:</strong> To move N disks to Rod C, you first need to move the top N-1 disks to Rod B (the auxiliary rod). Then move the largest disk directly from Rod A to Rod C. Finally, move the N-1 disks from Rod B to Rod C!
        </div>
      )}
    </div>
  );
};

export default TowerOfHanoiGame;
