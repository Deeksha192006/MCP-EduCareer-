import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
};

export const studentAPI = {
  getProfile: (studentId) => api.get(`/students/${studentId}`),
  updateProfile: (studentId, data) => api.put(`/students/${studentId}`, data),
  getDashboard: (studentId) => api.get(`/dashboard/student/${studentId}`),
  getRecommendations: (studentId) => api.get(`/recommend/${studentId}`),
  get12thGuidance: (studentId) => api.post('/recommend/final', { student_id: studentId }),
  compareCourses: (studentId, courseNames) => api.post('/recommend/compare', { student_id: studentId, course_names: courseNames }),
  simulateWhatIf: (studentId, simulatedMarks, simulatedSkills) => api.post('/recommend/simulate', { student_id: studentId, simulated_marks: simulatedMarks, simulated_skills: simulatedSkills }),
  exploreConfusedMode: (studentId) => api.post('/recommend/confused', { student_id: studentId }),
  submitAssessment: (data) => api.post('/assessment', data),
  exportReportPDF: (studentId) => `${API_BASE_URL}/reports/pdf/${studentId}`,
};

export const coursesAPI = {
  getCourses: () => api.get('/courses'),
  getCourseById: (courseId) => api.get(`/courses/${courseId}`),
  getCareerDetails: (careerTitle) => api.get(`/courses/career-details/${encodeURIComponent(careerTitle)}`),
};

export const counsellorAPI = {
  submitReview: (reviewData) => api.post('/counsellor/review', reviewData),
  getReview: (studentId) => api.get(`/counsellor/reviews/${studentId}`),
};

