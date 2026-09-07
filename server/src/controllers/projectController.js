const { query } = require('../config/db');

exports.getProjects = async (req, res) => {
  try {
    const { status, priority, search } = req.query;
    let sql = 'SELECT p.*, u.name as creator_name, u.avatar as creator_avatar FROM projects p LEFT JOIN users u ON p.created_by = u.id WHERE 1=1';
    const params = [];

    if (status && status !== 'All') {
      sql += ' AND p.status = ?';
      params.push(status);
    }
    if (priority && priority !== 'All') {
      sql += ' AND p.priority = ?';
      params.push(priority);
    }
    if (search) {
      sql += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term);
    }

    sql += ' ORDER BY p.id DESC';

    const projects = await query(sql, params);

    const enriched = await Promise.all(
      projects.map(async (p) => {
        const items = await query('SELECT status FROM work_items WHERE project_id = ?', [p.id]);
        const total = items.length;
        const done = items.filter((i) => i.status === 'Completed').length;
        const progress = total > 0 ? Math.round((done / total) * 100) : (p.status === 'Delivered' ? 100 : p.status === 'Testing' ? 80 : p.status === 'Building' ? 45 : 15);

        return {
          ...p,
          total_items: total,
          completed_items: done,
          progress
        };
      })
    );

    res.json({ success: true, count: enriched.length, projects: enriched });
  } catch (err) {
    console.error('Get projects error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch projects' });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { name, description, priority, status, start_date, end_date } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Project name is required' });
    }

    const pStatus = status || 'Building';
    const pPriority = priority || 'Medium';
    const createdBy = req.user.id;

    const result = await query(
      `INSERT INTO projects (name, description, priority, status, start_date, end_date, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, description || '', pPriority, pStatus, start_date || '2026-09-01', end_date || '2026-11-30', createdBy]
    );

    await query(
      `INSERT INTO activity_logs (user_id, user_name, user_avatar, action, target)
       VALUES (?, ?, ?, ?, ?)`,
      [req.user.id, req.user.name, req.user.avatar, 'created project', name]
    );

    const newProject = {
      id: result.id,
      name,
      description,
      priority: pPriority,
      status: pStatus,
      start_date: start_date || '2026-09-01',
      end_date: end_date || '2026-11-30',
      created_by: createdBy,
      total_items: 0,
      completed_items: 0,
      progress: 0
    };

    res.status(201).json({ success: true, message: 'Project created', project: newProject });
  } catch (err) {
    console.error('Create project error:', err);
    res.status(500).json({ success: false, message: 'Failed to create project' });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, priority, status, start_date, end_date } = req.body;

    const existing = await query('SELECT * FROM projects WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const cur = existing[0];
    await query(
      `UPDATE projects
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

    await query(
      `INSERT INTO activity_logs (user_id, user_name, user_avatar, action, target)
       VALUES (?, ?, ?, ?, ?)`,
      [req.user.id, req.user.name, req.user.avatar, 'updated project', name || cur.name]
    );

    const updated = await query('SELECT * FROM projects WHERE id = ?', [id]);
    res.json({ success: true, message: 'Project updated', project: updated[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update project' });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await query('SELECT * FROM projects WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    await query('DELETE FROM work_items WHERE project_id = ?', [id]);
    await query('DELETE FROM projects WHERE id = ?', [id]);

    await query(
      `INSERT INTO activity_logs (user_id, user_name, user_avatar, action, target)
       VALUES (?, ?, ?, ?, ?)`,
      [req.user.id, req.user.name, req.user.avatar, 'deleted project', existing[0].name]
    );

    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete project' });
  }
};
