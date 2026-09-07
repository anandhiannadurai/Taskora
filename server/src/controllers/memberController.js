const { query } = require('../config/db');

exports.getMembers = async (req, res) => {
  try {
    const users = await query('SELECT id, name, email, role, avatar, title, bio, created_at FROM users ORDER BY id ASC');

    const members = await Promise.all(
      users.map(async (u) => {
        const items = await query('SELECT status FROM work_items WHERE assigned_to = ?', [u.id]);
        const total = items.length;
        const done = items.filter((i) => i.status === 'Completed').length;
        const active = total - done;

        return {
          ...u,
          activity_status: u.id % 3 === 0 ? 'In Focus' : u.id % 2 === 0 ? 'Active' : 'Active',
          active_tasks: active,
          completed_tasks: done,
          efficiency_score: total > 0 ? Math.min(99, Math.round((done / total) * 100 + 25)) : 92
        };
      })
    );

    res.json({ success: true, count: members.length, members });
  } catch (err) {
    console.error('Get members error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch members' });
  }
};

exports.addMember = async (req, res) => {
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
    const userTitle = title || `${userRole} Specialist`;
    const defaultPass = '$2a$10$e7K9h9h3v10g8w9v7x7u8e3Q7h9i0j1k2l3m4n5o6p7q8r9s';
    const avatar = `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`;

    const result = await query(
      `INSERT INTO users (name, email, password, role, title, avatar, bio) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email.toLowerCase().trim(), defaultPass, userRole, userTitle, avatar, 'Team Member']
    );

    await query(
      `INSERT INTO activity_logs (user_id, user_name, user_avatar, action, target)
       VALUES (?, ?, ?, ?, ?)`,
      [req.user.id, req.user.name, req.user.avatar, 'added team member', name]
    );

    const newMember = {
      id: result.id,
      name,
      email: email.toLowerCase().trim(),
      role: userRole,
      title: userTitle,
      avatar,
      activity_status: 'Active',
      active_tasks: 0,
      completed_tasks: 0,
      efficiency_score: 95
    };

    res.status(201).json({ success: true, message: 'Member added successfully', member: newMember });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to add member' });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await query('SELECT * FROM users WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    await query('DELETE FROM users WHERE id = ?', [id]);

    await query(
      `INSERT INTO activity_logs (user_id, user_name, user_avatar, action, target)
       VALUES (?, ?, ?, ?, ?)`,
      [req.user.id, req.user.name, req.user.avatar, 'removed member', existing[0].name]
    );

    res.json({ success: true, message: 'Member removed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to remove member' });
  }
};
