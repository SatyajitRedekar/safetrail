const express = require('express');
const router = express.Router();
const { createZone, getZones, deleteZone } = require('../controllers/zoneController');

router.post('/', createZone);
router.get('/', getZones);
router.delete('/:id', deleteZone);

module.exports = router;
