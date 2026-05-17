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

  const inputStyle = { 
    width: '100%', padding: '14px', marginBottom: '20px', fontSize: '15px', 
    borderRadius: '8px', border: '1px solid #e0e0e0', boxSizing: 'border-box',
    backgroundColor: '#f9fafb', color: '#333', transition: 'border 0.2s', outline: 'none'
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '40px 20px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', fontFamily: '"Inter", "Segoe UI", Roboto, sans-serif' }}>
      <div style={{ 
        width: '100%', maxWidth: '550px', backgroundColor: 'white', 
        boxShadow: '0 10px 40px rgba(0,0,0,0.08)', borderRadius: '16px', overflow: 'hidden' 
      }}>
        <div style={{ backgroundColor: '#1a237e', padding: '25px', textAlign: 'center', color: 'white' }}>
          <h2 style={{ margin: '0', fontSize: '24px', fontWeight: '600' }}>🛡️ Tourist Registration</h2>
          <p style={{ margin: '8px 0 0 0', opacity: '0.8', fontSize: '14px' }}>Official Portal for Northeast India Tourism</p>
        </div>
        
        <div style={{ padding: '40px 30px' }}>
          {!result ? (
            <form onSubmit={handleSubmit}>
              <label style={labelStyle}>Full Name</label>
              <input style={inputStyle} name="name" placeholder="John Doe" onChange={handleChange} required />
              
              <label style={labelStyle}>Email Address</label>
              <input style={inputStyle} name="email" placeholder="john@example.com" type="email" onChange={handleChange} required />
              
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Phone Number</label>
                  <input style={inputStyle} name="phone" placeholder="+91 XXXXX XXXXX" onChange={handleChange} required />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Emergency Contact</label>
                  <input style={inputStyle} name="emergencyContact" placeholder="+91 XXXXX XXXXX" onChange={handleChange} required />
                </div>
              </div>

              <label style={labelStyle}>Passport / Aadhaar Number</label>
              <input style={inputStyle} name="passport" placeholder="ID Number" onChange={handleChange} required />
              
              <button type="submit" disabled={loading}
                style={{ 
                  width: '100%', padding: '16px', backgroundColor: '#1a237e', color: 'white', 
                  border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', 
                  cursor: loading ? 'not-allowed' : 'pointer', marginTop: '10px',
                  boxShadow: '0 4px 12px rgba(26, 35, 126, 0.3)', transition: 'background 0.2s'
                }}>
                {loading ? 'Processing...' : 'Register Tourist Profile'}
              </button>
            </form>
          ) : result.success ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>✅</div>
              <h3 style={{ color: '#43a047', fontSize: '22px', margin: '0 0 10px 0' }}>Registration Successful</h3>
              <p style={{ color: '#666', marginBottom: '25px' }}>Your profile has been securely recorded.</p>
              
              <div style={{ 
                backgroundColor: '#f8f9fa', border: '2px dashed #1a237e', 
                borderRadius: '12px', padding: '25px', marginBottom: '20px' 
              }}>
                <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666', fontWeight: '600', textTransform: 'uppercase' }}>Your Official Digital ID</p>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#1a237e', letterSpacing: '3px' }}>
                  {result.digitalId}
                </div>
              </div>

              {/* Safety Score Card */}
              <div style={{ backgroundColor: '#e8f5e9', borderRadius: '12px', padding: '20px', marginBottom: '20px', border: '1px solid #c8e6c9', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontWeight: 'bold', color: '#2e7d32', fontSize: '16px' }}>Safety Score</span>
                  <span style={{ fontWeight: 'bold', color: '#2e7d32', fontSize: '16px' }}>100/100</span>
                </div>
                <div style={{ width: '100%', backgroundColor: '#c8e6c9', borderRadius: '10px', height: '10px', overflow: 'hidden' }}>
                  <div style={{ width: '100%', backgroundColor: '#43a047', height: '10px', borderRadius: '10px' }}></div>
                </div>
                <ul style={{ margin: '15px 0 0 0', paddingLeft: '20px', color: '#1b5e20', fontSize: '13px', lineHeight: '1.5' }}>
                  <li>Keep location services enabled at all times.</li>
                  <li>Do not travel in restricted zones after 6 PM.</li>
                  <li>Save local emergency numbers.</li>
                </ul>
              </div>
              
              <p style={{ color: '#e53935', fontSize: '13px', fontWeight: '600', backgroundColor: '#ffebee', padding: '10px', borderRadius: '6px' }}>
                ⚠️ Save this ID securely. You will need it to trigger emergency SOS alerts.
              </p>
              
              <button onClick={() => setResult(null)}
                style={{ marginTop: '25px', padding: '12px 30px', backgroundColor: '#f5f5f5', color: '#333', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                Register Another Tourist
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>❌</div>
              <h3 style={{ color: '#e53935' }}>Registration Failed</h3>
              <p style={{ color: '#666' }}>{result.message}</p>
              <button onClick={() => setResult(null)} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Try Again</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '600',
  color: '#555',
  marginBottom: '8px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

export default Register;
