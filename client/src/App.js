import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminLogin from './pages/AdminLogin';
import Panic from './pages/Panic';
import { LanguageProvider } from './LanguageContext';
import { ToastProvider } from './components/Toast';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import BroadcastBanner from './components/BroadcastBanner';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <ToastProvider>
        <BroadcastBanner />
        <Router>
          <Navbar />
          <Chatbot />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/panic" element={<Panic />} />
          </Routes>
        </Router>
      </ToastProvider>
    </LanguageProvider>
  );
}

export default App;
