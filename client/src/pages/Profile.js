import React, { useState } from 'react';
import axios from 'axios';
import { useToast } from '../components/Toast';
import Spinner from '../components/Spinner';

function Profile() {
  const { addToast } = useToast();
  const [searchId, setSearchId] = useState('');
  const [tourist, setTourist] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async (e) => {
    if (e) e.preventDefault();
    if (!searchId.trim()) return;

    setLoading(true);
    setTourist(null);
    try {
      const res = await axios.get(`http://localhost:5000/api/tourists/${searchId.trim()}`);
      setTourist(res.data);
      addToast('Profile loaded successfully', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Digital ID not found', 'error');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '120px 20px 60px',
      backgroundColor: '#020617',
      background: 'radial-gradient(circle at center, #0f172a 0%, #020617 100%)',
      fontFamily: '"Outfit", sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      
      {/* Search Container */}
      <div style={{
        width: '100%',
        maxWidth: '500px',
        marginBottom: '50px',
        animation: 'fadeIn 0.5s ease'
      }}>
        <h2 style={{ color: '#38bdf8', fontSize: '32px', marginBottom: '10px', textAlign: 'center', letterSpacing: '2px' }}>
          VERIFY DIGITAL ID
        </h2>
        <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: '25px', fontSize: '15px' }}>
          Enter an Official SafeTrail ID to view the traveler's digital profile.
        </p>
        
        <form onSubmit={fetchProfile} style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text"
            placeholder="e.g. ST-A1B2C3"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value.toUpperCase())}
            style={{
              flex: 1,
              padding: '16px 20px',
              fontSize: '18px',
              borderRadius: '12px',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              color: 'white',
              outline: 'none',
              letterSpacing: '2px',
              fontFamily: 'monospace',
              transition: 'all 0.3s'
            }}
            onFocus={(e) => e.target.style.border = '1px solid #38bdf8'}
            onBlur={(e) => e.target.style.border = '1px solid rgba(56, 189, 248, 0.3)'}
          />
          <button 
            type="submit"
            disabled={loading}
            style={{
              padding: '0 30px',
              backgroundColor: '#0ea5e9',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.3s',
              boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0284c7'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0ea5e9'}
          >
            {loading ? <Spinner size={20} /> : 'SEARCH'}
          </button>
        </form>
      </div>

      {/* Professional ID Card Render */}
      {tourist && (
        <div style={{
          width: '100%',
          maxWidth: '450px',
          padding: '2px',
          background: 'linear-gradient(135deg, #38bdf8 0%, #3b82f6 50%, #8b5cf6 100%)',
          borderRadius: '24px',
          animation: 'slideUp 0.5s ease',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 20px rgba(56, 189, 248, 0.3)'
        }}>
          <div style={{
            backgroundColor: '#0f172a',
            borderRadius: '22px',
            padding: '30px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Background pattern */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '120px',
              background: 'linear-gradient(180deg, rgba(56, 189, 248, 0.1) 0%, transparent 100%)',
              borderBottom: '1px solid rgba(56, 189, 248, 0.1)'
            }}></div>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', position: 'relative', zIndex: 1 }}>
              <div>
                <div style={{ fontSize: '10px', color: '#94a3b8', letterSpacing: '2px', marginBottom: '2px' }}>GOVERNMENT OF INDIA</div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: 'white', letterSpacing: '1px' }}>SAFETRAIL PASS</div>
              </div>
              <div style={{ fontSize: '32px' }}>🇮🇳</div>
            </div>

            {/* Profile Info */}
            <div style={{ position: 'relative', zIndex: 1, marginBottom: '30px' }}>
              <div style={{ fontSize: '12px', color: '#38bdf8', letterSpacing: '2px', marginBottom: '5px' }}>DIGITAL ID NUMBER</div>
              <div style={{ fontSize: '32px', fontWeight: '700', fontFamily: 'monospace', color: 'white', letterSpacing: '3px', marginBottom: '25px', textShadow: '0 0 10px rgba(56, 189, 248, 0.5)' }}>
                {tourist.digitalId}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', letterSpacing: '1px', marginBottom: '4px' }}>FULL NAME</div>
                  <div style={{ fontSize: '16px', color: 'white', fontWeight: '600' }}>{tourist.name}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', letterSpacing: '1px', marginBottom: '4px' }}>PASSPORT / AADHAAR</div>
                  <div style={{ fontSize: '16px', color: 'white', fontWeight: '600' }}>{tourist.passport}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', letterSpacing: '1px', marginBottom: '4px' }}>EMERGENCY CONTACT</div>
                  <div style={{ fontSize: '16px', color: 'white', fontWeight: '600' }}>{tourist.emergencyContact}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', letterSpacing: '1px', marginBottom: '4px' }}>RISK ZONE</div>
                  <div style={{ fontSize: '16px', color: '#fca5a5', fontWeight: '600' }}>{tourist.riskZone}</div>
                </div>
              </div>
            </div>

            {/* Footer / Barcode mockup */}
            <div style={{
              position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'
            }}>
              <div>
                <div style={{ fontSize: '10px', color: '#94a3b8', letterSpacing: '1px', marginBottom: '5px' }}>ISSUE DATE</div>
                <div style={{ fontSize: '14px', color: 'white', fontFamily: 'monospace' }}>
                  {new Date(tourist.createdAt).toLocaleDateString('en-GB')}
                </div>
              </div>
              
              {/* CSS Barcode Mockup */}
              <div style={{ display: 'flex', gap: '2px', height: '30px', opacity: 0.8 }}>
                {[...Array(20)].map((_, i) => (
                  <div key={i} style={{ 
                    width: Math.random() > 0.5 ? '2px' : '4px', 
                    backgroundColor: 'white',
                    height: '100%'
                  }}></div>
                ))}
              </div>
            </div>

            {/* Hologram Effect */}
            <div style={{
              position: 'absolute', top: '10%', right: '5%', width: '150px', height: '150px',
              background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
              borderRadius: '50%', pointerEvents: 'none', mixBlendMode: 'screen'
            }}></div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default Profile;
