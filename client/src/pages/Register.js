import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', passport: '', emergencyContact: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('https://safetrail-api-1pq5.onrender.com/api/tourists/register', form);
      setResult(res.data);
    } catch (err) {
      setResult({ success: false, message: err.response?.data?.message || 'Error occurred' });
    }
    setLoading(false);
  };

  const inputStyle = { width: '100%', padding: '10px', marginBottom: '15px', fontSize: '15px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', borderRadius: '10px', fontFamily: 'Arial' }}>
      <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>🛡️ Tourist Registration</h2>
      {!result ? (
        <form onSubmit={handleSubmit}>
          <input style={inputStyle} name="name" placeholder="Full Name" onChange={handleChange} required />
          <input style={inputStyle} name="email" placeholder="Email" type="email" onChange={handleChange} required />
          <input style={inputStyle} name="phone" placeholder="Phone Number" onChange={handleChange} required />
          <input style={inputStyle} name="passport" placeholder="Passport / Aadhaar Number" onChange={handleChange} required />
          <input style={inputStyle} name="emergencyContact" placeholder="Emergency Contact Number" onChange={handleChange} required />
          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '12px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer' }}>
            {loading ? 'Registering...' : 'Register Tourist'}
          </button>
        </form>
      ) : result.success ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <h3 style={{ color: '#2ecc71' }}>✅ Registration Successful!</h3>
          <p>Your Digital ID:</p>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50', padding: '15px', backgroundColor: '#ecf0f1', borderRadius: '8px', letterSpacing: '2px' }}>
            {result.digitalId}
          </div>
          <p style={{ color: '#666', fontSize: '13px' }}>Save this ID — you will need it for emergency use.</p>
          <button onClick={() => setResult(null)}
            style={{ marginTop: '15px', padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            Register Another
          </button>
        </div>
      ) : (
        <p style={{ color: 'red', textAlign: 'center' }}>❌ {result.message}</p>
      )}
    </div>
  );
}

export default Register;
