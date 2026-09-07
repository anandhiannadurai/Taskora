const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { query } = require('../config/db');
const { authenticateToken } = require('../middleware/authMiddleware');

// PUT /api/user/profile - update profile info
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, title, bio, avatar, theme } = req.body;
    const userId = req.user.id;

    const existing = await query('SELECT * FROM users WHERE id = ?', [userId]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await query(
      `UPDATE users SET name = ?, title = ?, bio = ?, avatar = ?, theme = ? WHERE id = ?`,
      [
        name || existing[0].name,
        title || existing[0].title,
        bio !== undefined ? bio : existing[0].bio,
        avatar || existing[0].avatar,
        theme || existing[0].theme,
        userId
      ]
    );

    const updated = await query('SELECT id, name, email, role, avatar, title, bio, theme FROM users WHERE id = ?', [userId]);
    res.json({ success: true, message: 'Profile updated successfully', user: updated[0] });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
});

// PUT /api/user/change-password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password are required' });
    }

    const existing = await query('SELECT * FROM users WHERE id = ?', [userId]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, existing[0].password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect current password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to change password' });
  }
});

module.exports = router;
