const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Simple hardcoded auth for prototype
  if (username === 'admin' && password === 'safetrail2026') {
    // Return a dummy token
    res.json({ success: true, token: 'st_admin_token_98765xyz' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid police dispatch credentials' });
  }
});

router.post('/broadcast', (req, res) => {
  const { message, severity } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });
  
  // Broadcast to all connected clients
  req.io.emit('emergency_broadcast', { message, severity, timestamp: new Date() });
  
  res.json({ success: true, message: 'Broadcast sent successfully' });
});

module.exports = router;
