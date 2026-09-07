const express = require('express');
const router = express.Router();
const { query } = require('../config/db');
const { authenticateToken } = require('../middleware/authMiddleware');

// GET /api/team - fetch team members with assigned task counts and performance metrics
router.get('/', authenticateToken, async (req, res) => {
  try {
    const users = await query('SELECT id, name, email, role, avatar, title, bio, created_at FROM users ORDER BY id ASC');

    const enrichedTeam = await Promise.all(
      users.map(async (user) => {
        const userTasks = await query('SELECT status FROM tasks WHERE assignee_id = ?', [user.id]);
        const total = userTasks.length;
        const completed = userTasks.filter((t) => t.status === 'Completed').length;
        const inProgress = userTasks.filter((t) => t.status === 'In Progress').length;
        const productivityScore = total > 0 ? Math.min(100, Math.round((completed / total) * 100 + 20)) : 88;

        return {
          ...user,
          active_tasks: total - completed,
          completed_tasks: completed,
          in_progress_tasks: inProgress,
          total_assigned: total,
          productivity_score: productivityScore
        };
      })
    );

    res.json({ success: true, count: enrichedTeam.length, team: enrichedTeam });
  } catch (err) {
    console.error('Fetch team error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch team members' });
  }
});

// POST /api/team/invite - add/invite new team member
router.post('/invite', authenticateToken, async (req, res) => {
  try {
    const { name, email, role, title } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }

    const existing = await query('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existing && existing.length > 0) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const userRole = role || 'Developer';
    const userTitle = title || `${userRole} Engineer`;
    const defaultPassword = '$2a$10$e7K9h9h3v10g8w9v7x7u8e3Q7h9i0j1k2l3m4n5o6p7q8r9s'; // bcrypt hashed dummy
    const avatar = `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`;

    const result = await query(
      `INSERT INTO users (name, email, password, role, title, avatar, bio) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email.toLowerCase().trim(), defaultPassword, userRole, userTitle, avatar, 'Team Member']
    );

    // Log Activity
    await query(
      `INSERT INTO activities (user_id, user_name, user_avatar, action, target)
       VALUES (?, ?, ?, ?, ?)`,
      [req.user.id, req.user.name, req.user.avatar, 'invited team member', name]
    );

    const newUser = {
      id: result.id,
      name,
      email: email.toLowerCase().trim(),
      role: userRole,
      title: userTitle,
      avatar,
      active_tasks: 0,
      completed_tasks: 0,
      productivity_score: 90
    };

    res.status(201).json({ success: true, message: 'Team member added successfully', member: newUser });
  } catch (err) {
    console.error('Invite error:', err);
    res.status(500).json({ success: false, message: 'Failed to invite team member' });
  }
});

module.exports = router;
