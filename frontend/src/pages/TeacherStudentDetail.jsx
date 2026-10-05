import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { studentAPI } from '../services/api';
import { Compass, CheckCircle2, ArrowLeft, FileText } from 'lucide-react';

const TeacherStudentDetail = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const res = await studentAPI.getDashboard(id);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentData();
  }, [id]);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading student detailed guidance...</div>;

  const st = data?.student || {};
  const guidance = data?.guidance || {};
  const topCareer = guidance?.careers?.[0] || {};

  return (
    <div>
      <Navbar title={`Counsellor Review: ${st.name || 'Student'}`} subtitle="Individual Performance Breakdown & Recommendation Audit" user={user} />

      <button onClick={() => navigate('/teacher/students')} className="btn btn-outline" style={{ marginBottom: '20px' }}>
        <ArrowLeft size={16} />
        <span>Back to Student Directory</span>
      </button>

      <div className="glass-card" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>{st.name}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', fontSize: '13px' }}>
          <div>Email: <b>{st.email}</b></div>
          <div>Grade: <b>Grade {st.grade}</b></div>
          <div>School: <b>{st.school}</b></div>
          <div>Overall Mark: <b>{st.academic?.overall_percentage}%</b></div>
          <div>Attendance: <b>{st.academic?.attendance_percentage}%</b></div>
        </div>
      </div>

      {/* Career Guidance Summary */}
      <div className="glass-card" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--primary)', marginBottom: '12px' }}>
          Top Career Recommendation: {topCareer.title} ({topCareer.match_score}% Match)
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>{topCareer.description}</p>
        <div style={{ background: 'rgba(17, 24, 39, 0.8)', padding: '16px', borderRadius: 'var(--radius-md)', fontSize: '13px' }}>
          <b>Explanation / Justification:</b> {topCareer.explanation}
        </div>
      </div>
    </div>
  );
};

export default TeacherStudentDetail;
