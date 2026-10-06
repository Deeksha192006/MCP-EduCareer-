import React, { useState, useEffect } from 'react';
import { studentAPI, coursesAPI } from '../services/api';
import { Columns, Check, BookOpen, Target, Sparkles, RefreshCw, Award } from 'lucide-react';

const CourseCompare = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assessmentGuidance, setAssessmentGuidance] = useState(null);

  const studentId = user?.id || 'student-demo-1';

  useEffect(() => {
    loadAssessmentAndCourses();
  }, [studentId]);

  const loadAssessmentAndCourses = async () => {
    setLoading(true);
    try {
      // 1. Fetch complete course catalog
      const catalogRes = await coursesAPI.getCourses();
      setCourses(catalogRes.data);

      // 2. Fetch student's 12th guidance recommendations generated from their submitted assessment
      const guidanceRes = await studentAPI.get12thGuidance(studentId);
      setAssessmentGuidance(guidanceRes.data);

      // 3. Automatically select the top 3 recommended courses from their assessment
      const topRecommended = (guidanceRes.data.top_courses || []).slice(0, 3).map(c => c.course);
      
      let initialSelection = topRecommended;
      if (initialSelection.length === 0 && catalogRes.data.length >= 3) {
        initialSelection = [catalogRes.data[0].course_name, catalogRes.data[1].course_name, catalogRes.data[2].course_name];
      }

      setSelectedCourses(initialSelection);
      if (initialSelection.length > 0) {
        await runComparison(initialSelection);
      }
    } catch (err) {
      console.error("Error loading comparison data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCourse = (courseName) => {
    let updated;
    if (selectedCourses.includes(courseName)) {
      updated = selectedCourses.filter((c) => c !== courseName);
    } else {
      if (selectedCourses.length >= 3) return; // Limit to max 3 courses
      updated = [...selectedCourses, courseName];
    }
    setSelectedCourses(updated);
    if (updated.length > 0) {
      runComparison(updated);
    } else {
      setComparisonResult(null);
    }
  };

  const runComparison = async (courseNames) => {
    setLoading(true);
    try {
      const res = await studentAPI.compareCourses(studentId, courseNames);
      setComparisonResult(res.data);
    } catch (err) {
      console.error("Error running course comparison:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div className="banner-header">
        <div className="banner-title-row">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>
              <Sparkles size={16} />
              <span>Assessment-Driven Course Comparison Tool</span>
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-main)' }}>Side-by-Side Recommended Degree Course Comparison</h1>
            <p className="banner-subtitle">
              Comparing top degree courses generated directly from your submitted 12th standard academic & mindset assessment.
            </p>
          </div>

          {assessmentGuidance?.primary_recommendation && (
            <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-md)', padding: '12px 18px', textAlign: 'right' }}>
              <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700, textTransform: 'uppercase' }}>Top Assessment Match</span>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
                {assessmentGuidance.primary_recommendation.course}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selector Pills */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span className="metric-label">Comparing Top Courses from Your Assessment (Select up to 3):</span>
          <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600 }}>{selectedCourses.length} / 3 Selected</span>
        </div>

        <div className="pills-group">
          {courses.map((c, idx) => {
            const isSelected = selectedCourses.includes(c.course_name);
            return (
              <button
                key={idx}
                onClick={() => handleToggleCourse(c.course_name)}
                className={`pill-btn ${isSelected ? 'active' : ''}`}
              >
                {isSelected && <Check size={12} />}
                {c.course_name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
          <RefreshCw className="animate-spin" size={32} style={{ color: 'var(--primary)' }} />
        </div>
      ) : comparisonResult && comparisonResult.compared_courses ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {comparisonResult.compared_courses.map((c, idx) => (
            <div key={idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span className="badge badge-consistent" style={{ marginBottom: '6px' }}>Rank #{idx + 1} • {c.degree_type}</span>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>{c.course}</h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{c.domain}</span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div className="match-score-big">{c.match_score}%</div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>Assessment Match</span>
                </div>
              </div>

              {/* Match Breakdown Matrix */}
              <div style={{ background: 'rgba(17, 24, 39, 0.6)', padding: '14px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', marginBottom: '2px' }}>Assessment Transparency Breakdown:</span>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Academic Match</span><strong style={{ color: 'var(--success)' }}>{c.transparency_breakdown?.academic_match}%</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Interest Match</span><strong style={{ color: 'var(--success)' }}>{c.transparency_breakdown?.interest_match}%</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Skill Match</span><strong style={{ color: 'var(--success)' }}>{c.transparency_breakdown?.skill_match}%</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>NLP Intent Match</span><strong style={{ color: 'var(--primary)' }}>{c.transparency_breakdown?.nlp_intent_match}%</strong></div>
              </div>

              {/* Career Outcomes */}
              <div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>Career Outcomes:</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {c.career_paths?.map((cp, cpIdx) => (
                    <span key={cpIdx} style={{ fontSize: '11px', padding: '4px 8px', background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '6px' }}>
                      {cp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Why Match Points */}
              <div className="why-match-box">
                <div className="why-match-title">Key Match Strengths:</div>
                {c.why_matches?.map((wm, wIdx) => (
                  <p key={wIdx} className="why-match-point">{wm}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}

    </div>
  );
};

export default CourseCompare;
