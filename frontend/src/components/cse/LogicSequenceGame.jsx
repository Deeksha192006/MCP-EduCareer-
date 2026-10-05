import React, { useState, useEffect } from 'react';
import { Layers, Trophy, CheckCircle2, RotateCcw, ArrowRight, Gauge, MoveUp, MoveDown } from 'lucide-react';

const LOGIC_SEQUENCE_ROUNDS = [
  {
    round: 1,
    title: "Round 1: Binary Search Execution Sequence",
    instruction: "Reorder the procedural steps into the correct execution flow for Binary Search.",
    initialSteps: [
      { id: "s3", text: "Check if target equals array[mid]" },
      { id: "s1", text: "Initialize low = 0 and high = len(array) - 1" },
      { id: "s4", text: "If target < array[mid], update high = mid - 1; else low = mid + 1" },
      { id: "s2", text: "Calculate mid index = (low + high) // 2" },
      { id: "s5", text: "Return target index if matched or -1 when low exceeds high" }
    ],
    correctOrderIds: ["s1", "s2", "s3", "s4", "s5"]
  },
  {
    round: 2,
    title: "Round 2: QuickSort Partition & Recursion Flow",
    instruction: "Arrange the algorithmic partitioning and recursive steps in proper execution order.",
    initialSteps: [
      { id: "q2", text: "Partition array into left (< pivot) and right (> pivot) sub-arrays" },
      { id: "q5", text: "Concatenate sorted left sub-array + pivot + sorted right sub-array" },
      { id: "q1", text: "Select a pivot element from the array" },
      { id: "q3", text: "Recursively invoke QuickSort on left sub-array" },
      { id: "q4", text: "Recursively invoke QuickSort on right sub-array" }
    ],
    correctOrderIds: ["q1", "q2", "q3", "q4", "q5"]
  },
  {
    round: 3,
    title: "Round 3: ETL Data Pipeline Sequence",
    instruction: "Order the data processing blocks from raw ingestion to database storage.",
    initialSteps: [
      { id: "e3", text: "Group cleaned dataset by student_id primary key" },
      { id: "e1", text: "Ingest raw CSV records from unstructured data stream" },
      { id: "e5", text: "Commit aggregate features into MongoDB production collection" },
      { id: "e2", text: "Filter out corrupted rows and missing score fields" },
      { id: "e4", text: "Compute rolling average scores and percentile ranks" }
    ],
    correctOrderIds: ["e1", "e2", "e3", "e4", "e5"]
  }
];

const LogicSequenceGame = ({ onGameComplete }) => {
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [steps, setSteps] = useState([]);
  const [roundResults, setRoundResults] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);

  const [secondsSpent, setSecondsSpent] = useState(0);
  const [timerActive, setTimerActive] = useState(true);

  const currentRound = LOGIC_SEQUENCE_ROUNDS[currentRoundIdx];

  useEffect(() => {
    setSteps([...currentRound.initialSteps]);
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

  const moveStep = (index, direction) => {
    const newSteps = [...steps];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= newSteps.length) return;

    const temp = newSteps[index];
    newSteps[index] = newSteps[targetIdx];
    newSteps[targetIdx] = temp;
    setSteps(newSteps);
  };

  const handleNextRound = () => {
    const currentOrderIds = steps.map(s => s.id);
    let matchCount = 0;
    currentOrderIds.forEach((id, idx) => {
      if (id === currentRound.correctOrderIds[idx]) matchCount++;
    });

    const accuracy = matchCount / currentRound.correctOrderIds.length;
    const score = Math.round(accuracy * 100);

    const newResults = [...roundResults, { round: currentRound.round, accuracy, score }];
    setRoundResults(newResults);

    if (currentRoundIdx < LOGIC_SEQUENCE_ROUNDS.length - 1) {
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
          <span style={{ fontSize: '13px', fontWeight: '700', padding: '4px 10px', background: 'var(--primary)', borderRadius: '6px', color: 'white' }}>
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
          <p style={{ fontSize: '15px', fontWeight: '500', marginBottom: '20px', color: 'var(--text-main)' }}>
            {currentRound.instruction}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {steps.map((step, idx) => (
              <div
                key={step.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  background: 'rgba(23, 32, 54, 0.8)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  gap: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'rgba(99, 102, 241, 0.2)',
                    color: '#a5b4fc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '13px'
                  }}>
                    {idx + 1}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: 'white' }}>
                    {step.text}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => moveStep(idx, -1)}
                    disabled={idx === 0}
                    className="btn btn-outline"
                    style={{ padding: '6px 10px', opacity: idx === 0 ? 0.3 : 1 }}
                  >
                    <MoveUp size={16} />
                  </button>

                  <button
                    onClick={() => moveStep(idx, 1)}
                    disabled={idx === steps.length - 1}
                    className="btn btn-outline"
                    style={{ padding: '6px 10px', opacity: idx === steps.length - 1 ? 0.3 : 1 }}
                  >
                    <MoveDown size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleNextRound}
              className="btn btn-primary"
              style={{ padding: '12px 28px', fontWeight: '700', borderRadius: '10px' }}
            >
              <span>{currentRoundIdx === LOGIC_SEQUENCE_ROUNDS.length - 1 ? 'Finish Game 4' : 'Submit & Next Round'}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: '32px', textAlign: 'center', borderRadius: '16px', background: 'rgba(17, 24, 39, 0.95)', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
          <Trophy size={48} style={{ color: '#10b981', margin: '0 auto 16px auto' }} />
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', color: '#ffffff' }}>Logic Sequence Challenge Completed!</h2>
          <p style={{ color: '#cbd5e1', marginBottom: '24px' }}>All 3 procedural sequence rounds finished.</p>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#818cf8', marginBottom: '16px' }}>
            Score: {Math.round(roundResults.reduce((a, b) => a + b.score, 0) / roundResults.length)} / 100
          </div>
          <div style={{ color: '#34d399', fontWeight: '600' }}>✓ Saved to MongoDB</div>
        </div>
      )}
    </div>
  );
};

export default LogicSequenceGame;
