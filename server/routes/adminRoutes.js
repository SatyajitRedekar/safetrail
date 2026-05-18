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

module.exports = router;
