const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Please login before continuing.' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'travelmate_dev_secret_change_me');
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found. Please login again.' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Session expired. Please login again.' });
  }
}

module.exports = { protect };
