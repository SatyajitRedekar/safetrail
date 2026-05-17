import React, { useState } from 'react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', emergencyContact: '', bloodGroup: '' });
  const [digitalId, setDigitalId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://safetrail-api-1pq5.onrender.com/api/tourists/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setDigitalId(data._id);
      } else {
        alert(data.message || 'Error registering');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Tourist Registration</h2>
        {digitalId ? (
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ color: 'green' }}>Registration Successful!</h3>
            <p>Your Digital ID:</p>
            <strong style={{ fontSize: '24px', display: 'block', padding: '10px', background: '#eef', borderRadius: '5px', letterSpacing: '2px' }}>{digitalId}</strong>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input placeholder="Full Name" style={inputStyle} onChange={e => setFormData({...formData, name: e.target.value})} required />
            <input placeholder="Phone Number" style={inputStyle} onChange={e => setFormData({...formData, phone: e.target.value})} required />
            <input placeholder="Emergency Contact" style={inputStyle} onChange={e => setFormData({...formData, emergencyContact: e.target.value})} required />
            <input placeholder="Blood Group (Optional)" style={inputStyle} onChange={e => setFormData({...formData, bloodGroup: e.target.value})} />
            <button type="submit" style={{ background: '#007bff', color: 'white', padding: '15px', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}>Generate Digital ID</button>
          </form>
        )}
      </div>
    </div>
  );
};

const inputStyle = { padding: '12px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '16px' };
export default Register;
