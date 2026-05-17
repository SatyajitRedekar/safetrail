import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import io from 'socket.io-client';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const socket = io('https://safetrail-api-1pq5.onrender.com');

function Dashboard() {
  const [alerts, setAlerts] = useState([]);
  const [tourists, setTourists] = useState([]);
  const [liveAlert, setLiveAlert] = useState(null);

  useEffect(() => {
    axios.get('https://safetrail-api-1pq5.onrender.com/api/alerts/all').then(res => setAlerts(res.data.alerts));
    axios.get('https://safetrail-api-1pq5.onrender.com/api/tourists/all').then(res => setTourists(res.data.tourists));
    socket.on('panic-alert', (data) => {
      setLiveAlert(data);
      setAlerts(prev => [data, ...prev]);
      setTimeout(() => setLiveAlert(null), 5000);
    });
    return () => socket.off('panic-alert');
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

      {liveAlert && (
        <div style={{ backgroundColor: '#e74c3c', color: 'white', padding: '15px', borderRadius: '8px', marginBottom: '20px', fontSize: '16px', fontWeight: 'bold' }}>
          🚨 LIVE PANIC ALERT! Tourist: {liveAlert.name} | Location: {liveAlert.location?.latitude?.toFixed(4)}, {liveAlert.location?.longitude?.toFixed(4)}
        </div>
      )}

      <div style={{ borderRadius: '10px', overflow: 'hidden', marginBottom: '20px', height: '400px' }}>
        <MapContainer center={[26.1445, 91.7362]} zoom={6} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {alerts.filter(a => a.location?.latitude).map((alert, i) => (
            <Marker key={i} position={[alert.location.latitude, alert.location.longitude]}>
              <Popup>
                <b>🚨 {alert.name}</b><br />
                ID: {alert.digitalId}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px' }}>
        <h3 style={{ color: '#2c3e50', marginTop: 0 }}>📋 Alert History</h3>
        {alerts.length === 0 ? (
          <p style={{ color: '#999' }}>No alerts yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '10px', textAlign: 'left', color: '#666', fontSize: '13px' }}>Tourist Name</th>
                <th style={{ padding: '10px', textAlign: 'left', color: '#666', fontSize: '13px' }}>Digital ID</th>
                <th style={{ padding: '10px', textAlign: 'left', color: '#666', fontSize: '13px' }}>Location</th>
                <th style={{ padding: '10px', textAlign: 'left', color: '#666', fontSize: '13px' }}>Type</th>
                <th style={{ padding: '10px', textAlign: 'left', color: '#666', fontSize: '13px' }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px', fontSize: '14px' }}>{alert.name}</td>
                  <td style={{ padding: '10px', fontSize: '14px' }}><code>{alert.digitalId}</code></td>
                  <td style={{ padding: '10px', fontSize: '14px' }}>{alert.location?.latitude?.toFixed(3)}, {alert.location?.longitude?.toFixed(3)}</td>
                  <td style={{ padding: '10px' }}><span style={{ backgroundColor: '#e74c3c', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>{alert.alertType}</span></td>
                  <td style={{ padding: '10px', fontSize: '14px' }}>{new Date(alert.createdAt).toLocaleString()}</td>
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
