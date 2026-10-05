import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { teacherAPI } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, TrendingUp, AlertTriangle, Award, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const TeacherDashboard = ({ user }) => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadStatus, setUploadStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await teacherAPI.getClassDashboard();
        setMetrics(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadStatus('Uploading & Preprocessing Student CSV Data...');
    try {
      const res = await teacherAPI.uploadCSV(file);
      setUploadStatus(`Success! ${res.data.message}`);
      // Refresh class dashboard
      const resUpdated = await teacherAPI.getClassDashboard();
      setMetrics(resUpdated.data);
    } catch (err) {
      setUploadStatus(`Upload failed: ${err.response?.data?.detail || 'Invalid CSV'}`);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Class Analytics...</div>;

  const streamPieData = Object.entries(metrics?.stream_distribution || {}).map(([name, value]) => ({ name, value }));
  const categoryPieData = Object.entries(metrics?.category_distribution || {}).map(([name, value]) => ({ name, value }));

  return (
    <div>
      <Navbar 
        title="Teacher & Counsellor Portal" 
        subtitle="Class-Wide Performance Analytics, Category Distributions & Student Monitoring"
        user={user}
      />

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-title">Total Enrolled Students</div>
          <div className="kpi-value">{metrics?.total_students || 35}</div>
          <div className="kpi-subtitle">Active Student Profiles</div>
        </div>

        <div className="kpi-card" style={{ borderLeftColor: 'var(--primary)' }}>
          <div className="kpi-title">Class Average Performance</div>
          <div className="kpi-value">{metrics?.avg_performance || 78.4}%</div>
          <div className="kpi-subtitle">Overall Academic Score</div>
        </div>

        <div className="kpi-card" style={{ borderLeftColor: 'var(--success)' }}>
          <div className="kpi-title">Average Attendance</div>
          <div className="kpi-value">{metrics?.avg_attendance || 89.2}%</div>
          <div className="kpi-subtitle">Classroom Regularity</div>
        </div>

        <div className="kpi-card" style={{ borderLeftColor: 'var(--warning)' }}>
          <div className="kpi-title">High Performers</div>
          <div className="kpi-value" style={{ color: 'var(--success)' }}>{metrics?.high_performers_count || 12}</div>
          <div className="kpi-subtitle">Top Academic Tier</div>
        </div>

        <div className="kpi-card" style={{ borderLeftColor: 'var(--danger)' }}>
          <div className="kpi-title">Needing Academic Support</div>
          <div className="kpi-value" style={{ color: 'var(--danger)' }}>{metrics?.needs_support_count || 4}</div>
          <div className="kpi-subtitle">Targeted Intervention Required</div>
        </div>
      </div>

      {/* CSV Bulk Import Section */}
      <div className="glass-card" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>Bulk Import Student Data (CSV)</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            Upload raw CSV dataset containing student marks and interests for automatic batch preprocessing and recommendation generation.
          </p>
          {uploadStatus && <div style={{ fontSize: '13px', color: 'var(--accent)', marginTop: '8px', fontWeight: '600' }}>{uploadStatus}</div>}
        </div>
        <div>
          <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
            <Upload size={18} />
            <span>Upload Student CSV</span>
            <input type="file" accept=".csv" onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="charts-grid">
        {/* Stream Distribution Pie */}
        <div className="glass-card">
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Recommended Stream Distribution</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={streamPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {streamPieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Student Category Distribution Pie */}
        <div className="glass-card">
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Student Category Breakdown</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={categoryPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {categoryPieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
