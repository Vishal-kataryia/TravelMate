require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const travelRoutes = require('./routes/travelRoutes');
const matchingRoutes = require('./routes/matchingRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Allow the configured client URL plus any localhost/127.0.0.1 dev port.
// Vite automatically falls back to 5174/5175 when 5173 is busy, so a fixed
// origin would otherwise block API requests during local development.
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    const isLocalDev = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
    return callback(null, origin === CLIENT_URL || isLocalDev);
  }
}));
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'TravelMate API running' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/travels', travelRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/contact', contactRoutes);

app.use(notFound);
app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
