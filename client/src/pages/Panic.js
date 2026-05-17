import React from 'react';

const Panic = () => {
  const handlePanic = async () => {
    try {
      await fetch('https://safetrail-api-1pq5.onrender.com/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ touristId: '60d5f9f9b5c5a814a0d9b1a1', location: { lat: 26.1445, lng: 91.7362 } })
      });
      alert('Panic Alert Sent!');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Emergency</h1>
      <button onClick={handlePanic} style={{ background: 'red', color: 'white', padding: '30px', fontSize: '24px', borderRadius: '50%', cursor: 'pointer', border: 'none' }}>
        PANIC
      </button>
    </div>
  );
};

export default Panic;
