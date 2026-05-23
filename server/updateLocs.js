const mongoose = require('mongoose');
const Tourist = require('./models/Tourist');
const Alert = require('./models/Alert');

mongoose.connect('mongodb+srv://satyajit:safetrail123@cluster0.seztmft.mongodb.net/safetrail?appName=Cluster0')
  .then(async () => {
    const tourists = await Tourist.find({});
    for (let t of tourists) {
      if (!t.location || !t.location.latitude) {
        await Tourist.updateOne({ _id: t._id }, { $set: { location: { latitude: 19 + (Math.random() * 10 - 5), longitude: 75 + (Math.random() * 10 - 5) } } });
      }
    }
    const alerts = await Alert.find({});
    for (let a of alerts) {
      if (!a.location || !a.location.latitude) {
        await Alert.updateOne({ _id: a._id }, { $set: { location: { latitude: 19 + (Math.random() * 10 - 5), longitude: 75 + (Math.random() * 10 - 5) } } });
      }
    }
    console.log('Random locations assigned!');
    process.exit(0);
  }).catch(console.error);
