const mongoose = require('mongoose');

const touristSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  emergencyContact: { type: String, required: true },
  location: {
    lat: { type: Number },
    lng: { type: Number }
  }
}, { timestamps: true });

module.exports = mongoose.model('Tourist', touristSchema);
