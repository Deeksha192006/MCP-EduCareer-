import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { GraduationCap, LogIn, UserPlus, Lock, Mail, User, School, BookOpen } from 'lucide-react';

const Login = ({ onLoginSuccess }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('arun@student.edu');
  const [password, setPassword] = useState('student123');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [grade, setGrade] = useState(10);
  const [school, setSchool] = useState('Gabriel Pereira High School');

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await authAPI.login(email, password);
      const { access_token, user } = res.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      onLoginSuccess(user);

      if (user.role === 'student') navigate('/student/dashboard');
      else if (user.role === 'teacher') navigate('/teacher/dashboard');
      else if (user.role === 'admin') navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const payload = {
        name,
        email,
        password,
        role,
        grade: Number(grade),
        school
      };
      const res = await authAPI.register(payload);
      const { access_token, user } = res.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      setSuccessMsg('Account created successfully! Logging you in...');
      setTimeout(() => {
        onLoginSuccess(user);
        if (user.role === 'student') navigate('/student/dashboard');
        else if (user.role === 'teacher') navigate('/teacher/dashboard');
        else if (user.role === 'admin') navigate('/admin/dashboard');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. User may already exist.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoRole) => {
    setIsRegisterMode(false);
    if (demoRole === 'student') {
      setEmail('arun@student.edu');
      setPassword('student123');
    } else if (demoRole === 'teacher') {
      setEmail('teacher@school.edu');
      setPassword('teacher123');
    } else if (demoRole === 'admin') {
      setEmail('admin@school.edu');
      setPassword('admin123');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '460px', padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div className="brand-logo" style={{ margin: '0 auto 16px', width: '56px', height: '56px', fontSize: '28px' }}>
            <GraduationCap size={32} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '6px' }}>
            {isRegisterMode ? 'Create New Account' : 'Welcome Back'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            Data-Driven Career Guidance System for Students & Teachers
          </p>
        </div>

        {/* Tab Selector */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-card-subtle)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '4px',
          marginBottom: '24px'
        }}>
          <button
            type="button"
            onClick={() => { setIsRegisterMode(false); setError(''); setSuccessMsg(''); }}
            style={{
              flex: 1,
              padding: '9px',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              background: !isRegisterMode ? 'var(--primary)' : 'transparent',
              color: !isRegisterMode ? '#ffffff' : 'var(--text-muted)',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s ease'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsRegisterMode(true); setError(''); setSuccessMsg(''); }}
            style={{
              flex: 1,
              padding: '9px',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              background: isRegisterMode ? 'var(--primary)' : 'transparent',
              color: isRegisterMode ? '#ffffff' : 'var(--text-muted)',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s ease'
            }}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div style={{
            background: 'var(--danger-bg)',
            border: '1px solid var(--danger-border)',
            color: 'var(--danger)',
            padding: '12px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        {successMsg && (
          <div style={{
            background: 'var(--success-bg)',
            border: '1px solid var(--success-border)',
            color: 'var(--success)',
            padding: '12px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: '20px'
          }}>
            {successMsg}
          </div>
        )}

        {!isRegisterMode ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ paddingLeft: '40px' }}
                />
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ paddingLeft: '40px' }}
                />
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }} disabled={loading}>
              <LogIn size={18} />
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  required
                  style={{ paddingLeft: '40px' }}
                />
                <User size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@school.edu"
                  required
                  style={{ paddingLeft: '40px' }}
                />
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Choose a secure password"
                  required
                  style={{ paddingLeft: '40px' }}
                />
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Account Role</label>
                <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Grade Standard</label>
                <select className="form-select" value={grade} onChange={(e) => setGrade(e.target.value)}>
                  <option value={10}>10th Standard</option>
                  <option value={12}>12th Standard</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">School Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-input"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="School Name"
                  required
                  style={{ paddingLeft: '40px' }}
                />
                <School size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }} disabled={loading}>
              <UserPlus size={18} />
              <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
            </button>
          </form>
        )}

        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', textAlign: 'center' }}>
            Demo Account Quick Fill:
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <button type="button" onClick={() => handleQuickDemo('student')} className="btn btn-outline" style={{ fontSize: '11px', padding: '6px 12px' }}>
              Student
            </button>
            <button type="button" onClick={() => handleQuickDemo('teacher')} className="btn btn-outline" style={{ fontSize: '11px', padding: '6px 12px' }}>
              Teacher
            </button>
            <button type="button" onClick={() => handleQuickDemo('admin')} className="btn btn-outline" style={{ fontSize: '11px', padding: '6px 12px' }}>
              Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
