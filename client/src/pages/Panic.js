import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const redPulseIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'pulsing-leaflet-icon'
});

function Panic() {
  const [digitalId, setDigitalId] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setCurrentLocation([pos.coords.latitude, pos.coords.longitude]),
      () => setMapError(true),
      { enableHighAccuracy: true }
    );
  }, []);

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
        setStatus({ success: false, message: err.response?.data?.message || 'Error communicating with dispatch' });
      }
      setLoading(false);
    }, () => { 
      setStatus({ success: false, message: 'CRITICAL: Location access denied. Enable GPS.' }); 
      setLoading(false); 
    });
  };

  return (
    <div style={{ 
      minHeight: '100vh', backgroundColor: '#0a0a0a', display: 'flex', 
      flexDirection: 'column', justifyContent: 'center', alignItems: 'center', 
      fontFamily: '"Inter", "Segoe UI", Roboto, sans-serif', padding: '20px' 
    }}>
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(229, 57, 53, 0.7); }
            70% { transform: scale(1.05); box-shadow: 0 0 0 40px rgba(229, 57, 53, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(229, 57, 53, 0); }
          }
          .panic-btn {
            animation: pulse 2s infinite;
          }
          .panic-btn:hover {
            animation: none;
            transform: scale(1.02);
            box-shadow: 0 0 30px rgba(229, 57, 53, 0.9);
          }
          .pulsing-leaflet-icon {
            border-radius: 50%;
            background-color: rgba(229, 57, 53, 0.4);
            animation: pulse 2s infinite;
          }
        `}
      </style>
      
      <div style={{ maxWidth: '450px', width: '100%', textAlign: 'center' }}>
        <h2 style={{ color: '#ff5252', fontSize: '32px', marginBottom: '10px', fontWeight: '800', letterSpacing: '1px' }}>EMERGENCY SOS</h2>
        <p style={{ color: '#aaa', fontSize: '15px', lineHeight: '1.6', marginBottom: '40px' }}>
          Press the button below only in case of a severe emergency. Your live GPS coordinates will be instantly broadcasted to the nearest police response unit.
        </p>

        <div style={{ backgroundColor: '#1c1c1c', padding: '30px', borderRadius: '16px', border: '1px solid #333' }}>
          <label style={{ display: 'block', color: '#888', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '10px', textAlign: 'left' }}>Enter Digital ID</label>
          <input 
            placeholder="e.g. ST-XXXXXXXX" 
            value={digitalId}
            onChange={(e) => setDigitalId(e.target.value)}
            style={{ 
              width: '100%', padding: '16px', fontSize: '18px', borderRadius: '8px', 
              border: '2px solid #444', backgroundColor: '#0a0a0a', color: 'white', 
              marginBottom: '40px', boxSizing: 'border-box', outline: 'none', textAlign: 'center',
              letterSpacing: '2px', fontWeight: '600'
            }} 
          />

          {/* Map Preview */}
          <div style={{ marginBottom: '30px', borderRadius: '12px', overflow: 'hidden', height: '180px', border: '1px solid #333' }}>
            {currentLocation ? (
              <MapContainer center={currentLocation} zoom={15} style={{ height: '100%', width: '100%' }} zoomControl={false} dragging={false} scrollWheelZoom={false}>
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; OpenStreetMap'
                />
                <Marker position={currentLocation} icon={redPulseIcon}>
                  <Popup>Current Location</Popup>
                </Marker>
              </MapContainer>
            ) : mapError ? (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', color: '#ff5252', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
                Location unavailable.<br/>Please enable GPS.
              </div>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', color: '#888', fontSize: '14px' }}>
                Acquiring GPS Signal...
              </div>
            )}
          </div>

          {!status ? (
            <button 
              onClick={handlePanic} 
              disabled={loading}
              className="panic-btn"
              style={{ 
                width: '200px', height: '200px', borderRadius: '50%', 
                backgroundColor: loading ? '#b71c1c' : '#e53935', 
                color: 'white', fontSize: '28px', fontWeight: '900', 
                border: '8px solid #ffcdd2', cursor: loading ? 'not-allowed' : 'pointer', 
                transition: 'all 0.2s', margin: '0 auto', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
              }}>
              {loading ? 'SENDING...' : 'SOS'}
            </button>
          ) : (
            <div style={{ 
              padding: '25px', borderRadius: '12px', 
              backgroundColor: status.success ? '#1b5e20' : '#b71c1c',
              border: `1px solid ${status.success ? '#4caf50' : '#ff5252'}`
            }}>
              <h3 style={{ color: 'white', margin: '0 0 10px 0', fontSize: '22px' }}>
                {status.success ? '✓ DISPATCH NOTIFIED' : '⚠ ALERT FAILED'}
              </h3>
              <p style={{ color: '#eee', margin: '0 0 20px 0', fontSize: '15px' }}>{status.message}</p>
              
              <button onClick={() => setStatus(null)}
                style={{ 
                  padding: '12px 25px', backgroundColor: 'rgba(255,255,255,0.2)', 
                  color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' 
                }}>
                RESET SYSTEM
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Panic;
