import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';

function Navbar() {
  const { language, setLanguage } = useLanguage();

  return (
    <nav style={{
      position: 'absolute',
      top: 0, left: 0, right: 0,
      zIndex: 1000,
      backgroundColor: 'rgba(15, 23, 42, 0.5)',
      backdropFilter: 'blur(10px)',
      color: 'white',
      padding: '20px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      fontFamily: '"Outfit", sans-serif'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '28px', filter: 'drop-shadow(0 0 10px rgba(56, 189, 248, 0.5))' }}>🛡️</span>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', letterSpacing: '2px' }}>SAFETRAVEL</h2>
      </div>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/" style={linkStyle}>Home</Link>
        <Link to="/visit" style={linkStyle}>Visit</Link>
        <Link to="/register" style={linkStyle}>Profile</Link>
        <Link to="/panic" style={{ ...linkStyle, color: '#ff5252', fontWeight: 'bold' }}>Emergency SOS</Link>
        
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
          style={{ 
            backgroundColor: 'rgba(255,255,255,0.1)', 
            color: 'white', 
            border: '1px solid rgba(255,255,255,0.3)', 
            borderRadius: '4px', 
            padding: '5px 10px',
            outline: 'none',
            cursor: 'pointer'
          }}>
          <option value="English" style={{ color: 'black' }}>English</option>
          <option value="Hindi" style={{ color: 'black' }}>हिन्दी</option>
          <option value="Marathi" style={{ color: 'black' }}>मराठी</option>
          <option value="Bengali" style={{ color: 'black' }}>বাংলা</option>
          <option value="Assamese" style={{ color: 'black' }}>অসমীয়া</option>
        </select>
      </div>
    </nav>
  );
}

const linkStyle = {
  color: '#e2e8f0',
  textDecoration: 'none',
  fontSize: '15px',
  fontWeight: '600',
  letterSpacing: '0.5px',
  transition: 'all 0.2s',
  fontFamily: '"Inter", sans-serif'
};

export default Navbar;
