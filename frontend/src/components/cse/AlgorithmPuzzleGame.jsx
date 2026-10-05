import React, { useState, useEffect } from 'react';
import { Cpu, Trophy, CheckCircle2, RotateCcw, ArrowRight, Gauge, Zap, Server } from 'lucide-react';

const PUZZLE_ROUNDS = [
  {
    round: 1,
    title: "Round 1: Knapsack Memory Buffer Optimization",
    instruction: "Select the combination of processes that maximizes Total Value without exceeding the 15 MB Memory Buffer.",
    maxCapacity: 15,
    optimalValue: 110,
    items: [
      { id: "P1", name: "Process P1 (Data Parser)", size: 5, value: 40 },
      { id: "P2", name: "Process P2 (Neural Net Inference)", size: 9, value: 70 },
      { id: "P3", name: "Process P3 (Cache Engine)", size: 7, value: 55 },
      { id: "P4", name: "Process P4 (Log Indexer)", size: 4, value: 30 }
    ]
  },
  {
    round: 2,
    title: "Round 2: Multi-Core CPU Task Balancing",
    instruction: "Assign tasks to CPU Core 1 and CPU Core 2 to minimize max execution latency.",
    maxCapacity: 16,
    optimalValue: 120,
    items: [
      { id: "T1", name: "Task T1 (Image Compress)", size: 6, value: 45 },
      { id: "T2", name: "Task T2 (Encryption)", size: 4, value: 35 },
      { id: "T3", name: "Task T3 (SQL Query)", size: 6, value: 40 },
      { id: "T4", name: "Task T4 (Worker Thread)", size: 8, value: 60 }
    ]
  },
  {
    round: 3,
    title: "Round 3: Distributed Cache Node Partitioning",
    instruction: "Maximize cache hit throughput under a 20 GB node threshold.",
    maxCapacity: 20,
    optimalValue: 145,
    items: [
      { id: "C1", name: "Node C1 (User Sessions)", size: 8, value: 65 },
      { id: "C2", name: "Node C2 (Product Catalog)", size: 10, value: 75 },
      { id: "C3", name: "Node C3 (Search Index)", size: 6, value: 45 },
      { id: "C4", name: "Node C4 (Analytics Store)", size: 7, value: 50 }
    ]
  }
];

