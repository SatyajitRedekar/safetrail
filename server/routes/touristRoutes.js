const express = require('express');
const router = express.Router();
const { registerTourist, getTourists, getTouristByDigitalId, updatePing, runAnomalyEngine, deleteTourist } = require('../controllers/touristController');

router.post('/register', registerTourist);
router.post('/analyze', runAnomalyEngine);
router.get('/', getTourists);
router.get('/:digitalId', getTouristByDigitalId);
router.put('/:digitalId/ping', updatePing);
router.delete('/:id', deleteTourist);

module.exports = router;
