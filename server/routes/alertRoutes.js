const express = require('express');
const router = express.Router();
const { createAlert, getAlerts, deleteAlert } = require('../controllers/alertController');

router.post('/panic', createAlert);
router.get('/', getAlerts);
router.delete('/:id', deleteAlert);

module.exports = router;
