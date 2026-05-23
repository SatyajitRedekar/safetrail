import React, { useState } from 'react';
import axios from 'axios';
import { useToast } from '../components/Toast';
import Spinner from '../components/Spinner';

function Register() {
  const { addToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', phone: '', passport: '', emergencyContact: '', riskZone: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const riskZones = {
    'Coastal Areas': 'High tide & cyclone risks. Keep location active and heed local weather warnings.',
    'Mountain Ranges': 'High altitude area. Risk of AMS and sudden weather changes. Ensure proper acclimatization.',
    'Forest Reserves': 'Wildlife area. Travel restricted after sunset. Follow designated trails only.',
    'Urban Centers': 'High traffic & crowd density. Keep belongings secure and save emergency contacts.'
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/tourists/register', form);
      setResult(res.data);
      addToast('Tourist successfully registered!', 'success');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Registration failed';
      setResult({ success: false, message: errMsg });
      addToast(errMsg, 'error');
    }
    setLoading(false);
  };

  const inputStyle = { 
    width: '100%', padding: '16px', marginBottom: '20px', fontSize: '15px', 
    borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxSizing: 'border-box',
    backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', transition: 'all 0.3s ease', outline: 'none'
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: '"Inter", sans-serif', backgroundColor: '#0f172a' }}>
      
      {/* Left Panel - Hero Image */}
      <div style={{ flex: 1, display: 'block', position: 'relative', overflow: 'hidden', backgroundColor: '#0f172a' }}>
        <img 
          src="/hero_register.png" 
          alt="Travel Destination"
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6)' }}
        />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to right, rgba(15, 23, 42, 0.9), transparent)' }}></div>
        <div style={{ position: 'absolute', bottom: '15%', left: '10%', color: 'white', maxWidth: '80%' }}>
          <h1 style={{ fontFamily: '"Outfit", sans-serif', fontSize: '56px', fontWeight: '800', margin: '0 0 15px 0', textShadow: '0 4px 15px rgba(0,0,0,0.4)', lineHeight: 1.1 }}>Explore.<br/>Securely.</h1>
          <p style={{ fontSize: '18px', opacity: 0.9, lineHeight: 1.6, textShadow: '0 2px 8px rgba(0,0,0,0.5)', maxWidth: '400px' }}>
            Your digital guardian for all of India. Register your travel profile to stay connected with local authorities instantly.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px', backgroundColor: '#020617' }}>
        <div style={{ width: '100%', maxWidth: '550px', padding: '45px', borderRadius: '24px', backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(15px)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '35px' }}>
            <h2 style={{ fontFamily: '"Outfit", sans-serif', margin: '0', fontSize: '32px', fontWeight: '700', color: 'white' }}>🛡️ Tourist Registration</h2>
            <p style={{ margin: '8px 0 0 0', color: '#94a3b8', fontSize: '15px' }}>Create your Digital ID for secure travel</p>
          </div>

          {!result ? (
            <>
              {/* Live ID Preview */}
              <div style={{ marginBottom: '35px', backgroundColor: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '20px', borderRadius: '16px', color: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <div style={{ fontFamily: '"Outfit", sans-serif', fontWeight: '700', fontSize: '18px', letterSpacing: '1px', color: '#38bdf8' }}>SAFETRAIL ID</div>
                  <div style={{ fontSize: '24px' }}>🇮🇳</div>
                </div>
                <div style={{ fontSize: '24px', fontWeight: '600', marginBottom: '5px', minHeight: '28px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {form.name || 'YOUR NAME'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#94a3b8', marginTop: '10px' }}>
                  <span>{form.phone || '+91-XXXXX-XXXXX'}</span>
                  <span>{form.passport || 'ID NUMBER'}</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} style={{ animation: 'fadeIn 0.5s ease' }}>
                <input 
                  style={{...inputStyle, border: form.name ? '1px solid #38bdf8' : inputStyle.border}} 
                  name="name" placeholder="Full Name" onChange={handleChange} required 
                  onFocus={(e) => e.target.style.border = '1px solid #38bdf8'}
                  onBlur={(e) => e.target.style.border = form.name ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.1)'}
                />
                <input 
                  style={{...inputStyle, border: form.email ? '1px solid #38bdf8' : inputStyle.border}} 
                  name="email" placeholder="Email Address" type="email" onChange={handleChange} required 
                  onFocus={(e) => e.target.style.border = '1px solid #38bdf8'}
                  onBlur={(e) => e.target.style.border = form.email ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.1)'}
                />
                
                <div style={{ display: 'flex', gap: '15px' }}>
                  <input 
                    style={{...inputStyle, flex: 1, border: form.phone ? '1px solid #38bdf8' : inputStyle.border}} 
                    name="phone" placeholder="Phone Number" onChange={handleChange} required 
                    onFocus={(e) => e.target.style.border = '1px solid #38bdf8'}
                    onBlur={(e) => e.target.style.border = form.phone ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.1)'}
                  />
                  <input 
                    style={{...inputStyle, flex: 1, border: form.emergencyContact ? '1px solid #38bdf8' : inputStyle.border}} 
                    name="emergencyContact" placeholder="Emergency Contact" onChange={handleChange} required 
                    onFocus={(e) => e.target.style.border = '1px solid #38bdf8'}
                    onBlur={(e) => e.target.style.border = form.emergencyContact ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.1)'}
                  />
                </div>

                <input 
                  style={{...inputStyle, border: form.passport ? '1px solid #38bdf8' : inputStyle.border}} 
                  name="passport" placeholder="Passport / Aadhaar Number" onChange={handleChange} required 
                  onFocus={(e) => e.target.style.border = '1px solid #38bdf8'}
                  onBlur={(e) => e.target.style.border = form.passport ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.1)'}
                />
                
                <select 
                  style={{...inputStyle, color: form.riskZone ? 'white' : '#94a3b8', border: form.riskZone ? '1px solid #38bdf8' : inputStyle.border}} 
                  name="riskZone" onChange={handleChange} required
                  onFocus={(e) => e.target.style.border = '1px solid #38bdf8'}
                  onBlur={(e) => e.target.style.border = form.riskZone ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.1)'}
                >
                  <option value="" style={{ color: 'black' }}>Select Primary Travel Destination</option>
                  {Object.keys(riskZones).map(zone => (
                    <option key={zone} value={zone} style={{ color: 'black' }}>{zone}</option>
                  ))}
                </select>

                {form.riskZone && (
                  <div style={{ animation: 'slideDown 0.3s ease', backgroundColor: 'rgba(34, 197, 94, 0.1)', borderLeft: '4px solid #22c55e', padding: '16px', borderRadius: '10px', marginBottom: '25px', fontSize: '14px', color: '#4ade80', lineHeight: 1.6 }}>
                    <strong>Safety Tip for {form.riskZone}:</strong><br/>
                    <span style={{ color: '#cbd5e1' }}>{riskZones[form.riskZone]}</span>
                  </div>
                )}

                <button type="submit" disabled={loading}
                  style={{ 
                    width: '100%', padding: '16px', background: 'linear-gradient(135deg, #0ea5e9, #2563eb)', color: 'white', 
                    border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', 
                    cursor: loading ? 'not-allowed' : 'pointer', marginTop: '10px',
                    boxShadow: '0 8px 20px rgba(14, 165, 233, 0.3)', transition: 'transform 0.2s, box-shadow 0.2s',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px',
                    fontFamily: '"Outfit", sans-serif', letterSpacing: '1px'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(14, 165, 233, 0.4)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(14, 165, 233, 0.3)'; }}
                >
                  {loading ? <><Spinner size={20} /> PROCESSING...</> : 'GENERATE DIGITAL ID'}
                </button>
              </form>
            </>
          ) : result.digitalId ? (
            <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease', color: 'white' }}>
              <div style={{ fontSize: '64px', marginBottom: '20px', animation: 'pulseGlow 2s infinite', borderRadius: '50%', display: 'inline-block', filter: 'drop-shadow(0 0 20px rgba(34, 197, 94, 0.5))' }}>✅</div>
              <h3 style={{ color: '#4ade80', fontSize: '28px', margin: '0 0 10px 0', fontFamily: '"Outfit", sans-serif', letterSpacing: '1px' }}>Registration Successful</h3>
              <p style={{ color: '#94a3b8', marginBottom: '35px', fontSize: '15px' }}>Your profile has been securely recorded.</p>
              
              <div style={{ marginBottom: '35px', textAlign: 'left', backgroundColor: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '25px', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div style={{ fontFamily: '"Outfit", sans-serif', fontWeight: '700', fontSize: '18px', letterSpacing: '1px', color: '#38bdf8' }}>OFFICIAL SAFETRAIL ID</div>
                </div>
                <div style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '4px', marginBottom: '15px', fontFamily: 'monospace', textShadow: '0 0 10px rgba(56, 189, 248, 0.5)' }}>
                  {result.digitalId}
                </div>
                <div style={{ fontSize: '14px', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Name: {form.name}
                </div>
              </div>

              <button onClick={() => {setResult(null); setForm({ name: '', email: '', phone: '', passport: '', emergencyContact: '', riskZone: '' });}}
                style={{ 
                  width: '100%', padding: '16px', backgroundColor: 'transparent', color: '#38bdf8', 
                  border: '1px solid rgba(56, 189, 248, 0.5)', borderRadius: '12px', cursor: 'pointer', 
                  fontWeight: '700', transition: 'background 0.2s', fontFamily: '"Outfit", sans-serif', letterSpacing: '1px' 
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.1)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                REGISTER ANOTHER TOURIST
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease', padding: '30px 20px', color: 'white' }}>
              <div style={{ fontSize: '64px', marginBottom: '20px', filter: 'drop-shadow(0 0 20px rgba(239, 68, 68, 0.5))' }}>❌</div>
              <h3 style={{ color: '#fca5a5', fontFamily: '"Outfit", sans-serif', fontSize: '28px', letterSpacing: '1px' }}>Registration Failed</h3>
              <p style={{ color: '#94a3b8', lineHeight: 1.6, marginTop: '15px' }}>{result.message}</p>
              <button onClick={() => setResult(null)} 
                style={{ marginTop: '30px', padding: '16px 30px', background: 'linear-gradient(135deg, #ef4444, #991b1b)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', letterSpacing: '1px', boxShadow: '0 8px 20px rgba(239, 68, 68, 0.3)' }}
              >
                TRY AGAIN
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Register;