export const teacherAPI = {
  getClassDashboard: () => api.get('/dashboard/class'),
  getStudents: () => api.get('/students'),
  uploadCSV: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/students/upload-csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const adminAPI = {
  getAdminDashboard: () => api.get('/dashboard/admin'),
  getMLMetrics: () => api.get('/ml/metrics'),
  triggerRetrain: () => api.post('/ml/retrain'),
};

export const cseAPI = {
  startAssessment: (studentId) => api.post('/cse/assessment/start', { studentId }),
  getAssessment: (studentId) => api.get(`/cse/assessment/${studentId}`),
  submitGame: (data) => api.post('/cse/assessment/submit-game', data),
  completeAssessment: (studentId) => api.post('/cse/assessment/complete', { studentId }),
  getAnalytics: () => api.get('/cse/analytics'),
};

export const eceAPI = {
  startAssessment: (studentId) => api.post('/engineering/ece/start', { studentId }),
  submitGame: (studentId, levelResults, totalTime) => api.post('/engineering/ece/game/submit', { studentId, levelResults, totalTime }),
  getQuizQuestions: () => api.get('/engineering/ece/quiz/questions'),
  submitQuiz: (studentId, answers, totalTime) => api.post('/engineering/ece/quiz/submit', { studentId, answers, totalTime }),
  completeAssessment: (studentId) => api.post('/engineering/ece/complete', { studentId }),
  getResult: (studentId) => api.get(`/engineering/ece/result/${studentId}`),
  getAnalytics: () => api.get('/engineering/ece/analytics'),
};

export const eeeAPI = {
  startAssessment: (studentId) => api.post('/engineering/eee/start', { studentId }),
  submitGame: (studentId, levelResults, totalTime) => api.post('/engineering/eee/game/submit', { studentId, levelResults, totalTime }),
  getQuizQuestions: () => api.get('/engineering/eee/quiz/questions'),
  submitQuiz: (studentId, answers, totalTime) => api.post('/engineering/eee/quiz/submit', { studentId, answers, totalTime }),
  completeAssessment: (studentId) => api.post('/engineering/eee/complete', { studentId }),
  getResult: (studentId) => api.get(`/engineering/eee/result/${studentId}`),
  getAnalytics: () => api.get('/engineering/eee/analytics'),
};

export const aidsAPI = {
  startAssessment: (studentId) => api.post('/engineering/aids/start', { studentId }),
  submitGame: (studentId, levelResults, totalTime) => api.post('/engineering/aids/game/submit', { studentId, levelResults, totalTime }),
  getQuizQuestions: () => api.get('/engineering/aids/quiz/questions'),
  submitQuiz: (studentId, answers, totalTime) => api.post('/engineering/aids/quiz/submit', { studentId, answers, totalTime }),
  completeAssessment: (studentId) => api.post('/engineering/aids/complete', { studentId }),
  getResult: (studentId) => api.get(`/engineering/aids/result/${studentId}`),
  getAnalytics: () => api.get('/engineering/aids/analytics'),
};

export const mechAPI = {
  startAssessment: (studentId) => api.post('/engineering/mech/quiz/start', { studentId }),
  generateQuiz: (assessmentId, studentId) => api.post('/engineering/mech/quiz/generate', { assessmentId, studentId }),
  submitGame: (assessmentId, studentId, levelResults, totalTimeTaken) => api.post('/engineering/mech/game/submit', { assessmentId, studentId, levelResults, totalTimeTaken }),
  submitQuiz: (assessmentId, studentId, answers, timeTakenSeconds) => api.post('/engineering/mech/quiz/submit', { assessmentId, studentId, answers, timeTakenSeconds }),
  completeAssessment: (assessmentId, studentId) => api.post('/engineering/mech/complete', { assessmentId, studentId }),
  getResult: (studentId) => api.get(`/engineering/mech/quiz/result/${studentId}`),
  getHistory: (studentId) => api.get(`/engineering/mech/quiz/history/${studentId}`),
};

export const adminMechAPI = {
  getQuestions: (status) => api.get('/admin/mech/questions', { params: { status } }),
  generateQuestions: (topic, difficulty, count) => api.post('/admin/mech/questions/generate', { topic, difficulty, count }),
  updateQuestion: (id, updateData) => api.put(`/admin/mech/questions/${id}`, updateData),
  deleteQuestion: (id) => api.delete(`/admin/mech/questions/${id}`),
  getAnalytics: () => api.get('/admin/mech/analytics'),
};

export const dataScienceAPI = {
  getLevels: () => api.get('/arts-science/data-science/levels'),
  startAssessment: (studentId) => api.post('/arts-science/data-science/start', { studentId }),
  getAssessment: (studentId) => api.get(`/arts-science/data-science/assessment/${studentId}`),
  submitGame: (studentId, levelSubmissions, totalTime) => api.post('/arts-science/data-science/game/submit', { studentId, levelSubmissions, totalTime }),
  getResult: (studentId) => api.get(`/arts-science/data-science/result/${studentId}`),
  getAnalytics: () => api.get('/arts-science/data-science/analytics'),
};

export const psychologyAPI = {
  getScenarios: () => api.get('/arts-science/psychology/scenarios'),
  startAssessment: (studentId) => api.post('/arts-science/psychology/start', { studentId }),
  getAssessment: (studentId) => api.get(`/arts-science/psychology/assessment/${studentId}`),
  submitGame: (studentId, submissions, totalTime) => api.post('/arts-science/psychology/game/submit', { studentId, submissions, totalTime }),
  getResult: (studentId) => api.get(`/arts-science/psychology/result/${studentId}`),
  getAnalytics: () => api.get('/arts-science/psychology/analytics'),
};

export const bbaAPI = {
  getRounds: () => api.get('/arts-science/bba/rounds'),
  startAssessment: (studentId) => api.post('/arts-science/bba/start', { studentId }),
  getAssessment: (studentId) => api.get(`/arts-science/bba/assessment/${studentId}`),
  submitGame: (studentId, submissions, totalTime) => api.post('/arts-science/bba/game/submit', { studentId, submissions, totalTime }),
  getResult: (studentId) => api.get(`/arts-science/bba/result/${studentId}`),
  getAnalytics: () => api.get('/arts-science/bba/analytics'),
};

export const envScienceAPI = {
  getChallenges: () => api.get('/arts-science/environmental-science/challenges'),
  startAssessment: (studentId) => api.post('/arts-science/environmental-science/start', { studentId }),
  getAssessment: (studentId) => api.get(`/arts-science/environmental-science/assessment/${studentId}`),
  submitGame: (studentId, submissions, totalTime) => api.post('/arts-science/environmental-science/game/submit', { studentId, submissions, totalTime }),
  getResult: (studentId) => api.get(`/arts-science/environmental-science/result/${studentId}`),
  getAnalytics: () => api.get('/arts-science/environmental-science/analytics'),
};

export const journalismAPI = {
  getChallenges: () => api.get('/arts-science/journalism/challenges'),
  startAssessment: (studentId) => api.post('/arts-science/journalism/start', { studentId }),
  evaluateChoice: (challengeId, selectedOptionId) => api.post('/arts-science/journalism/evaluate-choice', { challengeId, selectedOptionId }),
  submitGame: (studentId, submissions, totalTime) => api.post('/arts-science/journalism/submit', { studentId, submissions, totalTime }),
  getResult: (studentId) => api.get(`/arts-science/journalism/results/${studentId}`),
  getAnalytics: () => api.get('/arts-science/journalism/analytics'),
};

export const writtenTestAPI = {
  getQuestions: (courseKey) => api.get(`/arts-science/written-test/${courseKey}/questions`),
  submitTest: (courseKey, studentId, answers, totalTime) => api.post(`/arts-science/written-test/${courseKey}/submit`, { studentId, answers, totalTime }),
  getResult: (courseKey, studentId) => api.get(`/arts-science/written-test/${courseKey}/result/${studentId}`),
};

export const pilotValidationAPI = {
  getMetrics: () => api.get('/pilot-validation/metrics'),
  getWeights: () => api.get('/pilot-validation/weights'),
  updateWeights: (gameWeight, writtenWeight) => api.post('/pilot-validation/weights', { gameWeight, writtenWeight }),
  resetWeights: () => api.post('/pilot-validation/weights/reset'),
  submitFeedback: (payload) => api.post('/pilot-validation/feedback', payload),
  getFeedback: () => api.get('/pilot-validation/feedback'),
};

export const artsScienceRecAPI = {
  getRecommendations: (studentId) => api.get(`/recommend/arts-science/${studentId}`),
};

export const commerceAPI = {
  getLevels: (gameKey) => api.get(`/commerce/${gameKey}/levels`),
  startGame: (studentId, gameKey) => api.post('/commerce/start', { studentId, gameKey }),
  submitGame: (studentId, gameKey, submissions, totalTime) => api.post('/commerce/game/submit', { studentId, gameKey, submissions, totalTime }),
  getResult: (gameKey, studentId) => api.get(`/commerce/${gameKey}/result/${studentId}`),
  getAnalytics: () => api.get('/commerce/analytics'),
  getRecommendations: (studentId) => api.get(`/recommend/commerce/${studentId}`),
};

export default api;


