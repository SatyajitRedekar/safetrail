const crypto = require('crypto');
const Tourist = require('../models/Tourist');

exports.registerTourist = async (req, res) => {
  try {
    const { name, email, phone, passport, emergencyContact, riskZone, location } = req.body;
    
    // Generate unique digital ID (e.g. ST-A1B2C3)
    const digitalId = 'ST-' + crypto.randomBytes(3).toString('hex').toUpperCase();

    const tourist = new Tourist({ 
      digitalId, name, email, phone, passport, emergencyContact, riskZone, location 
    });
    await tourist.save();
    res.status(201).json(tourist);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}`, error: error.message });
  }
};

exports.getTourists = async (req, res) => {
  try {
    const tourists = await Tourist.find();
    res.json(tourists);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getTouristByDigitalId = async (req, res) => {
  try {
    const { digitalId } = req.params;
    const tourist = await Tourist.findOne({ digitalId: digitalId.toUpperCase() });
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }
    res.json(tourist);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
