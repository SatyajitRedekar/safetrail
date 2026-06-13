import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Panic from './pages/Panic';
import Visit from './pages/Visit';
import { LanguageProvider } from './LanguageContext';
import { AuthProvider } from './AuthContext';
import { ToastProvider } from './components/Toast';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import BroadcastBanner from './components/BroadcastBanner';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ToastProvider>
          <BroadcastBanner />
          <Router>
            <Navbar />
            <Chatbot />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/panic" element={<Panic />} />
              <Route path="/visit" element={<Visit />} />
            </Routes>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
