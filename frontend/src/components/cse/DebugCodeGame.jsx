import React, { useState, useEffect } from 'react';
import { Code2, Trophy, CheckCircle2, RotateCcw, ArrowRight, Gauge, AlertTriangle, Bug } from 'lucide-react';

const DEBUG_CODE_ROUNDS = [
  {
    round: 1,
    title: "Round 1: Off-by-One Loop Boundary Bug",
    code: `def calculate_sum(numbers):\n    total = 0\n    for i in range(1, len(numbers)):  # Line 3\n        total += numbers[i]\n    return total`,
    question: "Calling calculate_sum([10, 20, 30]) returns 50 instead of 60. What is the root cause?",
    options: [
      { id: "A", text: "Line 3: range(1, len(numbers)) skips index 0 (numbers[0])", isCorrect: true },
      { id: "B", text: "Line 4: total += numbers[i] should be total *= numbers[i]", isCorrect: false },
      { id: "C", text: "Line 2: total = 0 should be total = 1", isCorrect: false },
      { id: "D", text: "Line 5: Return statement fails to convert to float", isCorrect: false }
    ]
  },
  {
    round: 2,
    title: "Round 2: Boolean Logic Inversion Bug",
    code: `def is_eligible(grade, attendance):\n    # Student must have grade >= 10 AND attendance >= 80%\n    if grade >= 10 or attendance >= 80:  # Line 3\n        return True\n    return False`,
    question: "Which modification fixes the bug that allows a student with grade 5 and 90% attendance to pass?",
    options: [
      { id: "A", text: "Line 3: Change 'or' operator to 'and'", isCorrect: true },
      { id: "B", text: "Line 3: Change 'grade >= 10' to 'grade == 10'", isCorrect: false },
      { id: "C", text: "Line 4: Change 'return True' to 'return False'", isCorrect: false },
      { id: "D", text: "Line 5: Delete return False statement", isCorrect: false }
    ]
  },
  {
    round: 3,
    title: "Round 3: Infinite Recursion Stack Bug",
    code: `def factorial(n):\n    if n == 1:\n        return 1\n    return n * factorial(n)  # Line 4`,
    question: "Calling factorial(5) triggers a Maximum Recursion Depth Error. Why?",
    options: [
      { id: "A", text: "Line 4: factorial(n) does not decrement n to factorial(n - 1)", isCorrect: true },
      { id: "B", text: "Line 2: n == 1 condition is invalid in Python", isCorrect: false },
      { id: "C", text: "Line 3: return 1 should be return 0", isCorrect: false },
      { id: "D", text: "Line 1: Function name cannot be factorial", isCorrect: false }
    ]
  }
];

const DebugCodeGame = ({ onGameComplete }) => {
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [selectedOptId, setSelectedOptId] = useState(null);
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

  const currentRound = DEBUG_CODE_ROUNDS[currentRoundIdx];

  const handleNextRound = () => {
    if (!selectedOptId) {
      alert("Please select your diagnostic answer first.");
      return;
    }

    const chosenOpt = currentRound.options.find(o => o.id === selectedOptId);
    const isCorrect = chosenOpt?.isCorrect === true;
    const score = isCorrect ? 100 : 25;

    const newResults = [...roundResults, { round: currentRound.round, isCorrect, score }];
    setRoundResults(newResults);
    setSelectedOptId(null);

    if (currentRoundIdx < DEBUG_CODE_ROUNDS.length - 1) {
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
          <span style={{ fontSize: '13px', fontWeight: '700', padding: '4px 10px', background: '#ef4444', borderRadius: '6px', color: 'white' }}>
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
          {/* Code Viewer Panel */}
          <div style={{
            background: '#0d1117',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px',
            fontFamily: 'monospace',
            fontSize: '14px',
            color: '#e6edf3',
            whiteSpace: 'pre-wrap',
            lineHeight: '1.6'
          }}>
            <div style={{ fontSize: '11px', color: '#8b949e', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              SOURCE CODE SNIPPET UNDER DEBUGGING:
            </div>
            <code>{currentRound.code}</code>
          </div>

          <p style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px', color: '#a5b4fc' }}>
            Diagnostic Question: {currentRound.question}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {currentRound.options.map((opt) => {
              const isSelected = selectedOptId === opt.id;

              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedOptId(opt.id)}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '10px',
                    background: isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(23, 32, 54, 0.7)',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '14px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontWeight: '700', color: isSelected ? '#a5b4fc' : 'var(--text-muted)' }}>
                      [{opt.id}]
                    </span>
                    <span>{opt.text}</span>
                  </div>
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: isSelected ? '5px solid var(--primary)' : '2px solid var(--border-color)',
                    background: isSelected ? 'white' : 'transparent'
                  }} />
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleNextRound}
              disabled={!selectedOptId}
              className="btn btn-primary"
              style={{ padding: '12px 28px', fontWeight: '700', borderRadius: '10px', opacity: selectedOptId ? 1 : 0.5 }}
            >
              <span>{currentRoundIdx === DEBUG_CODE_ROUNDS.length - 1 ? 'Finish Game 3' : 'Submit & Next Round'}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: '32px', textAlign: 'center', borderRadius: '16px', background: 'rgba(17, 24, 39, 0.95)', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
          <Trophy size={48} style={{ color: '#10b981', margin: '0 auto 16px auto' }} />
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', color: '#ffffff' }}>Debug the Code Challenge Completed!</h2>
          <p style={{ color: '#cbd5e1', marginBottom: '24px' }}>All 3 code debugging rounds completed successfully.</p>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#818cf8', marginBottom: '16px' }}>
            Score: {Math.round(roundResults.reduce((a, b) => a + b.score, 0) / roundResults.length)} / 100
          </div>
          <div style={{ color: '#34d399', fontWeight: '600' }}>✓ Saved to MongoDB</div>
        </div>
      )}
    </div>
  );
};

export default DebugCodeGame;
