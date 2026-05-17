const Alert = require('../models/Alert');

exports.createAlert = async (req, res) => {
  try {
    const { touristId, location } = req.body;
    const alert = new Alert({ touristId, location });
    await alert.save();

    const populatedAlert = await Alert.findById(alert._id).populate('touristId');

    if (req.io) {
      req.io.emit('newAlert', populatedAlert);
    }

    res.status(201).json(populatedAlert);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find().populate('touristId').sort('-createdAt');
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
