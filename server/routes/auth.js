// server/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper: get JWT options with safe fallback
const getJwtOptions = () => {
  // prefer env var, fallback to 7 days (string "7d" is valid for jsonwebtoken)
  const expires = process.env.JWT_EXPIRES_IN || '7d';
  return { expiresIn: expires };
};

// Optional: warn if secret missing (on server start you should already warn, but this helps)
if (!process.env.JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET is not set. Tokens will be signed with undefined secret (insecure). Set JWT_SECRET in environment.');
}

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // check if already exists
    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = new User({ name: String(name).trim(), email: normalizedEmail, password: hash });
    await user.save();

    // sign token (use fallback expiresIn if env not set)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'dev-secret', getJwtOptions());

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('Register error:', err && err.message ? err.message : err);
    res.status(500).json({ message: 'Server error' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'dev-secret', getJwtOptions());

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('Login error:', err && err.message ? err.message : err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
