import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Sparkles, ShieldCheck, ArrowRight, Zap, BookOpen, Layers, Award } from 'lucide-react';
import { mechAPI } from '../services/api';

export default function MECHIntro() {
  const navigate = useNavigate();

  const handleStart = async () => {
    const studentId = localStorage.getItem('studentId') || 'guest_student_123';
    try {
      const res = await mechAPI.startAssessment(studentId);
      if (res.data && res.data.assessmentId) {
        navigate('/engineering/mech/flow', {
          state: {
            assessmentId: res.data.assessmentId,
            studentId: studentId
          }
        });
      }
    } catch (err) {
      console.error('Failed to start MECH assessment:', err);
      // Fallback navigation
      navigate('/engineering/mech/flow', {
        state: {
          assessmentId: `mech_demo_${Date.now()}`,
          studentId: studentId
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Settings className="w-4 h-4 animate-spin-slow" /> Mechanical Engineering Discovery
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Mechanical Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">(MECH)</span> Exploration
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Discover your aptitude for Mechanical Engineering through interactive physical simulations and dynamic AI-generated 12th-standard assessments.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition-all space-y-4">
            <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center border border-amber-500/30">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Round 1: Interactive Mechanical Game</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              5 interactive simulation levels testing gear ratios, lever balance, pulley mechanical advantage, heat conduction, and hydraulic press pressure.
            </p>
            <div className="text-xs text-amber-400 font-semibold uppercase tracking-wider">60% Contribution to Final Score</div>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-orange-500/40 transition-all space-y-4">
            <div className="w-12 h-12 bg-orange-500/20 text-orange-400 rounded-xl flex items-center justify-center border border-orange-500/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Round 2: AI Auto-Generative MCQ Quiz</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              10 fresh questions generated dynamically by AI for every student across 20 Mechanical Engineering topics. Answers are evaluated securely on the server.
            </p>
            <div className="text-xs text-orange-400 font-semibold uppercase tracking-wider">40% Contribution to Final Score</div>
          </div>
        </div>

        {/* 20 Topics Preview */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" /> 20 Mechanical Engineering Assessment Topics
          </h3>
          <div className="flex flex-wrap gap-2">
            {[
              "Engineering Mechanics", "Force and Motion", "Work, Energy & Power", "Friction",
              "Simple Machines", "Gears & Gear Systems", "Pulleys", "Mechanical Advantage",
              "Materials & Properties", "Manufacturing Basics", "Production Engineering",
              "Thermodynamics Basics", "Heat & Temperature", "Fluid Mechanics Basics",
              "Machine Elements", "Mechanical Design", "CAD/CAM Basics", "Automotive Engineering",
              "Robotics & Automation", "Industrial Engineering"
            ].map((topic, i) => (
              <span key={i} className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-medium rounded-lg border border-slate-700">
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center pt-4">
          <button
            onClick={handleStart}
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold text-lg rounded-2xl shadow-xl shadow-amber-500/20 flex items-center gap-3 mx-auto transition-all cursor-pointer transform hover:scale-105"
          >
            Start Mechanical Exploration Assessment <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
}
