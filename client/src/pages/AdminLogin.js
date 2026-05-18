import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../components/Toast';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', {
        username, password
      });
      
      if (res.data.success) {
        localStorage.setItem('adminToken', res.data.token);
        addToast('Authentication Successful', 'success');
        navigate('/dashboard');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Login failed', 'error');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a192f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"Inter", sans-serif',
      color: 'white',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#112240',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        width: '100%',
        maxWidth: '400px',
        border: '1px solid #233554'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>🛡️</div>
          <h1 style={{ fontSize: '24px', margin: '0 0 10px 0', color: '#ccd6f6' }}>Secure Dispatch Portal</h1>
          <p style={{ margin: 0, fontSize: '14px', color: '#8892b0' }}>SafeTrail Police Authorization Required</p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 'bold', color: '#ccd6f6', textTransform: 'uppercase', letterSpacing: '1px' }}>Officer ID</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter ID (admin)"
              style={{ width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #233554', backgroundColor: '#0a192f', color: '#ccd6f6', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
              required
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 'bold', color: '#ccd6f6', textTransform: 'uppercase', letterSpacing: '1px' }}>Passcode</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter passcode (safetrail2026)"
              style={{ width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #233554', backgroundColor: '#0a192f', color: '#ccd6f6', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '14px', 
              backgroundColor: '#64ffda', 
              color: '#0a192f', 
              border: 'none', 
              borderRadius: '8px', 
              fontSize: '16px', 
              fontWeight: 'bold', 
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              opacity: loading ? 0.7 : 1
            }}>
            {loading ? 'Authenticating...' : 'Access Command Center'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#8892b0' }}>
          Unauthorized access is strictly prohibited and monitored.
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
