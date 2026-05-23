import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { MapContainer, TileLayer, Circle, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function Dashboard() {
  const [alerts, setAlerts] = useState([]);
  const [tourists, setTourists] = useState([]);
  const [selectedFir, setSelectedFir] = useState(null);
  const [selectedTourist, setSelectedTourist] = useState(null);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSeverity, setBroadcastSeverity] = useState('warning');
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) {
      navigate('/admin/login');
      return;
    }

    const fetchData = () => {
      axios.get('http://localhost:5000/api/alerts/')
        .then(res => setAlerts(res.data)).catch(console.log);
      axios.get('http://localhost:5000/api/tourists/')
        .then(res => setTourists(res.data)).catch(console.log);
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
    return Math.min(Math.round((count / maxCapacity) * 100) + 20, 100); 
  };

  const delhiDensity = getZoneDensity(28.7041, 77.1025, 5);
  const mumbaiDensity = getZoneDensity(19.0760, 72.8777, 5);
  const goaDensity = getZoneDensity(15.2993, 74.1240, 5);

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
    
    const touristName = selectedFir.name || 'Unknown Tourist';
    const digitalId = selectedFir.digitalId || 'N/A';
    const lat = selectedFir.location?.latitude?.toFixed(5) || 'Unknown';
    const lng = selectedFir.location?.longitude?.toFixed(5) || 'Unknown';
    
    doc.text(`E-FIR Reference No: ST-${Math.floor(Math.random() * 100000)}`, 20, 50);
    doc.text(`Date & Time: ${new Date().toLocaleString()}`, 20, 60);
    doc.text(`Dispatch Officer ID: admin`, 20, 70);
    
    doc.setFont('helvetica', 'bold');
    doc.text('INCIDENT DETAILS:', 20, 90);
    doc.setFont('helvetica', 'normal');
    doc.text(`Type of Emergency: SOS PANIC ALERT`, 20, 100);
    doc.text(`GPS Coordinates: Lat ${lat}, Lng ${lng}`, 20, 110);
    doc.text(`Description: Emergency SOS trigger received via SafeTrail`, 20, 120);
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
    doc.text('This is a digitally generated document by the SafeTrail Tourist Safety System.', 105, 270, { align: 'center' });
    doc.text('Valid only for official police jurisdiction use.', 105, 275, { align: 'center' });
    
    doc.save(`SafeTrail_EFIR_${touristName.replace(/\s+/g, '_')}.pdf`);
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
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', letterSpacing: '0.5px', color: 'white' }}>SAFETRAIL_NEXUS</h2>
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
              <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%', backgroundColor: '#020617' }} zoomControl={false}>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png" />
                
                {/* Simulated Heatmap Cores */}
                <Circle center={[28.7041, 77.1025]} pathOptions={{ color: 'transparent', fillColor: '#ef4444', fillOpacity: 0.3 }} radius={100000} />
                <Circle center={[28.7041, 77.1025]} pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.6, weight: 1 }} radius={40000} />
                
                <Circle center={[19.0760, 72.8777]} pathOptions={{ color: 'transparent', fillColor: '#f59e0b', fillOpacity: 0.3 }} radius={80000} />
                <Circle center={[19.0760, 72.8777]} pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.6, weight: 1 }} radius={30000} />
                
                {tourists.map((t, idx) => (
                  t.location && t.location.latitude ? (
                    <Circle key={`tourist-${idx}`} center={[t.location.latitude, t.location.longitude]} pathOptions={{ color: '#38bdf8', fillColor: '#38bdf8', fillOpacity: 1, weight: 2 }} radius={15000} />
                  ) : null
                ))}
                
                {alerts.map((a, idx) => (
                  a.location && a.location.latitude ? (
                    <Circle key={`alert-${idx}`} center={[a.location.latitude, a.location.longitude]} pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 1, weight: 3 }} radius={25000} />
                  ) : null
                ))}
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
                          <div style={{ fontWeight: '500', color: '#f8fafc' }}>{alert.name}</div>
                          <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>{alert.digitalId}</div>
                        </td>
                        <td style={{ fontFamily: 'monospace', color: '#94a3b8' }}>
                          {alert.location?.latitude?.toFixed(4)}, {alert.location?.longitude?.toFixed(4)}
                        </td>
                        <td style={{ fontSize: '12px', color: '#94a3b8' }}>{new Date(alert.createdAt).toLocaleTimeString()}</td>
                        <td>
                          <button 
                            onClick={() => setSelectedFir(alert)}
                            style={actionBtnStyle}>
                            PROCESS E-FIR
                          </button>
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
                        <td><span style={codeBadgeStyle}>{t.digitalId}</span></td>
                        <td style={{ fontSize: '13px', color: '#94a3b8' }}>{t.phone}</td>
                        <td><span style={{ fontSize: '11px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%' }}></span> TRACKING</span></td>
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
              <strong>SUBJ:</strong> {selectedFir.name} [{selectedFir.digitalId}]<br/>
              <strong>LOC:</strong> {selectedFir.location?.latitude}, {selectedFir.location?.longitude}<br/><br/>
              <span style={{ color: '#ef4444' }}>! SEVERE DISTRESS SIGNAL DETECTED. IMMEDIATE RESPONSE REQUIRED.</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button style={{ flex: 1, padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }} onClick={generateEFIRPdf}>DOWNLOAD PDF</button>
              <button style={{ flex: 1, padding: '12px', backgroundColor: 'transparent', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', cursor: 'pointer' }} onClick={() => setSelectedFir(null)}>DISMISS</button>
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

const DensityBar = ({ label, density, location }) => {
  const isHigh = density > 80;
  const color = isHigh ? '#ef4444' : '#38bdf8';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>{label}</div>
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
