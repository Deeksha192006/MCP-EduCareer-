import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { studentAPI } from '../services/api';
import { User, Mail, School, BookOpen, Award } from 'lucide-react';

const StudentProfile = ({ user }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProf = async () => {
      try {
        const studentId = user?.id || 'student-demo-1';
        const res = await studentAPI.getProfile(studentId);
        setProfile(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProf();
  }, [user]);

  const st = profile || {
    name: "Arun Kumar",
    email: "arun@student.edu",
    grade: 10,
    school: "Gabriel Pereira High School",
    academic: { math: 92, science: 89, english: 78, overall_percentage: 86.3, attendance_percentage: 94 },
    skills: { problem_solving: 9, logical_thinking: 9, communication: 7, creativity: 6, leadership: 8 },
    interests: { technology: 10, medicine: 6, business: 7, arts: 4 }
  };

  return (
    <div>
      <Navbar title="Student Profile Details" subtitle="Personal Academic & Assessment Records" user={user} />

      <div className="glass-card" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>Personal Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Student Name</div>
            <div style={{ fontSize: '16px', fontWeight: '700', marginTop: '4px' }}>{st.name}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Email Address</div>
            <div style={{ fontSize: '16px', fontWeight: '700', marginTop: '4px' }}>{st.email}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Current Standard / Grade</div>
            <div style={{ fontSize: '16px', fontWeight: '700', marginTop: '4px' }}>Grade {st.grade}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>School</div>
            <div style={{ fontSize: '16px', fontWeight: '700', marginTop: '4px' }}>{st.school}</div>
          </div>
        </div>
      </div>

      <div className="glass-card">
        <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>Academic Summary</h3>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Mathematics</th>
              <th>Science</th>
              <th>English</th>
              <th>Overall Mark</th>
              <th>Attendance Rate</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{st.academic?.math}%</td>
              <td>{st.academic?.science}%</td>
              <td>{st.academic?.english}%</td>
              <td><b>{st.academic?.overall_percentage}%</b></td>
              <td>{st.academic?.attendance_percentage}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentProfile;
