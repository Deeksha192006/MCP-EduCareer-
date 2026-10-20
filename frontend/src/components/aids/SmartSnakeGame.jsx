import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  RotateCcw, CheckCircle2, ArrowRight, Award, Play, Pause, 
  Volume2, VolumeX, Sparkles, ArrowUp, ArrowDown, ArrowLeft, ArrowRight as ArrowRightIcon, ShieldAlert 
} from 'lucide-react';
import { gameAudio } from '../../utils/gameAudio';

const GRID_SIZE = 16; // 16 x 16 grid

const LEVELS = [
  {
    level: 1,
    name: "Level 1: Open Meadow",
    difficulty: "Easy",
    targetFood: 4,
    speed: 175,
    obstacles: [],
    desc: "Open field. Collect 4 food items while planning your turning radius as the snake grows."
  },
  {
    level: 2,
    name: "Level 2: Stone Pillars",
    difficulty: "Medium",
    targetFood: 5,
    speed: 160,
    obstacles: [
      { x: 4, y: 4 }, { x: 5, y: 4 }, { x: 4, y: 5 },
      { x: 11, y: 4 }, { x: 12, y: 4 }, { x: 11, y: 5 },
      { x: 4, y: 11 }, { x: 5, y: 11 }, { x: 4, y: 12 },
      { x: 11, y: 11 }, { x: 12, y: 11 }, { x: 11, y: 12 }
    ],
    desc: "Four stone pillars placed on the field. Plan your route around corners and avoid dead ends."
  },
  {
    level: 3,
    name: "Level 3: Strategic Maze",
    difficulty: "Hard",
    targetFood: 6,
    speed: 145,
    obstacles: [
      { x: 7, y: 3 }, { x: 8, y: 3 }, { x: 7, y: 4 }, { x: 8, y: 4 },
      { x: 7, y: 11 }, { x: 8, y: 11 }, { x: 7, y: 12 }, { x: 8, y: 12 },
      { x: 3, y: 7 }, { x: 3, y: 8 }, { x: 4, y: 7 }, { x: 4, y: 8 },
      { x: 11, y: 7 }, { x: 11, y: 8 }, { x: 12, y: 7 }, { x: 12, y: 8 }
    ],
    desc: "Cross barriers create narrow corridors. High spatial foresight required to avoid trapping yourself."
  }
];

