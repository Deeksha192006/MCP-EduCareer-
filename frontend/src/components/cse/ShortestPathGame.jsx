import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, CheckCircle2, AlertTriangle, Zap, MapPin, Gauge, Trophy, ArrowRight, EyeOff, Sparkles, HelpCircle } from 'lucide-react';

// Graph Puzzle Scenarios
const PUZZLE_LEVELS = [
  {
    level: 1,
    title: "Level 1: Guided Network (Visible Weights)",
    description: "Find the shortest route from Station A to Hub F within the 100 L fuel budget.",
    startNode: "A",
    targetNode: "F",
    maxFuel: 100,
    hideWeights: false,
    nodes: [
      { id: "A", name: "Station A", x: 80, y: 180, isStart: true },
      { id: "B", name: "Node B", x: 250, y: 80 },
      { id: "C", name: "Node C", x: 250, y: 280 },
      { id: "D", name: "Node D", x: 450, y: 90 },
      { id: "E", name: "Node E", x: 450, y: 270 },
      { id: "F", name: "Hub F", x: 620, y: 180, isTarget: true }
    ],
    edges: [
      { from: "A", to: "B", dist: 12, fuel: 15 },
      { from: "A", to: "C", dist: 18, fuel: 20 },
      { from: "B", to: "D", dist: 15, fuel: 25 },
      { from: "B", to: "C", dist: 10, fuel: 12 },
      { from: "C", to: "E", dist: 14, fuel: 18 },
      { from: "D", to: "F", dist: 20, fuel: 30 },
      { from: "E", to: "F", dist: 16, fuel: 22 },
      { from: "D", to: "E", dist: 8, fuel: 10 }
    ],
    optimalDist: 51,
    optimalFuel: 72
  },
  {
    level: 2,
    title: "Level 2: Blind Spatial Challenge (Hidden Weights & Dense Mesh)",
    description: "Edge weights are HIDDEN! Use spatial intuition and observe real-time fuel consumption across this dense 10-node network.",
    startNode: "A",
    targetNode: "J",
    maxFuel: 95,
    hideWeights: true,
    nodes: [
      { id: "A", name: "Start A", x: 60, y: 180, isStart: true },
      { id: "B", name: "Node B", x: 180, y: 70 },
      { id: "C", name: "Node C", x: 180, y: 180 },
      { id: "D", name: "Node D", x: 180, y: 290 },
      { id: "E", name: "Node E", x: 330, y: 80 },
      { id: "F", name: "Node F", x: 330, y: 180 },
      { id: "G", name: "Node G", x: 330, y: 280 },
      { id: "H", name: "Node H", x: 490, y: 100 },
      { id: "I", name: "Node I", x: 490, y: 260 },
      { id: "J", name: "Target J", x: 640, y: 180, isTarget: true }
    ],
    edges: [
      { from: "A", to: "B", dist: 14, fuel: 18 },
      { from: "A", to: "C", dist: 11, fuel: 14 },
      { from: "A", to: "D", dist: 16, fuel: 20 },
      { from: "B", to: "E", dist: 13, fuel: 16 },
      { from: "B", to: "F", dist: 18, fuel: 22 },
      { from: "C", to: "B", dist: 10, fuel: 12 },
      { from: "C", to: "F", dist: 12, fuel: 15 },
      { from: "C", to: "G", dist: 11, fuel: 14 },
      { from: "D", to: "G", dist: 13, fuel: 17 },
      { from: "E", to: "H", dist: 14, fuel: 18 },
      { from: "F", to: "E", dist: 9, fuel: 11 },
      { from: "F", to: "H", dist: 15, fuel: 19 },
      { from: "F", to: "I", dist: 13, fuel: 16 },
      { from: "G", to: "I", dist: 12, fuel: 15 },
      { from: "H", to: "J", dist: 15, fuel: 20 },
      { from: "I", to: "J", dist: 14, fuel: 18 }
    ],
    // Optimal: A -> C -> F -> E -> H -> J (dist: 11+12+9+14+15 = 61 km, fuel: 14+15+11+18+20 = 78 L)
    optimalDist: 61,
    optimalFuel: 78
  },
  {
    level: 3,
    title: "Level 3: Master Mesh Navigation (11 Nodes & Complex Topography)",
    description: "Edge weights are hidden! Multi-path mesh topology under tight fuel limits.",
    startNode: "S",
    targetNode: "T",
    maxFuel: 110,
    hideWeights: true,
    nodes: [
      { id: "S", name: "Start S", x: 50, y: 180, isStart: true },
      { id: "1", name: "Node 1", x: 170, y: 70 },
      { id: "2", name: "Node 2", x: 170, y: 180 },
      { id: "3", name: "Node 3", x: 170, y: 290 },
      { id: "4", name: "Node 4", x: 300, y: 80 },
      { id: "5", name: "Node 5", x: 300, y: 280 },
      { id: "6", name: "Node 6", x: 430, y: 70 },
      { id: "7", name: "Node 7", x: 430, y: 180 },
      { id: "8", name: "Node 8", x: 430, y: 290 },
      { id: "9", name: "Node 9", x: 560, y: 180 },
      { id: "T", name: "Target T", x: 660, y: 180, isTarget: true }
    ],
    edges: [
      { from: "S", to: "1", dist: 13, fuel: 16 },
      { from: "S", to: "2", dist: 10, fuel: 12 },
      { from: "S", to: "3", dist: 17, fuel: 22 },
      { from: "1", to: "4", dist: 12, fuel: 15 },
      { from: "2", to: "1", dist: 8, fuel: 10 },
      { from: "2", to: "5", dist: 16, fuel: 20 },
      { from: "3", to: "5", dist: 11, fuel: 14 },
      { from: "4", to: "6", dist: 14, fuel: 18 },
      { from: "4", to: "7", dist: 12, fuel: 15 },
      { from: "5", to: "7", dist: 11, fuel: 14 },
      { from: "5", to: "8", dist: 13, fuel: 16 },
      { from: "6", to: "9", dist: 15, fuel: 19 },
      { from: "7", to: "6", dist: 9, fuel: 11 },
      { from: "7", to: "9", dist: 12, fuel: 15 },
      { from: "8", to: "9", dist: 14, fuel: 18 },
      { from: "9", to: "T", dist: 11, fuel: 14 }
    ],
    // Optimal: S -> 2 -> 1 -> 4 -> 7 -> 9 -> T (dist: 10+8+12+12+12+11 = 65 km, fuel: 12+10+15+15+15+14 = 81 L)
    optimalDist: 65,
    optimalFuel: 81
  }
];

