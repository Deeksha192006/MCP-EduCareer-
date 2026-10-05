import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, CheckCircle2, RotateCcw, ArrowRight, Gauge, HelpCircle, AlertCircle } from 'lucide-react';

const ODD_ONE_OUT_ROUNDS = [
  {
    round: 1,
    title: "Round 1: Visual Matrix Pattern Anomaly",
    instruction: "Identify the pattern card that violates the grid symmetry rule.",
    options: [
      { id: "A", title: "Pattern A", items: ["▲ ▲ ▲", "▲ ■ ▲", "▲ ▲ ▲"], isOdd: false, reason: "Symmetric 3x3 outer ring" },
      { id: "B", title: "Pattern B", items: ["● ● ●", "● ★ ●", "● ● ●"], isOdd: false, reason: "Symmetric 3x3 outer ring" },
      { id: "C", title: "Pattern C", items: ["■ ■ ■", "■ ◆ ■", "■ ■ ▲"], isOdd: true, reason: "Bottom-right corner contains asymmetric item ▲" },
      { id: "D", title: "Pattern D", items: ["◆ ◆ ◆", "◆ ▲ ◆", "◆ ◆ ◆"], isOdd: false, reason: "Symmetric 3x3 outer ring" }
    ]
  },
  {
    round: 2,
    title: "Round 2: Sequence & Progression Anomaly",
    instruction: "Three sequences follow a multiplier rule (x2). Spot the sequence breaking the ratio rule.",
    options: [
      { id: "A", title: "Seq A", items: ["3 ➔ 6 ➔ 12 ➔ 24"], isOdd: false, reason: "Consistently multiplies by 2" },
      { id: "B", title: "Seq B", items: ["5 ➔ 10 ➔ 20 ➔ 40"], isOdd: false, reason: "Consistently multiplies by 2" },
      { id: "C", title: "Seq C", items: ["4 ➔ 8 ➔ 16 ➔ 30"], isOdd: true, reason: "30 breaks x2 progression (expected 32)" },
      { id: "D", title: "Seq D", items: ["7 ➔ 14 ➔ 28 ➔ 56"], isOdd: false, reason: "Consistently multiplies by 2" }
    ]
  },
  {
    round: 3,
    title: "Round 3: Structural Schema Anomaly",
    instruction: "Find the data structure that contains an invalid type constraint.",
    options: [
      { id: "A", title: "Schema A", code: '{"id": 101, "role": "admin", "active": true}', isOdd: false },
      { id: "B", title: "Schema B", code: '{"id": 102, "role": "editor", "active": false}', isOdd: false },
      { id: "C", title: "Schema C", code: '{"id": "INVALID_103", "role": 999, "active": "MAYBE"}', isOdd: true },
      { id: "D", title: "Schema D", code: '{"id": 104, "role": "viewer", "active": true}', isOdd: false }
    ]
  }
];

const OddOneOutGame = ({ onGameComplete }) => {
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [roundResults, setRoundResults] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);

  const [secondsSpent, setSecondsSpent] = useState(0);
  const [timerActive, setTimerActive] = useState(true);

  useEffect(() => {
    let interval = null;
    if (timerActive && !isGameOver) {
      interval = setInterval(() => setSecondsSpent(prev => prev + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, isGameOver]);

  const currentRound = ODD_ONE_OUT_ROUNDS[currentRoundIdx];

  const handleSelectOption = (optId) => {
    if (isGameOver) return;
    setSelectedOptionId(optId);
  };

  const handleNextRound = () => {
    if (!selectedOptionId) {
      alert("Please select an option first.");
      return;
    }

    const chosenOpt = currentRound.options.find(o => o.id === selectedOptionId);
    const isCorrect = chosenOpt?.isOdd === true;
    const score = isCorrect ? 100 : 20;

    const newResults = [...roundResults, { round: currentRound.round, isCorrect, score, chosenOpt }];
    setRoundResults(newResults);
    setSelectedOptionId(null);

    if (currentRoundIdx < ODD_ONE_OUT_ROUNDS.length - 1) {
      setCurrentRoundIdx(prev => prev + 1);
    } else {
      setTimerActive(false);
      setIsGameOver(true);

      const avgScore = Math.round(newResults.reduce((a, b) => a + b.score, 0) / newResults.length);
      const accuracy = parseFloat((newResults.filter(r => r.isCorrect).length / newResults.length).toFixed(2));

      if (onGameComplete) {
        onGameComplete({
          score: avgScore,
          maxScore: 100,
          accuracy: accuracy,
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
          <span style={{ fontSize: '13px', fontWeight: '700', padding: '4px 10px', background: 'var(--secondary)', borderRadius: '6px', color: 'white' }}>
            {currentRound.title}
          </span>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Round {currentRoundIdx + 1} of 3
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
          <Gauge size={16} style={{ color: '#f59e0b' }} />
          <span>Time: <strong>{secondsSpent}s</strong></span>
        </div>
      </div>

      {!isGameOver ? (
        <div>
          <p style={{ fontSize: '15px', color: 'var(--text-main)', marginBottom: '20px', fontWeight: '500' }}>
            {currentRound.instruction}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {currentRound.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;

              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  style={{
                    padding: '20px',
                    borderRadius: '14px',
                    background: isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(23, 32, 54, 0.7)',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 0 15px rgba(99, 102, 241, 0.3)' : 'none',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '140px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontWeight: '700', fontSize: '16px', color: 'white' }}>{opt.title}</span>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: isSelected ? '5px solid var(--primary)' : '2px solid var(--border-color)',
                      background: isSelected ? 'white' : 'transparent'
                    }} />
                  </div>

                  {opt.items && (
                    <div style={{ fontSize: '14px', fontFamily: 'monospace', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', color: '#a5b4fc', textAlign: 'center' }}>
                      {opt.items.map((item, i) => <div key={i}>{item}</div>)}
                    </div>
                  )}

                  {opt.code && (
                    <div style={{ fontSize: '12px', fontFamily: 'monospace', background: 'rgba(0,0,0,0.4)', padding: '10px', borderRadius: '8px', color: '#38bdf8' }}>
                      {opt.code}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleNextRound}
              disabled={!selectedOptionId}
              className="btn btn-primary"
              style={{ padding: '12px 28px', fontWeight: '700', borderRadius: '10px', opacity: selectedOptionId ? 1 : 0.5 }}
            >
              <span>{currentRoundIdx === ODD_ONE_OUT_ROUNDS.length - 1 ? 'Finish Game 2' : 'Submit & Next Round'}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: '32px', textAlign: 'center', borderRadius: '16px', background: 'rgba(17, 24, 39, 0.95)', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
          <Trophy size={48} style={{ color: '#10b981', margin: '0 auto 16px auto' }} />
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', color: '#ffffff' }}>Odd One Out Challenge Completed!</h2>
          <p style={{ color: '#cbd5e1', marginBottom: '24px' }}>All 3 rounds finished. Gameplay metrics saved to backend database.</p>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#818cf8', marginBottom: '16px' }}>
            Score: {Math.round(roundResults.reduce((a, b) => a + b.score, 0) / roundResults.length)} / 100
          </div>
          <div style={{ color: '#34d399', fontWeight: '600' }}>✓ Saved to MongoDB</div>
        </div>
      )}
    </div>
  );
};

export default OddOneOutGame;
