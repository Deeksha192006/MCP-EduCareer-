import React, { useState, useEffect } from 'react';
import { 
  RotateCcw, Lightbulb, AlertTriangle, CheckCircle2, ArrowRight, 
  Award, Compass, ShieldCheck, Volume2, VolumeX, Play, Sparkles, Undo2 
} from 'lucide-react';
import { gameAudio } from '../../utils/gameAudio';

// Entity definitions
const ALL_ENTITIES = [
  { id: 'tiger', name: 'Tiger', icon: '🐯', color: '#ea580c', badge: 'Predator (attacks Wolf)' },
  { id: 'wolf', name: 'Wolf', icon: '🐺', color: '#475569', badge: 'Predator (attacks Deer)' },
  { id: 'deer', name: 'Deer', icon: '🦌', color: '#b45309', badge: 'Herbivore (eats Grass)' },
  { id: 'grass', name: 'Grass', icon: '🌾', color: '#16a34a', badge: 'Cargo (eaten by Deer)' },
];

const RiverCrossingGame = ({ onGameComplete }) => {
  // Game lifecycle: 'intro' | 'playing' | 'completed'
  const [gameState, setGameState] = useState('intro');
  const [difficulty, setDifficulty] = useState('medium'); // 'easy' (3 items), 'medium' (4 items cap 2), 'hard' (4 items cap 1)

  // Positions: 'left' | 'boat' | 'right'
  const [farmerBank, setFarmerBank] = useState('left'); // 'left' | 'right'
  const [positions, setPositions] = useState({
    tiger: 'left',
    wolf: 'left',
    deer: 'left',
    grass: 'left'
  });

  const [boatEntities, setBoatEntities] = useState([]); // entity ids currently in boat
  const [isRowing, setIsRowing] = useState(false);
  const [boatPositionX, setBoatPositionX] = useState(0); // 0 (left) to 100 (right)

  // Game statistics
  const [moveCount, setMoveCount] = useState(0);
  const [history, setHistory] = useState([]);
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'error' | 'success' | 'info', text: string }
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [muted, setMuted] = useState(gameAudio.isMuted());
  const [isShaking, setIsShaking] = useState(false);

  // Active entities depending on difficulty
  const activeEntities = difficulty === 'easy'
    ? ALL_ENTITIES.filter(e => e.id !== 'tiger') // classic 3 items
    : ALL_ENTITIES;

  const maxBoatCapacity = difficulty === 'hard' ? 1 : (difficulty === 'medium' ? 2 : 1);

  // Initialize or reset game
  const initGame = (selectedDiff = difficulty) => {
    setFarmerBank('left');
    const initPos = {};
    ALL_ENTITIES.forEach(e => {
      initPos[e.id] = 'left';
    });
    setPositions(initPos);
    setBoatEntities([]);
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

  // Check safety constraints on a bank when Farmer is absent
  const checkBankConflicts = (bank, currentPositions, currentFarmerBank) => {
    if (currentFarmerBank === bank) return null; // Farmer safely guards this bank

    const onBank = activeEntities
      .map(e => e.id)
      .filter(id => currentPositions[id] === bank);

    // Rule 1: Tiger & Wolf
    if (onBank.includes('tiger') && onBank.includes('wolf')) {
      return {
        violator: 'tiger_wolf',
        message: `⚠️ Unsafe State on ${bank === 'left' ? 'Left' : 'Right'} Bank: The Tiger attacked the Wolf! They cannot remain together when the Farmer is away.`
      };
    }

    // Rule 2: Wolf & Deer
    if (onBank.includes('wolf') && onBank.includes('deer')) {
      return {
        violator: 'wolf_deer',
        message: `⚠️ Unsafe State on ${bank === 'left' ? 'Left' : 'Right'} Bank: The Wolf attacked the Deer! They cannot remain together when the Farmer is away.`
      };
    }

    // Rule 3: Deer & Grass
    if (onBank.includes('deer') && onBank.includes('grass')) {
      return {
        violator: 'deer_grass',
        message: `⚠️ Unsafe State on ${bank === 'left' ? 'Left' : 'Right'} Bank: The Deer ate the Grass! They cannot remain together when the Farmer is away.`
      };
    }

    return null;
  };

  // Student clicks an entity to board / disembark
  const handleToggleBoardEntity = (entityId) => {
    if (isRowing) return;
    setStatusMessage(null);

    const currentPos = positions[entityId];

    // Case 1: Entity is already in the boat -> step off onto current farmer's bank
    if (boatEntities.includes(entityId)) {
      gameAudio.playMove();
      setBoatEntities(prev => prev.filter(id => id !== entityId));
      setPositions(prev => ({
        ...prev,
        [entityId]: farmerBank
      }));
      return;
    }

    // Case 2: Entity is on the same bank as the boat/farmer -> board the boat
    if (currentPos === farmerBank) {
      if (boatEntities.length >= maxBoatCapacity) {
        gameAudio.playError();
        setStatusMessage({
          type: 'error',
          text: `The boat is at maximum capacity (${maxBoatCapacity} passenger${maxBoatCapacity > 1 ? 's' : ''} + Farmer)!`
        });
        return;
      }

      gameAudio.playMove();
      setBoatEntities(prev => [...prev, entityId]);
      setPositions(prev => ({
        ...prev,
        [entityId]: 'boat'
      }));
    } else {
      gameAudio.playError();
      setStatusMessage({
        type: 'error',
        text: `Cannot reach ${entityId}! The boat is currently at the ${farmerBank.toUpperCase()} bank.`
      });
    }
  };

  // Student rows the boat across the river
  const handleRowBoat = () => {
    if (isRowing) return;

    const sourceBank = farmerBank;
    const destBank = sourceBank === 'left' ? 'right' : 'left';

    // Save history snapshot for undo
    const snapshot = {
      farmerBank,
      positions: { ...positions },
      boatEntities: [...boatEntities],
      boatPositionX
    };

    setIsRowing(true);
    gameAudio.playPour(); // Oar sound

    // Animate boat glide across the river
    setBoatPositionX(destBank === 'right' ? 100 : 0);

    setTimeout(() => {
      // Arrived at destination bank
      const newPositions = { ...positions };
      // All entities in boat arrive at destination bank
      boatEntities.forEach(id => {
        newPositions[id] = destBank;
      });

      setFarmerBank(destBank);
      setPositions(newPositions);
      setBoatEntities([]);
      setIsRowing(false);
      setMoveCount(prev => prev + 1);
      setHistory(prev => [...prev, snapshot]);

      // Check conflicts on source bank (where Farmer just left)
      const conflictSource = checkBankConflicts(sourceBank, newPositions, destBank);
      // Check conflicts on destination bank
      const conflictDest = checkBankConflicts(destBank, newPositions, destBank);
      const conflict = conflictSource || conflictDest;

      if (conflict) {
        gameAudio.playError();
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
        setStatusMessage({
          type: 'error',
          text: conflict.message
        });
      } else {
        // Check win condition
        const allAcross = activeEntities.every(e => newPositions[e.id] === 'right') && destBank === 'right';
        if (allAcross) {
          gameAudio.playLevelUp();
          setStatusMessage({
            type: 'success',
            text: '🎉 Victory! All entities have safely crossed the river!'
          });
          setTimeout(() => {
            setGameState('completed');
          }, 900);
        } else {
          gameAudio.playSuccess();
          setStatusMessage({
            type: 'info',
            text: `Safe crossing! Arrived safely at the ${destBank.toUpperCase()} bank.`
          });
        }
      }
    }, 1100);
  };

  const handleUndo = () => {
    if (history.length === 0 || isRowing) return;
    gameAudio.playClick();
    const last = history[history.length - 1];
    setFarmerBank(last.farmerBank);
    setPositions(last.positions);
    setBoatEntities(last.boatEntities);
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
    
    // Efficiency scoring
    const minMoves = difficulty === 'easy' ? 7 : (difficulty === 'medium' ? 5 : 7);
    let finalScore = 100;
    if (moveCount > minMoves) {
      finalScore = Math.max(50, 100 - (moveCount - minMoves) * 7);
    }

    if (onGameComplete) {
      onGameComplete({
        score: finalScore,
        maxScore: 100,
        accuracy: finalScore / 100,
        timeTaken,
        attempts: moveCount
      });
    }
  };

  // Skill calculations for display
  const problemSolvingScore = Math.min(96, Math.max(70, Math.round(96 - (moveCount > 7 ? (moveCount - 7) * 4 : 0))));
  const constraintScore = statusMessage?.type === 'error' ? 78 : 95;
  const planningScore = Math.min(94, Math.max(68, Math.round(92 - hintsUsed * 6)));

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
          color: '#0284c7',
          padding: '6px 16px',
          borderRadius: '999px',
          fontSize: '13px',
          fontWeight: '700',
          marginBottom: '20px',
          border: '1px solid #bfdbfe'
        }}>
          <Compass size={16} /> Game 2 of 5 • Computer Science Exploration
        </div>

        <h1 style={{
          fontSize: '32px',
          fontWeight: '800',
          color: '#0f172a',
          marginBottom: '12px'
        }}>
          Farmer River Crossing 🚣
        </h1>

        <p style={{
          fontSize: '16px',
          color: '#475569',
          maxWidth: '620px',
          margin: '0 auto 28px',
          lineHeight: '1.6'
        }}>
          Your mission: Guide the Farmer and all passengers safely across the flowing river. Never leave predator and prey unattended on either bank!
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
              🟢 Easy (Wolf, Deer, Grass)
            </button>
            <button
              onClick={() => { gameAudio.playClick(); setDifficulty('medium'); }}
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                border: difficulty === 'medium' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                background: difficulty === 'medium' ? '#f0f9ff' : '#ffffff',
                color: difficulty === 'medium' ? '#0369a1' : '#475569',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '14px'
              }}
            >
              🟡 Medium (4 Entities, Boat Cap 2)
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
              🔴 Hard (4 Entities, Boat Cap 1)
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
          RIVER CROSSING COMPLETE 🎉
        </h2>
        <p style={{ color: '#64748b', fontSize: '15px', maxWidth: '540px', margin: '0 auto 28px' }}>
          You successfully navigated all entities across without violating food-chain constraints!
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
              {Math.max(50, Math.round(100 - (moveCount > 5 ? (moveCount - 5) * 8 : 0)))} / 100
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
              <div style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>Problem Solving</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#0284c7' }}>{problemSolvingScore} / 100</div>
            </div>
            <div style={{ background: 'white', padding: '12px 16px', borderRadius: '10px', border: '1px solid #dbeafe' }}>
              <div style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>Constraint Reasoning</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#0284c7' }}>{constraintScore} / 100</div>
            </div>
            <div style={{ background: 'white', padding: '12px 16px', borderRadius: '10px', border: '1px solid #dbeafe' }}>
              <div style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>Planning & Foresight</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#0284c7' }}>{planningScore} / 100</div>
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
            background: '#0284c7',
            color: 'white',
            borderRadius: '8px',
            padding: '5px 12px',
            fontSize: '13px',
            fontWeight: '700'
          }}>
            Game 2 of 5
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
            background: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
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
              color: muted ? '#94a3b8' : '#0284c7'
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

      {/* Food Chain Rules Banner */}
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
        <strong>⚠️ Survival Rules (Farmer Away):</strong>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <span>🐯 Tiger attacks 🐺 Wolf</span>
          <span>🐺 Wolf attacks 🦌 Deer</span>
          <span>🦌 Deer eats 🌾 Grass</span>
          <span>🚣 Boat holds Farmer + {maxBoatCapacity}</span>
        </div>
      </div>

      {/* ------------------------------------------------------- */}
      {/* LIVE ANIMATED RIVER SCENE CANVAS                       */}
      {/* ------------------------------------------------------- */}
      <div 
        className={isShaking ? 'game-shake' : ''}
        style={{
          background: '#0c4a6e', // Deep river palette
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
          gridTemplateColumns: 'minmax(180px, 1fr) 2fr minmax(180px, 1fr)',
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
            position: 'relative',
            zIndex: 10
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ color: '#dcfce7', fontWeight: '800', fontSize: '14px' }}>
                  🌳 LEFT BANK
                </span>
                <span className="game-bob" style={{ fontSize: '18px' }}>🌲</span>
              </div>

              {/* Farmer indicator on Left Bank */}
              {farmerBank === 'left' && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  padding: '8px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}>
                  <span className="game-bob" style={{ fontSize: '22px' }}>👨‍🌾</span>
                  <div>
                    <div style={{ color: 'white', fontWeight: '800', fontSize: '12px' }}>Farmer</div>
                    <div style={{ color: '#bbf7d0', fontSize: '10px', fontWeight: '600' }}>Guarding Bank</div>
                  </div>
                </div>
              )}

              {/* Entity buttons on Left Bank */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {activeEntities.map(e => {
                  const isHere = positions[e.id] === 'left';
                  if (!isHere) return null;
                  return (
                    <button
                      key={e.id}
                      onClick={() => handleToggleBoardEntity(e.id)}
                      disabled={farmerBank !== 'left' || isRowing}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        background: '#ffffff',
                        border: '2px solid #bbf7d0',
                        cursor: farmerBank === 'left' && !isRowing ? 'pointer' : 'not-allowed',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                        transition: 'transform 0.15s ease'
                      }}
                      onMouseEnter={(el) => {
                        if (farmerBank === 'left') el.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(el) => {
                        el.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="game-bob" style={{ fontSize: '20px' }}>{e.icon}</span>
                        <span style={{ fontWeight: '700', fontSize: '13px', color: '#0f172a' }}>{e.name}</span>
                      </div>
                      {farmerBank === 'left' && (
                        <span style={{ fontSize: '10px', color: '#0284c7', fontWeight: '700' }}>+ Board</span>
                      )}
                    </button>
                  );
                })}
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
            {/* Continuously Animated River Waves SVG */}
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

            {/* River Ambient Floating Ripples */}
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

            {/* THE BOAT (Smoothly translated horizontally based on boatPositionX) */}
            <div style={{
              position: 'absolute',
              left: `${15 + (boatPositionX * 0.70)}%`, // Glides across river from 15% to 85%
              bottom: '90px',
              transform: 'translateX(-50%)',
              transition: isRowing ? 'left 1.1s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
              zIndex: 20
            }}>
              {/* Boat Vessel Container with gentle bobbing */}
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
                {/* Passenger Slots */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
                  {/* Farmer in Boat */}
                  <div style={{
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: '8px',
                    padding: '4px 8px',
                    fontSize: '18px'
                  }}>
                    👨‍🌾
                  </div>

                  {/* Passenger cargo */}
                  {boatEntities.map(id => {
                    const ent = ALL_ENTITIES.find(e => e.id === id);
                    return (
                      <div
                        key={id}
                        onClick={() => handleToggleBoardEntity(id)}
                        title="Click to unboard"
                        style={{
                          background: 'rgba(255,255,255,0.2)',
                          borderRadius: '8px',
                          padding: '4px 8px',
                          fontSize: '18px',
                          cursor: isRowing ? 'default' : 'pointer',
                          border: '1px dashed #fde68a'
                        }}
                      >
                        {ent?.icon}
                      </div>
                    );
                  })}

                  {/* Empty slots */}
                  {Array.from({ length: maxBoatCapacity - boatEntities.length }).map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px dashed rgba(255,255,255,0.3)',
                        borderRadius: '8px',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        color: 'rgba(255,255,255,0.5)'
                      }}
                    >
                      Empty
                    </div>
                  ))}
                </div>

                <div style={{ fontSize: '11px', fontWeight: '800', color: '#fde68a' }}>
                  {isRowing ? '🚣 Rowing...' : `Boat (${farmerBank.toUpperCase()})`}
                </div>
              </div>
            </div>

            {/* Row Across Button */}
            <div style={{ position: 'absolute', bottom: '20px', zIndex: 25 }}>
              <button
                onClick={handleRowBoat}
                disabled={isRowing}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 28px',
                  borderRadius: '12px',
                  background: isRowing ? '#64748b' : '#f59e0b',
                  color: '#0f172a',
                  border: 'none',
                  fontSize: '15px',
                  fontWeight: '800',
                  cursor: isRowing ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                  transition: 'transform 0.15s ease'
                }}
              >
                <span>{farmerBank === 'left' ? 'Row to Right Bank ➔' : '⬅ Row to Left Bank'}</span>
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
            position: 'relative',
            zIndex: 10
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ color: '#dcfce7', fontWeight: '800', fontSize: '14px' }}>
                  🌿 RIGHT BANK
                </span>
                <span className="game-bob" style={{ fontSize: '18px' }}>🏁</span>
              </div>

              {/* Farmer indicator on Right Bank */}
              {farmerBank === 'right' && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  padding: '8px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}>
                  <span className="game-bob" style={{ fontSize: '22px' }}>👨‍🌾</span>
                  <div>
                    <div style={{ color: 'white', fontWeight: '800', fontSize: '12px' }}>Farmer</div>
                    <div style={{ color: '#bbf7d0', fontSize: '10px', fontWeight: '600' }}>Guarding Bank</div>
                  </div>
                </div>
              )}

              {/* Entity buttons on Right Bank */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {activeEntities.map(e => {
                  const isHere = positions[e.id] === 'right';
                  if (!isHere) return null;
                  return (
                    <button
                      key={e.id}
                      onClick={() => handleToggleBoardEntity(e.id)}
                      disabled={farmerBank !== 'right' || isRowing}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        background: '#ffffff',
                        border: '2px solid #bbf7d0',
                        cursor: farmerBank === 'right' && !isRowing ? 'pointer' : 'not-allowed',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                        transition: 'transform 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="game-bob" style={{ fontSize: '20px' }}>{e.icon}</span>
                        <span style={{ fontWeight: '700', fontSize: '13px', color: '#0f172a' }}>{e.name}</span>
                      </div>
                      {farmerBank === 'right' && (
                        <span style={{ fontSize: '10px', color: '#0284c7', fontWeight: '700' }}>+ Board</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ color: '#86efac', fontSize: '11px', textAlign: 'center', marginTop: '14px' }}>
              Goal: All Safely Here
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
            {statusMessage.type === 'info' && <ShieldCheck size={22} color="#0284c7" />}
            <span style={{
              color: statusMessage.type === 'error' ? '#991b1b' : (statusMessage.type === 'success' ? '#166534' : '#0369a1'),
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
            💡 <strong>Hint:</strong> Remember that Deer can never be left alone with Wolf, nor Deer with Grass. Start by moving Deer across first. When returning, bring a non-conflicting passenger back if necessary to maintain balance!
          </div>
        )}
      </div>

    </div>
  );
};

export default RiverCrossingGame;
