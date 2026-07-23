import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

const socketUrl = API_URL.replace('http', 'ws') + '/ws/broadcast';

function BroadcastBanner() {
  const [broadcast, setBroadcast] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(socketUrl);
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event === 'emergency_broadcast') {
          setBroadcast(data);
        }
      } catch (err) {
        console.error('WebSocket parsing error:', err);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  if (!broadcast) return null;

  const isCritical = broadcast.severity === 'critical';

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      backgroundColor: isCritical ? '#d32f2f' : '#f57c00',
      color: 'white',
      padding: '15px 20px',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
      fontFamily: '"Inter", sans-serif',
      boxSizing: 'border-box'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
        <span style={{ fontSize: '32px', animation: 'pulse 1.5s infinite' }}>
          {isCritical ? '🚨' : '⚠️'}
        </span>
        <div>
          <strong style={{ display: 'block', fontSize: '18px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            POLICE EMERGENCY BROADCAST
          </strong>
          <span style={{ fontSize: '15px', fontWeight: '500' }}>{broadcast.message}</span>
        </div>
      </div>
      <button 
        onClick={() => setBroadcast(null)}
        style={{
          backgroundColor: 'rgba(255,255,255,0.2)',
          border: 'none',
          color: 'white',
          padding: '8px 15px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Acknowledge
      </button>
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
}

export default BroadcastBanner;
