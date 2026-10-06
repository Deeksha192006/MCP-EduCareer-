import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Cpu, Radio, Zap, BrainCircuit, Wrench, ArrowRight, Sparkles, 
  Gamepad2, CheckCircle2, Flame, Play, Trophy, ShieldCheck 
} from 'lucide-react';

const EngineeringExplorationLanding = ({ user }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('ALL');

  const departments = [
    {
      id: 'cse',
      code: 'CSE',
      title: 'Computer Science & Engineering',
      description: 'Master logic games: XOR Gate, River Crossing, Water Jug, Missionaries & Cannibals, and Tower of Hanoi.',
      icon: Cpu,
      active: true,
      path: '/engineering-exploration/cse',
      color: '#1e40af',
      skills: ['Logical Thinking', 'Problem Solving', 'Algorithmic Thinking', 'Planning', 'Constraint Reasoning'],
      gamesCount: '5 Interactive Games',
      badge: '🔥 High Demand'
    },
    {
      id: 'aids',
      code: 'AI & DS',
      title: 'Artificial Intelligence & Data Science',
      description: 'Explore data mystery games, anomaly detection, pattern predictions, and real-world ML dataset thinking.',
      icon: BrainCircuit,
      active: true,
      path: '/engineering-exploration/aids',
      color: '#6d28d9',
      skills: ['Data Interpretation', 'Pattern Recognition', 'Prediction Ability', 'Analytical Thinking'],
      gamesCount: 'Data Detective Game',
      badge: '🚀 Emerging Tech'
    },
    {
      id: 'ece',
      code: 'ECE',
      title: 'Electronics & Communication',
      description: 'Interactive circuit breadboard simulators, signal decoding, digital logic gates, and hardware microprocessors.',
      icon: Radio,
      active: true,
      path: '/engineering-exploration/ece',
      color: '#0284c7',
      skills: ['Circuit Reasoning', 'Signal Processing', 'Digital Logic', 'Technical Hardware'],
      gamesCount: 'Circuit Lab Game',
      badge: '⚡ Hardware & Telecom'
    },
    {
      id: 'eee',
      code: 'EEE',
      title: 'Electrical & Electronics',
      description: 'Power grid balancing, renewable energy management, smart grid challenges, and electrical circuit puzzles.',
      icon: Zap,
      active: true,
      path: '/engineering-exploration/eee',
      color: '#b45309',
      skills: ['Electrical Reasoning', 'Energy Management', 'Smart Grid Intuition', 'Numerical Aptitude'],
      gamesCount: 'Power Grid Game',
      badge: '🔋 EV & Energy'
    },
    {
      id: 'mech',
      code: 'MECH',
      title: 'Mechanical Engineering',
      description: 'Gear ratio physics, lever balances, thermodynamic intuition, robotics mechanisms, and interactive physics puzzles.',
      icon: Wrench,
      active: true,
      path: '/engineering/mech',
      color: '#0f766e',
      skills: ['Spatial Reasoning', 'Mechanical Intuition', 'Robotics', 'Practical Problem Solving'],
      gamesCount: 'Physics Simulator',
      badge: '🤖 Robotics & Design'
    }
  ];

  const filteredDepts = departments.filter(d => {
    if (filter === 'ALL') return true;
    if (filter === 'SOFTWARE' && (d.code === 'CSE' || d.code === 'AI & DS')) return true;
    if (filter === 'HARDWARE' && (d.code === 'ECE' || d.code === 'EEE' || d.code === 'MECH')) return true;
    return false;
  });

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* Hero Header */}
      <div className="banner-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'var(--primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <Gamepad2 size={26} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Interactive Aptitude Arcade for 12th Graduates
            </span>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
              Engineering Department Exploration Hub
            </h1>
          </div>
        </div>

        <p className="banner-subtitle">
          Don't pick an engineering stream based on hearsay! Test your hands-on problem-solving, logic patterns, and analytical intuition through interactive mini-games and scenario simulations.
        </p>
      </div>

      {/* Department Filter Pills */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setFilter('ALL')} 
            className={`pill-btn ${filter === 'ALL' ? 'active' : ''}`}
          >
            All Departments ({departments.length})
          </button>
          <button 
            onClick={() => setFilter('SOFTWARE')} 
            className={`pill-btn ${filter === 'SOFTWARE' ? 'active' : ''}`}
          >
            Software & AI Streams
          </button>
          <button 
            onClick={() => setFilter('HARDWARE')} 
            className={`pill-btn ${filter === 'HARDWARE' ? 'active' : ''}`}
          >
            Electronics & Core Engineering
          </button>
        </div>

        <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>
          💡 Complete any module to update your Stream Compatibility Score!
        </span>
      </div>

      {/* Grid of Department Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
        {filteredDepts.map((dept) => {
          const IconComp = dept.icon;
          return (
            <div
              key={dept.id}
              className="course-card"
              style={{
                borderTop: `4px solid ${dept.color}`
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: `${dept.color}15`,
                    border: `1px solid ${dept.color}35`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: dept.color
                  }}>
                    <IconComp size={24} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      background: `${dept.color}15`,
                      color: dept.color,
                      border: `1px solid ${dept.color}30`
                    }}>
                      {dept.badge}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontWeight: 600 }}>
                      {dept.gamesCount}
                    </span>
                  </div>
                </div>

                <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                  {dept.title} ({dept.code})
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6, marginBottom: '18px' }}>
                  {dept.description}
                </p>

                {dept.skills && (
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Key Aptitudes Assessed
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {dept.skills.map((s, idx) => (
                        <span key={idx} style={{
                          fontSize: '12px',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          background: '#f8fafc',
                          color: 'var(--text-muted)',
                          border: '1px solid var(--border-color)',
                          fontWeight: 600
                        }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                {dept.active ? (
                  <button
                    onClick={() => navigate(dept.path)}
                    className="btn btn-primary"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      padding: '12px',
                      fontWeight: 700,
                      fontSize: '14px',
                      background: dept.color,
                      border: 'none',
                      borderRadius: '10px'
                    }}
                  >
                    <Play size={16} />
                    <span>Launch {dept.code} Module</span>
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    disabled
                    className="btn btn-outline"
                    style={{ width: '100%', justifyContent: 'center', opacity: 0.6, cursor: 'not-allowed', borderRadius: '10px' }}
                  >
                    <span>Module In Development</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EngineeringExplorationLanding;
