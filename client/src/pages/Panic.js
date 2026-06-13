import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { useToast } from '../components/Toast';
import Spinner from '../components/Spinner';
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
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
  className: 'pulsing-leaflet-icon'
});

function Panic() {
  const { addToast } = useToast();
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

  const triggerOfflineSMS = (lat, lon) => {
    const message = `[EMERGENCY SOS - SafeTrail] Need Help! My Location: Lat ${lat ? lat.toFixed(5) : 'Unknown'}, Lon ${lon ? lon.toFixed(5) : 'Unknown'}. Digital ID: ${digitalId}`;
    setStatus({ success: false, message: "No internet. Triggering Offline SMS..." });
    addToast('Opening SMS for Offline SOS', 'error');
    setTimeout(() => { window.location.href = `sms:112?body=${encodeURIComponent(message)}`; setLoading(false); }, 1500);
  };

  const handlePanic = async () => {
    if (!digitalId) { alert('Please enter your Digital ID'); return; }
    setLoading(true);

    if (!navigator.onLine && currentLocation) { triggerOfflineSMS(currentLocation[0], currentLocation[1]); return; }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const res = await axios.post(`${API_URL}/api/alerts/panic`, {
          digitalId, latitude: pos.coords.latitude, longitude: pos.coords.longitude
        });
        setStatus({ success: true, message: res.data.message });
        addToast('SOS Alert Sent Successfully!', 'success');
        setLoading(false);
      } catch (err) {
        if (!err.response) triggerOfflineSMS(pos.coords.latitude, pos.coords.longitude);
        else {
          const errMsg = err.response?.data?.message || 'Error communicating with dispatch';
          setStatus({ success: false, message: errMsg });
          addToast(errMsg, 'error');
          setLoading(false);
        }
      }
    }, () => { 
      setStatus({ success: false, message: 'CRITICAL: Location access denied. Enable GPS.' }); 
      setLoading(false); 
    });
  };

  return (
    <div style={{ 
      minHeight: '100vh', display: 'flex', 
      flexDirection: 'column', alignItems: 'center', 
      fontFamily: '"Outfit", sans-serif', padding: '120px 20px 60px 20px',
      background: 'radial-gradient(circle at center, #0f172a 0%, #020617 100%)'
    }}>
      <style>
        {`
          @keyframes radarPulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7); }
            70% { transform: scale(1.05); box-shadow: 0 0 0 60px rgba(220, 38, 38, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
          }
          .panic-btn {
            animation: radarPulse 2s infinite cubic-bezier(0.66, 0, 0, 1);
            background: linear-gradient(135deg, #ef4444 0%, #991b1b 100%);
          }
          .panic-btn:hover {
            animation: none;
            transform: scale(1.05);
            box-shadow: 0 0 50px rgba(239, 68, 68, 0.8);
          }
          .pulsing-leaflet-icon {
            border-radius: 50%;
            background-color: rgba(239, 68, 68, 0.6);
            animation: radarPulse 2s infinite;
          }
        `}
      </style>
      
      <div style={{ maxWidth: '550px', width: '100%', textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
        <h2 style={{ color: '#ef4444', fontSize: '42px', marginBottom: '15px', fontWeight: '800', letterSpacing: '4px', textShadow: '0 0 20px rgba(239,68,68,0.5)' }}>
          EMERGENCY SOS
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '16px', lineHeight: '1.6', marginBottom: '40px', padding: '0 20px', fontFamily: '"Inter", sans-serif' }}>
          Press the button below only in a severe emergency. Your live GPS coordinates will be instantly broadcasted to the nearest active patrol unit.
        </p>

        <div className="glassmorphism" style={{ 
          padding: '40px', borderRadius: '24px', 
          border: '1px solid rgba(239, 68, 68, 0.3)',
          background: 'rgba(15, 23, 42, 0.7)',
          boxShadow: '0 30px 60px rgba(0,0,0,0.5), inset 0 0 20px rgba(239, 68, 68, 0.1)'
        }}>
          
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '10px', textAlign: 'left' }}>
              DIGITAL ID AUTHENTICATION
            </label>
            <input 
              placeholder="ENTER DIGITAL ID" 
              value={digitalId}
              onChange={(e) => setDigitalId(e.target.value.toUpperCase())}
              style={{ 
                width: '100%', padding: '20px', fontSize: '20px', borderRadius: '12px', 
                border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(0,0,0,0.5)', 
                color: 'white', boxSizing: 'border-box', outline: 'none', textAlign: 'center',
                letterSpacing: '4px', fontWeight: '700', fontFamily: 'monospace',
                transition: 'border 0.3s'
              }}
              onFocus={(e) => e.target.style.border = '1px solid #ef4444'}
              onBlur={(e) => e.target.style.border = '1px solid rgba(255,255,255,0.1)'}
            />
          </div>

          {/* Map Preview */}
          <div style={{ marginBottom: '40px', borderRadius: '16px', overflow: 'hidden', height: '200px', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000, backgroundColor: 'rgba(0,0,0,0.7)', padding: '5px 10px', borderRadius: '8px', color: '#38bdf8', fontSize: '12px', fontWeight: 'bold', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
              LIVE SATELLITE LINK
            </div>
            {currentLocation ? (
              <MapContainer center={currentLocation} zoom={16} style={{ height: '100%', width: '100%' }} zoomControl={false} dragging={false} scrollWheelZoom={false}>
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                <Marker position={currentLocation} icon={redPulseIcon}>
                  <Popup>Distress Location Origin</Popup>
                </Marker>
              </MapContainer>
            ) : mapError ? (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617', color: '#ef4444', fontSize: '14px', textAlign: 'center', fontFamily: '"Inter", sans-serif' }}>
                📡 SAT-LINK FAILED.<br/>Ensure GPS is enabled.
              </div>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617', color: '#38bdf8', fontSize: '14px', fontFamily: '"Inter", sans-serif', animation: 'pulse 1s infinite' }}>
                Acquiring GPS Lock...
              </div>
            )}
          </div>

          {!status ? (
            <button 
              onClick={handlePanic} 
              disabled={loading}
              className="panic-btn"
              style={{ 
                width: '220px', height: '220px', borderRadius: '50%', 
                color: 'white', fontSize: '36px', fontWeight: '900', 
                border: '10px solid #fca5a5', cursor: loading ? 'not-allowed' : 'pointer', 
                transition: 'all 0.3s', margin: '0 auto', display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '15px',
                textShadow: '0 4px 10px rgba(0,0,0,0.5)', letterSpacing: '2px'
              }}>
              {loading ? <><Spinner size={40} /> <span style={{fontSize: '20px'}}>SENDING</span></> : 'SOS'}
            </button>
          ) : (
            <div style={{ 
              padding: '30px', borderRadius: '16px', 
              backgroundColor: status.success ? 'rgba(22, 101, 52, 0.2)' : 'rgba(153, 27, 27, 0.2)',
              border: `1px solid ${status.success ? '#22c55e' : '#ef4444'}`,
              animation: 'fadeIn 0.5s ease'
            }}>
              <h3 style={{ color: status.success ? '#4ade80' : '#fca5a5', margin: '0 0 15px 0', fontSize: '24px', letterSpacing: '1px' }}>
                {status.success ? '✓ UNIT DISPATCHED' : '⚠ ALERT FAILED'}
              </h3>
              <p style={{ color: '#cbd5e1', margin: '0 0 25px 0', fontSize: '16px', fontFamily: '"Inter", sans-serif', lineHeight: 1.5 }}>{status.message}</p>
              
              <button onClick={() => setStatus(null)}
                style={{ 
                  width: '100%', padding: '16px', backgroundColor: 'rgba(255,255,255,0.1)', 
                  color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold',
                  letterSpacing: '1px', transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              >
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
