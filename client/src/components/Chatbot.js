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
        'https://safetrail-api-1pq5.onrender.com/api/chat',
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
          backgroundColor: '#1565c0',
          color: 'white',
          fontSize: '28px',
          border: 'none',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '100px',
          right: '30px',
          width: '320px',
          height: '400px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          fontFamily: '"Inter", sans-serif'
        }}>
          {/* Header */}
          <div style={{ backgroundColor: '#1565c0', color: 'white', padding: '15px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>🤖</span> AI Safety Guide
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#f5f5f5' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.isBot ? 'flex-start' : 'flex-end',
                backgroundColor: msg.isBot ? 'white' : '#1565c0',
                color: msg.isBot ? '#333' : 'white',
                padding: '10px 14px',
                borderRadius: '12px',
                borderBottomLeftRadius: msg.isBot ? '0' : '12px',
                borderBottomRightRadius: msg.isBot ? '12px' : '0',
                maxWidth: '80%',
                fontSize: '14px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
              }}>
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} style={{ display: 'flex', borderTop: '1px solid #eee', backgroundColor: 'white' }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about safety..."
              style={{ flex: 1, padding: '15px', border: 'none', outline: 'none', fontSize: '14px' }}
            />
            <button type="submit" style={{ padding: '0 20px', backgroundColor: 'transparent', border: 'none', color: '#1565c0', fontWeight: 'bold', cursor: 'pointer' }}>
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default Chatbot;
