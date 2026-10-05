import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { studentAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, Save, AlertCircle, Sparkles, BookOpen, Layers, MessageSquare } from 'lucide-react';

const StudentAssessment = ({ user }) => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Form State
  const [grade, setGrade] = useState(user?.grade || 12);
  const [math, setMath] = useState(88);
  const [science, setScience] = useState(85);
  const [english, setEnglish] = useState(82);
  const [physics, setPhysics] = useState(86);
  const [chemistry, setChemistry] = useState(84);
  const [biology, setBiology] = useState(70);
  const [computerScience, setComputerScience] = useState(92);
  const [accountancy, setAccountancy] = useState(65);
  const [economics, setEconomics] = useState(70);
  const [businessStudies, setBusinessStudies] = useState(68);
  const [attendance, setAttendance] = useState(94);

  // Skill Ratings (1-10)
  const [problemSolving, setProblemSolving] = useState(9);
  const [logicalThinking, setLogicalThinking] = useState(9);
  const [communication, setCommunication] = useState(7);
  const [creativity, setCreativity] = useState(8);
  const [leadership, setLeadership] = useState(8);

  // Domain Interests (1-10)
  const [technology, setTechnology] = useState(10);
  const [medicine, setMedicine] = useState(4);
  const [business, setBusiness] = useState(7);
  const [arts, setArts] = useState(8);

  // Activities
  const [technicalAct, setTechnicalAct] = useState(true);
  const [sportsAct, setSportsAct] = useState(false);
  const [artsAct, setArtsAct] = useState(true);

  // Career Preferences & Working Style
  const [careerPref, setCareerPref] = useState('B.Tech Computer Science');
  const [workingStyle, setWorkingStyle] = useState('Designing and building applications');

  // Textual Mindset Responses
  const [dreamProject, setDreamProject] = useState(
    'I enjoy coding and solving mathematical problems. I want to build AI systems and web applications.'
  );
  const [workplaceMindset, setWorkplaceMindset] = useState(
    'I thrive in collaborative, tech-driven innovation teams building scalable software platforms.'
  );
  const [learningInterests, setLearningInterests] = useState(
    'Programming tutorials, machine learning, Figma design systems, and full-stack software development.'
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');

    const overall = (
      Number(math) * 0.2 + Number(physics) * 0.2 + Number(chemistry) * 0.2 + 
      Number(computerScience) * 0.2 + Number(english) * 0.2
    ).toFixed(1);

    const payload = {
      name: user?.name || 'Arun Kumar',
      email: user?.email || 'arun@student.edu',
      grade: Number(grade),
      school: user?.school || 'Gabriel Pereira High School',
      academic: {
        math: Number(math),
        science: Number(science),
        english: Number(english),
        physics: Number(physics),
        chemistry: Number(chemistry),
        biology: Number(biology),
        computer_science: Number(computerScience),
        accountancy: Number(accountancy),
        economics: Number(economics),
        business_studies: Number(businessStudies),
        attendance_percentage: Number(attendance),
        overall_percentage: Number(overall)
      },
      skills: {
        problem_solving: Number(problemSolving),
        logical_thinking: Number(logicalThinking),
        communication: Number(communication),
        creativity: Number(creativity),
        leadership: Number(leadership)
      },
      interests: {
        technology: Number(technology),
        medicine: Number(medicine),
        business: Number(business),
        arts: Number(arts)
      },
      activities: {
        technical: technicalAct,
        sports: sportsAct,
        arts: artsAct
      },
      career_preference: careerPref,
      preferred_working_style: workingStyle,
      text_responses: {
        dream_project: dreamProject,
        workplace_mindset: workplaceMindset,
        learning_interests: learningInterests
      }
    };

    try {
      const studentId = user?.id || 'student-demo-1';
      await studentAPI.submitAssessment({ student_id: studentId, ...payload });
      await studentAPI.updateProfile(studentId, payload);
      setSuccess('Assessment submitted successfully! Redirecting to 12th Course & Career Guidance...');
      setTimeout(() => {
        navigate('/student/12th-guidance');
      }, 1200);
    } catch (err) {
      console.error('Failed to submit assessment:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <Navbar title="12th Standard Comprehensive Assessment Form" user={user} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '24px' }}>
        
        {/* Banner */}
        <div className="banner-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>
            <Sparkles size={16} />
            <span>Class 12th Multi-Step Assessment</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff' }}>Student Academic & NLP Mindset Assessment</h1>
          <p className="banner-subtitle">
            Fill out your 12th standard subject marks, skill ratings, interest domains, and natural-language text responses to generate your personalized 12th Course & Career Guidance.
          </p>
        </div>

        {success && (
          <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: 'var(--radius-md)', color: '#34d399', fontSize: '14px', fontWeight: 600, display: 'flex', itemsCenter: 'center', gap: '10px' }}>
            <ClipboardCheck size={20} />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Section 1: Standard & Academic Marks */}
          <div className="glass-card">
            <h2 style={{ fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: 'var(--primary)' }}>
              <BookOpen size={18} />
              1. Class Standard & Subject Academic Marks
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Standard / Grade</label>
                <select value={grade} onChange={(e) => setGrade(e.target.value)} className="form-select">
                  <option value={10}>10th Standard</option>
                  <option value={11}>11th Standard</option>
                  <option value={12}>12th Standard</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Mathematics (%)</label>
                <input type="number" min={0} max={100} value={math} onChange={(e) => setMath(e.target.value)} className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">Physics (%)</label>
                <input type="number" min={0} max={100} value={physics} onChange={(e) => setPhysics(e.target.value)} className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">Chemistry (%)</label>
                <input type="number" min={0} max={100} value={chemistry} onChange={(e) => setChemistry(e.target.value)} className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">Computer Science (%)</label>
                <input type="number" min={0} max={100} value={computerScience} onChange={(e) => setComputerScience(e.target.value)} className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">Biology (%)</label>
                <input type="number" min={0} max={100} value={biology} onChange={(e) => setBiology(e.target.value)} className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">Accountancy (%)</label>
                <input type="number" min={0} max={100} value={accountancy} onChange={(e) => setAccountancy(e.target.value)} className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">Attendance (%)</label>
                <input type="number" min={0} max={100} value={attendance} onChange={(e) => setAttendance(e.target.value)} className="form-input" />
              </div>
            </div>
          </div>

          {/* Section 2: Skills & Domain Interests */}
          <div className="glass-card">
            <h2 style={{ fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: 'var(--primary)' }}>
              <Layers size={18} />
              2. Skills & Domain Interest Ratings (Scale 1 to 10)
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Logical Thinking ({logicalThinking}/10)</label>
                <input type="range" min={1} max={10} value={logicalThinking} onChange={(e) => setLogicalThinking(e.target.value)} className="range-slider" />
              </div>

              <div className="form-group">
                <label className="form-label">Problem Solving ({problemSolving}/10)</label>
                <input type="range" min={1} max={10} value={problemSolving} onChange={(e) => setProblemSolving(e.target.value)} className="range-slider" />
              </div>

              <div className="form-group">
                <label className="form-label">Technology Interest ({technology}/10)</label>
                <input type="range" min={1} max={10} value={technology} onChange={(e) => setTechnology(e.target.value)} className="range-slider" />
              </div>

              <div className="form-group">
                <label className="form-label">Medicine Interest ({medicine}/10)</label>
                <input type="range" min={1} max={10} value={medicine} onChange={(e) => setMedicine(e.target.value)} className="range-slider" />
              </div>
            </div>
          </div>

          {/* Section 3: NLP Open-Ended Answers */}
          <div className="glass-card">
            <h2 style={{ fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: 'var(--primary)' }}>
              <MessageSquare size={18} />
              3. Open-Ended Career Intent Responses (NLP Analyzed)
            </h2>

            <div className="form-group">
              <label className="form-label">What is your dream project or career goal?</label>
              <textarea rows={3} value={dreamProject} onChange={(e) => setDreamProject(e.target.value)} className="form-input" style={{ resize: 'vertical' }} />
            </div>

            <div className="form-group">
              <label className="form-label">What workplace environment and working style do you prefer?</label>
              <textarea rows={3} value={workplaceMindset} onChange={(e) => setWorkplaceMindset(e.target.value)} className="form-input" style={{ resize: 'vertical' }} />
            </div>

            <div className="form-group">
              <label className="form-label">What topics, technologies, or subjects do you enjoy learning independently?</label>
              <textarea rows={3} value={learningInterests} onChange={(e) => setLearningInterests(e.target.value)} className="form-input" style={{ resize: 'vertical' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ padding: '14px 28px', fontSize: '15px', justifyContent: 'center' }}
          >
            <Save size={18} />
            {loading ? 'Analyzing & Processing Recommendations...' : 'Submit & Generate 12th Course Guidance'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default StudentAssessment;
