const express = require('express');
const router = express.Router();
const { registerTourist, getTourists, getTouristByDigitalId } = require('../controllers/touristController');

router.post('/register', registerTourist);
router.get('/', getTourists);
router.get('/:digitalId', getTouristByDigitalId);

module.exports = router;
