import React, { useState, useEffect } from 'react';
import { Settings, Zap, ArrowRight, CheckCircle2, RotateCcw, Award, Play } from 'lucide-react';

const MECH_GAME_LEVELS = [
  {
    id: 'mech_lvl_1',
    name: 'Level 1 — Gear System Speed Ratio',
    description: 'Determine the rotation speed of a driven gear when connected to a driver gear.',
    problem: 'Driver Gear A has 12 teeth and rotates at 120 RPM. Driven Gear B has 24 teeth. What is the rotation speed of Gear B?',
    options: ['60 RPM', '120 RPM', '240 RPM', '480 RPM'],
    correct: '60 RPM',
    explanation: 'Gear B has twice as many teeth (24/12 = 2), so it rotates at half the speed: 120 RPM / 2 = 60 RPM.',
    difficulty: 'Easy'
  },
  {
    id: 'mech_lvl_2',
    name: 'Level 2 — Lever Mechanical Advantage',
    description: 'Calculate the effort force needed to balance a heavy load using a lever arm.',
    problem: 'A 600 N load is located 1 meter from the fulcrum. If the effort arm is 3 meters long, what minimum effort force is needed to lift the load?',
    options: ['200 N', '300 N', '600 N', '1800 N'],
    correct: '200 N',
    explanation: 'Torque balance: Load × Load Arm = Effort × Effort Arm → 600 N × 1 m = Effort × 3 m → Effort = 200 N.',
    difficulty: 'Easy'
  },
  {
    id: 'mech_lvl_3',
    name: 'Level 3 — Pulley Lift System',
    description: 'Determine the effort reduction provided by a multi-string pulley block.',
    problem: 'A heavy engine block weighing 1200 N is lifted using a block-and-tackle system with 4 supporting rope strands. What effort force is required?',
    options: ['300 N', '400 N', '600 N', '1200 N'],
    correct: '300 N',
    explanation: 'Mechanical Advantage = 4 rope strands. Ideal Effort = Load / 4 = 1200 N / 4 = 300 N.',
    difficulty: 'Medium'
  },
  {
    id: 'mech_lvl_4',
    name: 'Level 4 — Heat Conduction Rate',
    description: 'Analyze heat transfer across solid metallic engine walls.',
    problem: 'Double the thickness of a solid copper plate while keeping temperatures constant. What happens to the rate of heat conduction across the plate?',
    options: ['Reduced by half (50%)', 'Doubled (200%)', 'Remains unchanged', 'Increases 4-fold'],
    correct: 'Reduced by half (50%)',
    explanation: 'Fourier\'s Law of Conduction states heat flow Q is inversely proportional to thickness (L). Doubling thickness halves heat flow.',
    difficulty: 'Medium'
  },
  {
    id: 'mech_lvl_5',
    name: 'Level 5 — Hydraulic Brake Equilibrium',
    description: 'Apply Pascal\'s Law to calculate output force in a hydraulic cylinder system.',
    problem: 'A small piston of area 5 cm² experiences an input force of 100 N. If the output piston has an area of 50 cm², what output force is exerted?',
    options: ['1000 N', '500 N', '100 N', '5000 N'],
    correct: '1000 N',
    explanation: 'Pressure P = F1/A1 = 100/5 = 20 N/cm². Output Force F2 = P × A2 = 20 N/cm² × 50 cm² = 1000 N.',
    difficulty: 'Hard'
  }
];

export default function MechanicalGame({ onComplete }) {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [levelResults, setLevelResults] = useState([]);
  const [startTime, setStartTime] = useState(Date.now());
  const [attempts, setAttempts] = useState(1);

  const level = MECH_GAME_LEVELS[currentLevelIdx];

  const handleSelectOption = (opt) => {
    if (showFeedback) return;
    setSelectedOption(opt);
  };

  const handleSubmitLevel = () => {
    if (!selectedOption) return;
    const correct = selectedOption === level.correct;
    setIsCorrect(correct);
    setShowFeedback(true);

    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const resultObj = {
      levelId: level.id,
      levelName: level.name,
      skillTested: level.description,
      difficulty: level.difficulty,
      accuracy: correct ? 100.0 : 0.0,
      timeTakenSeconds: elapsed,
      attempts: attempts,
      completed: true
    };

    setLevelResults(prev => [...prev, resultObj]);
  };

  const handleNextLevel = () => {
    if (currentLevelIdx < MECH_GAME_LEVELS.length - 1) {
      setCurrentLevelIdx(prev => prev + 1);
      setSelectedOption('');
      setShowFeedback(false);
      setStartTime(Date.now());
      setAttempts(1);
    } else {
      // Game Complete
      const totalTime = levelResults.reduce((acc, r) => acc + (r.timeTakenSeconds || 0), 0);
      onComplete && onComplete(levelResults, totalTime);
    }
  };

  const handleRetry = () => {
    setSelectedOption('');
    setShowFeedback(false);
    setAttempts(prev => prev + 1);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-900 border border-slate-800 rounded-2xl text-white shadow-2xl">
      {/* Header */}
      <div className="flex justify-between items-center pb-6 mb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <Settings className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-amber-400">Round 1: Mechanical Engineering Simulation Game</h2>
            <p className="text-sm text-slate-400">Level {currentLevelIdx + 1} of {MECH_GAME_LEVELS.length}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-48 bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700">
          <div
            className="bg-gradient-to-r from-amber-500 to-orange-500 h-full transition-all duration-500"
            style={{ width: `${((currentLevelIdx + 1) / MECH_GAME_LEVELS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Challenge Card */}
      <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 bg-amber-500/10 text-amber-300 text-xs font-semibold rounded-full border border-amber-500/20">
            {level.name}
          </span>
          <span className="px-3 py-1 bg-slate-700 text-slate-300 text-xs rounded-full">
            {level.difficulty}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-slate-200 mb-2">{level.description}</h3>
        <p className="text-slate-300 text-base leading-relaxed bg-slate-900/60 p-4 rounded-lg border border-slate-700/50 font-mono">
          {level.problem}
        </p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {level.options.map((opt, idx) => {
          const isSel = selectedOption === opt;
          return (
            <button
              key={idx}
              disabled={showFeedback}
              onClick={() => handleSelectOption(opt)}
              className={`p-4 text-left rounded-xl border transition-all duration-200 flex items-center justify-between font-medium ${isSel
                  ? 'bg-amber-500/20 border-amber-500 text-amber-200 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-800'
                }`}
            >
              <span>{opt}</span>
              {isSel && <div className="w-3 h-3 rounded-full bg-amber-400" />}
            </button>
          );
        })}
      </div>

      {/* Feedback Banner */}
      {showFeedback && (
        <div className={`p-5 rounded-xl border mb-6 ${isCorrect
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
            : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
          }`}>
          <div className="flex items-start gap-3">
            {isCorrect ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <RotateCcw className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="font-bold text-base mb-1">
                {isCorrect ? 'Correct Mechanical Principle!' : 'Incorrect Analysis'}
              </h4>
              <p className="text-sm opacity-90">{level.explanation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex justify-end gap-4">
        {!showFeedback ? (
          <button
            onClick={handleSubmitLevel}
            disabled={!selectedOption}
            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${selectedOption
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 shadow-lg shadow-amber-500/20 cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
          >
            Submit Answer <Zap className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleNextLevel}
            className="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
          >
            {currentLevelIdx < MECH_GAME_LEVELS.length - 1 ? 'Next Level' : 'Proceed to Round 2 AI Quiz'} <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
