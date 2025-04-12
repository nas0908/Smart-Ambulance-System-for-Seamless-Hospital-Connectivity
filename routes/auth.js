const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const authUtils = require('../utils/authUtils');
const Ambulance = require('../models/ambulance');
const Hospital = require('../models/hospital');

// Login route
router.post('/login', async (req, res) => {
  const { username, password, userType } = req.body;

  if (!username || !password || !userType) {
    return res.status(400).json({ message: 'Missing credentials or user type' });
  }

  let user = null;
  let role = null;

  if (userType === 'ambulance') {
    // user = await Ambulance.findByUsername(username);
    // role = 'ambulance';
    // Hardcoded admin credentials (for simplicity, avoid in production)
    if (username === 'admin' && password === '123') {
      const adminUser = { id: 'admin', username: 'admin' };
      const token = authUtils.generateToken({ ...adminUser, role: 'admin' });
      return res.json({ message: 'Login successful!', token: token, role: 'ambulance' });
    } else {
      return res.status(401).json({ message: 'Invalid ambulance credentials' });
    }
  } else if (userType === 'hospital') {
    // user = await Hospital.findByUsername(username);
    // role = 'hospital';
    // Hardcoded admin credentials (for simplicity, avoid in production)
    if (username === 'admin' && password === '123') {
      const adminUser = { id: 'admin', username: 'admin' };
      const token = authUtils.generateToken({ ...adminUser, role: 'admin' });
      return res.json({ message: 'Login successful!', token: token, role: 'hospital' });
    } else {
      return res.status(401).json({ message: 'Invalid hospital credentials' });
    }
  } else if (userType === 'admin') {
    // Hardcoded admin credentials (for simplicity, avoid in production)
    if (username === 'admin' && password === '123') {
      const adminUser = { id: 'admin', username: 'admin' };
      const token = authUtils.generateToken({ ...adminUser, role: 'admin' });
      return res.json({ message: 'Login successful!', token: token, role: 'admin' });
    } else {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }
  } else {
    return res.status(400).json({ message: 'Invalid user type' });
  }

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate a JWT token
  const token = authUtils.generateToken({ ...user, role: role });

  res.json({ message: 'Login successful!', token: token, role: role });
});

// Registration route (optional, for ambulance and hospital)
router.post('/register', async (req, res) => {
  const { username, password, userType, ...additionalData } = req.body;

  if (!username || !password || !userType) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    let result;

    if (userType === 'ambulance') {
      result = await Ambulance.create(username, hashedPassword, additionalData.licenseNumber);
    } else if (userType === 'hospital') {
      result = await Hospital.create(username, hashedPassword, additionalData.hospitalName);
    } else {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Username already exists' });
    }
    res.status(500).json({ message: 'Registration failed' });
  }
});

module.exports = router;
