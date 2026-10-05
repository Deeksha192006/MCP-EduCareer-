import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { teacherAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, Filter, FileText } from 'lucide-react';

const TeacherStudents = ({ user }) => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await teacherAPI.getStudents();
        setStudents(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(st => {
    const matchesSearch = st.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          st.school?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = filterCategory === 'ALL' || st.category?.title === filterCategory || st.category?.key === filterCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div>
      <Navbar title="Student Directory & Analytics" subtitle="Search, Filter & Review Student Guidance Profiles" user={user} />

      {/* Search & Filter Controls */}
      <div className="glass-card" style={{ marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative', minWidth: '240px' }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search student by name or school..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '40px' }}
          />
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={18} color="var(--text-muted)" />
          <select 
            className="form-select" 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{ width: '220px' }}
          >
            <option value="ALL">All Categories</option>
            <option value="High Performer">High Performer</option>
            <option value="Consistent Learner">Consistent Learner</option>
            <option value="Potential Performer">Potential Performer</option>
            <option value="Needs Academic Support">Needs Academic Support</option>
            <option value="Multi-Talented">Multi-Talented</option>
          </select>
        </div>
      </div>

      {/* Student List Table */}
      <div className="glass-card">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Overall Mark</th>
              <th>Attendance</th>
              <th>Assessed Category</th>
              <th>Recommended Stream</th>
              <th>Recommended Career</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((st) => (
              <tr key={st.id || st._id}>
                <td>
                  <div style={{ fontWeight: '600', color: 'white' }}>{st.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{st.email}</div>
                </td>
                <td><b>{st.academic?.overall_percentage}%</b></td>
                <td>{st.academic?.attendance_percentage}%</td>
                <td>
                  <span className="badge badge-consistent" style={{ fontSize: '11px' }}>
                    {st.category?.title || 'High Performer'}
                  </span>
                </td>
                <td>{st.top_stream || 'Computer Science'}</td>
                <td><b>{st.top_career || 'Software Developer'}</b></td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => navigate(`/teacher/student/${st.id || st._id}`)} 
                      className="btn btn-outline" 
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                    >
                      <Eye size={14} />
                      <span>Review Profile</span>
                    </button>
                    <a 
                      href={`http://localhost:8000/api/reports/export/${st.id || st._id}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="btn btn-outline" 
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                    >
                      <FileText size={14} />
                      <span>PDF</span>
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherStudents;
