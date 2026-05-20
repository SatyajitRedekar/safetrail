const express = require('express');
const router = express.Router();

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `You are SafeTrail AI, a tourist safety assistant for Northeast India. Answer briefly: ${message}` }]
          }]
        })
      }
    );
    const data = await response.json();
    const reply = data.candidates[0].content.parts[0].text;
    res.json({ success: true, reply });
  } catch (error) {
    res.status(500).json({ success: false, reply: 'AI service unavailable.' });
  }
});

module.exports = router;
