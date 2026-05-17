const Tourist = require('../models/Tourist');

exports.registerTourist = async (req, res) => {
  try {
    const { name, phone, emergencyContact, location } = req.body;
    const tourist = new Tourist({ name, phone, emergencyContact, location });
    await tourist.save();
    res.status(201).json(tourist);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
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