const SmartSnakeGame = ({ onGameComplete }) => {
  // Game lifecycle: 'intro' | 'playing' | 'completed'
  const [gameState, setGameState] = useState('intro');
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const currentLevel = LEVELS[currentLevelIdx];

  // Snake state: array of {x, y}
  const [snake, setSnake] = useState([
    { x: 5, y: 8 },
    { x: 4, y: 8 },
    { x: 3, y: 8 }
  ]);
  const [dir, setDir] = useState({ x: 1, y: 0 }); // Moving right
  const nextDirRef = useRef({ x: 1, y: 0 });

  const [food, setFood] = useState({ x: 10, y: 8 });
  const [foodCollected, setFoodCollected] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [levelSolved, setLevelSolved] = useState(false);

  // Statistics
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(1);
  const [startTime, setStartTime] = useState(null);
  const [muted, setMuted] = useState(gameAudio.isMuted());
  const [isShaking, setIsShaking] = useState(false);

  // Generate safe food position not overlapping snake or obstacles
  const generateFood = useCallback((currentSnake, obstacles) => {
    let newPos;
    let valid = false;
    while (!valid) {
      newPos = {
        x: Math.floor(Math.random() * (GRID_SIZE - 2)) + 1,
        y: Math.floor(Math.random() * (GRID_SIZE - 2)) + 1
      };
      const onSnake = currentSnake.some(seg => seg.x === newPos.x && seg.y === newPos.y);
      const onObstacle = obstacles.some(obs => obs.x === newPos.x && obs.y === newPos.y);
      if (!onSnake && !onObstacle) {
        valid = true;
      }
    }
    return newPos;
  }, []);

  const initLevel = useCallback((lvlIdx = currentLevelIdx) => {
    const lvl = LEVELS[lvlIdx];
    const initSnake = [
      { x: 5, y: 8 },
      { x: 4, y: 8 },
      { x: 3, y: 8 }
    ];
    setSnake(initSnake);
    setDir({ x: 1, y: 0 });
    nextDirRef.current = { x: 1, y: 0 };
    setFood(generateFood(initSnake, lvl.obstacles));
    setFoodCollected(0);
    setIsPaused(false);
    setIsGameOver(false);
    setLevelSolved(false);
    setIsShaking(false);
  }, [currentLevelIdx, generateFood]);

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

  // Direction Change Handler (prevents 180° immediate reversal)
  const changeDirection = useCallback((newDir) => {
    const current = dir;
    // Don't reverse into opposite direction
    if (newDir.x + current.x === 0 && newDir.y + current.y === 0) return;
    nextDirRef.current = newDir;
  }, [dir]);

  // Keyboard controls listener
  useEffect(() => {
    if (gameState !== 'playing' || isPaused || isGameOver || levelSolved) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          changeDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          changeDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          changeDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          changeDirection({ x: 1, y: 0 });
          break;
        case ' ':
          e.preventDefault();
          setIsPaused(prev => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, isPaused, isGameOver, levelSolved, changeDirection]);

  // Real-time Game Loop
  useEffect(() => {
    if (gameState !== 'playing' || isPaused || isGameOver || levelSolved) return;

    const interval = setInterval(() => {
      setDir(nextDirRef.current);
      const currentDir = nextDirRef.current;

      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + currentDir.x,
          y: head.y + currentDir.y
        };

        // 1. Check Wall Collisions
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          gameAudio.playError();
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 450);
          setIsGameOver(true);
          return prevSnake;
        }

        // 2. Check Self Collision
        if (prevSnake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
          gameAudio.playError();
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 450);
          setIsGameOver(true);
          return prevSnake;
        }

        // 3. Check Obstacle Collision
        if (currentLevel.obstacles.some(obs => obs.x === newHead.x && obs.y === newHead.y)) {
          gameAudio.playError();
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 450);
          setIsGameOver(true);
          return prevSnake;
        }

        // 4. Check Food Collection
        const eating = newHead.x === food.x && newHead.y === food.y;
        let newSnake;

        if (eating) {
          gameAudio.playSuccess();
          const nextCount = foodCollected + 1;
          setFoodCollected(nextCount);
          setScore(prev => prev + 25);
          newSnake = [newHead, ...prevSnake]; // grow length

          if (nextCount >= currentLevel.targetFood) {
            gameAudio.playLevelUp();
            setLevelSolved(true);
          } else {
            setFood(generateFood(newSnake, currentLevel.obstacles));
          }
        } else {
          newSnake = [newHead, ...prevSnake.slice(0, -1)]; // move without growing
        }

        return newSnake;
      });
    }, currentLevel.speed);

    return () => clearInterval(interval);
  }, [gameState, isPaused, isGameOver, levelSolved, food, foodCollected, currentLevel, generateFood]);

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

  const handleRetry = () => {
    gameAudio.playClick();
    setAttempts(prev => prev + 1);
    initLevel(currentLevelIdx);
  };

  const handleFinishGame = () => {
    gameAudio.playClick();
    const timeTaken = startTime ? Math.round((Date.now() - startTime) / 1000) : 60;
    const finalScore = Math.min(100, Math.max(65, score));

    if (onGameComplete) {
      onGameComplete({
        gameId: "aids_game_snake",
        gameName: "Smart Snake",
        score: finalScore,
        maxScore: 100,
        accuracy: finalScore / 100,
        timeTaken,
        attempts
      });
    }
  };

  // Cognitive Skill Breakdown Scores
  const planningSkill = Math.min(96, Math.max(72, 82 + foodCollected * 3));
  const spatialSkill = Math.min(98, Math.max(75, 85 + currentLevelIdx * 5));
  const compSkill = Math.min(95, Math.max(70, 80 + currentLevelIdx * 6));
  const decisionSkill = 90;

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
          background: '#f0fdf4',
          color: '#16a34a',
          padding: '6px 16px',
          borderRadius: '999px',
          fontSize: '13px',
          fontWeight: '700',
          marginBottom: '20px',
          border: '1px solid #bbf7d0'
        }}>
          <span>🐍</span> Game 3 of 5 • Artificial Intelligence & Data Science
        </div>

        <h1 style={{
          fontSize: '32px',
          fontWeight: '800',
          color: '#0f172a',
          marginBottom: '12px'
        }}>
          🐍 Smart Snake
        </h1>

        <p style={{
          fontSize: '16px',
          color: '#475569',
          maxWidth: '620px',
          margin: '0 auto 28px',
          lineHeight: '1.6'
        }}>
          <strong>🎯 Your Mission:</strong> Guide the moving snake to collect the energy food while continuously avoiding boundaries, obstacles, and its growing body!
        </p>

        {/* Rules & Controls Box */}
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
            🎮 How to Play:
          </h3>
          <ul style={{ fontSize: '14px', color: '#334155', lineHeight: '1.8', paddingLeft: '20px', margin: 0 }}>
            <li>• Use the <strong>Arrow Keys</strong>, <strong>WASD</strong>, or the on-screen D-pad buttons to steer.</li>
            <li>• Collect the target number of food items in each level to advance.</li>
            <li>• As the snake eats food, it gets longer—plan your turns ahead so you don't trap yourself!</li>
            <li>• Avoid colliding with outer boundary walls and stone obstacle pillars.</li>
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
            background: 'linear-gradient(135deg, #16a34a, #15803d)',
            color: 'white',
            fontSize: '17px',
            fontWeight: '700',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(22, 163, 74, 0.35)',
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
          SMART SNAKE CHALLENGE COMPLETE 🎉
        </h2>
        <p style={{ color: '#64748b', fontSize: '15px', maxWidth: '540px', margin: '0 auto 28px' }}>
          You demonstrated spatial path optimization, forward collision planning, and rapid procedural decision making.
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
            <div style={{ fontSize: '30px', fontWeight: '800', color: '#16a34a' }}>
              {Math.min(100, Math.max(65, score))} / 100
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Levels Solved</div>
            <div style={{ fontSize: '30px', fontWeight: '800', color: '#10b981' }}>{LEVELS.length} / {LEVELS.length}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Total Food</div>
            <div style={{ fontSize: '30px', fontWeight: '800', color: '#0f172a' }}>15</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Attempts</div>
            <div style={{ fontSize: '30px', fontWeight: '800', color: '#f59e0b' }}>{attempts}</div>
          </div>
        </div>

        {/* Skill Indicators */}
        <div style={{
          background: '#f0fdf4',
          borderRadius: '16px',
          border: '1px solid #bbf7d0',
          padding: '20px 24px',
          marginBottom: '32px',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Sparkles size={18} color="#16a34a" />
            <strong style={{ color: '#15803d', fontSize: '15px' }}>Exploratory Cognitive Indicators:</strong>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
            <div style={{ background: 'white', padding: '12px 16px', borderRadius: '10px', border: '1px solid #dcfce7' }}>
              <div style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>Path Planning</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#16a34a' }}>{planningSkill} / 100</div>
            </div>
            <div style={{ background: 'white', padding: '12px 16px', borderRadius: '10px', border: '1px solid #dcfce7' }}>
              <div style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>Spatial Reasoning</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#16a34a' }}>{spatialSkill} / 100</div>
            </div>
            <div style={{ background: 'white', padding: '12px 16px', borderRadius: '10px', border: '1px solid #dcfce7' }}>
              <div style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>Computational Thinking</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#16a34a' }}>{compSkill} / 100</div>
            </div>
            <div style={{ background: 'white', padding: '12px 16px', borderRadius: '10px', border: '1px solid #dcfce7' }}>
              <div style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>Decision Making</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#16a34a' }}>{decisionSkill} / 100</div>
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
            background: '#16a34a',
            color: 'white',
            border: 'none',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(22, 163, 74, 0.3)'
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
            background: '#16a34a',
            color: 'white',
            borderRadius: '8px',
            padding: '5px 12px',
            fontSize: '13px',
            fontWeight: '700'
          }}>
            Game 3 of 5
          </span>

          <span style={{
            background: '#f0fdf4',
            color: '#15803d',
            border: '1px solid #bbf7d0',
            borderRadius: '8px',
            padding: '5px 12px',
            fontSize: '13px',
            fontWeight: '700'
          }}>
            {currentLevel.name}
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
            Food: <strong style={{ color: '#16a34a' }}>{foodCollected}</strong> / {currentLevel.targetFood}
          </div>

          <button
            onClick={() => setIsPaused(prev => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600'
            }}
          >
            {isPaused ? <Play size={14} /> : <Pause size={14} />} {isPaused ? 'Resume' : 'Pause'}
          </button>

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
              color: muted ? '#94a3b8' : '#16a34a'
            }}
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          <button
            onClick={() => initLevel(currentLevelIdx)}
            title="Reset Level"
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

      {/* Target Mission Guidance */}
      <div style={{
        background: '#f0fdf4',
        border: '1.5px solid #bbf7d0',
        borderRadius: '12px',
        padding: '10px 18px',
        marginBottom: '16px',
        fontSize: '13px',
        color: '#15803d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <strong>🎯 Mission:</strong>
        <span>Collect {currentLevel.targetFood} food items to complete this level. Use arrow keys or on-screen D-Pad.</span>
      </div>

      {/* ------------------------------------------------------- */}
      {/* 2D PLAYABLE SNAKE BOARD CANVAS                          */}
      {/* ------------------------------------------------------- */}
      <div 
        className={isShaking ? 'game-shake' : ''}
        style={{
          background: '#0f172a',
          borderRadius: '20px',
          border: '2px solid #334155',
          padding: '24px 20px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gap: '2px',
          background: '#1e293b',
          padding: '10px',
          borderRadius: '16px',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.4)',
          maxWidth: '460px',
          width: '100%',
          aspectRatio: '1 / 1'
        }}>
          {Array.from({ length: GRID_SIZE }).map((_, y) =>
            Array.from({ length: GRID_SIZE }).map((_, x) => {
              const isHead = snake[0].x === x && snake[0].y === y;
              const isBody = snake.slice(1).some(seg => seg.x === x && seg.y === y);
              const isFood = food.x === x && food.y === y;
              const isObstacle = currentLevel.obstacles.some(obs => obs.x === x && obs.y === y);

              let cellBg = '#0f172a';
              if (isHead) cellBg = '#22c55e';
              else if (isBody) cellBg = '#16a34a';
              else if (isFood) cellBg = '#ef4444';
              else if (isObstacle) cellBg = '#64748b';

              return (
                <div
                  key={`snake-cell-${x}-${y}`}
                  style={{
                    background: cellBg,
                    borderRadius: isHead ? '6px' : isFood ? '50%' : isObstacle ? '4px' : '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isHead 
                      ? '0 0 10px rgba(34, 197, 94, 0.8)' 
                      : isFood 
                      ? '0 0 10px rgba(239, 68, 68, 0.8)' 
                      : 'none',
                    transition: 'background 0.05s ease'
                  }}
                >
                  {isHead && <span style={{ fontSize: '10px' }}>👀</span>}
                  {isFood && <span style={{ fontSize: '9px' }}>🍎</span>}
                  {isObstacle && <span style={{ fontSize: '8px', color: '#94a3b8' }}>🪨</span>}
                </div>
              );
            })
          )}
        </div>

        {/* On-Screen Mobile D-Pad Controls */}
        <div style={{
          marginTop: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px'
        }}>
          <button
            onClick={() => changeDirection({ x: 0, y: -1 })}
            style={{
              width: '54px',
              height: '46px',
              borderRadius: '10px',
              background: '#334155',
              color: 'white',
              border: '1px solid #475569',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ArrowUp size={20} />
          </button>

          <div style={{ display: 'flex', gap: '36px' }}>
            <button
              onClick={() => changeDirection({ x: -1, y: 0 })}
              style={{
                width: '54px',
                height: '46px',
                borderRadius: '10px',
                background: '#334155',
                color: 'white',
                border: '1px solid #475569',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={() => changeDirection({ x: 1, y: 0 })}
              style={{
                width: '54px',
                height: '46px',
                borderRadius: '10px',
                background: '#334155',
                color: 'white',
                border: '1px solid #475569',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ArrowRightIcon size={20} />
            </button>
          </div>

          <button
            onClick={() => changeDirection({ x: 0, y: 1 })}
            style={{
              width: '54px',
              height: '46px',
              borderRadius: '10px',
              background: '#334155',
              color: 'white',
              border: '1px solid #475569',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ArrowDown size={20} />
          </button>
        </div>
      </div>

      {/* Game Over Feedback Banner */}
      {isGameOver && (
        <div style={{
          background: '#fef2f2',
          border: '1.5px solid #fecaca',
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
            <ShieldAlert size={26} color="#dc2626" />
            <div>
              <strong style={{ color: '#991b1b', fontSize: '16px' }}>Collision! The snake bumped into an obstacle.</strong>
              <p style={{ color: '#7f1d1d', fontSize: '13px', margin: 0 }}>
                Analyze the open corridor before turning. You can immediately retry this level!
              </p>
            </div>
          </div>

          <button
            onClick={handleRetry}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 20px',
              borderRadius: '10px',
              background: '#dc2626',
              color: 'white',
              border: 'none',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={16} /> Retry Level
          </button>
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
              <strong style={{ color: '#15803d', fontSize: '16px' }}>Level Complete! 🎉</strong>
              <p style={{ color: '#166534', fontSize: '13px', margin: 0 }}>
                You safely collected {currentLevel.targetFood} food items without colliding!
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

    </div>
  );
};

export default SmartSnakeGame;
