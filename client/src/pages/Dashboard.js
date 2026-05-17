import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const Dashboard = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch('https://safetrail-api-1pq5.onrender.com/api/alerts');
        const data = await res.json();
        setAlerts(data);
      } catch (err) {
        console.error(err);
      }
    };
    
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  const resolveAlert = async (id) => {
    try {
      await fetch(`https://safetrail-api-1pq5.onrender.com/api/alerts/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'resolved' })
      });
      setAlerts(alerts.map(a => a._id === id ? { ...a, status: 'resolved' } : a));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>SafeTrail Police Dashboard</h1>
      
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <div style={{ flex: 1 }}>
          <h3>Live Emergency Map</h3>
          <div style={{ height: '500px', width: '100%', border: '2px solid #ccc', borderRadius: '5px', overflow: 'hidden' }}>
            <MapContainer center={[26.1445, 91.7362]} zoom={6} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {alerts.filter(a => a.location?.lat && a.location?.lng).map((alert) => (
                <Marker 
                  key={alert._id} 
                  position={[alert.location.lat, alert.location.lng]}
                  icon={alert.status === 'pending' ? redIcon : new L.Icon.Default()}
                >
                  <Popup>
                    <strong>Tourist:</strong> {alert.touristId?.name || 'Unknown'}<br />
                    <strong>Phone:</strong> {alert.touristId?.phone || 'N/A'}<br />
                    <strong>Status:</strong> {alert.status.toUpperCase()}<br />
                    <strong>Time:</strong> {new Date(alert.createdAt).toLocaleString()}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
        
        <div style={{ flex: 1 }}>
          <h3>Recent Alerts</h3>
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {alerts.map(alert => (
              <div key={alert._id} style={{ 
                padding: '15px', 
                marginBottom: '10px', 
                borderLeft: `5px solid ${alert.status === 'pending' ? 'red' : 'green'}`,
                background: '#f9f9f9',
                borderRadius: '4px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{alert.touristId?.name || 'Unknown Tourist'}</strong>
                  <span style={{ color: '#666', fontSize: '12px' }}>{new Date(alert.createdAt).toLocaleTimeString()}</span>
                </div>
                <p style={{ margin: '5px 0', fontSize: '14px' }}>Phone: {alert.touristId?.phone || 'N/A'}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                  <span style={{ 
                    padding: '3px 8px', 
                    borderRadius: '12px', 
                    fontSize: '12px', 
                    fontWeight: 'bold',
                    background: alert.status === 'pending' ? '#ffebeb' : '#e6ffe6',
                    color: alert.status === 'pending' ? '#cc0000' : '#006600'
                  }}>
                    {alert.status.toUpperCase()}
                  </span>
                  {alert.status === 'pending' && (
                    <button 
                      onClick={() => resolveAlert(alert._id)}
                      style={{ background: '#4CAF50', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))}
            {alerts.length === 0 && <p>No alerts recorded.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
