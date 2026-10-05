import React, { useState, useEffect } from 'react';
import { writtenTestAPI } from '../../services/api';
import { 
  BookOpen, CheckCircle2, AlertCircle, Clock, Award, 
  ArrowRight, ArrowLeft, RefreshCw, X, HelpCircle, Sparkles 
} from 'lucide-react';

const WrittenAssessmentModal = ({ courseKey, studentId, onClose, onComplete }) => {
  const [loading, setLoading] = useState(true);
  const [testData, setTestData] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [startTime] = useState(Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, [courseKey]);

  const fetchQuestions = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await writtenTestAPI.getQuestions(courseKey);
      setTestData(res.data);
    } catch (err) {
      console.error("Failed to load written assessment:", err);
      setErrorMsg("Failed to connect to assessment server. Please check backend status.");
    } finally {
      setLoading(false);
    }
  };

  const questions = testData?.questions || [];
  const currentQ = questions[currentIdx];

  const handleSelectOption = (opt) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQ.id]: opt
    });
  };

  const handleNext = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const totalTime = Math.floor((Date.now() - startTime) / 1000);
      const answersPayload = questions.map((q) => ({
        questionId: q.id,
        selectedAnswer: selectedAnswers[q.id] || "No Answer",
        timeTaken: Math.max(1, Math.round(totalTime / (questions.length || 1)))
      }));

      const res = await writtenTestAPI.submitTest(courseKey, studentId, answersPayload, totalTime);
      setSubmissionResult(res.data);
      if (onComplete) {
        onComplete(res.data);
      }
    } catch (err) {
      console.error("Error submitting written assessment:", err);
      setErrorMsg("Failed to submit assessment to server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const isAllAnswered = answeredCount === questions.length;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border-color)',
        borderRadius: '20px',
        maxWidth: '780px',
        width: '100%',
        maxHeight: '92vh',
        overflowY: 'auto',
        boxShadow: '0 20px 45px rgba(15, 23, 42, 0.16)',
        padding: '32px',
        color: 'var(--text-main)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                padding: '3px 10px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 700,
                border: '1px solid var(--primary-border)'
              }}>
                WRITTEN ASSESSMENT (25% WEIGHTAGE)
              </span>
              <span style={{ color: 'var(--text-dim)', fontSize: '13px', fontWeight: 600 }}>
                • Normalized 0–100 Scale
              </span>
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              {testData?.courseName || "Course Conceptual Assessment"}
            </h2>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: '#f8fafc',
              border: '1px solid var(--border-color)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-dim)',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <RefreshCw size={36} className="spin-icon" style={{ color: 'var(--primary)', marginBottom: '16px' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', fontWeight: 600 }}>Loading course question bank...</p>
          </div>
        ) : errorMsg ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <AlertCircle size={40} color="var(--danger)" style={{ marginBottom: '12px' }} />
            <p style={{ color: 'var(--danger)', marginBottom: '16px', fontWeight: 600 }}>{errorMsg}</p>
            <button onClick={fetchQuestions} className="btn btn-outline">Retry Loading</button>
          </div>
        ) : submissionResult ? (
          /* Post-submission Result View */
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: 'var(--success-bg)',
              border: '2px solid var(--success-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--success)',
              margin: '0 auto 16px'
            }}>
              <Award size={36} />
            </div>

            <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
              Written Assessment Completed!
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '520px', margin: '0 auto 24px' }}>
              Your conceptual responses have been evaluated and recorded by the backend scoring engine.
            </p>

            <div style={{
              background: '#f8fafc',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '24px',
              display: 'inline-block',
              marginBottom: '28px',
              minWidth: '280px'
            }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Normalized Written Score
              </span>
              <div style={{ fontSize: '48px', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1.1, marginTop: '4px' }}>
                {submissionResult.score}
                <span style={{ fontSize: '20px', color: 'var(--text-dim)', fontWeight: 600 }}> / 100</span>
              </div>
              <div style={{ fontSize: '14px', color: 'var(--success)', fontWeight: 700, marginTop: '8px' }}>
                {submissionResult.correctCount} of {submissionResult.totalQuestions} questions correct
              </div>
            </div>

            {/* Topic Breakdown */}
            <div style={{ textAlign: 'left', marginBottom: '28px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px' }}>
                Conceptual Topic Breakdown
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                {Object.entries(submissionResult.topicScores || {}).map(([topic, sc]) => (
                  <div key={topic} style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '4px', fontWeight: 600 }}>{topic}</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: sc >= 75 ? 'var(--success)' : sc >= 50 ? 'var(--warning)' : 'var(--danger)' }}>
                      {sc}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={onClose}
              className="btn btn-primary"
              style={{
                padding: '12px 32px',
                fontSize: '15px',
                fontWeight: 700
              }}
            >
              Return to Recommendations (Update 75:25 Score)
            </button>
          </div>
        ) : (
          /* Active Question View */
          <div>
            {/* Progress Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>
                Question {currentIdx + 1} of {questions.length}
              </span>
              <span style={{ fontSize: '13px', color: 'var(--text-dim)', fontWeight: 600 }}>
                {answeredCount}/{questions.length} Answered
              </span>
            </div>

            {/* Progress Bar */}
            <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '9999px', marginBottom: '24px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${((currentIdx + 1) / questions.length) * 100}%`,
                background: 'var(--primary)',
                transition: 'width 0.3s ease'
              }} />
            </div>

            {/* Question Card */}
            {currentQ && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    background: currentQ.difficulty === 'easy' ? 'var(--success-bg)' : currentQ.difficulty === 'medium' ? 'var(--warning-bg)' : 'var(--danger-bg)',
                    color: currentQ.difficulty === 'easy' ? 'var(--success)' : currentQ.difficulty === 'medium' ? 'var(--warning)' : 'var(--danger)',
                    border: `1px solid ${currentQ.difficulty === 'easy' ? 'var(--success-border)' : currentQ.difficulty === 'medium' ? 'var(--warning-border)' : 'var(--danger-border)'}`
                  }}>
                    {currentQ.difficulty} Tier
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Topic: <strong>{currentQ.topic}</strong>
                  </span>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.5, marginBottom: '20px' }}>
                  {currentQ.question}
                </h3>

                {/* Options List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {currentQ.options.map((opt, oIdx) => {
                    const isSelected = selectedAnswers[currentQ.id] === opt;
                    return (
                      <div
                        key={oIdx}
                        onClick={() => handleSelectOption(opt)}
                        style={{
                          padding: '14px 18px',
                          borderRadius: '12px',
                          border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                          background: isSelected ? 'var(--primary-light)' : '#ffffff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          transition: 'all 0.15s ease',
                          boxShadow: 'var(--shadow-sm)'
                        }}
                      >
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: isSelected ? '6px solid var(--primary)' : '2px solid #cbd5e1',
                          background: '#ffffff',
                          flexShrink: 0
                        }} />
                        <span style={{ 
                          fontSize: '15px', 
                          color: isSelected ? 'var(--primary)' : 'var(--text-main)', 
                          fontWeight: isSelected ? 700 : 500,
                          lineHeight: 1.5 
                        }}>
                          {opt}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Navigation & Submit Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '28px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <button
                onClick={handlePrev}
                disabled={currentIdx === 0}
                className="btn btn-outline"
                style={{ padding: '8px 18px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', opacity: currentIdx === 0 ? 0.4 : 1 }}
              >
                <ArrowLeft size={16} />
                <span>Previous</span>
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                {currentIdx + 1 < questions.length ? (
                  <button
                    onClick={handleNext}
                    className="btn btn-primary"
                    style={{ padding: '9px 22px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <span>Next Question</span>
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="btn btn-primary"
                    style={{
                      padding: '10px 24px',
                      fontSize: '14px',
                      fontWeight: 700,
                      background: 'var(--success)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <CheckCircle2 size={16} />
                    <span>{submitting ? "Evaluating on Server..." : "Submit Written Assessment"}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WrittenAssessmentModal;
