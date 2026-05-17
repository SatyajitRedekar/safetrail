import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [alerts, setAlerts] = useState([]);
  const [tourists, setTourists] = useState([]);

  useEffect(() => {
    axios.get('https://safetrail-api-1pq5.onrender.com/api/alerts/all')
      .then(res => setAlerts(res.data.alerts))
      .catch(err => console.log(err));
    axios.get('https://safetrail-api-1pq5.onrender.com/api/tourists/all')
      .then(res => setTourists(res.data.tourists))
      .catch(err => console.log(err));
  }, []);

  return (
    <div style={{ fontFamily: 'Arial', padding: '20px', backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#2c3e50', margin: 0 }}>🚔 Police Dashboard — SafeTrail</h2>
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ backgroundColor: '#3498db', color: 'white', padding: '10px 20px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '22px', fontWeight: 'bold' }}>{tourists.length}</div>
            <div style={{ fontSize: '12px' }}>Tourists</div>
          </div>
          <div style={{ backgroundColor: '#e74c3c', color: 'white', padding: '10px 20px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '22px', fontWeight: 'bold' }}>{alerts.length}</div>
            <div style={{ fontSize: '12px' }}>Alerts</div>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
        <h3 style={{ color: '#2c3e50', marginTop: 0 }}>📋 Alert History</h3>
        {alerts.length === 0 ? (
          <p style={{ color: '#999' }}>No alerts yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '10px', textAlign: 'left', color: '#666' }}>Tourist Name</th>
                <th style={{ padding: '10px', textAlign: 'left', color: '#666' }}>Digital ID</th>
                <th style={{ padding: '10px', textAlign: 'left', color: '#666' }}>Location</th>
                <th style={{ padding: '10px', textAlign: 'left', color: '#666' }}>Type</th>
                <th style={{ padding: '10px', textAlign: 'left', color: '#666' }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>{alert.name}</td>
                  <td style={{ padding: '10px' }}><code>{alert.digitalId}</code></td>
                  <td style={{ padding: '10px' }}>{alert.location?.latitude?.toFixed(3)}, {alert.location?.longitude?.toFixed(3)}</td>
                  <td style={{ padding: '10px' }}><span style={{ backgroundColor: '#e74c3c', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>{alert.alertType}</span></td>
                  <td style={{ padding: '10px' }}>{new Date(alert.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px' }}>
        <h3 style={{ color: '#2c3e50', marginTop: 0 }}>👥 Registered Tourists</h3>
        {tourists.length === 0 ? (
          <p style={{ color: '#999' }}>No tourists registered yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '10px', textAlign: 'left', color: '#666' }}>Name</th>
                <th style={{ padding: '10px', textAlign: 'left', color: '#666' }}>Digital ID</th>
                <th style={{ padding: '10px', textAlign: 'left', color: '#666' }}>Phone</th>
                <th style={{ padding: '10px', textAlign: 'left', color: '#666' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {tourists.map((t, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>{t.name}</td>
                  <td style={{ padding: '10px' }}><code>{t.digitalId}</code></td>
                  <td style={{ padding: '10px' }}>{t.phone}</td>
                  <td style={{ padding: '10px' }}><span style={{ backgroundColor: '#2ecc71', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>{t.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
