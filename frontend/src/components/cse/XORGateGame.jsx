import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, HelpCircle, RotateCcw, ArrowRight, Award, Zap, Lightbulb } from 'lucide-react';

const XORGateGame = ({ onGameComplete }) => {
  const [level, setLevel] = useState(1); // 1: Basic 2-input, 2: 3-input chained XOR, 3: Missing Input Puzzle
  const [round, setRound] = useState(1);
  const totalRounds = 5;
  const [inputA, setInputA] = useState(0);
  const [inputB, setInputB] = useState(0);
  const [inputC, setInputC] = useState(0); // for chained
  const [targetOutput, setTargetOutput] = useState(0); // for missing input
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null); // { correct: bool, text: string }
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [startTime] = useState(Date.now());
  const [isGameOver, setIsGameOver] = useState(false);

  // Generate question based on round
  const generateQuestion = (roundNum) => {
    setSelectedAnswer(null);
    setFeedback(null);
    setShowHint(false);

    if (roundNum <= 2) {
      // Level 1: Basic 2-input XOR
      setLevel(1);
      const a = Math.round(Math.random());
      const b = Math.round(Math.random());
      setInputA(a);
      setInputB(b);
    } else if (roundNum <= 4) {
      // Level 2: 3-input chained (A XOR B) XOR C
      setLevel(2);
      const a = Math.round(Math.random());
      const b = Math.round(Math.random());
      const c = Math.round(Math.random());
      setInputA(a);
      setInputB(b);
      setInputC(c);
    } else {
      // Level 3: Missing Input Puzzle (A XOR ? = Output)
      setLevel(3);
      const a = Math.round(Math.random());
      const hiddenB = Math.round(Math.random());
      setInputA(a);
      setInputB(hiddenB);
      setTargetOutput(a ^ hiddenB);
    }
  };

  useEffect(() => {
    generateQuestion(1);
  }, []);

  const getCorrectAnswer = () => {
    if (level === 1) {
      return inputA ^ inputB;
    } else if (level === 2) {
      return (inputA ^ inputB) ^ inputC;
    } else {
      // Missing input B such that inputA ^ B == targetOutput
      return inputB;
    }
  };

  const handleSelectAnswer = (ans) => {
    if (feedback !== null) return; // already answered
    setSelectedAnswer(ans);
    setTotalAttempts(prev => prev + 1);

    const correctAns = getCorrectAnswer();
    const isCorrect = ans === correctAns;

    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setScore(prev => prev + 20);
      setFeedback({
        correct: true,
        text: `Correct! ${level === 1 
          ? `${inputA} XOR ${inputB} = ${ans} (different inputs give 1, same inputs give 0)`
          : level === 2 
          ? `(${inputA} XOR ${inputB}) = ${inputA ^ inputB}, then ${inputA ^ inputB} XOR ${inputC} = ${ans}`
          : `${inputA} XOR ${ans} = ${targetOutput}`}`
      });
    } else {
      setFeedback({
        correct: false,
        text: `Incorrect. The correct answer is ${correctAns}. Remember: XOR outputs 1 ONLY when the inputs are DIFFERENT!`
      });
    }
  };

  const handleNextRound = () => {
    if (round < totalRounds) {
      const nextR = round + 1;
      setRound(nextR);
      generateQuestion(nextR);
    } else {
      setIsGameOver(true);
    }
  };

  const handleRestart = () => {
    setRound(1);
    setScore(0);
    setCorrectAnswers(0);
    setTotalAttempts(0);
    setIsGameOver(false);
    generateQuestion(1);
  };

  const handleFinish = () => {
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    const accuracy = totalAttempts > 0 ? correctAnswers / totalAttempts : 0;
    const finalScore = Math.min(100, Math.round((correctAnswers / totalRounds) * 100));
    if (onGameComplete) {
      onGameComplete({
        score: finalScore,
        maxScore: 100,
        accuracy: accuracy,
        timeTaken: timeTaken,
        attempts: totalAttempts
      });
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      {/* Game Header Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#f8fafc',
        padding: '16px 20px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: '#2563eb',
            color: 'white',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '14px',
            fontWeight: '700'
          }}>
            Round {round} / {totalRounds}
          </div>
          <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>
            Level {level}: {level === 1 ? 'Basic XOR Gate' : level === 2 ? 'Chained Multi-Gate' : 'Inverse Logic / Missing Input'}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>
            Score: <span style={{ color: '#2563eb' }}>{score}</span> / 100
          </div>
          <button
            onClick={handleRestart}
            title="Restart game"
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

      {/* Truth Table Reference Card */}
      <div style={{
        background: '#eff6ff',
        border: '1.5px solid #bfdbfe',
        borderRadius: '12px',
        padding: '14px 20px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Zap size={18} color="#2563eb" />
          <strong style={{ color: '#1e40af', fontSize: '14px' }}>XOR (Exclusive OR) Truth Rule:</strong>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '10px',
          fontSize: '13px',
          fontWeight: '600',
          color: '#1e3a8a'
        }}>
          <span style={{ background: 'white', padding: '6px 10px', borderRadius: '6px', border: '1px solid #dbeafe', textAlign: 'center' }}>0 ⊕ 0 = <strong>0</strong> (Same)</span>
          <span style={{ background: 'white', padding: '6px 10px', borderRadius: '6px', border: '1px solid #dbeafe', textAlign: 'center' }}>0 ⊕ 1 = <strong>1</strong> (Diff)</span>
          <span style={{ background: 'white', padding: '6px 10px', borderRadius: '6px', border: '1px solid #dbeafe', textAlign: 'center' }}>1 ⊕ 0 = <strong>1</strong> (Diff)</span>
          <span style={{ background: 'white', padding: '6px 10px', borderRadius: '6px', border: '1px solid #dbeafe', textAlign: 'center' }}>1 ⊕ 1 = <strong>0</strong> (Same)</span>
        </div>
      </div>

      {!isGameOver ? (
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1.5px solid #e2e8f0',
          padding: '32px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          textAlign: 'center'
        }}>
          {/* Visual Logic Circuit Diagram */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>
              {level === 1 && 'What is the output of this XOR gate?'}
              {level === 2 && 'Evaluate the cascaded XOR gates step-by-step:'}
              {level === 3 && 'Find the missing input B to produce the given output:'}
            </h3>

            {/* Diagram Area */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              background: '#f8fafc',
              padding: '24px 36px',
              borderRadius: '16px',
              border: '2px solid #cbd5e1',
              flexWrap: 'wrap'
            }}>
              {level === 1 && (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'flex-end' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#475569' }}>Input A:</span>
                      <span style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '8px',
                        background: inputA === 1 ? '#2563eb' : '#64748b',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        fontWeight: '800'
                      }}>{inputA}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#475569' }}>Input B:</span>
                      <span style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '8px',
                        background: inputB === 1 ? '#2563eb' : '#64748b',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        fontWeight: '800'
                      }}>{inputB}</span>
                    </div>
                  </div>

                  <div style={{
                    padding: '12px 20px',
                    borderRadius: '12px',
                    background: '#1e293b',
                    color: '#38bdf8',
                    fontSize: '20px',
                    fontWeight: '800',
                    border: '2px solid #0284c7',
                    letterSpacing: '1px'
                  }}>
                    XOR (⊕)
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#475569' }}>Output:</span>
                    <span style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '8px',
                      background: feedback ? (feedback.correct ? '#10b981' : '#ef4444') : '#e2e8f0',
                      color: feedback ? 'white' : '#0f172a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      fontWeight: '800'
                    }}>
                      {selectedAnswer !== null ? selectedAnswer : '?'}
                    </span>
                  </div>
                </>
              )}

              {level === 2 && (
                <>
                  {/* Gate 1 */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700' }}>A = <strong style={{ color: '#2563eb' }}>{inputA}</strong></span>
                    <span style={{ fontSize: '13px', fontWeight: '700' }}>B = <strong style={{ color: '#2563eb' }}>{inputB}</strong></span>
                  </div>
                  <div style={{ padding: '8px 14px', borderRadius: '8px', background: '#1e293b', color: '#38bdf8', fontWeight: '700', fontSize: '14px' }}>
                    Gate 1 (A ⊕ B)
                  </div>
                  <span style={{ fontSize: '18px', fontWeight: '800', color: '#64748b' }}>➔</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Intermediate</span>
                    <span style={{ padding: '4px 10px', borderRadius: '6px', background: '#dbeafe', color: '#1e40af', fontWeight: '700' }}>
                      ({inputA ^ inputB})
                    </span>
                  </div>
                  <span style={{ fontSize: '18px', fontWeight: '800', color: '#64748b' }}>+</span>
                  <div style={{ fontSize: '13px', fontWeight: '700' }}>C = <strong style={{ color: '#2563eb' }}>{inputC}</strong></div>
                  <div style={{ padding: '8px 14px', borderRadius: '8px', background: '#1e293b', color: '#38bdf8', fontWeight: '700', fontSize: '14px' }}>
                    Gate 2 (⊕)
                  </div>
                  <span style={{ fontSize: '18px', fontWeight: '800', color: '#64748b' }}>➔</span>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '8px',
                    background: feedback ? (feedback.correct ? '#10b981' : '#ef4444') : '#e2e8f0',
                    color: feedback ? 'white' : '#0f172a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: '800'
                  }}>
                    {selectedAnswer !== null ? selectedAnswer : '?'}
                  </div>
                </>
              )}

              {level === 3 && (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'flex-end' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#475569' }}>Input A:</span>
                      <span style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '8px',
                        background: '#2563eb',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        fontWeight: '800'
                      }}>{inputA}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#475569' }}>Input B:</span>
                      <span style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '8px',
                        background: '#f59e0b',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        fontWeight: '800'
                      }}>{selectedAnswer !== null ? selectedAnswer : '?'}</span>
                    </div>
                  </div>

                  <div style={{
                    padding: '12px 20px',
                    borderRadius: '12px',
                    background: '#1e293b',
                    color: '#38bdf8',
                    fontSize: '20px',
                    fontWeight: '800',
                    border: '2px solid #0284c7'
                  }}>
                    XOR (⊕)
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#475569' }}>Given Output:</span>
                    <span style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '8px',
                      background: '#10b981',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      fontWeight: '800'
                    }}>{targetOutput}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Interactive Choice Buttons */}
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '15px', fontWeight: '700', color: '#334155', marginBottom: '14px' }}>
              {level === 3 ? 'Select the value of Input B:' : 'Select the Output value:'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              {[0, 1].map((val) => (
                <button
                  key={val}
                  onClick={() => handleSelectAnswer(val)}
                  disabled={feedback !== null}
                  style={{
                    width: '90px',
                    height: '60px',
                    fontSize: '24px',
                    fontWeight: '800',
                    borderRadius: '12px',
                    border: selectedAnswer === val 
                      ? '3px solid #2563eb' 
                      : '2px solid #cbd5e1',
                    background: selectedAnswer === val ? '#eff6ff' : '#ffffff',
                    color: '#0f172a',
                    cursor: feedback === null ? 'pointer' : 'default',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                  }}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* Immediate Feedback Banner */}
          {feedback && (
            <div style={{
              padding: '16px 20px',
              borderRadius: '12px',
              background: feedback.correct ? '#f0fdf4' : '#fef2f2',
              border: `1.5px solid ${feedback.correct ? '#86efac' : '#fca5a5'}`,
              color: feedback.correct ? '#166534' : '#991b1b',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              fontSize: '15px',
              fontWeight: '600'
            }}>
              {feedback.correct ? <CheckCircle2 size={22} color="#16a34a" /> : <XCircle size={22} color="#dc2626" />}
              <span>{feedback.text}</span>
            </div>
          )}

          {/* Hint & Next Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', alignItems: 'center' }}>
            <button
              onClick={() => setShowHint(prev => !prev)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 18px',
                borderRadius: '10px',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                color: '#475569'
              }}
            >
              <Lightbulb size={16} color="#eab308" /> {showHint ? 'Hide Hint' : 'Need a Hint?'}
            </button>

            {feedback && (
              <button
                onClick={handleNextRound}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 28px',
                  borderRadius: '10px',
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
                }}
              >
                <span>{round < totalRounds ? 'Next Round' : 'Finish Challenge'}</span>
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
              fontSize: '14px',
              textAlign: 'left',
              maxWidth: '600px',
              margin: '16px auto 0'
            }}>
              💡 <strong>Hint:</strong> {level === 1 && 'Look at both inputs. Are they different (one is 1, one is 0)? If yes, XOR gives 1. If they are identical (both 0 or both 1), XOR gives 0.'}
              {level === 2 && 'Evaluate Gate 1 first: what is A ⊕ B? Then take that result and XOR it with C!'}
              {level === 3 && 'If output is 1, input B must be DIFFERENT from A. If output is 0, input B must be IDENTICAL to A.'}
            </div>
          )}
        </div>
      ) : (
        /* Completion Screen */
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1.5px solid #e2e8f0',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#ecfdf5',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <Award size={36} />
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
            XOR Gate Challenge Complete!
          </h2>
          <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '24px' }}>
            You demonstrated Boolean reasoning and binary pattern recognition.
          </p>

          <div style={{
            display: 'inline-flex',
            gap: '32px',
            background: '#f8fafc',
            padding: '20px 36px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            marginBottom: '32px'
          }}>
            <div>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>FINAL SCORE</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#2563eb' }}>{score} / 100</div>
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>CORRECT</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#10b981' }}>{correctAnswers} / {totalRounds}</div>
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>ACCURACY</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a' }}>
                {totalAttempts > 0 ? Math.round((correctAnswers / totalAttempts) * 100) : 0}%
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={handleFinish}
              style={{
                padding: '14px 36px',
                borderRadius: '10px',
                background: '#2563eb',
                color: 'white',
                border: 'none',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'
              }}
            >
              Continue to Next Game ➔
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default XORGateGame;
