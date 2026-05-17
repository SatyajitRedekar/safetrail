import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';

function Navbar() {
  const { language, setLanguage } = useLanguage();

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backgroundColor: '#1a237e',
      color: 'white',
      padding: '15px 30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      fontFamily: '"Inter", "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '24px' }}>🛡️</span>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', letterSpacing: '1px' }}>SafeTrail</h2>
      </div>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/" style={linkStyle}>Home</Link>
        <Link to="/register" style={linkStyle}>Register</Link>
        <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
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
          <option value="Bengali" style={{ color: 'black' }}>বাংলা</option>
          <option value="Assamese" style={{ color: 'black' }}>অসমীয়া</option>
        </select>
      </div>
    </nav>
  );
}

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  fontSize: '15px',
  fontWeight: '500',
  transition: 'opacity 0.2s'
};

export default Navbar;
