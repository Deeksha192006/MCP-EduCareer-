import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { studentAPI, artsScienceRecAPI, commerceAPI } from '../services/api';
import WrittenAssessmentModal from '../components/written/WrittenAssessmentModal';
import { 
  Compass, CheckCircle2, BookOpen, Star, AlertTriangle, 
  FileText, ArrowRight, Play, Award, HelpCircle, RefreshCw, 
  Gamepad2, CheckSquare, Sparkles, BarChart2, Coins, Palette, Cpu 
} from 'lucide-react';

const StudentRecommendations = ({ user }) => {
  const navigate = useNavigate();
  const [guidance, setGuidance] = useState(null);
  const [artsScienceRecs, setArtsScienceRecs] = useState(null);
  const [commerceRecs, setCommerceRecs] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Written Assessment Modal State
  const [activeWrittenTestKey, setActiveWrittenTestKey] = useState(null);

  const studentId = user?.id || 'student-demo-1';

  const fetchAllData = async () => {
    try {
      const [resGuidance, resAS, resComm] = await Promise.all([
        studentAPI.getRecommendations(studentId),
        artsScienceRecAPI.getRecommendations(studentId),
        commerceAPI.getRecommendations(studentId)
      ]);
      setGuidance(resGuidance.data);
      setArtsScienceRecs(resAS.data);
      setCommerceRecs(resComm.data);
    } catch (err) {
      console.error("Failed to load recommendations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [studentId]);

  const handleOpenWrittenTest = (courseKey) => {
    setActiveWrittenTestKey(courseKey);
  };

  const handleCloseWrittenTest = () => {
    setActiveWrittenTestKey(null);
    fetchAllData();
  };

  const handleGameNavigate = (courseKey) => {
    const routeMap = {
      "data-science": "/arts-science-exploration/data-science/assessment",
      "psychology": "/arts-science-exploration/psychology/assessment",
      "bba": "/arts-science-exploration/bba/assessment",
      "environmental-science": "/arts-science-exploration/environmental-science/assessment",
      "journalism": "/arts-science-exploration/journalism/assessment"
    };
    const route = routeMap[courseKey] || "/arts-science-exploration";
    navigate(route);
  };

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <RefreshCw size={36} className="spin-icon" style={{ color: 'var(--primary)', marginBottom: '16px' }} />
        <p style={{ fontSize: '16px', fontWeight: 600 }}>Generating Transparent Stream & Course Match Recommendations...</p>
      </div>
    );
  }

  const streams = guidance?.streams || [];
  const careers = guidance?.careers || [];
  const topCareer = careers[0] || {};
  const altCareers = careers.slice(1, 4);

  const completedRecs = artsScienceRecs?.completedRecommendations || [];
  const incompleteRecs = artsScienceRecs?.incompleteCourses || [];
  const formulaDesc = artsScienceRecs?.weightingFormula || "Final Course Match Score = (Game Score × 0.75) + (Written Test Score × 0.25)";

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', paddingBottom: '60px' }}>
      <Navbar 
        title="Transparent Course & Career Recommendations" 
        subtitle="75% Hands-On Simulation Aptitude + 25% Conceptual Written Assessment"
        user={user}
      />

      {/* Top Banner Academic Notice */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border-color)',
        borderLeft: '4px solid var(--primary)',
        padding: '18px 24px',
        borderRadius: 'var(--radius-md)',
        marginBottom: '32px',
        fontSize: '14px',
        color: 'var(--text-muted)',
        lineHeight: 1.6,
        boxShadow: 'var(--shadow-sm)'
      }}>
        <strong style={{ color: 'var(--text-main)' }}>Academic Course Match Notice:</strong> {artsScienceRecs?.academicDisclaimer || (
          "The course match score reflects demonstrated interest, hands-on simulation aptitude, and conceptual written test performance. It is an exploratory guidance indicator, not a guarantee of academic admission, test scores, future employment, or salary."
        )}
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: ARTS & SCIENCE COURSE MATCH RECOMMENDATIONS (75:25 SCHEME)   */}
      {/* ========================================================================= */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Palette size={18} style={{ color: 'var(--accent-purple)' }} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Arts & Science Stream Evaluation
              </span>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
              Arts & Science Course Compatibility (75:25 Scheme)
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-dim)', margin: 0 }}>
              Formula: <strong>{formulaDesc}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px', background: '#ffffff', padding: '8px 16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>
              <span style={{ color: 'var(--success)', fontWeight: 800 }}>● {completedRecs.length}</span> Evaluated
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>
              <span style={{ color: 'var(--warning)', fontWeight: 800 }}>○ {incompleteRecs.length}</span> Pending
            </div>
          </div>
        </div>

        {/* COMPLETED COURSES */}
        {completedRecs.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
            {completedRecs.map((course, idx) => {
              const gameScore = course.gameScore || 0;
              const writtenScore = course.writtenTestScore || 0;
              const finalScore = course.finalCourseMatchScore || 0;
              const gamePts = course.weightageBreakdown?.gameWeightedPoints || (gameScore * 0.75);
              const writtenPts = course.weightageBreakdown?.writtenWeightedPoints || (writtenScore * 0.25);

              return (
                <div 
                  key={course.courseKey}
                  className="card" 
                  style={{ 
                    border: idx === 0 ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    background: '#ffffff',
                    borderLeft: `5px solid ${idx === 0 ? 'var(--primary)' : 'var(--border-strong)'}`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <span style={{
                          background: idx === 0 ? 'var(--primary-light)' : 'var(--bg-main)',
                          color: idx === 0 ? 'var(--primary)' : 'var(--text-dim)',
                          padding: '3px 10px',
                          borderRadius: '9999px',
                          fontSize: '11px',
                          fontWeight: 700,
                          border: `1px solid ${idx === 0 ? 'var(--primary-border)' : 'var(--border-color)'}`
                        }}>
                          RANK #{idx + 1} RECOMMENDED
                        </span>
                        <span style={{ color: 'var(--text-dim)', fontSize: '13px', fontWeight: 600 }}>
                          {course.domain}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                        {course.courseName}
                      </h3>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                        Simulation Arcade: <strong>{course.gameName}</strong>
                      </span>
                    </div>

                    {/* Final Match Score Badge */}
                    <div style={{
                      textAlign: 'right',
                      background: 'var(--primary-light)',
                      padding: '12px 20px',
                      borderRadius: '14px',
                      border: '1px solid var(--primary-border)'
                    }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Course Match Score
                      </div>
                      <div style={{ fontSize: '36px', fontWeight: 900, color: 'var(--primary)', lineHeight: 1.1, marginTop: '2px' }}>
                        {finalScore}%
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 600 }}>
                        Verified 75:25 Composite
                      </div>
                    </div>
                  </div>

                  {/* 75% : 25% Contribution Progress Visualizer */}
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '16px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                      <span style={{ color: 'var(--primary)', fontWeight: 700 }}>
                        🎮 Game Simulation (75%): {gameScore}/100 → <strong>{gamePts.toFixed(1)} pts</strong>
                      </span>
                      <span style={{ color: 'var(--accent-purple)', fontWeight: 700 }}>
                        📝 Written Test (25%): {writtenScore}/100 → <strong>{writtenPts.toFixed(1)} pts</strong>
                      </span>
                    </div>

                    {/* Stacked Progress Bar */}
                    <div style={{ width: '100%', height: '10px', background: '#e2e8f0', borderRadius: '9999px', display: 'flex', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          width: `${(gamePts / 100) * 100}%`, 
                          background: 'var(--primary)',
                          transition: 'width 0.5s ease'
                        }} 
                      />
                      <div 
                        style={{ 
                          width: `${(writtenPts / 100) * 100}%`, 
                          background: 'var(--accent-purple)',
                          transition: 'width 0.5s ease'
                        }} 
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-dim)', marginTop: '6px' }}>
                      <span>Formula: ({gameScore} × 0.75) + ({writtenScore} × 0.25) = {finalScore}</span>
                      <span>100% Total Scale</span>
                    </div>
                  </div>

                  {/* Explanation & Strengths */}
                  <div style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    <strong style={{ color: 'var(--text-main)' }}>Why this course?</strong> {course.explanation}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
                    <div>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--success)', textTransform: 'uppercase' }}>
                        Demonstrated Strengths
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                        {course.strengths.map((s, sIdx) => (
                          <span key={sIdx} style={{ fontSize: '12px', background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid var(--success-border)', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
                            ✓ {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--warning)', textTransform: 'uppercase' }}>
                        Areas for Growth
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                        {course.improvementAreas.map((ia, iaIdx) => (
                          <span key={iaIdx} style={{ fontSize: '12px', background: 'var(--warning-bg)', color: 'var(--warning)', border: '1px solid var(--warning-border)', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
                            • {ia}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* INCOMPLETE / PENDING COURSES */}
        {incompleteRecs.length > 0 && (
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} color="var(--warning)" />
              <span>Pending Arts & Science Courses ({incompleteRecs.length} Action Items)</span>
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              {incompleteRecs.map((course) => (
                <div 
                  key={course.courseKey}
                  className="card"
                  style={{
                    padding: '20px',
                    border: '1px solid var(--border-color)',
                    borderLeft: '4px solid var(--warning)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h5 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                      {course.courseName}
                    </h5>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      background: 'var(--warning-bg)',
                      color: 'var(--warning)',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      border: '1px solid var(--warning-border)'
                    }}>
                      {course.statusCode.replace('_', ' ')}
                    </span>
                  </div>

                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: 1.5 }}>
                    {course.statusMessage}
                  </p>

                  {/* Checklist */}
                  <div style={{ display: 'flex', gap: '14px', marginBottom: '16px', fontSize: '13px' }}>
                    <div style={{ color: course.gameScore !== null ? 'var(--success)' : 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                      {course.gameScore !== null ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}
                      <span>Game (75%): {course.gameScore !== null ? `${course.gameScore}%` : 'Pending'}</span>
                    </div>

                    <div style={{ color: course.writtenTestScore !== null ? 'var(--success)' : 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                      {course.writtenTestScore !== null ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}
                      <span>Written (25%): {course.writtenTestScore !== null ? `${course.writtenTestScore}%` : 'Pending'}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {course.gameScore === null && (
                      <button
                        onClick={() => handleGameNavigate(course.courseKey)}
                        className="btn btn-outline"
                        style={{ padding: '8px 14px', fontSize: '13px' }}
                      >
                        <Play size={14} />
                        <span>Play {course.gameName}</span>
                      </button>
                    )}

                    {course.writtenTestScore === null && (
                      <button
                        onClick={() => handleOpenWrittenTest(course.courseKey)}
                        className="btn btn-primary"
                        style={{ padding: '8px 14px', fontSize: '13px' }}
                      >
                        <BookOpen size={14} />
                        <span>Take Written Test</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: COMMERCE & ACCOUNTING COURSE MATCH RECOMMENDATIONS (75:25)     */}
      {/* ========================================================================= */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Coins size={18} style={{ color: 'var(--accent)' }} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Commerce & Accounting Stream Evaluation
              </span>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
              Commerce & Accounting Course Compatibility (75:25 Scheme)
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-dim)', margin: 0 }}>
              Calculated using: <strong>Final Course Match Score = (Game Score × 0.75) + (Written Test Score × 0.25)</strong>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px', background: '#ffffff', padding: '8px 16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>
              <span style={{ color: 'var(--success)', fontWeight: 800 }}>● {commerceRecs?.completedCount || 0}</span> Evaluated
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>
              <span style={{ color: 'var(--warning)', fontWeight: 800 }}>○ {(commerceRecs?.totalCourses || 5) - (commerceRecs?.completedCount || 0)}</span> Pending
            </div>
          </div>
        </div>

        {/* List of Commerce Courses */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {(commerceRecs?.allCourses || []).map((course) => {
            const hasFinalScore = course.finalMatchScore !== null;
            const gameScore = course.gameScore !== null ? course.gameScore : 'Pending';
            const writtenScore = course.writtenScore !== null ? course.writtenScore : 'Pending';
            const gamePts = course.gameScore !== null ? (course.gameScore * 0.75) : 0;
            const writtenPts = course.writtenScore !== null ? (course.writtenScore * 0.25) : 0;

            const commRouteMap = {
              "bcom-accfinance": "/commerce-exploration/finance-master",
              "bcom-bankins": "/commerce-exploration/banking-quest",
              "bcom-tax": "/commerce-exploration/tax-detective",
              "bcom-corpsec": "/commerce-exploration/corporate-decision",
              "bba-tycoon": "/commerce-exploration/business-tycoon"
            };

            return (
              <div
                key={course.courseKey}
                className="card"
                style={{
                  border: hasFinalScore ? '2px solid var(--accent)' : '1px solid var(--border-color)',
                  background: '#ffffff',
                  borderLeft: `5px solid ${hasFinalScore ? 'var(--accent)' : 'var(--warning)'}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase' }}>
                        {course.domain}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                      {course.courseName}
                    </h3>
                  </div>

                  {hasFinalScore ? (
                    <div style={{
                      textAlign: 'right',
                      background: 'var(--accent-light)',
                      padding: '12px 20px',
                      borderRadius: '14px',
                      border: '1px solid #99f6e4'
                    }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase' }}>
                        Course Match
                      </div>
                      <div style={{ fontSize: '34px', fontWeight: 900, color: 'var(--accent)', lineHeight: 1.1 }}>
                        {course.finalMatchScore}%
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 600 }}>
                        75:25 Weighted
                      </div>
                    </div>
                  ) : (
                    <div style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      background: 'var(--warning-bg)',
                      border: '1px solid var(--warning-border)',
                      color: 'var(--warning)',
                      fontSize: '12px',
                      fontWeight: 700
                    }}>
                      Incomplete Evaluation
                    </div>
                  )}
                </div>

                {/* Score Progress Bar */}
                <div style={{ background: '#f8fafc', padding: '14px 18px', borderRadius: '12px', marginBottom: '16px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ color: 'var(--accent)', fontWeight: 700 }}>
                      🎮 Game (75%): {course.gameScore !== null ? `${course.gameScore}/100 → ${gamePts.toFixed(1)} pts` : 'Pending completion'}
                    </span>
                    <span style={{ color: 'var(--secondary)', fontWeight: 700 }}>
                      📝 Written (25%): {course.writtenScore !== null ? `${course.writtenScore}/100 → ${writtenPts.toFixed(1)} pts` : 'Pending completion'}
                    </span>
                  </div>

                  {hasFinalScore ? (
                    <div style={{ width: '100%', height: '10px', background: '#e2e8f0', borderRadius: '9999px', display: 'flex', overflow: 'hidden' }}>
                      <div style={{ width: `${(gamePts / 100) * 100}%`, background: 'var(--accent)' }} />
                      <div style={{ width: `${(writtenPts / 100) * 100}%`, background: 'var(--secondary)' }} />
                    </div>
                  ) : (
                    <div style={{ fontSize: '13px', color: 'var(--text-dim)', fontWeight: 500 }}>
                      ℹ️ A final match score is calculated once both the simulation game and written assessment are completed.
                    </div>
                  )}
                </div>

                {/* Explanation */}
                <div style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '16px' }}>
                  {course.explanation}
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {course.gameScore === null && (
                    <button
                      onClick={() => navigate(commRouteMap[course.courseKey] || '/commerce-exploration')}
                      className="btn btn-outline"
                      style={{ padding: '8px 16px', fontSize: '13px' }}
                    >
                      <Play size={14} />
                      <span>Play Simulation Game (75%)</span>
                    </button>
                  )}

                  {course.writtenScore === null && (
                    <button
                      onClick={() => handleOpenWrittenTest(course.courseKey)}
                      className="btn btn-primary"
                      style={{ padding: '8px 16px', fontSize: '13px', background: 'var(--accent)' }}
                    >
                      <BookOpen size={14} />
                      <span>Take Written Test (25%)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 3: PRIMARY CAREER PATH & MINDSET PROFILE                         */}
      {/* ========================================================================= */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '32px' }}>
        <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '16px' }}>
          Overall Career & Mindset Profile
        </h3>

        {/* Primary Recommended Career Card */}
        <div className="card" style={{ borderLeft: '5px solid var(--primary)', background: '#ffffff', marginBottom: '32px' }}>
          
          {/* Mindset Profile Badges */}
          {topCareer.detected_mindset_tags?.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {topCareer.detected_mindset_tags.map((tag, idx) => (
                <span key={idx} style={{
                  background: 'var(--primary-light)',
                  border: '1px solid var(--primary-border)',
                  color: 'var(--primary)',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 700
                }}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            <div>
              <div style={{ textTransform: 'uppercase', fontSize: '12px', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.05em' }}>
                PRIMARY CAREER RECOMMENDATION
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                {topCareer.title}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginTop: '4px', lineHeight: 1.5 }}>
                {topCareer.description}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--success)', fontFamily: 'Outfit' }}>
                {topCareer.match_score}%
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-dim)', fontWeight: 600 }}>Match Confidence</div>
            </div>
          </div>

          {/* Feature Contribution Explanation Block */}
          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: 'var(--radius-md)', marginBottom: '24px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Compass size={18} color="var(--primary)" />
              <span>Feature Contribution Attribution</span>
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '16px' }}>
              {topCareer.feature_contributions?.map((feat, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-main)' }}>
                  <CheckCircle2 size={16} color="var(--success)" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '12px', lineHeight: 1.5 }}>
              <strong style={{ color: 'var(--text-main)' }}>Summary Justification:</strong> {topCareer.explanation}
            </div>
          </div>

          {/* 10th Standard Stream Options */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {streams.map((st, idx) => (
              <div key={idx} style={{ background: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', borderLeft: `4px solid ${idx === 0 ? 'var(--primary)' : 'var(--border-strong)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <h5 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>{st.title}</h5>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary)' }}>{st.match_score}%</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>{st.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WRITTEN ASSESSMENT MODAL */}
      {activeWrittenTestKey && (
        <WrittenAssessmentModal
          courseKey={activeWrittenTestKey}
          studentId={studentId}
          onClose={handleCloseWrittenTest}
          onComplete={handleCloseWrittenTest}
        />
      )}
    </div>
  );
};

export default StudentRecommendations;
