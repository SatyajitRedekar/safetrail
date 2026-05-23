import React, { useState } from 'react';
import axios from 'axios';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your SafeTrail AI Guide. How can I help you stay safe today?", isBot: true }
  ]);
  const [input, setInput] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
    setInput('');

    // Call Real AI Backend
    try {
      const response = await axios.post(
        'http://localhost:5000/api/chat',
        { message: userMsg }
      );
      const reply = response.data.reply;
      setMessages(prev => [...prev, { text: reply, isBot: true }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: "Connection error. Please try again later.", isBot: true }]);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#0ea5e9',
          color: 'white',
          fontSize: '28px',
          border: 'none',
          boxShadow: '0 10px 25px rgba(14, 165, 233, 0.4)',
          cursor: 'pointer',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s',
          fontFamily: '"Outfit", sans-serif'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="glassmorphism" style={{
          position: 'fixed',
          bottom: '100px',
          right: '30px',
          width: '340px',
          height: '450px',
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(15px)',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.1)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          fontFamily: '"Inter", sans-serif'
        }}>
          {/* Header */}
          <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', color: 'white', padding: '18px 20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: '24px' }}>🤖</span> 
            <span style={{ fontFamily: '"Outfit", sans-serif', letterSpacing: '1px', fontSize: '18px' }}>AI Safety Guide</span>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.isBot ? 'flex-start' : 'flex-end',
                backgroundColor: msg.isBot ? 'rgba(255,255,255,0.1)' : '#0ea5e9',
                color: 'white',
                padding: '12px 16px',
                borderRadius: '16px',
                borderBottomLeftRadius: msg.isBot ? '0' : '16px',
                borderBottomRightRadius: msg.isBot ? '16px' : '0',
                maxWidth: '80%',
                fontSize: '14px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                lineHeight: 1.5
              }}>
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} style={{ display: 'flex', borderTop: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(0,0,0,0.2)', padding: '10px' }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about safety..."
              style={{ flex: 1, padding: '12px 15px', border: 'none', outline: 'none', fontSize: '14px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', borderRadius: '12px' }}
            />
            <button type="submit" style={{ padding: '0 20px', backgroundColor: 'transparent', border: 'none', color: '#38bdf8', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default Chatbot;
