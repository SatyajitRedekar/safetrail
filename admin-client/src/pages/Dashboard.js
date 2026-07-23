import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { jsPDF } from 'jspdf';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function Dashboard() {
  const [alerts, setAlerts] = useState([]);
  const [tourists, setTourists] = useState([]);
  const [selectedFir, setSelectedFir] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [selectedTourist, setSelectedTourist] = useState(null);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSeverity, setBroadcastSeverity] = useState('warning');
  const [anomalies, setAnomalies] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [searchId, setSearchId] = useState('');
  
  // Zone Drawing State
  const [dbZones, setDbZones] = useState([]);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [currentPolygon, setCurrentPolygon] = useState([]);
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneType, setNewZoneType] = useState('HIGH_RISK');
  const [newZoneDensity, setNewZoneDensity] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) {
      navigate('/admin/login');
      return;
    }

    const fetchData = () => {
      axios.get(`${API_URL}/api/alerts/`)
        .then(res => setAlerts(res.data)).catch(console.log);
      axios.get(`${API_URL}/api/tourists/`)
        .then(res => setTourists(res.data)).catch(console.log);
      axios.get(`${API_URL}/api/zones/`)
        .then(res => setDbZones(res.data)).catch(console.log);
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  const getZoneDensity = (lat, lon, maxCapacity) => {
    const count = tourists.filter(t => 
      t.location && 
      Math.abs(t.location.latitude - lat) < 3 && 
      Math.abs(t.location.longitude - lon) < 3
    ).length;
    
    const baseDensity = Math.min(Math.round((count / maxCapacity) * 100), 100);
    const timeSeed = Math.floor(new Date().getTime() / 5000); // changes every 5 seconds
    const fluctuation = Math.round(Math.sin(lat + lon + timeSeed) * 12);
    const mockBase = Math.abs(Math.round(Math.sin(lat * 31 + lon * 17) * 45)) + 30; // mock value between 30 and 75
    
    return Math.max(15, Math.min(95, (baseDensity || mockBase) + fluctuation));
  };

  const runAnomalyScan = async () => {
    setIsScanning(true);
    try {
      const res = await axios.post(`${API_URL}/api/tourists/analyze`);
      setAnomalies(res.data.flaggedTourists || []);
      const resT = await axios.get(`${API_URL}/api/tourists/`);
      setTourists(resT.data);
    } catch (e) {
      console.log(e);
    }
    setTimeout(() => setIsScanning(false), 1000); // Artificial delay for effect
  };

  const simulateDropOff = async (digitalId) => {
    try {
      const dropOffDate = new Date();
      dropOffDate.setHours(dropOffDate.getHours() - 13); // 13 hours ago -> MISSING
      await axios.put(`${API_URL}/api/tourists/${digitalId}/ping`, { simulatedLastPing: dropOffDate.toISOString() });
      runAnomalyScan();
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeleteAlert = async (id) => {
    if (window.confirm('Are you sure you want to dismiss this incident alert?')) {
      try {
        await axios.delete(`${API_URL}/api/alerts/${id}`);
        setAlerts(alerts.filter(a => a._id !== id));
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleDeleteTourist = async (id) => {
    if (window.confirm('Are you sure you want to remove this tourist from the registry?')) {
      try {
        await axios.delete(`${API_URL}/api/tourists/${id}`);
        setTourists(tourists.filter(t => t._id !== id));
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleSaveZone = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/zones/`, {
        name: newZoneName,
        type: newZoneType,
        coordinates: currentPolygon,
        density: newZoneDensity ? Number(newZoneDensity) : null
      });
      setDbZones([res.data, ...dbZones]);
      setIsDrawingMode(false);
      setCurrentPolygon([]);
      setShowZoneModal(false);
      setNewZoneName('');
      setNewZoneType('HIGH_RISK');
      setNewZoneDensity('');
    } catch (e) {
      alert(e.response?.data?.message || 'Error saving zone');
    }
  };

  const handleDeleteZone = async (id) => {
    if (window.confirm('Are you sure you want to delete this custom zone?')) {
      try {
        await axios.delete(`${API_URL}/api/zones/${id}`);
        setDbZones(dbZones.filter(z => z._id !== id));
      } catch (e) {
        console.log(e);
      }
    }
  };

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        if (isDrawingMode) {
          setCurrentPolygon(prev => [...prev, { lat: e.latlng.lat, lng: e.latlng.lng }]);
        }
      },
    });
    return null;
  };

  const delhiDensity = getZoneDensity(28.7041, 77.1025, 5);
  const mumbaiDensity = getZoneDensity(19.0760, 72.8777, 5);
  const goaDensity = getZoneDensity(15.2993, 74.1240, 5);

  const getPolygonDensity = (polygonCoords, maxCapacity = 5) => {
    if (!polygonCoords || polygonCoords.length === 0) return 15;
    const lats = polygonCoords.map(c => c.lat);
    const lngs = polygonCoords.map(c => c.lng);
    const minLat = Math.min(...lats), maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
    
    const count = tourists.filter(t => {
      const lat = t.location?.lat || t.location?.latitude;
      const lng = t.location?.lng || t.location?.longitude;
      if (!lat || !lng) return false;
      return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
    }).length;
    
    const baseDensity = Math.min(Math.round((count / maxCapacity) * 100), 100);
    const timeSeed = Math.floor(new Date().getTime() / 5000);
    const midLat = (minLat + maxLat) / 2;
    const midLng = (minLng + maxLng) / 2;
    const fluctuation = Math.round(Math.sin(midLat + midLng + timeSeed) * 10);
    const mockBase = Math.abs(Math.round(Math.sin(midLat * 43 + midLng * 19) * 35)) + 25; // mock value between 25 and 60
    
    return Math.max(10, Math.min(90, (baseDensity || mockBase) + fluctuation));
  };

  const generateEFIRPdf = () => {
    if (!selectedFir) return;
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.setTextColor(26, 35, 126); 
    doc.text('GOVERNMENT OF INDIA', 105, 20, { align: 'center' });
    doc.setFontSize(16);
    doc.setTextColor(229, 57, 53); 
    doc.text('ELECTRONIC FIRST INFORMATION REPORT (E-FIR)', 105, 30, { align: 'center' });
    
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    const touristName = selectedFir.touristId?.name || selectedFir.name || 'Unknown Tourist';
    const digitalId = selectedFir.touristId?.digitalId || selectedFir.digitalId || 'N/A';
    const lat = (selectedFir.location?.lat || selectedFir.location?.latitude || 0).toFixed(5);
    const lng = (selectedFir.location?.lng || selectedFir.location?.longitude || 0).toFixed(5);
    
    doc.text(`E-FIR Reference No: ST-${Math.floor(Math.random() * 100000)}`, 20, 50);
    doc.text(`Date & Time: ${new Date().toLocaleString()}`, 20, 60);
    doc.text(`Dispatch Officer ID: admin`, 20, 70);
    
    doc.setFont('helvetica', 'bold');
    doc.text('INCIDENT DETAILS:', 20, 90);
    doc.setFont('helvetica', 'normal');
    doc.text(`Type of Emergency: SOS PANIC ALERT`, 20, 100);
    doc.text(`GPS Coordinates: Lat ${lat}, Lng ${lng}`, 20, 110);
    doc.text(`Description: Emergency SOS trigger received via SafeTravel`, 20, 120);
    doc.text(`mobile client indicating immediate severe distress.`, 20, 127);
    
    doc.setFont('helvetica', 'bold');
    doc.text('VICTIM / COMPLAINANT INFORMATION:', 20, 150);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${touristName}`, 20, 160);
    doc.text(`Digital Tourist ID: ${digitalId}`, 20, 170);
    
    doc.setFont('helvetica', 'bold');
    doc.text('OFFICIAL STATUS: HIGH PRIORITY (PENDING INVESTIGATION)', 20, 200);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('This is a digitally generated document by the SafeTravel Tourist Safety System.', 105, 270, { align: 'center' });
    doc.text('Valid only for official police jurisdiction use.', 105, 275, { align: 'center' });
    
    doc.save(`SafeTravel_EFIR_${touristName.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div style={{ 
      fontFamily: '"Inter", sans-serif', 
      backgroundColor: '#020617', 
      backgroundImage: 'radial-gradient(ellipse at top left, rgba(30, 58, 138, 0.3), transparent 50%), radial-gradient(ellipse at bottom right, rgba(139, 92, 246, 0.15), transparent 50%)',
      color: '#e2e8f0', 
      minHeight: '100vh',
      paddingBottom: '50px'
    }}>
      
      {/* Enterprise Header */}
      <div style={{ 
        backgroundColor: 'rgba(2, 6, 23, 0.8)', 
        backdropFilter: 'blur(20px)', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)', 
        padding: '15px 40px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        position: 'sticky', 
        top: 0, 
        zIndex: 100 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(14, 165, 233, 0.4)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', letterSpacing: '0.5px', color: 'white' }}>SAFETRAVEL_NEXUS</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%', boxShadow: '0 0 8px #10b981', animation: 'pulse 2s infinite' }}></span>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '12px', fontWeight: '500', letterSpacing: '1px' }}>SYSTEM OPERATIONAL • ENCRYPTED CONNECTION</p>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            onClick={() => setShowBroadcastModal(true)}
            style={headerBtnStyle}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            BROADCAST
          </button>
          <button 
            onClick={() => { localStorage.removeItem('adminToken'); navigate('/'); }}
            style={{ ...headerBtnStyle, color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"></path></svg>
            DISCONNECT
          </button>
        </div>
      </div>

      <div style={{ padding: '30px 40px', maxWidth: '1600px', margin: '0 auto' }}>

        {/* Top KPI Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '30px' }}>
          <KPICard 
            title="ACTIVE TOURISTS" 
            value={tourists.length} 
            trend="+12%" 
            trendUp={true} 
            color="#38bdf8" 
            subtext="Tracked securely via GPS" 
          />
          <KPICard 
            title="CRITICAL ALERTS" 
            value={alerts.length} 
            trend={alerts.length > 0 ? "URGENT" : "STABLE"} 
            trendUp={false} 
            color={alerts.length > 0 ? "#ef4444" : "#22c55e"} 
            subtext="Pending verification" 
          />
          <KPICard 
            title="AVG SAFETY SCORE" 
            value="98.4" 
            trend="+0.2" 
            trendUp={true} 
            color="#10b981" 
            subtext="Across all monitored zones" 
          />
          <KPICard 
            title="UNITS DISPATCHED" 
            value="0" 
            trend="STANDBY" 
            trendUp={true} 
            color="#8b5cf6" 
            subtext="Available patrol units: 24" 
          />
        </div>

        {/* Main Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '30px' }}>
          
          {/* Map Container */}
          <div style={panelStyle}>
            <div style={panelHeaderStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
                <span>GLOBAL TELEMETRY MAP</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontSize: '11px', color: '#64748b' }}>LAST SYNC: {new Date().toLocaleTimeString()}</span>
                <span style={{ fontSize: '11px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '4px 8px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>LIVE STREAM</span>
              </div>
            </div>
            <div style={{ height: '450px', width: '100%', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1, pointerEvents: 'none', boxShadow: 'inset 0 0 40px rgba(2, 6, 23, 0.8)' }}></div>
              
              <div style={{ position: 'absolute', top: 15, right: 15, zIndex: 1000 }}>
                {!isDrawingMode ? (
                  <button onClick={() => setIsDrawingMode(true)} style={{ ...actionBtnStyle, backgroundColor: '#38bdf8', color: '#0f172a', border: 'none', padding: '10px 15px', boxShadow: '0 4px 10px rgba(56, 189, 248, 0.4)' }}>+ DRAW NEW ZONE</button>
                ) : (
                  <div style={{ display: 'flex', gap: '10px', backgroundColor: 'rgba(2, 6, 23, 0.8)', padding: '10px', borderRadius: '8px', border: '1px solid #38bdf8' }}>
                    <div style={{ color: 'white', fontSize: '12px', display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                      {currentPolygon.length < 3 ? `Click map to add points (${currentPolygon.length}/3 min)` : `Points: ${currentPolygon.length}`}
                    </div>
                    {currentPolygon.length >= 3 && (
                      <button onClick={() => setShowZoneModal(true)} style={{ ...actionBtnStyle, backgroundColor: '#10b981', color: 'white', border: 'none' }}>FINISH ZONE</button>
                    )}
                    <button onClick={() => { setIsDrawingMode(false); setCurrentPolygon([]); }} style={{ ...actionBtnStyle, backgroundColor: '#ef4444', color: 'white', border: 'none' }}>CANCEL</button>
                  </div>
                )}
              </div>

              <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%', backgroundColor: '#020617' }} zoomControl={false}>
                <TileLayer 
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' 
                />
                
                <MapClickHandler />

                {/* Render Saved Zones */}
                {dbZones.map((z, idx) => {
                  const colors = { HIGH_RISK: '#ef4444', WARNING: '#f59e0b', RESTRICTED: '#8b5cf6', SAFE: '#10b981' };
                  const color = colors[z.type] || '#38bdf8';
                  return (
                    <Polygon key={`zone-${idx}`} positions={z.coordinates.map(c => [c.lat, c.lng])} pathOptions={{ color, fillColor: color, fillOpacity: 0.35, weight: 2 }}>
                      <Popup>
                        <strong style={{ color }}>{z.name}</strong><br/>
                        Type: {z.type.replace('_', ' ')}
                      </Popup>
                    </Polygon>
                  );
                })}

                {/* Render Currently Drawing Zone */}
                {currentPolygon.length > 0 && (
                  <Polygon positions={currentPolygon.map(c => [c.lat, c.lng])} pathOptions={{ color: '#38bdf8', fillColor: '#38bdf8', fillOpacity: 0.4, dashArray: '5, 10' }} />
                )}
                
                {tourists.map((t, idx) => {
                  const lat = t.location?.lat || t.location?.latitude;
                  const lng = t.location?.lng || t.location?.longitude;
                  const isNormal = t.anomalyStatus === 'NORMAL';
                  return lat && lng ? (
                    <Marker key={`tourist-${idx}`} position={[lat, lng]} icon={isNormal ? greenIcon : redIcon}>
                      <Popup>
                        <strong>{t.name}</strong><br/>
                        Digital ID: {t.digitalId}<br/>
                        Status: {t.anomalyStatus || 'Safe'}
                      </Popup>
                    </Marker>
                  ) : null;
                })}
                
                {alerts.map((a, idx) => {
                  const lat = a.location?.lat || a.location?.latitude;
                  const lng = a.location?.lng || a.location?.longitude;
                  return lat && lng ? (
                    <Marker key={`alert-${idx}`} position={[lat, lng]} icon={redIcon}>
                      <Popup>
                        <strong style={{ color: '#ef4444' }}>{a.name}</strong><br/>
                        Digital ID: {a.digitalId}<br/>
                        <span style={{ color: '#ef4444' }}>Status: SOS TRIGGERED</span>
                      </Popup>
                    </Marker>
                  ) : null;
                })}
              </MapContainer>
            </div>
          </div>

          {/* Crowd Analytics */}
          <div style={panelStyle}>
            <div style={panelHeaderStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M12 20V10M18 20V4M6 20v-4"></path></svg>
                <span>CROWD DENSITY ANALYTICS</span>
              </div>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
              <DensityBar label="Delhi NCR Node" density={delhiDensity} location="North Zone" />
              <DensityBar label="Mumbai Gateway" density={mumbaiDensity} location="West Zone" />
              <DensityBar label="Goa Coastal Belt" density={goaDensity} location="South-West Zone" />
              
              {dbZones.map((z) => (
                <DensityBar 
                  key={z._id} 
                  label={z.name} 
                  density={z.density !== undefined && z.density !== null ? z.density : getPolygonDensity(z.coordinates)} 
                  location={z.type.replace('_', ' ')} 
                  onDelete={() => handleDeleteZone(z._id)} 
                />
              ))}
              
              <div style={{ marginTop: 'auto', backgroundColor: 'rgba(14, 165, 233, 0.05)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(14, 165, 233, 0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10H12V2z"></path></svg>
                  <span style={{ fontSize: '11px', color: '#38bdf8', letterSpacing: '1px', fontWeight: '600' }}>AI SYSTEM INSIGHT</span>
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5 }}>
                  {delhiDensity > 80 ? 'Anomalous clustering detected in North Zone. Recommend preemptive unit deployment to prevent gridlock.' : 'Traffic patterns across all monitored nodes are operating within normal parameters.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Verify Digital ID Search Bar */}
        <div style={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '40px', marginBottom: '30px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
          <h2 style={{ color: '#38bdf8', fontSize: '28px', fontFamily: '"Outfit", sans-serif', letterSpacing: '1px', margin: '0 0 10px 0', textTransform: 'uppercase' }}>VERIFY DIGITAL ID</h2>
          <p style={{ color: '#94a3b8', fontSize: '15px', margin: '0 0 30px 0' }}>Enter an Official SafeTravel ID to view the traveler's digital profile.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', maxWidth: '600px', margin: '0 auto' }}>
            <input 
              type="text" 
              placeholder="ST-XXXXXXXXXXXX" 
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              style={{ flex: 1, padding: '14px 20px', backgroundColor: 'rgba(2, 6, 23, 0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '16px', letterSpacing: '2px', outline: 'none' }}
              onFocus={(e) => e.target.style.border = '1px solid #38bdf8'}
              onBlur={(e) => e.target.style.border = '1px solid rgba(255,255,255,0.1)'}
            />
            <button 
              onClick={() => {
                const found = tourists.find(t => t.digitalId === searchId.trim());
                if (found) {
                  setSelectedTourist(found);
                } else {
                  alert('Digital ID not found in registry');
                }
              }}
              style={{ padding: '0 30px', backgroundColor: '#0ea5e9', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', letterSpacing: '1px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(14, 165, 233, 0.4)' }}>
              SEARCH
            </button>
          </div>
        </div>

        {/* Tables Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          
          {/* Alerts Table */}
          <div style={panelStyle}>
            <div style={panelHeaderStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%' }}></span>
                <span style={{ color: '#f8fafc' }}>ACTIVE INCIDENTS</span>
              </div>
              <span style={{ fontSize: '11px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '4px 8px', borderRadius: '4px' }}>{alerts.length} PENDING</span>
            </div>
            <div style={{ padding: '0', overflowX: 'auto' }}>
              {alerts.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>NO ACTIVE INCIDENTS DETECTED</div>
              ) : (
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th>ID / SUBJECT</th>
                      <th>COORDINATES</th>
                      <th>TIME</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alerts.map((alert, i) => (
                      <tr key={i} style={trStyle}>
                        <td>
                          <div style={{ fontWeight: '500', color: '#f8fafc' }}>{alert.touristId?.name || alert.name || 'Unknown'}</div>
                          <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>{alert.touristId?.digitalId || alert.digitalId || 'N/A'}</div>
                        </td>
                        <td style={{ fontFamily: 'monospace', color: '#94a3b8' }}>
                          {(alert.location?.lat || alert.location?.latitude || 0).toFixed(4)}, {(alert.location?.lng || alert.location?.longitude || 0).toFixed(4)}
                        </td>
                        <td style={{ fontSize: '12px', color: '#94a3b8' }}>{new Date(alert.createdAt).toLocaleTimeString()}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              onClick={() => setSelectedFir(alert)}
                              style={actionBtnStyle}>
                              PROCESS E-FIR
                            </button>
                            <button onClick={() => handleDeleteAlert(alert._id)} style={{ ...actionBtnStyle, backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '6px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Delete Alert">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Tourists Table */}
          <div style={panelStyle}>
            <div style={panelHeaderStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                <span style={{ color: '#f8fafc' }}>TOURIST REGISTRY</span>
              </div>
            </div>
            <div style={{ padding: '0', overflowX: 'auto' }}>
              {tourists.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>REGISTRY EMPTY</div>
              ) : (
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th>SUBJECT NAME</th>
                      <th>DIGITAL ID</th>
                      <th>CONTACT</th>
                      <th>STATUS</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tourists.map((t, i) => (
                      <tr key={i} style={trStyle}>
                        <td>
                          <span onClick={() => setSelectedTourist(t)} style={{ fontWeight: '500', color: '#38bdf8', cursor: 'pointer' }}>
                            {t.name}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={codeBadgeStyle}>{t.digitalId}</span>
                            {t.blockchainHash && (
                              <span title={`Ledger Hash: ${t.blockchainHash}`} style={{ fontSize: '12px', cursor: 'help' }}>🔗</span>
                            )}
                          </div>
                        </td>
                        <td style={{ fontSize: '13px', color: '#94a3b8' }}>{t.phone}</td>
                        <td>
                          {t.anomalyStatus === 'NORMAL' ? (
                            <span style={{ fontSize: '11px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%' }}></span> NORMAL</span>
                          ) : (
                            <span style={{ fontSize: '11px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}><span style={{ width: '6px', height: '6px', backgroundColor: '#ef4444', borderRadius: '50%', animation: 'pulse 1s infinite' }}></span> {t.anomalyStatus}</span>
                          )}
                        </td>
                        <td>
                          <button onClick={() => handleDeleteTourist(t._id)} style={{ ...actionBtnStyle, backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '6px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Delete Tourist">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>
      </div>
      
      {/* Modals remain structurally similar but would inherit the new CSS classes in a real app */}
      {showBroadcastModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', color: 'white', fontWeight: '600' }}>INITIALIZE BROADCAST</h2>
            <div style={{ marginBottom: '15px' }}>
              <label style={modalLabelStyle}>SEVERITY LEVEL</label>
              <select value={broadcastSeverity} onChange={(e) => setBroadcastSeverity(e.target.value)} style={modalInputStyle}>
                <option value="warning">WARNING (ORANGE)</option>
                <option value="critical">CRITICAL (RED)</option>
              </select>
            </div>
            <div style={{ marginBottom: '25px' }}>
              <label style={modalLabelStyle}>PAYLOAD MESSAGE</label>
              <textarea value={broadcastMessage} onChange={(e) => setBroadcastMessage(e.target.value)} style={{...modalInputStyle, height: '100px', resize: 'none'}} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={{ flex: 1, padding: '12px', backgroundColor: '#38bdf8', color: '#020617', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }} onClick={() => setShowBroadcastModal(false)}>TRANSMIT</button>
              <button style={{ flex: 1, padding: '12px', backgroundColor: 'transparent', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }} onClick={() => setShowBroadcastModal(false)}>ABORT</button>
            </div>
          </div>
        </div>
      )}

      {selectedFir && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
              <h2 style={{ margin: 0, color: 'white', fontSize: '18px' }}>E-FIR PROTOCOL</h2>
              <button onClick={() => setSelectedFir(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '20px' }}>✕</button>
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6', backgroundColor: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '8px' }}>
              <span style={{ color: '#38bdf8' }}>&gt; INITIALIZING INCIDENT REPORT...</span><br/><br/>
              <strong>REF:</strong> ST-{Math.floor(Math.random() * 100000)}<br/>
              <strong>TIME:</strong> {new Date().toLocaleString()}<br/>
              <strong>SUBJ:</strong> {selectedFir.touristId?.name || selectedFir.name || 'Unknown'} [{selectedFir.touristId?.digitalId || selectedFir.digitalId || 'N/A'}]<br/>
              <strong>LOC:</strong> {Number(selectedFir.location?.lat || selectedFir.location?.latitude || 0).toFixed(5)}, {Number(selectedFir.location?.lng || selectedFir.location?.longitude || 0).toFixed(5)}<br/><br/>
              <span style={{ color: '#ef4444' }}>! SEVERE DISTRESS SIGNAL DETECTED. IMMEDIATE RESPONSE REQUIRED.</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button style={{ flex: 1, padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }} onClick={generateEFIRPdf}>DOWNLOAD PDF</button>
              <button style={{ flex: 1, padding: '12px', backgroundColor: 'transparent', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', cursor: 'pointer' }} onClick={() => setSelectedFir(null)}>DISMISS</button>
            </div>
          </div>
        </div>
      )}

      {selectedTourist && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, width: '480px', padding: 0, overflow: 'hidden', border: '1px solid #38bdf8', boxShadow: '0 0 30px rgba(56, 189, 248, 0.2)' }}>
            <div style={{ padding: '30px', position: 'relative', background: 'radial-gradient(circle at top right, rgba(56, 189, 248, 0.15), transparent 70%)' }}>
              <button onClick={() => setSelectedTourist(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '20px' }}>✕</button>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', letterSpacing: '1.5px', fontWeight: '600' }}>GOVERNMENT OF INDIA</div>
                  <div style={{ fontSize: '22px', color: 'white', fontWeight: '800', fontFamily: '"Outfit", sans-serif', letterSpacing: '1px', marginTop: '2px' }}>SAFETRAVEL PASS</div>
                </div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: 'rgba(255,255,255,0.1)', fontFamily: '"Outfit", sans-serif' }}>IN</div>
              </div>

              <div style={{ marginTop: '25px', borderBottom: '1px solid rgba(56, 189, 248, 0.3)', paddingBottom: '15px' }}>
                <div style={{ fontSize: '11px', color: '#38bdf8', letterSpacing: '1px', fontWeight: '600', marginBottom: '5px' }}>DIGITAL ID NUMBER</div>
                <div style={{ fontSize: '26px', color: 'white', fontWeight: '700', fontFamily: 'monospace', letterSpacing: '2px', textShadow: '0 0 10px rgba(255,255,255,0.3)' }}>{selectedTourist.digitalId}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginTop: '25px' }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', letterSpacing: '1px', marginBottom: '5px' }}>FULL NAME</div>
                  <div style={{ fontSize: '16px', color: 'white', fontWeight: '600' }}>{selectedTourist.name}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', letterSpacing: '1px', marginBottom: '5px' }}>PASSPORT / AADHAAR</div>
                  <div style={{ fontSize: '16px', color: 'white', fontWeight: '600' }}>{selectedTourist.passport || 'IND123456'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', letterSpacing: '1px', marginBottom: '5px' }}>EMERGENCY CONTACT</div>
                  <div style={{ fontSize: '16px', color: 'white', fontWeight: '600' }}>{selectedTourist.phone || '9888888888'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', letterSpacing: '1px', marginBottom: '5px' }}>RISK ZONE</div>
                  <div style={{ fontSize: '16px', color: selectedTourist.anomalyStatus === 'NORMAL' ? '#10b981' : '#ef4444', fontWeight: '600' }}>
                    {selectedTourist.anomalyStatus === 'NORMAL' ? 'LOW RISK' : 'HIGH RISK'}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '35px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', letterSpacing: '1px', marginBottom: '5px' }}>ISSUE DATE</div>
                  <div style={{ fontSize: '14px', color: 'white', fontWeight: '500' }}>{selectedTourist.createdAt ? new Date(selectedTourist.createdAt).toLocaleDateString('en-GB') : '16/05/2026'}</div>
                </div>
                <div style={{ display: 'flex', gap: '2px', height: '35px' }}>
                  {[2,4,1,3,2,1,4,2,1,2,3,1,2,4,1,2,3,1,4,2].map((w, i) => (
                    <div key={i} style={{ width: `${w}px`, backgroundColor: '#cbd5e1' }}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showZoneModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', color: 'white', fontWeight: '600' }}>SAVE CUSTOM ZONE</h2>
            <div style={{ marginBottom: '15px' }}>
              <label style={modalLabelStyle}>ZONE NAME / IDENTIFIER</label>
              <input 
                type="text" 
                value={newZoneName} 
                onChange={e => setNewZoneName(e.target.value)} 
                placeholder="e.g. Downtown Checkpoint Alpha"
                style={modalInputStyle} 
              />
            </div>
            <div style={{ marginBottom: '25px' }}>
              <label style={modalLabelStyle}>ZONE TYPE TAG</label>
              <select value={newZoneType} onChange={e => setNewZoneType(e.target.value)} style={modalInputStyle}>
                <option value="HIGH_RISK">HIGH RISK ZONE (RED)</option>
                <option value="WARNING">WARNING ZONE (ORANGE)</option>
                <option value="RESTRICTED">RESTRICTED ZONE (PURPLE)</option>
                <option value="SAFE">SAFE ZONE (GREEN)</option>
              </select>
            </div>
            <div style={{ marginBottom: '25px' }}>
              <label style={modalLabelStyle}>CROWD DENSITY (%) (OPTIONAL)</label>
              <input 
                type="number" 
                min="0" 
                max="100" 
                value={newZoneDensity} 
                onChange={e => setNewZoneDensity(e.target.value)} 
                placeholder="e.g. 75 (Leave empty for dynamic)"
                style={modalInputStyle} 
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={handleSaveZone} 
                disabled={!newZoneName}
                style={{ flex: 1, padding: '12px', backgroundColor: newZoneName ? '#38bdf8' : '#334155', color: '#020617', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: newZoneName ? 'pointer' : 'not-allowed' }}>
                CONFIRM & SAVE
              </button>
              <button onClick={() => setShowZoneModal(false)} style={{ flex: 1, padding: '12px', backgroundColor: 'transparent', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>CANCEL</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- NEW COMPONENT DESIGNS ---

const KPICard = ({ title, value, trend, trendUp, color, subtext }) => (
  <div style={{ 
    backgroundColor: 'rgba(30, 41, 59, 0.4)', 
    backdropFilter: 'blur(12px)', 
    border: '1px solid rgba(255,255,255,0.05)', 
    borderRadius: '12px', 
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    position: 'relative',
    overflow: 'hidden'
  }}>
    <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`, transform: 'translate(30%, -30%)' }}></div>
    <h3 style={{ margin: '0 0 15px 0', fontSize: '11px', color: '#94a3b8', letterSpacing: '1px', fontWeight: '600' }}>{title}</h3>
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '15px', marginBottom: '8px' }}>
      <div style={{ fontSize: '36px', fontFamily: '"Outfit", sans-serif', fontWeight: '700', color: 'white', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '12px', fontWeight: '600', color: trendUp ? '#10b981' : '#ef4444', backgroundColor: trendUp ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', padding: '4px 8px', borderRadius: '4px', marginBottom: '4px' }}>
        {trend}
      </div>
    </div>
    <div style={{ fontSize: '12px', color: '#64748b' }}>{subtext}</div>
  </div>
);

const DensityBar = ({ label, density, location, onDelete }) => {
  const isHigh = density > 80;
  const color = isHigh ? '#ef4444' : '#38bdf8';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {label}
            {onDelete && (
              <button onClick={onDelete} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px', display: 'flex', opacity: 0.8 }} title="Delete Zone" onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0.8}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </button>
            )}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>{location}</div>
        </div>
        <div style={{ fontSize: '16px', fontFamily: 'monospace', color: color, fontWeight: '700' }}>{density}%</div>
      </div>
      <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ width: `${density}%`, height: '100%', backgroundColor: color, boxShadow: `0 0 10px ${color}` }}></div>
      </div>
    </div>
  );
};

// --- STYLES ---

const headerBtnStyle = {
  backgroundColor: 'rgba(255,255,255,0.05)',
  color: '#cbd5e1',
  border: '1px solid rgba(255,255,255,0.1)',
  padding: '8px 16px',
  borderRadius: '8px',
  fontSize: '12px',
  fontWeight: '600',
  letterSpacing: '0.5px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  transition: 'all 0.2s'
};

const panelStyle = {
  backgroundColor: 'rgba(15, 23, 42, 0.4)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.05)',
  borderRadius: '12px',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column'
};

const panelHeaderStyle = {
  padding: '16px 24px',
  borderBottom: '1px solid rgba(255,255,255,0.05)',
  backgroundColor: 'rgba(0,0,0,0.2)',
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '1px',
  color: '#94a3b8',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  textAlign: 'left'
};

const trStyle = {
  borderBottom: '1px solid rgba(255,255,255,0.02)',
  transition: 'background 0.2s'
};

const actionBtnStyle = {
  padding: '6px 12px',
  backgroundColor: 'rgba(56, 189, 248, 0.1)',
  color: '#38bdf8',
  border: '1px solid rgba(56, 189, 248, 0.2)',
  borderRadius: '4px',
  fontSize: '10px',
  fontWeight: '700',
  letterSpacing: '0.5px',
  cursor: 'pointer'
};

const codeBadgeStyle = {
  backgroundColor: 'rgba(0,0,0,0.3)',
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '11px',
  fontFamily: 'monospace',
  color: '#cbd5e1',
  border: '1px solid rgba(255,255,255,0.05)'
};

const modalOverlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
  backgroundColor: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(5px)',
  display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 
};

const modalContentStyle = {
  backgroundColor: '#0f172a', padding: '30px', borderRadius: '12px', 
  width: '500px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
};

const modalLabelStyle = {
  display: 'block', fontSize: '11px', color: '#94a3b8', letterSpacing: '1px', marginBottom: '8px'
};

const modalInputStyle = {
  width: '100%', padding: '12px', backgroundColor: 'rgba(0,0,0,0.3)', color: 'white', 
  border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', outline: 'none', fontSize: '13px'
};

// Global table styles injection
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  th { padding: 16px 24px; color: #64748b; font-size: 10px; font-weight: 700; letter-spacing: 1px; border-bottom: 1px solid rgba(255,255,255,0.05); }
  td { padding: 16px 24px; font-size: 13px; }
  tbody tr:hover { background-color: rgba(255,255,255,0.02); }
`;
document.head.appendChild(styleSheet);

export default Dashboard;
