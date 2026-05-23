const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const connectDB = require('./config/db');
connectDB();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
app.use(cors());
app.use(express.json());
app.use((req, res, next) => { req.io = io; next(); });
app.get('/', (req, res) => { res.json({ message: 'SafeTrail API running' }); });
const touristRoutes = require('./routes/touristRoutes');
const alertRoutes = require('./routes/alertRoutes');
const adminRoutes = require('./routes/adminRoutes');
const aiRoutes = require('./routes/aiRoutes');
const chatRoutes = require('./routes/chatRoutes');

app.use('/api/tourists', touristRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api', chatRoutes);
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('disconnect', () => console.log('User disconnected'));
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log('Server running on port ' + PORT));
// Force nodemon restart to re-establish MongoDB connection after IP whitelist
