import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  ClipboardList, 
  LineChart, 
  Compass, 
  Users, 
  Cpu, 
  LogOut,
  GraduationCap,
  Sparkles,
  Columns,
  UserCheck,
  Palette,
  Coins,
  Home
} from 'lucide-react';

const Sidebar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const role = user?.role || 'student';

  return (
    <aside className="sidebar">
      <div>
        <div className="brand" onClick={() => navigate('/landing')} style={{ cursor: 'pointer' }}>
          <div className="brand-logo">
            <GraduationCap size={24} />
          </div>
          <div>
            <div className="brand-name">EduCareer AI</div>
            <div className="brand-sub">Career Guidance Platform</div>
          </div>
        </div>

        <ul className="nav-list">
          {role === 'student' && (
            <>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '12px 14px 4px' }}>
                Main Hub
              </div>
              <li>
                <NavLink to="/landing" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  <Home size={18} />
                  <span>Platform Home</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/student/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  <LayoutDashboard size={18} />
                  <span>Student Dashboard</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/student/12th-guidance" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  <Sparkles size={18} />
                  <span>12th Course & Career</span>
                </NavLink>
              </li>

              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '16px 14px 4px' }}>
                Stream Arcades
              </div>
              <li>
                <NavLink to="/engineering-exploration" className={({ isActive }) => isActive || window.location.pathname.startsWith('/engineering-exploration') ? 'nav-link active' : 'nav-link'}>
                  <Cpu size={18} />
                  <span>Engineering</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/arts-science-exploration" className={({ isActive }) => isActive || window.location.pathname.startsWith('/arts-science-exploration') ? 'nav-link active' : 'nav-link'}>
                  <Palette size={18} />
                  <span>Arts & Science</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/commerce-exploration" className={({ isActive }) => isActive || window.location.pathname.startsWith('/commerce-exploration') ? 'nav-link active' : 'nav-link'}>
                  <Coins size={18} />
                  <span>Commerce & Accounts</span>
                </NavLink>
              </li>

              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '16px 14px 4px' }}>
                Evaluation & Guidance
              </div>
              <li>
                <NavLink to="/student/recommendations" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  <Compass size={18} />
                  <span>Course Match (75:25)</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/student/compare-courses" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  <Columns size={18} />
                  <span>Compare Courses</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/student/performance" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  <LineChart size={18} />
                  <span>Skill Performance</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/student/profile" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  <User size={18} />
                  <span>Profile</span>
                </NavLink>
              </li>
            </>
          )}

          {(role === 'teacher' || role === 'admin') && (
            <>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '12px 14px 4px' }}>
                Academic Oversight
              </div>
              <li>
                <NavLink to="/teacher/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  <LayoutDashboard size={18} />
                  <span>Class Overview</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/teacher/counsellor" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  <UserCheck size={18} />
                  <span>Counsellor Portal</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/teacher/students" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  <Users size={18} />
                  <span>Student Directory</span>
                </NavLink>
              </li>
            </>
          )}

          {role === 'admin' && (
            <>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '16px 14px 4px' }}>
                Administration
              </div>
              <li>
                <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  <LayoutDashboard size={18} />
                  <span>Admin Dashboard</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/models" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  <Cpu size={18} />
                  <span>ML Model Performance</span>
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>

      <div style={{ paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
        <button 
          onClick={() => {
            onLogout();
            navigate('/login');
          }}
          className="btn btn-outline"
          style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--danger)', borderColor: 'var(--danger-border)' }}
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