const AlgorithmPuzzleGame = ({ onGameComplete }) => {
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [roundResults, setRoundResults] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);

  const [secondsSpent, setSecondsSpent] = useState(0);
  const [timerActive, setTimerActive] = useState(true);

  const currentRound = PUZZLE_ROUNDS[currentRoundIdx];

  useEffect(() => {
    setSelectedItemIds([]);
  }, [currentRoundIdx]);

  useEffect(() => {
    let interval = null;
    if (timerActive && !isGameOver) {
      interval = setInterval(() => setSecondsSpent(prev => prev + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, isGameOver]);

  const toggleItem = (id) => {
    if (isGameOver) return;
    if (selectedItemIds.includes(id)) {
      setSelectedItemIds(selectedItemIds.filter(i => i !== id));
    } else {
      const selectedItems = currentRound.items.filter(i => selectedItemIds.includes(i.id) || i.id === id);
      const totalSize = selectedItems.reduce((acc, curr) => acc + curr.size, 0);
      if (totalSize > currentRound.maxCapacity) {
        alert(`⚠️ Capacity limit (${currentRound.maxCapacity} MB/GB) exceeded! Select a smaller combination.`);
        return;
      }
      setSelectedItemIds([...selectedItemIds, id]);
    }
  };

  const selectedItems = currentRound.items.filter(i => selectedItemIds.includes(i.id));
  const currentTotalSize = selectedItems.reduce((acc, curr) => acc + curr.size, 0);
  const currentTotalValue = selectedItems.reduce((acc, curr) => acc + curr.value, 0);

  const handleNextRound = () => {
    if (selectedItemIds.length === 0) {
      alert("Please select at least one task/process.");
      return;
    }

    const accuracy = Math.min(1.0, currentTotalValue / currentRound.optimalValue);
    const score = Math.round(accuracy * 100);

    const newResults = [...roundResults, { round: currentRound.round, score, accuracy, value: currentTotalValue }];
    setRoundResults(newResults);

    if (currentRoundIdx < PUZZLE_ROUNDS.length - 1) {
      setCurrentRoundIdx(prev => prev + 1);
    } else {
      setTimerActive(false);
      setIsGameOver(true);

      const avgScore = Math.round(newResults.reduce((a, b) => a + b.score, 0) / newResults.length);
      const avgAccuracy = parseFloat((newResults.reduce((a, b) => a + b.accuracy, 0) / newResults.length).toFixed(2));

      if (onGameComplete) {
        onGameComplete({
          score: avgScore,
          maxScore: 100,
          accuracy: avgAccuracy,
          timeTaken: secondsSpent,
          attempts: 1
        });
      }
    }
  };

  return (
    <div className="game-container" style={{ width: '100%', color: 'var(--text-main)' }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        background: 'rgba(17, 24, 39, 0.9)',
        border: '1px solid rgba(99, 102, 241, 0.4)',
        borderRadius: '12px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', fontWeight: '700', padding: '4px 10px', background: 'var(--accent)', borderRadius: '6px', color: 'black' }}>
            {currentRound.title}
          </span>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Round {currentRoundIdx + 1} of 3
          </span>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', fontSize: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Server size={16} style={{ color: '#06b6d4' }} />
            <span>Usage: <strong>{currentTotalSize} / {currentRound.maxCapacity} Capacity</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={16} style={{ color: '#10b981' }} />
            <span>Value: <strong>${currentTotalValue}</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Gauge size={16} style={{ color: '#f59e0b' }} />
            <span>Time: <strong>{secondsSpent}s</strong></span>
          </div>
        </div>
      </div>

      {!isGameOver ? (
        <div>
          <p style={{ fontSize: '15px', fontWeight: '500', marginBottom: '20px', color: 'var(--text-main)' }}>
            {currentRound.instruction}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {currentRound.items.map((item) => {
              const isSelected = selectedItemIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  style={{
                    padding: '20px',
                    borderRadius: '14px',
                    background: isSelected ? 'rgba(6, 182, 212, 0.2)' : 'rgba(23, 32, 54, 0.7)',
                    border: isSelected ? '2px solid var(--accent)' : '1px solid var(--border-color)',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 0 15px rgba(6, 182, 212, 0.3)' : 'none',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '120px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '700', fontSize: '15px', color: 'white' }}>{item.name}</span>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      style={{ width: '18px', height: '18px', accentColor: 'var(--accent)', cursor: 'pointer' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
                    <span>Size: <strong style={{ color: 'white' }}>{item.size} Units</strong></span>
                    <span>Value: <strong style={{ color: '#10b981' }}>${item.value}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleNextRound}
              disabled={selectedItemIds.length === 0}
              className="btn btn-primary"
              style={{ padding: '12px 28px', fontWeight: '700', borderRadius: '10px', opacity: selectedItemIds.length > 0 ? 1 : 0.5 }}
            >
              <span>{currentRoundIdx === PUZZLE_ROUNDS.length - 1 ? 'Finish Game 5' : 'Submit & Next Round'}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: '32px', textAlign: 'center', borderRadius: '16px', background: 'rgba(17, 24, 39, 0.95)', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
          <Trophy size={48} style={{ color: '#10b981', margin: '0 auto 16px auto' }} />
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', color: '#ffffff' }}>Algorithm Puzzle Challenge Completed!</h2>
          <p style={{ color: '#cbd5e1', marginBottom: '24px' }}>All 3 optimization puzzle rounds completed.</p>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#818cf8', marginBottom: '16px' }}>
            Score: {Math.round(roundResults.reduce((a, b) => a + b.score, 0) / roundResults.length)} / 100
          </div>
          <div style={{ color: '#34d399', fontWeight: '600' }}>✓ Saved to MongoDB</div>
        </div>
      )}
    </div>
  );
};

export default AlgorithmPuzzleGame;
