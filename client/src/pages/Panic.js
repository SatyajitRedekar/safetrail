import React, { useState } from 'react';

const Panic = () => {
  const [status, setStatus] = useState('');

  const handlePanic = async () => {
    setStatus('SENDING');
    try {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        await sendAlert(latitude, longitude);
      }, async () => {
        await sendAlert(26.1445, 91.7362);
      });
    } catch (err) {
      console.error(err);
      setStatus('ERROR');
    }
  };

  const sendAlert = async (lat, lng) => {
    try {
      const res = await fetch('https://safetrail-api-1pq5.onrender.com/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ touristId: '60d5f9f9b5c5a814a0d9b1a1', location: { lat, lng }, type: 'emergency' })
      });
      if (res.ok) {
        setStatus('SENT');
      } else {
        setStatus('ERROR');
      }
    } catch (err) {
      setStatus('ERROR');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#1a1a1a', color: 'white' }}>
      <h1 style={{ marginBottom: '40px', fontSize: '32px' }}>Emergency Assistance</h1>
      <button 
        onClick={handlePanic} 
        style={{ 
          background: 'red', 
          color: 'white', 
          width: '250px', 
          height: '250px', 
          borderRadius: '50%', 
          fontSize: '48px', 
          fontWeight: 'bold', 
          cursor: 'pointer', 
          border: '10px solid #ff4d4d',
          boxShadow: '0 0 50px rgba(255, 0, 0, 0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'transform 0.1s'
        }}
        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        SOS
      </button>
      <div style={{ marginTop: '40px', fontSize: '20px', height: '30px' }}>
        {status === 'SENDING' && 'Broadcasting Location...'}
        {status === 'SENT' && <span style={{ color: '#00ff00' }}>Alert Sent to Police Station! Help is on the way.</span>}
        {status === 'ERROR' && <span style={{ color: '#ff4d4d' }}>Failed to send alert. Try again.</span>}
      </div>
    </div>
  );
};

export default Panic;
