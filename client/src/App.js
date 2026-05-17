import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import Panic from './pages/Panic';
import Dashboard from './pages/Dashboard';
import './App.css';

const Home = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f0f2f5' }}>
      <h1 style={{ marginBottom: '40px', color: '#333', fontSize: '36px' }}>SafeTrail App</h1>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link to="/register" style={{ textDecoration: 'none' }}>
          <div style={btnStyle} style={{ ...btnStyle, background: '#007bff' }}>📝 Tourist Register</div>
        </Link>
        <Link to="/panic" style={{ textDecoration: 'none' }}>
          <div style={btnStyle} style={{ ...btnStyle, background: '#ff4d4d' }}>🚨 SOS Panic Button</div>
        </Link>
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <div style={btnStyle} style={{ ...btnStyle, background: '#333' }}>👮 Police Dashboard</div>
        </Link>
      </div>
    </div>
  );
};

const btnStyle = {
  padding: '20px 40px',
  color: 'white',
  fontSize: '20px',
  fontWeight: 'bold',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  cursor: 'pointer',
  transition: 'transform 0.2s',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/panic" element={<Panic />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
