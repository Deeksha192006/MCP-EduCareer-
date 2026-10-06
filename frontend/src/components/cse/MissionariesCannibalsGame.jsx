import React, { useState } from 'react';
import { RotateCcw, Lightbulb, AlertTriangle, CheckCircle2, ArrowRight, Award, Users, ShieldAlert } from 'lucide-react';

const MissionariesCannibalsGame = ({ onGameComplete }) => {
  // 3 Missionaries, 3 Cannibals
  // Initial state: all 3 M and 3 C on left bank, boat at left
  const [leftM, setLeftM] = useState(3);
  const [leftC, setLeftC] = useState(3);
  const [rightM, setRightM] = useState(0);
  const [rightC, setRightC] = useState(0);
  const [boatBank, setBoatBank] = useState('left'); // 'left' or 'right'

  // People currently on the boat waiting to row across
  const [boatM, setBoatM] = useState(0);
  const [boatC, setBoatC] = useState(0);

  const [moveCount, setMoveCount] = useState(0);
  const [history, setHistory] = useState([]);
  const [statusMessage, setStatusMessage] = useState(null); // { type, text }
  const [isCrossing, setIsCrossing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [startTime] = useState(Date.now());

  // Check state validity:
  // If missionaries > 0, cannibals cannot exceed missionaries on that bank!
  const validateBank = (m, c, bankName) => {
    if (m > 0 && c > m) {
      return `⚠️ Cannibals (${c}) outnumber Missionaries (${m}) on the ${bankName}! Missionaries are overwhelmed.`;
    }
    return null;
  };

  // Add / Remove from boat
  const handleBoardMissionary = () => {
    if (isCrossing || isCompleted) return;
    setStatusMessage(null);
    if (boatM + boatC >= 2) {
      setStatusMessage({ type: 'error', text: 'Boat is full! Maximum capacity is 2 people.' });
      return;
    }

    if (boatBank === 'left') {
      if (leftM > 0) {
        setLeftM(prev => prev - 1);
        setBoatM(prev => prev + 1);
      }
    } else {
      if (rightM > 0) {
        setRightM(prev => prev - 1);
        setBoatM(prev => prev + 1);
      }
    }
  };

  const handleUnboardMissionary = () => {
    if (isCrossing || isCompleted || boatM === 0) return;
    setStatusMessage(null);
    setBoatM(prev => prev - 1);
    if (boatBank === 'left') {
      setLeftM(prev => prev + 1);
    } else {
      setRightM(prev => prev + 1);
    }
  };

  const handleBoardCannibal = () => {
    if (isCrossing || isCompleted) return;
    setStatusMessage(null);
    if (boatM + boatC >= 2) {
      setStatusMessage({ type: 'error', text: 'Boat is full! Maximum capacity is 2 people.' });
      return;
    }

    if (boatBank === 'left') {
      if (leftC > 0) {
        setLeftC(prev => prev - 1);
        setBoatC(prev => prev + 1);
      }
    } else {
      if (rightC > 0) {
        setRightC(prev => prev - 1);
        setBoatC(prev => prev + 1);
      }
    }
  };

  const handleUnboardCannibal = () => {
    if (isCrossing || isCompleted || boatC === 0) return;
    setStatusMessage(null);
    setBoatC(prev => prev - 1);
    if (boatBank === 'left') {
      setLeftC(prev => prev + 1);
    } else {
      setRightC(prev => prev + 1);
    }
  };

  // Row boat across
  const handleRowBoat = () => {
    if (isCrossing || isCompleted) return;
    if (boatM + boatC === 0) {
      setStatusMessage({ type: 'error', text: 'The boat cannot move by itself! At least 1 person must row it.' });
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
      boatC
    };

    const nextBank = boatBank === 'left' ? 'right' : 'left';
    setIsCrossing(true);

    setTimeout(() => {
      setIsCrossing(false);
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
      setMoveCount(prev => prev + 1);
      setHistory(prev => [...prev, snapshot]);

      // Validate constraints
      const errLeft = validateBank(newLeftM, newLeftC, 'Left Bank');
      const errRight = validateBank(newRightM, newRightC, 'Right Bank');
      const conflict = errLeft || errRight;

      if (conflict) {
        setStatusMessage({
          type: 'error',
          text: conflict
        });
      } else {
        // Check win condition: all 3 M and 3 C on Right Bank
        if (newRightM === 3 && newRightC === 3) {
          setIsCompleted(true);
          setStatusMessage({
            type: 'success',
            text: '🎉 Brilliant! All 3 Missionaries and 3 Cannibals crossed the river safely!'
          });
        } else {
          setStatusMessage({
            type: 'info',
            text: `Safe move! Boat landed on the ${nextBank} bank.`
          });
        }
      }
    }, 400);
  };

  const handleUndo = () => {
    if (history.length === 0 || isCrossing) return;
    const last = history[history.length - 1];
    setLeftM(last.leftM);
    setLeftC(last.leftC);
    setRightM(last.rightM);
    setRightC(last.rightC);
    setBoatBank(last.boatBank);
    setBoatM(last.boatM);
    setBoatC(last.boatC);
    setHistory(history.slice(0, -1));
    setStatusMessage(null);
  };

  const handleRestart = () => {
    setLeftM(3);
    setLeftC(3);
    setRightM(0);
    setRightC(0);
    setBoatBank('left');
    setBoatM(0);
    setBoatC(0);
    setMoveCount(0);
    setHistory([]);
    setStatusMessage(null);
    setIsCompleted(false);
    setShowHint(false);
  };

  const handleFinish = () => {
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    // Optimal is 11 moves
    let score = 100;
    if (moveCount > 11) {
      score = Math.max(50, 100 - (moveCount - 11) * 5);
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
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Game Header */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: '#4f46e5',
            color: 'white',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '14px',
            fontWeight: '700'
          }}>
            Moves: {moveCount}
          </div>
          <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>
            Goal: Move 3 Missionaries & 3 Cannibals safely to the Right Bank
          </span>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
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
              Undo Move
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

      {/* Constraints Reminder */}
      <div style={{
        background: '#eff6ff',
        border: '1.5px solid #bfdbfe',
        borderRadius: '12px',
        padding: '12px 18px',
        marginBottom: '20px',
        fontSize: '13px',
        color: '#1e40af',
        lineHeight: '1.5'
      }}>
        <strong>Constraint:</strong> Cannibals must NEVER outnumber Missionaries on either bank (unless 0 missionaries are present). Boat carries max 2 people, at least 1 must row!
      </div>

      {/* Main River Scene */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '1.5px solid #cbd5e1',
        overflow: 'hidden',
        boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
        marginBottom: '20px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 200px 1fr',
          minHeight: '280px'
        }}>
          {/* Left Bank */}
          <div style={{
            background: '#f8fafc',
            borderRight: '3px solid #64748b',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <h4 style={{ margin: '0 0 14px 0', fontSize: '15px', fontWeight: '800', color: '#334155', borderBottom: '2px solid #e2e8f0', paddingBottom: '6px' }}>
                LEFT BANK {boatBank === 'left' && <span style={{ color: '#4f46e5' }}>(Boat Here)</span>}
              </h4>

              {/* Missionary Group */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#2563eb', marginBottom: '6px' }}>
                  Missionaries ({leftM})
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {Array.from({ length: leftM }).map((_, i) => (
                    <button
                      key={i}
                      onClick={handleBoardMissionary}
                      disabled={boatBank !== 'left'}
                      title="Click to board boat"
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        background: '#dbeafe',
                        border: '1.5px solid #93c5fd',
                        color: '#1e40af',
                        fontWeight: '700',
                        fontSize: '13px',
                        cursor: boatBank === 'left' ? 'pointer' : 'not-allowed'
                      }}
                    >
                      🕊️ M
                    </button>
                  ))}
                  {leftM === 0 && <span style={{ fontSize: '12px', color: '#94a3b8' }}>None</span>}
                </div>
              </div>

              {/* Cannibal Group */}
              <div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#dc2626', marginBottom: '6px' }}>
                  Cannibals ({leftC})
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {Array.from({ length: leftC }).map((_, i) => (
                    <button
                      key={i}
                      onClick={handleBoardCannibal}
                      disabled={boatBank !== 'left'}
                      title="Click to board boat"
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        background: '#fee2e2',
                        border: '1.5px solid #fca5a5',
                        color: '#991b1b',
                        fontWeight: '700',
                        fontSize: '13px',
                        cursor: boatBank === 'left' ? 'pointer' : 'not-allowed'
                      }}
                    >
                      🔥 C
                    </button>
                  ))}
                  {leftC === 0 && <span style={{ fontSize: '12px', color: '#94a3b8' }}>None</span>}
                </div>
              </div>
            </div>

            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>
              Click person to board boat
            </div>
          </div>

          {/* River & Boat */}
          <div style={{
            background: 'linear-gradient(180deg, #60a5fa, #2563eb)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '16px 10px'
          }}>
            <div style={{ color: 'white', fontSize: '11px', fontWeight: '800', letterSpacing: '1px', marginBottom: '12px' }}>
              RIVER
            </div>

            {/* Boat */}
            <div style={{
              background: '#451a03',
              border: '2px solid #fde68a',
              borderRadius: '16px',
              padding: '12px 10px',
              width: '100%',
              maxWidth: '160px',
              textAlign: 'center',
              boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
              transition: 'transform 0.4s ease-in-out',
              transform: boatBank === 'left' ? 'translateX(-10px)' : 'translateX(10px)'
            }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#fde68a', marginBottom: '8px' }}>
                🛶 Boat ({boatM + boatC}/2)
              </div>

              {/* Passengers inside boat */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', minHeight: '34px', marginBottom: '8px' }}>
                {Array.from({ length: boatM }).map((_, i) => (
                  <button
                    key={`bm-${i}`}
                    onClick={handleUnboardMissionary}
                    style={{
                      background: '#dbeafe',
                      border: '1px solid #93c5fd',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      fontSize: '11px',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                    title="Click to unboard"
                  >
                    🕊️ M ✕
                  </button>
                ))}
                {Array.from({ length: boatC }).map((_, i) => (
                  <button
                    key={`bc-${i}`}
                    onClick={handleUnboardCannibal}
                    style={{
                      background: '#fee2e2',
                      border: '1px solid #fca5a5',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      fontSize: '11px',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                    title="Click to unboard"
                  >
                    🔥 C ✕
                  </button>
                ))}
                {boatM + boatC === 0 && (
                  <span style={{ fontSize: '11px', color: '#fde68a', alignSelf: 'center' }}>[Empty]</span>
                )}
              </div>
            </div>

            {/* Row Button */}
            {!isCompleted && (
              <button
                onClick={handleRowBoat}
                disabled={isCrossing || (boatM + boatC === 0)}
                style={{
                  marginTop: '16px',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  background: '#ffffff',
                  color: '#1e40af',
                  border: '2px solid #ffffff',
                  fontWeight: '800',
                  fontSize: '12px',
                  cursor: boatM + boatC > 0 ? 'pointer' : 'not-allowed',
                  opacity: boatM + boatC > 0 ? 1 : 0.6,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
              >
                {isCrossing ? 'Rowing...' : `Row to ${boatBank === 'left' ? 'Right ➔' : 'Left ➔'}`}
              </button>
            )}
          </div>

          {/* Right Bank */}
          <div style={{
            background: '#f8fafc',
            borderLeft: '3px solid #64748b',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <h4 style={{ margin: '0 0 14px 0', fontSize: '15px', fontWeight: '800', color: '#334155', borderBottom: '2px solid #e2e8f0', paddingBottom: '6px' }}>
                RIGHT BANK {boatBank === 'right' && <span style={{ color: '#4f46e5' }}>(Boat Here)</span>}
              </h4>

              {/* Missionary Group */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#2563eb', marginBottom: '6px' }}>
                  Missionaries ({rightM})
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {Array.from({ length: rightM }).map((_, i) => (
                    <button
                      key={i}
                      onClick={handleBoardMissionary}
                      disabled={boatBank !== 'right'}
                      title="Click to board boat"
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        background: '#dbeafe',
                        border: '1.5px solid #93c5fd',
                        color: '#1e40af',
                        fontWeight: '700',
                        fontSize: '13px',
                        cursor: boatBank === 'right' ? 'pointer' : 'not-allowed'
                      }}
                    >
                      🕊️ M
                    </button>
                  ))}
                  {rightM === 0 && <span style={{ fontSize: '12px', color: '#94a3b8' }}>None</span>}
                </div>
              </div>

              {/* Cannibal Group */}
              <div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#dc2626', marginBottom: '6px' }}>
                  Cannibals ({rightC})
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {Array.from({ length: rightC }).map((_, i) => (
                    <button
                      key={i}
                      onClick={handleBoardCannibal}
                      disabled={boatBank !== 'right'}
                      title="Click to board boat"
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        background: '#fee2e2',
                        border: '1.5px solid #fca5a5',
                        color: '#991b1b',
                        fontWeight: '700',
                        fontSize: '13px',
                        cursor: boatBank === 'right' ? 'pointer' : 'not-allowed'
                      }}
                    >
                      🔥 C
                    </button>
                  ))}
                  {rightC === 0 && <span style={{ fontSize: '12px', color: '#94a3b8' }}>None</span>}
                </div>
              </div>
            </div>

            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>
              Goal: All 3 M and 3 C here safely
            </div>
          </div>
        </div>
      </div>

      {/* Status or Alert Feedback */}
      {statusMessage && (
        <div style={{
          padding: '14px 20px',
          borderRadius: '12px',
          background: statusMessage.type === 'error' ? '#fef2f2' : statusMessage.type === 'success' ? '#f0fdf4' : '#eff6ff',
          border: `1.5px solid ${statusMessage.type === 'error' ? '#fca5a5' : statusMessage.type === 'success' ? '#86efac' : '#bfdbfe'}`,
          color: statusMessage.type === 'error' ? '#991b1b' : statusMessage.type === 'success' ? '#166534' : '#1e40af',
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          {statusMessage.type === 'error' && <AlertTriangle size={20} color="#dc2626" />}
          {statusMessage.type === 'success' && <CheckCircle2 size={20} color="#16a34a" />}
          {statusMessage.type === 'info' && <Users size={20} color="#2563eb" />}
          <span>{statusMessage.text}</span>
          {statusMessage.type === 'error' && (
            <button
              onClick={handleUndo}
              style={{
                marginLeft: 'auto',
                background: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 10px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Undo Move
            </button>
          )}
        </div>
      )}

      {/* Bottom Controls / Hint / Finish */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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

        {isCompleted && (
          <button
            onClick={handleFinish}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 28px',
              borderRadius: '10px',
              background: '#16a34a',
              color: 'white',
              border: 'none',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)'
            }}
          >
            <span>Complete Challenge</span>
            <ArrowRight size={18} />
          </button>
        )}
      </div>

      {showHint && (
        <div style={{
          marginTop: '16px',
          padding: '12px 18px',
          background: '#fffbeb',
          borderRadius: '10px',
          border: '1px solid #fde68a',
          color: '#92400e',
          fontSize: '14px'
        }}>
          💡 <strong>Hint:</strong> Step 1: Send 2 Cannibals across to Right. Step 2: 1 Cannibal rows back to Left. Step 3: Send another 2 Cannibals across... Notice how having 0 Missionaries on a bank is totally safe, because cannibals only attack when missionaries are present!
        </div>
      )}
    </div>
  );
};

export default MissionariesCannibalsGame;
