import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../components/Toast';
import Spinner from '../components/Spinner';

function AdminLogin() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', { password });
      localStorage.setItem('adminToken', res.data.token);
      addToast('System Access Granted', 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast(err.response?.data?.message || 'Access Denied', 'error');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: '"Inter", sans-serif', backgroundColor: '#0f172a' }}>
      {/* Left Panel - Abstract Security Image */}
      <div style={{ flex: 1, display: 'block', position: 'relative', overflow: 'hidden' }}>
        <img 
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop" 
          alt="Cyber Security"
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.5)' }}
        />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to right, rgba(15, 23, 42, 0.8), transparent)' }}></div>
        <div style={{ position: 'absolute', bottom: '15%', left: '10%', color: 'white', maxWidth: '80%' }}>
          <h1 style={{ fontFamily: '"Outfit", sans-serif', fontSize: '56px', fontWeight: '800', margin: '0 0 15px 0', textShadow: '0 4px 15px rgba(0,0,0,0.4)', lineHeight: 1.1 }}>Command.<br/>Control.</h1>
          <p style={{ fontSize: '18px', opacity: 0.9, lineHeight: 1.6, textShadow: '0 2px 8px rgba(0,0,0,0.5)', maxWidth: '400px' }}>
            Authorized access only. Enter your credentials to access the SafeTrail Police Dashboard.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px', backgroundColor: '#020617' }}>
        <div className="glassmorphism" style={{ width: '100%', maxWidth: '450px', padding: '45px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(15, 23, 42, 0.6)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>🔐</div>
            <h2 style={{ fontFamily: '"Outfit", sans-serif', margin: '0', fontSize: '32px', fontWeight: '700', color: 'white' }}>Authorized Login</h2>
            <p style={{ margin: '8px 0 0 0', color: '#94a3b8', fontSize: '15px' }}>Enter dispatch password to continue</p>
          </div>

          <form onSubmit={handleLogin} style={{ animation: 'fadeIn 0.5s ease' }}>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ 
                width: '100%', padding: '16px', fontSize: '20px', borderRadius: '12px', 
                border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(0,0,0,0.4)', 
                color: 'white', boxSizing: 'border-box', outline: 'none', textAlign: 'center',
                letterSpacing: '8px', marginBottom: '30px', transition: 'border 0.3s'
              }}
              onFocus={(e) => e.target.style.border = '1px solid #38bdf8'}
              onBlur={(e) => e.target.style.border = '1px solid rgba(255,255,255,0.2)'}
            />

            <button type="submit" disabled={loading}
              style={{ 
                width: '100%', padding: '16px', backgroundColor: '#38bdf8', color: '#0f172a', 
                border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', 
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 8px 20px rgba(56, 189, 248, 0.3)', transition: 'transform 0.2s, box-shadow 0.2s',
                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px',
                fontFamily: '"Outfit", sans-serif', letterSpacing: '1px'
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(56, 189, 248, 0.4)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(56, 189, 248, 0.3)'; }}
            >
              {loading ? <><Spinner size={20} /> AUTHENTICATING...</> : 'ACCESS SYSTEM'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
