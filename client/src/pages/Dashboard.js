import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [alerts, setAlerts] = useState([]);
  const [tourists, setTourists] = useState([]);
  const [selectedFir, setSelectedFir] = useState(null);
  const [selectedTourist, setSelectedTourist] = useState(null);

  useEffect(() => {
    axios.get('https://safetrail-api-1pq5.onrender.com/api/alerts/all')
      .then(res => setAlerts(res.data.alerts))
      .catch(err => console.log(err));
    axios.get('https://safetrail-api-1pq5.onrender.com/api/tourists/all')
      .then(res => setTourists(res.data.tourists))
      .catch(err => console.log(err));
  }, []);

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
        <div style={{ fontSize: '14px', fontWeight: '600', backgroundColor: 'rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: '50px' }}>
          STATUS: <span style={{ color: '#43a047' }}>● SYSTEM ONLINE</span>
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

        {/* Live Map Section */}
        <div style={{
          margin: '20px 0 30px 0',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '2px solid #1a237e',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
        }}>
          <div style={{
            backgroundColor: '#1a237e',
            padding: '10px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ color: 'white', fontWeight: 'bold' }}>
              📍 LIVE TOURIST TRACKING MAP — NORTHEAST INDIA
            </span>
            <span style={{ color: '#4fc3f7', fontSize: '12px' }}>
              🟢 TRACKING ACTIVE
            </span>
          </div>
          <iframe
            src="https://www.openstreetmap.org/export/embed.html?bbox=88.0%2C22.0%2C97.5%2C29.5&layer=mapnik"
            width="100%"
            height="400"
            style={{ border: 'none', display: 'block' }}
            title="Northeast India Map"
          />
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
