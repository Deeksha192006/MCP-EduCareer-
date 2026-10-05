import React, { useState, useEffect } from 'react';
import { teacherAPI, counsellorAPI, studentAPI } from '../services/api';
import { UserCheck, CheckCircle2, AlertCircle, MessageSquare, Send, RefreshCw, User } from 'lucide-react';

const CounsellorDashboard = ({ user }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentGuidance, setStudentGuidance] = useState(null);
  const [reviewStatus, setReviewStatus] = useState('Approved');
  const [comments, setComments] = useState('');
  const [suggestedCourses, setSuggestedCourses] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await teacherAPI.getStudents();
      setStudents(res.data);
      if (res.data.length > 0) {
        handleSelectStudent(res.data[0]);
      }
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStudent = async (student) => {
    setSelectedStudent(student);
    setSubmitSuccess(false);
    try {
      const gRes = await studentAPI.get12thGuidance(student.id || student._id);
      setStudentGuidance(gRes.data);

      const rRes = await counsellorAPI.getReview(student.id || student._id);
      if (rRes.data) {
        setReviewStatus(rRes.data.status || 'Approved');
        setComments(rRes.data.comments || '');
        setSuggestedCourses((rRes.data.suggested_courses || []).join(', '));
      }
    } catch (err) {
      console.error("Error loading student guidance:", err);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return;
    setSubmitting(true);
    try {
      await counsellorAPI.submitReview({
        student_id: selectedStudent.id || selectedStudent._id,
        status: reviewStatus,
        comments: comments,
        suggested_courses: suggestedCourses ? suggestedCourses.split(',').map(s => s.trim()) : []
      });
      setSubmitSuccess(true);
    } catch (err) {
      console.error("Error submitting review:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <RefreshCw className="animate-spin" size={32} style={{ color: 'var(--primary)' }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div className="banner-header">
        <div className="banner-title-row">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>
              <UserCheck size={16} />
              <span>Counsellor Human-in-the-Loop Validation Portal</span>
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff' }}>Counsellor Review & Feedback Workspace</h1>
            <p className="banner-subtitle">Review AI-generated 12th recommendations, add counsellor comments, suggest alternative pathways, and validate student decisions.</p>
          </div>
        </div>
      </div>

      <div className="two-col-grid" style={{ gridTemplateColumns: '1fr 2fr' }}>
        
        {/* Left: Student Directory */}
        <div>
          <span className="metric-label" style={{ display: 'block', marginBottom: '12px' }}>Student Directory ({students.length})</span>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '70vh', overflowY: 'auto' }}>
            {students.map((st, idx) => {
              const isSelected = selectedStudent && (selectedStudent.id === st.id || selectedStudent._id === st._id);
              return (
                <div
                  key={idx}
                  onClick={() => handleSelectStudent(st)}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'var(--bg-card)',
                    border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="user-avatar" style={{ width: '36px', height: '36px', fontSize: '14px' }}>
                      {st.name?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>{st.name}</h4>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Class {st.grade || 12} • {st.email}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Student Guidance & Review Form */}
        <div>
          {selectedStudent && studentGuidance ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Guidance Overview */}
              <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div>
                    <span className="metric-label">Assessed Guidance Profile</span>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>{selectedStudent.name}</h3>
                  </div>

                  <span className="badge badge-high-performer" style={{ fontSize: '13px' }}>
                    Match: {studentGuidance.primary_recommendation?.match_score}%
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: 'rgba(17, 24, 39, 0.6)', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: '14px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Top Recommended Course:</span>
                    <strong style={{ fontSize: '14px', color: '#ffffff' }}>{studentGuidance.primary_recommendation?.course}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Top Target Career:</span>
                    <strong style={{ fontSize: '14px', color: '#a5b4fc' }}>{studentGuidance.primary_recommendation?.career}</strong>
                  </div>
                </div>

                {/* NLP Analysis */}
                <div style={{ background: 'rgba(17, 24, 39, 0.4)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#fbbf24', display: 'block', marginBottom: '4px' }}>Extracted NLP Mindset Summary:</span>
                  <p style={{ fontSize: '12px', color: 'var(--text-main)' }}>
                    Primary Domain: <strong style={{ color: '#ffffff' }}>{studentGuidance.nlp_analysis?.career_intent?.primary_domain}</strong>
                  </p>
                  {studentGuidance.nlp_analysis?.summary_bullets?.map((b, bIdx) => (
                    <p key={bIdx} style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>• {b}</p>
                  ))}
                </div>
              </div>

              {/* Review Form */}
              <form onSubmit={handleSubmitReview} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageSquare size={18} style={{ color: 'var(--primary)' }} />
                  Counsellor Validation & Feedback Form
                </h3>

                {submitSuccess && (
                  <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: 'var(--radius-md)', color: '#34d399', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} />
                    Counsellor review saved successfully!
                  </div>
                )}

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Validation Status</label>
                  <select
                    value={reviewStatus}
                    onChange={(e) => setReviewStatus(e.target.value)}
                    className="form-select"
                  >
                    <option value="Approved">Approved — AI Recommendation Verified</option>
                    <option value="Needs Review">Needs Review — Follow-up Counselling Needed</option>
                    <option value="Suggested Alternative">Suggested Alternative Course</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Counsellor Comments & Rationale</label>
                  <textarea
                    rows={3}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Enter detailed counselling notes..."
                    className="form-input"
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Suggested Alternative Courses (Comma separated)</label>
                  <input
                    type="text"
                    value={suggestedCourses}
                    onChange={(e) => setSuggestedCourses(e.target.value)}
                    placeholder="e.g. B.Sc Data Science, BCA"
                    className="form-input"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ justifyContent: 'center', padding: '12px 24px' }}
                >
                  <Send size={16} />
                  {submitting ? 'Saving Review...' : 'Submit Counsellor Validation'}
                </button>
              </form>

            </div>
          ) : (
            <div className="glass-card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '240px', color: 'var(--text-muted)', fontSize: '14px' }}>
              Select a student from the directory to review guidance.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default CounsellorDashboard;
