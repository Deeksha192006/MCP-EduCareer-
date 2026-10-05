import React, { useState, useEffect } from 'react';
import { adminMechAPI } from '../services/api';
import { Settings, Sparkles, CheckCircle2, XCircle, Trash2, RefreshCw, BarChart3, ShieldCheck, Filter, Plus } from 'lucide-react';

export default function AdminMECHQuestions() {
  const [questions, setQuestions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Batch generation form
  const [genTopic, setGenTopic] = useState('Engineering Mechanics');
  const [genDiff, setGenDiff] = useState('Medium');
  const [genCount, setGenCount] = useState(3);
  const [generating, setGenerating] = useState(false);

  const fetchQuestions = async () => {
    try {
      const res = await adminMechAPI.getQuestions(statusFilter || undefined);
      if (res.data && res.data.questions) {
        setQuestions(res.data.questions);
      }
    } catch (err) {
      console.error('Error fetching admin MECH questions:', err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await adminMechAPI.getAnalytics();
      if (res.data && res.data.analytics) {
        setAnalytics(res.data.analytics);
      }
    } catch (err) {
      console.error('Error fetching admin MECH analytics:', err);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([fetchQuestions(), fetchAnalytics()]);
      setLoading(false);
    };
    loadAll();
  }, [statusFilter]);

  const handleUpdateStatus = async (qId, newStatus) => {
    try {
      await adminMechAPI.updateQuestion(qId, { status: newStatus });
      setQuestions(prev => prev.map(q => q._id === qId || q.questionId === qId ? { ...q, status: newStatus } : q));
    } catch (err) {
      console.error('Failed to update question status:', err);
    }
  };

  const handleDelete = async (qId) => {
    try {
      await adminMechAPI.deleteQuestion(qId);
      setQuestions(prev => prev.filter(q => q._id !== qId && q.questionId !== qId));
    } catch (err) {
      console.error('Failed to delete question:', err);
    }
  };

  const handleBatchGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const res = await adminMechAPI.generateQuestions(genTopic, genDiff, genCount);
      if (res.data && res.data.questions) {
        setQuestions(prev => [...res.data.questions, ...prev]);
      }
    } catch (err) {
      console.error('Failed to generate batch questions:', err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-bold rounded-full border border-amber-500/20">
                Admin Control & Analytics Panel
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white">MECH AI Question Management & Analytics</h1>
          </div>

          <button
            onClick={() => { fetchQuestions(); fetchAnalytics(); }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Refresh Data
          </button>
        </div>

        {/* Business Analytics Cards */}
        {analytics && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-400" /> MECH MCQ Business Analytics
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400 uppercase font-semibold">Total Assessments</div>
                <div className="text-2xl font-black text-white mt-1">{analytics.totalMECHAssessments}</div>
              </div>

              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400 uppercase font-semibold">Average MCQ Score</div>
                <div className="text-2xl font-black text-amber-400 mt-1">{analytics.avgMCQScore}%</div>
              </div>

              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400 uppercase font-semibold">Avg Exploration Score</div>
                <div className="text-2xl font-black text-orange-400 mt-1">{analytics.avgMECHExplorationScore}%</div>
              </div>

              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400 uppercase font-semibold">Most Difficult Topic</div>
                <div className="text-base font-bold text-rose-400 mt-1 truncate">{analytics.mostDifficultTopic}</div>
              </div>
            </div>

            {/* Topic Performance Grid */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Topic-Wise Average Performance</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {Object.entries(analytics.topicPerformance || {}).map(([t, val]) => (
                  <div key={t} className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
                    <div className="text-xs text-slate-400 truncate">{t}</div>
                    <div className="text-lg font-bold text-slate-200 mt-1">{val}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Batch Question Generation Form */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" /> Batch Generate AI Questions for Review
          </h3>
          <form onSubmit={handleBatchGenerate} className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-semibold text-slate-400 mb-1">Target Topic</label>
              <select
                value={genTopic}
                onChange={e => setGenTopic(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl p-2.5 text-sm"
              >
                {[
                  "Engineering Mechanics", "Force and Motion", "Work, Energy and Power", "Friction",
                  "Simple Machines", "Gears and Gear Systems", "Pulleys", "Mechanical Advantage",
                  "Materials and Properties", "Manufacturing Basics", "Production Engineering",
                  "Thermodynamics Basics", "Heat and Temperature", "Fluid Mechanics Basics",
                  "Machine Elements", "Mechanical Design", "CAD/CAM Basics", "Automotive Engineering",
                  "Robotics and Automation", "Industrial Engineering"
                ].map((t, idx) => <option key={idx} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="w-36">
              <label className="block text-xs font-semibold text-slate-400 mb-1">Difficulty</label>
              <select
                value={genDiff}
                onChange={e => setGenDiff(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl p-2.5 text-sm"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div className="w-24">
              <label className="block text-xs font-semibold text-slate-400 mb-1">Count</label>
              <input
                type="number"
                min="1"
                max="10"
                value={genCount}
                onChange={e => setGenCount(parseInt(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl p-2.5 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={generating}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold rounded-xl text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {generating ? 'Generating...' : 'Generate Questions'} <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Filter & Questions List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Generated Question Bank ({questions.length})</h2>
            
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-slate-300 text-sm rounded-xl p-2"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="active">Active</option>
              </select>
            </div>
          </div>

          {/* Question Cards */}
          <div className="space-y-4">
            {questions.map((q, idx) => {
              const qId = q._id || q.questionId || `q_${idx}`;
              return (
                <div key={qId} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-md uppercase ${
                        q.status === 'approved' || q.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : q.status === 'rejected'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {q.status || 'pending'}
                      </span>
                      <span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded-lg border border-slate-700 font-medium">
                        {q.topic}
                      </span>
                      <span className="px-2.5 py-0.5 bg-slate-800 text-slate-400 text-xs rounded">
                        {q.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateStatus(qId, 'approved')}
                        className="px-3 py-1 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-semibold rounded-lg flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(qId, 'rejected')}
                        className="px-3 py-1 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-semibold rounded-lg flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                      <button
                        onClick={() => handleDelete(qId)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-semibold text-slate-200">{q.question}</h3>

                  {/* Options Display */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    {q.options && typeof q.options === 'object' && !Array.isArray(q.options) ? (
                      Object.entries(q.options).map(([k, v]) => (
                        <div key={k} className={`p-2.5 rounded-lg border text-xs font-mono ${
                          k === q.correctAnswer ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 font-bold' : 'bg-slate-800/60 border-slate-700/50 text-slate-300'
                        }`}>
                          <span className="mr-2 font-bold">{k}:</span> {v}
                        </div>
                      ))
                    ) : (
                      (q.options || []).map((opt, i) => (
                        <div key={i} className={`p-2.5 rounded-lg border text-xs font-mono ${
                          opt === q.correctAnswer ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 font-bold' : 'bg-slate-800/60 border-slate-700/50 text-slate-300'
                        }`}>
                          {opt}
                        </div>
                      ))
                    )}
                  </div>

                  {q.explanation && (
                    <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 text-xs text-slate-400">
                      <span className="font-semibold text-slate-300">Explanation:</span> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
