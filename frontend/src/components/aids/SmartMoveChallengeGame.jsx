import React, { useState, useEffect } from 'react';
import { 
  RotateCcw, Lightbulb, CheckCircle2, ArrowRight, Award, 
  Circle, X as XIcon, AlertTriangle, Volume2, VolumeX, Play, Sparkles, Trophy 
} from 'lucide-react';
import { gameAudio } from '../../utils/gameAudio';

const ROUNDS_CONFIG = [
  { round: 1, difficulty: 'Easy', name: 'Round 1: Novice Bot', desc: 'The opponent makes casual random moves. Seize the center and make an easy line!' },
  { round: 2, difficulty: 'Medium', name: 'Round 2: Tactical Bot', desc: 'The opponent watches your lines and blocks obvious threats. Plan two steps ahead!' },
  { round: 3, difficulty: 'Hard', name: 'Round 3: Master Bot', desc: 'The opponent plays strategic counter-moves. Look for fork traps and solid defenses!' },
];

const WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

const SmartMoveChallengeGame = ({ onGameComplete }) => {
  // Game lifecycle: 'intro' | 'playing' | 'completed'
  const [gameState, setGameState] = useState('intro');
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const currentRound = ROUNDS_CONFIG[currentRoundIdx];

  // 3x3 board: array of 9 elements ('X', 'O', or null)
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isStudentTurn, setIsStudentTurn] = useState(true);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [winnerInfo, setWinnerInfo] = useState(null); // { winner: 'X'|'O'|'draw', line: [...] } | null
  const [adviceText, setAdviceText] = useState("Make your opening move!");
  const [roundStats, setRoundStats] = useState({ won: 0, drawn: 0, lost: 0 });

  const [score, setScore] = useState(0);
  const [totalMoves, setTotalMoves] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [muted, setMuted] = useState(gameAudio.isMuted());

  const initRound = (rIdx = currentRoundIdx) => {
    setBoard(Array(9).fill(null));
    setIsStudentTurn(true);
    setIsAiThinking(false);
    setWinnerInfo(null);
    setAdviceText("Your turn! Place an X on the grid.");
  };

  const handleStartGame = () => {
    gameAudio.playClick();
    setStartTime(Date.now());
    initRound(0);
    setGameState('playing');
  };

  const toggleSound = () => {
    const isMute = gameAudio.toggleMute();
    setMuted(isMute);
    if (!isMute) gameAudio.playClick();
  };

  // Check board for winner
  const checkWinner = (grid) => {
    for (const combo of WINNING_COMBOS) {
      const [a, b, c] = combo;
      if (grid[a] && grid[a] === grid[b] && grid[a] === grid[c]) {
        return { winner: grid[a], line: combo };
      }
    }
    if (grid.every(cell => cell !== null)) {
      return { winner: 'draw', line: [] };
    }
    return null;
  };

  // AI Decision Logic depending on difficulty
  const calculateComputerMove = (grid, diff) => {
    const available = grid.map((val, idx) => (val === null ? idx : null)).filter(val => val !== null);
    if (available.length === 0) return null;

    // 1. Check if computer can win immediately
    for (const combo of WINNING_COMBOS) {
      const [a, b, c] = combo;
      const vals = [grid[a], grid[b], grid[c]];
      if (vals.filter(v => v === 'O').length === 2 && vals.filter(v => v === null).length === 1) {
        return combo[vals.indexOf(null)];
      }
    }

    // 2. In Medium & Hard: Block student from winning immediately
    if (diff === 'Medium' || diff === 'Hard') {
      for (const combo of WINNING_COMBOS) {
        const [a, b, c] = combo;
        const vals = [grid[a], grid[b], grid[c]];
        if (vals.filter(v => v === 'X').length === 2 && vals.filter(v => v === null).length === 1) {
          return combo[vals.indexOf(null)];
        }
      }
    }

    // 3. In Hard: Strategic center and corner capture
    if (diff === 'Hard') {
      // Center control
      if (grid[4] === null) return 4;
      // Corners
      const corners = [0, 2, 6, 8].filter(c => grid[c] === null);
      if (corners.length > 0) {
        return corners[Math.floor(Math.random() * corners.length)];
      }
    }

    // 4. Default: Pick random available
    return available[Math.floor(Math.random() * available.length)];
  };

  // Student makes a move
  const handleCellClick = (idx) => {
    if (!isStudentTurn || board[idx] !== null || winnerInfo || isAiThinking) return;

    gameAudio.playClick();
    const newBoard = [...board];
    newBoard[idx] = 'X';
    setBoard(newBoard);
    setTotalMoves(prev => prev + 1);

    const winCheck = checkWinner(newBoard);
    if (winCheck) {
      handleRoundOutcome(winCheck);
      return;
    }

    // Pass turn to Computer
    setIsStudentTurn(false);
    setIsAiThinking(true);
    setAdviceText("Opponent is analyzing the board...");

    // Human-like thinking delay
    setTimeout(() => {
      const aiIdx = calculateComputerMove(newBoard, currentRound.difficulty);
      if (aiIdx !== null) {
        gameAudio.playMove();
        const afterAiBoard = [...newBoard];
        afterAiBoard[aiIdx] = 'O';
        setBoard(afterAiBoard);

        const aiWinCheck = checkWinner(afterAiBoard);
        if (aiWinCheck) {
          handleRoundOutcome(aiWinCheck);
        } else {
          setIsStudentTurn(true);
          setIsAiThinking(false);

          // Dynamic coach advice
          const hasTwoX = WINNING_COMBOS.some(c => {
            const vals = [afterAiBoard[c[0]], afterAiBoard[c[1]], afterAiBoard[c[2]]];
            return vals.filter(v => v === 'X').length === 2 && vals.includes(null);
          });
          const hasTwoO = WINNING_COMBOS.some(c => {
            const vals = [afterAiBoard[c[0]], afterAiBoard[c[1]], afterAiBoard[c[2]]];
            return vals.filter(v => v === 'O').length === 2 && vals.includes(null);
          });

          if (hasTwoO) {
            setAdviceText("⚠️ Danger! The opponent has 2 in a row. Block them!");
          } else if (hasTwoX) {
            setAdviceText("✨ Great positioning! You have a winning setup.");
          } else {
            setAdviceText("Good move! Keep building pressure across rows and diagonals.");
          }
        }
      }
    }, 450);
  };

  const handleRoundOutcome = (outcome) => {
    setIsAiThinking(false);
    setWinnerInfo(outcome);

    if (outcome.winner === 'X') {
      gameAudio.playSuccess();
      setRoundStats(prev => ({ ...prev, won: prev.won + 1 }));
      setScore(prev => prev + 34);
      setAdviceText("🎉 Magnificent! You completed 3-in-a-row!");
    } else if (outcome.winner === 'draw') {
      gameAudio.playLevelUp();
      setRoundStats(prev => ({ ...prev, drawn: prev.drawn + 1 }));
      setScore(prev => prev + 25);
      setAdviceText("🤝 Solid Strategic Draw! Both sides played tight defense.");
    } else {
      gameAudio.playError();
      setRoundStats(prev => ({ ...prev, lost: prev.lost + 1 }));
      setScore(prev => prev + 15);
      setAdviceText("Opponent found the line. Analyze where the block was missed!");
    }
  };

  const handleNextRound = () => {
    gameAudio.playClick();
    if (currentRoundIdx < ROUNDS_CONFIG.length - 1) {
      const nextR = currentRoundIdx + 1;
      setCurrentRoundIdx(nextR);
      initRound(nextR);
    } else {
      gameAudio.playLevelUp();
      setGameState('completed');
    }
  };

  const handleFinishGame = () => {
    gameAudio.playClick();
    const timeTaken = startTime ? Math.round((Date.now() - startTime) / 1000) : 60;
    const finalScore = Math.min(100, Math.max(65, score));

    if (onGameComplete) {
      onGameComplete({
        gameId: "aids_game_tictactoe",
        gameName: "Smart Move Challenge",
        score: finalScore,
        maxScore: 100,
        accuracy: finalScore / 100,
        timeTaken,
        attempts: totalMoves
      });
    }
  };

  // Skill calculations
  const decisionSkill = Math.min(98, Math.max(72, 80 + roundStats.won * 7));
  const patternSkill = Math.min(96, Math.max(70, 78 + (roundStats.won + roundStats.drawn) * 6));
  const strategicSkill = Math.min(94, Math.max(70, 75 + roundStats.won * 8));
  const problemSolvingSkill = 90;

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
          <Circle size={16} /> Game 2 of 5 • Artificial Intelligence & Data Science
        </div>

        <h1 style={{
          fontSize: '32px',
          fontWeight: '800',
          color: '#0f172a',
          marginBottom: '12px'
        }}>
          ⭕ Smart Move Challenge
        </h1>

        <p style={{
          fontSize: '16px',
          color: '#475569',
          maxWidth: '620px',
          margin: '0 auto 28px',
          lineHeight: '1.6'
        }}>
          <strong>🎯 Your Mission:</strong> Try to create an aligned row, column, or diagonal of three symbols before your opponent does!
        </p>

        {/* Rules Overview Box */}
        <div style={{
          background: '#f8fafc',
          border: '1.5px solid #e2e8f0',
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '680px',
          margin: '0 auto 32px',
          textAlign: 'left'
        }}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>
            🎮 Rules of Engagement:
          </h3>
          <ul style={{ fontSize: '14px', color: '#334155', lineHeight: '1.8', paddingLeft: '20px', margin: 0 }}>
            <li>• You play as <strong style={{ color: '#2563eb' }}>X</strong>, your opponent plays as <strong style={{ color: '#ea580c' }}>O</strong>.</li>
            <li>• Take turns placing one symbol into an empty square on the 3 × 3 grid.</li>
            <li>• The first player to align 3 in a horizontal, vertical, or diagonal row wins!</li>
            <li>• Watch the opponent's moves closely and block them when they threaten to complete a line.</li>
          </ul>
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
          <span>START GAME</span>
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
          SMART MOVE CHALLENGE COMPLETE 🎉
        </h2>
        <p style={{ color: '#64748b', fontSize: '15px', maxWidth: '540px', margin: '0 auto 28px' }}>
          You demonstrated strategic anticipation, pattern recognition, and adaptive decision making against evolving counter-strategies.
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
              {Math.min(100, Math.max(65, score))} / 100
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Wins</div>
            <div style={{ fontSize: '30px', fontWeight: '800', color: '#10b981' }}>{roundStats.won}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Draws</div>
            <div style={{ fontSize: '30px', fontWeight: '800', color: '#0f172a' }}>{roundStats.drawn}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Total Moves</div>
            <div style={{ fontSize: '30px', fontWeight: '800', color: '#f59e0b' }}>{totalMoves}</div>
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
            <strong style={{ color: '#1e40af', fontSize: '15px' }}>Exploratory Cognitive Indicators:</strong>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
            <div style={{ background: 'white', padding: '12px 16px', borderRadius: '10px', border: '1px solid #dbeafe' }}>
              <div style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>Decision Making</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#2563eb' }}>{decisionSkill} / 100</div>
            </div>
            <div style={{ background: 'white', padding: '12px 16px', borderRadius: '10px', border: '1px solid #dbeafe' }}>
              <div style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>Pattern Recognition</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#2563eb' }}>{patternSkill} / 100</div>
            </div>
            <div style={{ background: 'white', padding: '12px 16px', borderRadius: '10px', border: '1px solid #dbeafe' }}>
              <div style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>Strategic Thinking</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#2563eb' }}>{strategicSkill} / 100</div>
            </div>
            <div style={{ background: 'white', padding: '12px 16px', borderRadius: '10px', border: '1px solid #dbeafe' }}>
              <div style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>Problem Solving</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#2563eb' }}>{problemSolvingSkill} / 100</div>
            </div>
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '12px', marginBottom: 0 }}>
            * Note: These metrics are exploratory indicators used by the multi-criteria career recommendation system.
          </p>
        </div>

        <button
          onClick={handleFinishGame}
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
            background: '#2563eb',
            color: 'white',
            borderRadius: '8px',
            padding: '5px 12px',
            fontSize: '13px',
            fontWeight: '700'
          }}>
            Game 2 of 5
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
            {currentRound.name}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '700',
            color: '#0f172a',
            background: '#f8fafc',
            padding: '5px 12px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            Score: <strong style={{ color: '#2563eb' }}>{score}</strong>
          </div>

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
            onClick={() => initRound(currentRoundIdx)}
            title="Reset Grid"
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

      {/* Dynamic Coach Advice Prompt */}
      <div style={{
        background: winnerInfo?.winner === 'X' ? '#f0fdf4' : winnerInfo?.winner === 'O' ? '#fef2f2' : '#eff6ff',
        border: `1.5px solid ${winnerInfo?.winner === 'X' ? '#bbf7d0' : winnerInfo?.winner === 'O' ? '#fecaca' : '#bfdbfe'}`,
        borderRadius: '12px',
        padding: '12px 20px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="#2563eb" />
          <span style={{ fontSize: '14px', fontWeight: '700', color: '#1e3a8a' }}>
            {adviceText}
          </span>
        </div>
        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>
          You: <strong style={{ color: '#2563eb' }}>X</strong> | Opponent: <strong style={{ color: '#ea580c' }}>O</strong>
        </div>
      </div>

      {/* ------------------------------------------------------- */}
      {/* INTERACTIVE 3X3 GRID STAGE                              */}
      {/* ------------------------------------------------------- */}
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        border: '1.5px solid #e2e8f0',
        padding: '36px 20px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 110px)',
          gridTemplateRows: 'repeat(3, 110px)',
          gap: '8px',
          background: '#0f172a',
          padding: '14px',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.25)'
        }}>
          {board.map((cellValue, idx) => {
            const isWinningCell = winnerInfo?.line?.includes(idx);

            let cellBg = '#1e293b';
            if (isWinningCell) {
              cellBg = winnerInfo.winner === 'X' ? '#14532d' : '#7f1d1d';
            }

            return (
              <button
                key={`t-cell-${idx}`}
                onClick={() => handleCellClick(idx)}
                disabled={cellValue !== null || !isStudentTurn || !!winnerInfo}
                style={{
                  background: cellBg,
                  borderRadius: '14px',
                  border: isWinningCell 
                    ? (winnerInfo.winner === 'X' ? '2px solid #22c55e' : '2px solid #ef4444')
                    : '1px solid #334155',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '44px',
                  fontWeight: '900',
                  cursor: cellValue === null && isStudentTurn && !winnerInfo ? 'pointer' : 'default',
                  transition: 'all 0.15s ease'
                }}
              >
                {cellValue === 'X' && (
                  <span 
                    className="game-bob" 
                    style={{ 
                      color: '#38bdf8',
                      filter: 'drop-shadow(0 0 10px rgba(56, 189, 248, 0.6))'
                    }}
                  >
                    ✕
                  </span>
                )}
                {cellValue === 'O' && (
                  <span 
                    className="game-bob" 
                    style={{ 
                      color: '#fb923c',
                      filter: 'drop-shadow(0 0 10px rgba(251, 146, 60, 0.6))'
                    }}
                  >
                    ◯
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Round Outcome Banner */}
      {winnerInfo && (
        <div style={{
          background: winnerInfo.winner === 'X' ? '#f0fdf4' : winnerInfo.winner === 'draw' ? '#f8fafc' : '#fef2f2',
          border: `1.5px solid ${winnerInfo.winner === 'X' ? '#86efac' : winnerInfo.winner === 'draw' ? '#cbd5e1' : '#fecaca'}`,
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
            <Trophy size={26} color={winnerInfo.winner === 'X' ? '#16a34a' : '#2563eb'} />
            <div>
              <strong style={{ 
                color: winnerInfo.winner === 'X' ? '#15803d' : winnerInfo.winner === 'draw' ? '#334155' : '#991b1b', 
                fontSize: '16px' 
              }}>
                {winnerInfo.winner === 'X' ? 'Victory in this Round! 🎉' : winnerInfo.winner === 'draw' ? 'Tactical Stalemate!' : 'Opponent aligned 3-in-a-row'}
              </strong>
              <p style={{ color: '#475569', fontSize: '13px', margin: 0 }}>
                {currentRound.desc}
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
            <span>{currentRoundIdx < ROUNDS_CONFIG.length - 1 ? 'Next Round ➔' : 'View Results'}</span>
          </button>
        </div>
      )}

    </div>
  );
};

export default SmartMoveChallengeGame;
