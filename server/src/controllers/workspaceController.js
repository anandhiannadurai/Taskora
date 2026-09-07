const { query } = require('../config/db');

exports.getWorkspaces = async (req, res) => {
  try {
    const { status, priority, search } = req.query;
    let sql = 'SELECT w.*, u.name as creator_name, u.avatar as creator_avatar FROM workspaces w LEFT JOIN users u ON w.created_by = u.id WHERE 1=1';
    const params = [];

    if (status && status !== 'All') {
      sql += ' AND w.status = ?';
      params.push(status);
    }
    if (priority && priority !== 'All') {
      sql += ' AND w.priority = ?';
      params.push(priority);
    }
    if (search) {
      sql += ' AND (w.name LIKE ? OR w.description LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term);
    }

    sql += ' ORDER BY w.id DESC';

    const workspaces = await query(sql, params);

    // Compute progress & active items count for each workspace
    const enriched = await Promise.all(
      workspaces.map(async (ws) => {
        const items = await query('SELECT status FROM work_items WHERE workspace_id = ?', [ws.id]);
        const total = items.length;
        const done = items.filter((i) => i.status === 'Completed').length;
        const progress = total > 0 ? Math.round((done / total) * 100) : (ws.status === 'Delivered' ? 100 : ws.status === 'Testing' ? 80 : ws.status === 'Building' ? 45 : 15);

        return {
          ...ws,
          total_items: total,
          completed_items: done,
          progress
        };
      })
    );

    res.json({ success: true, count: enriched.length, workspaces: enriched });
  } catch (err) {
    console.error('Get workspaces error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch workspaces' });
  }
};

exports.createWorkspace = async (req, res) => {
  try {
    const { name, description, priority, status, start_date, end_date } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Workspace name is required' });
    }

    const wsStatus = status || 'Building';
    const wsPriority = priority || 'Medium';
    const createdBy = req.user.id;

    const result = await query(
      `INSERT INTO workspaces (name, description, priority, status, start_date, end_date, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, description || '', wsPriority, wsStatus, start_date || '2026-09-01', end_date || '2026-11-30', createdBy]
    );

    // Log activity
    await query(
      `INSERT INTO activity_logs (user_id, user_name, user_avatar, action, target)
       VALUES (?, ?, ?, ?, ?)`,
      [req.user.id, req.user.name, req.user.avatar, 'created workspace', name]
    );

    const newWs = {
      id: result.id,
      name,
      description,
      priority: wsPriority,
      status: wsStatus,
      start_date: start_date || '2026-09-01',
      end_date: end_date || '2026-11-30',
      created_by: createdBy,
      total_items: 0,
      completed_items: 0,
      progress: 0
    };

    res.status(201).json({ success: true, message: 'Workspace created', workspace: newWs });
  } catch (err) {
    console.error('Create workspace error:', err);
    res.status(500).json({ success: false, message: 'Failed to create workspace' });
  }
};

exports.updateWorkspace = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, priority, status, start_date, end_date } = req.body;

    const existing = await query('SELECT * FROM workspaces WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Workspace not found' });
    }

    const cur = existing[0];
    await query(
      `UPDATE workspaces
       SET name = ?, description = ?, priority = ?, status = ?, start_date = ?, end_date = ?
       WHERE id = ?`,
      [
        name || cur.name,
        description !== undefined ? description : cur.description,
        priority || cur.priority,
        status || cur.status,
        start_date || cur.start_date,
        end_date || cur.end_date,
        id
      ]
    );

    // Log activity
    await query(
      `INSERT INTO activity_logs (user_id, user_name, user_avatar, action, target)
       VALUES (?, ?, ?, ?, ?)`,
      [req.user.id, req.user.name, req.user.avatar, 'updated workspace', name || cur.name]
    );

    const updated = await query('SELECT * FROM workspaces WHERE id = ?', [id]);
    res.json({ success: true, message: 'Workspace updated', workspace: updated[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update workspace' });
  }
};

exports.deleteWorkspace = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await query('SELECT * FROM workspaces WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Workspace not found' });
    }

    await query('DELETE FROM work_items WHERE workspace_id = ?', [id]);
    await query('DELETE FROM workspaces WHERE id = ?', [id]);

    // Log activity
    await query(
      `INSERT INTO activity_logs (user_id, user_name, user_avatar, action, target)
       VALUES (?, ?, ?, ?, ?)`,
      [req.user.id, req.user.name, req.user.avatar, 'deleted workspace', existing[0].name]
    );

    res.json({ success: true, message: 'Workspace deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete workspace' });
  }
};
