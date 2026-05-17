const express = require('express');
const router = express.Router();
const { registerTourist, getTourists } = require('../controllers/touristController');

router.post('/register', registerTourist);
router.get('/', getTourists);

module.exports = router;
