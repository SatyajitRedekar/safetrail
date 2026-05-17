import React from 'react';

export default function Spinner({ size = 24, color = 'white' }) {
  return (
    <>
      <div className="custom-spinner" style={{ width: size, height: size, borderColor: `${color} transparent transparent transparent` }}></div>
      <style>{`
        .custom-spinner {
          box-sizing: border-box;
          display: block;
          margin: 0 auto;
          border-style: solid;
          border-width: 3px;
          border-radius: 50%;
          animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
