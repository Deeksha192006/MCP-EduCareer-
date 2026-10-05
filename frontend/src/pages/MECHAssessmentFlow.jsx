import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MechanicalGame from '../components/mech/MechanicalGame';
import MECHAIQuiz from '../components/mech/MECHAIQuiz';
import { mechAPI } from '../services/api';

export default function MECHAssessmentFlow() {
  const location = useLocation();
  const navigate = useNavigate();

  const assessmentId = location.state?.assessmentId || `mech_eval_${Date.now()}`;
  const studentId = location.state?.studentId || localStorage.getItem('studentId') || 'guest_student_123';

  const [currentRound, setCurrentRound] = useState(1); // 1 = Game, 2 = AI Quiz
  const [gameScore, setGameScore] = useState(null);

  const handleGameComplete = async (levelResults, totalTimeTaken) => {
    try {
      const res = await mechAPI.submitGame(
        assessmentId,
        studentId,
        levelResults,
        totalTimeTaken
      );
      if (res.data && res.data.gameScore !== undefined) {
        setGameScore(res.data.gameScore);
      }
    } catch (err) {
      console.error('Game submit failed:', err);
    }
    setCurrentRound(2);
  };

  const handleQuizComplete = async (quizData) => {
    try {
      await mechAPI.completeAssessment(assessmentId, studentId);
    } catch (err) {
      console.error('Assessment completion failed:', err);
    }
    navigate(`/engineering/mech/result/${studentId}`, {
      state: { assessmentId, studentId }
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4">
      <div className="max-w-4xl mx-auto mb-6">
        {/* Round Progress Header */}
        <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full font-bold flex items-center justify-center text-sm ${
              currentRound === 1 ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-slate-950'
            }`}>
              1
            </div>
            <span className={`text-sm font-semibold ${currentRound === 1 ? 'text-amber-400' : 'text-slate-400'}`}>
              Round 1: Mechanical Game (60%)
            </span>
          </div>

          <div className="h-0.5 w-16 bg-slate-800" />

          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full font-bold flex items-center justify-center text-sm ${
              currentRound === 2 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-500'
            }`}>
              2
            </div>
            <span className={`text-sm font-semibold ${currentRound === 2 ? 'text-amber-400' : 'text-slate-500'}`}>
              Round 2: AI MCQ Quiz (40%)
            </span>
          </div>
        </div>
      </div>

      {currentRound === 1 && (
        <MechanicalGame onComplete={handleGameComplete} />
      )}

      {currentRound === 2 && (
        <MECHAIQuiz 
          assessmentId={assessmentId} 
          studentId={studentId} 
          onComplete={handleQuizComplete} 
        />
      )}
    </div>
  );
}
