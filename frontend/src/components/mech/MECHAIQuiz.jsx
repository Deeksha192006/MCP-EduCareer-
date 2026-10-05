import React, { useState, useEffect } from 'react';
import { Cpu, CheckCircle, Clock, ShieldCheck, Sparkles, ArrowRight, AlertTriangle, Layers, BookOpen } from 'lucide-react';
import { mechAPI } from '../../services/api';

export default function MECHAIQuiz({ assessmentId, studentId, onComplete }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { qId: selectedChoice }
  const [startTime, setStartTime] = useState(Date.now());
  const [timerSeconds, setTimerSeconds] = useState(0);

  // 1. Trigger AI Generation on Mount
  useEffect(() => {
    let mounted = true;
    const generateQuiz = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await mechAPI.generateQuiz(assessmentId, studentId);
        if (mounted && res.data && res.data.questions) {
          setQuestions(res.data.questions);
          setStartTime(Date.now());
        }
      } catch (err) {
        console.error('AI Quiz Generation failed:', err);
        if (mounted) {
          setError('Failed to generate AI questions. Please try again.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (assessmentId && studentId) {
      generateQuiz();
    }
    return () => { mounted = false; };
  }, [assessmentId, studentId]);

  // 2. Timer tick
  useEffect(() => {
    if (loading || submitting) return;
    const interval = setInterval(() => {
      setTimerSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [loading, submitting, startTime]);

  const handleSelectAnswer = (qId, choice) => {
    setAnswers(prev => ({ ...prev, [qId]: choice }));
  };

  const currentQ = questions[currentIdx];

  const handleSubmitQuiz = async () => {
    setSubmitting(true);
    try {
      const answersPayload = questions.map(q => ({
        questionId: q.id,
        selectedAnswer: answers[q.id] || ''
      }));

      const res = await mechAPI.submitQuiz(
        assessmentId,
        studentId,
        answersPayload,
        timerSeconds
      );

      if (res.data) {
        onComplete && onComplete(res.data);
      }
    } catch (err) {
      console.error('Quiz submit failed:', err);
      setError('Failed to submit assessment answers. Please check connection.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-12 bg-slate-900 border border-slate-800 rounded-2xl text-center shadow-2xl">
        <div className="relative inline-block mb-6">
          <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center border border-amber-500/30 animate-pulse">
            <Cpu className="w-10 h-10 text-amber-400 animate-spin-slow" />
          </div>
          <Sparkles className="w-6 h-6 text-amber-300 absolute -top-1 -right-1 animate-bounce" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Generating AI Mechanical Engineering Questions...</h3>
        <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
          Creating 10 personalized 12th-standard MECH questions across mechanics, thermodynamics, robotics, and gears. Validating distractors and checking duplicate prevention...
        </p>

        <div className="w-64 mx-auto bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-full w-full animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-slate-900 border border-rose-900/50 rounded-2xl text-center text-white">
        <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">AI Generation Error</h3>
        <p className="text-slate-400 text-sm mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400"
        >
          Retry Assessment
        </button>
      </div>
    );
  }

  if (!questions || questions.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-900 border border-slate-800 rounded-2xl text-white shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center pb-6 mb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-bold rounded-full border border-amber-500/20 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> AI Auto-Generated Assessment
            </span>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-full border border-emerald-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Answers Secured on Server
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-100">Round 2: Mechanical Engineering Technical MCQ</h2>
        </div>

        {/* Timer & Question Tracker */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 text-slate-300 font-mono text-sm">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>{Math.floor(timerSeconds / 60)}m {timerSeconds % 60}s</span>
          </div>
          <div className="text-right">
            <span className="text-sm text-slate-400 font-medium">Question {currentIdx + 1} of {questions.length}</span>
          </div>
        </div>
      </div>

      {/* Question Stepper */}
      <div className="grid grid-cols-10 gap-1.5 mb-6">
        {questions.map((q, idx) => {
          const isAns = !!answers[q.id];
          const isCurr = idx === currentIdx;
          return (
            <button
              key={q.id}
              onClick={() => setCurrentIdx(idx)}
              className={`h-2.5 rounded-full transition-all ${
                isCurr
                  ? 'bg-amber-400 ring-2 ring-amber-400/50'
                  : isAns
                  ? 'bg-amber-600'
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
            />
          );
        })}
      </div>

      {/* Main Question Card */}
      {currentQ && (
        <div className="bg-slate-800/40 border border-slate-800 p-6 rounded-xl mb-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-slate-800 text-amber-300 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" /> {currentQ.topic}
              </span>
              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-md ${
                currentQ.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                currentQ.difficulty === 'Hard' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                {currentQ.difficulty}
              </span>
            </div>
            <span className="text-xs text-slate-500 font-mono">QID: {currentQ.id}</span>
          </div>

          <h3 className="text-lg font-medium text-slate-100 mb-6 leading-relaxed">
            {currentQ.question}
          </h3>

          {/* Options A, B, C, D */}
          <div className="space-y-3">
            {Object.entries(currentQ.options || {}).map(([key, value]) => {
              const isSelected = answers[currentQ.id] === key;
              return (
                <button
                  key={key}
                  onClick={() => handleSelectAnswer(currentQ.id, key)}
                  className={`w-full p-4 rounded-xl text-left border transition-all flex items-center justify-between font-medium ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-500 text-amber-200 shadow-md shadow-amber-500/10'
                      : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-600 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {key}
                    </span>
                    <span className="text-sm">{value}</span>
                  </div>
                  {isSelected && <CheckCircle className="w-5 h-5 text-amber-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex justify-between items-center pt-2">
        <button
          onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
          disabled={currentIdx === 0}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <div className="text-xs text-slate-500">
          {Object.keys(answers).length} of {questions.length} Answered
        </div>

        {currentIdx < questions.length - 1 ? (
          <button
            onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold"
          >
            Next Question
          </button>
        ) : (
          <button
            onClick={handleSubmitQuiz}
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? 'Evaluating Server Answers...' : 'Submit Assessment'} <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
