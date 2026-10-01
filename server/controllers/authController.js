const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'travelmate_dev_secret_change_me', { expiresIn: '7d' });
}

function safeUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    foodPreference: user.foodPreference,
    seatPreference: user.seatPreference,
    createdAt: user.createdAt
  };
}

async function register(req, res, next) {
  try {
    const { name, email, phone, password, confirmPassword, foodPreference, seatPreference } = req.body;
    if (!name || !email || !phone || !password || !confirmPassword || !foodPreference || !seatPreference) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match.' });
    if (!['Vegetarian', 'Non-Vegetarian'].includes(foodPreference)) {
      return res.status(400).json({ message: 'Invalid food preference.' });
    }
    if (!['Vegetarian Only', 'Non-Vegetarian Allowed'].includes(seatPreference)) {
      return res.status(400).json({ message: 'Invalid seat preference.' });
    }
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) return res.status(400).json({ message: 'Email already registered. Please login.' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: hashed,
      foodPreference,
      seatPreference
    });
    const token = signToken(user._id);
    res.status(201).json({ token, user: safeUser(user) });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) return res.status(400).json({ message: 'Invalid email or password.' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid email or password.' });
    const token = signToken(user._id);
    const fresh = await User.findById(user._id);
    res.json({ token, user: safeUser(fresh) });
  } catch (err) {
    next(err);
  }
}

async function getProfile(req, res, next) {
  try {
    res.json({ user: safeUser(req.user) });
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const { name, phone, foodPreference, seatPreference } = req.body;
    if (name !== undefined) req.user.name = name.trim();
    if (phone !== undefined) req.user.phone = phone.trim();
    if (foodPreference !== undefined) {
      if (!['Vegetarian', 'Non-Vegetarian'].includes(foodPreference)) {
        return res.status(400).json({ message: 'Invalid food preference.' });
      }
      req.user.foodPreference = foodPreference;
    }
    if (seatPreference !== undefined) {
      if (!['Vegetarian Only', 'Non-Vegetarian Allowed'].includes(seatPreference)) {
        return res.status(400).json({ message: 'Invalid seat preference.' });
      }
      req.user.seatPreference = seatPreference;
    }
    if (!req.user.name || !req.user.phone) {
      return res.status(400).json({ message: 'Name and phone are required.' });
    }
    await req.user.save();
    res.json({ user: safeUser(req.user), message: 'Profile updated successfully.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, getProfile, updateProfile };
