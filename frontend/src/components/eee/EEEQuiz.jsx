import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, HelpCircle, Clock, ShieldAlert, Award } from 'lucide-react';

const EEEQuiz = ({ questions, onQuizComplete }) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [secondsSpent, setSecondsSpent] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsSpent(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!questions || questions.length === 0) {
    return (
      <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading EEE Quiz questions...</p>
      </div>
    );
  }

  const currentQ = questions[currentQuestionIdx];

  const handleSelectOption = (opt) => {
    setSelectedOption(opt);
  };

  const handleNextQuestion = () => {
    if (!selectedOption) return;

    const answerRecord = {
      questionId: currentQ.id,
      selectedAnswer: selectedOption,
      timeTaken: 12
    };

    const newAnswers = [...userAnswers, answerRecord];
    setUserAnswers(newAnswers);
    setSelectedOption(null);

    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      if (onQuizComplete) {
        onQuizComplete(newAnswers, secondsSpent);
      }
    }
  };

  return (
    <div className="card" style={{ padding: '28px', borderRadius: '16px', background: 'rgba(17, 24, 39, 0.85)', border: '1px solid var(--border-color)' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: '700', padding: '4px 10px', background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            TOPIC: {currentQ.topic}
          </span>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginTop: '8px', marginBottom: 0 }}>
            Question {currentQuestionIdx + 1} of {questions.length}
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>
          <Clock size={16} style={{ color: '#f59e0b' }} />
          <span>Timer: <strong>{secondsSpent}s</strong></span>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', marginBottom: '24px', overflow: 'hidden' }}>
        <div style={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #f59e0b, #d97706)', transition: 'width 0.3s ease' }} />
      </div>

      {/* Question Text */}
      <h4 style={{ fontSize: '17px', fontWeight: '600', lineHeight: '1.5', marginBottom: '24px', color: 'var(--text-main)' }}>
        {currentQ.question}
      </h4>

      {/* Options List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
        {currentQ.options.map((opt, idx) => {
          const isSelected = selectedOption === opt;
          return (
            <div
              key={idx}
              onClick={() => handleSelectOption(opt)}
              style={{
                padding: '16px',
                borderRadius: '12px',
                border: isSelected ? '2px solid #f59e0b' : '1px solid var(--border-color)',
                background: isSelected ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255,255,255,0.02)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: isSelected ? '2px solid #f59e0b' : '2px solid #6b7280',
                background: isSelected ? '#f59e0b' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '700',
                color: isSelected ? 'black' : 'var(--text-muted)'
              }}>
                {String.fromCharCode(65 + idx)}
              </div>
              <span style={{ fontSize: '15px', fontWeight: isSelected ? '600' : '400', color: isSelected ? '#fbbf24' : 'var(--text-main)' }}>
                {opt}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bottom Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={handleNextQuestion}
          disabled={!selectedOption}
          className="btn btn-primary"
          style={{
            padding: '12px 28px',
            fontSize: '15px',
            fontWeight: '700',
            borderRadius: '10px',
            background: selectedOption ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(255,255,255,0.1)',
            color: selectedOption ? 'white' : 'var(--text-muted)',
            cursor: selectedOption ? 'pointer' : 'not-allowed',
            border: 'none'
          }}
        >
          <span>{currentQuestionIdx < questions.length - 1 ? 'Next Question' : 'Submit Technical Quiz'}</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default EEEQuiz;
