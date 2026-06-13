const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const Tourist = require('../models/Tourist');

exports.registerTourist = async (req, res) => {
  try {
    const { name, email, password, phone, passport, emergencyContact, riskZone, location } = req.body;
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Generate unique digital ID (e.g. ST-A1B2C3)
    const digitalId = 'ST-' + crypto.randomBytes(3).toString('hex').toUpperCase();

    // Generate Simulated Blockchain Hash (SHA-256)
    const rawData = `${digitalId}-${name}-${passport}-${Date.now()}-SAFETRAIL_SECRET`;
    const blockchainHash = '0x' + crypto.createHash('sha256').update(rawData).digest('hex');

    const tourist = new Tourist({ 
      digitalId, name, email, password: hashedPassword, phone, passport, emergencyContact, riskZone, location, blockchainHash 
    });
    await tourist.save();
    res.status(201).json(tourist);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}`, error: error.message });
  }
};

exports.loginTourist = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and Password are required' });
    }
    
    const tourist = await Tourist.findOne({ 
      email: email.toLowerCase()
    });
    
    if (!tourist) {
      return res.status(401).json({ message: 'Invalid credentials. Please check your Email and Password.' });
    }

    const isMatch = await bcrypt.compare(password, tourist.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials. Please check your Email and Password.' });
    }
    
    res.json(tourist);
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

exports.updatePing = async (req, res) => {
  try {
    const { digitalId } = req.params;
    const { simulatedLastPing } = req.body;
    const tourist = await Tourist.findOne({ digitalId: digitalId.toUpperCase() });
    
    if (!tourist) return res.status(404).json({ message: 'Tourist not found' });
    
    tourist.lastPing = simulatedLastPing ? new Date(simulatedLastPing) : Date.now();
    tourist.anomalyStatus = 'NORMAL'; // Reset anomaly if they ping
    await tourist.save();
    
    res.json({ message: 'Ping updated', tourist });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.runAnomalyEngine = async (req, res) => {
  try {
    const tourists = await Tourist.find();
    let flagged = [];
    const now = Date.now();
    
    for (let t of tourists) {
      if (!t.lastPing) continue;
      
      const hoursSincePing = (now - new Date(t.lastPing).getTime()) / (1000 * 60 * 60);
      let newStatus = t.anomalyStatus;
      
      if (hoursSincePing > 12) {
        newStatus = 'MISSING_SIGNAL';
      } else if (hoursSincePing > 2) {
        newStatus = 'PROLONGED_INACTIVITY';
      }
      
      if (newStatus !== t.anomalyStatus) {
        t.anomalyStatus = newStatus;
        await t.save();
      }
      
      if (t.anomalyStatus !== 'NORMAL') {
        flagged.push(t);
      }
    }
    
    res.json({ flaggedTourists: flagged });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.deleteTourist = async (req, res) => {
  try {
    const { id } = req.params;
    await Tourist.findByIdAndDelete(id);
    res.json({ message: 'Tourist deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