const ShortestPathGame = ({ onGameComplete }) => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const currentPuzzle = PUZZLE_LEVELS[currentLevelIdx];

  const [path, setPath] = useState([currentPuzzle.startNode]);
  const [attempts, setAttempts] = useState(1);
  const [levelResults, setLevelResults] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);

  // Real-time timer
  const [secondsSpent, setSecondsSpent] = useState(0);
  const [timerActive, setTimerActive] = useState(true);

  useEffect(() => {
    let interval = null;
    if (timerActive && !isGameOver) {
      interval = setInterval(() => {
        setSecondsSpent(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, isGameOver]);

  // Reset path when switching levels
  useEffect(() => {
    setPath([currentPuzzle.startNode]);
  }, [currentLevelIdx]);

  // Calculate current distance and fuel used
  const calculatePathMetrics = (currentPath) => {
    let dist = 0;
    let fuel = 0;
    for (let i = 0; i < currentPath.length - 1; i++) {
      const u = currentPath[i];
      const v = currentPath[i + 1];
      const edge = currentPuzzle.edges.find(
        e => (e.from === u && e.to === v) || (e.from === v && e.to === u)
      );
      if (edge) {
        dist += edge.dist;
        fuel += edge.fuel;
      }
    }
    return { dist, fuel };
  };

  const { dist: currentDist, fuel: currentFuel } = calculatePathMetrics(path);
  const remainingFuel = currentPuzzle.maxFuel - currentFuel;

  // Get available adjacent connected nodes from current position
  const currentNode = path[path.length - 1];
  const adjacentEdges = currentPuzzle.edges.filter(
    e => e.from === currentNode || e.to === currentNode
  );
  const adjacentNodeIds = adjacentEdges.map(e => (e.from === currentNode ? e.to : e.from));

  const handleNodeClick = (nodeId) => {
    if (isGameOver) return;
    if (path.includes(nodeId)) {
      // Step back if clicking previous node
      if (path[path.length - 2] === nodeId) {
        setPath(path.slice(0, -1));
      }
      return;
    }
    if (!adjacentNodeIds.includes(nodeId)) return;

    // Check if step exceeds fuel
    const newPath = [...path, nodeId];
    const { fuel } = calculatePathMetrics(newPath);
    if (fuel > currentPuzzle.maxFuel) {
      alert("⚠️ Fuel Capacity Exceeded! Try an alternative connection path.");
      return;
    }

    setPath(newPath);
  };

  const handleResetPath = () => {
    setPath([currentPuzzle.startNode]);
    setAttempts(prev => prev + 1);
  };

  const handleSubmitLevel = () => {
    if (currentNode !== currentPuzzle.targetNode) {
      alert("Please reach the destination target node before submitting your route.");
      return;
    }

    // Calculate level efficiency score
    const distRatio = Math.min(1.0, currentPuzzle.optimalDist / currentDist);
    const fuelRatio = Math.min(1.0, currentPuzzle.optimalFuel / currentFuel);
    const levelScore = Math.round((distRatio * 0.6 + fuelRatio * 0.4) * 100);

    const levelRecord = {
      level: currentPuzzle.level,
      score: levelScore,
      dist: currentDist,
      optimalDist: currentPuzzle.optimalDist,
      fuel: currentFuel,
      optimalFuel: currentPuzzle.optimalFuel,
      distRatio
    };

    const newResults = [...levelResults, levelRecord];
    setLevelResults(newResults);

    if (currentLevelIdx < PUZZLE_LEVELS.length - 1) {
      setCurrentLevelIdx(prev => prev + 1);
    } else {
      // Game Completed! Compute aggregate performance
      setTimerActive(false);
      setIsGameOver(true);

      const avgScore = Math.round(newResults.reduce((a, b) => a + b.score, 0) / newResults.length);
      const avgAccuracy = parseFloat((newResults.reduce((a, b) => a + b.distRatio, 0) / newResults.length).toFixed(2));
      
      // Auto-submit score to parent/backend
      if (onGameComplete) {
        onGameComplete({
          score: avgScore,
          maxScore: 100,
          accuracy: avgAccuracy,
          timeTaken: secondsSpent,
          attempts: attempts
        });
      }
    }
  };

  return (
    <div className="game-container" style={{ width: '100%', color: 'var(--text-main)' }}>
      {/* Game Bar Status */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        background: 'rgba(17, 24, 39, 0.9)',
        border: '1px solid rgba(99, 102, 241, 0.4)',
        borderRadius: '12px',
        marginBottom: '20px',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', fontWeight: '700', padding: '4px 10px', background: 'var(--primary)', borderRadius: '6px', color: 'white' }}>
            {currentPuzzle.title}
          </span>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Round {currentLevelIdx + 1} of {PUZZLE_LEVELS.length}
          </span>
          {currentPuzzle.hideWeights && (
            <span style={{
              fontSize: '11px',
              padding: '3px 8px',
              borderRadius: '12px',
              background: 'rgba(239, 68, 68, 0.2)',
              color: '#fca5a5',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <EyeOff size={12} />
              Weights Hidden
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', fontSize: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={16} style={{ color: '#06b6d4' }} />
            <span>Distance: <strong>{currentDist} km</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={16} style={{ color: remainingFuel < 20 ? '#ef4444' : '#10b981' }} />
            <span>Fuel: <strong>{remainingFuel} / {currentPuzzle.maxFuel} L</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Gauge size={16} style={{ color: '#f59e0b' }} />
            <span>Time: <strong>{secondsSpent}s</strong></span>
          </div>
        </div>
      </div>

      {/* Main Interactive Graph Canvas Frame */}
      {!isGameOver ? (
        <div>
          <div style={{
            position: 'relative',
            width: '100%',
            height: '380px',
            background: 'radial-gradient(circle at 50% 50%, rgba(30, 41, 69, 0.6) 0%, rgba(11, 15, 25, 0.95) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '16px',
            overflow: 'hidden',
            marginBottom: '20px'
          }}>
            {/* SVG Lines for Graph Edges */}
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
              {currentPuzzle.edges.map((edge, idx) => {
                const uNode = currentPuzzle.nodes.find(n => n.id === edge.from);
                const vNode = currentPuzzle.nodes.find(n => n.id === edge.to);
                if (!uNode || !vNode) return null;

                // Check if edge is traversed in path
                const pathIdxU = path.indexOf(edge.from);
                const pathIdxV = path.indexOf(edge.to);
                const isTraversed = pathIdxU !== -1 && pathIdxV !== -1 && Math.abs(pathIdxU - pathIdxV) === 1;

                const midX = (uNode.x + vNode.x) / 2;
                const midY = (uNode.y + vNode.y) / 2;

                return (
                  <g key={idx}>
                    <line
                      x1={uNode.x}
                      y1={uNode.y}
                      x2={vNode.x}
                      y2={vNode.y}
                      stroke={isTraversed ? '#6366f1' : 'rgba(255, 255, 255, 0.18)'}
                      strokeWidth={isTraversed ? 4 : 2}
                      strokeDasharray={isTraversed ? 'none' : '3 3'}
                    />
                    
                    {/* Render Edge Label ONLY IF weights are NOT hidden */}
                    {!currentPuzzle.hideWeights ? (
                      <g>
                        <rect
                          x={midX - 22}
                          y={midY - 11}
                          width={44}
                          height={22}
                          rx={4}
                          fill="rgba(17, 24, 39, 0.85)"
                          stroke={isTraversed ? '#6366f1' : 'rgba(255, 255, 255, 0.1)'}
                        />
                        <text
                          x={midX}
                          y={midY + 4}
                          fill={isTraversed ? '#a5b4fc' : '#9ca3af'}
                          fontSize="10"
                          fontWeight="600"
                          textAnchor="middle"
                        >
                          {edge.dist}km/{edge.fuel}L
                        </text>
                      </g>
                    ) : (
                      /* Hidden Weight IndicatorDot when traversed */
                      isTraversed && (
                        <circle cx={midX} cy={midY} r={4} fill="#818cf8" />
                      )
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Render Nodes */}
            {currentPuzzle.nodes.map((node) => {
              const isInPath = path.includes(node.id);
              const isCurrent = currentNode === node.id;
              const isAdjacent = adjacentNodeIds.includes(node.id) && !isInPath;

              return (
                <div
                  key={node.id}
                  onClick={() => handleNodeClick(node.id)}
                  style={{
                    position: 'absolute',
                    left: `${node.x - 22}px`,
                    top: `${node.y - 22}px`,
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: node.isStart 
                      ? 'linear-gradient(135deg, #10b981, #059669)' 
                      : node.isTarget 
                      ? 'linear-gradient(135deg, #8b5cf6, #6366f1)' 
                      : isCurrent 
                      ? 'linear-gradient(135deg, #06b6d4, #0284c7)' 
                      : isInPath 
                      ? 'linear-gradient(135deg, #6366f1, #4f46e5)' 
                      : 'rgba(30, 41, 69, 0.95)',
                    border: isCurrent 
                      ? '3px solid #38bdf8' 
                      : isAdjacent 
                      ? '2px solid #06b6d4' 
                      : '2px solid rgba(255,255,255,0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: isAdjacent || isCurrent || isInPath ? 'pointer' : 'default',
                    zIndex: 10,
                    boxShadow: isCurrent ? '0 0 15px rgba(6, 182, 212, 0.6)' : isInPath ? '0 0 10px rgba(99, 102, 241, 0.4)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>{node.id}</span>
                </div>
              );
            })}
          </div>

          {/* Gameplay Route Trace & Controls */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            padding: '16px 20px',
            background: 'rgba(23, 32, 54, 0.7)',
            borderRadius: '12px',
            border: '1px solid var(--border-color)'
          }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>SELECTED ROUTE SEQUENCE:</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {path.map((n, i) => (
                  <React.Fragment key={i}>
                    <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(99, 102, 241, 0.2)', border: '1px solid rgba(99, 102, 241, 0.4)' }}>
                      {n}
                    </span>
                    {i < path.length - 1 && <span style={{ color: 'var(--text-muted)' }}>➔</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleResetPath}
                className="btn btn-outline"
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                <RotateCcw size={14} />
                <span>Reset Path</span>
              </button>

              <button
                onClick={handleSubmitLevel}
                disabled={currentNode !== currentPuzzle.targetNode}
                className="btn btn-primary"
                style={{
                  padding: '10px 24px',
                  fontWeight: '700',
                  opacity: currentNode === currentPuzzle.targetNode ? 1 : 0.5,
                  cursor: currentNode === currentPuzzle.targetNode ? 'pointer' : 'not-allowed',
                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))'
                }}
              >
                <span>Submit Round {currentLevelIdx + 1} Route</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Game Completion Summary Card */
        <div className="card" style={{
          padding: '32px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(30, 41, 69, 0.95))',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          borderRadius: '16px'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            color: 'white',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
          }}>
            <Trophy size={32} />
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', color: '#ffffff' }}>
            Shortest Path Challenge Completed!
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '15px', marginBottom: '24px' }}>
            Your gameplay metrics across visible and hidden-weight mesh rounds have been saved to MongoDB.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '16px',
            maxWidth: '600px',
            margin: '0 auto 24px auto'
          }}>
            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.4)' }}>
              <div style={{ fontSize: '12px', color: '#a5b4fc', fontWeight: '600' }}>GAMEPLAY SCORE</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#818cf8' }}>
                {Math.round(levelResults.reduce((a, b) => a + b.score, 0) / levelResults.length)} / 100
              </div>
            </div>

            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
              <div style={{ fontSize: '12px', color: '#6ee7b7', fontWeight: '600' }}>PATH ACCURACY</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#34d399' }}>
                {Math.round((levelResults.reduce((a, b) => a + b.distRatio, 0) / levelResults.length) * 100)}%
              </div>
            </div>

            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.4)' }}>
              <div style={{ fontSize: '12px', color: '#67e8f9', fontWeight: '600' }}>TIME ELAPSED</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#22d3ee' }}>
                {secondsSpent}s
              </div>
            </div>
          </div>

          <div style={{ color: '#10b981', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} />
            <span>Score saved directly to MongoDB cse_assessments collection</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShortestPathGame;
