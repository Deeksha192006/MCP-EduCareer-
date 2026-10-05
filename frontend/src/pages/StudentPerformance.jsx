import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { studentAPI } from '../services/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, CheckCircle, AlertTriangle, Activity } from 'lucide-react';

const StudentPerformance = ({ user }) => {
  const [guidance, setGuidance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerf = async () => {
      try {
        const studentId = user?.id || 'student-demo-1';
        const res = await studentAPI.getDashboard(studentId);
        setGuidance(res.data?.guidance);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPerf();
  }, [user]);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading performance metrics...</div>;

  const perf = guidance?.predicted_performance || {};
  const strengths = perf.strengths || [];
  const improvements = perf.improvement_areas || [];

  const trendData = [
    { period: 'First Period (G1)', mark: 85 },
    { period: 'Second Period (G2)', mark: 89 },
    { period: 'Predicted Final (G3)', mark: perf.predicted_grade || 88.5 },
  ];

  return (
    <div>
      <Navbar 
        title="Detailed Academic Performance Analysis" 
        subtitle="Historical Grade Trajectory, Strengths & Personalized Improvement Guidance"
        user={user}
      />

      <div className="glass-card" style={{ marginBottom: '28px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Grade Trajectory Trend</h3>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <LineChart data={trendData}>
              <XAxis dataKey="period" stroke="#9ca3af" />
              <YAxis domain={[0, 100]} stroke="#9ca3af" />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155' }} />
              <Line type="monotone" dataKey="mark" stroke="#10b981" strokeWidth={3} dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="glass-card" style={{ borderLeft: '4px solid var(--success)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={20} />
            <span>Identified Key Strengths</span>
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {strengths.map((str, idx) => (
              <li key={idx} style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', fontSize: '14px', color: '#34d399' }}>
                ✓ {str}
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card" style={{ borderLeft: '4px solid var(--warning)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={20} />
            <span>Targeted Areas for Improvement</span>
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {improvements.map((imp, idx) => (
              <li key={idx} style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', fontSize: '14px', color: '#fbbf24' }}>
                ⚡ {imp}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentPerformance;
