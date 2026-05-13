const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'dev-secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });

const sanitize = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  createdAt: user.createdAt,
});

const ensureDbReady = (res) => {
  if (mongoose.connection.readyState !== 1) {
    res
      .status(503)
      .json({
        message:
          'Auth unavailable — database is not connected. Set MONGO_URI in backend/.env.',
      });
    return false;
  }
  return true;
};

const register = async (req, res) => {
  if (!ensureDbReady(res)) return;
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: 'Name, email and password are required' });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res
        .status(409)
        .json({ message: 'An account already exists for that email' });
    }
    const user = await User.create({ name, email, password, phone });
    const token = signToken(user._id);
    res.status(201).json({ user: sanitize(user), token });
  } catch (err) {
    res
      .status(400)
      .json({ message: err.message || 'Unable to register account' });
  }
};

const login = async (req, res) => {
  if (!ensureDbReady(res)) return;
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password',
    );
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = signToken(user._id);
    res.json({ user: sanitize(user), token });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Login failed' });
  }
};

const me = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Not authorized' });
  res.json({ user: sanitize(req.user) });
};

const updateMe = async (req, res) => {
  if (!ensureDbReady(res)) return;
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (typeof name === 'string' && name.trim()) user.name = name.trim();
    if (typeof phone === 'string') user.phone = phone.trim();
    await user.save();
    res.json({ user: sanitize(user) });
  } catch (err) {
    res.status(400).json({ message: err.message || 'Update failed' });
  }
};

module.exports = { register, login, me, updateMe };
