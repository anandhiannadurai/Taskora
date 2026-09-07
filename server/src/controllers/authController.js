const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');
const { JWT_SECRET } = require('../middleware/authMiddleware');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const existing = await query('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existing && existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role || 'Developer';
    const avatar = `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`;

    const result = await query(
      `INSERT INTO users (name, email, password, role, avatar, title, bio) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email.toLowerCase().trim(), hashedPassword, userRole, avatar, `${userRole} Engineer`, 'Taskora platform builder']
    );

    const user = { id: result.id, name, email: email.toLowerCase().trim(), role: userRole, avatar };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ success: true, message: 'Account created successfully', token, user });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const users = await query('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (!users || users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      theme: user.theme
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.json({ success: true, message: 'Login successful', token, user: payload });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

exports.demoLogin = async (req, res) => {
  try {
    const { role } = req.body;
    const targetRole = role || 'Admin';

    const users = await query('SELECT * FROM users WHERE role = ? LIMIT 1', [targetRole]);
    let user = users && users.length > 0 ? users[0] : null;

    if (!user) {
      const allUsers = await query('SELECT * FROM users LIMIT 1');
      if (allUsers && allUsers.length > 0) {
        user = allUsers[0];
      } else {
        return res.status(404).json({ success: false, message: 'No demo users found' });
      }
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      theme: user.theme
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, message: `Logged in as ${user.name} (${user.role})`, token, user: payload });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Demo login error' });
  }
};

exports.me = async (req, res) => {
  try {
    const users = await query('SELECT id, name, email, role, avatar, title, bio, theme FROM users WHERE id = ?', [req.user.id]);
    if (!users || users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user: users[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch me' });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  res.json({ success: true, message: `Reset link dispatched to ${email}` });
};
