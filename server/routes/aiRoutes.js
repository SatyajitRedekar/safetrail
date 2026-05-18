const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini SDK (If key is present)
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

router.post('/chat', async (req, res) => {
  const { message, history, userLocation } = req.body;
  
  // 1. If no API key is provided, use a smart fallback system
  if (!genAI) {
    let botResponse = "I am operating in offline simulation mode (No Gemini API Key found in .env). Remember to always follow local police guidelines.";
    const lower = message.toLowerCase();
    
    if (lower.includes('weather') || lower.includes('rain')) {
      botResponse = "The weather can change quickly in hilly regions. Please check the Live Weather section on your dashboard for real-time alerts.";
    } else if (lower.includes('safe') || lower.includes('danger')) {
      botResponse = "If you feel unsafe, please use the Emergency SOS button immediately. Otherwise, stick to verified tourist routes.";
    } else if (lower.includes('hospital') || lower.includes('police')) {
      botResponse = "You can find nearby emergency services by pressing the SOS button or checking the Live Explorer map. The general emergency number is 112.";
    } else if (lower.includes('hello') || lower.includes('hi')) {
      botResponse = "Hello! Stay safe and enjoy your journey with SafeTrail. How can I assist you?";
    }

    return setTimeout(() => res.json({ response: botResponse }), 1000); // Simulate network delay
  }

  // 2. Real Gemini AI Integration
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Construct a highly contextual prompt
    const systemPrompt = `You are the SafeTrail AI Assistant, an official government tourist safety guide for India. 
    Be concise, helpful, and prioritize safety. If they ask about emergencies, tell them to use the SOS button or call 112. 
    The user's current GPS location context is: ${userLocation || 'Unknown'}.
    Keep responses under 3 sentences.`;

    const fullPrompt = `${systemPrompt}\n\nUser: ${message}\nAssistant:`;

    const result = await model.generateContent(fullPrompt);
    const responseText = result.response.text();
    
    res.json({ response: responseText });
  } catch (error) {
    console.error("Gemini AI Error:", error);
    res.status(500).json({ response: "I'm having trouble connecting to the AI network right now. Please rely on standard safety protocols." });
  }
});

module.exports = router;
