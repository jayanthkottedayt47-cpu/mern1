const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // standard usually uses bcryptjs, but bcrypt is fine too. 
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// --- HELPER FUNCTIONS ---

// robust token signing options
const getJwtOptions = () => {
  // Priority 1: Environment Variable
  // Priority 2: Hardcoded Fallback (Prevents 500 Crash)
  const expiresIn = process.env.JWT_EXPIRE || process.env.JWT_EXPIRES_IN || '7d';
  return { expiresIn };
};

// --- ROUTES ---

// @route   POST api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    // 2. Check for existing user
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 5. Sign Token (Safe Method)
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod', // Fallback for dev only
      getJwtOptions()
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    // 2. Check for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 3. Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 4. Sign Token (Safe Method)
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod',
      getJwtOptions()
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   GET api/auth/me
// @desc    Get user data
// @access  Private (Requires Middleware)
router.get('/me', async (req, res) => {
  // This route assumes you have an auth middleware extracting the user ID
  // If you need the middleware code, let me know.
  res.status(200).json({ message: 'User data route' }); 
});

module.exports = router;
