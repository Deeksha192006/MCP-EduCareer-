import React, { useState, useEffect } from 'react';
import { eceAPI } from '../../services/api';
import { HelpCircle, Clock, CheckCircle2, ArrowRight, Gauge, BookOpen, RefreshCw } from 'lucide-react';

const ECEQuiz = ({ onQuizComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOpt, setSelectedOpt] = useState(null);

  const [secondsSpent, setSecondsSpent] = useState(0);
  const [timerActive, setTimerActive] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    let interval = null;
    if (timerActive && questions.length > 0) {
      interval = setInterval(() => setSecondsSpent(prev => prev + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, questions]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await eceAPI.getQuizQuestions();
      setQuestions(res.data);
    } catch (err) {
      console.error("Failed to load ECE quiz questions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = () => {
    if (!selectedOpt) {
      alert("Please select an answer option.");
      return;
    }

    const currentQ = questions[currentQIdx];
    const newAnswers = [
      ...answers,
      {
        questionId: currentQ.id,
        selectedAnswer: selectedOpt,
        timeTaken: 15
      }
    ];

    setAnswers(newAnswers);
    setSelectedOpt(null);

    if (currentQIdx < questions.length - 1) {
      setCurrentQIdx(prev => prev + 1);
    } else {
      setTimerActive(false);
      if (onQuizComplete) {
        onQuizComplete(newAnswers, secondsSpent);
      }
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <RefreshCw size={32} className="spin-icon" style={{ color: 'var(--primary)', marginBottom: '12px' }} />
        <h4>Loading ECE Technical Knowledge Assessment...</h4>
      </div>
    );
  }

  const currentQ = questions[currentQIdx];

  return (
    <div className="quiz-container" style={{ width: '100%', color: 'var(--text-main)' }}>
      {/* Top Quiz Bar */}
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
            {currentQ?.topic}
          </span>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Question {currentQIdx + 1} of {questions.length}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
          <Clock size={16} style={{ color: '#f59e0b' }} />
          <span>Total Time: <strong>{secondsSpent}s</strong></span>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', marginBottom: '24px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${((currentQIdx + 1) / questions.length) * 100}%`, background: 'linear-gradient(90deg, var(--primary), var(--secondary))', transition: 'width 0.3s ease' }} />
      </div>

      {/* Main Question Box */}
      <div className="card" style={{ padding: '28px', borderRadius: '16px', background: 'rgba(23, 32, 54, 0.85)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', lineHeight: '1.5', marginBottom: '24px', color: 'white' }}>
          {currentQ?.question}
        </h3>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
          {currentQ?.options.map((opt, idx) => {
            const isSelected = selectedOpt === opt;

            return (
              <div
                key={idx}
                onClick={() => setSelectedOpt(opt)}
                style={{
                  padding: '16px 20px',
                  borderRadius: '12px',
                  background: isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(11, 15, 25, 0.6)',
                  border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease'
                }}
              >
                <span style={{ fontSize: '15px', color: isSelected ? 'white' : 'var(--text-main)', fontWeight: isSelected ? '600' : '400' }}>
                  {opt}
                </span>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: isSelected ? '5px solid var(--primary)' : '2px solid var(--border-color)',
                  background: isSelected ? 'white' : 'transparent'
                }} />
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleNextQuestion}
            disabled={!selectedOpt}
            className="btn btn-primary"
            style={{ padding: '12px 32px', fontWeight: '700', borderRadius: '10px', opacity: selectedOpt ? 1 : 0.5 }}
          >
            <span>{currentQIdx === questions.length - 1 ? 'Submit Round 2 Quiz' : 'Next Question'}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ECEQuiz;
