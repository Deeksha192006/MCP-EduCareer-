import React, { useState, useEffect } from 'react';
import { Newspaper, ShieldCheck, AlertTriangle, CheckCircle2, Mic, Eye, Sparkles, Send, Award, Clock } from 'lucide-react';
import { journalismAPI } from '../../services/api';

const NewsroomChallengeGame = ({ challenges, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submissions, setSubmissions] = useState([]);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [evalFeedback, setEvalFeedback] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [startTime] = useState(Date.now());
  const [timerSeconds, setTimerSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimerSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  const currentChallenge = challenges[currentIndex];

  const handleSelectOption = (optId) => {
    if (evalFeedback) return; // Prevent changing after confirmed evaluation
    setSelectedOptionId(optId);
  };

  const handleConfirmDecision = async () => {
    if (!selectedOptionId || isEvaluating) return;
    setIsEvaluating(true);

    try {
      const res = await journalismAPI.evaluateChoice(currentChallenge.challengeId, selectedOptionId);
      setEvalFeedback(res.data);
    } catch (err) {
      console.error('Error evaluating choice:', err);
      // Fallback feedback if network drops
      setEvalFeedback({
        isOptimal: true,
        consequence: "Decision processed by Newsroom Editorial Desk.",
        editorialFeedback: "Proceeding to next editorial assignment.",
        scoreEarned: 15.0
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextChallenge = () => {
    const newSubmission = {
      challengeId: currentChallenge.challengeId,
      selectedOptionId: selectedOptionId,
      timeTaken: 30
    };
    const updatedSubmissions = [...submissions, newSubmission];
    setSubmissions(updatedSubmissions);

    setSelectedOptionId(null);
    setEvalFeedback(null);

    if (currentIndex + 1 < challenges.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const totalTime = Math.floor((Date.now() - startTime) / 1000);
      onComplete({ submissions: updatedSubmissions, totalTime });
    }
  };

  if (!currentChallenge) {
    return <div className="text-white p-8 text-center">Loading Newsroom Terminal...</div>;
  }

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Newsroom Control Header */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-500/20 border border-amber-400/40 rounded-xl text-amber-300 animate-pulse">
              <Newspaper className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 text-xs font-bold uppercase tracking-wider bg-red-600/80 text-white rounded">
                  LIVE NEWSROOM
                </span>
                <span className="text-xs text-slate-400">Desk Terminal #04</span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                The Newsroom Challenge — {currentChallenge.stageName || "Editorial Desk"}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-800/80 border border-slate-700/60 rounded-xl text-slate-300 text-sm">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="font-mono">{formatTime(timerSeconds)}</span>
            </div>
            <div className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-sm font-semibold">
              Assignment {currentIndex + 1} of {challenges.length}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800/80 h-2 rounded-full mt-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-400 h-full transition-all duration-500 ease-out"
            style={{ width: `${((currentIndex + (evalFeedback ? 1 : 0.5)) / challenges.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Challenge Card */}
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative Watermark */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Challenge Header */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              {currentChallenge.skillTested}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            {currentChallenge.title}
          </h3>
          <div className="p-4 bg-slate-800/60 border border-slate-700/70 rounded-2xl text-slate-200 leading-relaxed text-sm md:text-base">
            <span className="font-semibold text-amber-300 uppercase tracking-wide block text-xs mb-1">
              Field Dispatch & Situation:
            </span>
            {currentChallenge.scenario}
          </div>
          <p className="text-amber-200/90 font-medium text-sm md:text-base pt-1">
            🎯 <span className="underline decoration-amber-400/60 underline-offset-4">{currentChallenge.taskDescription}</span>
          </p>
        </div>

        {/* Options List */}
        <div className="space-y-4 mb-6">
          {currentChallenge.options.map((option, idx) => {
            const isSelected = selectedOptionId === option.id;
            const isConfirmed = !!evalFeedback;
            let borderStyle = 'border-slate-700/60 hover:border-amber-400/50 bg-slate-800/40';

            if (isSelected && !isConfirmed) {
              borderStyle = 'border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/10';
            } else if (isConfirmed && isSelected) {
              borderStyle = evalFeedback.isOptimal
                ? 'border-emerald-500 bg-emerald-500/15 shadow-lg shadow-emerald-500/10'
                : 'border-orange-500 bg-orange-500/15';
            }

            return (
              <div
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                className={`p-4 md:p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${borderStyle} ${
                  isConfirmed ? 'cursor-default' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 border-amber-400'
                      : 'border-slate-500 text-slate-400'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-200 text-sm md:text-base leading-relaxed font-normal">
                      {option.label}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Real-time Editorial Feedback Box */}
        {evalFeedback && (
          <div className={`p-5 rounded-2xl border mb-6 transition-all duration-300 ${
            evalFeedback.isOptimal
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : 'bg-orange-950/40 border-orange-500/40 text-orange-200'
          }`}>
            <div className="flex items-center space-x-2 font-bold text-sm mb-2">
              {evalFeedback.isOptimal ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-300">Editorial Endorsement: Highly Responsible Journalism</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                  <span className="text-orange-300">Editorial Critique: High Risk of Misinformation / Bias</span>
                </>
              )}
            </div>
            <p className="text-sm leading-relaxed text-slate-200 mb-2">
              <strong>Consequence:</strong> {evalFeedback.consequence}
            </p>
            <p className="text-xs text-slate-300 italic">
              <strong>Editor's Guidance:</strong> {evalFeedback.editorialFeedback}
            </p>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-end space-x-4">
          {!evalFeedback ? (
            <button
              onClick={handleConfirmDecision}
              disabled={!selectedOptionId || isEvaluating}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
            >
              <span>{isEvaluating ? 'Transmitting to Desk...' : 'Dispatch Editorial Decision'}</span>
              <Send className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleNextChallenge}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center space-x-2"
            >
              <span>{currentIndex + 1 < challenges.length ? 'Next Newsroom Assignment' : 'Finalize Broadcast & Review Score'}</span>
              <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsroomChallengeGame;
