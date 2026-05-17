import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'Arial' }}>
      <h1 style={{ color: '#2c3e50' }}>🛡️ SafeTrail</h1>
      <p style={{ fontSize: '18px', color: '#666' }}>Smart Tourist Safety Monitoring System</p>
      <div style={{ marginTop: '40px', display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => navigate('/register')}
          style={{ padding: '15px 30px', fontSize: '16px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Tourist Registration
        </button>
        <button onClick={() => navigate('/dashboard')}
          style={{ padding: '15px 30px', fontSize: '16px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Police Dashboard
        </button>
        <button onClick={() => navigate('/panic')}
          style={{ padding: '15px 30px', fontSize: '16px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          🚨 Panic Button
        </button>
      </div>
    </div>
  );
}

export default Home;
