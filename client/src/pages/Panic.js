import React, { useState } from 'react';
import axios from 'axios';

function Panic() {
  const [digitalId, setDigitalId] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePanic = async () => {
    if (!digitalId) { alert('Please enter your Digital ID'); return; }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const res = await axios.post('https://safetrail-api-1pq5.onrender.com/api/alerts/panic', {
          digitalId, latitude: pos.coords.latitude, longitude: pos.coords.longitude
        });
        setStatus({ success: true, message: res.data.message });
      } catch (err) {
        setStatus({ success: false, message: err.response?.data?.message || 'Error' });
      }
      setLoading(false);
    }, () => { setStatus({ success: false, message: 'Location access denied' }); setLoading(false); });
  };

  return (
    <div style={{ maxWidth: '400px', margin: '60px auto', textAlign: 'center', fontFamily: 'Arial', padding: '20px' }}>
      <h2 style={{ color: '#2c3e50' }}>🚨 Emergency Panic Button</h2>
      <p style={{ color: '#666' }}>Press only in case of emergency. Your live location will be sent to the nearest police unit.</p>
      <input placeholder="Enter your Digital ID (e.g. ST-XXXXXXXX)" value={digitalId}
        onChange={(e) => setDigitalId(e.target.value)}
        style={{ width: '100%', padding: '12px', fontSize: '15px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: '30px', boxSizing: 'border-box' }} />
      {!status ? (
        <button onClick={handlePanic} disabled={loading}
          style={{ width: '180px', height: '180px', borderRadius: '50%', backgroundColor: loading ? '#e74c3c99' : '#e74c3c', color: 'white', fontSize: '20px', fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 0 30px rgba(231,76,60,0.5)' }}>
          {loading ? '📡 Sending...' : '🆘 PANIC'}
        </button>
      ) : (
        <div style={{ padding: '20px', borderRadius: '10px', backgroundColor: status.success ? '#d5f5e3' : '#fadbd8' }}>
          <h3 style={{ color: status.success ? '#27ae60' : '#e74c3c' }}>{status.success ? '✅ Alert Sent!' : '❌ Failed'}</h3>
          <p>{status.message}</p>
          <button onClick={() => setStatus(null)}
            style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            Reset
          </button>
        </div>
      )}
    </div>
  );
}

export default Panic;
