import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Award, Settings, CheckCircle2, AlertCircle, ArrowRight, BarChart2, BookOpen, Layers, RefreshCw } from 'lucide-react';
import { mechAPI } from '../services/api';

export default function MECHResult() {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchResult = async () => {
      try {
        const res = await mechAPI.getResult(studentId || 'guest_student_123');
        if (mounted && res.data && res.data.data) {
          setResult(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch MECH result:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchResult();
    return () => { mounted = false; };
  }, [studentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <Settings className="w-12 h-12 text-amber-400 animate-spin mx-auto" />
          <h3 className="text-xl font-bold">Calculating MECH Exploration Score...</h3>
        </div>
      </div>
    );
  }

  const data = result || {
    mechExplorationScore: 76.5,
    gameScore: 80.0,
    mcqScore: 71.25,
    strongTopics: ['Engineering Mechanics', 'Gears and Gear Systems', 'Materials and Properties', 'Simple Machines'],
    topicsToImprove: ['Thermodynamics Basics', 'Fluid Mechanics Basics'],
    skillProfile: {
      spatialReasoning: 82.0,
      mechanicalComprehension: 78.0,
      analyticalThinking: 75.0,
      practicalProblemSolving: 80.0,
      systemIntuition: 76.0
    },
    topicScores: {
      'Engineering Mechanics': { percentage: 85.0 },
      'Gears and Gear Systems': { percentage: 80.0 },
      'Materials and Properties': { percentage: 90.0 },
      'Thermodynamics Basics': { percentage: 50.0 },
      'Manufacturing Basics': { percentage: 70.0 }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Settings className="w-64 h-64 text-amber-500" />
          </div>

          <div className="relative z-10 space-y-4">
            <span className="px-4 py-1.5 bg-amber-500/10 text-amber-400 text-xs font-bold rounded-full border border-amber-500/20 uppercase tracking-widest">
              Mechanical Engineering Assessment Result
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              MECH Exploration Score
            </h1>

            {/* Score Pill */}
            <div className="py-4">
              <div className="inline-flex items-baseline gap-2 px-8 py-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 rounded-3xl">
                <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                  {data.mechExplorationScore}%
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              This compatibility score combines your Round 1 Mechanical Game performance (60% weight) and Round 2 AI Technical MCQ results (40% weight).
            </p>
          </div>
        </div>

        {/* 60 / 40 Score Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm font-medium">Round 1: Mechanical Game</span>
              <span className="text-amber-400 font-bold text-xs bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">60% Weight</span>
            </div>
            <div className="text-3xl font-extrabold text-white">{data.gameScore}%</div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full" style={{ width: `${data.gameScore}%` }} />
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm font-medium">Round 2: AI MCQ Quiz</span>
              <span className="text-orange-400 font-bold text-xs bg-orange-500/10 px-2.5 py-1 rounded-md border border-orange-500/20">40% Weight</span>
            </div>
            <div className="text-3xl font-extrabold text-white">{data.mcqScore}%</div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-orange-500 h-full" style={{ width: `${data.mcqScore}%` }} />
            </div>
          </div>
        </div>

        {/* Strong Topics vs Topics to Improve */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> Strong Mechanical Areas
            </h3>
            <div className="space-y-2">
              {(data.strongTopics || []).map((t, idx) => (
                <div key={idx} className="p-3 bg-emerald-950/20 border border-emerald-800/40 rounded-xl text-emerald-200 text-sm font-medium">
                  {t}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> Topics to Improve
            </h3>
            <div className="space-y-2">
              {(data.topicsToImprove || []).map((t, idx) => (
                <div key={idx} className="p-3 bg-amber-950/20 border border-amber-800/40 rounded-xl text-amber-200 text-sm font-medium">
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skill Profile Breakdown */}
        {data.skillProfile && (
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-amber-400" /> Mechanical Engineering Skill Profile
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(data.skillProfile).map(([skill, val]) => (
                <div key={skill} className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 space-y-2">
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                    {skill.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="text-xl font-bold text-amber-300">{val}%</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-between items-center gap-4 pt-4">
          <button
            onClick={() => navigate('/engineering/mech')}
            className="px-6 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 font-semibold hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" /> Retake Assessment
          </button>

          <button
            onClick={() => navigate('/engineering')}
            className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
          >
            View Career Recommendations <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
