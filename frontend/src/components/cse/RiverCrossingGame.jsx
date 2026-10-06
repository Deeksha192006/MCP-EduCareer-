import React, { useState } from 'react';
import { RotateCcw, Lightbulb, AlertTriangle, CheckCircle2, ArrowRight, Award, Compass, ShieldCheck } from 'lucide-react';

const ENTITIES = [
  { id: 'tiger', name: 'Tiger', icon: '🐯', color: '#ea580c' },
  { id: 'wolf', name: 'Wolf', icon: '🐺', color: '#475569' },
  { id: 'deer', name: 'Deer', icon: '🦌', color: '#b45309' },
  { id: 'grass', name: 'Grass', icon: '🌾', color: '#16a34a' },
];

const RiverCrossingGame = ({ onGameComplete }) => {
  // State: 'left' or 'right'
  const [farmerBank, setFarmerBank] = useState('left');
  const [positions, setPositions] = useState({
    tiger: 'left',
    wolf: 'left',
    deer: 'left',
    grass: 'left'
  });
  // Selected entities on the boat for the next crossing (ids)
  const [boatEntities, setBoatEntities] = useState([]);
  const [moveCount, setMoveCount] = useState(0);
  const [history, setHistory] = useState([]);
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'error' | 'success' | 'info', text: string }
  const [showHint, setShowHint] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime] = useState(Date.now());
  const [isCrossing, setIsCrossing] = useState(false);

  // Check if a bank has conflicts when farmer is NOT on it
  const checkBankConflicts = (bank, currentPositions, currentFarmerBank) => {
    if (currentFarmerBank === bank) return null; // Farmer protects this bank

    const onThisBank = Object.keys(currentPositions).filter(id => currentPositions[id] === bank);

    // Rule 1: Tiger attacks Wolf
    if (onThisBank.includes('tiger') && onThisBank.includes('wolf')) {
      return {
        violator: 'tiger_wolf',
        message: `⚠️ Danger on ${bank === 'left' ? 'Left' : 'Right'} Bank: The Tiger attacked the Wolf! They cannot be left alone without the Farmer.`
      };
    }

    // Rule 2: Wolf attacks Deer
    if (onThisBank.includes('wolf') && onThisBank.includes('deer')) {
      return {
        violator: 'wolf_deer',
        message: `⚠️ Danger on ${bank === 'left' ? 'Left' : 'Right'} Bank: The Wolf attacked the Deer! They cannot be left alone without the Farmer.`
      };
    }

    // Rule 3: Deer eats Grass
    if (onThisBank.includes('deer') && onThisBank.includes('grass')) {
      return {
        violator: 'deer_grass',
        message: `⚠️ Danger on ${bank === 'left' ? 'Left' : 'Right'} Bank: The Deer ate the Grass! They cannot be left alone without the Farmer.`
      };
    }

    return null;
  };

  const handleToggleBoatEntity = (entityId) => {
    if (isCrossing || isCompleted) return;
    setStatusMessage(null);

    // Can only load if entity is on the same bank as the farmer
    if (positions[entityId] !== farmerBank && !boatEntities.includes(entityId)) {
      setStatusMessage({
        type: 'error',
        text: `The ${entityId} is on the other bank! The boat is currently at the ${farmerBank} bank.`
      });
      return;
    }

    if (boatEntities.includes(entityId)) {
      // Remove from boat
      setBoatEntities(boatEntities.filter(id => id !== entityId));
    } else {
      // Boat capacity: Farmer + up to 2 items
      if (boatEntities.length >= 2) {
        setStatusMessage({
          type: 'info',
          text: 'The boat can only carry the Farmer and up to 2 passengers at a time!'
        });
        return;
      }
      setBoatEntities([...boatEntities, entityId]);
    }
  };

  const handleCrossRiver = () => {
    if (isCrossing || isCompleted) return;

    const destinationBank = farmerBank === 'left' ? 'right' : 'left';
    
    // Save previous state for undo/history
    const prevSnapshot = {
      farmerBank,
      positions: { ...positions },
      boatEntities: [...boatEntities]
    };

    // Calculate new positions
    const newPositions = { ...positions };
    boatEntities.forEach(id => {
      newPositions[id] = destinationBank;
    });

    setIsCrossing(true);

    setTimeout(() => {
      setIsCrossing(false);
      setFarmerBank(destinationBank);
      setPositions(newPositions);
      setBoatEntities([]);
      setMoveCount(prev => prev + 1);
      setHistory(prev => [...prev, prevSnapshot]);

      // Check constraints on both banks
      const conflictLeft = checkBankConflicts('left', newPositions, destinationBank);
      const conflictRight = checkBankConflicts('right', newPositions, destinationBank);
      const conflict = conflictLeft || conflictRight;

      if (conflict) {
        setStatusMessage({
          type: 'error',
          text: conflict.message
        });
      } else {
        // Check win condition: all 4 entities + farmer at right bank
        const allRight = Object.values(newPositions).every(b => b === 'right') && destinationBank === 'right';
        if (allRight) {
          setIsCompleted(true);
          setStatusMessage({
            type: 'success',
            text: '🎉 Congratulations! You safely navigated all entities across the river!'
          });
        } else {
          setStatusMessage({
            type: 'info',
            text: `Safe move! Farmer and cargo reached the ${destinationBank} bank safely.`
          });
        }
      }
    }, 400);
  };

  const handleUndo = () => {
    if (history.length === 0 || isCrossing) return;
    const last = history[history.length - 1];
    setFarmerBank(last.farmerBank);
    setPositions(last.positions);
    setBoatEntities([]);
    setHistory(history.slice(0, -1));
    setStatusMessage(null);
  };

  const handleRestart = () => {
    setFarmerBank('left');
    setPositions({
      tiger: 'left',
      wolf: 'left',
      deer: 'left',
      grass: 'left'
    });
    setBoatEntities([]);
    setMoveCount(0);
    setHistory([]);
    setStatusMessage(null);
    setIsCompleted(false);
    setShowHint(false);
  };

  const handleFinish = () => {
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    // Optimal is ~3-5 moves. Give high score for efficiency.
    let calculatedScore = 100;
    if (moveCount > 4) {
      calculatedScore = Math.max(50, 100 - (moveCount - 4) * 8);
    }
    if (onGameComplete) {
      onGameComplete({
        score: calculatedScore,
        maxScore: 100,
        accuracy: calculatedScore / 100,
        timeTaken,
        attempts: moveCount
      });
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: '#0284c7',
            color: 'white',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '14px',
            fontWeight: '700'
          }}>
            Moves: {moveCount}
          </div>
          <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>
            Goal: Move Farmer & all 4 entities safely to the Right Bank
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

      {/* Rules Notice */}
      <div style={{
        background: '#fffbeb',
        border: '1.5px solid #fde68a',
        borderRadius: '12px',
        padding: '12px 18px',
        marginBottom: '20px',
        fontSize: '13px',
        color: '#92400e',
        lineHeight: '1.5'
      }}>
        <strong>Crucial Survival Rules (when Farmer is away):</strong>
        <span style={{ marginLeft: '12px' }}>• 🐯 Tiger attacks 🐺 Wolf</span>
        <span style={{ marginLeft: '12px' }}>• 🐺 Wolf attacks 🦌 Deer</span>
        <span style={{ marginLeft: '12px' }}>• 🦌 Deer eats 🌾 Grass</span>
        <span style={{ marginLeft: '12px' }}>• Boat holds: 👨‍🌾 Farmer + up to 2 cargo</span>
      </div>

      {/* Main River Crossing Canvas/Scene */}
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
          gridTemplateColumns: '1fr 180px 1fr',
          minHeight: '260px'
        }}>
          {/* Left Bank */}
          <div style={{
            background: '#f1f5f9',
            borderRight: '3px solid #64748b',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '14px',
                borderBottom: '2px solid #cbd5e1',
                paddingBottom: '6px'
              }}>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#334155' }}>
                  LEFT BANK {farmerBank === 'left' && <span style={{ color: '#0284c7' }}>(Farmer Here)</span>}
                </h4>
              </div>

              {/* Entities on Left */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {farmerBank === 'left' && (
                  <div style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    background: '#0284c7',
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span>👨‍🌾</span> Farmer
                  </div>
                )}
                {ENTITIES.map(ent => {
                  const isOnLeft = positions[ent.id] === 'left';
                  const inBoat = boatEntities.includes(ent.id);
                  if (!isOnLeft || inBoat) return null;
                  return (
                    <button
                      key={ent.id}
                      onClick={() => handleToggleBoatEntity(ent.id)}
                      disabled={farmerBank !== 'left'}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '10px',
                        background: '#ffffff',
                        border: '2px solid #cbd5e1',
                        cursor: farmerBank === 'left' ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '14px',
                        fontWeight: '700',
                        color: ent.color,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                      }}
                    >
                      <span style={{ fontSize: '18px' }}>{ent.icon}</span> {ent.name}
                      {farmerBank === 'left' && <span style={{ fontSize: '11px', color: '#0284c7' }}>+ Boat</span>}
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>
              Click entity to load into boat
            </div>
          </div>

          {/* River & Boat */}
          <div style={{
            background: 'linear-gradient(180deg, #38bdf8, #0284c7)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '12px'
          }}>
            <div style={{ color: 'white', fontSize: '11px', fontWeight: '800', letterSpacing: '1px', marginBottom: '8px' }}>
              RIVER
            </div>

            {/* Boat Element */}
            <div style={{
              background: '#78350f',
              border: '2px solid #fef3c7',
              borderRadius: '16px',
              padding: '12px 10px',
              width: '100%',
              maxWidth: '150px',
              textAlign: 'center',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
              transition: 'transform 0.4s ease-in-out',
              transform: farmerBank === 'left' ? 'translateX(-10px)' : 'translateX(10px)'
            }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#fef3c7', marginBottom: '6px' }}>
                🛶 Boat ({farmerBank.toUpperCase()})
              </div>
              <div style={{ fontSize: '12px', color: 'white', marginBottom: '8px' }}>
                👨‍🌾 Farmer
              </div>

              {/* Cargo inside boat */}
              <div style={{ minHeight: '36px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {boatEntities.length === 0 ? (
                  <span style={{ fontSize: '11px', color: '#fde68a' }}>[Empty Cargo]</span>
                ) : (
                  boatEntities.map(id => {
                    const ent = ENTITIES.find(e => e.id === id);
                    return (
                      <div
                        key={id}
                        onClick={() => handleToggleBoatEntity(id)}
                        style={{
                          background: 'white',
                          borderRadius: '6px',
                          padding: '3px 6px',
                          fontSize: '11px',
                          fontWeight: '700',
                          color: '#0f172a',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span>{ent.icon} {ent.name}</span>
                        <span style={{ color: '#ef4444' }}>✕</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Cross Button */}
            {!isCompleted && (
              <button
                onClick={handleCrossRiver}
                disabled={isCrossing}
                style={{
                  marginTop: '16px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  background: '#ffffff',
                  color: '#0369a1',
                  border: '2px solid #ffffff',
                  fontWeight: '800',
                  fontSize: '12px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
              >
                {isCrossing ? 'Rowing...' : `Row to ${farmerBank === 'left' ? 'Right ➔' : 'Left ➔'}`}
              </button>
            )}
          </div>

          {/* Right Bank */}
          <div style={{
            background: '#f1f5f9',
            borderLeft: '3px solid #64748b',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '14px',
                borderBottom: '2px solid #cbd5e1',
                paddingBottom: '6px'
              }}>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#334155' }}>
                  RIGHT BANK {farmerBank === 'right' && <span style={{ color: '#0284c7' }}>(Farmer Here)</span>}
                </h4>
              </div>

              {/* Entities on Right */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {farmerBank === 'right' && (
                  <div style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    background: '#0284c7',
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span>👨‍🌾</span> Farmer
                  </div>
                )}
                {ENTITIES.map(ent => {
                  const isOnRight = positions[ent.id] === 'right';
                  const inBoat = boatEntities.includes(ent.id);
                  if (!isOnRight || inBoat) return null;
                  return (
                    <button
                      key={ent.id}
                      onClick={() => handleToggleBoatEntity(ent.id)}
                      disabled={farmerBank !== 'right'}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '10px',
                        background: '#ffffff',
                        border: '2px solid #cbd5e1',
                        cursor: farmerBank === 'right' ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '14px',
                        fontWeight: '700',
                        color: ent.color,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                      }}
                    >
                      <span style={{ fontSize: '18px' }}>{ent.icon}</span> {ent.name}
                      {farmerBank === 'right' && <span style={{ fontSize: '11px', color: '#0284c7' }}>+ Boat</span>}
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>
              Target: All entities safely here
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
          {statusMessage.type === 'info' && <ShieldCheck size={20} color="#2563eb" />}
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
              Undo Invalid Move
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
          <Lightbulb size={16} color="#eab308" /> {showHint ? 'Hide Hint' : 'Need a Hint?'}
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
          💡 <strong>Hint:</strong> Notice that Tiger & Deer can be left together safely (Tiger only attacks Wolf), and Wolf & Grass can be left together safely (Wolf does not eat Grass). Try moving combinations that leave non-conflicting pairs on the bank!
        </div>
      )}
    </div>
  );
};

export default RiverCrossingGame;
