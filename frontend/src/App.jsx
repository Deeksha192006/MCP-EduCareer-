import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import StudentAssessment from './pages/StudentAssessment';
import StudentPerformance from './pages/StudentPerformance';
import StudentRecommendations from './pages/StudentRecommendations';
import StudentProfile from './pages/StudentProfile';
import Student12thGuidance from './pages/Student12thGuidance';
import CourseCompare from './pages/CourseCompare';
import CounsellorDashboard from './pages/CounsellorDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherStudents from './pages/TeacherStudents';
import TeacherStudentDetail from './pages/TeacherStudentDetail';
import AdminDashboard from './pages/AdminDashboard';
import AdminModels from './pages/AdminModels';
import EngineeringExplorationLanding from './pages/EngineeringExplorationLanding';
import CSEIntro from './pages/CSEIntro';
import CSEAssessmentFlow from './pages/CSEAssessmentFlow';
import CSEResult from './pages/CSEResult';
import ECEIntro from './pages/ECEIntro';
import ECEAssessmentFlow from './pages/ECEAssessmentFlow';
import ECEResult from './pages/ECEResult';
import EEEIntro from './pages/EEEIntro';
import EEEAssessmentFlow from './pages/EEEAssessmentFlow';
import EEEResult from './pages/EEEResult';
import AIDSIntro from './pages/AIDSIntro';
import AIDSAssessmentFlow from './pages/AIDSAssessmentFlow';
import AIDSResult from './pages/AIDSResult';
import MECHIntro from './pages/MECHIntro';
import MECHAssessmentFlow from './pages/MECHAssessmentFlow';
import MECHResult from './pages/MECHResult';
import AdminMECHQuestions from './pages/AdminMECHQuestions';
import ArtsScienceExplorationLanding from './pages/ArtsScienceExplorationLanding';
import DataScienceIntro from './pages/DataScienceIntro';
import DataScienceAssessmentFlow from './pages/DataScienceAssessmentFlow';
import DataScienceResult from './pages/DataScienceResult';
import PsychologyIntro from './pages/PsychologyIntro';
import PsychologyAssessmentFlow from './pages/PsychologyAssessmentFlow';
import PsychologyResult from './pages/PsychologyResult';
import BBAIntro from './pages/BBAIntro';
import BBAAssessmentFlow from './pages/BBAAssessmentFlow';
import BBAResult from './pages/BBAResult';
import EnvScienceIntro from './pages/EnvScienceIntro';
import EnvScienceAssessmentFlow from './pages/EnvScienceAssessmentFlow';
import EnvScienceResult from './pages/EnvScienceResult';
import JournalismIntro from './pages/JournalismIntro';
import JournalismAssessmentFlow from './pages/JournalismAssessmentFlow';
import JournalismResult from './pages/JournalismResult';
import CommerceExplorationLanding from './pages/CommerceExplorationLanding';
import CommerceGameFlowPage from './pages/commerce/CommerceGameFlowPage';
import LandingPage from './pages/LandingPage';

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : {
      id: 'student-demo-1',
      name: 'Arun Kumar',
      email: 'arun@student.edu',
      role: 'student'
    };
  });

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <div className="app-container">
        {user && <Sidebar user={user} onLogout={handleLogout} />}

        <main className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage user={user} />} />
            <Route path="/landing" element={<LandingPage user={user} />} />
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />

            {/* Student Routes */}
            <Route path="/student/dashboard" element={user?.role === 'student' ? <StudentDashboard user={user} /> : <Navigate to="/login" />} />
            <Route path="/student/12th-guidance" element={user?.role === 'student' ? <Student12thGuidance user={user} /> : <Navigate to="/login" />} />
            <Route path="/student/compare-courses" element={user?.role === 'student' ? <CourseCompare user={user} /> : <Navigate to="/login" />} />
            <Route path="/student/assessment" element={user?.role === 'student' ? <StudentAssessment user={user} /> : <Navigate to="/login" />} />
            <Route path="/student/performance" element={user?.role === 'student' ? <StudentPerformance user={user} /> : <Navigate to="/login" />} />
            <Route path="/student/recommendations" element={user?.role === 'student' ? <StudentRecommendations user={user} /> : <Navigate to="/login" />} />
            <Route path="/student/profile" element={user?.role === 'student' ? <StudentProfile user={user} /> : <Navigate to="/login" />} />

            {/* Engineering Exploration Routes */}
            <Route path="/engineering-exploration" element={user?.role === 'student' ? <EngineeringExplorationLanding user={user} /> : <Navigate to="/login" />} />
            <Route path="/engineering-exploration/cse" element={user?.role === 'student' ? <CSEIntro user={user} /> : <Navigate to="/login" />} />
            <Route path="/engineering-exploration/cse/assessment" element={user?.role === 'student' ? <CSEAssessmentFlow user={user} /> : <Navigate to="/login" />} />
            <Route path="/engineering-exploration/cse/result" element={user?.role === 'student' ? <CSEResult user={user} /> : <Navigate to="/login" />} />

            <Route path="/engineering-exploration/ece" element={user?.role === 'student' ? <ECEIntro user={user} /> : <Navigate to="/login" />} />
            <Route path="/engineering-exploration/ece/assessment" element={user?.role === 'student' ? <ECEAssessmentFlow user={user} /> : <Navigate to="/login" />} />
            <Route path="/engineering-exploration/ece/result" element={user?.role === 'student' ? <ECEResult user={user} /> : <Navigate to="/login" />} />

            <Route path="/engineering-exploration/eee" element={user?.role === 'student' ? <EEEIntro user={user} /> : <Navigate to="/login" />} />
            <Route path="/engineering-exploration/eee/assessment" element={user?.role === 'student' ? <EEEAssessmentFlow user={user} /> : <Navigate to="/login" />} />
            <Route path="/engineering-exploration/eee/result" element={user?.role === 'student' ? <EEEResult user={user} /> : <Navigate to="/login" />} />

            <Route path="/engineering-exploration/aids" element={user?.role === 'student' ? <AIDSIntro user={user} /> : <Navigate to="/login" />} />
            <Route path="/engineering-exploration/aids/assessment" element={user?.role === 'student' ? <AIDSAssessmentFlow user={user} /> : <Navigate to="/login" />} />
            <Route path="/engineering-exploration/aids/result" element={user?.role === 'student' ? <AIDSResult user={user} /> : <Navigate to="/login" />} />

            <Route path="/engineering/mech" element={user?.role === 'student' ? <MECHIntro user={user} /> : <Navigate to="/login" />} />
            <Route path="/engineering-exploration/mech" element={user?.role === 'student' ? <MECHIntro user={user} /> : <Navigate to="/login" />} />
            <Route path="/engineering/mech/flow" element={user?.role === 'student' ? <MECHAssessmentFlow user={user} /> : <Navigate to="/login" />} />
            <Route path="/engineering/mech/result/:studentId" element={user?.role === 'student' ? <MECHResult user={user} /> : <Navigate to="/login" />} />

            {/* Arts & Science Exploration Routes */}
            <Route path="/arts-science-exploration" element={user?.role === 'student' ? <ArtsScienceExplorationLanding user={user} /> : <Navigate to="/login" />} />
            <Route path="/arts-science-exploration/data-science" element={user?.role === 'student' ? <DataScienceIntro user={user} /> : <Navigate to="/login" />} />
            <Route path="/arts-science-exploration/data-science/assessment" element={user?.role === 'student' ? <DataScienceAssessmentFlow user={user} /> : <Navigate to="/login" />} />
            <Route path="/arts-science-exploration/data-science/result" element={user?.role === 'student' ? <DataScienceResult user={user} /> : <Navigate to="/login" />} />
            <Route path="/arts-science-exploration/psychology" element={user?.role === 'student' ? <PsychologyIntro user={user} /> : <Navigate to="/login" />} />
            <Route path="/arts-science-exploration/psychology/assessment" element={user?.role === 'student' ? <PsychologyAssessmentFlow user={user} /> : <Navigate to="/login" />} />
            <Route path="/arts-science-exploration/psychology/result" element={user?.role === 'student' ? <PsychologyResult user={user} /> : <Navigate to="/login" />} />
            <Route path="/arts-science-exploration/bba" element={user?.role === 'student' ? <BBAIntro user={user} /> : <Navigate to="/login" />} />
            <Route path="/arts-science-exploration/bba/assessment" element={user?.role === 'student' ? <BBAAssessmentFlow user={user} /> : <Navigate to="/login" />} />
            <Route path="/arts-science-exploration/bba/result" element={user?.role === 'student' ? <BBAResult user={user} /> : <Navigate to="/login" />} />
            <Route path="/arts-science-exploration/environmental-science" element={user?.role === 'student' ? <EnvScienceIntro user={user} /> : <Navigate to="/login" />} />
            <Route path="/arts-science-exploration/environmental-science/assessment" element={user?.role === 'student' ? <EnvScienceAssessmentFlow user={user} /> : <Navigate to="/login" />} />
            <Route path="/arts-science-exploration/environmental-science/result" element={user?.role === 'student' ? <EnvScienceResult user={user} /> : <Navigate to="/login" />} />
            <Route path="/arts-science-exploration/journalism" element={user?.role === 'student' ? <JournalismIntro user={user} /> : <Navigate to="/login" />} />
            <Route path="/arts-science-exploration/journalism/assessment" element={user?.role === 'student' ? <JournalismAssessmentFlow user={user} /> : <Navigate to="/login" />} />
            <Route path="/arts-science-exploration/journalism/result" element={user?.role === 'student' ? <JournalismResult user={user} /> : <Navigate to="/login" />} />
            <Route path="/journalism-intro" element={user?.role === 'student' ? <JournalismIntro user={user} /> : <Navigate to="/login" />} />
            <Route path="/journalism-assessment" element={user?.role === 'student' ? <JournalismAssessmentFlow user={user} /> : <Navigate to="/login" />} />
            <Route path="/journalism-result" element={user?.role === 'student' ? <JournalismResult user={user} /> : <Navigate to="/login" />} />

            {/* Commerce & Accounting Exploration Routes */}
            <Route path="/commerce-exploration" element={user?.role === 'student' ? <CommerceExplorationLanding user={user} /> : <Navigate to="/login" />} />
            <Route path="/commerce-exploration/finance-master" element={user?.role === 'student' ? (
              <CommerceGameFlowPage 
                user={user} 
                gameKey="finance-master" 
                courseName="B.Com. Accounting and Finance" 
                gameTitle="Finance Master" 
                themeColor="#10b981"
                writtenCourseKey="bcom-accfinance"
              />
            ) : <Navigate to="/login" />} />
            <Route path="/commerce-exploration/banking-quest" element={user?.role === 'student' ? (
              <CommerceGameFlowPage 
                user={user} 
                gameKey="banking-quest" 
                courseName="B.Com. Banking and Insurance" 
                gameTitle="Banking Quest" 
                themeColor="#06b6d4"
                writtenCourseKey="bcom-bankins"
              />
            ) : <Navigate to="/login" />} />
            <Route path="/commerce-exploration/tax-detective" element={user?.role === 'student' ? (
              <CommerceGameFlowPage 
                user={user} 
                gameKey="tax-detective" 
                courseName="B.Com. Taxation" 
                gameTitle="Tax Detective" 
                themeColor="#f59e0b"
                writtenCourseKey="bcom-tax"
              />
            ) : <Navigate to="/login" />} />
            <Route path="/commerce-exploration/corporate-decision" element={user?.role === 'student' ? (
              <CommerceGameFlowPage 
                user={user} 
                gameKey="corporate-decision" 
                courseName="B.Com. Corporate Secretaryship" 
                gameTitle="Corporate Decision Challenge" 
                themeColor="#8b5cf6"
                writtenCourseKey="bcom-corpsec"
              />
            ) : <Navigate to="/login" />} />
            <Route path="/commerce-exploration/business-tycoon" element={user?.role === 'student' ? (
              <CommerceGameFlowPage 
                user={user} 
                gameKey="business-tycoon" 
                courseName="BBA" 
                gameTitle="Business Tycoon" 
                themeColor="#ec4899"
                writtenCourseKey="bba-tycoon"
              />
            ) : <Navigate to="/login" />} />

            {/* Teacher / Counsellor Routes */}
            <Route path="/teacher/dashboard" element={(user?.role === 'teacher' || user?.role === 'admin') ? <TeacherDashboard user={user} /> : <Navigate to="/login" />} />
            <Route path="/teacher/counsellor" element={(user?.role === 'teacher' || user?.role === 'admin') ? <CounsellorDashboard user={user} /> : <Navigate to="/login" />} />
            <Route path="/teacher/students" element={(user?.role === 'teacher' || user?.role === 'admin') ? <TeacherStudents user={user} /> : <Navigate to="/login" />} />
            <Route path="/teacher/student/:id" element={(user?.role === 'teacher' || user?.role === 'admin') ? <TeacherStudentDetail user={user} /> : <Navigate to="/login" />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={user?.role === 'admin' ? <AdminDashboard user={user} /> : <Navigate to="/login" />} />
            <Route path="/admin/models" element={user?.role === 'admin' ? <AdminModels user={user} /> : <Navigate to="/login" />} />
            <Route path="/admin/mech/questions" element={(user?.role === 'admin' || user?.role === 'teacher') ? <AdminMECHQuestions user={user} /> : <Navigate to="/login" />} />

            {/* Default Fallback */}
            <Route path="*" element={<Navigate to={user ? (user.role === 'student' ? '/student/12th-guidance' : user.role === 'teacher' ? '/teacher/dashboard' : '/admin/dashboard') : '/login'} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
