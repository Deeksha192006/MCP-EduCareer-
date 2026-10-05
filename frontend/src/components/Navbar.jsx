import React from 'react';
import { User, LogOut, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = ({ title, subtitle, user }) => {
  return (
    <header className="top-header">
      <div>
        <h1 className="header-title">{title}</h1>
        {subtitle && <p className="header-subtitle">{subtitle}</p>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div className="user-badge" style={{ background: '#ffffff', border: '1px solid var(--border-color)', padding: '6px 16px', borderRadius: '9999px', boxShadow: 'var(--shadow-sm)' }}>
          <div className="user-avatar" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px' }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2 }}>
              {user?.name || 'Student User'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', textTransform: 'capitalize', marginTop: '2px' }}>
              Role: <span style={{ color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.04em' }}>{user?.role || 'Student'}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
