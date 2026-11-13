const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// POST /api/admin/login
exports.login = async (req, res, next) => {
  try {
    const username = String(req.body.username || '').trim();
    const password = String(req.body.password || '');

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const admin = await Admin.findOne({ username });
    // Same message for both cases so attackers cannot tell which one was wrong
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });

    res.json({ token, admin: { id: admin._id, username: admin.username } });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/profile (protected)
exports.profile = (req, res) => {
  res.json({ id: req.admin._id, username: req.admin.username, createdAt: req.admin.createdAt });
};
