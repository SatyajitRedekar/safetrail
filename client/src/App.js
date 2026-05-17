import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Panic from './pages/Panic';
import { LanguageProvider } from './LanguageContext';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/panic" element={<Panic />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
