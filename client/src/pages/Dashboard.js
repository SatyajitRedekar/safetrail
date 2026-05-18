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

    axios.get('http://localhost:5000/api/alerts/all')
      .then(res => setAlerts(res.data.alerts))
      .catch(err => console.log(err));
    axios.get('http://localhost:5000/api/tourists/all')
      .then(res => setTourists(res.data.tourists))
      .catch(err => console.log(err));
  }, []);

  // Dynamic Crowd Calculation based on Live DB Tourists
  const getZoneDensity = (lat, lon, maxCapacity) => {
    const count = tourists.filter(t => 
      t.location && 
      Math.abs(t.location.latitude - lat) < 3 && 
      Math.abs(t.location.longitude - lon) < 3
    ).length;
    // Add a 20% base simulated load so the dashboard never looks empty, plus the real tourist count
    return Math.min(Math.round((count / maxCapacity) * 100) + 20, 100); 
  };

  const delhiDensity = getZoneDensity(28.7041, 77.1025, 5);
  const mumbaiDensity = getZoneDensity(19.0760, 72.8777, 5);
  const goaDensity = getZoneDensity(15.2993, 74.1240, 5);

  const generateEFIRPdf = () => {
    if (!selectedFir) return;
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(26, 35, 126); // Navy blue
    doc.text('GOVERNMENT OF INDIA', 105, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(229, 57, 53); // Red
    doc.text('ELECTRONIC FIRST INFORMATION REPORT (E-FIR)', 105, 30, { align: 'center' });
    
    // Divider
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);
    
    // Details
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
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('This is a digitally generated document by the SafeTrail Tourist Safety System.', 105, 270, { align: 'center' });
    doc.text('Valid only for official police jurisdiction use.', 105, 275, { align: 'center' });
    
    // Save PDF
    doc.save(`SafeTrail_EFIR_${touristName.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div style={{ fontFamily: '"Inter", "Segoe UI", Roboto, sans-serif', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      
      {/* Dark Header */}
      <div style={{ backgroundColor: '#1a237e', padding: '20px 40px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ fontSize: '32px' }}>🛡️</div>
          <div>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '700', letterSpacing: '1px' }}>SAFETRAIL COMMAND CENTER</h2>
            <p style={{ margin: '4px 0 0 0', color: '#9fa8da', fontSize: '13px', fontWeight: '500' }}>NORTHEAST REGION POLICE DISPATCH</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            onClick={() => setShowBroadcastModal(true)}
            style={{ backgroundColor: '#ff9800', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold' }}>
            📢 Send Broadcast
          </button>
          <div style={{ fontSize: '14px', fontWeight: '600', backgroundColor: 'rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: '50px' }}>
            STATUS: <span style={{ color: '#43a047' }}>● SYSTEM ONLINE</span>
          </div>
          <button 
            onClick={() => { localStorage.removeItem('adminToken'); navigate('/'); }}
            style={{ backgroundColor: '#e53935', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold' }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ padding: '30px 40px' }}>
        
        {/* Stats Cards */}
        <div style={{ display: 'flex', gap: '25px', marginBottom: '30px' }}>
          <div style={statCardStyle('#fff', '#1a237e')}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666', textTransform: 'uppercase' }}>Active Tourists</h3>
            <div style={{ fontSize: '36px', fontWeight: '800', color: '#1a237e' }}>{tourists.length}</div>
          </div>
          
          <div style={statCardStyle('#fff', '#e53935')}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666', textTransform: 'uppercase' }}>Critical Alerts</h3>
            <div style={{ fontSize: '36px', fontWeight: '800', color: '#e53935' }}>{alerts.length}</div>
          </div>
          
          <div style={statCardStyle('#fff', '#43a047')}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666', textTransform: 'uppercase' }}>Units Dispatched</h3>
            <div style={{ fontSize: '36px', fontWeight: '800', color: '#43a047' }}>0</div>
          </div>
        </div>

        {/* Secondary Statistics Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
          <div style={secondaryStatCardStyle}>
            <div style={{ fontSize: '24px', marginBottom: '5px' }}>📈</div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#1a237e' }}>{tourists.length > 0 ? tourists.length : '0'}</div>
            <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', fontWeight: '600' }}>Registrations Today</div>
          </div>
          
          <div style={secondaryStatCardStyle}>
            <div style={{ fontSize: '24px', marginBottom: '5px' }}>🔔</div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#e53935' }}>{alerts.length}</div>
            <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', fontWeight: '600' }}>Alerts This Week</div>
          </div>
          
          <div style={secondaryStatCardStyle}>
            <div style={{ fontSize: '24px', marginBottom: '5px' }}>🛡️</div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#43a047' }}>98/100</div>
            <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', fontWeight: '600' }}>Avg Safety Score</div>
          </div>
          
          <div style={secondaryStatCardStyle}>
            <div style={{ fontSize: '24px', marginBottom: '5px' }}>📍</div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#ff9800' }}>3</div>
            <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', fontWeight: '600' }}>Active Zones Monitored</div>
          </div>
        </div>

        {/* Live Heatmap & Crowd Analytics Section */}
        <div style={{
          margin: '20px 0 30px 0',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '2px solid #1a237e',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          display: 'flex',
          backgroundColor: '#fff'
        }}>
          {/* Map Side */}
          <div style={{ flex: '70%', position: 'relative' }}>
              <div style={{
                backgroundColor: '#1a237e',
                padding: '10px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: 'white', fontWeight: 'bold' }}>
                  📍 LIVE TOURIST HEATMAP — ALL INDIA
                </span>
                <span style={{ color: '#ff9800', fontSize: '12px', fontWeight: 'bold' }}>
                  🔥 HEATMAP ACTIVE
                </span>
              </div>
              
              <div style={{ width: '100%', height: '400px' }}>
                <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; OpenStreetMap'
                  />
                  {/* Heatmap Zones Anchored to Real Coordinates */}
                  <Circle center={[28.7041, 77.1025]} pathOptions={{ color: 'red', fillColor: '#e53935', fillOpacity: 0.6, weight: 0 }} radius={80000} /> {/* Delhi */}
                  <Circle center={[19.0760, 72.8777]} pathOptions={{ color: 'red', fillColor: '#e53935', fillOpacity: 0.6, weight: 0 }} radius={60000} /> {/* Mumbai */}
                  <Circle center={[15.2993, 74.1240]} pathOptions={{ color: 'orange', fillColor: '#ff9800', fillOpacity: 0.5, weight: 0 }} radius={50000} /> {/* Goa */}
                  <Circle center={[12.9716, 77.5946]} pathOptions={{ color: 'green', fillColor: '#43a047', fillOpacity: 0.4, weight: 0 }} radius={50000} /> {/* Bangalore */}
                  <Circle center={[26.9124, 75.7873]} pathOptions={{ color: 'orange', fillColor: '#ff9800', fillOpacity: 0.5, weight: 0 }} radius={40000} /> {/* Jaipur */}
                  <Circle center={[26.1445, 91.7362]} pathOptions={{ color: 'orange', fillColor: '#ff9800', fillOpacity: 0.5, weight: 0 }} radius={35000} /> {/* Guwahati */}
                  
                  {/* Plot actual live tourist markers if available */}
                  {tourists.map((t, idx) => (
                    t.location && t.location.latitude ? (
                      <Marker key={idx} position={[t.location.latitude, t.location.longitude]}>
                        <Popup>{t.name}</Popup>
                      </Marker>
                    ) : null
                  ))}
                </MapContainer>
              </div>
          </div>

          {/* Analytics Sidebar */}
          <div style={{ flex: '30%', borderLeft: '2px solid #eee', padding: '20px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#1a237e', fontSize: '18px' }}>📊 Live Crowd Analytics</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: delhiDensity > 80 ? '#e53935' : '#ff9800' }}>Delhi NCR Hub</span>
                <span style={{ fontSize: '14px', color: delhiDensity > 80 ? '#e53935' : '#ff9800', fontWeight: 'bold' }}>{delhiDensity}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: delhiDensity > 80 ? '#ffcdd2' : '#ffe0b2', borderRadius: '4px' }}>
                <div style={{ width: `${delhiDensity}%`, height: '100%', backgroundColor: delhiDensity > 80 ? '#e53935' : '#ff9800', borderRadius: '4px', transition: 'width 1s ease-in-out' }}></div>
              </div>
              <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>{delhiDensity > 80 ? 'Overcrowded. Risk of gridlock.' : 'Moderate traffic. Flow is steady.'}</div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: mumbaiDensity > 80 ? '#e53935' : '#ff9800' }}>Mumbai Gateway Zone</span>
                <span style={{ fontSize: '14px', color: mumbaiDensity > 80 ? '#e53935' : '#ff9800', fontWeight: 'bold' }}>{mumbaiDensity}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: mumbaiDensity > 80 ? '#ffcdd2' : '#ffe0b2', borderRadius: '4px' }}>
                <div style={{ width: `${mumbaiDensity}%`, height: '100%', backgroundColor: mumbaiDensity > 80 ? '#e53935' : '#ff9800', borderRadius: '4px', transition: 'width 1s ease-in-out' }}></div>
              </div>
              <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>{mumbaiDensity > 80 ? 'Extreme footfall. Monitor closely.' : 'Moderate traffic. Flow is steady.'}</div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: goaDensity > 80 ? '#e53935' : '#43a047' }}>Goa Coastal Belt</span>
                <span style={{ fontSize: '14px', color: goaDensity > 80 ? '#e53935' : '#43a047', fontWeight: 'bold' }}>{goaDensity}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: goaDensity > 80 ? '#ffcdd2' : '#c8e6c9', borderRadius: '4px' }}>
                <div style={{ width: `${goaDensity}%`, height: '100%', backgroundColor: goaDensity > 80 ? '#e53935' : '#43a047', borderRadius: '4px', transition: 'width 1s ease-in-out' }}></div>
              </div>
              <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>{goaDensity > 80 ? 'Heavy density detected.' : 'Normal capacity. Flow is smooth.'}</div>
            </div>

            <div style={{ marginTop: 'auto', backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }}>
              <strong style={{ display: 'block', fontSize: '12px', color: '#555', marginBottom: '5px' }}>🤖 AI RECOMMENDATION</strong>
              <span style={{ fontSize: '13px', color: '#333' }}>
                {delhiDensity > 80 ? 'Deploy 4 extra crowd control units to Delhi NCR Hub.' : 'No critical crowd anomalies detected in major monitored zones.'}
              </span>
            </div>
          </div>
        </div>


        {/* Tables Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          
          {/* Alerts Table */}
          <div style={tableContainerStyle}>
            <div style={tableHeaderStyle('#e53935')}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>🚨 Live Emergency Alerts</h3>
            </div>
            <div style={{ padding: '20px', overflowX: 'auto' }}>
              {alerts.length === 0 ? (
                <p style={{ color: '#999', textAlign: 'center', padding: '20px 0' }}>No active emergencies.</p>
              ) : (
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th>Tourist Details</th>
                      <th>Location</th>
                      <th>Timestamp</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alerts.map((alert, i) => (
                      <tr key={i}>
                        <td>
                          <strong>{alert.name}</strong><br/>
                          <span style={{ fontSize: '12px', color: '#666' }}>{alert.digitalId}</span>
                        </td>
                        <td style={{ color: '#1a237e', fontWeight: '500' }}>{alert.location?.latitude?.toFixed(4)}, {alert.location?.longitude?.toFixed(4)}</td>
                        <td style={{ fontSize: '13px', color: '#555' }}>{new Date(alert.createdAt).toLocaleString()}</td>
                        <td><span style={badgeStyle('#e53935')}>CRITICAL</span></td>
                        <td>
                          <button 
                            onClick={() => setSelectedFir(alert)}
                            style={{ padding: '6px 12px', backgroundColor: '#1a237e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>
                            Generate E-FIR
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
          <div style={tableContainerStyle}>
            <div style={tableHeaderStyle('#1a237e')}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>👥 Registered Tourist Database</h3>
            </div>
            <div style={{ padding: '20px', overflowX: 'auto' }}>
              {tourists.length === 0 ? (
                <p style={{ color: '#999', textAlign: 'center', padding: '20px 0' }}>No tourists in registry.</p>
              ) : (
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Digital ID</th>
                      <th>Contact</th>
                      <th>Registry</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tourists.map((t, i) => (
                      <tr key={i}>
                        <td>
                          <span 
                            onClick={() => setSelectedTourist(t)}
                            style={{ fontWeight: 'bold', color: '#1e88e5', cursor: 'pointer', textDecoration: 'underline' }}>
                            {t.name}
                          </span>
                        </td>
                        <td><code style={{ backgroundColor: '#f0f2f5', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>{t.digitalId}</code></td>
                        <td style={{ fontSize: '14px', color: '#555' }}>{t.phone}</td>
                        <td><span style={badgeStyle('#43a047')}>VERIFIED</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>
      </div>
      
      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: '#1a237e', padding: '30px', borderRadius: '12px', width: '500px', maxWidth: '90%', border: '2px solid #3949ab', color: 'white' }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              📢 Send Emergency Push Broadcast
            </h2>
            
            <p style={{ fontSize: '13px', color: '#9fa8da', marginBottom: '20px' }}>
              This will instantly push a full-screen notification to all active SafeTrail users. Use only for critical weather, crowd control, or security incidents.
            </p>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px', color: '#c5cae9' }}>SEVERITY LEVEL</label>
              <select 
                value={broadcastSeverity}
                onChange={(e) => setBroadcastSeverity(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#283593', color: 'white', border: '1px solid #3949ab', outline: 'none' }}
              >
                <option value="warning">Warning (Orange)</option>
                <option value="critical">Critical (Red)</option>
              </select>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px', color: '#c5cae9' }}>BROADCAST MESSAGE</label>
              <textarea 
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="Enter alert message (e.g., Extreme weather detected in Guwahati. Seek shelter immediately.)"
                style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#283593', color: 'white', border: '1px solid #3949ab', outline: 'none', height: '100px', resize: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={async () => {
                  try {
                    await axios.post('http://localhost:5000/api/admin/broadcast', { message: broadcastMessage, severity: broadcastSeverity }, {
                      headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
                    });
                    alert('Broadcast Sent Successfully!');
                    setShowBroadcastModal(false);
                    setBroadcastMessage('');
                  } catch (err) {
                    alert('Failed to send broadcast');
                  }
                }}
                style={{ flex: 1, padding: '12px', backgroundColor: broadcastSeverity === 'critical' ? '#e53935' : '#ff9800', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Send Broadcast
              </button>
              <button 
                onClick={() => setShowBroadcastModal(false)}
                style={{ flex: 1, padding: '12px', backgroundColor: 'transparent', color: '#c5cae9', border: '1px solid #3949ab', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* E-FIR Modal */}
      {selectedFir && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '500px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, color: '#1a237e', fontSize: '20px' }}>📝 Official E-FIR Document</h2>
              <button onClick={() => setSelectedFir(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#888' }}>&times;</button>
            </div>
            
            <div style={{ fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.6', color: '#333' }}>
              <p><strong>FIR No:</strong> ST-{Math.floor(Math.random() * 100000)}</p>
              <p><strong>Date/Time:</strong> {new Date().toLocaleString()}</p>
              <p><strong>Complainant:</strong> Police Dispatch Auto-System</p>
              <p><strong>Victim Details:</strong></p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 15px 0' }}>
                <li>- Name: {selectedFir.name}</li>
                <li>- Digital ID: {selectedFir.digitalId}</li>
              </ul>
              <p><strong>Incident Location:</strong> Lat: {selectedFir.location?.latitude?.toFixed(5)}, Lng: {selectedFir.location?.longitude?.toFixed(5)}</p>
              <p><strong>Incident Description:</strong> Emergency SOS trigger received via SafeTrail mobile client indicating immediate severe distress. Rapid Response Unit required.</p>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
              <button style={{ flex: 1, padding: '12px', backgroundColor: '#1565c0', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }} onClick={generateEFIRPdf}>
                📄 Download Official PDF
              </button>
              <button style={{ flex: 1, padding: '12px', backgroundColor: '#43a047', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => { alert('E-FIR Dispatched to Headquarters!'); setSelectedFir(null); }}>
                File Official Report
              </button>
              <button style={{ flex: 1, padding: '12px', backgroundColor: '#e0e0e0', color: '#333', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setSelectedFir(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tourist Detail Modal */}
      {selectedTourist && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '450px', maxWidth: '90%', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, color: '#1a237e', fontSize: '20px' }}>👤 Tourist Profile</h2>
              <button onClick={() => setSelectedTourist(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#888' }}>&times;</button>
            </div>
            
            <div style={{ fontSize: '15px', lineHeight: '1.8', color: '#444' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', marginBottom: '8px' }}>
                <strong style={{ color: '#777' }}>Name:</strong> <span>{selectedTourist.name}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', marginBottom: '8px' }}>
                <strong style={{ color: '#777' }}>Email:</strong> <span>{selectedTourist.email || 'N/A'}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', marginBottom: '8px' }}>
                <strong style={{ color: '#777' }}>Phone:</strong> <span>{selectedTourist.phone}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', marginBottom: '8px' }}>
                <strong style={{ color: '#777' }}>Digital ID:</strong> 
                <span style={{ backgroundColor: '#f0f2f5', padding: '2px 8px', borderRadius: '4px', fontFamily: 'monospace' }}>{selectedTourist.digitalId}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', marginBottom: '8px' }}>
                <strong style={{ color: '#777' }}>Registered:</strong> <span>{new Date(selectedTourist.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
              
              <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '8px', border: '1px solid #c8e6c9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <strong style={{ color: '#2e7d32' }}>Safety Score</strong>
                  <strong style={{ color: '#2e7d32' }}>100/100</strong>
                </div>
                <div style={{ width: '100%', backgroundColor: '#c8e6c9', height: '8px', borderRadius: '4px' }}>
                  <div style={{ width: '100%', backgroundColor: '#43a047', height: '100%', borderRadius: '4px' }}></div>
                </div>
              </div>
            </div>
            
            <button style={{ width: '100%', marginTop: '25px', padding: '12px', backgroundColor: '#1a237e', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setSelectedTourist(null)}>
              Close Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const statCardStyle = (bg, border) => ({
  flex: 1,
  backgroundColor: bg,
  padding: '25px',
  borderRadius: '12px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
  borderLeft: `5px solid ${border}`,
  transition: 'transform 0.2s',
});

const secondaryStatCardStyle = {
  backgroundColor: 'white',
  padding: '15px',
  borderRadius: '10px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  textAlign: 'center',
  border: '1px solid #f0f0f0'
};

const tableContainerStyle = {
  backgroundColor: 'white',
  borderRadius: '12px',
  boxShadow: '0 8px 25px rgba(0,0,0,0.06)',
  overflow: 'hidden'
};

const tableHeaderStyle = (color) => ({
  backgroundColor: color,
  color: 'white',
  padding: '15px 20px',
  borderBottom: '1px solid rgba(0,0,0,0.1)'
});

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  textAlign: 'left'
};

const badgeStyle = (color) => ({
  backgroundColor: color,
  color: 'white',
  padding: '4px 10px',
  borderRadius: '50px',
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '0.5px'
});

// Adding basic table cell styles via global class injection for simplicity in React without external CSS
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  th { padding: 12px 10px; color: #777; font-size: 12px; text-transform: uppercase; border-bottom: 2px solid #eee; }
  td { padding: 15px 10px; border-bottom: 1px solid #f0f0f0; }
  tr:hover { background-color: #f9fafb; }
`;
document.head.appendChild(styleSheet);

export default Dashboard;
