import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import Panic from './pages/Panic';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <nav style={{ padding: '20px', background: '#333', color: 'white', marginBottom: '20px' }}>
          <Link to="/" style={{ color: 'white', marginRight: '15px' }}>Register</Link>
          <Link to="/panic" style={{ color: 'white', marginRight: '15px' }}>Panic Button</Link>
          <Link to="/dashboard" style={{ color: 'white' }}>Police Dashboard</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/panic" element={<Panic />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
